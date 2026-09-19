import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Compile into an isolated temporary folder; never touch production or send real email.
const dir = process.argv[2] || mkdtempSync(resolve('.shop/notification-test-'));
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
  for (const name of ['db', 'types', 'notifications', 'validation', 'reservations', 'service']) {
    const source = readFileSync(`lib/shop/${name}.ts`, 'utf8').replace(/from (['"])\.\/([^'"]+)\1/g, "from './$2.mjs'");
    writeFileSync(join(dir, `${name}.mjs`), ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022}}).outputText);
  }
  const load = name => import(pathToFileURL(join(dir, name + '.mjs')).href);
  const {db} = await load('db');
  const {flushNotifications, notificationStatus, orderMessage} = await load('notifications');
  const {createReservation} = await load('reservations');
  client = await db();
  const input = {firstName:'Test', lastName:'Client', phone:'22123456', email:'', governorate:'Tunis', city:'Tunis', address:'Test street', productId:'honey', variantId:'jar-250', quantity:2, requestKey:crypto.randomUUID()};
  const r = await createReservation(input);
  assert.equal((await createReservation(input)).id, r.id);
  assert.deepEqual(await notificationStatus(), {configured:false,pending:1});
  let sends = 0, payload;
  globalThis.fetch = async () => {throw Error('Must not send without configuration');};
  await flushNotifications();
  assert.equal((await notificationStatus()).pending, 1);
  process.env.RESEND_API_KEY = 'test-key';
  process.env.SHOP_EMAIL_FROM = 'test@example.com';
  process.env.SHOP_NOTIFY_EMAIL = 'owner@example.com';
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers['Idempotency-Key'], `shop-alert-${r.id}`);
    payload = JSON.parse(options.body); sends++;
    return new Response('{}', {status:503});
  };
  await flushNotifications();
  assert.equal(sends, 1);
  assert.equal((await notificationStatus()).pending, 1);
  await flushNotifications();
  assert.equal(sends, 1, 'Failed sends respect retry delay');
  await client.execute('UPDATE shop_notifications SET next_attempt=0');
  globalThis.fetch = async (url, options) => {
    sends++; payload = JSON.parse(options.body);
    return Response.json({id:'provider-receipt'});
  };
  await Promise.all([flushNotifications(), flushNotifications()]);
  assert.equal(sends, 2, 'Concurrent workers send only once');
  assert.deepEqual(payload.to, ['owner@example.com']);
  assert.match(payload.text, /2 × Le miel · 250 g/);
  assert.match(payload.text, /22123456/);
  assert.match(payload.text, /ne réserve pas automatiquement/);
  assert.equal((await notificationStatus()).pending, 0);
  await createReservation(input);
  await flushNotifications();
  assert.equal(sends, 2, 'Repeated checkout does not send another alert');
  const {createOrder} = await load('service');
  const product = JSON.parse(String((await client.execute("SELECT data FROM shop_products WHERE id='honey'")).rows[0].data));
  product.status = 'available';
  product.variants[0].price = 20000;
  product.variants[0].stock = 5;
  await client.execute({sql:'UPDATE shop_products SET data=? WHERE id=?',args:[JSON.stringify(product),product.id]});
  await client.execute({sql:'UPDATE shop_settings SET data=? WHERE id=1',args:[JSON.stringify({revision:0,acceptingOrders:true,zones:[{id:'tunis',name:'Tunis',fee:7000}]})]});
  const checkout = {customer:{name:'Test Client',phone:'22123456',address:'Test street',notes:''},zoneId:'tunis',expectedTotal:47000,items:[{productId:'honey',variantId:'jar-250',quantity:2}],requestKey:crypto.randomUUID()};
  await assert.rejects(createOrder({...checkout,expectedTotal:1}));
  assert.equal((await notificationStatus()).pending, 0, 'Rejected orders do not queue email');
  const order = await createOrder(checkout);
  assert.equal((await createOrder(checkout)).id, order.id);
  assert.equal((await notificationStatus()).pending, 1, 'One alert per accepted order');
  await flushNotifications();
  assert.equal(sends, 3);
  assert.match(payload.text, /Total : 47 DT/);
  // The message uses millimes and explicitly states COD rather than claiming payment.
  const message = orderMessage({id:'EB-TEST',customer:{name:'Client',phone:'22123456',address:'Test',notes:''},zone:'Tunis',deliveryFee:7000,total:47000,items:[{name:'Honey',label:'250 g',quantity:2,price:20000,fulfillment:'preorder',availability:'October'}]});
  assert.match(message.text, /Total : 47 DT/);
  assert.match(message.text, /Livraison : 7 DT/);
  assert.match(message.text, /aucun paiement reçu/);
  assert.match(message.subject, /précommande/);
  assert.equal(typeof createOrder, 'function');
  console.log('PASS: durable alert, duplicate submission, unconfigured sender, provider failure, retry delay, concurrent sends, recipient and COD/pre-order content. No real email sent.');
} finally {
  globalThis.fetch = originalFetch;
  client?.close();
}
