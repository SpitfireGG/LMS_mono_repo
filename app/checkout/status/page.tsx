import type { Metadata } from "next";
import { Suspense } from "react";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import PaymentStatusClient from "../../components/PaymentStatusClient";

export const metadata: Metadata = {
  title: "Payment status — NAATI Excellence Academy",
  description: "Track the status of your course payment.",
  robots: { index: false, follow: false },
};

export default function PaymentStatusPage() {
  return (
    <div className="relative pt-[26px] max-sm:pt-[20px]">
      <NavigationBar />

      <div className="mt-[60px] max-sm:mt-[40px]">
        <Suspense
          fallback={
            <div className="mx-auto h-[380px] w-full max-w-[620px] animate-pulse rounded-[24px] bg-white/70" />
          }
        >
          <PaymentStatusClient />
        </Suspense>
      </div>

      <Footer className="mt-[110px] max-lg:mt-[80px] max-sm:mt-[56px]" />
    </div>
  );
}
