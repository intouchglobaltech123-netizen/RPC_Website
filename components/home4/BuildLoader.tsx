"use client";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import type { LoadProgress } from "@/components/home3/ArtLoader";
import { ScrollTrigger } from "@/lib/gsap";
import { BUILD_CSS, buildLoaderMarkup, mountBuildLoader } from "@/lib/loader/build";

/**
 * Opening screen for the home page: the RPC cube is built, walls then top, on
 * night blue drawing paper as the page loads, sealed, and becomes the logo,
 * which flies up into the top bar as the screen fades onto the hero
 * (lib/loader/build.ts). `onStart` and `onReveal` as it starts to go (the film
 * can begin), `onGone` once it has gone; the page holds still until then.
 */
export function BuildLoader({
  progress,
  onStart,
  onReveal,
  onGone,
}: {
  progress: RefObject<LoadProgress>;
  onStart?: () => void;
  onReveal: () => void;
  onGone: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const html = useMemo(() => buildLoaderMarkup(), []);
  const [gone, setGone] = useState(false);
  // the latest callbacks, without re-mounting the screen
  const cb = useRef({ onStart, onReveal, onGone });
  cb.current = { onStart, onReveal, onGone };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return mountBuildLoader(el, {
      getProgress: () => progress.current,
      onStart: () => cb.current.onStart?.(),
      onReveal: () => cb.current.onReveal(),
      onGone: () => {
        setGone(true);
        cb.current.onGone();
      },
    });
  }, [progress]);

  // the page holds still until the screen has gone
  useEffect(() => {
    if (!lenis) return;
    if (gone) {
      lenis.start();
      ScrollTrigger.refresh();
    } else lenis.stop();
  }, [gone, lenis]);

  if (gone) return null;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BUILD_CSS }} />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
