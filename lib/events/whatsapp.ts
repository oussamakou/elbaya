// Ready-to-send WhatsApp messages for Pomegranate Day guests (client-safe: no server imports).
export type WhatsappKind = 'new' | 'confirmed' | 'waitlist' | 'declined';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Farm+Elbaya+Testour+Tunisia';

export function whatsappMessage(name: string, kind: WhatsappKind) {
  const first = name.trim().split(/\s+/)[0] || name;
  const hello = `Hello ${first}, this is Farm Elbaya 🌿`;
  if (kind === 'confirmed')
    return [
      hello,
      '',
      'Your spot for Pomegranate Day is confirmed.',
      'Sunday 1 November · 3 – 7 pm · Testour',
      `Find the farm: ${MAPS}`,
      '',
      'If your plans change, just tell us here so we can offer your spot to someone else.',
      'نستناوكم 🤍',
    ].join('\n');
  if (kind === 'waitlist')
    return [
      hello,
      '',
      'Thank you for your request for Pomegranate Day. All places are taken for now, so you are on our waiting list.',
      'If a spot opens, we will message you straight away.',
    ].join('\n');
  if (kind === 'declined')
    return [
      hello,
      '',
      'Thank you for wanting to join Pomegranate Day. This time all the places are taken, and we could not offer you one.',
      'You will be among the first to hear about our next day at the farm. 🤍',
    ].join('\n');
  return [hello, '', 'About your request for Pomegranate Day (Sunday 1 November, 3 – 7 pm):'].join('\n');
}

export function whatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

// "+21622123456" → "+216 22 123 456"; other numbers are shown as stored.
export function displayWhatsapp(phone: string) {
  const m = /^\+216([0-9]{2})([0-9]{3})([0-9]{3})$/.exec(phone);
  return m ? `+216 ${m[1]} ${m[2]} ${m[3]}` : phone;
}
