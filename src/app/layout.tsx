import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const ethiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-noto-ethiopic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tirat AI — Know what's really in your teff",
  description:
    "Tirat (ጥራት) is an AI-powered app that screens teff flour for sawdust and gypsum adulteration from a single photo. On-device, offline, Amharic-first.",
  keywords: [
    "Tirat",
    "Tirat AI",
    "teff flour",
    "adulteration",
    "Ethiopia",
    "food safety",
    "AI screening",
  ],
  openGraph: {
    title: "Tirat AI — Know what's really in your teff",
    description:
      "AI-powered teff flour purity screening. One photo, instant verdict, fully on-device.",
    type: "website",
    siteName: "Tirat AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tirat AI",
    description: "AI-powered teff flour purity screening in your pocket.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${ethiopic.variable} bg-cream text-forest antialiased`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
