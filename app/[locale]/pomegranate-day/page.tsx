import type {Metadata} from 'next';
import {Cormorant_Garamond, Lateef, Noto_Kufi_Arabic} from 'next/font/google';
import localFont from 'next/font/local';
import {setRequestLocale} from 'next-intl/server';
import PomegranateDay from '@/components/events/PomegranateDay';
import {calendarLinks, EVENT, publicState} from '@/lib/events/pomegranate';

const cormorant = Cormorant_Garamond({subsets: ['latin'], weight: ['500', '600'], style: ['italic'], variable: '--pd-cormorant', display: 'swap'});
// Bundle the variable font directly to avoid the Google font URL resolver failing on Vercel.
const dmSans = localFont({src: '../../../public/fonts/dm-sans.ttf', weight: '100 1000', variable: '--pd-dm-sans', display: 'swap'});
const lateef = Lateef({subsets: ['arabic'], weight: ['200', '300'], variable: '--pd-lateef', display: 'swap'});
const kufi = Noto_Kufi_Arabic({subsets: ['arabic'], weight: ['100'], variable: '--pd-kufi', display: 'swap'});

// Unlisted: shared in the farm's WhatsApp community only. Not in the menu or the sitemap, and not indexed.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Pomegranate Day · Farm Elbaya',
  description: 'Sunday 1 November, 3 – 7 pm at Farm Elbaya, Testour. An afternoon for our community.',
  robots: {index: false, follow: false},
  openGraph: {
    title: 'Pomegranate Day · Farm Elbaya',
    description: 'Sunday 1 November, 3 – 7 pm at the farm in Testour. Walk, harvest, tasting and sunset on the rooftop.',
  },
};

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  let state = {open: true, full: false};
  try {
    state = await publicState();
  } catch {
    // The form still renders; a failed submit shows a retry message.
  }
  return (
    <PomegranateDay
      fontClass={`${cormorant.variable} ${dmSans.variable} ${lateef.variable} ${kufi.variable}`}
      open={state.open}
      full={state.full}
      calendar={calendarLinks}
      maps={EVENT.maps}
    />
  );
}
