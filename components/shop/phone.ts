// Stored numbers are local (8 digits) or carry +216 / 00216.
export function internationalDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00216")) return digits.slice(2);
  return digits.length === 8 ? `216${digits}` : digits;
}
export function displayPhone(phone: string) {
  const digits = internationalDigits(phone);
  return digits.length === 11 && digits.startsWith("216")
    ? `+216 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
    : phone;
}
export function whatsappHref(phone: string, text: string) {
  return `https://wa.me/${internationalDigits(phone)}?text=${encodeURIComponent(text)}`;
}
