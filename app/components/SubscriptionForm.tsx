"use client";

import { useState, FormEvent } from "react";
import { useSubscribe } from "@/app/lib/api/hooks";
import { cn } from "../lib/utils";

type SubscriptionFormProps = {
  className?: string;
};

const buttonLabel = {
  idle: "Subscribe",
  pending: "Sending…",
  success: "Subscribed",
  error: "Try again",
} as const;

export default function SubscriptionForm({ className }: SubscriptionFormProps) {
  const [email, setEmail] = useState("");
  const { mutate, status, error, reset } = useSubscribe({
    onSuccess: () => setEmail(""),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutate(email.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      method="POST"
      className={cn("w-full max-w-[460px] shrink-0", className)}
    >
      <div className="flex items-center gap-[10px] max-sm:flex-col max-sm:items-stretch">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") reset();
          }}
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={status === "pending"}
          className="h-[54px] min-w-0 flex-1 rounded-[14px] border border-white/20 bg-white/[0.07] px-[20px] text-[15.5px] text-white transition-colors duration-300 placeholder:text-white/40 hover:border-white/35 focus:border-[#50bc7e] focus:bg-white/[0.1] focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "pending"}
          className="h-[54px] shrink-0 cursor-pointer rounded-[14px] bg-[#50bc7e] px-[28px] text-[15.5px] font-medium text-[#0a4a29] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {buttonLabel[status]}
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "mt-[10px] min-h-[19px] text-[13.5px] transition-opacity duration-300",
          status === "success" && "text-[#9fe9c1]",
          status === "error" && "text-[#f0b7a0]",
          (status === "idle" || status === "pending") && "text-white/45",
        )}
      >
        {status === "success" && "You're on the list — check your inbox."}
        {status === "error" &&
          (error?.message || "Something went wrong. Please try again.")}
        {status === "idle" && "One email a month. Unsubscribe anytime."}
      </p>
    </form>
  );
}
