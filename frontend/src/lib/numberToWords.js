// Convert an integer age (0–999) to its English word form.
// Used by Finale.jsx so config `AGE: 19` renders as "Nineteen Years."
// automatically — no manual string edits needed per birthday.

const ONES = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
  "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
  "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

export function numberToWords(input) {
  const n = Math.floor(Math.abs(Number(input) || 0));
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`;
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (rest === 0) return `${ONES[h]} Hundred`;
  return `${ONES[h]} Hundred ${numberToWords(rest)}`;
}
