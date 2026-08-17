"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { useIsAuthenticated, useSession } from "@/app/lib/auth";
import { useCourseBySlug, usePaymentConfig, useCreateCheckout } from "@/app/lib/api/hooks";
import {
  brandLabels,
  cvcLength,
  detectBrand,
  formatCardNumber,
  formatExpiry,
  formatMoney,
  onlyDigits,
  parseExpiry,
  validateCard,
  type CardErrors,
} from "@/app/lib/payments";
import type { PaymentProviderKey } from "@/app/lib/api/types";

// ── Provider marks ──────────────────────────────────────────────────

function StripeMark() {
  return (
    <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-[#635bff] text-white">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13.2 9.6c0-.7.6-1 1.5-1 1.3 0 3 .4 4.3 1.1V6.2a11 11 0 00-4.3-.8c-3.5 0-5.8 1.8-5.8 4.8 0 4.7 6.4 4 6.4 6 0 .8-.7 1.1-1.7 1.1-1.4 0-3.3-.6-4.8-1.4v3.6c1.6.7 3.2 1 4.8 1 3.6 0 6-1.7 6-4.8 0-5.1-6.4-4.3-6.4-6.1Z" />
      </svg>
    </span>
  );
}

function PayoneerMark() {
  return (
    <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-[#ff4800] text-white">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 19c4-9 10-13 16-14" />
        <path d="M20 5l-4.5-.5M20 5l-1 4.4" />
        <path d="M4 19h5" />
      </svg>
    </span>
  );
}

function CardMark() {
  return (
    <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-[#0a4a29] text-white">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19" />
      </svg>
    </span>
  );
}

const marks: Record<PaymentProviderKey, () => React.JSX.Element> = {
  STRIPE: StripeMark,
  PAYONEER: PayoneerMark,
  CARD: CardMark,
};

// ── Card field ──────────────────────────────────────────────────────

function CardField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  inputMode = "numeric",
  autoComplete,
  maxLength,
  right,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  inputMode?: "numeric" | "text";
  autoComplete?: string;
  maxLength?: number;
  right?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-[7px] block text-[13.5px] font-medium text-[#0a4a29]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "w-full rounded-[13px] border bg-white py-[13px] px-[15px] text-[15px] tracking-[0.02em] text-[#0a4a29] placeholder:text-[#b3c2b8]",
            "focus:outline-none focus:ring-2 transition-colors",
            error
              ? "border-[#c0603e] focus:border-[#c0603e] focus:ring-[#c0603e]/25"
              : "border-[#dbe6dd] focus:border-[#50bc7e] focus:ring-[#50bc7e]/30",
            right ? "pr-[74px]" : ""
          )}
        />
        {right && (
          <span className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#8a988e]">
            {right}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-[6px] text-[12.5px] text-[#c0603e]">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Checkout ────────────────────────────────────────────────────────

export default function CheckoutClient({ slug }: { slug: string }) {
  const router = useRouter();
  const session = useSession();
  const isAuthenticated = useIsAuthenticated();

  const { data: course, isLoading: loadingCourse, error: courseError } = useCourseBySlug(slug);
  const { data: config } = usePaymentConfig();
  const checkout = useCreateCheckout();

  const [provider, setProvider] = useState<PaymentProviderKey>("STRIPE");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [holderName, setHolderName] = useState("");
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [formError, setFormError] = useState("");

  const brand = useMemo(() => detectBrand(number), [number]);
  const currency = config?.currency ?? "AUD";
  const methods = config?.providers ?? [];
  const activeMethod = methods.find((m) => m.key === provider);

  const saving =
    course?.originalPrice && course.originalPrice > course.price
      ? course.originalPrice - course.price
      : 0;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!course) return;

    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/checkout/${slug}`)}`);
      return;
    }

    let card;
    if (provider === "CARD") {
      const errors = validateCard({ number, expiry, cvc, holderName });
      setCardErrors(errors);
      if (Object.keys(errors).length > 0) return;

      const parsed = parseExpiry(expiry)!;
      card = {
        number: onlyDigits(number),
        expMonth: parsed.month,
        expYear: parsed.year,
        cvc: onlyDigits(cvc),
        holderName: holderName.trim(),
      };
    }

    try {
      const result = await checkout.mutateAsync({
        courseId: course.id,
        provider,
        card,
      });

      // Hosted providers (and the sandbox stand-in) take over from here.
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      router.push(`/checkout/status?payment=${result.payment.id}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "We couldn't start that payment.");
    }
  };

  if (loadingCourse) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
        <div className="grid grid-cols-[1fr_360px] gap-[30px] max-lg:grid-cols-1">
          <div className="h-[520px] animate-pulse rounded-[24px] bg-white/70" />
          <div className="h-[320px] animate-pulse rounded-[24px] bg-white/70" />
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="mx-auto w-full max-w-[720px] px-[30px] text-center">
        <p className="text-[20px] font-medium text-[#0a4a29]">That course isn&apos;t available</p>
        <p className="mt-[8px] text-[15px] text-[#566b5d]">
          It may have been renamed or unpublished.
        </p>
        <Link
          href="/courses"
          className="mt-[22px] inline-block rounded-[12px] bg-[#0a4a29] px-[20px] py-[11px] text-[14px] font-medium text-white no-underline hover:bg-[#056839]"
        >
          Browse all courses
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
      <nav className="flex items-center gap-[8px] text-[14px] text-[#566b5d]" aria-label="Breadcrumb">
        <Link href="/courses" className="hover:text-[#056839]">
          Courses
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/courses/${course.slug}`} className="hover:text-[#056839]">
          {course.title}
        </Link>
        <span aria-hidden>/</span>
        <span className="font-medium text-[#0a4a29]">Checkout</span>
      </nav>

      <h1 className="mt-[18px] text-[clamp(2rem,4vw,2.8rem)]/[1.08] font-medium tracking-[-0.03em] text-[#0a4a29]">
        Complete your <span className="marker">enrolment</span>
      </h1>

      <div className="mt-[32px] grid grid-cols-[1fr_360px] items-start gap-[30px] max-lg:grid-cols-1">
        {/* ── Payment method ───────────────────────────────── */}
        <form onSubmit={submit} noValidate>
          {!isAuthenticated && (
            <div className="mb-[20px] flex items-center justify-between gap-[16px] rounded-[16px] border border-[#f0d9a8] bg-[#fdf6e6] px-[18px] py-[14px]">
              <p className="text-[14.5px] text-[#7a5a1e]">
                Log in to your account to finish checking out.
              </p>
              <Link
                href={`/login?next=${encodeURIComponent(`/checkout/${slug}`)}`}
                className="shrink-0 rounded-[11px] bg-[#0a4a29] px-[16px] py-[9px] text-[14px] font-medium text-white no-underline hover:bg-[#056839]"
              >
                Log in
              </Link>
            </div>
          )}

          <div className="rounded-[22px] border border-[#dbe6dd] bg-white p-[26px] shadow-[var(--shadow-e1)] max-sm:p-[20px]">
            <h2 className="text-[19px] font-semibold text-[#0a4a29]">Payment method</h2>
            <p className="mt-[4px] text-[14px] text-[#566b5d]">
              Choose how you&apos;d like to pay. Every option is encrypted end to end.
            </p>

            <div className="mt-[18px] flex flex-col gap-[12px]" role="radiogroup" aria-label="Payment method">
              {methods.map((method) => {
                const Mark = marks[method.key];
                const selected = provider === method.key;
                return (
                  <button
                    key={method.key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={!method.enabled}
                    onClick={() => setProvider(method.key)}
                    className={cn(
                      "flex items-center gap-[14px] rounded-[16px] border p-[16px] text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                      selected
                        ? "border-[#056839] bg-[#f2f8f4] ring-2 ring-[#50bc7e]/25"
                        : "border-[#dbe6dd] bg-white hover:border-[#9ec7ac]"
                    )}
                  >
                    <Mark />
                    <span className="flex-1">
                      <span className="flex items-center gap-[8px] text-[15.5px] font-medium text-[#0a4a29]">
                        {method.label}
                        {method.sandbox && (
                          <span className="rounded-full bg-[#fdf6e6] px-[8px] py-[2px] text-[11px] font-semibold uppercase tracking-[0.05em] text-[#7a5a1e]">
                            Sandbox
                          </span>
                        )}
                      </span>
                      <span className="mt-[3px] block text-[13.5px] text-[#566b5d]">
                        {method.description}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full border transition-colors",
                        selected ? "border-[#056839]" : "border-[#cfe3d6]"
                      )}
                    >
                      <span
                        className={cn(
                          "h-[10px] w-[10px] rounded-full transition-colors",
                          selected ? "bg-[#056839]" : "bg-transparent"
                        )}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Card details */}
            {provider === "CARD" && (
              <div className="mt-[22px] border-t border-[#e6efe8] pt-[22px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#0a4a29]">Card details</h3>
                  <span className="text-[13px] font-medium text-[#566b5d]">
                    {brand === "unknown" ? "Visa · Mastercard · Amex" : brandLabels[brand]}
                  </span>
                </div>

                <div className="mt-[16px] flex flex-col gap-[14px]">
                  <CardField
                    id="card-number"
                    label="Card number"
                    value={number}
                    onChange={(v) => setNumber(formatCardNumber(v))}
                    placeholder="4242 4242 4242 4242"
                    autoComplete="cc-number"
                    error={cardErrors.number}
                    maxLength={23}
                    right={brand !== "unknown" ? brandLabels[brand].split(" ")[0] : undefined}
                  />

                  <div className="grid grid-cols-2 gap-[14px]">
                    <CardField
                      id="card-expiry"
                      label="Expiry date"
                      value={expiry}
                      onChange={(v) => setExpiry(formatExpiry(v))}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      maxLength={5}
                      error={cardErrors.expiry}
                    />
                    <CardField
                      id="card-cvc"
                      label="Security code"
                      value={cvc}
                      onChange={(v) => setCvc(onlyDigits(v).slice(0, cvcLength(brand)))}
                      placeholder={brand === "amex" ? "1234" : "123"}
                      autoComplete="cc-csc"
                      maxLength={4}
                      error={cardErrors.cvc}
                    />
                  </div>

                  <CardField
                    id="card-name"
                    label="Name on card"
                    value={holderName}
                    onChange={setHolderName}
                    placeholder="Aashish Sharma"
                    inputMode="text"
                    autoComplete="cc-name"
                    error={cardErrors.holderName}
                  />
                </div>

                {activeMethod?.sandbox && (
                  <p className="mt-[14px] rounded-[12px] bg-[#f2f8f4] px-[14px] py-[10px] text-[13px]/[1.5] text-[#3f4f45]">
                    Sandbox mode — no live processor is connected. Use{" "}
                    <span className="font-medium">4242 4242 4242 4242</span> for an approval or{" "}
                    <span className="font-medium">4000 0000 0000 0002</span> for a decline.
                  </p>
                )}
              </div>
            )}

            {provider !== "CARD" && (
              <p className="mt-[18px] rounded-[12px] bg-[#f2f8f4] px-[14px] py-[12px] text-[13.5px]/[1.55] text-[#3f4f45]">
                You&apos;ll be taken to {activeMethod?.label ?? "the provider"} to authorise the
                payment, then brought straight back to your course.
              </p>
            )}

            {formError && (
              <p className="mt-[16px] rounded-[10px] bg-[#fbeee9] px-[13px] py-[10px] text-[13.5px] text-[#c0603e]">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={checkout.isPending}
              className="mt-[22px] inline-flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[#0a4a29] px-[24px] py-[16px] text-[16px] font-medium text-white shadow-[var(--shadow-e2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#056839] hover:shadow-[var(--shadow-lift)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {checkout.isPending ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Starting payment…
                </>
              ) : (
                <>
                  Pay {formatMoney(course.price, currency)}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <p className="mt-[12px] flex items-center justify-center gap-[7px] text-center text-[12.5px] text-[#8a988e]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="4" y="10" width="16" height="11" rx="2.5" />
                <path d="M8 10V7a4 4 0 018 0v3" />
              </svg>
              Card details go straight to the processor — we only ever store the last four digits.
            </p>
          </div>
        </form>

        {/* ── Order summary ────────────────────────────────── */}
        <aside className="rounded-[22px] border border-[#dbe6dd] bg-white p-[24px] shadow-[var(--shadow-e1)] lg:sticky lg:top-[20px]">
          <h2 className="text-[17px] font-semibold text-[#0a4a29]">Order summary</h2>

          <div className="mt-[16px] flex gap-[14px]">
            <div
              className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[14px] bg-[#0a4a29]"
              aria-hidden
            >
              {course.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div>
              <p className="text-[15px]/[1.35] font-medium text-[#0a4a29]">{course.title}</p>
              <p className="mt-[4px] text-[13.5px] text-[#566b5d]">
                {course.lessons} lessons · {course.hours}h · {course.level}
              </p>
            </div>
          </div>

          <dl className="mt-[20px] flex flex-col gap-[10px] border-t border-[#e6efe8] pt-[16px] text-[14.5px]">
            <div className="flex items-center justify-between">
              <dt className="text-[#566b5d]">Course price</dt>
              <dd className="text-[#0a4a29]">
                {formatMoney(course.originalPrice ?? course.price, currency)}
              </dd>
            </div>
            {saving > 0 && (
              <div className="flex items-center justify-between">
                <dt className="text-[#566b5d]">Discount</dt>
                <dd className="font-medium text-[#056839]">−{formatMoney(saving, currency)}</dd>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-[#e6efe8] pt-[12px]">
              <dt className="font-semibold text-[#0a4a29]">Total due</dt>
              <dd className="text-[20px] font-semibold text-[#0a4a29]">
                {formatMoney(course.price, currency)}
              </dd>
            </div>
          </dl>

          {session && (
            <p className="mt-[16px] rounded-[12px] bg-[#f2f8f4] px-[13px] py-[10px] text-[13px] text-[#3f4f45]">
              Enrolling as <span className="font-medium">{session.user.email}</span>
            </p>
          )}

          <p className="mt-[16px] text-[13px]/[1.5] text-[#8a988e]">
            Lifetime access, a certificate on completion, and a 7-day money-back guarantee.
          </p>
        </aside>
      </div>
    </div>
  );
}
