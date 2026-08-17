import type { Metadata } from "next";
import Link from "next/link";
import NavigationBar from "../../components/NavigationBar";
import MockTestAdmin from "../../components/admin/MockTestAdmin";

export const metadata: Metadata = {
  title: "Practice sessions — Admin",
  description: "Upload the script and audio for mock tests and mock interviews.",
  robots: { index: false, follow: false },
};

export default function AdminMockTestsPage() {
  return (
    <div className="relative pt-[26px] max-sm:pt-[20px]">
      <NavigationBar />

      <header className="mx-auto mt-[36px] w-full max-w-[1200px] px-[60px] max-sm:px-[20px]">
        <nav className="flex items-center gap-[8px] text-[14px] text-[#566b5d]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#056839]">Home</Link>
          <span aria-hidden>/</span>
          <span>Admin</span>
          <span aria-hidden>/</span>
          <span className="font-medium text-[#0a4a29]">Practice sessions</span>
        </nav>
        <h1 className="mt-[14px] text-[clamp(1.9rem,3.5vw,2.6rem)]/[1.1] font-medium tracking-[-0.02em] text-[#0a4a29]">
          Upload a <span className="marker">practice session</span>
        </h1>
        <p className="text-pretty mt-[12px] max-w-[620px] text-[16.5px]/[1.55] text-[#566b5d]">
          Attach the script as a PDF and the dialogue as audio or video. Candidates get
          both together — the script on screen while the recording plays.
        </p>
      </header>

      <div className="mt-[30px] pb-[80px]">
        <MockTestAdmin />
      </div>
    </div>
  );
}
