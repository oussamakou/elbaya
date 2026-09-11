import {db} from '@/lib/shop/db';
import {failure} from '@/lib/shop/http';
export async function GET(
  _request: Request,
  {params}: {params: Promise<{id: string}>},
) {
  const {id} = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response(null, {status: 404});
  try {
    const result = await (
      await db()
    ).execute({sql: 'SELECT data FROM shop_images WHERE id=?', args: [id]});
    if (!result.rows.length) return new Response(null, {status: 404});
    return new Response(result.rows[0].data as ArrayBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e) {
    return failure(e);
  }
}
