import type { Metadata } from "next";
import AnnouncementBar from "../../components/AnnouncementBar";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import FloatingWidgets from "../../components/FloatingWidgets";
import CourseDetail from "../../components/CourseDetail";

export const metadata: Metadata = {
  title: "Course — NAATI Excellence Academy",
  description:
    "Course details, curriculum and enrolment for NAATI Excellence Academy programs.",
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <AnnouncementBar />
      <div className="relative pt-[26px] max-sm:pt-[20px]">
        <NavigationBar />

        <div className="mt-[40px]">
          <CourseDetail slug={slug} />
        </div>

        <Footer className="mt-[120px] max-lg:mt-[90px] max-sm:mt-[60px]" />
        <FloatingWidgets />
      </div>
    </>
  );
}
