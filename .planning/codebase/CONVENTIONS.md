# Coding Conventions

**Analysis Date:** 2026-07-01

## Code Style

**Language:** TypeScript with strict mode (`astro/tsconfigs/strict`). Config at `tsconfig.json`.

**Module System:** ES modules (`"type": "module"` in `package.json`). Scripts use `.mjs` extension (e.g., `scripts/generate-ai-images.mjs`, `scripts/seed-d1.mjs`).

**File Organization:**
```
src/
├── components/        # Astro .astro components
├── layouts/           # Layout.astro, GuideLayout.astro
├── lib/               # Data modules (api.ts, landmarks.ts) + palace_data.json
├── pages/             # Route pages
│   ├── api/           # API endpoints (heritage.ts, events.ts, narration.ts)
│   ├── guide/         # SEO guide pages
│   └── palace/        # Palace + building detail pages
└── styles/            # global.css
```

**Implicit Barrel Pattern:** `src/lib/api.ts` serves as a barrel module exporting all data-access functions, types, and constants used across components and pages. Import from `'../lib/api'` throughout.

## Naming Patterns

**Files/Directories:**
- Pages: `kebab-case.astro` (e.g., `kpop-demon-hunters.astro`, `palace-ticket.astro`)
- Components: `PascalCase.astro` (e.g., `DancheongCard.astro`, `BreadcrumbNav.astro`, `FAQSection.astro`)
- API routes: `snake-case.ts` (e.g., `narration.ts`, `heritage.ts`)
- Library modules: `camelCase.ts` (e.g., `api.ts`, `landmarks.ts`)

**Functions/Variables:**
- Data access functions: `camelCase` prefixed with `get` or `fetch` (e.g., `getLang()`, `getPalaceName()`, `fetchPalaceList()`, `fetchBuildingDetail()`)
- Geographic helpers: `camelCase` (e.g., `getDistance()`, `getNearbyLandmarks()`)
- Boolean flags: `is*` prefix when appropriate
- Language text maps: single lowercase letter `L` convention used in some components (e.g., `const L = labels[lang] || labels.kr` — seen in `MapExplore.astro` line 19)

**Types/Interfaces:**
- `PascalCase` exported interfaces (e.g., `Palace`, `BuildingItem`, `BuildingDetail`, `Landmark`, `Lang`, `BreadcrumbItem`, `FAQItem`)
- Type `Lang` is a union: `'kr' | 'en' | 'ja' | 'zh'`
- Props interfaces are defined inline above the component, either exported or file-scoped

**CSS Classes:**
- `kebab-case` utility classes (e.g., `neon-text-gold`, `dancheong-divider`, `glass-card`, `bento-6`, `reveal-up`, `hero-full`)
- Component-scoped classes prefixed with component abbreviation: `dc-*` (DancheongCard), `ts-*` (TimeSlider), `ag-*` (AudioGuide), `bld-*` (building detail), `kdh-*` (KPop Demon Hunters)

## Component Patterns

**Astro Component Structure:**
1. Frontmatter script block (`---`) with interface Props + data loading
2. HTML template with `<slot/>` support
3. Client-side `<script>` tag (untransformed, runs in browser)
4. Component-scoped `<style>` block (automatically scoped by Astro)

**Props Pattern — destructured with defaults:**
```astro
---
interface Props {
  name: string;
  nameH?: string;
  desc: string;
  image: string;
  href: string;
  color?: string;
  lang?: string;
  size?: 'default' | 'large';
}

const {
  name,
  nameH = '',
  desc,
  image,
  href,
  color = 'var(--dancheong-yellow)',
  lang = 'kr',
  size = 'default',
} = Astro.props;
---
```
Example: `DancheongCard.astro` lines 2-22.

**Props as data-attributes for JS consumption:**
`AudioGuide.astro` passes runtime data via `data-*` attributes on the root element:
```astro
<div data-asno={asno} data-ctcd={ctcd} data-lang={lang} data-title={title} ...>
```
Then client JS reads via `root.dataset.asno`, `root.dataset.lang`, etc.

**Slots:**
- `Layout.astro` uses `<slot />` for page content injection (line 155)
- `GuideLayout.astro` uses `<slot />` similarly (line 114)

**Inline Styles via `style` attribute:**
Dynamic CSS custom properties are passed inline:
```astro
style={`--card-accent: ${color}`}
style={`color: ${accentColor}`}
style={`--bld-accent: ${accentColor}`}
```

## CSS/Styling

**Tool:** Pure CSS (no preprocessor). Astro-scoped styles per component. Global styles in `src/styles/global.css`.

**CSS Custom Properties System** (`global.css` lines 13-92):
- Dancheong palette: `--dancheong-blue`, `--dancheong-red`, `--dancheong-yellow`, `--dancheong-white`, `--dancheong-black`
- Neon glow variants: `--neon-blue`, `--neon-red`, `--neon-gold`, `--neon-purple`, `--neon-cyan`, `--neon-pink`, `--neon-orange`
- Background system: `--bg-night`, `--bg-deep`, `--bg-card`, `--bg-card-hover`, `--bg-glass`
- Palace accent colors: `--palace-gyeongbok`, `--palace-changdeok`, `--palace-changgyeong`, `--palace-deoksu`, `--palace-jongmyo`
- Spacing/radius: `--radius`, `--radius-sm`, `--radius-lg`, `--radius-xl`
- Shadows: `--shadow-sm` through `--shadow-xl`
- Transitions: `--transition`, `--transition-bounce`, `--transition-smooth`
- Bento grid: `--bento-gap`, `--bento-radius`

**Glassmorphism Utility Classes:**
```css
.glass { background: var(--bg-glass); backdrop-filter: blur(20px) saturate(1.4); }
.glass-strong { ... blur(32px) }
.glass-card { ... blur(16px) + box-shadow + hover effect }
```

**Bento Grid System** (`global.css` lines 209-242):
```css
.bento-grid { display: grid; gap: var(--bento-gap); grid-template-columns: repeat(12, 1fr); }
.bento-3  { grid-column: span 3; }
.bento-6  { grid-column: span 6; }
.bento-row-2 { grid-row: span 2; }
```
Mobile: collapses to single column at 768px breakpoint.

**Neon Text Utility Classes:**
```css
.neon-text-gold { color: var(--neon-gold); text-shadow: 0 0 8px #FFD700, 0 0 16px rgba(255,215,0,0.6); }
.neon-text-blue { ... }
.neon-text-red { ... }
```
Mobile: reduced shadow layers at 640px breakpoint.

**Dancheong Pattern Utilities** (`global.css` lines 453-480):
- `.dancheong-divider` — 4px repeating gradient bar
- `.dancheong-border-top` — border-image with obang colors
- `.dancheong-glow` — gold glow box-shadow

**Dancheong SVG Patterns** (`src/components/DancheongPatterns.astro`):
- Cloud pattern (운문), lotus pattern (연꽃), geometric pattern
- Applied via CSS background with inline SVG data URIs: `.dancheong-bg-cloud`, `.dancheong-bg-lotus`

**Responsive Breakpoints — mobile-first:**
- `640px` — mobile adjustments (cards, nav, hero, buttons, maps)
- `768px` — bento grid collapse, layout adjustments
- No explicit desktop breakpoint (desktop is default)

**Animation Patterns:**
- CSS keyframe animations for particles, ambient orbs, shimmer
- GSAP + ScrollTrigger for scroll-triggered reveals (`Layout.astro` lines 222-361)
  - `.reveal-up`, `.reveal-scale`, `.reveal-stagger` handle by GSAP
  - CSS `.visible` class variants also exist as fallback (lines 1107-1144)
- Scroll-driven CSS animations via `animation-timeline: view()` (`.minhwa-reveal-inner`, line 1075)
- `prefers-reduced-motion: reduce` disables all animations (`global.css` lines 1225-1237, also checked in JS)

**Cursor System** (`global.css` lines 247-304):
- Custom cursor dot + ring + trail particles (desktop only, disabled on touch devices via `pointer: coarse`)

## Multi-Language Pattern

**Language Detection:**
```typescript
// src/lib/api.ts lines 87-93
export type Lang = 'kr' | 'en' | 'ja' | 'zh';
export function getLang(url: URL): Lang {
  const p = url.searchParams.get('lang');
  if (p === 'en' || p === 'ja' || p === 'zh') return p;
  return 'kr';
}
```
Default is `kr` (Korean). All links include `?lang=${lang}`.

**Text Content Maps — `Record<string, string>` pattern:**
All translatable text is defined as inline `Record<string, string>` objects in page frontmatter. There are no `.json` i18n files or translation tables — every page and component defines its own language maps.

```astro
const titles: Record<string, string> = {
  kr: '한국 궁궐·종묘 가이드 — K-Heritage Guide',
  en: 'Korean Palace & Shrine Guide — K-Heritage Guide',
  ja: '韓国宮殿・宗廟ガイド — K-Heritage Guide',
  zh: '韩国宫殿·宗庙指南 — K-Heritage Guide',
};
```

**Language Fallback Pattern:**
Fallback to Korean (`kr`) or English (`en`) when a language key is missing:
```astro
const h = hero[lang] || hero.kr;            // fallback to kr
const L = labels[lang] || labels['ko'];      // in MapExplore (note: 'ko' not 'kr')
const t = titles[lang] || titles.en;         // fallback to en (in kpop-demon-hunters)
const map: Record<Lang, string> = { kr: p.nameKr, en: p.nameEn, ja: p.nameJa, zh: p.nameZh };
return map[lang];                            // exact match required in api.ts
```

**Key Pattern:** Keys are consistently `kr`, `en`, `ja`, `zh` (lowercase, 2-letter codes). Exception: `Layout.astro` and `GuideLayout.astro` use `ko` (not `kr`) for the `lang` attribute on `<html>` and some label maps.

**HTML Lang Attribute:**
```astro
const htmlLang = lang === 'kr' ? 'ko' : lang;  // convert 'kr' to 'ko' for HTML lang
```

**Multi-lingual Static Data:**
- `api.ts`: `Palace` interface has `nameKr, nameEn, nameJa, nameZh` fields; `BuildingItem` and `BuildingDetail` follow same pattern
- `landmarks.ts`: `Landmark` interface has `nameKr, nameEn, nameJa, nameZh, descKr, descEn, descJa, descZh`
- Fallback chain: if a translation field is empty, fall back to kr (e.g., `b.nameEn || b.nameKr` in `fetchPalaceList()`)

## Data Access Pattern

**Primary Data — Static JSON:**
```typescript
// src/lib/api.ts line 1
import palaceData from './palace_data.json';
```
The `palace_data.json` is a large static JSON file imported directly at module level. It is bundled at build time. Functions like `fetchPalaceList()` and `fetchBuildingDetail()` read from this JSON.

**Lookup Helpers** (`api.ts`):
- `getPalaceName(p, lang)` / `getPalaceDesc(p, lang)` — returns localized text from a `Palace` object
- `fetchPalaceList(gungNumber)` — returns `BuildingItem[]` filtered by palace ID
- `fetchBuildingDetail(gungNumber, serialNumber, detailCode)` — returns a single `BuildingDetail | null`

**Static Landmark Data** (`landmarks.ts`):
- `LANDMARKS` array — 13 entries (5 palaces + 8 heritage sites)
- `getDistance(lat1, lng1, lat2, lng2)` — Haversine formula
- `getNearbyLandmarks(lat, lng, radiusKm)` — filtered + sorted by distance

**API Routes** (SSR, not static):
- `api/heritage.ts` — D1 spatial query (SQLite via Cloudflare D1)
- `api/events.ts` — proxy to Korea Heritage Service XML API
- `api/narration.ts` — proxy to multiple narration API endpoints with fallback chain

**Data Flow Pattern in Pages:**
```astro
---
// 1. Get language from URL
const lang = getLang(Astro.url);
// 2. Load data from static JSON or API
const buildings = await fetchPalaceList(palaceId);
// 3. Compute labels and localized content
const titles: Record<string, string> = { ... };
const label = titles[lang];
---
<Component name={getPalaceName(palace, lang)} ... />
```

## Error Handling

**API Route Error Handling:**
- `api/heritage.ts`: No error handling — relies on D1 query. On DB failure, throws 500.
- `api/events.ts`: Wraps fetch in try/catch (line 9-42). Returns `{ error: message }` with status 500 on failure, 502 on upstream API failure. Uses `AbortSignal.timeout(10000)`.
- `api/narration.ts`: Multiple endpoint fallback loop (lines 21-54). Tries 2 API URLs, `continue`s on failure, breaks on first success. Returns empty `{ items: [], count: 0 }` if all fail.

**Client-Side Error Handling:**
- `AudioGuide.astro`: API fetch errors caught silently (lines 220-231). `cache.set(lang, null)` on failure. Audio load errors trigger `showState('empty')`. TTS `onerror` handler cleans up timers and resets state.
- `MapExplore.astro`: Geolocation error shows alert (line 622). Image `onerror` hides broken images (line 523). Empty nearby results show "no results" message (line 667).
- `DancheongCard.astro`: No image error handling — broken images display with no fallback.

**Empty/Fallback States:**
- Audio guide: three states — `loading`, `player`, `empty` — managed by `showState()`
- Map: "No heritage sites nearby" with "Try expanding the radius" hint
- Building detail: returns `null` on not found, page redirects to palace list

## Performance Patterns

**Image Optimization** (`OptimizedImage.astro`):
```astro
<img loading={loading} fetchpriority={fetchpriority} decoding="async"
     style={`aspect-ratio: ${aspectRatio}; object-fit: cover;`} />
```

**Key Image Attributes Used Across Pages:**
- `loading="lazy"` — all images below the fold (default)
- `fetchpriority="high"` — hero images only
- `width` / `height` attributes declared (for aspect ratio calculation)
- `srcset` system described in AGENTS.md but not yet implemented

**Preconnect Hints** (`Layout.astro` lines 42-45):
```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://unpkg.com" crossorigin />
```

**Animation Performance Safeguards:**
- `will-change: transform` declared on animated elements (cards, buttons)
- `transform` + `opacity` only transitions (avoid layout re-computation)
- `@media (pointer: coarse)` disables hover effects, cursor, and tilt on touch devices
- GSAP uses `scrub: 1` for smooth throttled scroll tracking
- Mobile: card transforms set to `none !important` at 640px breakpoint

**Scroll-driven Animations:**
```css
.minhwa-reveal-inner {
  animation: minhwaReveal 1s ease forwards;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}
```

## Accessibility Patterns

**Semantic HTML:**
- `<nav>` with `aria-label="Breadcrumb"` for breadcrumbs
- `<section>` with `id` attributes for navigation targets
- `<details>`/`<summary>` for FAQ accordion
- `<article>` for building detail content

**aria-* Attributes:**
- `aria-label` on interactive elements: translate button, theme toggle, play button, flag buttons
- `aria-pressed` on language toggle buttons (AudioGuide)
- `aria-live="polite"` on loading states
- `role="slider"` on progress bar with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- `aria-hidden="true"` on decorative elements (SVG patterns, particles)
- `role="button"` on clickable divs

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; cursor: auto; }
  #cursor-dot, #cursor-ring, .cursor-trail { display: none !important; }
  body::before { display: none; }
  .ambient-orb { display: none; }
}
```
Also checked in JS: `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — used to skip GSAP animations and custom cursor entirely.

**Touch Device Adaptation:**
```css
@media (pointer: coarse) {
  html { cursor: auto; }
  #cursor-dot, #cursor-ring, .cursor-trail { display: none !important; }
}
```
- `-webkit-tap-highlight-color: transparent` on interactive cards
- `touch-action: pan-y` on slider viewport (allows vertical scroll, captures horizontal)
- `active: scale(0.98)` press feedback on cards

**Focus Indicators:**
- `.ag-play-btn:focus-visible` — gold outline offset
- `.ag-lang-btn:focus-visible` — gold outline offset
- Keyboard navigation on AudioGuide progress bar (arrow keys)

## SEO Patterns

**JSON-LD Structured Data:**
- `WebSite` — homepage (`index.astro`)
- `BreadcrumbList` — via `BreadcrumbNav.astro`
- `FAQPage` — via `FAQSection.astro` (auto-generated from items)
- `TouristAttraction` — palace pages
- `LandmarksOrHistoricalBuildings` — building detail pages

**hreflang Tags** (`Layout.astro` lines 68-72):
```html
<link rel="alternate" hreflang="ko" href="...?lang=kr" />
<link rel="alternate" hreflang="en" href="...?lang=en" />
<link rel="alternate" hreflang="ja" href="...?lang=ja" />
<link rel="alternate" hreflang="zh" href="...?lang=zh" />
<link rel="alternate" hreflang="x-default" href="..." />
```

**Open Graph + Twitter Cards** (`Layout.astro` lines 47-65):
- `og:title`, `og:description`, `og:image` (fixed 1200×630), `og:image:alt` (language-specific), `og:url`, `og:type`, `og:site_name`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

**Meta Tags:**
- `<meta charset="UTF-8" />`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
- `<meta name="theme-color" content="#080510" />`
- `<title>{title}</title>`, `<meta name="description" .../>`
- `<link rel="canonical" .../>`
- Google Search Console and Naver verification meta tags
- Google AdSense script in `<head>`

**Sitemap** (`src/pages/sitemap.xml.ts`):
- Dynamic XML sitemap generated at request time
- Covers all pages × 4 languages (home, palaces, buildings, guides, KDH page)
- Priority levels: 1.0 (home + KDH), 0.9 (guides), 0.8 (palaces), 0.7 (buildings)
- Changefreq: weekly (home, palaces), monthly (guides, KDH), yearly (buildings)

---

*Convention analysis: 2026-07-01*
