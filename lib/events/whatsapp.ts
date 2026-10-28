// Ready-to-send WhatsApp messages for Pomegranate Day guests (client-safe: no server imports).
export type WhatsappKind = 'new' | 'confirmed' | 'waitlist' | 'declined';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Farm+Elbaya+Testour+Tunisia';

export function whatsappMessage(name: string, kind: WhatsappKind, companions: string[] = []) {
  const first = name.trim().split(/\s+/)[0] || name;
  const hello = `Hello ${first}, this is Farm Elbaya 🌿`;
  if (kind === 'confirmed') {
    const names = companions.length > 1 ? `${companions.slice(0, -1).join(', ')} and ${companions[companions.length - 1]}` : companions[0];
    return [
      `Hello ${first}, مرحبا بيك 🌿`,
      '',
      companions.length
        ? `We are so happy to tell you that your spots for Pomegranate Day are confirmed, for you and ${names}.`
        : 'We are so happy to tell you that your spot for Pomegranate Day is confirmed.',
      '',
      'يوم الرمّان في فيرمة البية',
      'Sunday 1 November · 3 – 7 pm · Testour',
      '',
      '3:00 pm · Arrival and farm walk',
      'Harvest and tasting of our first products',
      '5:30 pm · Sunset together on the rooftop',
      '',
      'Find the farm:',
      `📍 ${MAPS}`,
      '',
      'Wear comfortable shoes for the walk among the trees.',
      'If your plans change, just tell us here so we can offer your spot to someone else.',
      '',
      'The farm is ready to welcome you. نستناوك 🤍',
      'Farm Elbaya',
    ].join('\n');
  }
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
