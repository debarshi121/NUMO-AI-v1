import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Montserrat,
  Montserrat_Alternates,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  subsets: ["latin"],
  weight: ["700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"],
});

const SITE_DESCRIPTION =
  "Your divine numerology Insights for perfect vehicle matches. Unleash cosmic wisdom on wheels with Numo AI.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Numo AI",
    template: "%s | Numo AI",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Numo AI",
    "vehicle numerology",
    "number plate numerology",
    "car number compatibility",
    "numerology insights",
  ],
  openGraph: {
    title: "Numo AI",
    description: SITE_DESCRIPTION,
    siteName: "Numo AI",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Numo AI",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${montserratAlternates.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* Material Symbols isn't offered by next/font/google, so it stays
            on a manual stylesheet link; the rest of the fonts are self-hosted above.
            display=block avoids a flash of the raw ligature text (e.g. "calendar_month")
            before the icon font finishes loading on a first, uncached visit. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="#f2ca50" showSpinner={false} height={3} />
        <Providers>{children}</Providers>
        <Toaster position="top-center" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
