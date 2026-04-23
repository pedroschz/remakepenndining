import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Remake Penn Dining",
    template: "%s · Remake Penn Dining",
  },
  description:
    "A student petition to end Bon Appétit's contract at Penn, built on the public record: 13 years of health violations, a 2026–27 meal plan of $6,960, and peer universities that have already made the change.",
  openGraph: {
    type: "website",
    title: "Remake Penn Dining",
    description:
      "The case against Bon Appétit at Penn — evidence, signatures, and testimonies.",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remake Penn Dining",
    description:
      "The case against Bon Appétit at Penn — evidence, signatures, and testimonies.",
    images: ["/api/og"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
