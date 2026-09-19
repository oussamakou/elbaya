import {
  createHmac,
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';
import {cookies} from 'next/headers';
import {db} from './db';
import {ShopError} from './validation';

export const COOKIE = 'elbaya_shop_admin';
export function adminConfigured() {
  return Boolean(
    process.env.SHOP_ADMIN_PASSWORD_HASH &&
    process.env.SHOP_SESSION_SECRET &&
    process.env.SHOP_SESSION_SECRET.length >= 32,
  );
}
export function passwordMatches(password: string) {
  const [salt, hash] = (process.env.SHOP_ADMIN_PASSWORD_HASH || '').split(':');
  if (!salt || !hash || !/^[a-f0-9]{128}$/.test(hash)) return false;
  return timingSafeEqual(
    scryptSync(password, salt, 64),
    Buffer.from(hash, 'hex'),
  );
}
function sign(value: string) {
  return createHmac('sha256', process.env.SHOP_SESSION_SECRET!)
    .update(value + process.env.SHOP_ADMIN_PASSWORD_HASH)
    .digest('hex');
}
export async function sessionToken() {
  const expires = Date.now() + 8 * 3600000;
  const payload = `${expires}.${randomBytes(16).toString('hex')}`;
  const token = `${payload}.${sign(payload)}`;
  await (
    await db()
  ).batch(
    [
      {sql: 'DELETE FROM shop_sessions WHERE expires <= ?', args: [Date.now()]},
      {
        sql: 'INSERT INTO shop_sessions (id, expires) VALUES (?,?)',
        args: [createHash('sha256').update(token).digest('hex'), expires],
      },
    ],
    'write',
  );
  return token;
}
export async function revokeSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (token)
    await (
      await db()
    ).execute({
      sql: 'DELETE FROM shop_sessions WHERE id=?',
      args: [createHash('sha256').update(token).digest('hex')],
    });
}
export async function isAdmin() {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value || '';
  const [expires, nonce, signature] = token.split('.');
  if (
    !expires ||
    !nonce ||
    !signature ||
    !Number.isSafeInteger(Number(expires)) ||
    Number(expires) <= Date.now() ||
    token.split('.').length !== 3 ||
    !/^[a-f0-9]{32}$/.test(nonce) ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    return false;
  if (
    !timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(sign(`${expires}.${nonce}`), 'hex'),
    )
  )
    return false;
  const result = await (
    await db()
  ).execute({
    sql: 'SELECT id FROM shop_sessions WHERE id=? AND expires>?',
    args: [createHash('sha256').update(token).digest('hex'), Date.now()],
  });
  return result.rows.length === 1;
}
export async function requireAdmin() {
  if (!(await isAdmin())) throw new ShopError('unauthorized', 401);
}
export function checkOrigin(request: Request) {
  const expected = process.env.SHOP_ORIGIN || new URL(request.url).origin;
  if (request.headers.get('origin') !== expected)
    throw new ShopError('origin', 403);
}
export async function rateLimit(key: string, limit: number, windowMs: number) {
  const client = await db();
  const now = Date.now();
  const result = await client.execute({
    sql: `INSERT INTO shop_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires <= ? THEN 1 ELSE count+1 END, expires=CASE WHEN expires <= ? THEN excluded.expires ELSE expires END RETURNING count`,
    args: [key, now + windowMs, now, now],
  });
  if (Number(result.rows[0].count) > limit)
    throw new ShopError('rate_limit', 429);
  await client.execute({
    sql: 'DELETE FROM shop_limits WHERE expires < ?',
    args: [now - 86400000],
  });
}
export function requestFingerprint(request: Request) {
  // Vercel overwrites this header. Other deployments share a conservative global bucket.
  const ip = process.env.VERCEL
    ? request.headers.get('x-vercel-forwarded-for') || 'shared'
    : 'shared';
  return createHmac(
    'sha256',
    process.env.SHOP_SESSION_SECRET || 'shop-rate-limit',
  )
    .update(ip)
    .digest('hex');
}
