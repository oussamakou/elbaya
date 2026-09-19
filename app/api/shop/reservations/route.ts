import {checkOrigin, rateLimit, requestFingerprint} from '@/lib/shop/auth';
import {body, failure, json} from '@/lib/shop/http';
import {createReservation} from '@/lib/shop/reservations';
import {after} from 'next/server';
import {flushNotifications} from '@/lib/shop/notifications';
export async function POST(request: Request) {
  try {checkOrigin(request); await rateLimit(`reservation:${requestFingerprint(request)}`, 15, 3600000); const result = await createReservation(await body(request)); after(flushNotifications); return json({id: result.id}, 201);} catch (e) {return failure(e);}
}
