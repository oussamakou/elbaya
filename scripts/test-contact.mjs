import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Compile into an isolated temporary folder; never touch production or send real email.
const dir = process.argv[2] || mkdtempSync(resolve('.shop/contact-test-'));
if (!process.argv[2]) {
  const result = spawnSync(process.execPath, [fileURLToPath(import.meta.url), dir], {stdio:'inherit'});
  // Windows releases all native SQLite handles when the worker process exits.
  rmSync(dir, {recursive:true, force:true, maxRetries:5, retryDelay:100});
  process.exit(result.status ?? 1);
}
process.env.SHOP_DATABASE_URL = `file:${join(dir, 'test.db').replaceAll('\\', '/')}`;
delete process.env.SHOP_DATABASE_AUTH_TOKEN;
delete process.env.TURSO_AUTH_TOKEN;
delete process.env.VERCEL;
delete process.env.RESEND_API_KEY;
delete process.env.SHOP_EMAIL_FROM;
delete process.env.SHOP_NOTIFY_EMAIL;
let client;
const originalFetch = globalThis.fetch;
try {
  for (const name of ['contact', 'harvest', 'db', 'types', 'notifications', 'validation', 'reservations', 'service']) {
    const source = readFileSync(`lib/shop/${name}.ts`, 'utf8').replace(/from (['"])\.\/([^'"]+)\1/g, "from './$2.mjs'");
    writeFileSync(join(dir, `${name}.mjs`), ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022}}).outputText);
  }
  const load = name => import(pathToFileURL(join(dir, name + '.mjs')).href);
  const {db} = await load('db');
  const {createContact,contacts} = await load('contact');
  const {flushNotifications} = await load('notifications');
  client = await db();
  const input={name:'Contact Test',email:'visitor@example.com',phone:'',message:'A question about visiting the farm.',requestKey:crypto.randomUUID()};
  const contact=await createContact(input);
  assert.equal((await createContact(input)).id,contact.id);
  assert.equal((await contacts()).length,1);
  await assert.rejects(createContact({...input,message:'A different question about the farm.'}),e=>e.code==='conflict');
  for(const changes of [{name:''},{email:'wrong'},{email:'visitor@example.com\r\nBcc:spam@example.com'},{message:'short'},{message:'x'.repeat(4001)},{website:'spam'},{phone:'not-a-number'}])await assert.rejects(createContact({...input,...changes,requestKey:crypto.randomUUID()}));
  const queued=JSON.parse(String((await client.execute({sql:'SELECT data FROM shop_notifications WHERE id=?',args:[contact.id]})).rows[0].data));
  assert.equal(queued.reply_to,'visitor@example.com');assert.match(queued.text,/A question about visiting the farm/);
  process.env.RESEND_API_KEY='test';process.env.SHOP_EMAIL_FROM='farm@example.com';process.env.SHOP_NOTIFY_EMAIL='owner@example.com';
  let sent=0;
  globalThis.fetch=async (url,options)=>{sent++;const payload=JSON.parse(options.body);assert.equal(payload.reply_to,input.email);assert.deepEqual(payload.to,['owner@example.com']);return Response.json({id:'test-receipt'});};
  await flushNotifications();await flushNotifications();assert.equal(sent,1);
  assert.equal((await contacts())[0].message,input.message,'Contact is preserved in owner inbox after send');
  console.log('PASS: enquiry validation, reply-to, queued email, idempotency, provider send and preserved owner inbox. No real email.');
}finally{globalThis.fetch=originalFetch;client?.close();}
