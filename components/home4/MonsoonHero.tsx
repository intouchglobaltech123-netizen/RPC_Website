"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LoadProgress } from "@/components/home3/ArtLoader";
import { contact } from "@/lib/content";
import { BuildLoader } from "./BuildLoader";
import { MONSOON_CSS, monsoonMarkup } from "@/lib/monsoon/markup";
import { mountMonsoon, type MonsoonControls } from "@/lib/monsoon/mount";
import { visit } from "@/lib/visit";

/**
 * Home hero: a film of a house in the monsoon. The rain comes in, then four
 * leaks (the terrace, a falling ceiling in the room below, a leaking bathroom,
 * a damp outside wall) are each shown leaking, being waterproofed and
 * sealed, about four seconds apiece over 20 seconds, and the house ends dry,
 * where the film stops and the hook with its two buttons comes in on the left;
 * a panel follows the film and the places under it jump to that leak (lib/monsoon).
 *
 * It opens behind the loading screen on arrival and after a refresh (the RPC
 * cube built, sealed and flown up into the top bar, components/home4/BuildLoader.tsx);
 * coming back from another page it is simply there, already playing.
 */
export function MonsoonHero() {
  const ref = useRef<HTMLElement>(null);
  const router = useRouter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const html = useMemo(() => monsoonMarkup({ whatsapp: contact.whatsapp }), []);
  const loading = useRef<LoadProgress>({ share: 0, done: false });
  const controls = useRef<MonsoonControls | null>(null);
  // back from another page (not a refresh): no loading screen
  const [resume] = useState(() => visit.homeShown);
  const released = useRef(resume);

  useEffect(() => {
    visit.homeShown = true;
  }, []);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const ctl = mountMonsoon(section, { held: !released.current });
    controls.current = ctl;
    // the loading screen waits for the type faces and the film's first frames, or three seconds at most
    let live = true;
    const video = section.querySelector<HTMLVideoElement>(".mh-film");
    const film = new Promise<void>((done) => {
      if (!video || video.readyState >= 2) return done();
      video.preload = "auto";
      video.addEventListener("loadeddata", () => done(), { once: true });
      video.addEventListener("error", () => done(), { once: true });
    });
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const cap = new Promise<void>((done) => window.setTimeout(done, 3000));
    const ready = () => {
      if (live) loading.current = { share: 1, done: true };
    };
    Promise.race([Promise.all([film, fonts]), cap]).then(ready, ready);
    return () => {
      live = false;
      ctl.destroy();
      controls.current = null;
    };
  }, []);

  // the film starts as the loading screen's water runs off
  const onStart = useCallback(() => {
    released.current = true;
    controls.current?.release();
  }, []);
  const onGone = useCallback(() => {}, []);

  // links to other pages go through the router
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-internal]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      router.push(a.getAttribute("href")!);
    };
    section.addEventListener("click", onClick);
    return () => section.removeEventListener("click", onClick);
  }, [router]);

  return (
    <>
      {!resume && <BuildLoader progress={loading} onStart={onStart} onReveal={onStart} onGone={onGone} />}
      <style dangerouslySetInnerHTML={{ __html: MONSOON_CSS }} />
      <section ref={ref} className="mh" aria-label="Where water gets into a house, and how we seal it" data-nav-tone="dark" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
