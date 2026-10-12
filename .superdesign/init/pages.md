# Pages — dependency trees

Local imports only (node_modules such as `next`, `react`, `gsap`, `lenis`, `framer-motion`, `lucide-react` skipped). `{...}` = imported symbols. `(type)` = type-only import (erased at runtime). A module already expanded above is shown once more without children, marked `→ see above`.

## Shared shell (applies to every page below)

```
app/layout.tsx
├── app/globals.css
├── components/navigation/Nav.tsx                         {Nav}
│   ├── lib/content.ts                                    {brand, contact, nav}
│   ├── lib/three/store.ts                                {sceneState}
│   │   └── lib/utils/math.ts                             {damp}
│   ├── components/providers/SmoothScroll.tsx             {useLenis}
│   └── components/navigation/Logo.tsx                    {Wordmark}
│       └── components/ui/logo.png
├── components/providers/QualityProvider.tsx              {QualityProvider}
│   ├── lib/gsap/index.ts                                 {ScrollTrigger}
│   ├── lib/three/store.ts                                (type Quality)
│   └── lib/utils/useQuality.ts                           {useQuality}
│       └── lib/three/store.ts                            (type Quality)
├── components/providers/SmoothScroll.tsx                 {SmoothScroll}
│   ├── lib/gsap/index.ts                                 {gsap, ScrollTrigger}
│   ├── lib/three/store.ts                                {sceneState, tickScene}
│   └── lib/visit.ts                                      {visit}
├── lib/content.ts                                        {brand, contact, services}
├── lib/home/sections.ts                                  {serviceSlug}
│   └── lib/methods/brand-logos.ts                        {brandsMarqueeHtml, BRANDS_MARQUEE_CSS}
│       └── lib/methods/doc.ts                            {BRAND_SPECIALITY}
└── lib/site.ts                                           {siteUrl}
app/template.tsx                                          (no imports; pass-through)

components/contact/Footer.tsx                             {Footer}
├── components/navigation/Logo.tsx                        {Wordmark} → components/ui/logo.png
├── components/ui/SocialIcons.tsx                         {SocialIcon}
├── lib/content.ts                                        {brand, contact, nav}
└── lib/methods/doc.ts                                    {SERVICE_CATEGORIES}

components/pages/PageScripts.tsx                          {PageScripts}   (every inner page)
├── components/providers/SmoothScroll.tsx                 {useLenis}
└── lib/pages/behaviour.ts                                {mountPageBehaviour, PageKind}
    ├── lib/pages/fancy-select.ts                         {fancySelect}
    ├── lib/pages/contact-form.ts                         {mountContactForm}
    ├── import("./products-page")      [kind="products"]  {mountProducts}
    │   ├── lib/pages/fancy-select.ts                     {fancySelect}
    │   ├── lib/products/rate.ts                          {rateHref}
    │   └── lib/pages/behaviour.ts                        (type PageEnv)
    └── import("./methods-behaviour")  [kind="methods"]   {mountMethods}
        ├── lib/pages/behaviour.ts                        (type PageEnv)
        ├── lib/pages/methods-compare.ts                  {compareRowsHtml, CmpMethod}
        └── lib/pages/methods-rain.ts                     {mountRain}
            ├── lib/methods/data.ts                       {METHOD_GROUPS, METHODS}
            └── lib/pages/kit.ts                          {esc}
```

## `/` — `app/page.tsx`

```
app/page.tsx
├── components/contact/Footer.tsx                         → see shell
├── components/home3/HomeSections.tsx                     {HomeSections}  ("use client")
│   ├── lib/content.ts                                    {brand, contact, highlights, projects, services, stats}
│   └── lib/home/sections.ts                              {HOME_CSS, HOME_PRODUCTS_CSS, homeSectionsMarkup, mountHome, HomeData, HomePart}
│       └── lib/methods/brand-logos.ts                    {brandsMarqueeHtml, BRANDS_MARQUEE_CSS}
│           └── lib/methods/doc.ts                        {BRAND_SPECIALITY}
├── components/home4/MonsoonHero.tsx                      {MonsoonHero}  ("use client")
│   ├── components/providers/SmoothScroll.tsx             {useLenis}
│   ├── components/home3/ArtLoader.tsx                    (type LoadProgress)
│   ├── components/home3/DropLoader.tsx                   {DropLoader}
│   │   ├── components/providers/SmoothScroll.tsx         {useLenis}
│   │   ├── lib/gsap/index.ts                             {ScrollTrigger}
│   │   ├── lib/loader/drop.ts                            {DROP_CSS, dropLoaderMarkup, mountDropLoader}
│   │   └── components/home3/ArtLoader.tsx                (type LoadProgress)
│   ├── lib/content.ts                                    {contact}
│   ├── lib/monsoon/markup.ts                             {MONSOON_CSS, monsoonMarkup}
│   │   ├── lib/monsoon/copy.ts                           {intro, outro, steps}
│   │   │   └── lib/monsoon/scene.ts                      (type ZoneKey)
│   │   └── lib/monsoon/scene.ts                          {motionMarkup, sceneMarkup}
│   ├── lib/monsoon/mount.ts                              {mountMonsoon, MonsoonControls}
│   │   └── lib/monsoon/scene.ts                          {H, HOTSPOTS, LAMP, PUDDLE_SCREEN, TANK_SCREEN, TERRACE_FLOOR, VIEWS, VIEWS_PHONE, YARD_PUDDLES, ZONE_KEYS, ZoneKey}
│   └── lib/visit.ts                                      {visit}
├── lib/content.ts                                        {brand}
├── lib/products/index.ts                                 {PRODUCTS}
│   ├── lib/products/rate.ts                              {rateHref}
│   ├── lib/products/catalogue.ts                         {PRODUCTS}
│   │   └── lib/products/types.ts                         (type Product)
│   └── lib/products/types.ts                             (type Product, Pack)
├── lib/products/brands.ts                                {brandInfo}
│   ├── lib/products/index.ts                             {FAMILIES, PRODUCTS, Product}
│   └── lib/products/compare.ts                           {useTerms}
│       ├── lib/products/index.ts                         {familyOf, productBySlug, SYSTEMS}
│       └── lib/products/types.ts                         (type Product)
└── lib/products/home.ts                                  {homeLayersMarkup}
    ├── lib/products/index.ts                             {productBySlug, SYSTEMS, PRODUCTS, Product}
    ├── lib/products/brands.ts                            {brandMark}
    ├── lib/products/compare.ts                           {shortName}
    └── lib/products/layer-art.ts                         {LAYER_ART_SIZE, LAYER_PINS}
+ shell (layout, Nav)
```

## `/services` — `app/services/page.tsx`

```
app/services/page.tsx                                     (server component; metadata via pageMeta; FAQPage + ItemList JSON-LD)
├── components/contact/Footer.tsx                         {Footer}
│   ├── components/navigation/Logo.tsx                    {Wordmark}
│   │   └── components/ui/logo.png
│   ├── components/ui/SocialIcons.tsx                     {SocialIcon}
│   ├── lib/content.ts                                    {brand, contact, nav}
│   └── lib/methods/doc.ts                                {SERVICE_CATEGORIES}
├── components/pages/PageScripts.tsx                      {PageScripts}  root="main" kind="services"
│   ├── components/providers/SmoothScroll.tsx             {useLenis}
│   │   ├── lib/gsap/index.ts                             {gsap, ScrollTrigger}
│   │   ├── lib/three/store.ts                            {sceneState, tickScene} → lib/utils/math.ts {damp}
│   │   └── lib/visit.ts                                  {visit}
│   └── lib/pages/behaviour.ts                            {mountPageBehaviour, PageKind}
│       ├── lib/pages/fancy-select.ts                     {fancySelect}        (unused on this page)
│       ├── lib/pages/contact-form.ts                     {mountContactForm}   (unused on this page)
│       └── kind="services" → only motion(): [data-rv] reveal via IntersectionObserver
├── lib/content.ts                                        {contact, engagementModels, process, services}
│                                                           services[0] "Waterproofing" → section id; services.slice(1) → 6 construction cards
│                                                           (Residential, Commercial, Industrial, Renovation & Leak Repair, Interiors, Project Management)
│                                                           process → FAQ "how do you check" answer; engagementModels passed but not rendered
├── lib/methods/doc.ts                                    {AREA_PURPOSE, SERVICE_CATEGORIES}  (JSON-LD ItemList)
├── lib/pages/kit.ts                                      {KIT_CSS, serviceSlug}
├── lib/pages/services.ts                                 {SERVICES_CSS, serviceFaq, servicesPageMarkup}
│   ├── lib/methods/doc.ts                                {AREA_PURPOSE, SERVICE_CATEGORIES}
│   │                                                       8 categories: terrace, bathroom, tank, basement, balcony, walls, podium, cracks
│   ├── lib/pages/kit.ts                                  {arrow, ctaBand, esc, mark, secHead, serviceSlug, ContactInfo, PageOptions}
│   └── (module-local helpers)
│       ├── PLACE_ICON / placeIcon(area)                  inline 24x24 stroke SVGs per waterproofing area (span.sv-wi)
│       ├── BUILD_ICON / buildIcon(title)                 inline SVGs matched by regex on title (span.sv-icon)
│       ├── ask(title)                                    "/contact?service=<title>#enquiry"
│       ├── wpRow(category)                               li.sv-card.sv-w#<slug>
│       ├── buildRow(service)                             article.sv-card.sv-b#<slug>
│       └── serviceFaq({services, process, contact})      5-7 {q, a} pairs (also used for JSON-LD)
└── lib/site.ts                                           {ldJson, pageMeta, siteUrl}
+ shell: app/layout.tsx → Nav, QualityProvider, SmoothScroll (see shell tree)
```

Rendered structure of `servicesPageMarkup()` (inside `<main id="main" class="pg">` after `<style>KIT_CSS + SERVICES_CSS</style>`):

```
header.pg-head.sv-head > div.pg-wrap.sv-headgrid > div
  mark("01","Services") → p.pg-mark > span.pg-idx + span.pg-rule + span
  h1.pg-h1  "Waterproofing and construction services in Erode, Coimbatore and Tiruppur."
section.pg-sec.sv-wsec#waterproofing[aria-labelledby=sv-w-h] > div.pg-wrap
  secHead({label:"Waterproofing services", title:"From the terrace to the sump.", id:"sv-w-h"}) → header.pg-shead
  ul.sv-wgrid (4 cols → 2 ≤1199px → 1 ≤699px)
    li.sv-card.sv-w#terrace-waterproofing … ×8
      span.sv-icon > span.sv-wi > svg | h3.sv-ct | p.sv-cp (AREA_PURPOSE) | a.sv-go[data-internal] "Get a quote" + arrow
section.pg-sec.pg-sec--stone.sv-bsec#building > div.pg-wrap
  secHead({label:"Construction services", title:"Homes, offices and factories, built to stay dry."})
  div.sv-blist (3 cols → 2 → 1)
    article.sv-card.sv-b#residential-construction … ×6  (span.sv-icon | h3.sv-ct | p.sv-cp clamp 4 lines | a.sv-go)
section.pg-sec.sv-fsec#questions > div.pg-wrap.sv-fgrid (0.8fr | 1.2fr → 1 col ≤1023px)
  secHead({label:"Questions", title:"Waterproofing questions, answered.", lede})
  div.sv-faq > details.sv-q[open on first] ×N > summary(h3 + span.sv-qi plus/cross) + p
ctaBand(contact, {title:"Not sure which service you need?", steps ×3})
  section.pg-cta > div.pg-wrap > div.pg-ctabox (navy) > .pg-ctahead(h2.pg-ctah + .pg-ctaacts[a.pg-btn--ink, a.pg-btn--line]) + ol.pg-ctasteps + p.pg-ctaline
```

## `/projects` — `app/projects/page.tsx`

```
app/projects/page.tsx                                     (FAQPage JSON-LD)
├── components/contact/Footer.tsx                         → see shell
├── components/pages/PageScripts.tsx                      kind="projects" → behaviour.ts projects() (status tabs, town fancySelect, #hash reveal) + motion()
├── lib/content.ts                                        {contact, faqs, process, projects}
├── lib/pages/kit.ts                                      {KIT_CSS}
├── lib/pages/projects.ts                                 {PROJECTS_CSS, projectFaq, projectsPageMarkup}
│   ├── lib/pages/kit.ts                                  {arrow, esc, listing, mark, ph, tel, ContactInfo, PageOptions}
│   └── lib/pages/fancy-select.ts                         {FANCY_SELECT_CSS}
└── lib/site.ts                                           {ldJson, pageMeta}
+ shell
```

## `/about` — `app/about/page.tsx`

```
app/about/page.tsx                                        (AboutPage JSON-LD)
├── components/contact/Footer.tsx                         → see shell
├── components/pages/PageScripts.tsx                      kind="about" → motion() only
├── lib/content.ts                                        {branches, company, contact, principles, services}
├── lib/pages/about.ts                                    {ABOUT_CSS, aboutMarkup, AboutData}
│   └── lib/pages/kit.ts                                  {arrow, ctaBand, esc, listing, mark, ph, tel, tick, two, words, ContactInfo}
├── lib/pages/kit.ts                                      {KIT_CSS}
└── lib/site.ts                                           {ldJson, pageMeta, siteUrl}
+ shell
```

## `/products` — `app/products/page.tsx`

```
app/products/page.tsx                                     (CollectionPage + ItemList JSON-LD)
├── components/contact/Footer.tsx                         → see shell
├── components/pages/PageScripts.tsx                      kind="products" → import("./products-page") {mountProducts} + motion()
├── lib/content.ts                                        {contact}
├── lib/pages/kit.ts                                      {KIT_CSS}
├── lib/pages/products.ts                                 {PRODUCTS_CSS, productsPageMarkup}
│   ├── lib/pages/fancy-select.ts                         {FANCY_SELECT_CSS}
│   ├── lib/products/index.ts                             {PRODUCT_COUNT, rateLink, Product}
│   │   ├── lib/products/rate.ts                          {rateHref}
│   │   ├── lib/products/catalogue.ts                     {PRODUCTS} → lib/products/types.ts
│   │   └── lib/products/types.ts
│   ├── lib/products/brands.ts                            {brandInfo, brandMark, jobGroup, jobs, JobView}
│   │   ├── lib/products/index.ts                         → see above
│   │   └── lib/products/compare.ts                       {useTerms}
│   │       ├── lib/products/index.ts                     → see above
│   │       └── lib/products/types.ts
│   ├── lib/products/compare.ts                           {cap, fullName, shortName, useTerms, usesNote}
│   ├── lib/pages/kit.ts                                  {arrow, ctaBand, esc, listing, mark, secHead, ContactInfo}
│   ├── lib/pages/products-finder.ts                      {enquiryMarkup, FINDER_CSS, finderMarkup}
│   │   ├── lib/products/index.ts                         {FAMILIES, familyOf, rateLink, Product}
│   │   ├── lib/products/brands.ts                        {brandMark, jobOf, BrandInfo, JobView}
│   │   ├── lib/products/compare.ts                       {cap, fullName, jobsFor, packAmount, shortName, useTerms, usesNote}
│   │   ├── lib/products/packs.ts                         {packIcon}
│   │   └── lib/pages/kit.ts                              {esc, listing, ContactInfo}
│   └── lib/methods/brand-logos.ts                        {brandsMarqueeHtml, BRANDS_MARQUEE_CSS}
│       └── lib/methods/doc.ts                            {BRAND_SPECIALITY}
├── lib/products/index.ts                                 {PRODUCTS}
├── lib/products/compare.ts                               {fullName}
└── lib/site.ts                                           {ldJson, pageMeta, siteUrl}
+ shell
```

## `/waterproofing` — `app/waterproofing/page.tsx`

```
app/waterproofing/page.tsx                                (WebPage + ItemList JSON-LD)
├── components/contact/Footer.tsx                         → see shell
├── components/pages/PageScripts.tsx                      kind="methods" → import("./methods-behaviour") {mountMethods} + motion()
├── lib/content.ts                                        {contact}
├── lib/methods/data.ts                                   {METHODS}
├── lib/pages/kit.ts                                      {KIT_CSS}
├── lib/pages/methods.ts                                  {METHODS_PAGE_CSS, methodsPageMarkup}
│   ├── lib/methods/brand-logos.ts                        {BRAND_LOGOS} → lib/methods/doc.ts
│   ├── lib/methods/data.ts                               {METHOD_GROUPS, METHODS, Method}
│   ├── lib/methods/doc.ts                                {BRAND_SPECIALITY, FOSROC_BY_METHOD}
│   ├── lib/products/index.ts                             (type Product)
│   ├── lib/pages/kit.ts                                  {arrow, ctaBand, esc, secHead, ContactInfo, PageOptions}
│   ├── lib/pages/methods-tools.ts                        {methodsData, METHODS_TOOLS_CSS, placeMapMarkup}
│   │   ├── lib/methods/data.ts                           {METHOD_GROUPS, METHODS, PLACES, Method}
│   │   ├── lib/methods/doc.ts                            {AREA_PURPOSE, SERVICE_CATEGORIES}
│   │   ├── lib/products/index.ts                         (type Product)
│   │   ├── lib/pages/kit.ts                              {arrow, esc, secHead, serviceSlug}
│   │   └── lib/pages/methods-compare.ts                  {compareRowsHtml, CmpMethod}
│   └── lib/pages/methods-rain.ts                         {RAIN_CSS, rainMarkup}
│       ├── lib/methods/data.ts                           {METHOD_GROUPS, METHODS}
│       └── lib/pages/kit.ts                              {esc}
├── lib/products/index.ts                                 {PRODUCTS} → rate.ts, catalogue.ts → types.ts
└── lib/site.ts                                           {ldJson, pageMeta, siteUrl}
+ shell
```

## `/contact` — `app/contact/page.tsx`

```
app/contact/page.tsx                                      (ContactPage JSON-LD; no Footer)
├── components/pages/PageScripts.tsx                      kind="contact" → mountContactForm() (lib/pages/contact-form.ts) + openNow() + motion()
├── lib/content.ts                                        {contact, services}
├── lib/pages/contact.ts                                  {CONTACT_CSS, contactPageMarkup}
│   └── lib/pages/kit.ts                                  {arrow, esc, mapsLink, mark, tel, words, ContactInfo}
├── lib/pages/kit.ts                                      {KIT_CSS}
└── lib/site.ts                                           {ldJson, pageMeta, siteUrl}
+ shell
```

## `/blog` — `app/blog/page.tsx` (and `/blog/[slug]`)

```
app/blog/page.tsx                                         (Blog JSON-LD)
├── components/contact/Footer.tsx                         → see shell
├── components/pages/PageScripts.tsx                      kind="blog" → blog() + mountSearch() + fancySelect + motion()
├── lib/blog.ts                                           {blogPosts}
├── lib/content.ts                                        {contact}
├── lib/pages/articles.ts                                 {BLOG_CSS, blogIndexMarkup}
│   ├── lib/pages/search-bar.ts                           {SEARCH_BAR_CSS, searchBar}
│   │   ├── lib/pages/kit.ts                              {esc}
│   │   └── lib/pages/fancy-select.ts                     {FANCY_SELECT_CSS}
│   ├── lib/methods/data.ts                               {METHODS}
│   └── lib/pages/kit.ts                                  {arrow, ctaBand, esc, ph, shortDate, tel, words, ContactInfo, PageOptions}
├── lib/pages/kit.ts                                      {KIT_CSS}
└── lib/site.ts                                           {ldJson, pageMeta, siteUrl}
+ shell

app/blog/[slug]/page.tsx                                  same tree, with {blogPosts, getPost} from lib/blog.ts,
                                                          {BLOG_CSS, postMarkup} from lib/pages/articles.ts, {ldJson, siteUrl} from lib/site.ts,
                                                          PageScripts kind="post" → post() (reading progress, TOC highlight)
```
