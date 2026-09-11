import {catalogue} from '@/lib/shop/service';
import ReservationPage from '@/components/shop/ReservationPage';
import '@/components/shop/shop.css';
export const dynamic='force-dynamic';
export const metadata={title:'Précommandes · Farm El Baya'};
export default async function Page({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{product?:string}>}) {const {locale}=await params;const query=await searchParams;const {products}=await catalogue();return <ReservationPage products={products} locale={locale==='fr'?'fr':'en'} productId={query.product}/>;}
