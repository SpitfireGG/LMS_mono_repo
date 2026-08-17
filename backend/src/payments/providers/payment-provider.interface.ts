/**
 * Shared shapes for the payment providers.
 *
 * Every provider is optional at runtime: when its credentials are missing the
 * service falls back to sandbox mode, so the whole checkout flow stays
 * exercisable in local development without any merchant account.
 */

export interface CheckoutContext {
  reference: string;
  paymentId: string;
  amount: number; // major units, e.g. 249.00
  currency: string; // ISO-4217, e.g. "AUD"
  description: string;
  courseTitle: string;
  customerEmail: string;
  customerName: string;
  successUrl: string;
  cancelUrl: string;
  notificationUrl: string;
}

export interface HostedCheckout {
  /** Provider-side identifier we store on the Payment row. */
  providerRef: string;
  /** Where the browser has to be sent to complete the payment. */
  checkoutUrl: string;
}

export type ProviderPaymentState =
  | "pending"
  | "processing"
  | "requires_action"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

export interface ProviderPaymentSnapshot {
  providerRef: string;
  state: ProviderPaymentState;
  failureReason?: string;
  /** Present when the provider still needs the customer to do something. */
  actionUrl?: string;
}
