import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB, MobileCTABar, LeadModal, ScrollProgress } from "@/components/layout/FloatingCTA";
import { IntroProvider } from "@/components/intro/Intro";
import { INTRO_SEEN_KEY, INTRO_T0 } from "@/components/intro/keys";
import { SITE } from "@/lib/site";
import { OFFICES } from "@/lib/data/content";
import "./globals.css";

/* ============================================================
   Type pairing.

   Sans carries EVERYTHING — headings included. The serif appears
   only as an italic accent word inside a heading (see the `em`
   rule in globals.css), which is what gives the page its
   editorial voice rather than a formal one.

   This is the inverse of the previous pairing, where a display
   serif set every heading and the result read as stiff.

   Geist replaced DM Sans here: it is a touch more geometric, its
   tabular figures are better for the fee tables, and it ships a
   matching mono for the admission console.
   ============================================================ */
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans-brand",
  display: "swap",
});

/** Accent only. One weight, and the italic is the point — it is
 *  never used for body copy or for a whole heading. */
const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif-accent",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

/** The admission console and nothing else. */
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-brand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Study MBBS Abroad ${SITE.admissionYear} | NMC Approved Universities`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "MBBS abroad",
    "study MBBS abroad for Indian students",
    "MBBS in Georgia",
    "MBBS in Russia",
    "MBBS in Kazakhstan",
    "MBBS in China",
    "MBBS in Uzbekistan",
    "MBBS in Kyrgyzstan",
    "NMC approved medical universities abroad",
    "low cost MBBS abroad",
    "MBBS abroad fees",
    `MBBS admission ${SITE.admissionYear}`,
    "FMGE NExT preparation",
    "medical education consultant India",
    "Doctors Build International",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "education",
};

export const viewport: Viewport = {
  // Must track --bg in globals.css, in both schemes.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFBF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1020" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Organization + LocalBusiness graph. Emitted once at the root
 *  so every page inherits it. */
const orgSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "Organization"],
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      alternateName: SITE.shortName,
      url: SITE.url,
      slogan: SITE.tagline,
      description: SITE.description,
      foundingDate: SITE.founded,
      telephone: SITE.phone,
      email: SITE.email,
      areaServed: ["IN", "GE", "RU", "UZ", "KG", "NP", "CN", "KZ"],
      knowsAbout: [
        "MBBS admission abroad",
        "NMC eligibility",
        "FMGE and NExT preparation",
        "Student visa assistance",
      ],
      sameAs: Object.values(SITE.social),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        contactType: "admissions",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    },
    ...OFFICES.map((o, i) => ({
      "@type": "LocalBusiness",
      "@id": `${SITE.url}/#office-${o.city.toLowerCase()}`,
      name: `${SITE.name} — ${o.city}`,
      parentOrganization: { "@id": `${SITE.url}/#organization` },
      telephone: SITE.phone,
      email: SITE.email,
      url: `${SITE.url}/contact`,
      address: {
        "@type": "PostalAddress",
        addressLocality: o.city,
        addressRegion: o.region,
        addressCountry: "IN",
      },
      priceRange: "₹₹",
      ...(i === 0 ? { image: `${SITE.url}/brand/logo.jpg` } : {}),
    })),
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      publisher: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en-IN",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        {/* Resolves the opening sequence before the first paint.
            The curtain ships inside the static HTML, so without
            this a returning visitor sees it flash before React can
            pull it. Synchronous and first in <body>, so it runs
            before anything below is painted — the same trick
            next-themes uses for the palette. Fails open: if
            storage throws, the curtain simply plays. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window[${JSON.stringify(INTRO_T0)}]=Date.now();try{if(sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})==="1"){document.documentElement.setAttribute("data-intro","skip")}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--navy-900)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
          >
            Skip to content
          </a>
          <IntroProvider>
            <ScrollProgress />
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </IntroProvider>
          <WhatsAppFAB />
          <MobileCTABar />
          <LeadModal />
          {/* Clearance for the fixed mobile bar, including the home
              indicator on notched phones. */}
          <div aria-hidden className="mobile-bar-clearance md:hidden" />
        </ThemeProvider>
      </body>
    </html>
  );
}
