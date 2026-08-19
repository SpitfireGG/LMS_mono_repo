"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { useIsAuthenticated } from "@/app/lib/auth";
import { useWishlistIds, useToggleWishlist } from "@/app/lib/api/hooks";

function HeartIcon({ filled, size = 18 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.8 5.6a5.2 5.2 0 00-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 10-7.4 7.4L12 21.4l8.8-8.4a5.2 5.2 0 000-7.4Z" />
    </svg>
  );
}

/**
 * Heart toggle. Guests are sent to log in and returned to where they were, so a
 * wishlist click is never a dead end.
 */
export default function WishlistButton({
  courseId,
  variant = "icon",
  className,
}: {
  courseId: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const { data: ids } = useWishlistIds();
  const toggle = useToggleWishlist();

  const wishlisted = !!ids?.includes(courseId);

  const onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    toggle.mutate({ courseId, wishlisted });
  };

  const label = wishlisted ? "Remove from wishlist" : "Add to wishlist";

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={toggle.isPending}
        aria-pressed={wishlisted}
        className={cn(
          "inline-flex items-center justify-center gap-[9px] rounded-[14px] border px-[20px] py-[13px] text-[15px] font-medium transition-colors duration-300 cursor-pointer disabled:opacity-60",
          wishlisted
            ? "border-[#c0603e] bg-[#fbeee9] text-[#c0603e]"
            : "border-[#cfe3d6] bg-white text-[#0a4a29] hover:bg-[#e8f6ee]",
          className
        )}
      >
        <HeartIcon filled={wishlisted} />
        {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={toggle.isPending}
      aria-label={label}
      title={label}
      aria-pressed={wishlisted}
      className={cn(
        "grid h-[34px] w-[34px] place-items-center rounded-full bg-white shadow-[var(--shadow-e1)] transition-colors duration-300 cursor-pointer disabled:opacity-60",
        wishlisted ? "text-[#c0603e]" : "text-[#566b5d] hover:text-[#c0603e]",
        className
      )}
    >
      <HeartIcon filled={wishlisted} />
    </button>
  );
}
