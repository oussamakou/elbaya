import {chromium, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createClient} from '@libsql/client';
import assert from 'node:assert/strict';

// End-to-end in Chrome against a local dev server and its default local database:
// the storefront, the owner editor (sale states, photos, sizes), promo codes, pickup
// requests (Commande and Précommande), the request inbox and the waitlist.
// Every record it creates is labelled and deleted at the end.
const base = process.env.SHOP_TEST_URL || 'http://localhost:3010';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
assert(
  !process.env.SHOP_DATABASE_URL &&
    !/^SHOP_DATABASE_URL=.+/m.test(readFileSync('.env.local', 'utf8')),
  'Use only the default local database.',
);
const password =
  process.env.SHOP_TEST_PASSWORD ||
  readFileSync('.shop/admin-access.txt', 'utf8').match(/^Password: (.+)$/m)?.[1];
const client = createClient({
  url: `file:${resolve('.shop/shop.db').replaceAll('\\', '/')}`,
});
const stamp = Date.now();
const name = `Test navigateur ${stamp}`;
const lastName = `NAV-${stamp}`;
const promo = `NAV${String(stamp).slice(-6)}`;
const browser = await chromium.launch({channel: 'chrome', headless: true});
const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
let productId;
async function shot(filename) {
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager';
    await Promise.all(Array.from(document.images).map((i) => i.decode().catch(() => {})));
    await document.fonts.ready;
  });
  await page.screenshot({path: `.playwright-mcp/${filename}.png`, fullPage: true});
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    false,
    `Overflow at ${filename}`,
  );
}
async function openEditor() {
  await page.goto(`${base}/fr/admin`);
  await page.getByRole('button', {name: 'Produits', exact: true}).click();
  await page.getByRole('button', {name: new RegExp(name)}).click();
}
async function saveProduct() {
  await page.getByRole('button', {name: 'Enregistrer le produit'}).click();
  await expect(page.getByText('Produit enregistré.', {exact: true})).toBeVisible();
}
// The state cards are labels wrapping a visually hidden radio; click the card like a person would.
async function chooseState(title) {
  await page.locator('label.admin-state', {has: page.locator('strong', {hasText: new RegExp(`^${title}$`)})}).click();
  await expect(page.getByRole('radio', {name: new RegExp(`^${title}`)})).toBeChecked();
}
async function fillContact(firstName) {
  await page.getByLabel('Prénom', {exact: true}).fill(firstName);
  await page.getByLabel('Nom', {exact: true}).fill(lastName);
  await page.getByLabel('Téléphone tunisien', {exact: true}).fill('22123456');
}
try {
  // Storefront: the pomegranate page leads the shop, in both languages and on a phone.
  await page.goto(`${base}/fr/products`);
  await expect(page.getByRole('heading', {name: 'Les grenades d’El Baya.', level: 1})).toBeVisible();
  await shot('shop-desktop');
  await page.setViewportSize({width: 390, height: 844});
  await shot('shop-mobile');
  await page.getByRole('button', {name: 'Open menu'}).click();
  await expect(page.locator('#mobile-menu').getByRole('link', {name: 'Boutique', exact: true})).toBeVisible();
  await page.keyboard.press('Escape');
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto(`${base}/en/products`);
  await expect(page.getByRole('heading', {name: 'El Baya pomegranates.', level: 1})).toBeVisible();

  // Owner: log in, create a product in Commande with two photos and a priced size.
  await page.goto(`${base}/fr/admin`);
  await page.getByLabel('Mot de passe', {exact: true}).fill(password);
  await page.getByRole('button', {name: 'Ouvrir ma boutique'}).click();
  await expect(page.getByRole('heading', {name: 'La boutique de Mehdi.'})).toBeVisible();
  await expect(page.locator('body > header, footer')).toHaveCount(0);
  await page.getByRole('button', {name: 'Produits', exact: true}).click();
  await page.getByRole('button', {name: 'Ajouter un produit'}).click();
  await page.getByLabel('Nom du produit', {exact: true}).fill(name);
  await page.getByLabel('Description', {exact: true}).fill('Produit temporaire du test navigateur.');
  await chooseState('Commande');
  await page.locator('input[type=file]').setInputFiles([
    'public/assets/images/picking_tree_fruits.webp',
    'public/assets/images/beekeeping_activity.webp',
  ]);
  // Photos are resized in the browser before upload; two large images take a few seconds headless.
  await expect(page.getByText('Préparation des photos…')).toHaveCount(0, {timeout: 30000});
  await expect(page.locator('.admin-photo')).toHaveCount(2);
  const cover = await page.locator('.admin-photo img').nth(1).getAttribute('src');
  await page.getByRole('button', {name: 'Couverture', exact: true}).click();
  await expect(page.locator('.admin-photo img').first()).toHaveAttribute('src', cover);
  await page.getByLabel('Format', {exact: true}).fill('1 L');
  await page.getByLabel('Prix (DT)', {exact: true}).fill('35');
  await shot('shop-admin-editor');
  await saveProduct();
  productId = (await client.execute('SELECT id,data FROM shop_products')).rows.find(
    (r) => JSON.parse(String(r.data)).name.fr === name,
  ).id;
  await expect(page.locator('.admin-product-row').filter({hasText: name})).toContainText('Commande');

  // Owner: a promo code for this test.
  await page.getByRole('button', {name: 'Codes promo', exact: true}).click();
  await page.getByLabel('Code', {exact: true}).fill(promo);
  await page.locator('.promo-form input[name=value]').fill('10');
  await page.getByLabel('Limite d’utilisations').fill('5');
  await page.getByRole('button', {name: 'Créer le code'}).click();
  await expect(page.locator('.promo-list li').filter({hasText: promo})).toContainText('Actif');

  // Customer: the same page template as the pomegranates, with packs, quantity, pickup and the code.
  await page.goto(`${base}/fr/products/${productId}`);
  await expect(page.getByRole('heading', {name: `${name}.`, level: 1})).toBeVisible();
  await expect(page.locator('.harvest-photo img')).toHaveAttribute('src', cover);
  await page.getByRole('button', {name: 'Image suivante'}).click();
  await expect(page.locator('.harvest-photo img')).not.toHaveAttribute('src', cover);
  await page.getByRole('button', {name: 'Ajouter un'}).click();
  await page.getByRole('radio', {name: /À Tunis/}).check();
  await fillContact('Commande');
  await page.getByRole('button', {name: 'J’ai un code promo'}).click();
  await page.getByLabel('Code promo').fill(promo.toLowerCase());
  await page.getByRole('button', {name: 'Appliquer'}).click();
  await expect(page.locator('.harvest-total')).toContainText('63 DT');
  await page.setViewportSize({width: 390, height: 844});
  await shot('shop-product-mobile');
  await page.setViewportSize({width: 1440, height: 1000});
  await page.getByRole('button', {name: /^Commander/}).click();
  await expect(page.getByRole('heading', {name: 'Votre commande est envoyée.'})).toBeVisible();
  await expect(page.locator('.harvest-confirmation')).toContainText(`2 × 1 L · 63 DT · code ${promo}`);

  // Owner: the request is in Demandes; confirm it with a pickup date.
  await page.goto(`${base}/fr/admin`);
  await page.getByRole('button', {name: /^Demandes/}).click();
  const card = page.locator('.inbox-card').filter({hasText: lastName});
  await expect(card).toHaveCount(1);
  await expect(card).toContainText(`${name} · 2 × 1 L`);
  await expect(card).toContainText(`code ${promo}`);
  await card.getByRole('button', {name: 'Confirmée'}).click();
  await expect(card).toHaveAttribute('data-status', 'confirmed');
  await card.getByLabel('Date de retrait').fill('2026-11-02');
  await card.getByRole('button', {name: 'Enregistrer'}).click();
  await expect(card.getByText('Enregistré')).toBeVisible();
  await shot('shop-admin-inbox');
  const stored = (await client.execute({sql: 'SELECT data FROM shop_reservations WHERE data LIKE ?', args: [`%${lastName}%`]})).rows.map((r) => JSON.parse(String(r.data)));
  assert.deepEqual(
    [stored.length, stored[0].status, stored[0].pickupDate, stored[0].harvest.total, stored[0].harvest.discount, stored[0].harvest.pickup],
    [1, 'confirmed', '2026-11-02', 63000, 7000, 'tunis'],
  );

  // Précommande: the page announces the estimate and the request is tagged.
  await openEditor();
  await chooseState('Précommande');
  await page.getByLabel('Disponibilité annoncée (facultatif)').fill('Récolte test mi-novembre');
  await saveProduct();
  await page.goto(`${base}/fr/products/${productId}`);
  await expect(page.locator('.harvest-preorder')).toContainText('Récolte test mi-novembre');
  await fillContact('Precommande');
  await page.getByRole('button', {name: /^Précommander/}).click();
  await expect(page.getByRole('heading', {name: 'Votre précommande est envoyée.'})).toBeVisible();
  await page.goto(`${base}/fr/admin`);
  await page.getByRole('button', {name: /^Demandes/}).click();
  await expect(page.locator('.inbox-card').filter({hasText: 'Precommande'}).locator('.inbox-preorder')).toContainText('Récolte test mi-novembre');

  // Épuisé: no request form, only the waitlist; the signup reaches the owner.
  await openEditor();
  await chooseState('Épuisé');
  await saveProduct();
  await expect(page.locator('.admin-product-row').filter({hasText: name})).toContainText('Épuisé');
  await page.goto(`${base}/fr/products/${productId}`);
  await expect(page.locator('.harvest-order')).toHaveCount(0);
  await page.getByLabel('Prénom', {exact: true}).fill(`Attente ${lastName}`);
  await page.getByLabel('Téléphone (WhatsApp)').fill('22123456');
  await page.locator('.waitlist-form input[name=consent]').check();
  await page.getByRole('button', {name: 'Me prévenir en premier'}).click();
  await expect(page.getByText(/C’est noté/)).toBeVisible();
  await page.goto(`${base}/fr/admin`);
  await page.getByRole('button', {name: 'Produits', exact: true}).click();
  await expect(page.locator('#liste-attente')).toContainText(`Attente ${lastName}`);
  await page.setViewportSize({width: 390, height: 844});
  await shot('shop-admin-mobile');
  await page.getByRole('button', {name: 'Se déconnecter'}).click();
  await expect(page.getByRole('heading', {name: 'Bonjour, Mehdi.'})).toBeVisible();
  assert.deepEqual(errors, [], 'Browser runtime errors');
  console.log(
    'PASS: pomegranate storefront FR/EN, phone menu, owner login without guest chrome, product editor (states, photos, cover, sizes), promo code, pack request with code, inbox confirmation and pickup date, Précommande request and tag, Épuisé waitlist signup, logout.',
  );
} catch (error) {
  await page.screenshot({path: '.playwright-mcp/shop-test-failure.png', fullPage: true});
  throw error;
} finally {
  if (!productId) {
    const row = (await client.execute('SELECT id,data FROM shop_products')).rows.find((r) => JSON.parse(String(r.data)).name.fr === name);
    productId = row?.id;
  }
  if (productId) {
    const product = (await client.execute({sql: 'SELECT data FROM shop_products WHERE id=?', args: [productId]})).rows[0];
    for (const src of product ? JSON.parse(String(product.data)).images : [])
      if (src.startsWith('/api/shop/images/'))
        await client.execute({sql: 'DELETE FROM shop_images WHERE id=?', args: [src.split('/').at(-1)]});
    await client.execute({sql: 'DELETE FROM shop_notifications WHERE id IN (SELECT id FROM shop_reservations WHERE data LIKE ?)', args: [`%${lastName}%`]});
    await client.execute({sql: 'DELETE FROM shop_reservations WHERE data LIKE ?', args: [`%${lastName}%`]});
    await client.execute({sql: 'DELETE FROM shop_waitlist WHERE product_id=?', args: [productId]});
    await client.execute({sql: 'DELETE FROM shop_products WHERE id=?', args: [productId]});
  }
  await client.execute({sql: 'DELETE FROM shop_promos WHERE code=?', args: [promo]});
  client.close();
  await browser.close();
}
