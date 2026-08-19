"use client";

import Link from "next/link";
import { useIsAuthenticated } from "@/app/lib/auth";
import { useWishlist, useRemoveFromWishlist } from "@/app/lib/api/hooks";
import { formatMoney } from "@/app/lib/payments";
import CourseCard from "./CourseCard";

export default function WishlistBoard() {
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading, error, refetch } = useWishlist({ limit: 24 });
  const remove = useRemoveFromWishlist();

  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalValue = items.reduce((sum, item) => sum + item.course.price, 0);

  if (!isAuthenticated) {
    return (
      <Empty
        title="Log in to see your wishlist"
        body="Your saved courses follow you across every device."
        action={
          <Link href="/login?next=%2Fwishlist" className={primaryLink}>
            Log in
          </Link>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-[24px] max-lg:grid-cols-2 max-md:grid-cols-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[380px] animate-pulse rounded-[26px] bg-white/70" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Empty
        title="We couldn't load your wishlist"
        body={error instanceof Error ? error.message : "Please try again."}
        action={
          <button type="button" onClick={() => refetch()} className={`${primaryLink} cursor-pointer`}>
            Retry
          </button>
        }
      />
    );
  }

  if (items.length === 0) {
    return (
      <Empty
        title="Nothing saved yet"
        body="Tap the heart on any course to keep it here for later."
        action={
          <Link href="/courses" className={primaryLink}>
            Browse courses
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-[22px] flex items-center justify-between gap-[16px] rounded-[18px] border border-[#dbe6dd] bg-white px-[22px] py-[16px] shadow-[var(--shadow-e1)] max-sm:flex-col max-sm:items-start">
        <p className="text-[15px] text-[#566b5d]">
          <span className="font-semibold text-[#0a4a29]">{total}</span>{" "}
          {total === 1 ? "course" : "courses"} saved ·{" "}
          <span className="font-medium text-[#0a4a29]">{formatMoney(totalValue, "AUD")}</span> to
          enrol in everything
        </p>
        <Link
          href="/courses"
          className="shrink-0 text-[14px] font-medium text-[#056839] no-underline hover:underline"
        >
          Keep browsing →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-[24px] max-lg:grid-cols-2 max-md:grid-cols-1">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col">
            <CourseCard c={item.course} />
            <button
              type="button"
              onClick={() => remove.mutate(item.courseId)}
              disabled={remove.isPending}
              className="mt-[10px] inline-flex items-center justify-center gap-[7px] rounded-[12px] border border-[#e6dcd6] bg-white py-[10px] text-[14px] font-medium text-[#8a988e] transition-colors hover:border-[#c0603e] hover:text-[#c0603e] cursor-pointer disabled:opacity-60"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
              </svg>
              Remove from wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const primaryLink =
  "mt-[20px] inline-flex items-center justify-center rounded-[12px] bg-[#0a4a29] px-[20px] py-[11px] text-[14px] font-medium text-white no-underline transition-colors hover:bg-[#056839]";

function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-[#cfe3d6] bg-white py-[80px] text-center">
      <div className="grid h-[56px] w-[56px] place-items-center rounded-full bg-[#e8f6ee] text-[#056839]">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20.8 5.6a5.2 5.2 0 00-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 10-7.4 7.4L12 21.4l8.8-8.4a5.2 5.2 0 000-7.4Z" />
        </svg>
      </div>
      <p className="mt-[16px] text-[18px] font-medium text-[#0a4a29]">{title}</p>
      <p className="mt-[6px] text-[15px] text-[#566b5d]">{body}</p>
      {action}
    </div>
  );
}
