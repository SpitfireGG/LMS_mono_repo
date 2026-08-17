import type { Metadata } from "next";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import CheckoutClient from "../../components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout — NAATI Excellence Academy",
  description: "Pay with Stripe, Payoneer or a credit / debit card and start learning today.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="relative pt-[26px] max-sm:pt-[20px]">
      <NavigationBar />

      <div className="mt-[40px]">
        <CheckoutClient slug={slug} />
      </div>

      <Footer className="mt-[110px] max-lg:mt-[80px] max-sm:mt-[56px]" />
    </div>
  );
}
