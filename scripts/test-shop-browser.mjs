import {chromium, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createClient} from '@libsql/client';
import assert from 'node:assert/strict';

const base = process.env.SHOP_TEST_URL || 'http://localhost:3010';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
assert(
  !process.env.SHOP_DATABASE_URL &&
    !/^SHOP_DATABASE_URL=.+/m.test(readFileSync('.env.local', 'utf8')),
  'Use only the default local database.',
);
const password =
  process.env.SHOP_TEST_PASSWORD ||
  readFileSync('.shop/admin-access.txt', 'utf8').match(
    /^Password: (.+)$/m,
  )?.[1];
const client = createClient({
  url: `file:${resolve('.shop/shop.db').replaceAll('\\', '/')}`,
});
const oldSettings = (
  await client.execute('SELECT data FROM shop_settings WHERE id=1')
).rows[0].data;
const name = `Test navigateur ${Date.now()}`;
const browser = await chromium.launch({channel: 'chrome', headless: true});
const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
let productId;
async function shot(filename) {
  await page.evaluate(async () => {
    for (const img of document.images) {
      img.loading = 'eager';
    }
    await Promise.all(
      Array.from(document.images).map((i) => i.decode().catch(() => {})),
    );
    await document.fonts.ready;
  });
  await page.screenshot({
    path: `.playwright-mcp/${filename}.png`,
    fullPage: true,
  });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    `Overflow at ${filename}`,
  );
}
try {
  await page.goto(`${base}/fr/products`);
  await expect(
    page.getByRole('heading', {name: 'Les bonnes choses prennent leur temps.'}),
  ).toBeVisible();
  await shot('shop-desktop');
  await page.setViewportSize({width: 390, height: 844});
  await shot('shop-mobile');
  await page.getByRole('button', {name: 'Open menu'}).click();
  await expect(
    page
      .locator('#mobile-menu')
      .getByRole('link', {name: 'La boutique', exact: true}),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', {name: 'Huile d’olive', exact: true}).click();
  await expect(page.locator('.pantry-product')).toHaveCount(1);
  await page.getByRole('button', {name: 'Miel', exact: true}).click();
  await page
    .getByRole('link', {name: 'Découvrir le produit', exact: true})
    .click();
  await expect(page).toHaveURL(/\/fr\/products\/honey$/);
  await expect(
    page.getByRole('heading', {name: 'Le miel', level: 1}),
  ).toBeVisible();
  await shot('shop-honey-mobile');
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto(`${base}/fr/products/pomegranates`);
  await shot('shop-product-desktop');
  await page.goto(`${base}/en/products`);
  await expect(
    page.getByRole('heading', {name: 'Good things take their time.'}),
  ).toBeVisible();
  await page.goto(`${base}/fr/admin`);
  await page.getByLabel('Mot de passe', {exact: true}).fill(password);
  await page.getByRole('button', {name: 'Ouvrir ma boutique'}).click();
  await expect(
    page.getByRole('heading', {name: 'La boutique de Mehdi.'}),
  ).toBeVisible();
  await shot('shop-admin-mobile');
  await page.setViewportSize({width: 1440, height: 1000});
  await shot('shop-admin-desktop');
  await page.getByRole('button', {name: /Les grenades.*Modifier/}).click();
  await shot('shop-admin-editor');
  await page.setViewportSize({width: 390, height: 844});
  await shot('shop-admin-editor-mobile');
  await page.getByRole('button', {name: 'Tous les produits'}).click();
  await page.getByRole('button', {name: 'Ajouter un produit'}).click();
  await page.getByLabel('Nom du produit', {exact: true}).fill(name);
  await page
    .getByLabel('Description', {exact: true})
    .fill('Produit temporaire du test navigateur.');
  await page.getByLabel('Visibilité').selectOption('available');
  await page
    .locator('input[type=file]')
    .setInputFiles(['public/assets/images/picking_tree_fruits.webp', 'public/assets/images/beekeeping_activity.webp']);
  await expect(page.getByText('Préparation des photos…')).toHaveCount(0);
  await expect(page.locator('.admin-photo')).toHaveCount(2);
  const mainPhoto = await page.locator('.admin-photo img').nth(1).getAttribute('src');
  await page.getByRole('button', {name:'Couverture', exact:true}).click();
  await expect(page.locator('.admin-photo img').first()).toHaveAttribute('src',mainPhoto);
  await shot('shop-multiple-photos-mobile');
  await page.getByLabel('Format', {exact: true}).fill('3 kg');
  await page.getByLabel('Prix (DT)', {exact: true}).fill('18.5');
  await page.getByLabel('Colis disponibles', {exact: true}).fill('5');
  await page.getByRole('button', {name: 'Enregistrer le produit'}).click();
  await expect(
    page.getByText('Produit enregistré.', {exact: true}),
  ).toBeVisible();
  const products = await client.execute('SELECT id,data FROM shop_products');
  productId = products.rows.find(
    (r) => JSON.parse(String(r.data)).name.fr === name,
  ).id;
  await page
    .getByRole('button', {name: 'Livraison & ouverture', exact: true})
    .click();
  await page
    .getByRole('button', {name: 'Ajouter une zone de livraison'})
    .click();
  await page.getByLabel('Zone desservie').last().fill('Zone test navigateur');
  await page.getByLabel('Frais (DT)').last().fill('7');
  await page.getByLabel('Accepter les commandes').check();
  await page.getByRole('button', {name: 'Enregistrer les réglages'}).click();
  await expect(
    page.getByText('Réglages enregistrés.', {exact: true}),
  ).toBeVisible();
  await page.goto(`${base}/fr/products`);
  const product = page
    .locator('article')
    .filter({has: page.getByRole('heading', {name, exact: true})});
  await product
    .getByRole('link', {name: 'Découvrir le produit', exact: true})
    .click();
  await expect(page.locator('.pantry-detail-gallery .pantry-product-photo img')).toHaveAttribute('src',mainPhoto);
  await expect(page.locator('.pantry-thumbnails button')).toHaveCount(2);
  const otherPhoto = await page.locator('.pantry-thumbnails img').nth(1).getAttribute('src');
  await page.getByRole('button',{name:'Photo 2',exact:true}).click();
  await expect(page.locator('.pantry-detail-gallery .pantry-product-photo img')).toHaveAttribute('src',otherPhoto);
  await shot('shop-gallery-mobile');
  await page.getByRole('button', {name: 'Ajouter au panier'}).click();
  await page.locator('.pantry-detail-nav a[href="#pantry-basket"]').click();
  await page.getByLabel('Nom complet').fill('Client test navigateur');
  await page.getByLabel('Téléphone tunisien').fill('22123456');
  await page
    .getByLabel('Zone de livraison')
    .selectOption({label: 'Zone test navigateur · 7 DT'});
  await page.getByLabel('Adresse complète').fill('Adresse temporaire du test');
  await shot('shop-checkout-mobile');
  await page
    .getByRole('button', {name: 'Commander · paiement à la livraison'})
    .click();
  await expect(
    page.getByRole('heading', {name: 'Merci, votre commande est reçue.'}),
  ).toBeVisible();
  await page.goto(`${base}/fr/admin`);
  await page.getByRole('button', {name: /^Commandes/}).click();
  await page
    .locator('.admin-order')
    .filter({hasText: 'Client test navigateur'})
    .locator('summary')
    .click();
  await shot('shop-order-mobile');
  await page.getByLabel('Statut').selectOption('delivered');
  await page.getByLabel('Paiement encaissé').check();
  await page.getByRole('button', {name: 'Mettre à jour'}).click();
  await expect(
    page.getByText('Commande mise à jour.', {exact: true}),
  ).toBeVisible();
  const order = (await client.execute('SELECT data FROM shop_orders')).rows
    .map((r) => JSON.parse(String(r.data)))
    .find((o) => o.customer.name === 'Client test navigateur');
  assert.equal(order.total, 25500);
  assert.equal(order.paid, true);
  assert.equal(order.status, 'delivered');
  await page.getByRole('button', {name: 'Produits', exact: true}).click();
  await page.getByRole('button', {name: new RegExp(name)}).click();
  await page.getByLabel('Visibilité').selectOption('preorder');
  await page
    .getByLabel('Disponibilité estimée', {exact: true})
    .fill('Prochaine récolte — période de test, à confirmer par téléphone.');
  await page.getByLabel('Colis à réserver', {exact: true}).fill('3');
  await shot('shop-preorder-admin-mobile');
  await page.getByRole('button', {name: 'Enregistrer le produit'}).click();
  await expect(
    page.getByText('Produit enregistré.', {exact: true}),
  ).toBeVisible();
  await page.goto(`${base}/fr/products/${productId}`);
  await expect(
    page.getByText('Votre place dans la prochaine récolte.', {exact: true}),
  ).toBeVisible();
  await page.setViewportSize({width: 1440, height: 1000});
  await shot('shop-preorder-desktop');
  await page.setViewportSize({width: 390, height: 844});
  await shot('shop-preorder-mobile');
  await page
    .getByRole('button', {name: 'Réserver ma part', exact: true})
    .click();
  await page.locator('.pantry-detail-nav a[href="#pantry-basket"]').click();
  await page.getByLabel('Nom complet').fill('Client précommande navigateur');
  await page.getByLabel('Téléphone tunisien').fill('22123456');
  await page
    .getByLabel('Zone de livraison')
    .selectOption({label: 'Zone test navigateur · 7 DT'});
  await page
    .getByLabel('Adresse complète')
    .fill('Adresse temporaire du test précommande');
  await expect(
    page.getByText(/Votre panier contient une précommande/),
  ).toBeVisible();
  await page
    .getByRole('button', {
      name: 'Réserver · paiement à la livraison',
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('heading', {name: 'Votre réservation est enregistrée.'}),
  ).toBeVisible();
  await page.goto(`${base}/fr/admin`);
  await page.getByRole('button', {name: /^Commandes/}).click();
  await page.getByRole('button', {name: 'Précommandes', exact: true}).click();
  await expect(page.locator('.admin-order')).toHaveCount(1);
  await expect(page.locator('.admin-order')).toContainText(
    'Client précommande navigateur',
  );
  await page.getByRole('button', {name: 'Se déconnecter'}).click();
  await expect(
    page.getByRole('heading', {name: 'Bonjour, Mehdi.'}),
  ).toBeVisible();
  assert.deepEqual(errors, [], 'Browser runtime errors');
  console.log(
    'PASS: desktop/mobile product pages, honey, French/English catalogue, navigation, owner login, uploads, ready-order checkout, admin pre-order configuration, reservation checkout and pre-order filtering.',
  );
} catch (error) {
  await page.screenshot({
    path: '.playwright-mcp/shop-test-failure.png',
    fullPage: true,
  });
  throw error;
} finally {
  await client.execute({
    sql: 'UPDATE shop_settings SET data=? WHERE id=1',
    args: [oldSettings],
  });
  const result = await client.execute('SELECT id,data FROM shop_products');
  const test = result.rows.find(
    (r) => JSON.parse(String(r.data)).name.fr === name,
  );
  if (test) {
    productId = test.id;
    for (const src of JSON.parse(String(test.data)).images)
      if (src.startsWith('/api/shop/images/'))
        await client.execute({
          sql: 'DELETE FROM shop_images WHERE id=?',
          args: [src.split('/').at(-1)],
        });
    await client.execute({
      sql: 'DELETE FROM shop_orders WHERE data LIKE ?',
      args: [`%${productId}%`],
    });
    await client.execute({
      sql: 'DELETE FROM shop_products WHERE id=?',
      args: [productId],
    });
  }
  client.close();
  await browser.close();
}
