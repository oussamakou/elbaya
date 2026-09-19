import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Compile into an isolated temporary folder; never touch production or send real email.
const dir = process.argv[2] || mkdtempSync(resolve('.shop/format-test-'));
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
  const {saveProduct, catalogue, createOrder, updateOrder} = await load('service');
  const {createReservation} = await load('reservations');
  const {orderable} = await load('types');
  client = await db();
  let product = (await catalogue(true)).products.find(p=>p.id==='honey');
  assert.equal(product.variants.length,1);
  product = await saveProduct({...product,variants:[...product.variants,{id:'extra',label:'500 g',price:20000,stock:5}]});
  product = await saveProduct({...product,variants:product.variants.slice(0,1)});
  assert.equal(product.variants.length,1,'Saved extra format can be removed');
  await assert.rejects(saveProduct({...product,variants:[]}),e=>e.code==='invalid');
  product.variants[0].price=10000;product.variants[0].stock=5;product.variants[0].preorderStock=5;
  await client.execute({sql:'UPDATE shop_settings SET data=? WHERE id=1',args:[JSON.stringify({revision:0,acceptingOrders:true,zones:[{id:'tunis',name:'Tunis',fee:0}]})]});
  const orderInput=()=>({customer:{name:'Test',phone:'22123456',address:'Test address',notes:''},zoneId:'tunis',expectedTotal:10000,items:[{productId:'honey',variantId:'jar-250',quantity:1,fulfillment:product.status==='preorder'?'preorder':'ready',availability:product.status==='preorder'?'November':''}],requestKey:crypto.randomUUID()});
  const reservationInput=()=>({firstName:'Test',lastName:'Test',phone:'22123456',email:'',governorate:'Tunis',city:'Tunis',address:'Test address',productId:'honey',variantId:'jar-250',quantity:1,requestKey:crypto.randomUUID()});
  for(const status of ['draft','seasonal','available','preorder']) {
    product=await saveProduct({...product,status,preorderNote:{fr:'November',en:''}});
    assert.equal((await catalogue()).products.some(p=>p.id===product.id),status!=='draft');
    assert.equal((await catalogue(true)).products.find(p=>p.id===product.id).status,status);
    assert.equal(orderable(product),['available','preorder'].includes(status));
    if(status==='draft')await assert.rejects(createReservation(reservationInput()));
    else await createReservation(reservationInput());
    if(['draft','seasonal'].includes(status))await assert.rejects(createOrder(orderInput()));
    else {
      const order=await createOrder(orderInput());
      product=(await catalogue(true)).products.find(p=>p.id==='honey');
      const replacement={id:'replacement',label:'New size',price:10000,stock:5};
      await assert.rejects(saveProduct({...product,variants:[replacement]}),e=>e.code==='variant_remove');
      await updateOrder({...order,status:'cancelled'});
      product=(await catalogue(true)).products.find(p=>p.id==='honey');
    }
  }
  await assert.rejects(saveProduct({...product,status:'invalid'}));
  await assert.rejects(saveProduct({...product,status:'available',variants:[{...product.variants[0],price:0}]}),e=>e.code==='price_required');
  await assert.rejects(saveProduct({...product,status:'preorder',preorderNote:{fr:'',en:''}}),e=>e.code==='preorder_note');
  product=await saveProduct({...product,variants:[{id:'replacement',label:'One size',price:10000,stock:5}]});
  assert.equal(product.variants.length,1,'Completed/cancelled orders do not block removal');
  console.log('PASS: one-format minimum, saved-format removal, active-order protection, all four visibility states, request/checkout restrictions, price and availability validation.');
} finally {
  globalThis.fetch = originalFetch;
  client?.close();
}
