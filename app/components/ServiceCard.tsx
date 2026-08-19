import { cn } from "@/app/lib/utils";
import LearnMoreLink from "./LearnMoreLink";
import Heading, { type HeadingVariant } from "./Heading";

type LearnMoreLinkVariant = "White" | "Black";

export type CardVariant = "Grey" | "Green" | "DarkWhite" | "DarkGreen";

type ServiceCardProps = {
  lines: string[];
  cardVariant: CardVariant;
  glyph: React.ReactNode;
  className?: string;
};

export default function ServiceCard({
  lines,
  cardVariant,
  glyph,
  className,
}: ServiceCardProps) {
  const getCardStyles = (): {
    backgroundColor: string;
    headingVariant: HeadingVariant;
    linkVariant: LearnMoreLinkVariant;
  } => {
    switch (cardVariant) {
      case "Grey":
        return {
          backgroundColor: "#e8f6ee",
          headingVariant: "Green",
          linkVariant: "Black",
        };
      case "Green":
        return {
          backgroundColor: "#056839",
          headingVariant: "White",
          linkVariant: "White",
        };
      case "DarkWhite":
        return {
          backgroundColor: "#0a4a29",
          headingVariant: "White",
          linkVariant: "White",
        };
      case "DarkGreen":
        return {
          backgroundColor: "#0a4a29",
          headingVariant: "Green",
          linkVariant: "White",
        };
    }
  };

  const { backgroundColor, headingVariant, linkVariant } = getCardStyles();

  return (
    <div
      className={cn(
        "lift border border-[#cfe3d6] border-solid flex min-h-[280px] items-center justify-between gap-[24px] overflow-clip p-[49px] max-xl:p-[35px] max-sm:min-h-0 max-sm:items-end max-sm:gap-[12px] max-sm:p-[24px] relative rounded-[45px] max-sm:rounded-[28px] shadow-[var(--shadow-e2)] shrink-0 w-full",
        className
      )}
      style={{ backgroundColor }}
      data-name="Card"
    >
      <div
        className="flex min-w-0 flex-col gap-[72px] max-xl:gap-[52px] max-sm:gap-[36px] items-start justify-center relative"
        data-name="Heading and link"
      >
        <Heading
          lines={lines}
          variant={headingVariant}
          headingClassName="text-[30px]/[1.27] max-xl:text-[25px]/[1.27] max-sm:text-[21px]/[1.3]"
          as="h3"
        />
        <LearnMoreLink variant={linkVariant} />
      </div>
      <div
        className="relative w-[42%] max-w-[230px] shrink-0 self-center max-sm:w-[38%] max-sm:max-w-[150px]"
        data-name="Illustration"
      >
        {glyph}
      </div>
    </div>
  );
}
