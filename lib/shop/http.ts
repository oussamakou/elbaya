import {NextResponse} from 'next/server';
import {ShopError} from './validation';
export const json = (value: unknown, status = 200) =>
  NextResponse.json(value, {
    status,
    headers: {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'},
  });
export async function body(request: Request, max = 64000) {
  if (!request.headers.get('content-type')?.includes('application/json'))
    throw new ShopError('invalid', 415);
  const reader = request.body?.getReader();
  if (!reader) throw new ShopError('invalid');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const {value, done} = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw new ShopError('too_large', 413);
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new ShopError('invalid');
  }
}
export function failure(error: unknown) {
  if (error instanceof ShopError)
    return json({error: error.code}, error.status);
  console.error(
    'Shop operation failed',
    error instanceof Error ? error.message : 'unknown',
  );
  return json({error: 'unavailable'}, 503);
}
