import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASTRALIS — Genshin Impact Showcase & Build Theorycraft Engine",
  description:
    "Next-generation Genshin Impact character showcase, weapon and artifact build guides, CV roll quality rankings, and global percentile leaderboards. Engineered by Yasuo (@yasuo72).",
  keywords: ["Genshin Impact", "Astralis", "character showcase", "build guides", "theorycraft", "artifacts", "rankings", "leaderboards", "Yasuo72"],
  authors: [{ name: "Yasuo (yasuo72)" }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
