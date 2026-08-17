import type { PaymentProviderKey, PaymentStatusValue } from "./api/types";

/**
 * Card helpers for the checkout form. These only guard against typos before we
 * hit the API — the real decision always comes back from the processor.
 */

export type CardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "diners"
  | "jcb"
  | "unionpay"
  | "unknown";

const BRAND_PATTERNS: { brand: CardBrand; pattern: RegExp }[] = [
  { brand: "visa", pattern: /^4/ },
  { brand: "mastercard", pattern: /^(5[1-5]|2[2-7])/ },
  { brand: "amex", pattern: /^3[47]/ },
  { brand: "discover", pattern: /^6(?:011|5|4[4-9])/ },
  { brand: "diners", pattern: /^3(?:0[0-5]|[68])/ },
  { brand: "jcb", pattern: /^(?:2131|1800|35)/ },
  { brand: "unionpay", pattern: /^62/ },
];

export const brandLabels: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  jcb: "JCB",
  unionpay: "UnionPay",
  unknown: "Card",
};

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function detectBrand(number: string): CardBrand {
  const digits = onlyDigits(number);
  if (!digits) return "unknown";
  return BRAND_PATTERNS.find((b) => b.pattern.test(digits))?.brand ?? "unknown";
}

/** Amex groups 4-6-5, everything else in fours. */
export function formatCardNumber(value: string): string {
  const digits = onlyDigits(value).slice(0, 19);
  const brand = detectBrand(digits);

  if (brand === "amex") {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
      .filter(Boolean)
      .join(" ");
  }
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value: string): string {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) {
    // Typing "5" jumps straight to "05/" — no need to remember the leading zero.
    return digits.length === 2 || Number(digits) > 1 ? digits.padStart(2, "0") : digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function parseExpiry(value: string): { month: number; year: number } | null {
  const digits = onlyDigits(value);
  if (digits.length !== 4) return null;

  const month = Number(digits.slice(0, 2));
  const year = 2000 + Number(digits.slice(2));
  if (month < 1 || month > 12) return null;
  return { month, year };
}

export function cvcLength(brand: CardBrand): number {
  return brand === "amex" ? 4 : 3;
}

export function passesLuhn(number: string): boolean {
  const digits = onlyDigits(number);
  if (digits.length < 12 || digits.length > 19) return false;

  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

export function isExpiryPast(month: number, year: number, now = new Date()): boolean {
  return new Date(year, month, 1) <= now;
}

export interface CardErrors {
  number?: string;
  expiry?: string;
  cvc?: string;
  holderName?: string;
}

export function validateCard(input: {
  number: string;
  expiry: string;
  cvc: string;
  holderName: string;
}): CardErrors {
  const errors: CardErrors = {};
  const brand = detectBrand(input.number);

  if (!passesLuhn(input.number)) errors.number = "Enter a valid card number.";

  const expiry = parseExpiry(input.expiry);
  if (!expiry) errors.expiry = "Use MM/YY.";
  else if (isExpiryPast(expiry.month, expiry.year)) errors.expiry = "That card has expired.";

  if (onlyDigits(input.cvc).length !== cvcLength(brand)) {
    errors.cvc = `Security code is ${cvcLength(brand)} digits.`;
  }

  if (input.holderName.trim().length < 2) errors.holderName = "Enter the name on the card.";

  return errors;
}

// ── Presentation helpers ───────────────────────────────────────────

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export const providerLabels: Record<PaymentProviderKey, string> = {
  STRIPE: "Stripe",
  PAYONEER: "Payoneer",
  CARD: "Credit / debit card",
};

export const statusCopy: Record<
  PaymentStatusValue,
  { label: string; tone: "positive" | "pending" | "negative" }
> = {
  PENDING: { label: "Awaiting payment", tone: "pending" },
  PROCESSING: { label: "Processing", tone: "pending" },
  REQUIRES_ACTION: { label: "Needs confirmation", tone: "pending" },
  SUCCEEDED: { label: "Paid", tone: "positive" },
  FAILED: { label: "Failed", tone: "negative" },
  CANCELLED: { label: "Cancelled", tone: "negative" },
  REFUNDED: { label: "Refunded", tone: "negative" },
};
