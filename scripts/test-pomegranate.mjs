import assert from 'node:assert/strict';
import {mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL, fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import ts from 'typescript';

// A disposable SQLite database and mocked email service; no real credentials or recipients.
mkdirSync(resolve('.shop'), {recursive: true});
const dir = process.argv[2] || mkdtempSync(resolve('.shop/event-test-'));
if (!process.argv[2]) {
  const result = spawnSync(process.execPath, [fileURLToPath(import.meta.url), dir], {stdio: 'inherit'});
  rmSync(dir, {recursive: true, force: true, maxRetries: 5, retryDelay: 100});
  process.exit(result.status ?? 1);
}
process.env.SHOP_DATABASE_URL = `file:${join(dir, 'test.db').replaceAll('\\', '/')}`;
for (const key of ['SHOP_DATABASE_AUTH_TOKEN', 'TURSO_AUTH_TOKEN', 'VERCEL']) delete process.env[key];
process.env.RESEND_API_KEY = 'test-placeholder';
process.env.SHOP_EMAIL_FROM = 'farm@example.invalid';
process.env.SHOP_NOTIFY_EMAIL = 'owner@example.invalid';
for (const name of ['harvest', 'db', 'types', 'notifications', 'validation']) {
  const source = readFileSync(`lib/shop/${name}.ts`, 'utf8').replace(/from (['"])\.\/([^'"]+)\1/g, "from './$2.mjs'");
  writeFileSync(join(dir, `${name}.mjs`), ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022}}).outputText);
}
for (const name of ['pomegranate', 'csv']) {
  const source = readFileSync(`lib/events/${name}.ts`, 'utf8').replace(/from (['"])@\/lib\/shop\/([^'"]+)\1/g, "from './$2.mjs'");
  writeFileSync(join(dir, `${name}.mjs`), ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022}}).outputText);
}
const load = name => import(pathToFileURL(join(dir, `${name}.mjs`)).href);
const event = await load('pomegranate');
const {db} = await load('db');
const {flushNotifications, notificationStatus} = await load('notifications');
const {csvCell} = await load('csv');
const client = await db();
const originalFetch = global.fetch;
const realNow = Date.now;
try {
  const input = i => ({name: `Guest ${i}`, email: `guest${i}@example.invalid`, from: 'Tunis', been: 'no', requestKey: crypto.randomUUID()});
  const firstInput = input(0);
  const first = await event.requestSpot(firstInput);
  assert.equal((await event.requestSpot({...firstInput, requestKey: crypto.randomUUID()})).id, first.id);
  await assert.rejects(event.requestSpot({...input(1), website: 'bot'}));
  await assert.rejects(event.requestSpot({...input(1), email: 'invalid'}));
  await event.updateGuest({id: first.id, revision: 0, status: 'confirmed'});
  await event.saveEventSettings({open: true, capacity: 1, revision: 0});
  const waiting = await event.requestSpot(input(1));
  assert.equal(waiting.waitlist, true);
  await event.saveEventSettings({open: false, capacity: 1, revision: 1});
  await assert.rejects(event.requestSpot(input(2)), e => e.code === 'event_closed');
  await event.saveEventSettings({open: true, capacity: 200, revision: 2});
  const ids = [first.id, waiting.id];
  for (let i = 2; i < 12; i++) ids.push((await event.requestSpot(input(i))).id);
  await event.bulkStatus({ids, status: 'confirmed'});
  await client.execute('DELETE FROM shop_notifications');
  assert.equal((await event.emailGuests({ids})).queued, 12);
  assert.equal((await event.emailGuests({ids, again: true})).queued, 0, 'pending emails cannot be duplicated even by resend');
  let guests = (await event.eventAdmin()).guests;
  assert(guests.every(g => g.emailPending.confirmed && !g.emailed.confirmed), 'queued is not sent');
  // Compatibility with the old timestamp-based notification IDs.
  await client.execute({sql: "UPDATE shop_notifications SET id=? WHERE id LIKE ?", args: [`event-mail-${first.id}-confirmed-1234567890`, `event-mail-${first.id}-confirmed-%`]});
  const sent = [];
  let reject = false;
  global.fetch = async (_url, options) => {
    sent.push({message: JSON.parse(options.body), key: options.headers['Idempotency-Key']});
    return {ok: !reject, json: async () => ({id: 'mock-receipt'})};
  };
  await Promise.all([flushNotifications(), flushNotifications()]);
  assert.equal(sent.length, 12, 'one invocation drains a 12-person batch, concurrent calls do not duplicate it');
  assert.equal((await notificationStatus()).pending, 0);
  assert(sent.every(x => x.message.to.length === 1 && x.message.to[0].startsWith('guest')));
  guests = (await event.eventAdmin()).guests;
  assert(guests.every(g => g.emailed.confirmed && !g.emailPending.confirmed));
  assert.equal((await event.emailGuests({ids})).queued, 0, 'normal send does not resend accepted emails');
  assert.equal((await event.emailGuests({ids: [first.id], again: true})).queued, 1);
  reject = true;
  await flushNotifications();
  assert.equal((await notificationStatus()).pending, 1);
  assert((await event.eventAdmin()).guests.find(g => g.id === first.id).emailPending.confirmed);
  const retryKey = sent.at(-1).key;
  await client.execute('UPDATE shop_notifications SET next_attempt=0 WHERE sent_at IS NULL');
  reject = false;
  await flushNotifications();
  assert.equal(sent.at(-1).key, retryKey, 'retry retains provider idempotency key');
  assert.equal((await notificationStatus()).pending, 0);
  // Simulate the time budget being used: unfinished emails survive for the next pass.
  await event.emailGuests({ids: ids.slice(0, 3), again: true});
  let clock = realNow();
  Date.now = () => clock;
  global.fetch = async () => {clock += 9000; return {ok: true, json: async () => ({id: 'mock-receipt'})};};
  await flushNotifications();
  assert.equal((await notificationStatus()).pending, 1);
  Date.now = realNow;
  await flushNotifications();
  assert.equal((await notificationStatus()).pending, 0);
  for (const value of ['=1+1', '+SUM(A1)', '-1+1', '@SUM(A1)', '  =1+1', '\t=1+1', '\r=1+1', '\n=1+1']) {
    assert(csvCell(value).replace(/^"/, '').startsWith("'"), `formula must become text: ${JSON.stringify(value)}`);
  }
  assert.equal(csvCell('Amira'), 'Amira');
  assert.equal(csvCell('Béja; Tunis'), '"Béja; Tunis"');
  assert.equal(csvCell('A "quoted" name'), '"A ""quoted"" name"');
  assert.equal(csvCell('line\rbreak'), '"line\rbreak"');
  const formula = await event.requestSpot({...input(99), name: '=1+1'});
  assert.equal((await event.eventAdmin()).guests.find(g => g.id === formula.id).name, '=1+1', 'storage retains original text');
  console.log('PASS: signup, full/closed state, 12-recipient delivery, concurrent flush deduplication, truthful pending/accepted receipts, legacy queue IDs, failed-send retry, resend protection, deadline continuation, and safe CSV cells.');
} finally {
  Date.now = realNow;
  global.fetch = originalFetch;
  client.close();
}
