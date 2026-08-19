/**
 * Card helpers used by the CARD provider.
 *
 * Nothing here ever persists or logs a PAN — the only card data that leaves
 * these functions is the brand, the last four digits and the expiry.
 */

export interface CardFingerprint {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

const BRAND_PATTERNS: { brand: string; pattern: RegExp }[] = [
  { brand: "visa", pattern: /^4\d{12}(\d{3})?(\d{3})?$/ },
  { brand: "mastercard", pattern: /^(5[1-5]\d{4}|222[1-9]\d{2}|22[3-9]\d{3}|2[3-6]\d{4}|27[01]\d{3}|2720\d{2})\d{10}$/ },
  { brand: "amex", pattern: /^3[47]\d{13}$/ },
  { brand: "discover", pattern: /^6(?:011|5\d{2}|4[4-9]\d)\d{12}$/ },
  { brand: "diners", pattern: /^3(?:0[0-5]|[68]\d)\d{11}$/ },
  { brand: "jcb", pattern: /^(?:2131|1800|35\d{3})\d{11}$/ },
  { brand: "unionpay", pattern: /^62\d{14,17}$/ },
];

export function normalizeCardNumber(input: string): string {
  return input.replace(/[\s-]/g, "");
}

export function detectBrand(number: string): string {
  const digits = normalizeCardNumber(number);
  return BRAND_PATTERNS.find((b) => b.pattern.test(digits))?.brand ?? "unknown";
}

/** Luhn mod-10 check — catches typos before we ever call the processor. */
export function passesLuhn(number: string): boolean {
  const digits = normalizeCardNumber(number);
  if (!/^\d{12,19}$/.test(digits)) return false;

  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits.charCodeAt(i) - 48;
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

export function isExpired(expMonth: number, expYear: number, now = new Date()): boolean {
  if (expMonth < 1 || expMonth > 12) return true;
  const year = expYear < 100 ? 2000 + expYear : expYear;
  // A card is valid through the last day of its expiry month.
  const expiresAfter = new Date(year, expMonth, 1);
  return expiresAfter <= now;
}

export function isValidCvc(cvc: string, brand: string): boolean {
  const expected = brand === "amex" ? 4 : 3;
  return new RegExp(`^\\d{${expected}}$`).test(cvc);
}

export function fingerprint(number: string, expMonth: number, expYear: number): CardFingerprint {
  const digits = normalizeCardNumber(number);
  return {
    brand: detectBrand(digits),
    last4: digits.slice(-4),
    expMonth,
    expYear: expYear < 100 ? 2000 + expYear : expYear,
  };
}

/**
 * Sandbox-only outcomes, mirroring the well-known Stripe test numbers so the
 * decline path can be exercised without provider credentials.
 */
export function sandboxOutcome(number: string): { approved: boolean; reason?: string } {
  const digits = normalizeCardNumber(number);
  switch (digits) {
    case "4000000000000002":
      return { approved: false, reason: "Your card was declined." };
    case "4000000000009995":
      return { approved: false, reason: "Your card has insufficient funds." };
    case "4000000000000069":
      return { approved: false, reason: "Your card has expired." };
    case "4000000000000127":
      return { approved: false, reason: "Your card's security code is incorrect." };
    default:
      return { approved: true };
  }
}
