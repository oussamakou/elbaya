import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createClient} from '@libsql/client';
import sharp from 'sharp';

const base = process.env.SHOP_TEST_URL || 'http://localhost:3010';
assert(
  ['localhost', '127.0.0.1'].includes(new URL(base).hostname),
  'Only run against a local development server.',
);
const localEnv = readFileSync('.env.local', 'utf8');
assert(
  !process.env.SHOP_DATABASE_URL && !/^SHOP_DATABASE_URL=.+/m.test(localEnv),
  'Tests require the default local database; do not point the development server at a remote database.',
);
const password =
  process.env.SHOP_TEST_PASSWORD ||
  readFileSync('.shop/admin-access.txt', 'utf8').match(
    /^Password: (.+)$/m,
  )?.[1];
assert(password, 'Run npm run shop:setup first.');
const client = createClient({
  url: `file:${resolve('.shop/shop.db').replaceAll('\\', '/')}`,
});
let cookie = '',
  savedSettings,
  imageId;
const productId = `test-${randomUUID()}`,
  variantId = randomUUID(),
  zoneId = randomUUID();
const orderIds = [];
async function request(
  path,
  data,
  {method = 'POST', auth = true, origin = base} = {},
) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Origin: origin,
      ...(auth && cookie ? {Cookie: cookie} : {}),
    },
    ...(data !== undefined ? {body: JSON.stringify(data)} : {}),
  });
  return {
    status: response.status,
    data: await response.json(),
    headers: response.headers,
  };
}
try {
  // This suite is explicitly restricted to the default local test database.
  await client.execute('DELETE FROM shop_limits');
  assert.equal(
    (await request('/api/shop/admin', undefined, {method: 'GET', auth: false}))
      .status,
    401,
  );
  assert.equal(
    (
      await request(
        '/api/shop/admin/session',
        {password: 'incorrect'},
        {auth: false},
      )
    ).status,
    401,
  );
  const login = await request(
    '/api/shop/admin/session',
    {password},
    {auth: false},
  );
  assert.equal(login.status, 200);
  cookie = login.headers.get('set-cookie').split(';')[0];
  assert(login.headers.get('set-cookie').includes('HttpOnly'));
  assert.equal(
    (
      await request(
        '/api/shop/admin',
        {action: 'product', data: {}},
        {origin: 'https://unrelated.example'},
      )
    ).status,
    403,
  );
  const current = await request('/api/shop/admin', undefined, {method: 'GET'});
  assert.equal(current.status, 200);
  savedSettings = current.data.settings;
  const image = await sharp({
    create: {width: 100, height: 100, channels: 3, background: '#6f7243'},
  })
    .png()
    .toBuffer();
  const uploaded = await fetch(`${base}/api/shop/admin/images`, {
    method: 'POST',
    headers: {Origin: base, Cookie: cookie, 'Content-Type': 'image/png'},
    body: image,
  });
  assert.equal(uploaded.status, 201);
  const uploadedData = await uploaded.json();
  imageId = uploadedData.url.split('/').at(-1);
  const photo = await fetch(`${base}${uploadedData.url}`);
  assert.equal(photo.status, 200);
  assert.equal(photo.headers.get('content-type'), 'image/webp');
  const malformed = await fetch(`${base}/api/shop/admin/images`, {
    method: 'POST',
    headers: {Origin: base, Cookie: cookie, 'Content-Type': 'image/png'},
    body: 'not an image',
  });
  assert.equal(malformed.status, 400);
  let product = {
    id: productId,
    revision: 0,
    name: {fr: 'Produit test automatique', en: 'Automated test product'},
    description: {fr: 'Test temporaire.', en: ''},
    category: 'fruit',
    status: 'draft',
    images: [uploadedData.url],
    variants: [{id: variantId, label: '3 kg', price: 18500, stock: 5}],
  };
  const draft = await request('/api/shop/admin', {
    action: 'product',
    data: product,
  });
  assert.equal(draft.status, 200);
  product = draft.data;
  let publicData = await request('/api/shop/catalogue', undefined, {
    method: 'GET',
    auth: false,
  });
  assert(!publicData.data.products.some((p) => p.id === productId));
  assert.equal(
    (
      await request(
        '/api/shop/admin',
        {action: 'product', data: product},
        {auth: false},
      )
    ).status,
    401,
  );
  const published = await request('/api/shop/admin', {
    action: 'product',
    data: {...product, status: 'available'},
  });
  assert.equal(published.status, 200);
  product = published.data;
  const stale = await request('/api/shop/admin', {
    action: 'product',
    data: {...product, revision: product.revision - 1},
  });
  assert.equal(stale.status, 409);
  assert.equal(
    (
      await request('/api/shop/admin', {
        action: 'settings',
        data: {
          ...savedSettings,
          acceptingOrders: true,
          zones: [
            ...savedSettings.zones,
            {id: zoneId, name: 'Test delivery', fee: 7000},
          ],
        },
      })
    ).status,
    200,
  );
  const input = {
    requestKey: randomUUID(),
    customer: {
      name: 'Test customer',
      phone: '22123456',
      address: 'Local test only',
      notes: '',
    },
    zoneId,
    expectedTotal: 44000,
    items: [{productId, variantId, quantity: 2}],
    website: '',
  };
  assert.equal(
    (
      await request(
        '/api/shop/orders',
        {...input, expectedTotal: 1},
        {auth: false},
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await request(
        '/api/shop/orders',
        {...input, items: [{productId, variantId, quantity: -1}]},
        {auth: false},
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await request(
        '/api/shop/orders',
        {...input, customer: {...input.customer, phone: 'abc'}},
        {auth: false},
      )
    ).status,
    400,
  );
  const order = await request('/api/shop/orders', input, {auth: false});
  assert.equal(order.status, 201, JSON.stringify(order));
  orderIds.push(order.data.id);
  const duplicate = await request('/api/shop/orders', input, {auth: false});
  assert.equal(duplicate.data.id, order.data.id);
  publicData = await request('/api/shop/catalogue', undefined, {
    method: 'GET',
    auth: false,
  });
  assert.equal(
    publicData.data.products.find((p) => p.id === productId).variants[0].stock,
    3,
  );
  assert.equal(
    (
      await request(
        '/api/shop/orders',
        {
          ...input,
          requestKey: randomUUID(),
          items: [{productId, variantId, quantity: 4}],
          expectedTotal: 81000,
        },
        {auth: false},
      )
    ).status,
    409,
  );
  const admin = await request('/api/shop/admin', undefined, {method: 'GET'});
  const placed = admin.data.orders.find((o) => o.id === order.data.id);
  assert.equal(
    (
      await request('/api/shop/admin', {
        action: 'order',
        data: {...placed, paid: true},
      })
    ).status,
    400,
  );
  const cancelled = await request('/api/shop/admin', {
    action: 'order',
    data: {...placed, status: 'cancelled'},
  });
  assert.equal(cancelled.status, 200);
  const cancelAgain = await request('/api/shop/admin', {
    action: 'order',
    data: cancelled.data,
  });
  assert.equal(cancelAgain.status, 200);
  assert.equal(
    (
      await request('/api/shop/admin', {
        action: 'order',
        data: {...cancelAgain.data, status: 'new'},
      })
    ).status,
    400,
  );
  publicData = await request('/api/shop/catalogue', undefined, {
    method: 'GET',
    auth: false,
  });
  assert.equal(
    publicData.data.products.find((p) => p.id === productId).variants[0].stock,
    5,
  );
  // Competing orders cannot both reserve the last packs.
  const competing = await Promise.all(
    [1, 2].map(() =>
      request(
        '/api/shop/orders',
        {
          ...input,
          requestKey: randomUUID(),
          items: [{productId, variantId, quantity: 4}],
          expectedTotal: 81000,
        },
        {auth: false},
      ),
    ),
  );
  for (const response of competing)
    if (response.status === 201) orderIds.push(response.data.id);
  assert.equal(
    competing.filter((r) => r.status === 201).length,
    1,
    JSON.stringify(competing),
  );
  assert.equal(
    competing.filter((r) => r.status === 409).length,
    1,
    JSON.stringify(competing),
  );
  publicData = await request('/api/shop/catalogue', undefined, {
    method: 'GET',
    auth: false,
  });
  assert.equal(
    publicData.data.products.find((p) => p.id === productId).variants[0].stock,
    1,
  );
  const lastAdmin = await request('/api/shop/admin', undefined, {
    method: 'GET',
  });
  const latest = lastAdmin.data.orders.find((o) => o.id === orderIds.at(-1));
  const delivered = await request('/api/shop/admin', {
    action: 'order',
    data: {...latest, status: 'delivered', paid: true},
  });
  assert.equal(delivered.status, 200);
  assert.equal(
    (
      await request('/api/shop/admin', {
        action: 'order',
        data: {...delivered.data, status: 'cancelled'},
      })
    ).status,
    400,
  );
  // Pre-orders reserve a separate pool, preserve the promised availability,
  // reject changed terms and cannot oversell.
  let fresh = (await request('/api/shop/admin', undefined, {method: 'GET'}))
    .data;
  let preorderProduct = fresh.products.find((p) => p.id === productId);
  const stockBefore = preorderProduct.variants[0].stock;
  const availability = 'Récolte test, date à confirmer.';
  let savedPreorder = await request('/api/shop/admin', {
    action: 'product',
    data: {
      ...preorderProduct,
      status: 'preorder',
      preorderNote: {fr: availability, en: ''},
      variants: preorderProduct.variants.map((v) => ({...v, preorderStock: 3})),
    },
  });
  assert.equal(savedPreorder.status, 200);
  assert.equal(
    (
      await request('/api/shop/admin', {
        action: 'product',
        data: {...savedPreorder.data, preorderNote: {fr: '', en: ''}},
      })
    ).status,
    400,
  );
  const preInput = {
    ...input,
    requestKey: randomUUID(),
    items: [
      {
        productId,
        variantId,
        quantity: 2,
        fulfillment: 'preorder',
        availability,
      },
    ],
  };
  assert.equal(
    (
      await request(
        '/api/shop/orders',
        {...preInput, items: [{...preInput.items[0], fulfillment: 'ready'}]},
        {auth: false},
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await request(
        '/api/shop/orders',
        {
          ...preInput,
          items: [{...preInput.items[0], availability: 'An outdated promise'}],
        },
        {auth: false},
      )
    ).status,
    409,
  );
  const reservations = await Promise.all(
    [1, 2].map(() =>
      request(
        '/api/shop/orders',
        {...preInput, requestKey: randomUUID()},
        {auth: false},
      ),
    ),
  );
  assert.equal(
    reservations.filter((r) => r.status === 201).length,
    1,
    JSON.stringify(reservations),
  );
  assert.equal(reservations.filter((r) => r.status === 409).length, 1);
  const reservation = reservations.find((r) => r.status === 201);
  assert.equal(reservation.data.preorder, true);
  orderIds.push(reservation.data.id);
  fresh = (await request('/api/shop/admin', undefined, {method: 'GET'})).data;
  const booked = fresh.orders.find((o) => o.id === reservation.data.id);
  assert.equal(booked.items[0].availability, availability);
  assert.equal(
    fresh.products.find((p) => p.id === productId).variants[0].preorderStock,
    1,
  );
  assert.equal(
    fresh.products.find((p) => p.id === productId).variants[0].stock,
    stockBefore,
  );
  // Changing the product to ready stock must not change what cancellation restores.
  await request('/api/shop/admin', {
    action: 'product',
    data: {
      ...fresh.products.find((p) => p.id === productId),
      status: 'available',
    },
  });
  assert.equal(
    (
      await request('/api/shop/admin', {
        action: 'order',
        data: {...booked, status: 'cancelled'},
      })
    ).status,
    200,
  );
  fresh = (await request('/api/shop/admin', undefined, {method: 'GET'})).data;
  assert.equal(
    fresh.products.find((p) => p.id === productId).variants[0].preorderStock,
    3,
  );
  assert.equal(
    fresh.products.find((p) => p.id === productId).variants[0].stock,
    stockBefore,
  );
  // Server-side session revocation: retaining the cookie after logout is insufficient.
  assert.equal(
    (await request('/api/shop/admin/session', undefined, {method: 'DELETE'}))
      .status,
    200,
  );
  assert.equal(
    (await request('/api/shop/admin', undefined, {method: 'GET'})).status,
    401,
  );
  for (let i = 0; i < 10; i++)
    await request(
      '/api/shop/admin/session',
      {password: 'wrong-password'},
      {auth: false},
    );
  assert.equal(
    (await request('/api/shop/admin/session', {password}, {auth: false}))
      .status,
    429,
  );
  console.log(
    'PASS: auth, origin checks, images, drafts, stale edits, guest checkout, price checks, concurrent stock/pre-order reservation, availability snapshots, correct cancellation pool, payment recording, logout revocation and login throttling.',
  );
} finally {
  await client.execute('DELETE FROM shop_limits');
  if (savedSettings)
    await client.execute({
      sql: 'UPDATE shop_settings SET data=? WHERE id=1',
      args: [JSON.stringify(savedSettings)],
    });
  await client.execute({
    sql: 'DELETE FROM shop_products WHERE id=?',
    args: [productId],
  });
  for (const orderId of orderIds)
    await client.execute({
      sql: 'DELETE FROM shop_orders WHERE id=?',
      args: [orderId],
    });
  // Also clean up committed test requests if a network/assertion failure hid the response.
  await client.execute({
    sql: 'DELETE FROM shop_orders WHERE data LIKE ?',
    args: [`%${productId}%`],
  });
  if (imageId)
    await client.execute({
      sql: 'DELETE FROM shop_images WHERE id=?',
      args: [imageId],
    });
  client.close();
}
