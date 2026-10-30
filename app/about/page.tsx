import type { Metadata } from "next";
import { Footer } from "@/components/contact/Footer";
import { PageScripts } from "@/components/pages/PageScripts";
import { company, contact, partners, principles, services } from "@/lib/content";
import { ABOUT_CSS, aboutMarkup, type AboutData } from "@/lib/pages/about";
import { KIT_CSS } from "@/lib/pages/kit";
import { ldJson, pageMeta, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About Us – Waterproofing Contractors in Erode since 2012",
  description:
    "RPC Constructions is a waterproofing and construction company founded in Erode in 2012. Our vision, our mission and our values, and the towns we work in: Erode, Coimbatore, Krishnagiri and Chennai.",
  path: "/about",
});

const DATA: AboutData = {
  story: company.story.slice(0, 2),
  partners,
  vision: company.vision,
  mission: company.mission,
  principles,
  services: services.map((s) => ({ title: s.title, line: s.line })),
  contact,
  founded: "2012",
};

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${siteUrl}/about`,
    name: "About RPC Constructions",
    description: company.vision,
    about: { "@id": `${siteUrl}/#organization` },
  },
];

/** About: who we are, our vision and mission, our values, where we work, and the close */
export default function AboutPage() {
  return (
    <>
      <main id="main" className="pg">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
        <style dangerouslySetInnerHTML={{ __html: KIT_CSS + ABOUT_CSS }} />
        <div dangerouslySetInnerHTML={{ __html: aboutMarkup(DATA) }} />
        <PageScripts root="main" kind="about" />
      </main>
      <Footer />
    </>
  );
}
