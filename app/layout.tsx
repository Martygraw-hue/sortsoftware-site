import type { Metadata } from "next";
import Script from "next/script";
import TermlyInit from "@/components/TermlyInit";
import { Schibsted_Grotesk, Source_Sans_3, Caveat } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

// Sharpie handwriting — used ONLY for the blue note in Our Story
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sort Software | Makers of Sort & Admin",
    template: "%s | Sort Software",
  },
  description:
    "Sort Software LLC builds the Sort and Admin apps. Company information, privacy, terms, refund, and security policies.",
  openGraph: {
    title: "Sort Software",
    description: "Makers of the Sort and Admin apps.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${schibsted.variable} ${sourceSans.variable} ${caveat.variable}`}>
      <body suppressHydrationWarning>
        {/* Termly consent banner + tracker auto-blocking — ported from
            sort-connect-site so the consent flow matches. This site loads
            no analytics/ads scripts of its own, so there's nothing for the
            blocker to actually gate today, but keeping it wired means the
            Privacy Policy's claims stay accurate if that changes. */}
        <Script
          id="termly-resource-blocker"
          src="https://app.termly.io/resource-blocker/52a15dfc-15dc-4a0a-a23d-5a5b0bb1f284?autoBlock=on"
          strategy="beforeInteractive"
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-frame"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.sortsoftware.com/#organization",
              name: "Sort Software",
              legalName: "Sort Software LLC",
              url: "https://www.sortsoftware.com",
              description:
                "Sort Software LLC builds the Sort and Admin apps.",
              email: "help@sortsoftware.com",
              founder: { "@type": "Person", name: "Bill Graw" },
              areaServed: "US",
            }),
          }}
        />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <TermlyInit />
      </body>
    </html>
  );
}
