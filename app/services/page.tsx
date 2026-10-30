import type { Metadata } from "next";
import { Footer } from "@/components/contact/Footer";
import { PageScripts } from "@/components/pages/PageScripts";
import { contact, engagementModels, process, services } from "@/lib/content";
import { AREA_PURPOSE, SERVICE_CATEGORIES } from "@/lib/methods/doc";
import { KIT_CSS, serviceSlug } from "@/lib/pages/kit";
import { SERVICES_CSS, serviceFaq, servicesPageMarkup } from "@/lib/pages/services";
import { ldJson, pageMeta, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Waterproofing Services in Erode, Coimbatore, Krishnagiri & Chennai",
  description:
    "Terrace, bathroom, water tank, basement, balcony, external wall, podium and crack waterproofing, leak repair, and homes, offices and factories built to stay dry, in Erode, Coimbatore, Krishnagiri and Chennai. Free site inspection.",
  path: "/services",
});

const areaServed = contact.regions.map((r) => ({ "@type": "City", name: r }));
const provider = { "@id": `${siteUrl}/#organization` };
const items = [
  ...SERVICE_CATEGORIES.map((s) => ({ name: s.title, description: AREA_PURPOSE[s.area] ?? "" })),
  ...services.slice(1).map((s) => ({ name: s.title, description: s.body })),
];

const faq = serviceFaq({ services, process, contact });

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Waterproofing and construction services by RPC Constructions",
    itemListElement: items.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Service", name: s.name, description: s.description, url: `${siteUrl}/services#${serviceSlug(s.name)}`, provider, areaServed },
    })),
  },
];

/** Services: the opening, the eight waterproofing services, the six building services, how a job runs, three ways to work with us, the questions people ask, and the close */
export default function ServicesPage() {
  return (
    <>
      <main id="main" className="pg">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
        <style dangerouslySetInnerHTML={{ __html: KIT_CSS + SERVICES_CSS }} />
        <div dangerouslySetInnerHTML={{ __html: servicesPageMarkup({ services, engagement: engagementModels, process, contact }) }} />
        <PageScripts root="main" kind="services" />
      </main>
      <Footer />
    </>
  );
}
