import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { LeakBot } from "@/components/leakbot/LeakBot";
import { Nav } from "@/components/navigation/Nav";
import { QualityProvider } from "@/components/providers/QualityProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { brand, contact, services } from "@/lib/content";
import { serviceSlug } from "@/lib/home/sections";
import { siteUrl } from "@/lib/site";
import "./globals.css";

/** headings: Inter Tight, the text's own family, set semibold (under the variable every heading already uses), so the whole site is one family */
const serif = localFont({
  src: "../public/fonts/inter-tight-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-instrument",
  display: "swap",
  fallback: ["Segoe UI", "system-ui", "sans-serif"],
});
/** the logo's "RPC" keeps its Poppins Bold */
const logo = localFont({
  src: "../public/fonts/poppins-latin-700-normal.woff",
  weight: "700",
  variable: "--font-logo",
  display: "swap",
  fallback: ["Segoe UI", "system-ui", "sans-serif"],
});
const sans = localFont({
  src: "../public/fonts/inter-tight-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter-tight",
  display: "swap",
});
const mono = localFont({
  src: "../public/fonts/geist-mono-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
  display: "swap",
});

const description =
  "RPC Constructions is a waterproofing and construction company in Erode, Tamil Nadu: terrace, bathroom, sump and basement waterproofing, leak repair, and homes, offices and factories built to stay dry across Coimbatore, Tiruppur, Salem and Chennai since 2012.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RPC Constructions — Waterproofing & Construction in Erode",
    template: `%s | ${brand.name}`,
  },
  description,
  applicationName: brand.name,
  keywords: [
    "waterproofing contractors Erode",
    "waterproofing Coimbatore",
    "terrace waterproofing Erode",
    "bathroom leakage repair Erode",
    "basement waterproofing Coimbatore",
    "sump and water tank waterproofing",
    "roof leak repair Coimbatore",
    "construction company in Erode",
    "building contractors Erode",
    "civil contractors Tamil Nadu",
    "turnkey house construction",
    "commercial construction Coimbatore",
    "industrial shed construction Perundurai",
    "design and build contractor",
    "RPC Constructions",
  ],
  authors: [{ name: brand.name, url: siteUrl }],
  creator: brand.name,
  publisher: brand.name,
  category: "construction",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: brand.name,
    title: "RPC Constructions — Waterproofing in Erode & Coimbatore",
    description,
    images: [{ url: "/images/og-rpc.png", width: 1200, height: 630, alt: "RPC Constructions: waterproofing and construction in Erode, Coimbatore and across Tamil Nadu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RPC Constructions — Waterproofing in Erode & Coimbatore",
    description,
    images: ["/images/og-rpc.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
  formatDetection: { telephone: true, email: true, address: true },
  // PLACEHOLDER — paste the Google Search Console verification token here
  // verification: { google: "..." },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": `${siteUrl}/#organization`,
  name: brand.name,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/images/og-rpc.png`,
  description,
  foundingDate: "2012",
  email: contact.email,
  telephone: contact.phone.replace(/\s/g, ""),
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "142 Perundurai Road",
    addressLocality: "Erode",
    addressRegion: "Tamil Nadu",
    postalCode: "638011",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: contact.geo.lat, longitude: contact.geo.lng },
  areaServed: contact.regions.map((r) => ({ "@type": "City", name: r })),
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}`,
  knowsAbout: [
    "Building construction",
    "Turnkey house construction",
    "Commercial construction",
    "Industrial construction",
    "Waterproofing",
    "Terrace waterproofing",
    "Bathroom waterproofing",
    "Basement waterproofing",
    "Water tank waterproofing",
    "Leak repair",
    "Interiors",
    "Project management",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Construction and waterproofing services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.body, url: `${siteUrl}/services#${serviceSlug(s.title)}` },
    })),
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:30",
      closes: "18:30",
    },
  ],
  sameAs: contact.socials.map((s) => s.href).filter((h) => h.startsWith("http")),
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: brand.name,
  inLanguage: "en-IN",
  publisher: { "@id": `${siteUrl}/#organization` },
};

export const viewport: Viewport = {
  themeColor: "#0b2350",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable} ${mono.variable} ${logo.variable}`}>
      <body>
        {/* a refresh opens the page at the top, not where it was left (moving between pages: see SmoothScroll) */}
        <script dangerouslySetInnerHTML={{ __html: "try{history.scrollRestoration='manual'}catch(e){}" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationLd, websiteLd]) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <QualityProvider>
          <SmoothScroll>
            <Nav />
            {children}
          </SmoothScroll>
          <LeakBot />
        </QualityProvider>
      </body>
    </html>
  );
}
