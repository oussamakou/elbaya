import {setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/content';
import ContactSection from '@/components/sections/ContactSection';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  return buildMetadata(locale,'/contact',{title:locale==='fr'?'Contactez Mehdi | Farm El Baya':'Contact Mehdi | Farm El Baya',description:locale==='fr'?'Une question sur la ferme, les séjours ou les expériences ? Envoyez un message à Mehdi.':'Questions about the farm, stays or experiences? Send Mehdi a message.'},'room2.webp');
}
export default async function Contact({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;setRequestLocale(locale);
  return <ContactSection locale={locale} standalone/>;
}
