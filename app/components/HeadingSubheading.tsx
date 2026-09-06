import { cn } from "@/app/lib/utils";

type HeadingSubheadingProps = {
  heading: string | React.ReactNode;
  subheading?: string;
  align?: "center" | "left";
  className?: string;
  subheadingClassName?: string;
};

export default function HeadingSubheading({
  heading,
  subheading,
  align = "center",
  className,
  subheadingClassName,
}: HeadingSubheadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[1440px] px-[100px] max-xl:px-[60px] max-sm:px-[30px]",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col",
          centered
            ? "mx-auto max-w-[760px] items-center text-center"
            : "items-start",
        )}
      >
        <h2
          className="text-[clamp(2rem,3.6vw,3rem)]/[1.08] font-medium tracking-[-0.03em] text-[#0a4a29]"
        >
          {heading}
        </h2>

        {subheading && (
          <p
            className={cn(
              "text-pretty mt-[16px] max-w-[620px] text-[17px]/[1.6] text-[#566b5d] max-sm:text-[16px]",
              subheadingClassName,
            )}
          >
            {subheading}
          </p>
        )}
      </div>
    </div>
  );
}
