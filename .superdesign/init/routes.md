# Routes (Next.js 16 App Router, `app/`)

Every route is wrapped by `app/layout.tsx` (fonts, metadata, JSON-LD, `QualityProvider` > `SmoothScroll` > `Nav`) and `app/template.tsx` (pass-through). Inner pages use the pattern `<main id="main" class="pg"><style>{KIT_CSS + PAGE_CSS}</style><div>{builder(html)}</div><PageScripts kind=.../></main><Footer/>`.

## Pages

| URL | File | Renders |
|---|---|---|
| `/` | `app/page.tsx` | Home: `MonsoonHero` (cut-away house in the rain, leaks traced terrace to sump, with `DropLoader`) + `HomeSections parts={["projects","services","about","products","contact"]}` (HTML strings from `lib/home/sections.ts`, products teaser from `lib/products/home.ts`) + `Footer`. Own title/OG. |
| `/about` | `app/about/page.tsx` | `KIT_CSS + ABOUT_CSS`, `aboutMarkup()` (`lib/pages/about.ts`): who RPC is, vision and mission, six values, where we work (branches), `ctaBand`; AboutPage JSON-LD; `PageScripts kind="about"`; `Footer`. |
| `/services` | `app/services/page.tsx` | `KIT_CSS + SERVICES_CSS`, `servicesPageMarkup()` (`lib/pages/services.ts`): opening h1, 8 waterproofing service cards (4-col grid), 6 construction service cards (3-col, stone ground), FAQ accordion (`<details>`), `ctaBand`; FAQPage + ItemList JSON-LD; `PageScripts kind="services"`; `Footer`. |
| `/projects` | `app/projects/page.tsx` | `KIT_CSS + PROJECTS_CSS`, `projectsPageMarkup()` (`lib/pages/projects.ts`): split opening with photo placeholders, status buttons (completed/ongoing/upcoming) + town `fancySelect`, photo-led project cards, start-a-project panel beside FAQ; FAQPage JSON-LD; `PageScripts kind="projects"`; `Footer`. |
| `/products` | `app/products/page.tsx` | `KIT_CSS + PRODUCTS_CSS`, `productsPageMarkup()` (`lib/pages/products.ts` + `products-finder.ts`): brand x category count grid, search, expandable product rows, "same job, different brands" head-to-head compare, brand logo marquee, WhatsApp enquiry bar, close; CollectionPage JSON-LD; `PageScripts kind="products"` (lazy `products-page.ts`); `Footer`. |
| `/waterproofing` | `app/waterproofing/page.tsx` | `KIT_CSS + METHODS_PAGE_CSS`, `methodsPageMarkup()` (`lib/pages/methods.ts`): opening + "Where is the water getting in?" house drawing (`methods-tools.ts`), rain test (`methods-rain.ts`), 12 methods in 4 kinds as expandable rows, compare two methods, brand logos, close; WebPage + ItemList JSON-LD; `PageScripts kind="methods"` (lazy `methods-behaviour.ts`); `Footer`. |
| `/contact` | `app/contact/page.tsx` | `KIT_CSS + CONTACT_CSS`, `contactPageMarkup()` (`lib/pages/contact.ts`): one screen, contact tiles (call with open-now status, WhatsApp, email, office) + enquiry form (FormSubmit / WhatsApp, `contact-form.ts`); ContactPage JSON-LD; `PageScripts kind="contact"`; **no Footer**. |
| `/blog` | `app/blog/page.tsx` | `KIT_CSS + BLOG_CSS`, `blogIndexMarkup()` (`lib/pages/articles.ts`): masthead, `searchBar` with method filter, latest post as dark feature, rest as cards, `ctaBand`; Blog JSON-LD; `PageScripts kind="blog"`; `Footer`. |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | `KIT_CSS + BLOG_CSS`, `postMarkup()`: title, cover placeholder, body beside sticky TOC + CTA box, reading-progress bar, 3 related posts; BlogPosting JSON-LD; `generateStaticParams` over `lib/blog.ts` (`questions-to-ask-a-waterproofing-contractor`, `terrace-waterproofing-systems-erode`, `bathroom-leakage-repair`, `sump-and-water-tank-waterproofing`, `waterproofing-before-the-monsoon`, `basement-waterproofing-coimbatore`); `notFound()` for unknown slugs; `Footer`. |
| `/classic` | `app/classic/page.tsx` | Previous home, noindex: `Preloader`, `Hero` (scroll-scrubbed construction film), `Manifesto`, `Marquee` of services, `ProjectsShowcase`, `Exploded`, `Waterproofing`, `Services index="05"`, `About index="06"`, `Stats index="07"`, `FinalCTA`, `Footer` (React + Tailwind components, `components/ui/*` primitives). |
| `/v2` | `app/v2/page.tsx` | Sample home, noindex: `DropStory` hero, `MethodsIndex` (12 methods), `ProjectsShowcase`, `Services index="03"`, `About index="04"`, `Stats index="05"`, `FinalCTA`, `Footer`. |
| `/v3` | `app/v3/page.tsx` | Server `redirect("/")` (the sample became the home page). |
| (404) | `app/not-found.tsx` | Tailwind page: "404 — Page not found" label, h1, two buttons (home / book inspection), pipe-with-gap SVG with falling drop (`nf-drop` keyframes), 4 popular-page cards, `Footer`; noindex. |

## Route handlers and metadata routes

| URL | File | Renders |
|---|---|---|
| `/api/ref/[name]` | `app/api/ref/[name]/route.ts` | TEMPORARY `GET`/`OPTIONS` handler (force-dynamic): streams `public/refs/<basename>` as `image/jpeg` with open CORS; 404 text if missing. |
| `/manifest.webmanifest` | `app/manifest.ts` | Web manifest: "RPC Constructions"/"RPC", standalone, `background_color #eeeae3`, `theme_color #0d1420`, icon `/logo.png` 512. |
| `/robots.txt` | `app/robots.ts` | Allow `/`, disallow `/api/` and `/refs/`, sitemap + host from `lib/site.ts` `siteUrl`. |
| `/sitemap.xml` | `app/sitemap.ts` | `/`, `/projects`, `/services`, `/waterproofing`, `/products`, `/about`, `/contact`, `/blog` + every `/blog/<slug>`. |

## Non-route app files

| File | Role |
|---|---|
| `app/layout.tsx` | Root layout (see `layouts.md`). |
| `app/template.tsx` | Pass-through template, no transition. |
| `app/globals.css` | Tailwind v4 entry + `@theme` tokens (see `theme.md`). |

Nav order (`lib/content.ts` `nav`): Home `/`, About `/about`, Products `/products`, Waterproofing `/waterproofing`, Projects `/projects`, Services `/services`, Blog `/blog`, Contact `/contact` (Contact rendered as a separate CTA pill). `Nav.tsx` hides itself on `/studio*`, but no such route exists.
