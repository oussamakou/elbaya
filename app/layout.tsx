import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import {Cormorant_Garamond, DM_Sans} from 'next/font/google';
import {Analytics} from '@vercel/analytics/next';
import {SpeedInsights} from '@vercel/speed-insights/next';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap'
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://farmelbaya.com'),
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html suppressHydrationWarning className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
