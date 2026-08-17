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
        "lift border border-[#cfe3d6] border-solid flex items-center justify-between gap-[10px] overflow-clip p-[49px] max-xl:p-[35px] relative rounded-[45px] shadow-[var(--shadow-e2)] shrink-0 w-full",
        className
      )}
      style={{ backgroundColor }}
      data-name="Card"
    >
      <div
        className="flex flex-col gap-[93px] max-xl:gap-[60px] items-start justify-center relative shrink-0"
        data-name="Heading and link"
      >
        <Heading
          lines={lines}
          variant={headingVariant}
          headingClassName="text-[30px]/[1.27] max-xl:text-[25px]/[1.27]"
          as="h3"
        />
        <LearnMoreLink variant={linkVariant} />
      </div>
      <div
        className="relative shrink-0 flex-1 max-w-[230px] max-sm:max-w-[180px] self-center"
        data-name="Illustration"
      >
        {glyph}
      </div>
    </div>
  );
}
