import type { Metadata } from "next";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import PracticePlayer from "../../components/PracticePlayer";

export const metadata: Metadata = {
  title: "Practice session — NAATI Excellence Academy",
  description: "Play the dialogue with its script on screen and record your interpretation.",
};

export default async function PracticeSessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="relative pt-[26px] max-sm:pt-[20px]">
      <NavigationBar />

      <div className="mt-[32px]">
        <PracticePlayer slug={slug} />
      </div>

      <Footer className="mt-[90px] max-lg:mt-[70px] max-sm:mt-[50px]" />
    </div>
  );
}
