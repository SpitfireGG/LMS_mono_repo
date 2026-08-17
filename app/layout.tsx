import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NAATI EXCELLENCE ACADEMY — Learn the skills that shape your future",
  description:
    "From NAATI CCL and English exams to coding, design and business — NAATI EXCELLENCE ACADEMY pairs you with expert tutors and bite-sized courses you can actually finish around real life.",
  keywords: ["NAATI CCL", "PTE", "IELTS", "online courses", "education", "language learning"],
  authors: [
    { name: "NAATI EXCELLENCE ACADEMY" },
  ],
  openGraph: {
    title: "NAATI EXCELLENCE ACADEMY — Learn the skills that shape your future",
    description: "From NAATI CCL and English exams to coding, design and business — expert tutors and bite-sized courses.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NAATI EXCELLENCE ACADEMY — Learn the skills that shape your future",
    description: "From NAATI CCL and English exams to coding, design and business — expert tutors and bite-sized courses.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
