import {checkOrigin, rateLimit, requestFingerprint} from '@/lib/shop/auth';
import {createOrder} from '@/lib/shop/service';
import {body, failure, json} from '@/lib/shop/http';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await rateLimit(`order:${requestFingerprint(request)}`, 30, 3600000);
    const order = await createOrder(await body(request));
    return json(
      {
        id: order.id,
        total: order.total,
        preorder: order.items.some((i) => i.fulfillment === 'preorder'),
      },
      201,
    );
  } catch (e) {
    return failure(e);
  }
}
