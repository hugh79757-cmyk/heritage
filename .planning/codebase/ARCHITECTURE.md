<!-- refreshed: 2026-07-01 -->
# Architecture

**Analysis Date:** 2026-07-01

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    BROWSER (Client) — Mobile-First SSR Hydration                     │
│   User → https://heritage.aikorea24.kr/?lang=kr|en|ja|zh                             │
└───────────────────────────────┬─────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│            CLOUDFLARE WORKERS — Astro 5.17.1 SSR (server-side rendering)             │
│                                   (wrangler.jsonc → dist/_worker.js)                  │
├──────────────────────┬──────────────────────┬────────────────────────────────────────┤
│  File-Based Routes   │  API Endpoints       │  Static Assets                          │
│  src/pages/          │  src/pages/api/      │  public/ (AI images, tour-images, etc.) │
│                      │                      │                                        │
│  / → index.astro     │  /api/heritage.ts    │  robots.txt                             │
│  /palace/[id]        │    (D1 Haversine)    │  favicon.svg                            │
│  /palace/[id]/[code] │  /api/events.ts      │  og-image.jpg                           │
│  /kpop-demon-hunters │    (KHS API proxy)   │  geunjeongjeon-night.jpg                │
│  /guide/*            │  /api/narration.ts   │  gyeonghoeru-night.jpg                  │
│  /sitemap.xml.ts     │    (KHS voice proxy) │  tour-images/*.jpg                      │
└──────────┬───────────┴──────────┬───────────┴────────────────────────────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────────┐  ┌─────────────────────────────────────────────┐
│  DATA LAYER           │  │  EXTERNAL SERVICES                          │
│                       │  │                                             │
│  src/lib/palace_data.json  │  Korea Heritage Service API              │
│    (5 palaces × ~200       │  https://www.heritage.go.kr              │
│     buildings — primary    │  /cha/openapi/... (events, narration)    │
│     data source)           │                                             │
│                       │  │  Hugging Face FLUX.1-schnell               │
│  Cloudflare D1 DB     │  │    (build-time only via script)            │
│  heritage-db          │  │                                             │
│  (heritage_index —    │  │  Google Analytics GA4 G-HCV3PDCWQ5         │
│   10,000+ heritage    │  │  Google AdSense ca-pub-5938862195544185    │
│   sites for map)      │  │  Google Translate (client-side widget)     │
│                       │  │                                             │
│  src/lib/landmarks.ts │  │  MapLibre GL JS 4.7.1 (CDN)               │
│    (14 manually       │  │  OpenFreeMap tiles (free tile server)      │
│     curated landmarks)│  │                                             │
└──────────────────────┘  └─────────────────────────────────────────────┘
```

## Component Architecture

### Page → Layout → Component Hierarchy

**Main Pages:**
```
src/pages/index.astro
  └── Layout.astro (GA4, AdSense, GSAP, custom cursor, multi-lang nav, Google Translate)
       ├── DancheongPatterns.astro (SVG pattern defs)
       ├── MapExplore.astro (MapLibre interactive map with geolocation)
       ├── TimeSlider.astro (before/after clip-path drag comparison)
       ├── DancheongCard.astro × 5 (bento-grid palace cards)
       └── KDH Hook Section (inline, links to /kpop-demon-hunters)

src/pages/palace/[id].astro
  └── Layout.astro
       ├── DancheongPatterns.astro
       ├── BreadcrumbNav.astro (structured data breadcrumbs)
       └── Building list (inline, iterates fetchPalaceList results)

src/pages/palace/[id]/[code].astro
  └── Layout.astro
       ├── BreadcrumbNav.astro
       └── AudioGuide.astro (narration via /api/narration, TTS fallback)

src/pages/kpop-demon-hunters.astro
  └── GuideLayout.astro (simpler layout without GSAP/custom cursor)
       ├── BreadcrumbNav.astro
       ├── FAQSection.astro (structured data FAQPage)
       └── DancheongCard.astro × 6 (location cards)

src/pages/guide/*.astro (9 pages — gyeongbokgung, changdeokgung, etc.)
  └── GuideLayout.astro (simpler layout)
       ├── BreadcrumbNav.astro
       ├── FAQSection.astro
       └── Inline guide content sections
```

**Layout Components:**
- `src/layouts/Layout.astro` — Full layout (422 lines): GA4, AdSense, GSAP + ScrollTrigger (CDN), custom cursor, dark mode toggle, Google Translate banner, flag-based language switcher, OG meta tags, hreflang alternates, ambient orbs, nav glassmorphism
- `src/components/GuideLayout.astro` — Simplified layout (149 lines): No GSAP, no custom cursor, no Google Translate, no ambient orbs; dark mode + flag nav only; used for guide pages and KDH page

### Layout Comparison

| Feature | Layout.astro | GuideLayout.astro |
|---------|-------------|-------------------|
| GA4 + AdSense | Yes | Yes |
| GSAP + ScrollTrigger | Yes (CDN) | No |
| Custom cursor | Yes | No |
| Google Translate widget | Yes | No |
| Dark mode toggle | Yes | Yes |
| Flag language links | Yes | Yes |
| Ambient orbs | Yes | No |
| OG / Twitter meta | Yes | Yes |
| hreflang alternates | Yes | Yes |
| Schema.org WebSite LD+JSON | No | No |
| Used by | /, /palace/* | /guide/*, /kpop-demon-hunters |

## Data Layer

The project uses three parallel data systems:

### 1. Static JSON (Primary Palace Data)
- **File:** `src/lib/palace_data.json` (~200 building records for 5 palaces)
- **Imported by:** `src/lib/api.ts`
- **Consumed by:** `/palace/[id]`, `/palace/[id]/[code]`, `/sitemap.xml.ts`
- **Schema:** Keyed by gung_number (1-5), each entry has serialNumber, detailCode, multi-lang names, explanations, images, videos arrays
- **Note:** This is the **primary operational data source** — D1 is only used for the map's heritage search

### 2. Cloudflare D1 (Heritage Index for Map)
- **Binding:** `DB` in `wrangler.jsonc` → `heritage-db` database
- **Schema:** `schema.sql` — 6 tables (palaces, buildings, building_details, images, movies, heritage_index)
- **Runtime access:** Only `heritage_index` table via `/api/heritage.ts` (Haversine geo-search)
- **Seeded from:** `scripts/collect.mjs` → `scripts/data/heritage_list.json` → `scripts/seed-d1.mjs` → SQL batches → `wrangler d1 execute`
- **The palace/building tables are defined but not actively queried at runtime**

### 3. External API Proxies (Runtime)
- **`/api/heritage.ts`** — D1 Haversine query (lat/lng/radius → nearby heritage sites)
- **`/api/events.ts`** — Proxies `khs.go.kr/cha/openapi/selectEventListOpenapi.do` (XML → JSON)
- **`/api/narration.ts`** — Proxies KHS voice narration API with multi-endpoint fallback (2 endpoints tried)
- **Client consumption:** `MapExplore.astro` uses built-in landmarks list (not API), `AudioGuide.astro` fetches `/api/narration`

### 4. Client-Side Static Landmarks
- **File:** `src/lib/landmarks.ts` (14 manually curated heritage sites with multi-lang names, coordinates, types)
- **Used by:** `MapExplore.astro` — injected as JSON via `define:vars`
- **Distance calculation:** Haversine formula implemented client-side in `locate-btn` handler

## Route Design

```
/                                      → index.astro         (Homepage)
/kpop-demon-hunters                    → kpop-demon-hunters.astro (KDH guide)
/palace/[id]                           → palace/[id].astro   (Palace building list)
/palace/[id]/[code]                    → palace/[id]/[code].astro (Building detail)
/guide                                 → guide/index.astro   (Guide hub)
/guide/gyeongbokgung                   → guide/gyeongbokgung.astro
/guide/changdeokgung                   → guide/changdeokgung.astro
/guide/changgyeonggung                 → guide/changgyeonggung.astro
/guide/deoksugung                      → guide/deoksugung.astro
/guide/jongmyo                         → guide/jongmyo.astro
/guide/secret-garden                   → guide/secret-garden.astro
/guide/palace-ticket                   → guide/palace-ticket.astro
/guide/palace-hours                    → guide/palace-hours.astro
/guide/night-tour                      → guide/night-tour.astro
/api/heritage                          → api/heritage.ts     (D1 geo-search)
/api/events                            → api/events.ts       (KHS events proxy)
/api/narration                         → api/narration.ts    (KHS voice proxy)
/sitemap.xml                           → sitemap.xml.ts      (Dynamic sitemap)
```

**Dynamic params:**
- `[id]` = palace number (1-5) — matched against `PALACES` array in `api.ts`
- `[code]` = building detail_code from `palace_data.json`
- `?sn=` = serial_number (also passed as query param for building identification)
- `?lang=kr|en|ja|zh` — language switch on every page
- Invalid `[id]` or `[code]` → redirect to `/` or palace parent route

## Build vs Runtime Architecture

### Build-Time (astro build → dist/)
```
1. Astro compiles all .astro/.ts files to server-side Workers code
   Output: dist/_worker.js/index.js (Cloudflare Workers entry)

2. Static assets copied verbatim:
   public/ → dist/ (served as Workers static assets via ASSETS binding)

3. palace_data.json bundled into Workers deployment (imported at compile-time)

4. AI images: scripts/generate-ai-images.mjs → public/images/generated/
   (Must be run manually BEFORE build — not part of build pipeline)

5. Sitemap generated at request time (not build-time) — it's dynamic
```

### Runtime (per-request)
```
1. Request hits Cloudflare Workers edge
2. Astro SSR middleware loads the route
3. For API routes: Workers executes the handler, proxies external APIs
4. For page routes:
   - Layout renders HTML shell (GA4/AdSense scripts, meta tags, nav)
   - Page component fetches data (palace_data.json imported as module)
   - Components render server-side HTML
   - Client scripts hydrate at DOMContentLoaded
5. `/api/heritage.ts` accesses D1 via env.DB binding
6. `/api/events.ts` and `/api/narration.ts` make outbound fetch() to KHS
```

### Key Architectural Detail: Components are SSR-Only
All `.astro` components render HTML on the server. Client interactivity is achieved via:
- `<script>` blocks inside components (vanilla JS, no framework)
- `define:vars` directive for passing server data to client JS
- CDN-loaded GSAP for scroll animations (Layout.astro only)
- MapLibre GL JS loaded dynamically via script injection (MapExplore.astro, kpop-demon-hunters.astro)

**There is NO client-side framework (React, Vue, Svelte, etc.)** — all interactivity is vanilla JS.

## Language Switching Mechanism

**Primary: `?lang=` query parameter**
- Each page reads `Astro.url.searchParams.get('lang')` in the frontmatter
- `getLang()` in `src/lib/api.ts` defaults to `'kr'`
- Layout navigation has flag buttons that link to `?lang=kr|en|ja|zh`
- hreflang link tags in Layout.astro for SEO
- Content is translated via inline `Record<string, string>` dictionaries per page/component

**Secondary: Google Translate (client-side fallback)**
- Toggle button triggers Google Translate widget in Layout.astro
- Supports 21 languages (en,ja,zh-CN,zh-TW,es,fr,de,pt,ru,ar,th,vi,id,ms,hi,it,nl,pl,tr,sv,uk)
- Korean page language, auto-detects user browser language
- Wrapper `<div id="google_translate_element">` in banner

**Multi-Lang Content Pattern (used everywhere):**
```typescript
const labels: Record<string, string> = {
  kr: '한국어 텍스트',
  en: 'English text',
  ja: '日本語テキスト',
  zh: '中文文本',
};
const label = labels[lang] || labels.kr;
```

## Key Architectural Decisions & Trade-offs

### 1. Static JSON over D1 for Primary Data (Conscious Choice)
- **Decision:** `palace_data.json` is the primary data source for palace/building content; D1 heritage_index is only for map geo-search
- **Rationale:** Palace data is small (~200 records), changes rarely, and bundling it as a static import avoids D1 query latency and cold-start issues
- **Trade-off:** Updates require code redeployment instead of database update; not suitable for user-generated content

### 2. No Client-Side Framework
- **Decision:** Vanilla JS inside Astro components instead of React/Vue/Svelte
- **Rationale:** Avoids framework bundle overhead on mobile; Astro's SSR-first model benefits from minimal JS; interactivity needs are simple (click handlers, scroll animations, audio player)
- **Trade-off:** Complex state management would be harder; no component composition at runtime

### 3. API Proxy Pattern for External Services
- **Decision:** Server-side proxies (`/api/events.ts`, `/api/narration.ts`) for KHS APIs
- **Rationale:** Avoids CORS issues, masks API keys, allows response transformation (XML→JSON), enables fallback logic
- **Trade-off:** Adds latency (double hop), Workers CPU time limits

### 4. Build-Time AI Images
- **Decision:** AI images generated at build-time via `scripts/generate-ai-images.mjs`, served as static files from `public/`
- **Rationale:** Zero runtime cost, fast load, no API rate limits
- **Trade-off:** Images are static — can't generate on-demand; requires manual re-run to update

### 5. Two-Layout System
- **Decision:** Separate `Layout.astro` (full-featured) and `GuideLayout.astro` (simplified)
- **Rationale:** Guide/SEO pages need minimal JS for Core Web Vitals; homepage/palace pages need GSAP/custom cursor for visual impact
- **Trade-off:** Duplicated nav/footer HTML; maintenance overhead

### 6. File-Based Routing with Dynamic Segments
- **Decision:** Astro's file-based routing with `[id]` and `[code]` dynamic params
- **Rationale:** Simple, predictable URL structure; no router config needed
- **Trade-off:** Deeply nested directory for `/palace/[id]/[code].astro`

### 7. Single Cloudflare Worker for Everything
- **Decision:** One Workers deployment serves both API routes and SSR pages
- **Rationale:** Simple deployment (one wrangler.jsonc), shared environment, no microservice complexity
- **Trade-off:** Cold start affects all routes; no independent scaling

---

*Architecture analysis: 2026-07-01*
