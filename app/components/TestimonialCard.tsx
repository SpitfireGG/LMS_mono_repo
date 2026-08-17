import { cn } from "@/app/lib/utils";
import type { TestimonialItem } from "@/app/lib/api/types";

type TestimonialCardProps = {
  t: TestimonialItem;
  className?: string;
  style?: React.CSSProperties;
};

export default function TestimonialCard({
  t,
  className,
  style,
}: TestimonialCardProps) {
  const { quote, authorName, authorTitle } = t;
  return (
    <div
      className={cn(
        "flex flex-col gap-[20px] relative flex-1 w-full px-[25px] max-lg:px-[15px]",
        className
      )}
      data-name="Card"
      style={style}
    >
      <div
        className="relative w-full border border-[#50bc7e] rounded-[45px] max-sm:rounded-[30px] mb-[28px]"
        data-name="Bubble"
      >
        <svg
          viewBox="0 0 54 28"
          fill="none"
          overflow="visible"
          preserveAspectRatio="none"
          className="absolute left-[55px] max-sm:left-[35px] top-full w-[54px] h-auto"
        >
          <path d={`M0 -1L0 0L${27} ${28}L${54} 0L${54} -1Z`} fill="#0a4a29" />
          <path
            d={`M0 0L${27} ${28}L${54} 0`}
            stroke="#50bc7e"
            strokeWidth="1"
          />
        </svg>
        <p
          className="relative font-normal m-[51px] mt-[47px] max-md:m-[40px] max-sm:m-[30px] text-[18px]/[normal] text-white max-w-[502px] whitespace-pre-wrap"
          data-node-id="quote"
        >
          &quot;{quote}&quot;
        </p>
      </div>
      <div
        className="ml-[80px] max-sm:ml-[60px] whitespace-pre-wrap leading-[normal]"
        data-node-id="author"
      >
        <p className="font-medium mb-0 text-[#50bc7e] text-[20px]">
          {authorName}
        </p>
        <p className="font-normal text-[18px] text-white">{authorTitle}</p>
      </div>
    </div>
  );
}
