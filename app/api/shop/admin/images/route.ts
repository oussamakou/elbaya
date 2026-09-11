import sharp from 'sharp';
import {randomUUID} from 'node:crypto';
import {db} from '@/lib/shop/db';
import {checkOrigin, requireAdmin} from '@/lib/shop/auth';
import {failure, json} from '@/lib/shop/http';
import {ShopError} from '@/lib/shop/validation';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await requireAdmin();
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(
        request.headers.get('content-type') || '',
      )
    )
      throw new ShopError('image');
    const reader = request.body?.getReader();
    if (!reader) throw new ShopError('image');
    const parts: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 3 * 1024 * 1024) {
        await reader.cancel();
        throw new ShopError('image_size', 413);
      }
      parts.push(value);
    }
    let data: Buffer;
    try {
      data = await sharp(Buffer.concat(parts), {limitInputPixels: 25000000})
        .rotate()
        .resize(1400, 1400, {fit: 'inside', withoutEnlargement: true})
        .webp({quality: 82})
        .toBuffer();
    } catch {
      throw new ShopError('image');
    }
    if (data.length > 1500000) throw new ShopError('image_size', 413);
    const imageId = randomUUID();
    await (
      await db()
    ).execute({
      sql: 'INSERT INTO shop_images (id,data) VALUES (?,?)',
      args: [imageId, data],
    });
    return json({url: `/api/shop/images/${imageId}`}, 201);
  } catch (e) {
    return failure(e);
  }
}
