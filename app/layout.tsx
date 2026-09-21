import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "GiftMatch - Find the Perfect Gift for Anyone",
  description: "Discover personalized gift ideas for family, friends, and every occasion. Browse curated gifts by recipient, interest, age, and budget.",
  keywords: ["gift ideas", "gift finder", "personalized gifts", "gift match"],
  openGraph: {
    title: "GiftMatch - Find the Perfect Gift",
    description: "Discover personalized gift ideas for every occasion.",
    url: "https://giftmatch-taupe.vercel.app",
    siteName: "GiftMatch",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
