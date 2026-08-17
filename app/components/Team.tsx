"use client";

import { cn } from "@/app/lib/utils";
import TeamCard from "./TeamCard";
import Button from "./Button";
import { useTeamMembers } from "@/app/lib/api/hooks";
import type { TeamMemberItem as ApiTeamMemberItem } from "@/app/lib/api/types";

export default function Team({ className }: { className?: string }) {
  const { data, isLoading, error } = useTeamMembers({ limit: 6 });
  const teamMembers = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px] scroll-mt-[40px]" id="team">
        <div className={cn("grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-[40px] max-xl:gap-[30px] max-sm:gap-[20px] relative", className)}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-[#cfe3d6] rounded-[20px] h-[320px] p-6" />
          ))}
        </div>
      </div>
    );
  }

  if (error || teamMembers.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px] scroll-mt-[40px]" id="team">
      <div className={cn("grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-[40px] max-xl:gap-[30px] max-sm:gap-[20px] relative", className)} data-name="Group of cards">
        {teamMembers.map((member) => (
          <TeamCard
            key={member.id}
            name={member.name}
            title={member.role}
            description={member.bio ?? ""}
            imageSrc={member.image ?? ""}
          />
        ))}
      </div>
      <Button variant="primary" className="mt-[40px] block ml-auto py-[19px] px-[76px] max-sm:w-full max-sm:justify-center">
        See all tutors
      </Button>
    </div>
  );
}