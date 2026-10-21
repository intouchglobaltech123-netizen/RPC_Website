"use client";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState, tickScene } from "@/lib/three/store";
import { visit } from "@/lib/visit";

const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  /** the page whose scroll position is being kept, and the last page change handled */
  const here = useRef<string | null>(null);
  const handled = useRef<string | null>(null);

  // remember how far down each page is, so a page can be returned to where it was left;
  // a refresh always opens at the top (the browser is told not to restore the old position)
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const rec = () => {
      // only while the page's own content is showing, not mid-way through a change of page
      if (here.current && window.location.pathname === here.current) visit.scroll.set(here.current, window.scrollY);
    };
    const onPop = () => {
      visit.popAt = performance.now();
    };
    window.addEventListener("scroll", rec, { passive: true });
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("scroll", rec);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (_t: number, dtMs: number) => tickScene(dtMs / 1000);
    gsap.ticker.add(tick);
    // one pointer feed for every parallax layer on the page (hero film, dust, finale)
    const onMove = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (window.matchMedia("(pointer: fine)").matches && !reduced) window.addEventListener("pointermove", onMove, { passive: true });
    // late layout shifts (webfonts, images) → re-measure every trigger once
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });
    if (reduced) {
      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", onMove);
      };
    }

    const l = new Lenis({ duration: 1.35, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
    (window as any).__lenis = l;
    l.on("scroll", (inst: Lenis) => {
      ScrollTrigger.update();
      sceneState.scrollVelocity = inst.velocity;
    });
    const raf = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);
    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      l.destroy();
      (window as any).__lenis = null;
      setLenis(null);
    };
  }, []);

  // on a change of page: the home page, and any page reached with the back or forward
  // button, opens where it was left; anything else opens at the top (or at its #anchor).
  // The first load is left alone: it opens at the top, or at its #anchor.
  useEffect(() => {
    if (handled.current === null) {
      handled.current = here.current = pathname;
      return;
    }
    if (handled.current === pathname) return; // only the smooth scroller arrived
    handled.current = here.current = pathname;
    const pop = performance.now() - visit.popAt < 1500;
    visit.popAt = -Infinity;
    const saved = visit.scroll.get(pathname);
    const hash = window.location.hash;
    if (hash && !pop) {
      // a link to a place on the page goes there
      if (lenis) requestAnimationFrame(() => lenis.scrollTo(hash, { immediate: true }));
    } else {
      const y = saved !== undefined && (pathname === "/" || pop) ? saved : 0;
      // the new page's height first, so the position is not cut short by the old page's
      lenis?.resize();
      lenis?.scrollTo(y, { immediate: true, force: true });
      window.scrollTo(0, y);
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, lenis]);

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
}
