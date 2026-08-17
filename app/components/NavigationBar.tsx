"use client";
import Logo from "./Logo";
import Link from "next/link";
import Button from "./Button";
import { useState } from "react";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/#process", label: "How It Works" },
  { href: "/#team", label: "Tutors" },
  { href: "/contact", label: "Contact" },
];

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        </div>
      </dialog>
    </div>
  );
}
