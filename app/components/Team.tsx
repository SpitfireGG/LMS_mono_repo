"use client";

import { cn } from "@/app/lib/utils";
import TeamCard from "./TeamCard";
import Button from "./Button";
import { useTeamMembers } from "@/app/lib/api/hooks";

type Tutor = {
  id: string;
  name: string;
  title: string;
  description: string;
  imageSrc?: string;
  tags?: string[];
};

/** Keeps the section alive when the CMS has nothing published. */
const fallbackTutors: Tutor[] = [
  {
    id: "t1",
    name: "Sujata Adhikari",
    title: "Lead NAATI CCL tutor · Nepali",
    description:
      "NAATI-certified interpreter with nine years in community health settings. Marks every recording against the live rubric.",
    tags: ["Nepali", "CCL"],
  },
  {
    id: "t2",
    name: "Ravi Menon",
    title: "Senior tutor · Hindi & Malayalam",
    description:
      "Ran CCL preparation for two Melbourne migrant centres before joining us. Specialises in dialogue pacing and note-taking.",
    tags: ["Hindi", "Malayalam", "CCL"],
  },
  {
    id: "t3",
    name: "Layla Haddad",
    title: "Senior tutor · Arabic",
    description:
      "Twelve years interpreting across legal and medical settings. Builds the glossaries our Arabic candidates sit with.",
    tags: ["Arabic", "CCL"],
  },
  {
    id: "t4",
    name: "Duy Tran",
    title: "Tutor · Vietnamese",
    description:
      "Focused on the segments candidates lose marks on most: register shifts and long-turn recall under time pressure.",
    tags: ["Vietnamese", "CCL"],
  },
  {
    id: "t5",
    name: "Grace Okonkwo",
    title: "PTE & IELTS lead",
    description:
      "Former examiner. Coaches the speaking and writing bands where a single technique change moves a whole score.",
    tags: ["PTE", "IELTS"],
  },
  {
    id: "t6",
    name: "Hui Zhang",
    title: "Tutor · Mandarin & Cantonese",
    description:
      "Runs our mock-test panel and calibrates scoring so a practice mark means the same as a real one.",
    tags: ["Mandarin", "Cantonese", "CCL"],
  },
];

export default function Team({ className }: { className?: string }) {
  const { data, isLoading } = useTeamMembers({ limit: 6 });

  const published: Tutor[] = (data?.data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    title: m.role,
    description: m.bio ?? "",
    imageSrc: m.image ?? undefined,
  }));

  const tutors = published.length > 0 ? published : fallbackTutors;
  const showSkeleton = isLoading && published.length === 0;

  return (
    <div
      className="mx-auto max-w-[1440px] scroll-mt-[40px] px-[100px] max-xl:px-[60px] max-sm:px-[30px]"
      id="team"
    >
      <div
        className={cn(
          "grid grid-cols-3 gap-[28px] max-xl:gap-[22px] max-lg:grid-cols-2 max-md:grid-cols-1",
          className,
        )}
      >
        {showSkeleton
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="offset-card h-[300px] animate-pulse bg-white"
              />
            ))
          : tutors.map((tutor) => (
              <TeamCard
                key={tutor.id}
                name={tutor.name}
                title={tutor.title}
                description={tutor.description}
                imageSrc={tutor.imageSrc}
                tags={tutor.tags}
              />
            ))}
      </div>

      <div className="flex justify-center mt-[44px]">
        <Button variant="primary" href="/about" className="py-[19px] px-[35px]">
          See all tutors
        </Button>
      </div>
    </div>
  );
}
