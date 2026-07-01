# Codebase Structure

**Analysis Date:** 2026-07-01

## Directory Layout

```
heritage/
├── .planning/codebase/      # Generated codebase map documents
├── .vscode/                 # VS Code debug & extension config
├── .astro/                  # Astro generated types (gitignored)
├── .wrangler/               # Wrangler local state (gitignored)
├── node_modules/            # Dependencies (gitignored)
├── dist/                    # Build output (gitignored)
├── public/                  # Static assets (served as-is)
│   ├── tour-images/         # KDH location photos (6 images + index.json)
│   ├── images/generated/    # AI-generated dancheong images (build-time)
│   ├── favicon.svg          # Site favicon
│   ├── favicon.ico          # Fallback favicon
│   ├── apple-touch-icon.png # iOS home screen icon
│   ├── robots.txt           # Disallows /api/
│   ├── og-image.jpg         # Open Graph default image
│   ├── minhwa-tiger-magpie.jpeg # Folk painting decoration image
│   ├── geunjeongjeon-night.jpg  # Homepage time-slider "before" image
│   ├── gyeonghoeru-night.jpg    # AI gen: Gyeonghoeru at night
│   ├── jongno-joseon.jpg        # AI gen: Joseon era street
│   └── .assetsignore             # Astro assets handling config
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── AudioGuide.astro       # Narration player + TTS fallback (861 lines)
│   │   ├── BreadcrumbNav.astro    # Schema.org breadcrumb nav (40 lines)
│   │   ├── DancheongCard.astro    # Card with neon glow + 3D tilt (232 lines)
│   │   ├── DancheongPatterns.astro# SVG pattern definitions (51 lines)
│   │   ├── FAQSection.astro       # Accordion FAQ + LD+JSON (103 lines)
│   │   ├── GuideLayout.astro      # Simplified layout for guide pages (149 lines)
│   │   ├── MapExplore.astro       # MapLibre map + geolocation (682 lines)
│   │   ├── OptimizedImage.astro   # Aspect-ratio-safe image wrapper (43 lines)
│   │   └── TimeSlider.astro       # Before/after clip-path slider (217 lines)
│   ├── layouts/
│   │   └── Layout.astro          # Main layout: GA4, AdSense, GSAP, cursor (422 lines)
│   ├── lib/
│   │   ├── api.ts                 # PALACES data + lang helpers + building fetch (192 lines)
│   │   ├── landmarks.ts           # 14 curated landmarks + Haversine helpers (209 lines)
│   │   └── palace_data.json       # ~200 building records for 5 palaces (~1.2MB)
│   ├── pages/
│   │   ├── index.astro            # Homepage: hero, map, time slider, cards, KDH hook (339 lines)
│   │   ├── kpop-demon-hunters.astro # KDH location guide (826 lines)
│   │   ├── sitemap.xml.ts         # Dynamic sitemap (56 lines)
│   │   ├── palace/
│   │   │   ├── [id].astro         # Palace detail: building list (252 lines)
│   │   │   └── [id]/[code].astro  # Building detail: gallery, audio, video (217 lines)
│   │   ├── guide/
│   │   │   ├── index.astro        # Guide hub page (147 lines)
│   │   │   ├── gyeongbokgung.astro(279 lines)
│   │   │   ├── changdeokgung.astro
│   │   │   ├── changgyeonggung.astro
│   │   │   ├── deoksugung.astro
│   │   │   ├── jongmyo.astro
│   │   │   ├── secret-garden.astro
│   │   │   ├── palace-ticket.astro
│   │   │   ├── palace-hours.astro
│   │   │   └── night-tour.astro
│   │   └── api/
│   │       ├── heritage.ts        # D1 Haversine geo-search (50 lines)
│   │       ├── events.ts          # KHS events API proxy (43 lines)
│   │       └── narration.ts       # KHS voice narration proxy (59 lines)
│   └── styles/
│       └── global.css             # Global styles: colors, typography, layout (1260 lines)
├── scripts/
│   ├── collect.mjs                # KHS data collector: 3-phase extraction (361 lines)
│   ├── collect-tour-images.mjs    # TourAPI photo downloader (96 lines)
│   ├── generate-ai-images.mjs     # Hugging Face FLUX image generator (163 lines)
│   ├── seed-d1.mjs                # heritage_list.json → D1 SQL batches (54 lines)
│   ├── seed-direct.mjs            # Direct D1 seeding via wrangler (40 lines)
│   ├── test-tourapi.mjs           # TourAPI test script
│   └── data/
│       ├── progress.json          # Collection progress state (gitignored)
│       ├── heritage_list.json     # Collected heritage list (gitignored, ~20MB)
│       ├── run_seed.sh            # Generated seed runner script
│       └── sql/                   # Generated SQL batch files (gitignored)
├── pipeline/
│   ├── prototype.html             # Prototype v1
│   ├── prototype_v2.html          # Prototype v2
│   └── config/
│       └── buildings.json         # 3D building config for pipeline
├── schema.sql                     # D1 database schema (105 lines)
├── astro.config.mjs               # Astro config: SSR + Cloudflare adapter (8 lines)
├── wrangler.jsonc                 # Cloudflare Workers config (26 lines)
├── tsconfig.json                  # TypeScript strict mode config (5 lines)
├── package.json                   # Dependencies: astro, @astrojs/cloudflare (16 lines)
├── package-lock.json              # Lockfile
├── AGENTS.md                      # K-Heritage Guide comprehensive guide
├── TECHNICAL_DOC.md               # Technical documentation
├── PROGRESS.md                    # Project progress tracker
├── README.md                      # Project readme
└── 프로젝트_분석_보고서.md          # Korean project analysis report
```

## Directory Purposes

**`src/components/`:**
- Purpose: Reusable Astro components that render server-side HTML with embedded vanilla JS
- Key pattern: Components accept `lang` prop and use Record-based translation dictionaries
- Interactivity: Vanilla JS `<script>` blocks with `define:vars` for server→client data passing
- No shared state between components — each manages its own DOM interactions

**`src/layouts/`:**
- Purpose: Page shell layouts with meta tags, analytics, navigation, and shared scripts
- `Layout.astro` — Full-featured for main pages (homepage, palace pages)
- `GuideLayout.astro` — Simplified for SEO/guide pages (no GSAP, no custom cursor)

**`src/lib/`:**
- Purpose: Shared data, utilities, and API helpers
- `api.ts` — Central module: exports PALACES array, getLang(), fetchPalaceList(), fetchBuildingDetail(), and XML parsing helpers. All pages import from this module.
- `landmarks.ts` — Static landmark data for the interactive map. Used only by MapExplore.astro.
- `palace_data.json` — Data file containing all palace building records. Not directly imported by pages — accessed through api.ts.

**`src/pages/`:**
- Purpose: File-based routing — each file maps to a URL path
- API routes (.ts): Return Response objects directly (Workers-style)
- Page routes (.astro): Use Astro frontmatter for data fetching + template section for HTML output
- Guide pages: All use GuideLayout.astro; each is a content page with SEO-optimized multi-lang copy

**`src/styles/`:**
- Purpose: Global CSS only (no CSS modules, no Tailwind)
- `global.css` — Single large file (~1260 lines) containing: CSS custom properties (dancheong palette), reset/base, glassmorphism system, bento grid system, custom cursor, kinetic typography, neon glow text utilities, dancheong divider patterns, navigation, hero, buttons, card grid, footer, scroll reveal utilities, gallery/video, mobile responsive breakpoints, prefers-reduced-motion

**`scripts/`:**
- Purpose: Build-time and data collection Node.js scripts (run outside Astro)
- Not part of the Astro build pipeline — executed manually or via npm scripts

**`public/`:**
- Purpose: Static files served at the site root
- AI-generated images, tour photos, favicon, robots.txt

**`pipeline/`:**
- Purpose: Legacy 3D prototype files and config (not in active use)

## Module Dependency Map

```
src/lib/api.ts
  ├── imports: ./palace_data.json (static import)
  ├── exports: PALACES, getLang(), fetchPalaceList(), fetchBuildingDetail()
  └── used by:
       ├── src/pages/index.astro           (PALACES, getLang, getPalaceName, getPalaceDesc)
       ├── src/pages/palace/[id].astro     (PALACES, getLang, getPalaceName, fetchPalaceList)
       ├── src/pages/palace/[id]/[code].astro (PALACES, getLang, getPalaceName, fetchBuildingDetail)
       ├── src/pages/sitemap.xml.ts        (PALACES, fetchPalaceList)
       ├── src/pages/kpop-demon-hunters.astro (getLang)
       ├── src/pages/guide/index.astro     (PALACES, getLang)
       ├── src/pages/guide/gyeongbokgung.astro (PALACES, getLang, fetchPalaceList)
       ├── src/pages/guide/changdeokgung.astro (PALACES, getLang, fetchPalaceList)
       └── ... (all guide pages import PALACES, getLang)

src/lib/landmarks.ts
  ├── exports: LANDMARKS array, getDistance(), getNearbyLandmarks()
  └── used by:
       └── src/components/MapExplore.astro (LANDMARKS)

src/env.d.ts
  └── Declares App.Locals type (DB, ASSETS bindings) — used implicitly by api/heritage.ts
```

## Page-to-Component Mapping

| Page | Layout | Components Used | API Calls |
|------|--------|----------------|-----------|
| `index.astro` | `Layout.astro` | DancheongPatterns, MapExplore, TimeSlider, DancheongCard (×5) | None (static PALACES) |
| `palace/[id].astro` | `Layout.astro` | DancheongPatterns, BreadcrumbNav | fetchPalaceList(id) |
| `palace/[id]/[code].astro` | `Layout.astro` | BreadcrumbNav, AudioGuide | fetchBuildingDetail(id, sn, dc) |
| `kpop-demon-hunters.astro` | `GuideLayout.astro` | BreadcrumbNav, FAQSection, DancheongCard (×2 with guideLinks) | None |
| `guide/index.astro` | `GuideLayout.astro` | BreadcrumbNav | None |
| `guide/*.astro` | `GuideLayout.astro` | BreadcrumbNav, FAQSection | fetchPalaceList(id) sometimes |
| `/api/heritage.ts` | — | — | D1 `env.DB` |
| `/api/events.ts` | — | — | KHS XML API |
| `/api/narration.ts` | — | — | KHS Voice API (2 endpoints) |
| `/sitemap.xml.ts` | — | — | fetchPalaceList() for all palaces |

## Script Pipeline

### Data Collection Pipeline
```
Korea Heritage Service (KHS) OpenAPI
         │
         ▼
scripts/collect.mjs (3 phases)
  ├── Phase 1: SearchKindOpenapiList → heritage_list.json (all heritage items)
  ├── Phase 2: SearchKindOpenapiDt → detail fields for items with coordinates
  └── Phase 3: gogungListOpenApi + gogungDetailOpenApi → scripts/data/palace_details.json
         │
         ▼ (manual conversion)
    palace_details.json → src/lib/palace_data.json
         │
         ▼
scripts/seed-d1.mjs (heritage_list.json → SQL batch files)
         │
         ▼
scripts/data/sql/batch_*.sql → wrangler d1 execute (via run_seed.sh)
         │
         ▼
    Cloudflare D1 (heritage_index table)
```

### Image Collection Pipeline
```
TourAPI (data.go.kr) ──→ scripts/collect-tour-images.mjs ──→ public/tour-images/*.jpg
Hugging Face FLUX    ──→ scripts/generate-ai-images.mjs   ──→ public/images/generated/*.webp
```

### Deployment Pipeline
```
astro build
    │
    ▼
dist/_worker.js/index.js   ← Cloudflare Workers entry point
dist/ (static assets)       ← Served via ASSETS binding
    │
    ▼
wrangler deploy
    │
    ▼
Cloudflare Workers (heritage.aikorea24.kr)
```

## Data File Dependencies

```
src/lib/palace_data.json
  ├── Created from: scripts/data/palace_details.json (from collect.mjs Phase 3)
  ├── Consumed by: src/lib/api.ts (via static import)
  ├── Schema: Record<string, BuildingRecord[]> keyed by gung_number (1-5)
  └── Each record: nameKr, nameEn, nameJa, nameZh, detailCode, serialNumber,
                    explanationKr/En/Ja/Zh, mainImage, images[], videos[]

src/lib/landmarks.ts
  ├── Manually curated (not generated from API)
  ├── Consumed by: src/components/MapExplore.astro (via define:vars)
  └── Type: Landmark[] (id, name*, type, lat, lng, image, link, desc*)

public/tour-images/
  ├── index.json — Metadata for downloaded photos (title, photographer, URLs)
  └── gyeongbokgung.jpg, bukchon.jpg, naksan.jpg, gwanghwamun.jpg,
      insadong.jpg, nseoul.jpg — KDH location photos

scripts/data/heritage_list.json (gitignored)
  ├── Generated by: scripts/collect.mjs (Phases 1+2)
  ├── Size: ~10,000+ heritage items with coordinates
  └── Consumed by: scripts/seed-d1.mjs, scripts/seed-direct.mjs
```

## Configuration File Index

| File | Purpose | Key Settings |
|------|---------|--------------|
| `astro.config.mjs` | Astro framework config | `output: 'server'`, `adapter: cloudflare()`, `site: 'https://heritage.aikorea24.kr'` |
| `wrangler.jsonc` | Cloudflare Workers config | `main: dist/_worker.js/index.js`, D1 binding `DB`, custom domain `heritage.aikorea24.kr`, `nodejs_compat` flag |
| `tsconfig.json` | TypeScript config | Extends `astro/tsconfigs/strict`, includes `.astro/types.d.ts` |
| `schema.sql` | D1 database schema | 6 tables: palaces, buildings, building_details, images, movies, heritage_index + indexes |
| `package.json` | NPM config | Dependencies: `astro@^5.17.1`, `@astrojs/cloudflare@^12.6.12`, `dotenv-expand@^13.0.0` |
| `.gitignore` | Git ignore rules | `dist/`, `.astro/`, `node_modules/`, `.env`, `scripts/data/*.json`, `scripts/data/sql/` |
| `public/robots.txt` | Search engine crawling | Disallows `/api/`, points sitemap to `https://heritage.aikorea24.kr/sitemap.xml` |

## Where to Add New Code

**New page:**
- Add file to `src/pages/` following file-based routing conventions
- For main pages, wrap in `Layout.astro`; for guide/SEO pages, wrap in `GuideLayout.astro`
- Import data from `src/lib/api.ts` (PALACES, getLang, fetchPalaceList, fetchBuildingDetail)
- Add multi-lang content using `Record<string, string>` dictionaries with `lang` variable

**New component:**
- Add `.astro` file to `src/components/`
- Accept `lang` prop for internationalization
- Use inline `<script>` blocks for client interactivity
- Use `define:vars` to pass server-side data to scripts
- Add styles in `<style>` tag at bottom of component file

**New API route:**
- Add `.ts` file to `src/pages/api/`
- Export `GET` (and/or `POST`, etc.) as `APIRoute` type
- Access D1 via `(locals as any).runtime.env.DB`
- Return `new Response(JSON.stringify(...), { headers: {...} })`

**New static data:**
- Add to `src/lib/` for imported data modules (re-deploy required for changes)
- Add to `public/` for static assets served at root path

**New guide content page:**
- Add `.astro` to `src/pages/guide/`
- Add the slug to the `guidePages` array in `src/pages/sitemap.xml.ts`
- Add hreflang alternates are handled automatically by GuideLayout.astro

---

*Structure analysis: 2026-07-01*
