import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "../components/AnnouncementBar";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import FloatingWidgets from "../components/FloatingWidgets";
import WishlistBoard from "../components/WishlistBoard";

export const metadata: Metadata = {
  title: "My wishlist — NAATI Excellence Academy",
  description: "The courses you've saved for later at NAATI Excellence Academy.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <>
      <AnnouncementBar />
      <div className="relative pt-[26px] max-sm:pt-[20px]">
        <NavigationBar />

        <header className="mt-[40px]">
          <div className="w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
            <nav className="flex items-center gap-[8px] text-[14px] text-[#566b5d]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#056839]">
                Home
              </Link>
              <span aria-hidden>/</span>
              <span className="font-medium text-[#0a4a29]">Wishlist</span>
            </nav>

            <h1 className="mt-[18px] text-[clamp(2.2rem,4.5vw,3.2rem)]/[1.06] font-medium tracking-[-0.03em] text-[#0a4a29]">
              Saved for <span className="marker">later</span>
            </h1>
            <p className="text-pretty mt-[14px] max-w-[560px] text-[17px]/[1.55] text-[#566b5d]">
              Everything you&apos;ve hearted, ready whenever you are. Enrol in one tap.
            </p>
          </div>
        </header>

        <div className="mt-[36px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <WishlistBoard />
        </div>

        <Footer className="mt-[120px] max-lg:mt-[90px] max-sm:mt-[60px]" />
        <FloatingWidgets />
      </div>
    </>
  );
}
