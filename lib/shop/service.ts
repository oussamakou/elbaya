import {createHash, randomUUID} from 'node:crypto';
import {db, seedProducts, storageConfigured} from './db';
import {queueNotification, orderMessage} from './notifications';
import {
  ShopError,
  object,
  text,
  integer,
  id,
  productInput,
  settingsInput,
} from './validation';
import type {Order, Product, ShopSettings, OrderStatus} from './types';
import {capacity, fulfillment, orderable} from './types';

export async function catalogue(admin = false) {
  if (!storageConfigured())
    return {
      products: seedProducts,
      settings: {
        revision: 0,
        acceptingOrders: false,
        zones: [],
      } as ShopSettings,
    };
  const client = await db();
  const [products, settings] = await client.batch(
    [
      'SELECT data FROM shop_products ORDER BY rowid',
      'SELECT data FROM shop_settings WHERE id=1',
    ],
    'read',
  );
  return {
    products: products.rows
      .map((row) => JSON.parse(String(row.data)) as Product)
      .filter((p) => admin || p.status !== 'draft'),
    settings: JSON.parse(String(settings.rows[0].data)) as ShopSettings,
  };
}
export async function saveProduct(input: unknown) {
  const product = productInput(input);
  const tx = await (await db()).transaction('write');
  try {
    const result = await tx.execute({
      sql: 'SELECT data FROM shop_products WHERE id=?',
      args: [product.id],
    });
    const previous: Product | undefined = result.rows.length
      ? JSON.parse(String(result.rows[0].data))
      : undefined;
    if ((previous?.revision ?? 0) !== product.revision)
      throw new ShopError('conflict', 409);
    // Retain variant identifiers so a cancelled order can always return its stock.
    if (
      previous &&
      previous.variants.some(
        (v) => !product.variants.some((n) => n.id === v.id),
      )
    )
      throw new ShopError('variant_remove');
    product.revision++;
    await tx.execute({
      sql: 'INSERT INTO shop_products (id,data) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data',
      args: [product.id, JSON.stringify(product)],
    });
    await tx.commit();
    return product;
  } finally {
    tx.close();
  }
}
export async function saveSettings(input: unknown) {
  const settings = settingsInput(input);
  const tx = await (await db()).transaction('write');
  try {
    const result = await tx.execute(
      'SELECT data FROM shop_settings WHERE id=1',
    );
    if (JSON.parse(String(result.rows[0].data)).revision !== settings.revision)
      throw new ShopError('conflict', 409);
    settings.revision++;
    await tx.execute({
      sql: 'UPDATE shop_settings SET data=? WHERE id=1',
      args: [JSON.stringify(settings)],
    });
    await tx.commit();
    return settings;
  } finally {
    tx.close();
  }
}
export async function createOrder(input: unknown) {
  const o = object(input),
    customer = object(o.customer);
  if (o.website) throw new ShopError('invalid');
  const name = text(customer.name, 100),
    phone = text(customer.phone, 30).replace(/[\s().-]/g, '');
  if (!/^(?:\+216|00216)?[2-9][0-9]{7}$/.test(phone))
    throw new ShopError('phone');
  const details = {
    name,
    phone,
    address: text(customer.address, 500),
    notes: text(customer.notes, 1000, false),
  };
  const key = id(o.requestKey),
    zoneId = id(o.zoneId),
    expectedTotal = integer(o.expectedTotal);
  if (!Array.isArray(o.items) || !o.items.length || o.items.length > 30)
    throw new ShopError('invalid');
  const items = o.items.map((v) => {
    const row = object(v);
    if (
      row.fulfillment !== undefined &&
      !['ready', 'preorder'].includes(String(row.fulfillment))
    )
      throw new ShopError('invalid');
    return {
      productId: id(row.productId),
      variantId: id(row.variantId),
      quantity: integer(row.quantity, 1, 99),
      fulfillment: (row.fulfillment || 'ready') as 'ready' | 'preorder',
      availability: text(row.availability ?? '', 2000, false),
    };
  });
  if (
    new Set(items.map((i) => `${i.productId}/${i.variantId}`)).size !==
    items.length
  )
    throw new ShopError('invalid');
  const hash = createHash('sha256')
    .update(JSON.stringify({details, zoneId, expectedTotal, items}))
    .digest('hex');
  const tx = await (await db()).transaction('write');
  try {
    const old = await tx.execute({
      sql: 'SELECT request_hash, data FROM shop_orders WHERE request_key=?',
      args: [key],
    });
    if (old.rows.length) {
      if (old.rows[0].request_hash !== hash)
        throw new ShopError('conflict', 409);
      return JSON.parse(String(old.rows[0].data)) as Order;
    }
    const settingsResult = await tx.execute(
      'SELECT data FROM shop_settings WHERE id=1',
    );
    const settings: ShopSettings = JSON.parse(
      String(settingsResult.rows[0].data),
    );
    if (!settings.acceptingOrders) throw new ShopError('closed', 409);
    const zone = settings.zones.find((z) => z.id === zoneId);
    if (!zone) throw new ShopError('zone', 409);
    const products = new Map<string, Product>();
    const lines: Order['items'] = [];
    for (const item of items) {
      let product = products.get(item.productId);
      if (!product) {
        const result = await tx.execute({
          sql: 'SELECT data FROM shop_products WHERE id=?',
          args: [item.productId],
        });
        if (!result.rows.length) throw new ShopError('stock', 409);
        product = JSON.parse(String(result.rows[0].data)) as Product;
        products.set(product.id, product);
      }
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (
        !orderable(product) ||
        !variant ||
        capacity(product, variant) < item.quantity ||
        variant.price <= 0
      )
        throw new ShopError('stock', 409);
      if (item.fulfillment !== fulfillment(product))
        throw new ShopError('fulfillment_changed', 409);
      if (item.fulfillment === 'preorder') {
        if (!product.preorderNote?.fr) throw new ShopError('stock', 409);
        if (item.availability !== product.preorderNote.fr)
          throw new ShopError('availability_changed', 409);
        variant.preorderStock = (variant.preorderStock || 0) - item.quantity;
      } else {
        variant.stock -= item.quantity;
      }
      lines.push({
        ...item,
        name: product.name.fr,
        label: variant.label,
        price: variant.price,
        availability:
          item.fulfillment === 'preorder'
            ? product.preorderNote!.fr
            : undefined,
      });
    }
    const total = lines.reduce(
      (sum, line) => sum + line.price * line.quantity,
      zone.fee,
    );
    if (total !== expectedTotal) throw new ShopError('price_changed', 409);
    const order: Order = {
      id: `EB-${randomUUID().slice(0, 8).toUpperCase()}`,
      revision: 0,
      createdAt: new Date().toISOString(),
      status: 'new',
      paid: false,
      customer: details,
      zone: zone.name,
      deliveryFee: zone.fee,
      total,
      items: lines,
    };
    for (const product of products.values()) {
      product.revision++;
      await tx.execute({
        sql: 'UPDATE shop_products SET data=? WHERE id=?',
        args: [JSON.stringify(product), product.id],
      });
    }
    await tx.execute({
      sql: 'INSERT INTO shop_orders (id,request_key,request_hash,data) VALUES (?,?,?,?)',
      args: [order.id, key, hash, JSON.stringify(order)],
    });
    await queueNotification(tx, order.id, orderMessage(order));
    await tx.commit();
    return order;
  } finally {
    tx.close();
  }
}
export async function orders() {
  return (
    await (
      await db()
    ).execute('SELECT data FROM shop_orders ORDER BY rowid DESC LIMIT 500')
  ).rows.map((row) => JSON.parse(String(row.data)) as Order);
}
export async function updateOrder(input: unknown) {
  const o = object(input),
    orderId = id(o.id),
    revision = integer(o.revision);
  const status = text(o.status, 20) as OrderStatus;
  if (
    !['new', 'confirmed', 'delivering', 'delivered', 'cancelled'].includes(
      status,
    ) ||
    typeof o.paid !== 'boolean'
  )
    throw new ShopError('invalid');
  const tx = await (await db()).transaction('write');
  try {
    const result = await tx.execute({
      sql: 'SELECT data FROM shop_orders WHERE id=?',
      args: [orderId],
    });
    if (!result.rows.length) throw new ShopError('not_found', 404);
    const order = JSON.parse(String(result.rows[0].data)) as Order;
    if (order.revision !== revision) throw new ShopError('conflict', 409);
    if (order.status === 'cancelled' && status !== 'cancelled')
      throw new ShopError('cancelled');
    if (
      status === 'cancelled' &&
      (o.paid || order.paid || order.status === 'delivered')
    )
      throw new ShopError('cancel_paid');
    if (o.paid && status !== 'delivered') throw new ShopError('payment_status');
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const line of order.items) {
        const productResult = await tx.execute({
          sql: 'SELECT data FROM shop_products WHERE id=?',
          args: [line.productId],
        });
        const product: Product = JSON.parse(String(productResult.rows[0].data));
        const variant = product.variants.find((v) => v.id === line.variantId);
        if (!variant) throw new ShopError('conflict', 409);
        if (line.fulfillment === 'preorder')
          variant.preorderStock = (variant.preorderStock || 0) + line.quantity;
        else variant.stock += line.quantity;
        product.revision++;
        await tx.execute({
          sql: 'UPDATE shop_products SET data=? WHERE id=?',
          args: [JSON.stringify(product), product.id],
        });
      }
    }
    order.status = status;
    order.paid = o.paid;
    order.revision++;
    await tx.execute({
      sql: 'UPDATE shop_orders SET data=? WHERE id=?',
      args: [JSON.stringify(order), orderId],
    });
    await tx.commit();
    return order;
  } finally {
    tx.close();
  }
}
