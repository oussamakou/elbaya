import {createClient, type Client} from '@libsql/client';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import type {Product} from './types';

let client: Client | undefined;
let initialized: Promise<void> | undefined;
export const seedProducts: Product[] = [
  {
    id: 'pomegranates',
    revision: 0,
    name: {fr: 'Les grenades', en: 'Pomegranates'},
    description: {
      fr: 'Les fruits de la ferme, au rythme des saisons. Les formats, les prix et la prochaine disponibilité seront annoncés ici.',
      en: 'Fruit from the farm, in its own season. Pack sizes, prices and the next availability will be announced here.',
    },
    category: 'fruit',
    status: 'seasonal',
    images: ['/assets/shop/pomegranate.svg'],
    variants: [
      {id: 'box-3', label: '3 kg', price: 0, stock: 0},
    ],
  },
  {
    id: 'olive-oil',
    revision: 0,
    name: {fr: 'L’huile d’olive', en: 'Olive oil'},
    description: {
      fr: 'La suite de notre collection. Retrouvez ici les prochaines disponibilités de l’huile d’olive de la ferme.',
      en: 'The next chapter of our collection. Look here for upcoming availability of the farm’s olive oil.',
    },
    category: 'oil',
    status: 'seasonal',
    images: ['/assets/shop/olive.svg'],
    variants: [
      {id: 'bottle-1', label: '1 L', price: 0, stock: 0},
    ],
  },
  {
    id: 'honey',
    revision: 0,
    name: {fr: 'Le miel', en: 'Honey'},
    description: {
      fr: 'Une nouvelle douceur dans le garde-manger d’El Baya. Les formats, les prix et les disponibilités seront annoncés ici.',
      en: 'Something sweet for the El Baya pantry. Sizes, prices and availability will be announced here.',
    },
    category: 'honey',
    status: 'seasonal',
    images: ['/assets/shop/honey.svg'],
    variants: [
      {id: 'jar-250', label: '250 g', price: 0, stock: 0},
    ],
  },
];

export function storageConfigured() {
  return (
    Boolean(process.env.SHOP_DATABASE_URL || process.env.TURSO_DATABASE_URL) ||
    process.env.NODE_ENV !== 'production'
  );
}
export async function db(): Promise<Client> {
  if (!storageConfigured())
    throw new Error('SHOP_DATABASE_URL is required in production.');
  if (!client) {
    let url = process.env.SHOP_DATABASE_URL || process.env.TURSO_DATABASE_URL;
    if (!url) {
      mkdirSync(resolve('.shop'), {recursive: true});
      url = `file:${resolve('.shop/shop.db').replaceAll('\\', '/')}`;
    }
    if (process.env.VERCEL && url.startsWith('file:'))
      throw new Error('A remote database is required on Vercel.');
    client = createClient({
      url,
      authToken: process.env.SHOP_DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN,
    });
  }
  const active = client;
  initialized ??= (async () => {
    await active.batch(
      [
        'CREATE TABLE IF NOT EXISTS shop_products (id TEXT PRIMARY KEY, data TEXT NOT NULL)',
        'CREATE TABLE IF NOT EXISTS shop_settings (id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL)',
        'CREATE TABLE IF NOT EXISTS shop_orders (id TEXT PRIMARY KEY, request_key TEXT UNIQUE NOT NULL, request_hash TEXT NOT NULL, data TEXT NOT NULL)',
        'CREATE TABLE IF NOT EXISTS shop_images (id TEXT PRIMARY KEY, data BLOB NOT NULL)',
        'CREATE TABLE IF NOT EXISTS shop_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL)',
        'CREATE TABLE IF NOT EXISTS shop_sessions (id TEXT PRIMARY KEY, expires INTEGER NOT NULL)',
        'CREATE TABLE IF NOT EXISTS shop_notifications (id TEXT PRIMARY KEY, data TEXT NOT NULL, sent_at INTEGER, next_attempt INTEGER NOT NULL DEFAULT 0, lease TEXT)',
        'CREATE TABLE IF NOT EXISTS shop_reservations (id TEXT PRIMARY KEY, request_key TEXT UNIQUE NOT NULL, request_hash TEXT NOT NULL, data TEXT NOT NULL)',
        ...seedProducts.map((p) => ({
          sql: 'INSERT OR IGNORE INTO shop_products (id, data) VALUES (?, ?)',
          args: [p.id, JSON.stringify(p)],
        })),
        {
          sql: 'INSERT OR IGNORE INTO shop_settings (id,data) VALUES (1,?)',
          args: [
            JSON.stringify({revision: 0, acceptingOrders: false, zones: []}),
          ],
        },
      ],
      'write',
    );
  })().catch((error) => {
    initialized = undefined;
    throw error;
  });
  await initialized;
  return active;
}
