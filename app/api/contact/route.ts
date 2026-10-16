import {after} from 'next/server';
import {checkOrigin,rateLimit,requestFingerprint} from '@/lib/shop/auth';
import {body,failure,json} from '@/lib/shop/http';
import {createContact} from '@/lib/shop/contact';
import {flushNotifications} from '@/lib/shop/notifications';
export async function POST(request:Request) {
  try {
    checkOrigin(request);
    await rateLimit(`contact:${requestFingerprint(request)}`,5,3600000);
    const contact=await createContact(await body(request,16000));
    after(flushNotifications);
    return json({id:contact.id},201);
  } catch(error){return failure(error);}
}
