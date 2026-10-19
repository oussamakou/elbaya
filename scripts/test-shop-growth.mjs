import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Compile into an isolated temporary folder; never touch production or send real email.
const dir = process.argv[2] || mkdtempSync(resolve('.shop/growth-test-'));
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
  for (const name of ['harvest', 'db', 'types', 'notifications', 'validation', 'reservations', 'service', 'promo', 'waitlist']) {
    const source = readFileSync(`lib/shop/${name}.ts`, 'utf8').replace(/from (['"])\.\/([^'"]+)\1/g, "from './$2.mjs'");
    writeFileSync(join(dir, `${name}.mjs`), ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022}}).outputText);
  }
  const load = name => import(pathToFileURL(join(dir, name + '.mjs')).href);
  const {db} = await load('db');
  const {createReservation} = await load('reservations');
  const {saveProduct, catalogue} = await load('service');
  const {joinWaitlist, waitlist, waitlistCounts, updateWaitlist, removeWaitlist} = await load('waitlist');
  const {savePromo, checkPromo, promos} = await load('promo');
  const {reservationMessage} = await load('notifications');
  const {promoDiscount, saleState} = await load('harvest');
  client = await db();
  const product = id => client.execute({sql:'SELECT data FROM shop_products WHERE id=?',args:[id]}).then(r=>JSON.parse(String(r.rows[0].data)));

  // Sold out: visible, no requests, waitlist only.
  const honey = await saveProduct({...(await product('honey')), status:'soldout'});
  assert.equal(honey.status,'soldout');
  const general = {firstName:'Test',lastName:'Growth',phone:'22123456',email:'',governorate:'Béja',city:'Testour',address:'Rue 1',productId:'honey',variantId:honey.variants[0].id,quantity:1};
  await assert.rejects(createReservation({...general,requestKey:crypto.randomUUID()}),e=>e.code==='closed');
  assert.ok((await catalogue()).products.some(p=>p.id==='honey'),'sold-out products stay visible');

  // Waitlist: consent required, phone normalised, one entry per phone and product.
  const signUp = extra => joinWaitlist({firstName:'Amira',phone:'+216 22 123 456',email:'',productId:'honey',consent:true,requestKey:crypto.randomUUID(),...extra});
  await assert.rejects(signUp({consent:false}),e=>e.code==='consent');
  await assert.rejects(signUp({phone:'12345'}),e=>e.code==='phone');
  await assert.rejects(signUp({website:'bot'}),e=>e.code==='invalid');
  const first = await signUp();
  assert.equal(first.already,false);
  assert.equal((await signUp({phone:'0021622123456'})).already,true,'same person, other phone format');
  assert.equal((await signUp({phone:'22123456'})).id,first.id);
  await signUp({firstName:'Karim',phone:'98765432'});
  await signUp({firstName:'Nour',phone:'50111222',productId:'olive-oil'});
  assert.deepEqual(await waitlistCounts(),{honey:2,'olive-oil':1});
  assert.equal((await catalogue()).waiting.honey,2,'public count');
  const stored = (await waitlist()).find(e=>e.id===first.id);
  assert.equal(stored.phone,'22123456');assert.equal(stored.productName,'Le miel');
  await updateWaitlist({id:first.id,notified:true});
  assert.equal((await waitlistCounts()).honey,1,'notified people are no longer counted as waiting');
  await updateWaitlist({id:first.id,notified:false});
  await removeWaitlist({id:first.id});
  assert.equal((await waitlist()).length,2);
  const draft = await saveProduct({...(await product('olive-oil')), status:'draft'});
  await assert.rejects(signUp({productId:'olive-oil',phone:'50999888'}),e=>e.code==='stock');
  const olive = await saveProduct({...draft,status:'available',variants:[{...draft.variants[0],price:35000}]});

  // Promo codes: validation, preview without spending, redemption inside the request.
  assert.equal(promoDiscount(45000,{code:'X',kind:'percent',value:10}),4500);
  assert.equal(promoDiscount(67500,{code:'X',kind:'percent',value:15}),10100,'percent rounds down to 100 millimes');
  assert.equal(promoDiscount(25000,{code:'X',kind:'amount',value:30000}),25000,'never below zero');
  await assert.rejects(savePromo({code:'a',kind:'percent',value:10,active:true}),e=>e.code==='promo_invalid');
  await assert.rejects(savePromo({code:'BIG',kind:'percent',value:95,active:true}),e=>e.code==='invalid');
  await assert.rejects(savePromo({code:'BADDAY',kind:'percent',value:10,active:true,endsOn:'2026-02-31'}),e=>e.code==='invalid');
  await savePromo({code:' amis10 ',kind:'percent',value:10,active:true,maxUses:2,endsOn:null});
  await savePromo({code:'OLD',kind:'amount',value:5000,active:true,maxUses:null,endsOn:'2020-01-01'});
  await savePromo({code:'OFF',kind:'amount',value:5000,active:false,maxUses:null,endsOn:null});
  assert.deepEqual(await checkPromo({code:'Amis10',subtotal:45000}),{code:'AMIS10',kind:'percent',value:10,discount:4500});
  for(const code of ['OLD','OFF','NOPE'])await assert.rejects(checkPromo({code,subtotal:45000}),e=>e.code==='promo_invalid');
  assert.equal((await promos()).find(p=>p.code==='AMIS10').uses,0,'preview does not count a use');
  const harvest = {firstName:'Test',lastName:'Promo',phone:'22123456',email:'',productId:'pomegranates',variantId:(await product('pomegranates')).variants[0].id,harvestKg:10,pickup:'farm'};
  await assert.rejects(createReservation({...harvest,expectedTotal:45000,promoCode:'AMIS10',requestKey:crypto.randomUUID()}),e=>e.code==='price_changed','client must show the discounted total');
  assert.equal((await promos()).find(p=>p.code==='AMIS10').uses,0,'a rejected request does not spend the code');
  const key = crypto.randomUUID();
  const r = await createReservation({...harvest,expectedTotal:40500,promoCode:'amis10',requestKey:key});
  assert.deepEqual([r.harvest.subtotal,r.harvest.discount,r.harvest.total,r.harvest.promoCode],[45000,4500,40500,'AMIS10']);
  assert.equal((await createReservation({...harvest,expectedTotal:40500,promoCode:'amis10',requestKey:key})).id,r.id,'retry is idempotent');
  assert.equal((await promos()).find(p=>p.code==='AMIS10').uses,1,'retry does not count twice');
  assert.match(reservationMessage(r).text,/Code promo AMIS10/);
  await createReservation({...harvest,harvestKg:20,expectedTotal:72000,promoCode:'AMIS10',requestKey:crypto.randomUUID()});
  await assert.rejects(createReservation({...harvest,expectedTotal:40500,promoCode:'AMIS10',requestKey:crypto.randomUUID()}),e=>e.code==='promo_invalid','usage limit reached');
  await assert.rejects(createReservation({...general,productId:'olive-oil',variantId:draft.variants[0].id,promoCode:'AMIS10',requestKey:crypto.randomUUID()}),e=>e.code==='invalid','codes apply to harvest requests only');
  // Pre-order requests: the street is optional; the stored address has no empty parts.
  const {address:_street, ...noStreet} = general;
  const request = await createReservation({...noStreet,productId:'olive-oil',variantId:draft.variants[0].id,requestKey:crypto.randomUUID()});
  assert.equal(request.address,'Testour, Béja');
  await assert.rejects(createReservation({...noStreet,city:'',productId:'olive-oil',variantId:draft.variants[0].id,requestKey:crypto.randomUUID()}),e=>e.code==='invalid','city stays required');
  // Per-product sale states, including records saved before them.
  assert.equal(saleState({id:'pomegranates',status:'seasonal'}),'order','legacy pomegranates kept taking requests');
  assert.equal(saleState({id:'honey',status:'seasonal'}),'soldout','legacy unpriced pack product reads as sold out');
  assert.equal(saleState({id:'pomegranates',status:'seasonal',harvestOffer:{enabled:false,baseUnitPrice:5000,bulkUnitPrice:4500,pickupFarm:true,pickupTunis:true}}),'soldout');
  assert.deepEqual(['draft','available','preorder','soldout'].map(status=>saleState({id:'honey',status})),['hidden','order','preorder','soldout']);
  // Pack requests: a size and a quantity, pickup, total checked on the server.
  const pack = {firstName:'Test',lastName:'Pack',phone:'22123456',email:'',productId:'olive-oil',variantId:olive.variants[0].id,quantity:2,pickup:'tunis'};
  await assert.rejects(createReservation({...pack,expectedTotal:35000,requestKey:crypto.randomUUID()}),e=>e.code==='price_changed');
  await assert.rejects(createReservation({...pack,harvestKg:10,expectedTotal:70000,requestKey:crypto.randomUUID()}),e=>e.code==='invalid','packs are not sold by weight');
  const packed = await createReservation({...pack,expectedTotal:70000,requestKey:crypto.randomUUID()});
  assert.deepEqual([packed.harvest.quantity,packed.harvest.label,packed.harvest.unitPrice,packed.harvest.total,packed.size,packed.harvest.preorder],[2,olive.variants[0].label,35000,70000,`2 × ${olive.variants[0].label}`,undefined]);
  assert.match(reservationMessage(packed).text,/Quantité : 2 ×/);
  assert.match(reservationMessage(packed).subject,/Commande/);
  const withExtra = await saveProduct({...olive,variants:[...olive.variants,{id:'five',label:'5 L',price:0,stock:0}]});
  await assert.rejects(createReservation({...pack,variantId:'five',expectedTotal:0,requestKey:crypto.randomUUID()}),e=>e.code==='stock','unpriced sizes are not offered');
  const pre = await saveProduct({...withExtra,status:'preorder',preorderNote:{fr:'Mi-novembre',en:''}});
  const preReq = await createReservation({...pack,quantity:1,expectedTotal:35000,requestKey:crypto.randomUUID()});
  assert.deepEqual([preReq.harvest.preorder,preReq.harvest.availability],[true,'Mi-novembre']);
  assert.match(reservationMessage(preReq).text,/PRÉCOMMANDE · disponibilité annoncée : Mi-novembre/);
  await assert.rejects(saveProduct({...pre,status:'available',variants:pre.variants.map(v=>({...v,price:0}))}),e=>e.code==='price_required','Commande needs a priced size');
  const sold = await saveProduct({...pre,status:'soldout'});
  assert.equal(sold.harvestOffer.enabled,false);
  await assert.rejects(createReservation({...pack,expectedTotal:70000,requestKey:crypto.randomUUID()}),e=>e.code==='closed');
  await saveProduct({...sold,status:'available'});
  const edited = await savePromo({code:'AMIS10',kind:'percent',value:15,active:false,maxUses:5,endsOn:null});
  assert.equal(edited.uses,2,'editing keeps the usage count');
  console.log('PASS: sold-out status, waitlist consent/dedupe/counts/notified/removal, promo validation, preview, redemption, limits, idempotency, email line, optional street address, sale states, pack and pre-order requests. No real email or production data.');
} finally {globalThis.fetch=originalFetch;client?.close();}
