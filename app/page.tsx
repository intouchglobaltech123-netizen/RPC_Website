import type { Metadata } from "next";
import { Footer } from "@/components/contact/Footer";
import { HomeSections } from "@/components/home3/HomeSections";
import { MonsoonHero } from "@/components/home4/MonsoonHero";
import { brand } from "@/lib/content";
import { PRODUCTS } from "@/lib/products";
import { brandInfo } from "@/lib/products/brands";
import { homeLayersMarkup } from "@/lib/products/home";

const title = "Waterproofing Contractors in Erode & Coimbatore | RPC Constructions";
const description =
  "Terrace, bathroom, sump and basement waterproofing in Erode and Coimbatore, plus leak repair and leak-free new homes, offices and factories. Free site inspection.";

/** the home page's own search title and snippet (the layout's stay as the site defaults) */
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: brand.name,
    title,
    description,
    images: [{ url: "/images/og-rpc.png", width: 1200, height: 630, alt: "RPC Constructions: waterproofing and construction in Erode, Coimbatore and across Tamil Nadu" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/og-rpc.png"] },
};

/** what the products section needs: the count, the brands, and the jobs drawn layer by layer, rendered here so the product list stays on the server */
const productsSummary = {
  count: PRODUCTS.length,
  brands: brandInfo(PRODUCTS).map((b) => b.name),
  teaser: homeLayersMarkup(PRODUCTS),
};

/**
 * Home: the monsoon house (a film of a house in the rain: each leak, from the
 * terrace to the outside walls, is shown and sealed in turn), then five sections:
 * projects, services, about, the products we supply layer by layer, and the
 * contact close; and the site's own footer.
 */
export default function Home() {
  return (
    <>
      <main id="main" className="relative">
        <MonsoonHero />
        <HomeSections parts={["projects", "services", "about", "products", "contact"]} products={productsSummary} />
      </main>
      <Footer />
    </>
  );
}
