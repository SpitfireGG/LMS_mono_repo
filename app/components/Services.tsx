"use client";

import { cn } from "@/app/lib/utils";
import ServiceCard from "./ServiceCard";
import { useServices } from "@/app/lib/api/hooks";
import type { ServiceItem as ApiServiceItem } from "@/app/lib/api/types";

const iconMap: Record<string, React.ReactNode> = {
  interpreting: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-auto"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73A2 2 0 0 1 12 2Z" /></svg>,
  test: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-auto"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
  languages: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-auto"><path d="M5 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8Z" /><line x1="4" y1="14" x2="20" y2="14" /><polyline points="8 18 12 22 16 18" /></svg>,
  coding: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-auto"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  design: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-auto"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  business: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-auto"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
};

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

  const getIcon = (iconKey: string) => iconMap[iconKey] || iconMap.interpreting;

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
          lines={service.title.split(" ")}
          cardVariant="Grey"
          glyph={getIcon(service.icon)}
        />
      ))}
    </div>
  );
}