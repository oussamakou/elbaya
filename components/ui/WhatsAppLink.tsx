import type {ReactNode} from 'react';
import TrackedLink from './TrackedLink';

export const WHATSAPP_PHONE = '97466290007';

function href(locale: string, message?: string) {
  const text = message
    ? message
    : locale === 'fr'
      ? 'Bonjour Mahdi, je voudrais vérifier les disponibilités à Farm El Baya.'
      : 'Hi Mahdi, I would like to check availability at Farm El Baya.';
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export default function WhatsAppLink({
  locale,
  children,
  className = '',
  message,
  event = 'whatsapp_click'
}: {
  locale: string;
  children: ReactNode;
  className?: string;
  message?: string;
  event?: string;
}) {
  return <TrackedLink href={href(locale, message)} event={event} target="_blank" rel="noreferrer" className={className}>{children}</TrackedLink>;
}
