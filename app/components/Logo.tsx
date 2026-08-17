import Image from "next/image";
import { cn } from "../lib/utils";

export default function Logo({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="img"
      aria-label="NAATI EXCELLENCE ACADEMY Logo"
      {...props}
      className={cn("relative", className)}
    >
      <Image
        src="/naatiLogo.png"
        alt="NAATI EXCELLENCE ACADEMY"
        fill
        sizes="60px"
        className="object-contain"
      />
    </div>
  );
}
