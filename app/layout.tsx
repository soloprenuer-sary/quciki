import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentBanner } from "@/components/ConsentBanner";
import { PreviewBar } from "@/components/PreviewBar";
import { getSiteConfig } from "@/lib/cms";
import { SITE } from "@/lib/site";
import { content, getSiteInfo } from "@/lib/content";
import { SITE_ENTRY } from "@/lib/content/entries";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteInfo();
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${site.name}: Free Calculators`,
      template: `%s | ${site.name}`,
    },
    description: site.tagline,
    applicationName: site.name,
    openGraph: { type: "website", siteName: site.name, locale: "en_US" },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const config = await getSiteConfig();
  const site = await content(SITE_ENTRY);
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {config.adsenseClient ? <meta name="google-adsense-account" content={config.adsenseClient} /> : null}
        {config.googleVerification ? <meta name="google-site-verification" content={config.googleVerification} /> : null}
      </head>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:p-2">
          {site.skipLink}
        </a>
        <PreviewBar />
        <Header />
        <div id="main" className="flex-1">
          {children}
        </div>
        <Footer />
        <ConsentBanner
          text={site.consentText}
          linkLead={site.consentLinkLead}
          linkLabel={site.consentLinkLabel}
          accept={site.consentAccept}
          decline={site.consentDecline}
        />
        {config.adsenseClient ? (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </body>
    </html>
  );
}
