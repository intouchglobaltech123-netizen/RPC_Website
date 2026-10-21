/**
 * The monsoon house film, playing: it starts as the loading screen's water
 * runs off (or straight away when there is no loading screen), plays once and
 * stops on the dry house, and moves the caption with it: each place leaking, then what we apply as the
 * coat goes on, then sealed. For each place the panel builds up one piece at
 * a time (the place, the line, why it leaks), and what we use joins it once
 * the coat goes on.
 * The places under the caption jump the film to that leak and play it from
 * there, also once it has ended. Off screen, or in a hidden tab, it rests.
 * When the film has played, the panel steps away and the hook on the left
 * comes in.
 *
 * Where people ask for less motion, or to save data, the film waits on its
 * first frame (the same dry house it ends on) with the hook showing, until
 * they tap a place.
 */
import { film, type ZoneKey } from "./copy";

export interface MonsoonOptions {
  /** wait under the loading screen: the film starts on release() */
  held?: boolean;
  /** coming back to the home page: rest on the film's last frame, the dry house, with the hook showing */
  atEnd?: boolean;
}
export interface MonsoonControls {
  release(): void;
  destroy(): void;
}

interface Caption {
  place: string;
  /** what the owner sees */
  title: string;
  /** what we apply */
  apply: string;
  href: string;
  label: string;
  /** the two lines under the caption: label and text */
  note: [string, string][];
}
type Key = ZoneKey | "dry" | "rain";
/** a place in the film: leaking, the coat going on, sealed */
type Phase = "leak" | "apply" | "sealed";

export function mountMonsoon(section: HTMLElement, opts: MonsoonOptions = {}): MonsoonControls {
  const video = section.querySelector<HTMLVideoElement>(".mh-film");
  const now = section.querySelector<HTMLElement>(".mh-now");
  const chip = section.querySelector<HTMLElement>(".mh-chip");
  if (!video || !now || !chip) return { release() {}, destroy() {} };
  const place = now.querySelector<HTMLElement>(".mh-place")!;
  const cap = now.querySelector<HTMLElement>(".mh-cap")!;
  const more = now.querySelector<HTMLAnchorElement>(".mh-more")!;
  const label = more.firstChild as Text;
  const noteRows = [...now.querySelectorAll<HTMLElement>(".mh-note > div")].map((d) => ({ dt: d.querySelector("dt")!, dd: d.querySelector("dd")! }));
  const flags = [...section.querySelectorAll<HTMLElement>(".mh-flag")];
  const chipPlace = chip.querySelector<HTMLElement>(".mh-chip-place")!;
  const buttons = new Map<ZoneKey, HTMLButtonElement>();
  section.querySelectorAll<HTMLButtonElement>("[data-ch]").forEach((b) => buttons.set(b.dataset.ch as ZoneKey, b));
  const captions = new Map<string, Caption>();
  section.querySelector<HTMLTemplateElement>(".mh-captions")?.content.querySelectorAll<HTMLElement>("[data-zone]").forEach((el) => {
    const d = el.dataset;
    captions.set(d.zone!, {
      place: d.place!,
      title: d.title!,
      apply: d.apply!,
      href: d.href!,
      label: d.label!,
      note: [
        [d.n1l ?? "", d.n1 ?? ""],
        [d.n2l ?? "", d.n2 ?? ""],
      ],
    });
  });

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  section.classList.add("mh-js");

  let live = false;
  /** the visitor paused it (or it never started for them): it stays paused until they press play */
  let stopped = still || saveData;
  /** the film has played to its end: it rests on the dry house, with the hook */
  let ended = false;
  let onScreen = true;
  let raf = 0;
  let shown: Key | "" = "";
  let phase: Phase | "" = "";
  let swap = 0;
  /** the panel is clearing for the next place */
  let pending = false;
  let fade = 0;

  /* ---------------------------------------------------------- caption */

  /** where the film is: the rain coming in, a place (and how far its fix has got), or the house drying out */
  function at(t: number): { key: Key; phase: Phase } {
    if (t >= film.outro) return { key: "dry", phase: "sealed" };
    for (const c of film.chapters) if (t >= c.start && t < c.end) return { key: c.zone, phase: t >= c.sealed ? "sealed" : t >= c.applying ? "apply" : "leak" };
    return { key: "rain", phase: "leak" };
  }
  /** while the rain comes in, the caption already names the first place, waiting for it */
  const captionFor = (key: Key) => captions.get(key === "rain" ? film.chapters[0]!.zone : key);
  function setPhase(p: Phase, c: Caption | undefined, instant: boolean) {
    if (p === phase) return;
    const was = phase;
    phase = p;
    now!.dataset.phase = p;
    for (const f of flags) {
      f.classList.toggle("is-applying", p === "apply");
      f.classList.toggle("is-sealed", p === "sealed");
    }
    if (!c) return;
    // the line under the place: what the owner sees while it leaks, then what we apply
    const text = p === "leak" ? c.title : c.apply;
    if (cap.textContent === text) return;
    window.clearTimeout(fade);
    if (instant || still || !was) cap.textContent = text;
    else {
      cap.classList.add("is-fade");
      fade = window.setTimeout(() => {
        cap.textContent = text;
        cap.classList.remove("is-fade");
      }, 180);
    }
  }
  function show(key: Key, p: Phase, instant = false) {
    const c = captionFor(key);
    if (key === shown) {
      // while the last place's words are going, the new ones wait for the panel to clear
      if (!pending || instant) setPhase(p, c, instant);
      return;
    }
    const prev = shown;
    shown = key;
    for (const [z, b] of buttons) b.setAttribute("aria-current", String(z === key));
    // from the rain to the first place, the caption is already right
    if (!c || (prev === "rain" && place.textContent === c.place)) {
      setPhase(p, c, instant);
      return;
    }
    const fill = () => {
      pending = false;
      place.textContent = c.place;
      chipPlace.textContent = c.place;
      label.textContent = c.label;
      more.href = c.href;
      c.note.forEach(([l, t], i) => {
        const row = noteRows[i];
        if (!row) return;
        row.dt.textContent = l;
        row.dd.textContent = t;
      });
      phase = "";
      setPhase(p, c, true);
      now!.dataset.zone = key;
      chip!.classList.remove("is-swap");
      // the panel builds up again one piece at a time (lib/monsoon/markup.ts): cleared at once, without its fade, then in
      now!.classList.add("is-reset");
      now!.classList.remove("is-in");
      void now!.offsetWidth;
      now!.classList.remove("is-reset");
      now!.classList.add("is-in");
    };
    window.clearTimeout(swap);
    if (instant || still) fill();
    else {
      // the last place's words go first, together
      pending = true;
      now!.classList.remove("is-in");
      chip!.classList.add("is-swap");
      swap = window.setTimeout(fill, 240);
    }
  }
  function bars(t: number) {
    for (const c of film.chapters) {
      const p = t >= c.end ? 1 : t <= c.start ? 0 : (t - c.start) / (c.end - c.start);
      buttons.get(c.zone)?.style.setProperty("--p", p.toFixed(3));
    }
  }
  function update(instant = false) {
    const t = video!.currentTime || 0;
    const w = at(t);
    show(w.key, w.phase, instant);
    bars(t);
  }

  /* ---------------------------------------------------------- playing */

  function loop() {
    raf = 0;
    update();
    if (!video!.paused) raf = requestAnimationFrame(loop);
  }
  function kick() {
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function want() {
    return live && !stopped && !ended && onScreen && !document.hidden;
  }
  function sync() {
    if (want()) {
      // a browser that will not play it on its own (or cannot): it waits for the play button. A play cut short by a pause is no refusal
      if (video!.paused)
        void video!.play().catch((e: unknown) => {
          if (e instanceof DOMException && e.name === "AbortError") return;
          // it waits on the dry house for the play button, with the hook showing
          setStopped(true);
          setEnded(true, false);
        });
    } else if (!video!.paused) video!.pause();
  }
  function setStopped(on: boolean) {
    stopped = on;
  }
  /**
   * The hook shows and the panel steps away: at the end of the film (`again`: it
   * then rests there), or while the film waits to be played
   */
  function setEnded(on: boolean, again = on) {
    ended = on && again;
    section.classList.toggle("is-ended", on);
  }
  const onPlay = () => {
    if (section.classList.contains("is-ended")) setEnded(false);
    kick();
  };
  const onEnded = () => {
    setEnded(true);
    update(true);
  };
  video.addEventListener("ended", onEnded);
  const onPause = () => update(true);
  const onSeek = () => update(true);
  video.addEventListener("play", onPlay);
  video.addEventListener("pause", onPause);
  video.addEventListener("seeked", onSeek);

  // a place jumps the film to the start of its leak, and plays it
  const onChapter = (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-ch]");
    if (!b) return;
    const c = film.chapters.find((x) => x.zone === b.dataset.ch);
    if (!c) return;
    if (section.classList.contains("is-ended")) setEnded(false);
    video.currentTime = c.start + 0.3;
    update(true);
    live = true;
    setStopped(false);
    sync();
  };
  section.addEventListener("click", onChapter);

  const seen = new IntersectionObserver(
    ([en]) => {
      onScreen = Boolean(en?.isIntersecting);
      sync();
    },
    { threshold: 0.15 },
  );
  seen.observe(section);
  const onVisibility = () => sync();
  document.addEventListener("visibilitychange", onVisibility);

  setStopped(stopped);
  update(true);
  if (stopped) setEnded(true, false);

  if (opts.atEnd) {
    // already played this visit: no film, just its last frame and the hook
    live = true;
    section.classList.add("is-live");
    setEnded(true);
    const toEnd = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = Math.max(0, video.duration - 0.05);
      update(true);
    };
    if (video.readyState >= 1) toEnd();
    else video.addEventListener("loadedmetadata", toEnd, { once: true });
  }

  function release() {
    if (live) return;
    live = true;
    section.classList.add("is-live");
    if (!stopped) video!.preload = "auto";
    sync();
  }
  if (!opts.held && !opts.atEnd) release();

  return {
    release,
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(swap);
      window.clearTimeout(fade);
      video.pause();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", onSeek);
      video.removeEventListener("ended", onEnded);
      section.removeEventListener("click", onChapter);
      seen.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.classList.remove("mh-js", "is-live", "is-ended");
    },
  };
}
