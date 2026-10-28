/**
 * The home film, played by scrolling: the section is seven steps of scrolling
 * tall and its screen stays pinned (lib/build-film/markup.ts). Each step plays
 * the next stage of the build and stops at that stage's `back` time, in close
 * on its product; the seventh plays on to the end, the finished building,
 * where the words step away and the hook comes in. Scrolling back goes back a
 * stage and plays it again. While the screen is pinned, one scroll gesture
 * (a turn of the wheel, a swipe, an arrow or page key) is one step: the page
 * glides to that step through the site's smooth scroller (Lenis), and the
 * rest of that gesture is let go, so a long flick cannot skip stages. After
 * the last step scrolling carries on down the page as usual. Dragging the
 * scroll bar still works: the film follows to the step it lands on. The
 * stages under the words scroll the page to their step. The site's leak
 * helper button stays hidden until the stages are done.
 *
 * The words at the bottom left follow the film's time: the stage and its
 * number, the product we use there and what it does, and why the stage needs
 * it. The line beside them brightens while the camera is in close.
 *
 * Where people ask for less motion, or to save data, or where the browser
 * will not play the film, nothing plays: each step shows its stage's still
 * frame (in close on the product), and the last the finished building.
 * Off screen, or in a hidden tab, the film rests.
 */
import { film, type StageKey } from "./copy";

export interface BuildOptions {
  /** wait under the loading screen: the film starts on release() */
  held?: boolean;
  /** coming back to the home page: no loading screen, it starts at once */
  atEnd?: boolean;
}
export interface BuildControls {
  release(): void;
  destroy(): void;
}

interface Caption {
  n: string;
  short: string;
  place: string;
  href: string;
  label: string;
  prod: string;
  does: string;
  why: string;
  hint: string;
}

/** how long scrolling has to rest on a step before the film goes there (for the scroll bar, which is not stepped) */
const SETTLE = 90;
/** a step: how long the page takes to glide there (s), and how long other input is held off (ms) */
const GLIDE = 0.85;
const HOLD_OFF = 950;
/** a wheel gesture ends after this long without a wheel event (ms); a swipe this long counts as a step (px) */
const QUIET = 170;
const SWIPE = 34;

type Lenis = { scrollTo(target: number, o?: { duration?: number; easing?: (t: number) => number; force?: boolean; lock?: boolean; immediate?: boolean }): void };
const glide = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function mountBuild(section: HTMLElement, opts: BuildOptions = {}): BuildControls {
  const video = section.querySelector<HTMLVideoElement>(".mh-film");
  const pin = section.querySelector<HTMLElement>(".mh-pin");
  const now = section.querySelector<HTMLElement>(".mh-now");
  const chip = section.querySelector<HTMLElement>(".mh-chip");
  const list = film.chapters;
  if (!video || !pin || !now || !chip || !list.length) return { release() {}, destroy() {} };
  const q = <T extends HTMLElement>(s: string) => section.querySelector<T>(s);
  const place = now.querySelector<HTMLElement>(".mh-place")!;
  const prod = now.querySelector<HTMLElement>(".mh-prod")!;
  const does = now.querySelector<HTMLElement>(".mh-does")!;
  const why = now.querySelector<HTMLElement>(".mh-why-t")!;
  const more = now.querySelector<HTMLAnchorElement>(".mh-more")!;
  const label = more.firstChild as Text;
  const hint = q<HTMLElement>(".mh-hint");
  const hintText = hint?.querySelector("span");
  const counts = [...section.querySelectorAll<HTMLElement>(".mh-count")];
  const chipPlace = chip.querySelector<HTMLElement>(".mh-chip-place")!;
  const buttons = new Map<StageKey, HTMLButtonElement>();
  section.querySelectorAll<HTMLButtonElement>("[data-ch]").forEach((b) => buttons.set(b.dataset.ch as StageKey, b));
  const captions = new Map<string, Caption>();
  section.querySelector<HTMLTemplateElement>(".mh-captions")?.content.querySelectorAll<HTMLElement>("[data-zone]").forEach((el) => {
    const d = el.dataset;
    captions.set(d.zone!, {
      n: String(d.n ?? "").padStart(2, "0"),
      short: d.short ?? "",
      place: d.place ?? "",
      href: d.href ?? "",
      label: d.label ?? "",
      prod: d.prod ?? "",
      does: d.does ?? "",
      why: d.why ?? "",
      hint: d.hint ?? "",
    });
  });

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  section.classList.add("mh-js");

  const last = list.length; // the step after the last stage: the finished building
  let live = false;
  /** nothing plays (less motion, saving data, or the browser would not play it): each step shows its still */
  let stopped = still || saveData;
  let onScreen = true;
  let raf = 0;
  let settle = 0;
  let swap = 0;
  let shown: StageKey | "" = "";
  let close = false;
  /** the step the film is at, and where it stops */
  let step = -1;
  let stopAt = Infinity;

  /* ---------------------------------------------------------- words */

  function at(t: number) {
    let c = list[0]!;
    for (const x of list) if (t >= x.start) c = x;
    return { key: c.key, close: t >= c.uses && t < c.back };
  }
  function show(key: StageKey, instant = false) {
    if (key === shown) return;
    shown = key;
    for (const [k, b] of buttons) b.setAttribute("aria-current", String(k === key));
    const c = captions.get(key);
    if (!c) return;
    const fill = () => {
      place.textContent = c.place;
      chipPlace.textContent = c.short;
      for (const el of counts) el.textContent = c.n;
      prod.textContent = c.prod;
      does.textContent = c.does;
      why.textContent = c.why;
      label.textContent = c.label;
      more.href = c.href;
      if (hintText) hintText.textContent = c.hint;
      now!.dataset.zone = key;
      chip!.classList.remove("is-swap");
      // the words build up again one at a time (lib/build-film/markup.ts): cleared at once, without their fade, then in
      now!.classList.add("is-reset");
      now!.classList.remove("is-in");
      void now!.offsetWidth;
      now!.classList.remove("is-reset");
      now!.classList.add("is-in");
    };
    window.clearTimeout(swap);
    if (instant || still) fill();
    else {
      now!.classList.remove("is-in");
      chip!.classList.add("is-swap");
      swap = window.setTimeout(fill, 240);
    }
  }
  function setClose(on: boolean) {
    if (on === close) return;
    close = on;
    now!.classList.toggle("is-close", on);
  }
  function bars(t: number) {
    for (const c of list) {
      const p = t >= c.end ? 1 : t <= c.start ? 0 : (t - c.start) / (c.end - c.start);
      buttons.get(c.key)?.style.setProperty("--p", p.toFixed(3));
    }
  }
  function update(instant = false) {
    const t = video!.currentTime || 0;
    const w = at(t);
    show(w.key, instant);
    setClose(w.close && !section.classList.contains("is-ended"));
    bars(t);
  }
  function setEnded(on: boolean) {
    section.classList.toggle("is-ended", on);
    hint?.classList.toggle("is-off", on);
    helper();
  }
  /** the leak helper button stays away while the stages are on screen and not yet done */
  function helper() {
    const r = section.getBoundingClientRect();
    const on = live && r.bottom > window.innerHeight * 0.5 && r.top < window.innerHeight * 0.5 && !section.classList.contains("is-ended");
    document.documentElement.classList.toggle("mh-on", on);
  }

  /* ---------------------------------------------------------- playing */

  function loop() {
    raf = 0;
    if (!video!.paused && video!.currentTime >= stopAt) {
      video!.pause();
      video!.currentTime = stopAt;
    }
    update();
    if (!video!.paused) raf = requestAnimationFrame(loop);
  }
  function kick() {
    if (!raf) raf = requestAnimationFrame(loop);
  }
  /** where step k stops (the end of the film for the last step) and where it starts from when jumped to */
  const holdOf = (k: number) => (k >= last ? Infinity : list[k]!.back - 0.04);
  const startOf = (k: number) => (k >= last ? list[last - 1]!.back : list[k]!.start + 0.02);
  function play() {
    if (stopped || !live || !onScreen || document.hidden) return;
    if (video!.ended || video!.currentTime >= stopAt) return;
    if (video!.paused)
      void video!.play().catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        // the browser will not play it: from here each step shows its still
        stopped = true;
        go(step, true);
      });
  }
  /** take the film to step k */
  function go(k: number, again = false) {
    if (k === step && !again) return;
    const from = step;
    step = k;
    const end = k >= last;
    if (!end) setEnded(false);
    if (stopped) {
      // no playing: the stage's still, in close on its product, or the finished building
      video!.pause();
      stopAt = holdOf(k);
      const d = Number.isFinite(video!.duration) ? video!.duration : film.duration;
      video!.currentTime = end ? Math.max(0, d - 0.05) : stopAt;
      setEnded(end);
      update(true);
      return;
    }
    stopAt = holdOf(k);
    const t = video!.currentTime;
    // the next stage, from where the last one stopped: play on. Anything else: from the stage's own start
    const onward = k === from + 1 && from >= 0 && t >= list[Math.min(from, last - 1)]!.start - 0.1 && t <= holdOf(from) + 0.2;
    if (!onward) {
      video!.currentTime = startOf(k);
      update(true);
    }
    play();
    kick();
  }

  const onPlay = () => kick();
  const onPause = () => update(true);
  const onSeek = () => update(true);
  const onEnded = () => {
    setEnded(true);
    update(true);
  };
  video.addEventListener("play", onPlay);
  video.addEventListener("pause", onPause);
  video.addEventListener("seeked", onSeek);
  video.addEventListener("ended", onEnded);

  /* ---------------------------------------------------------- scrolling */

  function metrics() {
    const r = section.getBoundingClientRect();
    const run = Math.max(1, section.offsetHeight - window.innerHeight);
    return { top: r.top + window.scrollY, gap: run / last, into: -r.top };
  }
  /** other input is held off until then (the page is gliding to a step); the last wheel event */
  let heldUntil = 0;
  let lastWheel = 0;
  function stepFromScroll() {
    const m = metrics();
    return Math.max(0, Math.min(last, Math.round(m.into / m.gap)));
  }
  /** the screen is pinned: the section fills the window */
  function pinned() {
    const r = section.getBoundingClientRect();
    return r.top <= 1 && r.bottom >= window.innerHeight - 1;
  }
  function scrollPage(y: number) {
    const l = (window as unknown as { __lenis?: Lenis | null }).__lenis;
    if (l) l.scrollTo(y, { duration: still ? 0 : GLIDE, easing: glide, force: true, lock: true, immediate: still });
    else window.scrollTo({ top: y, behavior: still ? "auto" : "smooth" });
  }
  /** go to step k: the page glides there and the film follows at once */
  function stepTo(k: number) {
    k = Math.max(0, Math.min(last, k));
    const m = metrics();
    heldUntil = performance.now() + HOLD_OFF;
    scrollPage(m.top + k * m.gap);
    go(k, k === step);
  }
  const onScroll = () => {
    helper();
    if (!live) return;
    window.clearTimeout(settle);
    settle = window.setTimeout(() => {
      if (performance.now() < heldUntil) return;
      go(stepFromScroll());
    }, SETTLE);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* one gesture, one step: is this input ours (true), or does the page scroll on as usual (false)? */
  function ours(dir: number) {
    if (!live || !dir || !pinned()) return false;
    const k = Math.max(0, step);
    if (dir > 0 && k >= last) return false; // the stages are done: on down the page
    if (dir < 0 && k <= 0) return false; // the first stage: up to the top of the page
    return true;
  }
  const onWheel = (e: WheelEvent) => {
    const dir = Math.sign(e.deltaY);
    if (!ours(dir) || e.ctrlKey) return;
    e.preventDefault();
    e.stopPropagation();
    const t = performance.now();
    const fresh = t - lastWheel > QUIET;
    lastWheel = t;
    // the rest of a gesture (a long flick, a trackpad's glide) is let go
    if (!fresh || t < heldUntil || Math.abs(e.deltaY) < 2) return;
    stepTo(Math.max(0, step) + dir);
  };
  let touchY: number | null = null;
  let swiped = false;
  const onTouchStart = (e: TouchEvent) => {
    touchY = e.touches[0]?.clientY ?? null;
    swiped = false;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (touchY === null) return;
    const dy = touchY - (e.touches[0]?.clientY ?? touchY);
    const dir = Math.sign(dy);
    if (!ours(dir)) return;
    e.preventDefault();
    if (swiped || Math.abs(dy) < SWIPE || performance.now() < heldUntil) return;
    swiped = true;
    stepTo(Math.max(0, step) + dir);
  };
  const KEYS: Record<string, number> = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };
  const onKey = (e: KeyboardEvent) => {
    const dir = KEYS[e.key];
    const el = e.target as HTMLElement | null;
    if (!dir || e.altKey || e.ctrlKey || e.metaKey || (e.key === " " && e.shiftKey)) return;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName))) return;
    if (!ours(dir)) return;
    e.preventDefault();
    e.stopPropagation();
    if (performance.now() < heldUntil) return;
    stepTo(Math.max(0, step) + dir);
  };
  window.addEventListener("wheel", onWheel, { passive: false, capture: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
  window.addEventListener("keydown", onKey, { capture: true });

  // a stage scrolls the page to its step
  const onChapter = (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-ch]");
    if (!b) return;
    const k = list.findIndex((x) => x.key === b.dataset.ch);
    if (k >= 0) stepTo(k);
  };
  section.addEventListener("click", onChapter);

  const seen = new IntersectionObserver(
    ([en]) => {
      onScreen = Boolean(en?.isIntersecting);
      if (!onScreen) video.pause();
      else play();
    },
    { threshold: 0.15 },
  );
  seen.observe(pin);
  const onVisibility = () => (document.hidden ? video.pause() : play());
  document.addEventListener("visibilitychange", onVisibility);

  update(true);

  function release() {
    if (live) return;
    live = true;
    section.classList.add("is-live");
    if (!stopped) video!.preload = "auto";
    const k = stepFromScroll();
    if (stopped && video!.readyState < 1) video!.addEventListener("loadedmetadata", () => go(k, true), { once: true });
    go(k, true);
    helper();
  }
  if (!opts.held || opts.atEnd) release();

  return {
    release,
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(swap);
      window.clearTimeout(settle);
      video.pause();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", onSeek);
      video.removeEventListener("ended", onEnded);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("keydown", onKey, { capture: true });
      document.documentElement.classList.remove("mh-on");
      section.removeEventListener("click", onChapter);
      seen.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.classList.remove("mh-js", "is-live", "is-ended");
    },
  };
}
