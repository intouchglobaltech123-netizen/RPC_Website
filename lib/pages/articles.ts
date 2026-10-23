/**
 * Blog. The index: the heading and the topics, the latest article large, then
 * the rest as cards. The article page: the title, the text at a reading width
 * beside a contents list that follows where you are (with a line along the
 * top showing how far through you are), a box for anyone seeing the problem at
 * home, and more to read.
 *
 * Cover photographs: none of the generated pictures are shown; each cover is
 * an empty frame in its topic's colour, ready for RPC's own photograph.
 */
import { SEARCH_BAR_CSS, searchBar } from "./search-bar";
import { METHODS } from "../methods/data";
import { arrow, esc, ph, shortDate, tel, words, type ContactInfo, type PageOptions } from "./kit";

export interface PostSection {
  heading?: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
  tip?: string;
}
export interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  cover: string;
  coverAlt: string;
  author: string;
  sections: readonly PostSection[];
}

export const BLOG_TRAIL = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
] as const;

export const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
/** each topic's colour, for its covers and its label */
const TOPIC: Record<string, { bg: string; ink: string }> = {
  Planning: { bg: "#d9e2ee", ink: "#2756a0" },
  Terraces: { bg: "#e7dcc5", ink: "#8a5a12" },
  Bathrooms: { bg: "#d2e5e6", ink: "#0b6e80" },
  "Tanks & basements": { bg: "#dcdcec", ink: "#4b4a8f" },
  Maintenance: { bg: "#e4e0cc", ink: "#5f6b1f" },
};
const topic = (c: string) => TOPIC[c] ?? { bg: "#e2d9c9", ink: "#12223b" };
const tone = (c: string) => `--tbg:${topic(c).bg};--tink:${topic(c).ink}`;
const when = (p: PostData) => `<time datetime="${esc(p.date)}">${shortDate(p.date)}</time><span>${p.readMinutes} min read</span>`;
const bulb = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/></svg>`;
const cover = (p: PostData, ratio: string, cls = "") => ph({ ratio, cls: `bl-cover${cls ? ` ${cls}` : ""}` });

/** the words that show an article talks about each of the twelve methods */
const METHOD_WORDS: Record<string, RegExp> = {
  cementitious: /cementitious|cement-based|slurry/i,
  "liquid-membrane": /liquid membrane|liquid-applied|liquid applied/i,
  polyurethane: /polyurethane|\bPU\b/,
  bituminous: /bitumen|bituminous/i,
  "torch-on": /torch/i,
  hdpe: /hdpe/i,
  crystalline: /crystalline/i,
  acrylic: /acrylic|elastomeric/i,
  polyurea: /polyurea/i,
  injection: /inject/i,
  integral: /admixture|integral/i,
  waterstops: /waterstop/i,
};
/** the methods an article talks about, by key */
const methodsIn = (p: PostData) => {
  const t = [p.title, p.excerpt, ...p.sections.flatMap((s) => [s.heading ?? "", ...(s.paragraphs ?? []), ...(s.list ?? []), s.tip ?? ""])].join(" ");
  return METHODS.filter((m) => METHOD_WORDS[m.key]?.test(t)).map((m) => m.key);
};

/** a post as a card (index and related reading) */
export function postCard(p: PostData, _o: PageOptions = {}, cat = false) {
  return `<li${cat ? ` data-methods="${methodsIn(p).join(" ")}" data-text="${esc(`${p.title} ${p.excerpt} ${p.category}`.toLowerCase())}"` : ""} data-rv><article class="bl-card" style="${tone(p.category)}"><a href="/blog/${esc(p.slug)}" data-internal>
  ${cover(p, "16/10")}
  <div class="bl-cardcopy">
    <p class="bl-cat">${esc(p.category)}</p>
    <h3 class="bl-title">${esc(p.title)}</h3>
    <p class="bl-ex">${esc(p.excerpt)}</p>
    <p class="bl-when">${when(p)}</p>
  </div>
</a></article></li>`;
}

export function blogIndexMarkup(d: { posts: readonly PostData[]; contact: ContactInfo }, o: PageOptions = {}) {
  const [lead, ...rest] = d.posts;
  // the filters: the twelve waterproofing methods, each with how many articles talk about it
  const per = new Map(d.posts.map((p) => [p.slug, methodsIn(p)] as const));
  const bar = searchBar({
    label: "Search articles",
    placeholder: "Search articles",
    cls: "bl-bar",
    hidden: true,
    filters: [
      {
        key: "method",
        label: "Waterproofing method",
        options: [
          { value: "all", text: `All methods (${d.posts.length})` },
          ...METHODS.map((m) => {
            const n = d.posts.filter((p) => per.get(p.slug)!.includes(m.key)).length;
            return { value: m.key, text: `${m.short} (${n})`, disabled: n === 0 };
          }),
        ],
      },
    ],
  });
  const head = `<header class="pg-head bl-head">
  <div class="pg-wrap">
    <div class="bl-headgrid">
      <div>
        <p class="pg-mark">Blog</p>
        <h1 class="pg-h1" data-rv="words">${words("Waterproofing advice from our&nbsp;engineers.")}</h1>
      </div>
      <div class="bl-headside">${bar}</div>
    </div>
  </div>
</header>`;
  const feature = lead
    ? `<article class="bl-feat" data-methods="${methodsIn(lead).join(" ")}" data-text="${esc(`${lead.title} ${lead.excerpt} ${lead.category}`.toLowerCase())}" style="${tone(lead.category)}" data-rv><a href="/blog/${esc(lead.slug)}" data-internal>
  ${cover(lead, "16/10", "bl-featph")}
  <div class="bl-featcopy">
    <p class="bl-cat"><span class="bl-new">Latest</span>${esc(lead.category)}</p>
    <h2 class="bl-featt">${esc(lead.title)}</h2>
    <p class="bl-ex">${esc(lead.excerpt)}</p>
    <p class="bl-when"><span>${esc(lead.author)}</span>${when(lead)}</p>
    <span class="pg-btn pg-btn--ink">Read the article${arrow}</span>
  </div>
</a></article>`
    : "";
  return `${head}
<section class="pg-sec bl-sec" aria-label="Articles">
  <div class="pg-wrap">
    ${feature}
    ${
      rest.length
        ? `<div class="bl-morehead"><h2 class="pg-h3">More articles</h2><p class="bl-status" data-topic-status aria-live="polite">Showing all ${d.posts.length} articles</p></div>
    <ul class="bl-grid bl-grid--rows" data-rv-stagger="80">${rest.map((p) => postCard(p, o, true)).join("")}</ul>`
        : `<p class="bl-status" data-topic-status aria-live="polite">Showing all ${d.posts.length} articles</p>`
    }
    <p class="bl-empty" hidden>No articles match your search. <button type="button" data-reset>Show all articles</button></p>
  </div>
</section>`;
}

export function postMarkup(d: { post: PostData; related: readonly PostData[]; contact: ContactInfo }, o: PageOptions = {}) {
  const p = d.post;
  const c = d.contact;
  const toc = p.sections.filter((s) => s.heading).map((s) => s.heading!);
  // the article's own opening paragraph is set as its lead (the excerpt stays on the cards)
  let lead = false;
  const para = (t: string, open: boolean) => {
    const first = open && !lead;
    if (first) lead = true;
    return `<p${first ? ' class="po-lead"' : ""}>${esc(t)}</p>`;
  };
  const body = p.sections
    .map((s) => {
      const inner = [
        s.heading ? `<h2>${esc(s.heading)}</h2>` : "",
        ...(s.paragraphs ?? []).map((t) => para(t, !s.heading)),
        s.list ? `<ul>${s.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>` : "",
        s.tip ? `<aside class="po-tip" aria-label="Tip">${bulb}<p><b>Tip</b>${esc(s.tip)}</p></aside>` : "",
      ].join("");
      return s.heading ? `<section id="${anchor(s.heading)}" data-sec>${inner}</section>` : `<div>${inner}</div>`;
    })
    .join("\n");
  return `<div class="po-progress" aria-hidden="true"><i></i></div>
<article class="po" aria-labelledby="po-title" style="${tone(p.category)}">
  <header class="pg-head po-head">
    <div class="pg-wrap">
      <p class="bl-cat po-cat" data-rv>${esc(p.category)}</p>
      <h1 class="po-h1" id="po-title" data-rv="words">${words(esc(p.title))}</h1>
      <p class="po-by" data-rv><span>${esc(p.author)}</span>${when(p)}</p>
    </div>
  </header>
  <div class="pg-wrap po-main">
    <div data-rv>${cover(p, "3/1", "po-cover")}</div>
    <div class="po-grid">
      <div class="po-body">
        ${body}
        <p class="po-note">This article is general guidance. Every site is different, so speak to a qualified engineer before making decisions about your project.</p>
      </div>
      <aside class="po-aside">
        ${
          toc.length > 1
            ? `<nav class="po-toc" aria-label="In this article"><p>In this article</p><ol>${toc.map((h) => `<li><a href="#${anchor(h)}">${esc(h)}</a></li>`).join("")}</ol></nav>`
            : ""
        }
        <div class="po-help">
          <p class="po-helph">Seeing this at home?</p>
          <p>Send us a photo on WhatsApp, or book a visit.</p>
          <a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a>
          <div class="po-quick"><a href="${tel(c.phone)}">Call</a><a href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp</a></div>
        </div>
      </aside>
    </div>
  </div>
</article>
${
  d.related.length
    ? `<section class="pg-sec pg-sec--stone po-related" aria-labelledby="po-rel">
  <div class="pg-wrap">
    <div class="po-relhead"><h2 class="pg-h2" id="po-rel">More from the blog.</h2><a class="pg-link" href="/blog" data-internal>All articles${arrow}</a></div>
    <ul class="bl-grid" data-rv-stagger="80">${d.related.map((r) => postCard(r, o)).join("")}</ul>
  </div>
</section>`
    : ""
}`;
}

export const BLOG_CSS = SEARCH_BAR_CSS + `
/* index: the heading, then the topics */
.bl-headgrid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:1.4rem clamp(2rem,5vw,6rem);align-items:end}
.bl-headgrid .pg-mark{margin-bottom:.9rem}
.bl-headgrid .pg-intro{margin:0}
.bl-head{padding-bottom:clamp(1.6rem,4vh,2.4rem)}
.bl-headside{min-width:0;padding-bottom:.5rem}
.bl-bar{max-width:36rem;margin-left:auto}
.bl-sec{padding-top:clamp(2rem,5vh,3rem)}

/* covers: empty frames in the topic's colour */
.bl-cover{border-radius:6px;background:var(--tbg,#e2d9c9);box-shadow:inset 0 0 0 1px rgba(18,34,59,.06);color:color-mix(in srgb,var(--tink,#12223b) 55%,transparent)}

/* topic, excerpt and date, shared */
.bl-cat{display:flex;align-items:center;gap:.6rem;margin:0;font-size:var(--fs-body);font-weight:600;color:var(--tink,var(--accent))}
.bl-new{display:inline-flex;align-items:center;height:1.6rem;padding:0 .6rem;border-radius:6px;background:var(--navy);font-size:var(--fs-body);color:#f5f0e6}
.bl-ex{margin:.7rem 0 0;font-size:var(--fs-body);line-height:1.6;color:var(--ink2);text-wrap:pretty}
.bl-when{display:flex;flex-wrap:wrap;gap:.3rem 1.1rem;margin:.9rem 0 0;font-size:var(--fs-body);color:var(--mute)}

/* the latest article, large */
.bl-feat a{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:clamp(1.4rem,3vw,3rem);align-items:center;padding:clamp(.7rem,1vw,.9rem);border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:var(--ink);text-decoration:none;transition:box-shadow .3s}
.bl-feat a:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.bl-feat .bl-cover{border-radius:8px}
.bl-featcopy{display:flex;flex-direction:column;align-items:flex-start;padding:clamp(.6rem,1.6vw,1.6rem) clamp(.4rem,1.6vw,1.6rem) clamp(.6rem,1.6vw,1.6rem) 0}
.bl-featt{margin:.8rem 0 0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.14;letter-spacing:-.02em;text-wrap:balance}
.bl-featcopy .bl-when span:first-child{font-weight:600;color:var(--ink)}
.bl-feat .pg-btn{margin-top:1.4rem}
.bl-feat a:hover .pg-ar{transform:translate(2px,-2px)}
.bl-feat a:focus-visible{outline:2px solid var(--accent);outline-offset:4px}

/* the rest, as cards */
.bl-morehead{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.6rem 2rem;margin:clamp(2.6rem,7vh,4rem) 0 clamp(1.2rem,3vh,1.6rem);padding-top:1.2rem;border-top:1px solid var(--line)}
.bl-status{margin:0;font-size:var(--fs-body);color:var(--mute)}
.bl-empty{margin:0;padding:3rem 0;text-align:center;font-size:var(--fs-body);color:var(--mute)}
.bl-empty button{border:0;border-bottom:1px solid currentColor;background:none;padding:0 0 2px;font:600 var(--fs-body) var(--sans);color:var(--ink);cursor:pointer}
.bl-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(.8rem,1.6vw,1.4rem);margin:0;padding:0;list-style:none}
.bl-card{height:100%}
.bl-card a{display:flex;flex-direction:column;height:100%;padding:.6rem;border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);text-decoration:none;color:var(--ink);transition:box-shadow .3s}
.bl-card a:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.bl-card a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.bl-cardcopy{display:flex;flex-direction:column;flex:1;padding:1rem .6rem .5rem}
.bl-title{margin:.45rem 0 0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.01em;text-wrap:balance}
.bl-card a:hover .bl-title{color:var(--accent)}
.bl-card .bl-ex{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.bl-card .bl-when{margin-top:auto;padding-top:1rem}
/* the blog's list as rows: the picture on the left, the article beside it */
.bl-grid.bl-grid--rows{grid-template-columns:minmax(0,1fr);gap:.9rem}
.bl-grid--rows .bl-card a{display:grid;grid-template-columns:minmax(12rem,20rem) minmax(0,1fr);gap:clamp(1rem,2.5vw,2rem);align-items:center;padding:.6rem}
.bl-grid--rows .bl-cover{height:100%;min-height:10rem;aspect-ratio:auto !important;border-radius:6px}
.bl-grid--rows .bl-cardcopy{padding:.8rem 1rem .8rem 0}
.bl-grid--rows .bl-title{font-size:var(--fs-sub);line-height:1.25}
.bl-grid--rows .bl-ex{-webkit-line-clamp:2;max-width:62ch}
.bl-grid--rows .bl-when{margin-top:.8rem;padding-top:0}
@media (max-width:767px){
  .bl-grid--rows .bl-card a{grid-template-columns:minmax(0,7.5rem) minmax(0,1fr);gap:.9rem;align-items:start}
  .bl-grid--rows .bl-cover{min-height:6.5rem}
  .bl-grid--rows .bl-cardcopy{padding:.2rem .4rem .3rem 0}
  .bl-grid--rows .bl-title{font-size:var(--fs-body)}
  .bl-grid--rows .bl-ex{display:none}
}

/* reading progress, along the very top */
.po-progress{position:fixed;inset:0 0 auto;z-index:60;height:3px;pointer-events:none}
.po-progress i{position:absolute;inset:0;background:var(--water,#0b6e80);transform-origin:left;transform:scaleX(0)}

/* the article */
.po-head{border-bottom:0;padding-bottom:clamp(1.6rem,4vh,2.4rem)}
.po-head .pg-wrap,.po-main{max-width:calc(72rem + 2 * var(--gutter,3rem))}
.po-cat{margin-top:0}
.po-h1{margin:.7rem 0 0;max-width:24ch;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.14;letter-spacing:-.02em;text-wrap:balance}
.po-by{display:flex;flex-wrap:wrap;gap:.3rem 1.1rem;margin:1.1rem 0 0;font-size:var(--fs-body);color:var(--mute)}
.po-by span:first-child{font-weight:600;color:var(--ink)}
.po-cover{border-radius:8px}
.po-grid{display:grid;grid-template-columns:minmax(0,1fr) 17rem;gap:clamp(2rem,5vw,5rem);padding:clamp(2.2rem,5vh,3.4rem) 0 clamp(3.6rem,9vh,5.4rem)}
.po-body{max-width:44rem;min-width:0}
.po-lead{margin:0 0 2rem;padding-left:1.1rem;border-left:3px solid var(--tink,var(--accent));font-size:var(--fs-body);line-height:1.7;color:var(--ink)}
.po-body section,.po-body > div{scroll-margin-top:calc(var(--nav-bar,80px) + 1.5rem)}
.po-body section + section,.po-body div + section{margin-top:2.6rem}
.po-body h2{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.01em}
.po-body p{margin:.95rem 0 0;font-size:var(--fs-body);line-height:1.78;color:var(--ink2)}
.po-body ul{margin:1.1rem 0 0;padding:0;list-style:none}
.po-body li{position:relative;margin-top:.7rem;padding-left:1.9rem;font-size:var(--fs-body);line-height:1.65;color:var(--ink2)}
.po-body li::before{content:"";position:absolute;left:0;top:.28em;width:18px;height:18px;border-radius:6px;background:rgba(39,86,160,.1) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4.5 8.5 7 11l4.5-5' fill='none' stroke='%232756a0' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/12px no-repeat}
.po-tip{display:flex;gap:.9rem;align-items:flex-start;margin-top:1.6rem;padding:1.1rem 1.3rem;border-radius:8px;background:var(--sky)}
.po-tip svg{flex:none;width:22px;height:22px;margin-top:.1rem;color:var(--accent)}
.po-tip p{display:flex;flex-direction:column;gap:.3rem;margin:0;font-size:var(--fs-body);line-height:1.6;color:var(--ink)}
.po-tip b{font-size:var(--fs-body);color:var(--accent)}
.po-body .po-note{margin-top:2.6rem;padding-top:1.2rem;border-top:1px solid var(--line);font-size:var(--fs-body);line-height:1.6;color:var(--mute)}
.po-aside{position:sticky;top:calc(var(--nav-bar,80px) + 1.5rem);align-self:start;display:flex;flex-direction:column;gap:1.6rem}
.po-toc p{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.po-toc ol{margin:.8rem 0 0;padding:0;list-style:none;border-left:1px solid var(--line)}
.po-toc li{margin:0}
.po-toc a{position:relative;display:block;padding:.45rem 0 .45rem 1rem;font-size:var(--fs-body);line-height:1.4;color:var(--mute);text-decoration:none;transition:color .3s}
.po-toc a::before{content:"";position:absolute;left:-1px;top:.35rem;bottom:.35rem;width:2px;border-radius:2px;background:var(--accent);transform:scaleY(0);transition:transform .4s cubic-bezier(.2,.7,.2,1)}
.po-toc a:hover{color:var(--ink)}
.po-toc a[aria-current]{color:var(--ink);font-weight:600}
.po-toc a[aria-current]::before{transform:scaleY(1)}
.po-help{padding:1.3rem;border-radius:8px;background:var(--sky)}
.po-helph{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2}
.po-help p:not(.po-helph){margin:.5rem 0 0;font-size:var(--fs-body);line-height:1.55;color:var(--ink2)}
.po-help .pg-btn{width:100%;margin-top:1rem}
.po-quick{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:.5rem}
.po-quick a{display:grid;place-items:center;height:2.6rem;border-radius:6px;background:var(--card);box-shadow:inset 0 0 0 1px rgba(39,86,160,.18);font-size:var(--fs-body);font-weight:600;text-decoration:none}
.po-quick a:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.po-relhead{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 2rem;margin-bottom:clamp(1.6rem,4vh,2.4rem)}
.po-relhead .pg-h2{margin:0}

@media (max-width:1023px){
  .bl-headgrid{grid-template-columns:1fr}
  .bl-bar{max-width:none;margin-left:0}
  .bl-feat a{grid-template-columns:1fr;align-items:start}
  .bl-featcopy{padding:.4rem .6rem .9rem}
  .bl-grid{grid-template-columns:1fr 1fr}
  .po-grid{grid-template-columns:1fr}
  .po-aside{position:static;order:2}
  .po-toc{display:none}
}
@media (max-width:767px){
  .bl-feat .pg-btn{width:100%}
  .bl-grid{grid-template-columns:1fr}
  .po-cover{border-radius:6px}
  .po-lead{margin-bottom:1.6rem}
}
`;
