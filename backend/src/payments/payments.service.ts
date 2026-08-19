import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import {
  Payment,
  PaymentProvider,
  PaymentStatus,
  Prisma,
  PublishStatus,
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { StripeProvider } from "./providers/stripe.provider";
import { PayoneerProvider } from "./providers/payoneer.provider";
import { CheckoutContext, ProviderPaymentState } from "./providers/payment-provider.interface";
import { CreateCheckoutDto, QueryPaymentDto } from "./dto/payment.dto";
import {
  detectBrand,
  fingerprint,
  isExpired,
  isValidCvc,
  normalizeCardNumber,
  passesLuhn,
  sandboxOutcome,
} from "./utils/card.util";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

const PAYMENT_INCLUDE = {
  course: {
    select: { id: true, slug: true, title: true, image: true, tag: true, author: true },
  },
} satisfies Prisma.PaymentInclude;

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeProvider,
    private readonly payoneer: PayoneerProvider,
  ) {}

  // ── Configuration surfaced to the checkout page ─────────────────

  getConfig() {
    return {
      currency: this.currency,
      providers: [
        {
          key: PaymentProvider.STRIPE,
          label: "Stripe",
          description: "Pay on Stripe's hosted checkout — cards, Apple Pay and Google Pay.",
          enabled: true,
          sandbox: !this.stripe.isConfigured,
        },
        {
          key: PaymentProvider.PAYONEER,
          label: "Payoneer",
          description: "Pay from your Payoneer balance or a local bank transfer.",
          enabled: true,
          sandbox: !this.payoneer.isConfigured,
        },
        {
          key: PaymentProvider.CARD,
          label: "Credit / debit card",
          description: "Enter your card number, expiry date and security code.",
          enabled: true,
          sandbox: !this.stripe.isConfigured,
        },
      ],
      stripePublishableKey: this.stripe.publishableKey ?? null,
      /** When true the card form may post raw card details to this API. */
      acceptsRawCard: !this.stripe.isConfigured || this.stripe.allowsRawCard,
    };
  }

  // ── Checkout ────────────────────────────────────────────────────

  async createCheckout(user: AuthUser, dto: CreateCheckoutDto) {
    const course = await this.prisma.course.findFirst({
      where: { id: dto.courseId, deletedAt: null, status: PublishStatus.PUBLISHED },
    });
    if (!course) throw new NotFoundException("Course not found");

    const enrolled = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
    });
    if (enrolled) throw new BadRequestException("You are already enrolled in this course");

    const profile = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true },
    });

    // Card details are checked before the payment row exists, so a typo never
    // leaves an abandoned attempt in the customer's history.
    const card = dto.provider === PaymentProvider.CARD ? this.assertUsableCard(dto) : undefined;

    const reference = this.newReference();
    const payment = await this.prisma.payment.create({
      data: {
        reference,
        userId: user.id,
        courseId: course.id,
        provider: dto.provider,
        amount: course.price,
        currency: this.currency,
        status: PaymentStatus.PENDING,
        ...(card
          ? {
              cardBrand: card.brand,
              cardLast4: card.last4,
              cardExpMonth: card.expMonth,
              cardExpYear: card.expYear,
            }
          : {}),
      },
      include: PAYMENT_INCLUDE,
    });

    // Free courses skip the processor entirely.
    if (course.price <= 0) {
      const settled = await this.markSucceeded(payment.id);
      return { payment: settled, checkoutUrl: null, clientSecret: null, sandbox: false };
    }

    const ctx: CheckoutContext = {
      reference,
      paymentId: payment.id,
      amount: course.price,
      currency: this.currency,
      description: `Enrolment — ${course.title}`,
      courseTitle: course.title,
      customerEmail: profile?.email ?? user.email,
      customerName: profile?.name ?? "Student",
      successUrl: dto.successUrl ?? this.frontendUrl(`/checkout/status?payment=${payment.id}&result=success`),
      cancelUrl: dto.cancelUrl ?? this.frontendUrl(`/checkout/status?payment=${payment.id}&result=cancelled`),
      notificationUrl: this.apiUrl(`/api/payments/webhook/${dto.provider.toLowerCase()}`),
    };

    switch (dto.provider) {
      case PaymentProvider.STRIPE:
        return this.startHostedCheckout(payment, ctx, "stripe");
      case PaymentProvider.PAYONEER:
        return this.startHostedCheckout(payment, ctx, "payoneer");
      case PaymentProvider.CARD:
        return this.startCardPayment(payment, ctx, dto);
      default:
        throw new BadRequestException("Unsupported payment provider");
    }
  }

  private async startHostedCheckout(
    payment: Payment,
    ctx: CheckoutContext,
    provider: "stripe" | "payoneer",
  ) {
    const configured = provider === "stripe" ? this.stripe.isConfigured : this.payoneer.isConfigured;

    // Sandbox: no merchant credentials, so the customer settles the payment on
    // our own status page instead of the provider's hosted one.
    if (!configured) {
      const updated = await this.update(payment.id, {
        status: PaymentStatus.PROCESSING,
        checkoutUrl: this.frontendUrl(`/checkout/status?payment=${payment.id}&sandbox=1`),
        metadata: { sandbox: true, provider },
      });
      return {
        payment: updated,
        checkoutUrl: updated.checkoutUrl,
        clientSecret: null,
        sandbox: true,
      };
    }

    try {
      const hosted =
        provider === "stripe"
          ? await this.stripe.createCheckoutSession(ctx)
          : await this.payoneer.createHostedCheckout(ctx);

      const updated = await this.update(payment.id, {
        status: PaymentStatus.PROCESSING,
        providerRef: hosted.providerRef,
        checkoutUrl: hosted.checkoutUrl,
      });

      return { payment: updated, checkoutUrl: hosted.checkoutUrl, clientSecret: null, sandbox: false };
    } catch (error) {
      await this.fail(payment.id, this.errorMessage(error));
      throw error;
    }
  }

  /** Rejects unusable card input up front; returns what we're allowed to keep. */
  private assertUsableCard(dto: CreateCheckoutDto) {
    const card = dto.card;

    if (!card) {
      if (!dto.paymentMethodId) {
        throw new BadRequestException("Card details or a payment method token are required");
      }
      return undefined;
    }

    const number = normalizeCardNumber(card.number);
    const brand = detectBrand(number);
    if (!passesLuhn(number)) throw new BadRequestException("That card number is not valid");
    if (isExpired(card.expMonth, card.expYear)) throw new BadRequestException("That card has expired");
    if (!isValidCvc(card.cvc, brand)) {
      throw new BadRequestException("That security code doesn't match the card type");
    }

    return fingerprint(number, card.expMonth, card.expYear);
  }

  private async startCardPayment(payment: Payment, ctx: CheckoutContext, dto: CreateCheckoutDto) {
    const card = dto.card;

    // Sandbox: approve or decline locally using the well-known test numbers.
    if (!this.stripe.isConfigured) {
      const outcome = card ? sandboxOutcome(card.number) : { approved: true };
      if (!outcome.approved) {
        const failed = await this.fail(payment.id, outcome.reason ?? "Card declined");
        throw new BadRequestException(failed.failureReason ?? "Card declined");
      }
      const settled = await this.markSucceeded(payment.id);
      return { payment: settled, checkoutUrl: null, clientSecret: null, sandbox: true };
    }

    try {
      const intent = await this.stripe.createCardPayment(ctx, {
        paymentMethodId: dto.paymentMethodId,
        card: card
          ? {
              number: normalizeCardNumber(card.number),
              expMonth: card.expMonth,
              expYear: card.expYear,
              cvc: card.cvc,
              holderName: card.holderName,
            }
          : undefined,
      });

      await this.update(payment.id, {
        providerRef: intent.providerRef,
        ...(intent.card
          ? {
              cardBrand: intent.card.brand,
              cardLast4: intent.card.last4,
              cardExpMonth: intent.card.expMonth,
              cardExpYear: intent.card.expYear,
            }
          : {}),
      });

      const settled = await this.applyProviderState(payment.id, intent.state, intent.failureReason);

      return {
        payment: settled,
        checkoutUrl: intent.actionUrl ?? null,
        clientSecret: intent.clientSecret ?? null,
        sandbox: false,
      };
    } catch (error) {
      await this.fail(payment.id, this.errorMessage(error));
      throw error;
    }
  }

  // ── Reads ───────────────────────────────────────────────────────

  async findMine(userId: string, query: QueryPaymentDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.PaymentWhereInput = { userId };
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: PAYMENT_INCLUDE,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(user: AuthUser, id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id }, include: PAYMENT_INCLUDE });
    if (!payment) throw new NotFoundException("Payment not found");
    if (payment.userId !== user.id && user.role !== "admin") {
      throw new ForbiddenException("This payment belongs to another account");
    }
    return payment;
  }

  /**
   * Pulls the live state from the provider. The status page calls this while
   * the customer is coming back from a hosted checkout, so the UI settles even
   * if the webhook is slow (or, in local development, never arrives).
   */
  async refresh(user: AuthUser, id: string) {
    const payment = await this.findOne(user, id);

    const isFinal =
      payment.status === PaymentStatus.SUCCEEDED ||
      payment.status === PaymentStatus.FAILED ||
      payment.status === PaymentStatus.CANCELLED ||
      payment.status === PaymentStatus.REFUNDED;
    if (isFinal || !payment.providerRef) return payment;

    try {
      let snapshot;
      if (payment.provider === PaymentProvider.PAYONEER) {
        snapshot = await this.payoneer.retrieveList(payment.providerRef);
      } else if (payment.providerRef.startsWith("cs_")) {
        snapshot = await this.stripe.retrieveCheckoutSession(payment.providerRef);
      } else {
        snapshot = await this.stripe.retrievePaymentIntent(payment.providerRef);
      }
      return this.applyProviderState(payment.id, snapshot.state, snapshot.failureReason);
    } catch (error) {
      this.logger.warn(`Could not refresh payment ${payment.reference}: ${this.errorMessage(error)}`);
      return payment;
    }
  }

  // ── Sandbox settlement ──────────────────────────────────────────

  async sandboxDecision(user: AuthUser, id: string, decision: "approve" | "decline") {
    const payment = await this.findOne(user, id);

    const sandbox =
      payment.provider === PaymentProvider.PAYONEER ? !this.payoneer.isConfigured : !this.stripe.isConfigured;
    if (!sandbox) {
      throw new ForbiddenException("Sandbox settlement is disabled while provider credentials are configured");
    }
    if (payment.status === PaymentStatus.SUCCEEDED) return payment;

    return decision === "approve"
      ? this.markSucceeded(payment.id)
      : this.applyProviderState(payment.id, "cancelled", "Payment cancelled in sandbox mode");
  }

  // ── Webhooks ────────────────────────────────────────────────────

  async handleStripeWebhook(rawBody: Buffer | string, signature: string | undefined) {
    const event = this.stripe.verifyWebhook(rawBody, signature);
    const object = event?.data?.object ?? {};
    const paymentId: string | undefined = object.metadata?.paymentId;
    const reference: string | undefined = object.metadata?.reference ?? object.client_reference_id;

    const payment = await this.locate(paymentId, reference, object.id);
    if (!payment) {
      this.logger.warn(`Stripe webhook ${event?.type} did not match a known payment`);
      return { received: true, matched: false };
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
      case "payment_intent.succeeded":
        await this.applyProviderState(payment.id, "succeeded");
        break;
      case "checkout.session.expired":
        await this.applyProviderState(payment.id, "cancelled", "Checkout session expired");
        break;
      case "checkout.session.async_payment_failed":
      case "payment_intent.payment_failed":
        await this.applyProviderState(
          payment.id,
          "failed",
          object.last_payment_error?.message ?? "Payment failed",
        );
        break;
      case "charge.refunded":
        await this.applyProviderState(payment.id, "refunded");
        break;
      default:
        this.logger.debug(`Ignoring Stripe event ${event.type}`);
    }

    return { received: true, matched: true };
  }

  async handlePayoneerNotification(
    rawBody: Buffer | string,
    signature: string | undefined,
    body: any,
  ) {
    this.payoneer.verifyNotification(rawBody, signature);

    const reference: string | undefined = body?.transactionId ?? body?.payment?.reference;
    const providerRef: string | undefined =
      body?.identification?.longId ?? body?.identification?.shortId ?? body?.listId;

    const payment = await this.locate(undefined, reference, providerRef);
    if (!payment) {
      this.logger.warn("Payoneer notification did not match a known payment");
      return { received: true, matched: false };
    }

    const state = this.payoneer.mapStatus(body?.statusCode ?? body?.status?.code ?? body?.interaction?.code);
    await this.applyProviderState(payment.id, state, body?.status?.reason ?? body?.resultInfo);

    return { received: true, matched: true };
  }

  // ── Internals ───────────────────────────────────────────────────

  private async locate(paymentId?: string, reference?: string, providerRef?: string) {
    if (paymentId) {
      const byId = await this.prisma.payment.findUnique({ where: { id: paymentId } });
      if (byId) return byId;
    }
    if (reference) {
      const byRef = await this.prisma.payment.findUnique({ where: { reference } });
      if (byRef) return byRef;
    }
    if (providerRef) {
      return this.prisma.payment.findFirst({ where: { providerRef } });
    }
    return null;
  }

  private async applyProviderState(
    paymentId: string,
    state: ProviderPaymentState,
    failureReason?: string,
  ) {
    switch (state) {
      case "succeeded":
        return this.markSucceeded(paymentId);
      case "failed":
        return this.fail(paymentId, failureReason ?? "Payment failed");
      case "cancelled":
        return this.update(paymentId, {
          status: PaymentStatus.CANCELLED,
          failureReason: failureReason ?? null,
        });
      case "refunded":
        return this.update(paymentId, { status: PaymentStatus.REFUNDED });
      case "requires_action":
        return this.update(paymentId, { status: PaymentStatus.REQUIRES_ACTION });
      case "processing":
        return this.update(paymentId, { status: PaymentStatus.PROCESSING });
      default:
        return this.update(paymentId, { status: PaymentStatus.PENDING });
    }
  }

  /**
   * Settles a payment and grants access. Idempotent: webhooks, the status-page
   * refresh and the sandbox buttons can all land on the same payment.
   */
  private async markSucceeded(paymentId: string) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id: paymentId } });
      if (!payment) throw new NotFoundException("Payment not found");

      if (payment.status === PaymentStatus.SUCCEEDED) {
        return tx.payment.findUniqueOrThrow({ where: { id: paymentId }, include: PAYMENT_INCLUDE });
      }

      const settled = await tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.SUCCEEDED, paidAt: new Date(), failureReason: null },
        include: PAYMENT_INCLUDE,
      });

      const existing = await tx.enrollment.findUnique({
        where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
      });

      if (!existing) {
        await tx.enrollment.create({
          data: { userId: payment.userId, courseId: payment.courseId },
        });
        await tx.course.update({
          where: { id: payment.courseId },
          data: { students: { increment: 1 } },
        });
        // A paid course leaves the wishlist — it now lives in "my courses".
        await tx.wishlistItem.deleteMany({
          where: { userId: payment.userId, courseId: payment.courseId },
        });
      }

      return settled;
    });
  }

  private fail(paymentId: string, reason: string) {
    return this.update(paymentId, { status: PaymentStatus.FAILED, failureReason: reason });
  }

  private update(paymentId: string, data: Prisma.PaymentUpdateInput) {
    return this.prisma.payment.update({ where: { id: paymentId }, data, include: PAYMENT_INCLUDE });
  }

  private newReference(): string {
    const stamp = Date.now().toString(36).toUpperCase();
    const noise = randomBytes(3).toString("hex").toUpperCase();
    return `NEA-${stamp}-${noise}`;
  }

  private get currency(): string {
    return (process.env.PAYMENT_CURRENCY ?? "AUD").toUpperCase();
  }

  private frontendUrl(path: string): string {
    const base = process.env.FRONTEND_URL ?? process.env.CORS_ORIGIN ?? "http://localhost:3000";
    return `${base.replace(/\/$/, "")}${path}`;
  }

  private apiUrl(path: string): string {
    const base = process.env.API_PUBLIC_URL ?? process.env.SITE_URL ?? "http://localhost:4000";
    return `${base.replace(/\/$/, "")}${path}`;
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Payment could not be started";
  }
}
