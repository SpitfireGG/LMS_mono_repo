"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { useIsAuthenticated } from "@/app/lib/auth";
import { usePayment, useRefreshPayment, useSandboxDecision } from "@/app/lib/api/hooks";
import { formatMoney, providerLabels, statusCopy } from "@/app/lib/payments";
import type { PaymentItem } from "@/app/lib/api/types";

const FINAL_STATUSES = ["SUCCEEDED", "FAILED", "CANCELLED", "REFUNDED"] as const;

function isFinal(payment?: PaymentItem) {
  return !!payment && (FINAL_STATUSES as readonly string[]).includes(payment.status);
}

function StatusIcon({ tone }: { tone: "positive" | "pending" | "negative" }) {
  const palette = {
    positive: { bg: "#e8f6ee", fg: "#056839" },
    pending: { bg: "#fdf6e6", fg: "#b58324" },
    negative: { bg: "#fbeee9", fg: "#c0603e" },
  }[tone];

  return (
    <span
      className="grid h-[64px] w-[64px] place-items-center rounded-full"
      style={{ background: palette.bg, color: palette.fg }}
    >
      {tone === "positive" ? (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : tone === "negative" ? (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-[28px] w-[28px] animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" fill="none" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
    </span>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-[16px] py-[10px]">
      <span className="text-[14px] text-[#566b5d]">{label}</span>
      <span className="text-[14.5px] font-medium text-[#0a4a29]">{value}</span>
    </div>
  );
}

export default function PaymentStatusClient() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment") ?? "";
  const result = searchParams.get("result");
  const isAuthenticated = useIsAuthenticated();

  const { data: payment, isLoading, error } = usePayment(paymentId, {
    // Keep polling while the provider settles; stop once it's final.
    refetchInterval: (query) => (isFinal(query.state.data) ? false : 4000),
  });

  const refresh = useRefreshPayment();
  const sandbox = useSandboxDecision();
  const [actionError, setActionError] = useState("");
  const synced = useRef(false);

  // One provider round-trip on arrival, so returning from a hosted checkout
  // settles immediately instead of waiting for the webhook.
  useEffect(() => {
    if (!paymentId || synced.current || !isAuthenticated) return;
    synced.current = true;
    refresh.mutate(paymentId);
  }, [paymentId, isAuthenticated, refresh]);

  if (!paymentId) {
    return (
      <Shell>
        <p className="text-[17px] font-medium text-[#0a4a29]">No payment to show</p>
        <p className="mt-[8px] text-[15px] text-[#566b5d]">
          Pick a course to start a new enrolment.
        </p>
        <Link href="/courses" className={primaryLink}>
          Browse courses
        </Link>
      </Shell>
    );
  }

  if (!isAuthenticated) {
    return (
      <Shell>
        <p className="text-[17px] font-medium text-[#0a4a29]">Log in to view this payment</p>
        <p className="mt-[8px] text-[15px] text-[#566b5d]">
          Receipts are tied to your account.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(`/checkout/status?payment=${paymentId}`)}`}
          className={primaryLink}
        >
          Log in
        </Link>
      </Shell>
    );
  }

  if (isLoading) {
    return (
      <Shell>
        <div className="h-[220px] w-full animate-pulse rounded-[18px] bg-[#eef4ee]" />
      </Shell>
    );
  }

  if (error || !payment) {
    return (
      <Shell>
        <p className="text-[17px] font-medium text-[#0a4a29]">We couldn&apos;t load that payment</p>
        <p className="mt-[8px] text-[15px] text-[#566b5d]">
          {error instanceof Error ? error.message : "Please try again in a moment."}
        </p>
        <Link href="/courses" className={primaryLink}>
          Back to courses
        </Link>
      </Shell>
    );
  }

  const copy = statusCopy[payment.status];
  const sandboxMode =
    (payment.metadata as { sandbox?: boolean } | null)?.sandbox === true ||
    searchParams.get("sandbox") === "1";
  const awaitingSettlement = !isFinal(payment);
  const paid = payment.status === "SUCCEEDED";

  const heading = paid
    ? "You're enrolled 🎉"
    : payment.status === "FAILED"
      ? "That payment didn't go through"
      : payment.status === "CANCELLED" || result === "cancelled"
        ? "Payment cancelled"
        : "Finishing your payment…";

  const settle = async (decision: "approve" | "decline") => {
    setActionError("");
    try {
      await sandbox.mutateAsync({ id: payment.id, decision });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "That didn't work.");
    }
  };

  return (
    <Shell>
      <StatusIcon tone={copy.tone} />

      <h1 className="mt-[20px] text-[clamp(1.6rem,3vw,2.2rem)]/[1.15] font-medium tracking-[-0.02em] text-[#0a4a29]">
        {heading}
      </h1>
      <p className="mt-[10px] text-[15.5px]/[1.55] text-[#566b5d]">
        {paid ? (
          <>
            Your place in{" "}
            <span className="font-medium text-[#0a4a29]">{payment.course?.title}</span> is
            confirmed and lifetime access is already active.
          </>
        ) : payment.failureReason ? (
          payment.failureReason
        ) : awaitingSettlement ? (
          "We're waiting for the provider to confirm — this page updates on its own."
        ) : (
          "Nothing was charged."
        )}
      </p>

      <div className="mt-[26px] w-full rounded-[18px] border border-[#e6efe8] bg-[#fbfdfb] px-[20px] py-[8px] text-left">
        <Row label="Reference" value={payment.reference} />
        <Row label="Course" value={payment.course?.title ?? payment.courseId} />
        <Row label="Method" value={providerLabels[payment.provider]} />
        {payment.cardLast4 && (
          <Row
            label="Card"
            value={`${(payment.cardBrand ?? "card").toUpperCase()} •••• ${payment.cardLast4}`}
          />
        )}
        <Row label="Amount" value={formatMoney(payment.amount, payment.currency)} />
        <Row
          label="Status"
          value={
            <span
              className={cn(
                "rounded-full px-[10px] py-[3px] text-[13px] font-semibold",
                copy.tone === "positive" && "bg-[#e8f6ee] text-[#056839]",
                copy.tone === "pending" && "bg-[#fdf6e6] text-[#7a5a1e]",
                copy.tone === "negative" && "bg-[#fbeee9] text-[#c0603e]"
              )}
            >
              {copy.label}
            </span>
          }
        />
      </div>

      {/* Sandbox settlement — only offered while the provider has no keys. */}
      {sandboxMode && awaitingSettlement && (
        <div className="mt-[22px] w-full rounded-[18px] border border-dashed border-[#f0d9a8] bg-[#fdf6e6] p-[18px] text-left">
          <p className="text-[14px] font-semibold text-[#7a5a1e]">Sandbox mode</p>
          <p className="mt-[5px] text-[13.5px]/[1.5] text-[#7a5a1e]">
            No {providerLabels[payment.provider]} credentials are configured, so settle the
            payment here to walk through the rest of the flow.
          </p>
          <div className="mt-[14px] flex gap-[10px]">
            <button
              type="button"
              onClick={() => settle("approve")}
              disabled={sandbox.isPending}
              className="rounded-[12px] bg-[#056839] px-[18px] py-[10px] text-[14px] font-medium text-white transition-colors hover:bg-[#0a4a29] cursor-pointer disabled:opacity-60"
            >
              Approve payment
            </button>
            <button
              type="button"
              onClick={() => settle("decline")}
              disabled={sandbox.isPending}
              className="rounded-[12px] border border-[#c0603e] px-[18px] py-[10px] text-[14px] font-medium text-[#c0603e] transition-colors hover:bg-[#fbeee9] cursor-pointer disabled:opacity-60"
            >
              Cancel payment
            </button>
          </div>
          {actionError && <p className="mt-[10px] text-[13px] text-[#c0603e]">{actionError}</p>}
        </div>
      )}

      <div className="mt-[26px] flex flex-wrap items-center justify-center gap-[12px]">
        {paid ? (
          <>
            <Link href={`/courses/${payment.course?.slug ?? ""}`} className={primaryLink}>
              Start learning
            </Link>
            <Link href="/courses" className={secondaryLink}>
              Browse more courses
            </Link>
          </>
        ) : awaitingSettlement ? (
          <>
            <button
              type="button"
              onClick={() => refresh.mutate(payment.id)}
              disabled={refresh.isPending}
              className={cn(secondaryLink, "cursor-pointer disabled:opacity-60")}
            >
              {refresh.isPending ? "Checking…" : "Check again"}
            </button>
            {payment.checkoutUrl && (
              <a href={payment.checkoutUrl} className={primaryLink}>
                Return to payment page
              </a>
            )}
          </>
        ) : (
          <>
            <Link href={`/checkout/${payment.course?.slug ?? ""}`} className={primaryLink}>
              Try again
            </Link>
            <Link href="/wishlist" className={secondaryLink}>
              Go to wishlist
            </Link>
          </>
        )}
      </div>
    </Shell>
  );
}

const primaryLink =
  "mt-[4px] inline-flex items-center justify-center rounded-[13px] bg-[#0a4a29] px-[22px] py-[13px] text-[15px] font-medium text-white no-underline transition-colors duration-300 hover:bg-[#056839]";

const secondaryLink =
  "mt-[4px] inline-flex items-center justify-center rounded-[13px] border border-[#cfe3d6] bg-white px-[22px] py-[13px] text-[15px] font-medium text-[#0a4a29] no-underline transition-colors duration-300 hover:bg-[#e8f6ee]";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[620px] px-[30px]">
      <div className="flex flex-col items-center rounded-[24px] border border-[#dbe6dd] bg-white p-[36px] text-center shadow-[var(--shadow-e2)] max-sm:p-[24px]">
        {children}
      </div>
    </div>
  );
}
