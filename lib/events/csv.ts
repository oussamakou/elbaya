// CSV quoting alone does not stop Excel from evaluating a formula.
export function csvCell(value: string) {
  const safe = /^[\s\u0000-\u001f]*[=+@-]/.test(value) || /^[\t\r\n]/.test(value)
    ? `'${value}`
    : value;
  return /[",;\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}
