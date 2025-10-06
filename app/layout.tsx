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
  themeColor: "#ffffff",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${spaceMono.className} min-h-dvh bg-white text-neutral-900`}
        style={{ textTransform: "lowercase" }}
      >
        <div className="min-h-dvh pb-24">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}


