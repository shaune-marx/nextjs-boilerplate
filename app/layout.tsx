import "./globals.css";
import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import type { ReactNode } from "react";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://todaysplaydate.com"),
  title: {
    default: "playdate — keep your friends in your orbit",
    template: "%s — playdate",
  },
  description:
    "we’ll send you one fun question every day, addressed to a friend you want to talk to more often.",
  openGraph: {
    title: "playdate — keep your friends in orbit",
    description:
      "we’ll send you one fun question every day, addressed to a friend you want to talk to more often.",
    url: "https://todaysplaydate.com",
    siteName: "playdate",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "playdate — keep your friends in orbit",
    description:
      "we’ll send you one fun question every day, addressed to a friend you want to talk to more often.",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "https://todaysplaydate.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${spaceMono.className} min-h-dvh bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100`} style={{ textTransform: "lowercase" }}>
        <div className="min-h-dvh pb-24 md:pb-0">
          {children}
        </div>

        <footer style={{ maxWidth: 720, margin: "40px auto 24px", padding: "0 24px", opacity: 0.8, textTransform: "lowercase" }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="mailto:support@todaysplaydate.com" style={{ textDecoration: "underline" }}>contact support</a>
            <a href="/about" style={{ textDecoration: "underline" }}>about</a>
            <a href="/privacy" style={{ textDecoration: "underline" }}>privacy</a>
            <a href="/terms" style={{ textDecoration: "underline" }}>terms</a>
          </div>
          <p style={{ fontSize: 12, marginTop: 8 }}>© {new Date().getFullYear()} playdate</p>
        </footer>

        <BottomNav />
      </body>
    </html>
  );
}

