import type { Metadata } from "next";
import { Footer } from "@/components/contact/Footer";
import { PageScripts } from "@/components/pages/PageScripts";
import { contact, faqs, process, projects } from "@/lib/content";
import { KIT_CSS } from "@/lib/pages/kit";
import { PROJECTS_CSS, projectFaq, projectsPageMarkup } from "@/lib/pages/projects";
import { ldJson, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Waterproofed Building Projects, Erode & Coimbatore",
  description:
    "Apartments, villas, offices and factories by RPC Constructions in Erode, Coimbatore, Perundurai and Chennai, with the waterproofing specified for each one.",
  path: "/projects",
});

const DATA = { projects, contact, process, faqs };

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: projectFaq(DATA).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

/** Projects: the opening with a search by words, status and town, the projects as photo-led cards, and a way to start a project beside the questions people ask */
export default function ProjectsPage() {
  return (
    <>
      <main id="main" className="pg">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
        <style dangerouslySetInnerHTML={{ __html: KIT_CSS + PROJECTS_CSS }} />
        <div dangerouslySetInnerHTML={{ __html: projectsPageMarkup(DATA) }} />
        <PageScripts root="main" kind="projects" />
      </main>
      <Footer />
    </>
  );
}
