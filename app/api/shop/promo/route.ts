import {checkOrigin, rateLimit, requestFingerprint} from '@/lib/shop/auth';
import {body, failure, json} from '@/lib/shop/http';
import {checkPromo} from '@/lib/shop/promo';
// Rate-limited so codes cannot be guessed by trying many in a row.
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await rateLimit(`promo:${requestFingerprint(request)}`, 20, 3600000);
    return json(await checkPromo(await body(request, 1000)));
  } catch (e) {
    return failure(e);
  }
}
