"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import ProcessCard from "./ProcessCard";

type ProcessItem = {
  number: string;
  title: string;
  description: string;
};

const processItems: ProcessItem[] = [
  {
    number: "01",
    title: "Sign up or register",
    description:
      "Create your free account in under a minute — email, Google or a magic link. No card needed. We'll assess your current level and recommend the right starting point.",
  },
  {
    number: "02",
    title: "Complete your profile",
    description:
      "Tell us your goal and current level so we can tailor the right path and pace for you. Whether it's NAATI CCL, PTE, coding or design — we'll map the best route.",
  },
  {
    number: "03",
    title: "Choose your courses",
    description:
      "Browse 320+ courses and live classes, then enroll in the programs that match your goal. Self-paced with lifetime access, plus live classes whenever you want extra guidance.",
  },
  {
    number: "04",
    title: "Learn & track progress",
    description:
      "Access lessons anywhere, take mock tests, and watch your progress climb toward results. Mobile, tablet or desktop — pick up exactly where you left off.",
  },
];

export default function Process({ className }: { className?: string }) {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div
      className={cn(
        "content-stretch flex flex-col gap-[30px] items-start px-[100px] max-xl:px-[60px] max-sm:px-[30px] py-0 relative w-full max-w-[1440px] mx-auto",
        className
      )}
      data-name="Process block"
    >
      {processItems.map((item, index) => (
        <ProcessCard
          key={index}
          number={item.number}
          title={item.title}
          description={item.description}
          isExpanded={expandedIndex === index}
          onToggle={() => handleToggle(index)}
          className="mx-[3px]"
        />
      ))}
    </div>
  );
}
