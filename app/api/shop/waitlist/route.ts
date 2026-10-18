import {checkOrigin, rateLimit, requestFingerprint} from '@/lib/shop/auth';
import {body, failure, json} from '@/lib/shop/http';
import {joinWaitlist} from '@/lib/shop/waitlist';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await rateLimit(`waitlist:${requestFingerprint(request)}`, 20, 3600000);
    return json(await joinWaitlist(await body(request, 4000)), 201);
  } catch (e) {
    return failure(e);
  }
}
