import {
  adminConfigured,
  checkOrigin,
  COOKIE,
  passwordMatches,
  sessionToken,
  rateLimit,
  requestFingerprint,
  revokeSession,
} from '@/lib/shop/auth';
import {body, failure, json} from '@/lib/shop/http';
import {object, text, ShopError} from '@/lib/shop/validation';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    if (!adminConfigured()) throw new ShopError('setup', 503);
    await rateLimit(`login:${requestFingerprint(request)}`, 10, 15 * 60000);
    const input = object(await body(request, 2048));
    if (!passwordMatches(text(input.password, 256)))
      throw new ShopError('credentials', 401);
    const response = json({ok: true});
    response.cookies.set(COOKIE, await sessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 3600,
    });
    return response;
  } catch (e) {
    return failure(e);
  }
}
export async function DELETE(request: Request) {
  try {
    checkOrigin(request);
    await revokeSession();
    const response = json({ok: true});
    response.cookies.set(COOKIE, '', {path: '/', maxAge: 0});
    return response;
  } catch (e) {
    return failure(e);
  }
}
