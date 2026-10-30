"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { brand, contact, projects, services, stats } from "@/lib/content";
import { HOME_CSS, mountHome, type HomeData } from "@/lib/home/sections";
import { HOOKS_CSS, hooksMarkup, mountHooks, type HookData } from "@/lib/home/hooks";

/** the home page's own sections (about, services, contact) draw from the site's content; About shows four short, plain facts */
const HOME: HomeData = {
  projects,
  services,
  points: [
    { title: "Erode waterproofing contractors", body: "Head office on Perundurai Road." },
    { title: "Coimbatore, Tiruppur, Salem, Chennai", body: "Waterproofing and leak repair in five towns." },
    { title: "Terrace, bathroom, sump, basement", body: "Homes, offices and factories kept leak-free." },
    { title: "Free site inspection", body: "One team from the first visit to handover." },
  ],
  stats,
  contact,
  brand,
};

/**
 * Home page, below the film: one short hook for each page of the site, each
 * with a button to it (lib/home/hooks.ts). The facts are gathered on the
 * server (app/page.tsx), so the product list and the articles never travel to
 * the browser; links to the site's pages go through the router.
 */
export function HomeHooks({ data }: { data: HookData }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const html = useMemo(() => hooksMarkup(HOME, data), []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const off = mountHome(el);
    const offStack = mountHooks(el);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-internal]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      router.push(a.getAttribute("href")!);
    };
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("click", onClick);
      off?.();
      offStack();
    };
  }, [router]);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HOME_CSS + HOOKS_CSS }} />
      <div ref={ref} className="hm" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
