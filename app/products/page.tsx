import type { Metadata } from "next";
import { Footer } from "@/components/contact/Footer";
import { PageScripts } from "@/components/pages/PageScripts";
import { contact } from "@/lib/content";
import { KIT_CSS } from "@/lib/pages/kit";
import { PRODUCTS_CSS, productsPageMarkup } from "@/lib/pages/products";
import { PRODUCTS } from "@/lib/products";
import { fullName } from "@/lib/products/compare";
import { ldJson, pageMeta, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Waterproofing Products & Construction Chemicals in Erode",
  description:
    "Fosroc, Sika, CCI, Renacon and Berger products in Erode, brand by brand: waterproofing coatings, admixtures, tile adhesives, grouts, repair mortars and AAC blocks. Compare brands job by job and ask for today's rate.",
  path: "/products",
});

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: `${siteUrl}/products`,
    name: "Waterproofing products and construction chemicals",
    about: { "@id": `${siteUrl}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: PRODUCTS.length,
      itemListElement: PRODUCTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: fullName(p), url: `${siteUrl}/products#${p.slug}` })),
    },
  },
];

/** Products: the brands with their counts, every product brand by brand, the jobs compared across brands, and the close */
export default function ProductsPage() {
  return (
    <>
      <main id="main" className="pg">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
        <style dangerouslySetInnerHTML={{ __html: KIT_CSS + PRODUCTS_CSS }} />
        <div dangerouslySetInnerHTML={{ __html: productsPageMarkup({ products: PRODUCTS, contact }) }} />
        <PageScripts root="main" kind="products" />
      </main>
      <Footer />
    </>
  );
}
