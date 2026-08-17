"use client";

import Link from "next/link";
import { cn } from "@/app/lib/utils";

type ButtonVariant = "primary" | "secondary" | "tertiary";

type SharedProps = {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
};

type AnchorProps = SharedProps & {
  href: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonProps = SharedProps & {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = "secondary",
  children,
  className,
  ...props
}: ButtonProps | AnchorProps) {
  const baseStyles =
    "group relative inline-flex items-center overflow-hidden rounded-[16px] shrink-0 font-medium text-[20px] text-center cursor-pointer transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 px-[35px] py-[20px] max-xl:px-[25px] max-xl:py-[15px] max-sm:px-[20px] max-sm:py-[10px] leading-[28px]";

  const variantStyles = {
    primary:
      "bg-[#0a4a29] text-white shadow-[var(--shadow-e2)] hover:bg-[#0d5e34] hover:shadow-[var(--shadow-lift)]",
    secondary:
      "border border-[#0a4a29] border-solid text-[#0a4a29] hover:bg-[#e8f6ee]",
    tertiary:
      "bg-[#056839] text-white shadow-[var(--shadow-e2)] hover:bg-[#0a4a29] hover:shadow-[var(--shadow-lift)]",
  };

  const combinedClassName = cn(baseStyles, variantStyles[variant], className);

  const inner = (
    <span className="relative flex items-center justify-center w-full">
      <span className="flex items-center transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:-translate-y-full group-hover:opacity-0">
        {children}
      </span>
      <span className="absolute inset-0 flex items-center justify-center translate-y-full opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
        {children}
      </span>
    </span>
  );

  if ("href" in props) {
    return (
      <Link {...props} className={combinedClassName}>
        {inner}
      </Link>
    );
  }

  return (
    <button {...props} className={combinedClassName}>
      {inner}
    </button>
  );
}
