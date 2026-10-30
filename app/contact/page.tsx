import type { Metadata } from "next";
import { PageScripts } from "@/components/pages/PageScripts";
import { contact, services } from "@/lib/content";
import { CONTACT_CSS, contactPageMarkup } from "@/lib/pages/contact";
import { KIT_CSS } from "@/lib/pages/kit";
import { ldJson, pageMeta, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Contact Us – Waterproofing in Erode & Coimbatore",
  description:
    "Call +91 99423 54602, WhatsApp or visit our office in Kurikaran Palayam, Erode, to book a free waterproofing or leak inspection anywhere around Erode and Coimbatore.",
  path: "/contact",
});

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${siteUrl}/contact`,
    name: "Contact RPC Constructions",
    about: { "@id": `${siteUrl}/#organization` },
    mainEntity: {
      "@type": "ContactPoint",
      telephone: contact.phone.replace(/\s+/g, ""),
      email: contact.email,
      contactType: "customer service",
      areaServed: contact.regions,
    },
  },
];

/** Contact: one screen, no footer — the ways to reach us beside the enquiry form */
export default function ContactPage() {
  return (
    <main id="main" className="pg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
      <style dangerouslySetInnerHTML={{ __html: KIT_CSS + CONTACT_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: contactPageMarkup({ contact, types: services.map((s) => s.title) }) }} />
      <PageScripts root="main" kind="contact" />
    </main>
  );
}
