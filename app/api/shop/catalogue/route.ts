import {catalogue} from '@/lib/shop/service';
import {failure, json} from '@/lib/shop/http';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    return json(await catalogue());
  } catch (e) {
    return failure(e);
  }
}
