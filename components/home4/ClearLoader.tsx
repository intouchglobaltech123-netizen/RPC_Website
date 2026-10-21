"use client";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import type { LoadProgress } from "@/components/home3/ArtLoader";
import { ScrollTrigger } from "@/lib/gsap";
import { CLEAR_CSS, clearLoaderMarkup, mountClearLoader } from "@/lib/loader/clear";

/**
 * Opening screen for the home page: the hero's first frame, blurred in the
 * rain, clears as the page loads while the RPC cube tumbles, then the cube
 * settles and flies off and the screen fades onto the hero (lib/loader/clear.ts).
 * `onStart` and `onReveal` as it starts to go (the film can begin), `onGone`
 * once it has gone; the page holds still until then.
 */
export function ClearLoader({
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
  const html = useMemo(() => clearLoaderMarkup(), []);
  const [gone, setGone] = useState(false);
  // the latest callbacks, without re-mounting the screen
  const cb = useRef({ onStart, onReveal, onGone });
  cb.current = { onStart, onReveal, onGone };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return mountClearLoader(el, {
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
      <style dangerouslySetInnerHTML={{ __html: CLEAR_CSS }} />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
