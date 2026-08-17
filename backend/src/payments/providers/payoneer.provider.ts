import {
  Injectable,
  Logger,
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

/**
 * Payoneer Checkout (Open Payment Platform) client.
 *
 * Flow: we create a payment "list session" for the order, Payoneer answers with
 * a hosted page URL, the customer pays there and is bounced back to
 * successUrl/cancelUrl while Payoneer also POSTs a notification to us.
 *
 * Endpoints and credentials come from the merchant onboarding pack:
 *   PAYONEER_API_BASE      https://api.sandbox.oscato.com  (live: https://api.oscato.com)
 *   PAYONEER_MERCHANT_CODE merchant code / division code
 *   PAYONEER_API_KEY       API token used as the basic-auth password
 */
@Injectable()
export class PayoneerProvider {
  private readonly logger = new Logger(PayoneerProvider.name);

  private get apiBase(): string {
    return (process.env.PAYONEER_API_BASE ?? "https://api.sandbox.oscato.com").replace(/\/$/, "");
  }

  private get merchantCode(): string | undefined {
    return process.env.PAYONEER_MERCHANT_CODE || undefined;
  }

  private get apiKey(): string | undefined {
    return process.env.PAYONEER_API_KEY || undefined;
  }

  private get division(): string | undefined {
    return process.env.PAYONEER_DIVISION || process.env.PAYONEER_MERCHANT_CODE || undefined;
  }

  get isConfigured(): boolean {
    return !!this.merchantCode && !!this.apiKey;
  }

  async createHostedCheckout(ctx: CheckoutContext): Promise<HostedCheckout> {
    const body = {
      transactionId: ctx.reference,
      country: process.env.PAYONEER_COUNTRY ?? "AU",
      integration: "HOSTED",
      division: this.division,
      customer: {
        email: ctx.customerEmail,
        name: { firstName: ctx.customerName.split(" ")[0], lastName: ctx.customerName.split(" ").slice(1).join(" ") || "-" },
      },
      payment: {
        amount: Number(ctx.amount.toFixed(2)),
        currency: ctx.currency,
        reference: ctx.description,
      },
      callback: {
        returnUrl: ctx.successUrl,
        cancelUrl: ctx.cancelUrl,
        summaryUrl: ctx.successUrl,
        notificationUrl: ctx.notificationUrl,
      },
      products: [
        {
          code: ctx.paymentId,
          name: ctx.courseTitle,
          amount: Number(ctx.amount.toFixed(2)),
          quantity: 1,
        },
      ],
    };

    const list = await this.request<any>("POST", "/api/lists", body);

    const checkoutUrl: string | undefined =
      list.redirect?.url ?? list.links?.customer ?? list.links?.hostedPage ?? list.links?.self;
    const providerRef: string | undefined = list.identification?.longId ?? list.identification?.shortId ?? list.id;

    if (!checkoutUrl || !providerRef) {
      this.logger.error(`Unexpected Payoneer list response: ${JSON.stringify(list).slice(0, 500)}`);
      throw new ServiceUnavailableException("Payoneer did not return a hosted checkout URL");
    }

    return { providerRef, checkoutUrl };
  }

  async retrieveList(listId: string): Promise<ProviderPaymentSnapshot> {
    const list = await this.request<any>("GET", `/api/lists/${listId}`);
    return {
      providerRef: listId,
      state: this.mapStatus(list.status?.code ?? list.status?.reason),
      failureReason: list.status?.reason && list.status?.code !== "charged" ? list.status.reason : undefined,
      actionUrl: list.redirect?.url,
    };
  }

  /**
   * Payoneer notifications are authenticated with a shared secret that the
   * merchant configures alongside the notification URL. When
   * PAYONEER_NOTIFICATION_SECRET is set we require a matching signature.
   */
  verifyNotification(rawBody: Buffer | string, signature: string | undefined): void {
    const secret = process.env.PAYONEER_NOTIFICATION_SECRET;
    if (!secret) return;

    if (!signature) throw new UnauthorizedException("Missing Payoneer notification signature");

    const payload = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : rawBody;
    const expected = createHmac("sha256", secret).update(payload, "utf8").digest("hex");
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature.replace(/^sha256=/, ""), "utf8");

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException("Invalid Payoneer notification signature");
    }
  }

  mapStatus(code: string | undefined): ProviderPaymentState {
    switch ((code ?? "").toLowerCase()) {
      case "charged":
      case "paid":
      case "captured":
        return "succeeded";
      case "pending":
      case "pending_charge":
        return "processing";
      case "declined":
      case "failed":
      case "rejected":
        return "failed";
      case "aborted":
      case "canceled":
      case "cancelled":
      case "expired":
        return "cancelled";
      case "refunded":
        return "refunded";
      default:
        return "pending";
    }
  }

  private async request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
    if (!this.isConfigured) {
      throw new ServiceUnavailableException("Payoneer is not configured");
    }

    const auth = Buffer.from(`${this.merchantCode}:${this.apiKey}`).toString("base64");
    const response = await fetch(`${this.apiBase}${path}`, {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/vnd.optile.payment.enterprise-v1-extensible+json",
        Accept: "application/vnd.optile.payment.enterprise-v1-extensible+json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        (json as any)?.interaction?.reason ??
        (json as any)?.resultInfo ??
        `Payoneer request failed (${response.status})`;
      this.logger.warn(`Payoneer ${method} ${path} -> ${response.status}: ${message}`);
      throw new ServiceUnavailableException(message);
    }

    return json as T;
  }
}
