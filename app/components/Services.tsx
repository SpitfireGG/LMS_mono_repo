"use client";

import Image, { type StaticImageData } from "next/image";
import { cn } from "@/app/lib/utils";
import ServiceCard from "./ServiceCard";
import { useServices } from "@/app/lib/api/hooks";
import interpretingIllustration from "@/app/assets/illustrations/services/tokyo-sending-messages-from-one-place-to-another-1.png";
import testIllustration from "@/app/assets/illustrations/services/tokyo-selecting-a-value-in-the-browser-window-1.png";
import languagesIllustration from "@/app/assets/illustrations/services/tokyo-magnifier-web-search-with-elements-2.png";
import codingIllustration from "@/app/assets/illustrations/services/tokyo-many-browser-windows-with-different-information-1.png";
import designIllustration from "@/app/assets/illustrations/services/tokyo-browser-window-with-emoticon-likes-and-stars-around-2.png";
import businessIllustration from "@/app/assets/illustrations/services/tokyo-volumetric-analytics-of-different-types-in-web-browsers-2.png";

const illustrationMap: Record<string, StaticImageData> = {
  interpreting: interpretingIllustration,
  test: testIllustration,
  languages: languagesIllustration,
  coding: codingIllustration,
  design: designIllustration,
  business: businessIllustration,
};

function splitTitle(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) return [title];
  return [words.slice(0, -1).join(" "), words.at(-1)!];
}

export default function Services({ className }: { className?: string }) {
  const { data, isLoading, error } = useServices({ limit: 6 });
  const services = data?.data ?? [];

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-2 gap-[40px] max-xl:gap-[30px] max-lg:grid-cols-1 items-start relative w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px] scroll-mt-[40px]", className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white border border-[#cfe3d6] rounded-[24px] h-[280px] p-6" />
        ))}
      </div>
    );
  }

  if (error || services.length === 0) {
    return null;
  }

  const getIllustration = (iconKey: string) =>
    illustrationMap[iconKey] || illustrationMap.interpreting;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-[40px] max-xl:gap-[30px] max-lg:grid-cols-1 items-start relative w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px] scroll-mt-[40px]",
        className,
      )}
      id="services"
    >
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          lines={splitTitle(service.title)}
          cardVariant="Grey"
          glyph={
            <Image
              src={getIllustration(service.icon)}
              alt=""
              aria-hidden="true"
              sizes="(max-width: 640px) 150px, 230px"
              className="h-auto w-full object-contain"
            />
          }
        />
      ))}
    </div>
  );
}
