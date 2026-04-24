import type {ReactNode} from 'react';
import TrackedLink from './TrackedLink';

const phone = '97466290007';

function href(locale: string) {
  const text = locale === 'fr'
    ? 'Bonjour Mahdi, je voudrais verifier les disponibilites a Farm El Baya.'
    : 'Hi Mahdi, I would like to check availability at Farm El Baya.';
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export default function WhatsAppLink({
  locale,
  children,
  className = ''
}: {
  locale: string;
  children: ReactNode;
  className?: string;
}) {
  return <TrackedLink href={href(locale)} event="whatsapp_click" target="_blank" rel="noreferrer" className={className}>{children}</TrackedLink>;
}
