import "./globals.css";
import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "playdate",
  description: "todaysplaydate.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceMono.className} style={{ textTransform: "lowercase" }}>
        {children}
      </body>
    </html>
  );
}
