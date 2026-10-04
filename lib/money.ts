export const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "\u20A6",
  USD: "$",
  GHS: "\u20B5",
  KES: "KSh ",
  ZAR: "R",
  GBP: "\u00A3",
  EUR: "\u20AC"
};

export function formatMoney(amountMinor: number, currency = "NGN"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  const value = (amountMinor / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${symbol}${value}`;
}

export function toMinor(amountMajor: number): number {
  return Math.round(amountMajor * 100);
}