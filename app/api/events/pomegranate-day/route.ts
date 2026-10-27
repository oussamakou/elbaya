import {after} from 'next/server';
import {checkOrigin, rateLimit, requestFingerprint} from '@/lib/shop/auth';
import {body, failure, json} from '@/lib/shop/http';
import {flushNotifications} from '@/lib/shop/notifications';
import {requestSpot} from '@/lib/events/pomegranate';

// A guest's request for a spot at Pomegranate Day. Saved first; the owner alert is sent after the response.
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await rateLimit(`pomegranate:${requestFingerprint(request)}`, 12, 3600000);
    const result = await requestSpot(await body(request, 4000));
    if (!result.already) after(flushNotifications);
    return json(result, result.already ? 200 : 201);
  } catch (e) {
    return failure(e);
  }
}
