import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Compile into an isolated temporary folder; never touch production or send real email.
const dir = process.argv[2] || mkdtempSync(resolve('.shop/harvest-test-'));
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
  for (const name of ['harvest', 'db', 'types', 'notifications', 'validation', 'reservations', 'service']) {
    const source = readFileSync(`lib/shop/${name}.ts`, 'utf8').replace(/from (['"])\.\/([^'"]+)\1/g, "from './$2.mjs'");
    writeFileSync(join(dir, `${name}.mjs`), ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022}}).outputText);
  }
  const load = name => import(pathToFileURL(join(dir, name + '.mjs')).href);
  const {db} = await load('db');
  const {harvestQuote} = await load('harvest');
  const {createReservation,updateReservation} = await load('reservations');
  const {reservationMessage} = await load('notifications');
  client = await db();
  for(const [kg,total] of [[5,25000],[10,45000],[15,67500],[20,80000],[25,100000],[500,2000000]])assert.equal(harvestQuote(kg).total,total);
  for(const kg of [0,1,6,9,11,501,NaN,Infinity])assert.throws(()=>harvestQuote(kg));
  const input={firstName:'Test',lastName:'Harvest',phone:'22123456',email:'',productId:'pomegranates',variantId:'box-3',harvestKg:10,pickup:'tunis',expectedTotal:45000,requestKey:crypto.randomUUID()};
  const r=await createReservation(input);
  assert.equal(r.size,'10 kg'); assert.equal(r.quantity,1); assert.equal(r.harvest.total,45000);assert.equal(r.harvest.pickup,'tunis');
  assert.match(r.address,/Tunis/);assert.equal((await createReservation(input)).id,r.id);
  assert.equal((await client.execute('SELECT COUNT(*) AS n FROM shop_notifications')).rows[0].n,1);
  for(const override of [{harvestKg:6},{expectedTotal:1},{pickup:'delivery'},{productId:'honey'},{harvestKg:505},{variantId:'missing'}])await assert.rejects(createReservation({...input,...override,requestKey:crypto.randomUUID()}));
  await assert.rejects(createReservation({...input,pickup:'farm'}),e=>e.code==='conflict');
  const farm=await createReservation({...input,pickup:'farm',harvestKg:5,expectedTotal:25000,requestKey:crypto.randomUUID()});
  assert.match(farm.address,/Testour/);assert.equal(farm.harvest.total,25000);
  const pending=JSON.parse(String((await client.execute({sql:'SELECT data FROM shop_notifications WHERE id=?',args:[r.id]})).rows[0].data));
  assert.match(pending.text,/45 DT/);assert.match(pending.text,/Tunis/);
  await updateReservation({...r,status:'confirmed',harvest:{...r.harvest,total:1}});
  const saved=JSON.parse(String((await client.execute({sql:'SELECT data FROM shop_reservations WHERE id=?',args:[r.id]})).rows[0].data));
  assert.equal(saved.harvest.total,45000,'Admin follow-up cannot rewrite the quoted total');
  const {saveProduct} = await load('service');
  let configProduct=JSON.parse(String((await client.execute("SELECT data FROM shop_products WHERE id='pomegranates'")).rows[0].data));
  configProduct=await saveProduct({...configProduct,harvestOffer:{enabled:true,baseUnitPrice:6000,bulkUnitPrice:5000,pickupFarm:true,pickupTunis:false}});
  await assert.rejects(createReservation({...input,expectedTotal:45000,pickup:'farm',requestKey:crypto.randomUUID()}),e=>e.code==='price_changed');
  await assert.rejects(createReservation({...input,expectedTotal:50000,requestKey:crypto.randomUUID()}),e=>e.code==='zone');
  const custom=await createReservation({...input,expectedTotal:50000,pickup:'farm',requestKey:crypto.randomUUID()});assert.equal(custom.harvest.total,50000);assert.equal(custom.harvest.unitPrice,5000);
  configProduct=await saveProduct({...configProduct,harvestOffer:{...configProduct.harvestOffer,largeUnitPrice:3500}});
  assert.equal(configProduct.harvestOffer.largeUnitPrice,3500);
  await assert.rejects(createReservation({...input,harvestKg:20,expectedTotal:90000,pickup:'farm',requestKey:crypto.randomUUID()}),e=>e.code==='price_changed');
  const large=await createReservation({...input,harvestKg:20,expectedTotal:70000,pickup:'farm',requestKey:crypto.randomUUID()});
  assert.equal(large.harvest.unitPrice,3500);assert.equal(large.harvest.total,70000);
  await assert.rejects(saveProduct({...configProduct,harvestOffer:{...configProduct.harvestOffer,largeUnitPrice:5500}}));
  configProduct=await saveProduct({...configProduct,harvestOffer:{...configProduct.harvestOffer,enabled:false}});
  await assert.rejects(createReservation({...input,expectedTotal:50000,pickup:'farm',requestKey:crypto.randomUUID()}),e=>e.code==='closed');
  await assert.rejects(saveProduct({...configProduct,harvestOffer:{...configProduct.harvestOffer,enabled:true,pickupFarm:false}}));
  await assert.rejects(saveProduct({...configProduct,harvestOffer:{...configProduct.harvestOffer,bulkUnitPrice:7000}}));
  const product=JSON.parse(String((await client.execute("SELECT data FROM shop_products WHERE id='pomegranates'")).rows[0].data));product.status='draft';
  await client.execute({sql:'UPDATE shop_products SET data=? WHERE id=?',args:[JSON.stringify(product),product.id]});
  await assert.rejects(createReservation({...input,requestKey:crypto.randomUUID()}));
  assert.equal((await client.execute('SELECT COUNT(*) AS n FROM shop_reservations')).rows[0].n,4);
  console.log('PASS: 5 kg steps, bulk price, pickup choices, price tampering, duplicate protection, email snapshot, admin persistence, draft rejection. No real email or production data.');
} finally {globalThis.fetch=originalFetch;client?.close();}
