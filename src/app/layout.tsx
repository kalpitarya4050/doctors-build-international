import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB, MobileCTABar, LeadModal, ScrollProgress } from "@/components/layout/FloatingCTA";
import { SITE } from "@/lib/site";
import { OFFICES } from "@/lib/data/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBFD" },
    { media: "(prefers-color-scheme: dark)", color: "#060D1C" },
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
    <html lang="en-IN" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
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
          <ScrollProgress />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
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
