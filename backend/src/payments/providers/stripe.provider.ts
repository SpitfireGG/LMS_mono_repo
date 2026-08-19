import {
  Injectable,
  Logger,
  BadRequestException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";
import {
  CheckoutContext,
  HostedCheckout,
  ProviderPaymentSnapshot,
  ProviderPaymentState,
} from "./payment-provider.interface";

const STRIPE_API = "https://api.stripe.com/v1";
const STRIPE_API_VERSION = "2024-06-20";

/** Currencies Stripe expects in whole units rather than cents. */
const ZERO_DECIMAL = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
  "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);

export interface RawCardInput {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  holderName?: string;
}

export interface IntentResult extends ProviderPaymentSnapshot {
  clientSecret?: string;
  card?: { brand: string; last4: string; expMonth: number; expYear: number };
}

/**
 * Thin Stripe REST client.
 *
 * We talk to the HTTP API directly rather than pulling in the SDK: the three
 * calls we need (Checkout Session, PaymentIntent, webhook verification) are
 * form-encoded requests, and this keeps the backend dependency-free.
 */
@Injectable()
export class StripeProvider {
  private readonly logger = new Logger(StripeProvider.name);

  private get secretKey(): string | undefined {
    return process.env.STRIPE_SECRET_KEY || undefined;
  }

  get publishableKey(): string | undefined {
    return process.env.STRIPE_PUBLISHABLE_KEY || undefined;
  }

  get isConfigured(): boolean {
    return !!this.secretKey;
  }

  /** Stripe rejects raw PANs unless the account is PCI-certified — opt-in only. */
  get allowsRawCard(): boolean {
    return process.env.PAYMENTS_ALLOW_RAW_CARD === "true";
  }

  toMinorUnits(amount: number, currency: string): number {
    return ZERO_DECIMAL.has(currency.toLowerCase())
      ? Math.round(amount)
      : Math.round(amount * 100);
  }

  async createCheckoutSession(ctx: CheckoutContext): Promise<HostedCheckout> {
    const session = await this.request<any>("POST", "/checkout/sessions", {
      mode: "payment",
      client_reference_id: ctx.reference,
      customer_email: ctx.customerEmail,
      success_url: ctx.successUrl,
      cancel_url: ctx.cancelUrl,
      "line_items[0][quantity]": 1,
      "line_items[0][price_data][currency]": ctx.currency.toLowerCase(),
      "line_items[0][price_data][unit_amount]": this.toMinorUnits(ctx.amount, ctx.currency),
      "line_items[0][price_data][product_data][name]": ctx.courseTitle,
      "line_items[0][price_data][product_data][description]": ctx.description,
      "metadata[paymentId]": ctx.paymentId,
      "metadata[reference]": ctx.reference,
      "payment_intent_data[metadata][paymentId]": ctx.paymentId,
      "payment_intent_data[metadata][reference]": ctx.reference,
    });

    if (!session.url) {
      throw new ServiceUnavailableException("Stripe did not return a checkout URL");
    }

    return { providerRef: session.id, checkoutUrl: session.url };
  }

  /**
   * Card path. Prefer `paymentMethodId` produced by Stripe.js in the browser;
   * raw card details are only forwarded when PAYMENTS_ALLOW_RAW_CARD is set.
   */
  async createCardPayment(
    ctx: CheckoutContext,
    input: { paymentMethodId?: string; card?: RawCardInput },
  ): Promise<IntentResult> {
    let paymentMethodId = input.paymentMethodId;

    if (!paymentMethodId) {
      if (!input.card) {
        throw new BadRequestException("Card details are required");
      }
      if (!this.allowsRawCard) {
        throw new BadRequestException(
          "This account cannot accept raw card numbers. Tokenize the card with Stripe.js and send paymentMethodId instead.",
        );
      }
      const method = await this.request<any>("POST", "/payment_methods", {
        type: "card",
        "card[number]": input.card.number,
        "card[exp_month]": input.card.expMonth,
        "card[exp_year]": input.card.expYear,
        "card[cvc]": input.card.cvc,
        ...(input.card.holderName ? { "billing_details[name]": input.card.holderName } : {}),
        "billing_details[email]": ctx.customerEmail,
      });
      paymentMethodId = method.id;
    }

    if (!paymentMethodId) {
      throw new BadRequestException("Stripe did not return a usable payment method");
    }

    const intent = await this.request<any>("POST", "/payment_intents", {
      amount: this.toMinorUnits(ctx.amount, ctx.currency),
      currency: ctx.currency.toLowerCase(),
      description: ctx.description,
      confirm: true,
      payment_method: paymentMethodId,
      receipt_email: ctx.customerEmail,
      return_url: ctx.successUrl,
      "automatic_payment_methods[enabled]": true,
      "metadata[paymentId]": ctx.paymentId,
      "metadata[reference]": ctx.reference,
    });

    return this.toIntentResult(intent);
  }

  async retrieveCheckoutSession(sessionId: string): Promise<ProviderPaymentSnapshot> {
    const session = await this.request<any>("GET", `/checkout/sessions/${sessionId}`);
    return {
      providerRef: session.id,
      state: this.mapSessionStatus(session),
      failureReason: session.status === "expired" ? "Checkout session expired" : undefined,
      actionUrl: session.status === "open" ? session.url : undefined,
    };
  }

  async retrievePaymentIntent(intentId: string): Promise<IntentResult> {
    const intent = await this.request<any>("GET", `/payment_intents/${intentId}`);
    return this.toIntentResult(intent);
  }

  /**
   * Verifies the `Stripe-Signature` header against the raw request body.
   * Mirrors Stripe's scheme: HMAC-SHA256 over `${timestamp}.${payload}`.
   */
  verifyWebhook(rawBody: Buffer | string, signatureHeader: string | undefined): any {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw new ServiceUnavailableException("STRIPE_WEBHOOK_SECRET is not configured");
    }
    if (!signatureHeader) {
      throw new UnauthorizedException("Missing Stripe-Signature header");
    }

    const parts = signatureHeader.split(",").reduce<Record<string, string[]>>((acc, part) => {
      const [key, value] = part.split("=");
      if (key && value) (acc[key.trim()] ??= []).push(value.trim());
      return acc;
    }, {});

    const timestamp = parts.t?.[0];
    const signatures = parts.v1 ?? [];
    if (!timestamp || signatures.length === 0) {
      throw new UnauthorizedException("Malformed Stripe-Signature header");
    }

    const toleranceSeconds = parseInt(process.env.STRIPE_WEBHOOK_TOLERANCE ?? "300", 10);
    const age = Math.abs(Date.now() / 1000 - Number(timestamp));
    if (!Number.isFinite(age) || age > toleranceSeconds) {
      throw new UnauthorizedException("Stripe webhook timestamp outside tolerance");
    }

    const payload = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : rawBody;
    const expected = createHmac("sha256", secret)
      .update(`${timestamp}.${payload}`, "utf8")
      .digest("hex");

    const matches = signatures.some((candidate) => {
      const a = Buffer.from(expected, "utf8");
      const b = Buffer.from(candidate, "utf8");
      return a.length === b.length && timingSafeEqual(a, b);
    });
    if (!matches) throw new UnauthorizedException("Invalid Stripe webhook signature");

    return JSON.parse(payload);
  }

  private toIntentResult(intent: any): IntentResult {
    const card = intent.charges?.data?.[0]?.payment_method_details?.card;
    return {
      providerRef: intent.id,
      state: this.mapIntentStatus(intent.status),
      failureReason: intent.last_payment_error?.message,
      actionUrl:
        intent.next_action?.redirect_to_url?.url ??
        intent.next_action?.use_stripe_sdk?.stripe_js ??
        undefined,
      clientSecret: intent.client_secret,
      card: card
        ? {
            brand: card.brand,
            last4: card.last4,
            expMonth: card.exp_month,
            expYear: card.exp_year,
          }
        : undefined,
    };
  }

  private mapIntentStatus(status: string): ProviderPaymentState {
    switch (status) {
      case "succeeded":
        return "succeeded";
      case "processing":
        return "processing";
      case "requires_action":
      case "requires_confirmation":
        return "requires_action";
      case "requires_payment_method":
        return "failed";
      case "canceled":
        return "cancelled";
      default:
        return "pending";
    }
  }

  private mapSessionStatus(session: any): ProviderPaymentState {
    if (session.payment_status === "paid") return "succeeded";
    if (session.status === "expired") return "cancelled";
    if (session.payment_status === "unpaid" && session.status === "complete") return "processing";
    return "pending";
  }

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    body?: Record<string, string | number | boolean>,
  ): Promise<T> {
    if (!this.secretKey) {
      throw new ServiceUnavailableException("Stripe is not configured");
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.secretKey}`,
      "Stripe-Version": STRIPE_API_VERSION,
    };
    const url = `${STRIPE_API}${path}`;
    let payload: string | undefined;

    if (body && method === "POST") {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      payload = new URLSearchParams(
        Object.entries(body).map(([k, v]) => [k, String(v)]),
      ).toString();
    }

    const response = await fetch(url, { method, headers, body: payload });
    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = (json as any)?.error?.message ?? `Stripe request failed (${response.status})`;
      this.logger.warn(`Stripe ${method} ${path} -> ${response.status}: ${message}`);
      // Card errors are the customer's problem to fix; everything else is ours.
      if ((json as any)?.error?.type === "card_error" || response.status === 402) {
        throw new BadRequestException(message);
      }
      throw new ServiceUnavailableException(message);
    }

    return json as T;
  }
}
