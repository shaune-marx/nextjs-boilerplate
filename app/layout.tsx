import "./globals.css";
import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://todaysplaydate.com"),
  title: {
    default: "playdate — keep your friends in orbit",
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
};

}
