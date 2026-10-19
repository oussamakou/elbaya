import {chromium, expect} from '@playwright/test';
import {createClient} from '@libsql/client';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
// The pomegranate request flow in English, in Chrome, against a local dev server and its local database:
// visible form, phone layout, optional email, persistence, validation, duplicate protection and owner follow-up.
const base = process.env.SHOP_TEST_URL || 'http://localhost:3010';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
assert(!process.env.SHOP_DATABASE_URL && !process.env.TURSO_DATABASE_URL && !/^(?:SHOP_DATABASE_URL|TURSO_DATABASE_URL)=.+/m.test(readFileSync('.env.local','utf8')), 'Local database only');
const client = createClient({url:`file:${resolve('.shop/shop.db').replaceAll('\\','/')}`});
const browser = await chromium.launch({channel:'chrome',headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const key = crypto.randomUUID();
const lastName = `QA-${key}`;
const password = readFileSync('.shop/admin-access.txt','utf8').match(/^Password: (.+)$/m)[1];
const errors=[];page.on('pageerror',e=>errors.push(e.message));
async function post(data, origin=base) {return fetch(base+'/api/shop/reservations',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(data)});}
try {
  const {products} = await (await fetch(base+'/api/shop/catalogue')).json();
  const pomegranates = products.find(p=>p.id==='pomegranates');
  assert(pomegranates, 'Pomegranates must be visible for this test');
  const large = pomegranates.harvestOffer?.largeUnitPrice ?? 4000;
  await page.goto(base+'/en/products/reserve');
  await expect(page.getByRole('heading',{name:'El Baya pomegranates.',level:1})).toBeVisible();
  await expect(page.getByLabel('First name',{exact:true})).toBeVisible();
  await page.locator('.harvest-value-pack').click();
  await expect(page.locator('.harvest-value-pack')).toHaveAttribute('aria-pressed','true');
  await page.getByRole('radio',{name:/In Tunis/}).check();
  await page.screenshot({path:'.playwright-mcp/harvest-request-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'.playwright-mcp/harvest-request-mobile.png',fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.getByLabel('First name',{exact:true}).fill('Test');
  await page.getByLabel('Last name',{exact:true}).fill(lastName);
  await page.getByLabel('Tunisian phone number').fill('22123456');
  await page.getByRole('button',{name:/^Request my harvest pack/}).click();
  await expect(page.getByRole('heading',{name:'Your harvest request is in.'})).toBeVisible();
  const request = JSON.parse((await client.execute({sql:'SELECT data FROM shop_reservations WHERE data LIKE ?',args:[`%${lastName}%`]})).rows[0].data);
  assert.deepEqual([request.firstName,request.email,request.status,request.harvest.kg,request.harvest.pickup,request.harvest.total,request.size,request.city],['Test','','new',20,'tunis',20*large,'20 kg','Tunis']);
  // API: origin, field, weight and price checks; idempotent retries.
  const data={firstName:'Test',lastName,phone:'22123456',email:'test@example.com',productId:'pomegranates',variantId:pomegranates.variants[0].id,harvestKg:20,pickup:'farm',expectedTotal:20*large,requestKey:key};
  assert.equal((await post(data,'https://evil.example')).status,403);
  assert.equal((await post({...data,email:'bad-email'})).status,400);
  assert.equal((await post({...data,phone:'12345'})).status,400);
  assert.equal((await post({...data,firstName:''})).status,400);
  assert.equal((await post({...data,harvestKg:6})).status,400);
  assert.equal((await post({...data,pickup:'delivery'})).status,400);
  assert.equal((await post({...data,expectedTotal:1,requestKey:crypto.randomUUID()})).status,409);
  const first=await post(data);assert.equal(first.status,201);const receipt=await first.json();
  assert.deepEqual(await (await post(data)).json(),receipt);
  assert.equal((await post({...data,harvestKg:25})).status,409,'same key, different request');
  // A product that is sold out (or unpriced from before the sale states) takes no request.
  const closed = products.find(p=>p.id!=='pomegranates' && (p.status==='soldout' || (p.status==='seasonal' && !p.harvestOffer?.enabled)));
  // Checked only when the local data has such a product; test-shop-growth.mjs always covers it.
  if (closed) assert.equal((await post({firstName:'Test',lastName,phone:'22123456',productId:closed.id,variantId:closed.variants[0].id,quantity:1,pickup:'farm',expectedTotal:closed.variants[0].price,requestKey:crypto.randomUUID()})).status,409);
  // Owner follow-up persists.
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base+'/fr/admin');
  await page.getByLabel('Mot de passe',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Ouvrir ma boutique'}).click();
  await page.getByRole('button',{name:/^Demandes/}).click();
  const card=page.locator('.inbox-card').filter({hasText:request.id});
  await expect(card).toContainText(lastName);
  await card.getByRole('button',{name:'Contacté'}).click();
  await expect(card).toHaveAttribute('data-status','contacted');
  await page.reload();
  await page.getByRole('button',{name:/^Demandes/}).click();
  await expect(page.locator('.inbox-card').filter({hasText:request.id})).toHaveAttribute('data-status','contacted');
  await page.screenshot({path:'.playwright-mcp/harvest-request-admin.png',fullPage:true});
  await page.getByRole('button',{name:'Se déconnecter'}).click();
  assert.deepEqual(errors,[]);
  console.log(`PASS: English pomegranate form, phone layout, optional email, 20 kg Tunis request, persistence, origin/field/weight/price validation, duplicate protection, ${closed ? 'sold-out refusal, ' : '(no sold-out product locally, refusal not checked here), '}owner follow-up.`);
} finally {
  await client.execute({sql:'DELETE FROM shop_notifications WHERE id IN (SELECT id FROM shop_reservations WHERE data LIKE ?)',args:[`%${lastName}%`]});
  await client.execute({sql:'DELETE FROM shop_reservations WHERE data LIKE ?',args:[`%${lastName}%`]});
  await client.execute("DELETE FROM shop_limits WHERE key LIKE 'reservation:%'");
  client.close();await browser.close();
}
