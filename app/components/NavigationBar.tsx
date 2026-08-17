"use client";
import Logo from "./Logo";
import Link from "next/link";
import Button from "./Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, clearSession } from "@/app/lib/auth";
import { useWishlistIds } from "@/app/lib/api/hooks";
import { authApi } from "@/app/lib/api/client";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/#process", label: "How It Works" },
  { href: "/#team", label: "Tutors" },
  { href: "/contact", label: "Contact" },
];

function WishlistLink({ count }: { count: number }) {
  return (
    <Link
      href="/wishlist"
      aria-label={count > 0 ? `Wishlist, ${count} saved` : "Wishlist"}
      className="relative flex items-center text-[#0a4a29] transition-colors hover:text-[#056839]"
    >
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20.8 5.6a5.2 5.2 0 00-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 10-7.4 7.4L12 21.4l8.8-8.4a5.2 5.2 0 000-7.4Z" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-[7px] -top-[6px] grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[#056839] px-[4px] text-[11px] font-semibold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const session = useSession();
  const { data: wishlistIds } = useWishlistIds();
  const wishlistCount = wishlistIds?.length ?? 0;

  const logout = async () => {
    // Best effort — the server clears the refresh token, the client the session.
    await authApi.logout().catch(() => undefined);
    clearSession();
    router.push("/");
    router.refresh();
  };

  const closeMenu = () => {
    const dialog = document.getElementById(
      "navigation-menu-dialog",
    ) as HTMLDialogElement;
    if (dialog && typeof dialog.hidePopover === "function") {
      dialog.hidePopover();
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-[100px] max-xl:px-[60px] max-sm:px-[30px] max-md:gap-[20px] py-0 relative w-full max-w-[1440px] mx-auto">
      <Link
        href="/"
        className="flex items-center gap-[12px] overflow-clip px-0 py-[10px] relative max-md:w-full"
        aria-label="Home"
      >
        <Logo className="h-[52px] relative shrink-0 w-[60px] max-md:h-[38px] max-md:w-[44px]" />
        <span className="font-medium text-[19px] leading-[normal] text-[#0a4a29] shrink-0 max-md:text-[17px]">
          NAATI EXCELLENCE
        </span>
      </Link>
      <div className="flex gap-[36px] items-center justify-center relative shrink-0 max-xl:hidden">
        {navLinks.map(({ href, label }, index) => (
          <Link
            key={index}
            href={href}
            onClick={(e) => {
              const hashIndex = href.indexOf("#");
              if (hashIndex !== -1) {
                const el = document.getElementById(href.slice(hashIndex + 1));
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
            className="group relative font-normal leading-[28px] shrink-0 text-[17px] text-[#0a4a29] ml-px"
          >
            {label}
            <span className="absolute -bottom-[4px] left-0 h-[2px] w-0 rounded-full bg-[#056839] transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
        <WishlistLink count={wishlistCount} />
        {session ? (
          <>
            <span className="font-medium text-[17px] text-[#0a4a29]">
              {session.user.name.split(" ")[0]}
            </span>
            <button
              type="button"
              onClick={logout}
              className="font-medium text-[17px] text-[#566b5d] transition-colors hover:text-[#056839] cursor-pointer"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="font-medium text-[17px] text-[#0a4a29] transition-colors hover:text-[#056839]"
            >
              Log in
            </Link>
            <Button
              href="/signup"
              variant="tertiary"
              className="py-[14px] px-[26px] text-[17px]"
            >
              Sign up
            </Button>
          </>
        )}
      </div>
      <Button
        variant="secondary"
        className="xl:hidden"
        onClick={() => setIsMenuOpen(true)}
        popoverTarget="navigation-menu-dialog"
        popoverTargetAction="show"
      >
        MENU
      </Button>
      <dialog
        id="navigation-menu-dialog"
        popover="auto"
        open={isMenuOpen}
        className="xl:hidden fixed top-0 left-0 w-full h-full bg-white z-50"
        onClose={() => setIsMenuOpen(false)}
      >
        <div className="flex flex-col gap-[40px] items-center justify-center relative shrink-0 p-[100px]">
          <Button
            variant="secondary"
            className="py-[18px] px-[34px]"
            onClick={closeMenu}
            popoverTarget="navigation-menu-dialog"
            popoverTargetAction="hide"
          >
            CLOSE
          </Button>
          {navLinks.map(({ href, label }, index) => (
            <Link
              key={index}
              href={href}
              onClick={(e) => {
                closeMenu();
                const hashIndex = href.indexOf("#");
                if (hashIndex !== -1) {
                  const el = document.getElementById(href.slice(hashIndex + 1));
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
              className="font-normal leading-[28px] relative shrink-0 text-[20px] text-black ml-px"
              popoverTarget="navigation-menu-dialog"
              popoverTargetAction="hide"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/wishlist"
            onClick={closeMenu}
            className="font-normal leading-[28px] relative shrink-0 text-[20px] text-black ml-px"
            popoverTarget="navigation-menu-dialog"
            popoverTargetAction="hide"
          >
            Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
          </Link>
          {session ? (
            <Button
              variant="secondary"
              className="py-[18px] px-[34px]"
              popoverTarget="navigation-menu-dialog"
              popoverTargetAction="hide"
              onClick={() => {
                closeMenu();
                logout();
              }}
            >
              Log out
            </Button>
          ) : (
            <>
              <Button
                href="/login"
                variant="secondary"
                className="py-[18px] px-[34px]"
                popoverTarget="navigation-menu-dialog"
                popoverTargetAction="hide"
                onClick={closeMenu}
              >
                Log in
              </Button>
              <Button
                href="/signup"
                variant="tertiary"
                className="py-[18px] px-[34px]"
                popoverTarget="navigation-menu-dialog"
                popoverTargetAction="hide"
                onClick={closeMenu}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
