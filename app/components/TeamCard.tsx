import { cn } from "@/app/lib/utils";

type TeamCardProps = {
  name: string;
  title: string;
  description: string;
  imageSrc: string;
  className?: string;
};

function PersonPicture({
  imageSrc,
  className,
}: {
  imageSrc: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-full", className)} style={{ width: "103px", height: "103px" }}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-[#e6efe8] flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8a988e" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-[#50bc7e] mix-blend-multiply" />
    </div>
  );
}

function SocialIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="17" cy="17" r="17" fill="black" />
      <path d="M9.31776 25H12.8131V13.6844H9.31776V25Z" fill="#50bc7e" />
      <path
        d="M9 10.0719C9 11.1875 9.90031 12.0906 11.0654 12.0906C12.1776 12.0906 13.0779 11.1875 13.0779 10.0719C13.0779 8.95625 12.1776 8 11.0654 8C9.90031 8 9 8.95625 9 10.0719Z"
        fill="#50bc7e"
      />
      <path
        d="M22.4517 25H26V18.7844C26 15.7562 25.3115 13.3656 21.7632 13.3656C20.0685 13.3656 18.9034 14.3219 18.4268 15.225H18.3738V13.6844H15.0374V25H18.5327V19.4219C18.5327 17.9344 18.7975 16.5 20.6511 16.5C22.4517 16.5 22.4517 18.2 22.4517 19.475V25Z"
        fill="#50bc7e"
      />
    </svg>
  );
}

export default function TeamCard({
  name,
  title,
  description,
  imageSrc,
  className,
}: TeamCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#cfe3d6] border-solid",
        "grid grid-rows-[auto_auto_minmax(0,1fr)] items-start overflow-clip",
        "px-[34px] py-[39px] max-xl:p-[25px]",
        "relative rounded-[45px] shadow-[var(--shadow-e2)]",
        "shrink-0 gap-[28px] max-md:gap-[20px] w-full",
        className
      )}
      data-name="Card"
    >
      <div
        className="grid grid-rows-[auto_auto] grid-cols-[min-content_minmax(0,1fr)] gap-x-[20px] relative shrink-0 w-full min-h-px min-w-px mr-[-34px]"
        data-name="Person"
      >
        <PersonPicture
          imageSrc={imageSrc}
          className="row-span-2 self-end size-[103px] max-xl:size-[80px] max-sm:size-[60px]"
        />
        <div
          className="shrink-0 size-[34px] self-start justify-self-end -mb-[2px]"
          data-name="Social icon"
        >
          <SocialIcon />
        </div>
        <div className="leading-[normal] text-black self-end" data-name="Name">
          <p className="font-medium text-[20px]" data-node-id="name">
            {name}
          </p>
          <p className="font-normal text-[18px]" data-node-id="title">
            {title}
          </p>
        </div>
      </div>
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0] border-t border-[#cfe3d6]"></div>
      </div>
      <p
        className="font-normal leading-[normal] relative shrink-0 text-[18px] text-black max-w-[317px] max-xl:max-w-none whitespace-pre-wrap"
        data-name="Description"
      >
        {description}
      </p>
    </div>
  );
}
