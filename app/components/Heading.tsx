import { cn } from "@/app/lib/utils";

export type HeadingVariant = "Green" | "White" | "Black";

type HeadingProps = {
  lines: string[];
  variant?: HeadingVariant;
  className?: string;
  headingClassName?: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export default function Heading({
  lines,
  variant = "Green",
  className,
  headingClassName,
  as: HeadingTag = "h2",
}: HeadingProps) {
  // Limit to 3 lines
  const displayLines = lines.slice(0, 3);

  // Determine background color based on variant
  const getBackgroundColor = () => {
    if (variant === "Green") return "#056839"; // teal brand pill
    if (variant === "White") return "#ffffff";
    return "#0a4a29"; // Black variant
  };

  // Determine text color based on variant
  const getTextColor = () => {
    if (variant === "White") return "#000000"; // white pill → ink text
    return "#ffffff"; // teal + ink pills → white text
  };

  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor();

  return (
    <HeadingTag
      className={cn("flex flex-col items-start relative", className)}
      data-name="Heading"
    >
      {displayLines.map((line, index) => (
        <span
          key={index}
          className={cn(
            "block font-medium text-[40px]/[1.27] relative shrink-0 px-[7px] py-0 rounded-[7px]",
            headingClassName
          )}
          style={{ backgroundColor, color: textColor }}
          data-name="Label"
        >
          {line}
        </span>
      ))}
    </HeadingTag>
  );
}
