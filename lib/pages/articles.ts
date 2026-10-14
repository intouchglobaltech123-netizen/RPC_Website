/**
 * Blog. The index: the banner (the heading, a line on what the articles cover,
 * and the search right under it, beside a cutaway photograph), the latest
 * article large, then the rest as cards. The article page: the title on the
 * banner ground, the cover, the text at a reading width beside a contents list
 * that follows where you are (with a line along the top showing how far
 * through you are), a deep-blue box for anyone seeing the problem at home, and
 * more to read.
 *
 * Colour: every topic wears the same navy flag on its photograph (no topic
 * colours). Orange appears only on what can be pressed: "Read the article",
 * the bar and arrow circle of a hovered card, the help box's buttons.
 *
 * Covers: each post's own cover photograph (lib/blog.ts), in the chamfered
 * frame; the photo zooms a little inside its frame when the card is hovered.
 * The generated covers carry a small sparkle mark in their bottom-right
 * corner, so every cover frame crops that corner out (see "cover crop" in
 * BLOG_CSS) until real RPC photographs replace them. Inside a card link the
 * cover is decorative (alt=""): the title already names the article.
 */
import { SEARCH_BAR_CSS, searchBar } from "./search-bar";
import { METHODS } from "../methods/data";
import { arrow, banner, ctaBand, esc, more, ruler, secHead, shortDate, shot, tel, tick, waGlyph, words, type ContactInfo, type PageOptions } from "./kit";

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
const when = (p: PostData) => `<time datetime="${esc(p.date)}">${shortDate(p.date)}</time><span>${p.readMinutes} min read</span>`;
const bulb = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/></svg>`;
const phone = `<svg class="po-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 3.6h2.5l1.4 4-1.9 1.3a11 11 0 0 0 6.4 6.4l1.3-1.9 4 1.4v2.5a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.7 5.8a2 2 0 0 1 2-2.2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
/** every cover photograph is 16:9 (1600×900 or 1920×1080); the frame sets the shape shown */
const COVER: readonly [number, number] = [1600, 900];
/**
 * the photograph at the top of the index: a finished apartment block, roof terraces and balconies included.
 * No other page shows it (Services already uses the terrace-slab cutaway), and it is not a cover, so the
 * latest article's photo is not shown twice in a row.
 */
const BANNER_SHOT = {
  src: "/images/completed-frame.jpg",
  alt: "A finished apartment block with balconies on every floor and shaded terraces on its roof",
  size: [1440, 810] as const,
};
/**
 * a post's cover inside a card link, with the topic as a navy flag on its bottom-left corner (and anything
 * else laid over it). The photo is decorative here (alt=""): the link already reads the title, so the long
 * description would only repeat it. The article page keeps the real alt on its own cover.
 */
const cover = (p: PostData, cls: string, over = "", eager = false) =>
  shot(p.cover, "", `bl-cover ${cls}`, eager, { size: COVER, extra: `${over}<p class="pg-flag bl-flag">${esc(p.category)}</p>` });

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

/** a post as a card (index and related reading): the whole card is the link. `wide` sets it two to a row on desktop. */
export function postCard(p: PostData, _o: PageOptions = {}, cat = false, wide = false) {
  return `<li${wide ? ' class="bl-wide"' : ""}${cat ? ` data-methods="${methodsIn(p).join(" ")}" data-text="${esc(`${p.title} ${p.excerpt} ${p.category}`.toLowerCase())}"` : ""} data-rv><article class="bl-card"><a class="pg-card pg-cardx bl-link" href="/blog/${esc(p.slug)}" data-internal>
  ${cover(p, "bl-cardph")}
  <div class="bl-cardcopy">
    <p class="bl-when">${when(p)}</p>
    <h3 class="bl-title">${esc(p.title)}</h3>
    <p class="bl-ex">${esc(p.excerpt)}</p>
    <div class="bl-foot">${more("Read more")}</div>
  </div>
</a></article></li>`;
}

/**
 * The cards, in rows of three. When the count would leave a short last row,
 * the first cards go two to a row (a little larger) so every row is full:
 * 5 = 2 + 3, 4 = 2 + 2, 7 = 2 + 2 + 3. While a search hides some, the rows go
 * back to plain thirds (CSS).
 */
function cardGrid(posts: readonly PostData[], o: PageOptions, cat = false) {
  const r = posts.length % 3;
  const wide = r === 2 ? 2 : r === 1 && posts.length >= 4 ? 4 : 0;
  return `<ul class="bl-grid" data-rv-stagger="80">${posts.map((p, i) => postCard(p, o, cat, i < wide)).join("")}</ul>`;
}

export function blogIndexMarkup(d: { posts: readonly PostData[]; contact: ContactInfo }, o: PageOptions = {}) {
  const [lead, ...rest] = d.posts;
  // the filters: the twelve waterproofing methods, each with how many articles talk about it
  const per = new Map(d.posts.map((p) => [p.slug, methodsIn(p)] as const));
  const topics = new Set(d.posts.map((p) => p.category)).size;
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
  const head = banner({
    n: "01",
    label: "Blog",
    title: "Waterproofing advice from our&nbsp;engineers.",
    accentFrom: 2,
    intro: "Guides on terrace, bathroom, sump and basement waterproofing, leak repair and pre-monsoon checks, for homes and buildings in Erode, Coimbatore and across Tamil Nadu.",
    actions: bar,
    media: shot(BANNER_SHOT.src, BANNER_SHOT.alt, "bl-hshot", true, { size: BANNER_SHOT.size }),
    fact: { n: String(d.posts.length), label: `articles on ${topics} topics` },
    cls: "bl-head",
  });
  const feature = lead
    ? `<article class="bl-feat" data-methods="${methodsIn(lead).join(" ")}" data-text="${esc(`${lead.title} ${lead.excerpt} ${lead.category}`.toLowerCase())}" data-rv><a class="pg-card pg-cardx bl-featlink" href="/blog/${esc(lead.slug)}" data-internal>
  ${cover(lead, "bl-featph", `<span class="pg-glass bl-new">Latest</span>`)}
  <div class="bl-featcopy">
    <h2 class="bl-featt">${esc(lead.title)}</h2>
    <p class="bl-ex">${esc(lead.excerpt)}</p>
    <p class="bl-when bl-by"><span>${esc(lead.author)}</span>${when(lead)}</p>
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
        ? `${ruler("bl-seam")}<div class="bl-morehead"><h2 class="pg-h3">More articles</h2><p class="bl-status" data-topic-status aria-live="polite">Showing all ${d.posts.length} articles</p></div>
    ${cardGrid(rest, o, true)}`
        : `<p class="bl-status" data-topic-status aria-live="polite">Showing all ${d.posts.length} articles</p>`
    }
    <p class="bl-empty" hidden><span>No articles match your search.</span><button type="button" class="pg-btn pg-btn--line" data-reset>Show all articles</button></p>
  </div>
</section>
${ctaBand(d.contact, {
  title: "Have a leak we haven’t covered?",
  steps: [
    ["Send us a photo", "A picture of the stain, crack or damp wall on WhatsApp helps us prepare."],
    ["We call to ask a few questions", "When it leaks, what is above it and how long it has been there."],
    ["We confirm the cause on site", "Before suggesting any work, at a visit that costs you nothing."],
  ],
})}`;
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
        s.list ? `<ul>${s.list.map((li) => `<li>${tick}${esc(li)}</li>`).join("")}</ul>` : "",
        s.tip ? `<aside class="po-tip" aria-label="Tip">${bulb}<p><b>Tip</b>${esc(s.tip)}</p></aside>` : "",
      ].join("");
      return s.heading ? `<section id="${anchor(s.heading)}" data-sec>${inner}</section>` : `<div>${inner}</div>`;
    })
    .join("\n");
  return `<div class="po-progress" aria-hidden="true"><i></i></div>
<article class="po" aria-labelledby="po-title">
  <header class="pg-head pg-banner po-head">
    <div class="pg-wrap">
      <p class="po-cat" data-rv>${esc(p.category)}</p>
      <h1 class="po-h1" id="po-title" data-rv="words">${words(esc(p.title))}</h1>
      <p class="po-by" data-rv><span>${esc(p.author)}</span>${when(p)}</p>
    </div>
  </header>
  <div class="pg-wrap po-main">
    <div data-rv="fade">${shot(p.cover, p.coverAlt, "po-cover", true, { size: COVER })}</div>
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
        <div class="po-help pg-panel--blue">
          <p class="po-helph">Seeing this at home?</p>
          <p>Send us a photo on WhatsApp, or book a visit. Inspections are free.</p>
          <a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Book an inspection${arrow}</a>
          <div class="po-quick"><a class="pg-btn pg-btn--line" href="${tel(c.phone)}">${phone}Call</a><a class="pg-btn pg-btn--line" href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">${waGlyph}WhatsApp</a></div>
        </div>
      </aside>
    </div>
  </div>
</article>
${
  d.related.length
    ? `<section class="pg-sec po-related" aria-labelledby="po-rel">
  ${ruler()}
  <div class="pg-wrap">
    ${secHead({
      label: "Keep reading",
      title: `More from the <span class="pg-acc">blog.</span>`,
      id: "po-rel",
      split: true,
      extra: `<a class="pg-link" href="/blog" data-internal>All articles${arrow}</a>`,
    })}
    ${cardGrid(d.related, o)}
  </div>
</section>`
    : ""
}`;
}

export const BLOG_CSS = SEARCH_BAR_CSS + `
/* ── index banner: the search sits under the intro, as a row of pills ── */
.bl-head .pg-actions{display:block;max-width:44rem}
.bl-head .pg-intro{max-width:38rem}
/* a chosen method is the selected state: an orange ring on a faint orange wash. (Once the list is drawn the
   real select sits just after its label, so .sb-f.is-set never lands; this reads the select itself.) */
.bl-bar .sb-f:has(+ select option:checked:not(:first-child)) .fs-btn{box-shadow:inset 0 0 0 1.5px var(--act);background:color-mix(in srgb,var(--act) 10%,var(--theme-surface))}
.bl-bar .sb-f:has(+ select option:checked:not(:first-child)) .fs-btn[aria-expanded=true]{box-shadow:inset 0 0 0 2px var(--accent)}

/* ── shared: the cover frame, the topic flag, the date line, the excerpt ── */
.bl-cover{--ar:16/10}
/* cover crop: the generated covers carry a sparkle mark low in their bottom-right corner (from about 88% across
   and 80% down), so the photo is drawn a little larger than its frame and pinned to the top-left: the right-hand
   ~15% falls outside the frame (16:10 frames: 106%; the 16:9 wide cards: 117%). The 21:9 article cover is cropped
   at the bottom instead (pinned to the top). The hover zoom only narrows what shows, so the mark never comes back. */
.pg-media.bl-cover>img,.pg-media.po-cover>img{inset:0 auto auto 0;width:var(--crop,106%);height:var(--crop,106%);object-position:0 0}
.bl-wide .bl-cardph{--crop:117%}
.pg-media.po-cover{--crop:100%}
.pg-media.po-cover>img{object-position:50% 0}
.bl-flag{max-width:calc(100% - 1rem);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.bl-when{display:flex;flex-wrap:wrap;align-items:center;gap:.3rem .6rem;margin:0;font-size:var(--fs-body);line-height:1.4;color:var(--mute)}
.bl-when>*+*::before,.po-by>*+*::before{content:"";display:inline-block;width:4px;height:4px;margin-right:.6rem;border-radius:50%;background:currentColor;opacity:.55;vertical-align:middle;transform:translateY(-1px)}
.bl-ex{margin:.65rem 0 0;font-size:var(--fs-body);line-height:1.6;color:var(--ink2);text-wrap:pretty}
.bl-feat[hidden],.bl-grid>li[hidden],.bl-empty[hidden]{display:none}

.bl-sec{padding-bottom:clamp(1.2rem,3vh,2rem)}

/* ── the latest article: photo 7, words 5; the whole card is the link, its button the orange action ── */
.bl-featlink{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(1.4rem,3vw,3rem);align-items:center;padding:.75rem;color:var(--ink);text-decoration:none}
.bl-featph{border-radius:10px}
/* "Latest": the glass pill, its fill made dark enough for white text over the photo's light sky (AA) */
.pg-glass.bl-new{position:absolute;top:1rem;right:1rem;z-index:1;background:color-mix(in srgb,var(--theme-ink) 74%,transparent)}
.bl-featcopy{display:flex;flex-direction:column;align-items:flex-start;min-width:0;padding:clamp(.6rem,2vw,1.6rem) clamp(.6rem,2vw,1.6rem) clamp(.6rem,2vw,1.6rem) 0}
.bl-featt{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance;transition:color .35s var(--ease)}
.bl-featcopy .bl-ex{margin-top:1rem;max-width:34rem}
.bl-by{align-self:stretch;margin-top:1.4rem;padding-top:1.1rem;border-top:1px solid var(--line)}
.bl-by>span:first-child{font-weight:600;color:var(--ink)}
.bl-featcopy .pg-btn{margin-top:1.5rem}
.bl-featlink:hover .bl-featt{color:var(--accent)}
.bl-featlink:hover .pg-btn--ink::before,.bl-featlink:focus-visible .pg-btn--ink::before{transform:scaleX(1)}
.bl-featlink:hover .pg-btn>.pg-ar,.bl-featlink:focus-visible .pg-btn>.pg-ar{transform:translate(2px,-2px);box-shadow:0 0 0 3px color-mix(in srgb,var(--theme-white) 35%,transparent)}

/* ── the rest: a ruler seam, the count, then the cards ── */
.bl-seam{margin-top:clamp(2.8rem,7vh,4.2rem)}
.bl-feat[hidden] + .bl-seam{margin-top:0}
.bl-morehead{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.5rem 2rem;margin:clamp(1.2rem,3vh,1.6rem) 0 clamp(1.4rem,3.4vh,2.2rem)}
.bl-status{margin:0;font-size:var(--fs-body);color:var(--mute)}
.bl-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:1.5rem;margin:0;padding:0;list-style:none}
.bl-grid>li{display:flex;grid-column:span 2;min-width:0}
.bl-grid>li.bl-wide{grid-column:span 3}
.bl-grid:has(>li[hidden])>li{grid-column:span 2}
.bl-wide .bl-cardph{--ar:16/9}
.bl-grid:has(>li[hidden]) .bl-wide .bl-cardph{--ar:16/10;--crop:106%}
.bl-card{display:flex;flex:1;min-width:0}
.bl-link{display:flex;flex-direction:column;flex:1;min-width:0;padding:.6rem;color:var(--ink);text-decoration:none}
.bl-cardph{border-radius:10px}
.bl-cardcopy{display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:0;padding:1.1rem .65rem .65rem}
.bl-title{margin:.55rem 0 0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.015em;text-wrap:balance;transition:color .35s var(--ease)}
.bl-link:hover .bl-title{color:var(--accent)}
.bl-link .bl-ex{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:1.3rem}
.bl-foot{align-self:stretch;margin-top:auto;padding-top:1rem;border-top:1px solid var(--line)}
.bl-foot .pg-more{display:flex;justify-content:space-between}

/* ── nothing found: a dashed frame, like a drawing still to be filled in ── */
.bl-empty{display:flex;flex-direction:column;align-items:center;gap:1.1rem;margin:0;padding:clamp(2.6rem,7vh,3.8rem) 1.2rem;border:1px dashed var(--tick);border-radius:var(--r-card);text-align:center;font-size:var(--fs-body);color:var(--mute)}
.bl-feat:not([hidden]) ~ .bl-empty{margin-top:1.5rem}

/* ── reading progress, along the very top (a reading aid, so blue) ── */
.po-progress{position:fixed;inset:0 0 auto;z-index:60;height:3px;pointer-events:none}
.po-progress i{position:absolute;inset:0;background:var(--accent);transform-origin:left;transform:scaleX(0)}

/* ── the article: the banner ground (grid, hatched foot) over a white reading page ── */
.po{background:var(--theme-surface)}
.po-head.pg-banner{padding-bottom:calc(clamp(2.2rem,5vh,3.2rem) + 12px)}
.po-head .pg-wrap,.po-main{max-width:calc(72rem + 2 * var(--gutter,3rem))}
.po-cat{display:inline-flex;align-items:center;margin:0;padding:.35rem .85rem .35rem 1rem;border-radius:6px;background:var(--navy);color:var(--theme-on-dark);font-size:var(--fs-body);font-weight:600;line-height:1.3;clip-path:polygon(.55rem 0,100% 0,100% 100%,0 100%,0 .55rem)}
.po-h1{margin:1rem 0 0;max-width:24ch;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance}
.po-by{display:flex;flex-wrap:wrap;align-items:center;gap:.3rem .6rem;margin:1.1rem 0 0;font-size:var(--fs-body);color:var(--mute)}
.po-by>span:first-child{font-weight:600;color:var(--ink)}
.po-main{padding-top:clamp(1.8rem,4.5vh,2.8rem)}
.po-cover{--ar:21/9}
.po-grid{display:grid;grid-template-columns:minmax(0,1fr) 18rem;gap:clamp(2rem,5vw,5rem);padding:clamp(2.2rem,5vh,3.4rem) 0 clamp(3.6rem,9vh,5.4rem)}
.po-body{max-width:44rem;min-width:0}
.po-body section,.po-body > div{scroll-margin-top:calc(var(--nav-bar,80px) + 1.5rem)}
.po-body section + section,.po-body div + section{margin-top:2.6rem}
/* each part opens on a small blue survey-point diamond */
.po-body h2{position:relative;margin:0;padding-left:1.35rem;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.015em;text-wrap:balance}
.po-body h2::before{content:"";position:absolute;left:.1rem;top:calc(.625em - .25rem);width:.5rem;height:.5rem;background:var(--accent);transform:rotate(45deg)}
.po-body p{margin:.95rem 0 0;font-size:var(--fs-body);line-height:1.78;color:var(--ink2)}
.po-body .po-lead{margin:0 0 1.5rem;padding-left:1.2rem;border-left:3px solid var(--accent);line-height:1.7;color:var(--ink)}
.po-body ul{margin:1.1rem 0 0;padding:0;list-style:none}
.po-body li{position:relative;margin-top:.7rem;padding-left:2rem;font-size:var(--fs-body);line-height:1.65;color:var(--ink2)}
.po-body li>.pg-tick{position:absolute;left:0;top:.18em;width:1.3rem;height:1.3rem;padding:.2rem;border-radius:6px;background:color-mix(in srgb,var(--theme-primary) 10%,transparent);color:var(--water)}
.po-tip{display:flex;gap:.9rem;align-items:flex-start;margin-top:1.6rem;padding:1.1rem 1.3rem 1.1rem 1.4rem;border-radius:0 var(--r-ctl) var(--r-ctl) 0;background:var(--sky);box-shadow:inset 3px 0 0 var(--accent)}
.po-tip svg{flex:none;width:22px;height:22px;margin-top:.1rem;color:var(--accent)}
.po-tip p{display:flex;flex-direction:column;gap:.3rem;margin:0;font-size:var(--fs-body);line-height:1.6;color:var(--ink)}
.po-tip b{font-size:var(--fs-body);color:var(--accent)}
.po-body .po-note{margin-top:2.6rem;padding-top:1.2rem;border-top:1px solid var(--line);font-size:var(--fs-body);line-height:1.6;color:var(--mute)}

/* the side: the contents list (a hairline, the part you are in marked in blue) and the help box */
.po-aside{position:sticky;top:calc(var(--nav-bar,80px) + 1.5rem);align-self:start;display:flex;flex-direction:column;gap:1.8rem}
.po-toc p{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.po-toc ol{margin:.8rem 0 0;padding:0;list-style:none;border-left:1px solid var(--line)}
.po-toc li{margin:0}
.po-toc a{position:relative;display:block;padding:.45rem 0 .45rem 1rem;font-size:var(--fs-body);line-height:1.4;color:var(--mute);text-decoration:none;transition:color .3s var(--ease)}
.po-toc a::before{content:"";position:absolute;left:-1px;top:.35rem;bottom:.35rem;width:2px;background:var(--accent);transform:scaleY(0);transition:transform .4s var(--ease)}
.po-toc a:hover{color:var(--accent)}
.po-toc a[aria-current]{color:var(--ink);font-weight:600}
.po-toc a[aria-current]::before{transform:scaleY(1)}
/* a chamfered deep-blue box, hatched along its top: the orange button books, the white rings call or message */
.po-help{padding:calc(1.4rem + 8px) 1.4rem 1.4rem;clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut))}
.po-helph{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;color:var(--theme-on-dark)}
.po-help p:not(.po-helph){margin:.55rem 0 0;font-size:var(--fs-body);line-height:1.55;color:var(--band-mute)}
.po-help .pg-btn--ink{width:100%;justify-content:space-between;margin-top:1.3rem}
.po-quick{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.6rem}
.po-quick .pg-btn{flex:1 1 auto;height:2.75rem;padding:0 .9rem;gap:.45rem}
.po-ico{width:16px;height:16px;flex:none}

/* more to read: page grey after the white article, a ruler along the seam */
.po-related>.pg-ruler{position:absolute;top:0;left:0;right:0}

@media (max-width:1023px){
  .bl-featlink{grid-template-columns:minmax(0,1fr);align-items:start}
  .bl-featcopy{padding:.5rem .65rem .9rem}
  .bl-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .bl-grid>li,.bl-grid>li.bl-wide,.bl-grid:has(>li[hidden])>li{grid-column:auto}
  .bl-wide .bl-cardph{--ar:16/10;--crop:106%}
  .po-grid{grid-template-columns:minmax(0,1fr)}
  .po-aside{position:static;order:2;max-width:34rem}
  .po-toc{display:none}
}
/* tablet: an odd last card takes the whole row, photo beside its words */
@media (min-width:640px) and (max-width:1023px){
  .bl-grid:not(:has(>li[hidden]))>li:last-child:nth-child(odd){grid-column:1/-1}
  .bl-grid:not(:has(>li[hidden]))>li:last-child:nth-child(odd) .bl-link{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start}
}
@media (max-width:767px){
  .bl-featcopy .pg-btn{width:100%;justify-content:space-between}
  .pg-glass.bl-new{top:.75rem;right:.75rem}
  /* the author on a line of their own, so no line starts with a separator dot */
  .bl-by>span:first-child,.po-by>span:first-child{flex-basis:100%}
  .bl-by>time::before,.po-by>time::before{content:none}
  .po-body .po-lead{margin-bottom:1.3rem}
  .pg-media.po-cover{--ar:16/10;--crop:106%}
  .pg-media.po-cover>img{object-position:0 0}
}
@media (max-width:639px){
  .bl-grid{grid-template-columns:minmax(0,1fr)}
}
`;
