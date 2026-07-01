# Codebase Concerns

**Analysis Date:** 2026-07-01

## Data Integrity

### Dual Data Sources — JSON vs D1 Drift

**Issue:** Pages serve palace building data from `src/lib/palace_data.json` (imported directly in `src/lib/api.ts` line 1), while the D1 database has a normalized 5-table schema (`schema.sql` lines 6-98) with `palaces`, `buildings`, `building_details`, `images`, and `movies`. The D1 database is only seeded with `heritage_index` table data (via `scripts/seed-d1.mjs` and `scripts/seed-direct.mjs`), which powers the spatial search endpoint at `src/pages/api/heritage.ts`. Palace building data that drives the main user-facing pages (`src/pages/palace/[id].astro`, `src/pages/guide/*.astro`) comes exclusively from the static JSON file — not from D1.

**Files:**
- `src/lib/api.ts` — `import palaceData from './palace_data.json'` (line 1)
- `src/lib/palace_data.json` — 736KB static JSON, the live data source for all palace pages
- `schema.sql` — 5 normalized D1 tables, mostly unused for palace content
- `src/pages/palace/[id].astro` — calls `fetchPalaceList()` which reads from JSON (line 15)
- `scripts/seed-d1.mjs` — only seeds `heritage_index` table, not palace tables

**Impact:** Data served to users may diverge from what's in D1. If D1 is updated with corrections/enrichments but the JSON file is not regenerated, pages show stale data. If the JSON is regenerated from KHS API but the D1 palace tables remain unseeded, the full D1 schema offers no benefit.

**Fix approach:** Either (1) retire the JSON file and serve all palace content from D1 (requires seeding 4 more tables), or (2) add a migration that syncs JSON → D1 on deploy, then treat JSON as the source of truth and D1 as cache.

### D1 Schema Mismatch — Palace Tables Never Populated

**Issue:** The D1 schema defines `palaces`, `buildings`, `building_details`, `images`, and `movies` tables, but only `heritage_index` (a 6th table not in `schema.sql`) has been populated via the 37 batch SQL files in `scripts/data/sql/`. The palace tables have never been seeded.

**Files:**
- `schema.sql` — defines 5 tables
- `scripts/seed-d1.mjs` — only handles `heritage_index` (line 38: `INSERT OR IGNORE INTO heritage_index`)
- `scripts/seed-direct.mjs` — same, only `heritage_index`
- `scripts/data/sql/batch_000.sql` through `batch_036.sql` — 37 batch files for `heritage_index` only

**Impact:** The entire normalized schema is dead code. Any future migration to D1-based palace pages requires building a seed pipeline for 4 additional tables.

**Fix approach:** Either drop unused tables from `schema.sql` or build the seed pipeline. If retaining, add palace table seeding to `scripts/seed-d1.mjs`.

### Collected Data Excluded from Git

**Issue:** `.gitignore` (line 33) excludes `scripts/data/*.json` and `scripts/data/progress.json`. This means the collected heritage_list.json, palace_details.json, and progress state are not version-controlled. Regenerating requires re-running `scripts/collect.mjs` against the KHS API, which takes time and depends on API availability.

**Files:**
- `.gitignore` — lines 32-34 exclude generated data
- `scripts/data/heritage_list.json` — exists on disk, not tracked
- `scripts/data/progress.json` — exists on disk, not tracked

**Impact:** If the KHS API changes its response format or becomes unavailable, the collected data is unrecoverable. No historical tracking of data changes.

**Fix approach:** Add sample data to version control (or a downloadable archive). Keep the `.gitignore` exclusion but document the regeneration command and expected output.

---

## External Dependencies

### KHS OpenAPI Availability — Thin Proxy, No Fallback

**Issue:** Both `/api/events.ts` and `/api/narration.ts` are thin proxy routes with no caching layer, no offline fallback, and no CDN edge caching headers. If the KHS API is slow or returns errors, the affected page components (`AudioGuide.astro` calls `/api/narration`, and any events display calls `/api/events`) will show empty states or errors.

**Files:**
- `src/pages/api/events.ts` — proxy to `http://www.khs.go.kr/cha/openapi/selectEventListOpenapi.do` (lines 3-43)
- `src/pages/api/narration.ts` — proxy to KHS narration API with 2 fallback endpoints (lines 3-59), 8s timeout
- `src/components/AudioGuide.astro` — fetches `/api/narration` at runtime (line 218)

**Impact:** Any page with the AudioGuide component (palace building detail pages) depends on the narration API being available. Any page with events depends on the events API. No stale-while-revalidate or Cloudflare KV caching.

**Fix approach:** Add Cloudflare KV-based caching to API routes with TTL (e.g., 1 hour for events, 1 day for narrations). Add `Cache-Control` headers. Alternatively, pre-fetch narration data during build and embed it in the page.

### Hugging Face API Dependency for Build

**Issue:** `scripts/generate-ai-images.mjs` requires a `HF_TOKEN` environment variable and calls the Hugging Face inference API at runtime (line 72: `https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell`). The build will fail entirely if this token is not set or the API returns errors. Additionally, it requires ImageMagick `convert` or `sharp-cli` for WebP conversion.

**Files:**
- `scripts/generate-ai-images.mjs` — lines 24-28 check for HF_TOKEN; lines 110-127 attempt ImageMagick then Sharp
- `package.json` — no scripts reference this generator; no `sharp-cli` in dependencies

**Impact:** The AI image generation pipeline is undocumented and fragile. Not wired into `astro build`. If ever integrated, a missing system dependency (ImageMagick) or API change breaks the build.

**Fix approach:** Add `sharp` as a dependency and use its programmatic API instead of shelling out. Wrap in a `astro build:full` script that runs image generation first. Document the required env vars in a `.env.example`.

### Korea Tour API Key in Collection Scripts

**Issue:** `scripts/collect-tour-images.mjs` and `scripts/test-tourapi.mjs` use `DATA_GO_KR_API_KEY` from env (lines 8, 7 respectively). This is a government API key that requires registration. If the key expires or the API changes endpoints, the tour image collection pipeline breaks silently.

**Files:**
- `scripts/collect-tour-images.mjs` — line 8: `const SERVICE_KEY = process.env.DATA_GO_KR_API_KEY`
- `scripts/test-tourapi.mjs` — line 7: same

**Impact:** No way to regenerate tour images without a valid key. No documentation of where to obtain the key.

**Fix approach:** Document API key sources. Add graceful degradation in the collection script (skip and warn, don't crash).

---

## Performance

### Large Global CSS Bundle (1260 lines)

**Issue:** `src/styles/global.css` is 1260 lines containing all visual styles — custom cursor system (dot + ring + trail at lines 247-304), ambient background orbs (lines 359-402), gradient border animations (lines 404-431), scrollbar styling, kinetic typography, glassmorphism system, bento grid, hero styles, card grids, navigation, buttons, Google Translate overrides, and 4 responsive breakpoints. This file is `@import`ed in every page via `<style>@import '../styles/global.css';</style>`.

**Files:**
- `src/styles/global.css` — 1260 lines total
- `src/pages/index.astro` — line 100: `@import '../styles/global.css'`
- `src/pages/kpop-demon-hunters.astro` — line 153: `@import '../styles/global.css'`
- `src/pages/palace/[id].astro` — line 53: `@import '../../styles/global.css'`

**Impact:** Render-blocking CSS on every page. Full style rules for the custom cursor system, ambient orbs, and gradient animations are loaded even on mobile where they're disabled via `@media (pointer: coarse)` (line 302-304). No CSS code splitting — every page gets every rule.

**Fix approach:** Split CSS into critical (layout, colors, typography) and deferred (animations, cursor, decorative effects). Use Astro's built-in CSS scoping for component-specific styles. Consider extracting the custom cursor system and ambient effects into component-scoped `<style>` blocks.

### Heavy Client-Side JavaScript Stack

**Issue:** Each page loads multiple heavy client-side libraries with no code splitting:
- **GSAP + ScrollTrigger**: Loaded from CDN (`unpkg.com/gsap@3.12.5`) as `is:inline` scripts in `src/layouts/Layout.astro` (lines 165-166)
- **MapLibre GL JS**: Loaded dynamically from CDN in both `MapExplore.astro` (line 472) and `kpop-demon-hunters.astro` (line 358)
- **Google Translate**: Full widget loaded via `//translate.google.com/translate_a/element.js` (Layout.astro line 393)
- **Custom cursor**: RequestAnimationFrame-based dot + ring + trail particle system running continuously (Layout.astro lines 176-220)
- **AdSense**: Async script loaded in Layout.astro (line 84) and homepage (line 263)

**Files:**
- `src/layouts/Layout.astro` — lines 165-166 (GSAP), 176-220 (cursor), 377-402 (Google Translate)
- `src/components/MapExplore.astro` — lines 471-474 (MapLibre dynamic import), 476-680 (all map logic)
- `src/pages/kpop-demon-hunters.astro` — lines 357-358 (MapLibre for KDH map)

**Impact:** Mobile users pay the download and parse cost for GSAP even if they never trigger scroll animations. The custom cursor `requestAnimationFrame` loop runs on every page even if the user never moves the mouse (Layout.astro line 192). MapLibre (~350KB gzipped) is loaded on every page that contains `MapExplore.astro` (homepage) or the KDH page, even if the user doesn't scroll to the map.

**Fix approach:** Conditionally load GSAP via `IntersectionObserver` or dynamic `import()`. Add lazy-load equivalent for MapLibre — only load when the map container scrolls into view. For the cursor, add an idle timeout that suspends the RAF loop after 5 seconds of no mouse movement.

### Large Component Files — Complexity Risk

**Issue:** Three components exceed 600 lines, containing both markup *and* comprehensive client-side scripts. This makes them difficult to maintain, test, or split:

- `AudioGuide.astro` — 861 lines (HTML template + 740 lines of inline script with audio player, TTS, caching, language switching)
- `kpop-demon-hunters.astro` — 826 lines (page template + significant inline styles)
- `MapExplore.astro` — 682 lines (HTML template + 330 lines of inline map logic with location services, markers, bottom sheet)

**Files:**
- `src/components/AudioGuide.astro` — 861 lines
- `src/pages/kpop-demon-hunters.astro` — 826 lines
- `src/components/MapExplore.astro` — 682 lines

**Impact:** High cognitive load for changes. Risk of regressions. No opportunity for unit testing the inline scripts. The AudioGuide component's script (starting line 121) contains state management, event handling, audio playback, TTS, caching, and UI updates in a single IIFE.

**Fix approach:** Extract client-side scripts to separate `.ts` modules under `src/lib/` or `src/scripts/`. This enables testing and tree-shaking. Each module should export a single initialization function.

### No Image Optimization Pipeline

**Issue:** `OptimizedImage.astro` (`src/components/OptimizedImage.astro`, 43 lines) is a thin wrapper that passes `loading`, `fetchpriority`, `width`, `height`, and `style` to an `<img>` tag. It does **not** perform any image optimization — no format conversion (WebP/AVIF), no responsive srcset generation, no blur-up placeholder. Images served from external URLs (KHS API: `https://www.heritage.go.kr/gung/gogung1/images/ic-e21.jpg`) cannot be optimized by the component. The hero image on the homepage (index.astro line 106) uses a KHS URL without any optimization.

**Files:**
- `src/components/OptimizedImage.astro` — entire file, no transform/optimization logic
- `src/pages/index.astro` — line 106: direct KHS URL as hero image
- `src/pages/kpop-demon-hunters.astro` — line 158: direct KHS URL

**Impact:** Core Web Vitals LCP is directly affected. The hero image on the homepage (~270KB JPEG from KHS CDN) cannot be converted to WebP or resized for mobile. No responsive images means mobile users download desktop-sized images.

**Fix approach:** Use Astro's built-in `@astrojs/image` or build a simple Sharp-based optimization pipeline at build time that downloads and transforms external images. Even a simple WebP conversion + 3-size srcset would significantly improve LCP.

---

## Code Quality

### No Test Coverage

**Issue:** Zero test files exist in the repository. No test runner is configured (`package.json` has no test-related dependencies). No `vitest.config.*`, `jest.config.*`, or any test config files.

**Files:**
- `package.json` — no test dependencies, no test script
- All `.astro` files, all `.ts` files — no test coverage

**Impact:** Every regression is caught only in production or manual testing. The data pipeline (API collection → JSON → D1 seeding) has no automated validation. The complex client-side interactions in AudioGuide (audio playback, TTS fallback, language switching) cannot be tested.

**Fix approach:** Install vitest with `@vitest/runner` and add tests for: (1) all utility functions in `src/lib/api.ts`, (2) data format validation for `heritage_list.json` structure, (3) API route response shapes. Add at minimum smoke tests for page rendering.

### No Linting or Formatting

**Issue:** No ESLint, Prettier, or Biome configuration exists. `package.json` lists no dev dependencies for linting or formatting. The codebase has no consistent style enforcement.

**Files:**
- `package.json` — no linting/formatting dependencies
- No `.eslintrc.*`, `.prettierrc*`, `biome.json`, or `eslint.config.*` files found

**Impact:** Code style inconsistencies across files. No automated catch of TypeScript errors, unused imports, or potential bugs. The mix of `var`, `let`, and `const` in inline scripts (Layout.astro uses `var` in lines 367-374 for nav, `let`/`const` in other scripts) will continue without enforcement.

**Fix approach:** Add `biome` (linter + formatter, fast) with a `lint` and `format` script. Add a pre-commit hook with `lint-staged`.

### No Type-Checking in Build

**Issue:** The `build` script is just `astro build` (package.json line 7). Astro's `tsconfig.json` extends `astro/tsconfigs/strict` but `astro build` does not run `tsc --noEmit`. Type errors in `.ts` files or inline scripts will not prevent a successful build.

**Files:**
- `package.json` — line 7: `"build": "astro build"` — no type-check step
- `tsconfig.json` — strict mode enabled but unused

**Impact:** TypeScript strict mode is configured but not enforced. Type errors in `src/lib/api.ts`, `src/lib/landmarks.ts`, or API routes can silently reach production.

**Fix approach:** Add `"typecheck": "tsc --noEmit"` script and wire it into `build` as `"build": "tsc --noEmit && astro build"`.

### No CI/CD Pipeline

**Issue:** No CI configuration files found (no `.github/workflows/`, `.gitlab-ci.yml`, or similar). No automated deploy pipeline.

**Files:**
- No `.github/` directory
- No CI config files anywhere in the repository

**Impact:** All deploys must be manual. No automated testing, type-checking, or linting gate before deployment. No rollback mechanism if a bad deploy goes through.

**Fix approach:** Add a GitHub Actions workflow that runs `typecheck`, `lint`, and `test` on PR, then deploys to Cloudflare Workers on merge to main. Use `wrangler deploy` for the actual deployment step.

---

## Security

### API Keys in Scripts — No Guidance

**Issue:** Three environment variables with API keys are required:
- `HF_TOKEN` — Hugging Face API token (`scripts/generate-ai-images.mjs`, line 24)
- `DATA_GO_KR_API_KEY` — Korea Tour API key (`scripts/collect-tour-images.mjs`, line 8; `scripts/test-tourapi.mjs`, line 7)
- KHS API key — likely used in `scripts/collect.mjs` for KHS OpenAPI calls

None of these are documented in a `.env.example` file. The scripts load `.env` and `~/.env.common` (e.g., `generate-ai-images.mjs` lines 17-19) but the required variables are not listed anywhere.

**Files:**
- `scripts/generate-ai-images.mjs` — lines 17-19: loads env from `~/.env.common` and `.env`
- `scripts/collect-tour-images.mjs` — line 6: loads `~/.env.common`
- `scripts/test-tourapi.mjs` — line 5: loads `~/.env.common`

**Impact:** New developers don't know which env vars to set. No validation error messages for missing keys (except HF_TOKEN at line 26). Keys loaded from `~/.env.common` (home directory) are outside the project — easy to forget about.

**Fix approach:** Create `.env.example` with all required variables documented. Add validation at the start of each script that checks for required vars and prints a helpful error message.

### Unauthenticated API Endpoints

**Issue:** Three API routes (`/api/heritage.ts`, `/api/events.ts`, `/api/narration.ts`) are fully public with CORS `Access-Control-Allow-Origin: *`. No rate limiting, authentication, or usage quotas are implemented.

**Files:**
- `src/pages/api/heritage.ts` — line 48: `'Access-Control-Allow-Origin': '*'`
- `src/pages/api/events.ts` — line 38: same
- `src/pages/api/narration.ts` — line 57: same

**Impact:** The spatial search endpoint (`/api/heritage.ts`) queries D1 on every request. Any client can call these endpoints without restriction. A malicious user could exhaust D1 read quotas or saturate the Workers runtime.

**Fix approach:** Add rate limiting via Cloudflare WAF rate limiting rule. For the D1 endpoint, add query parameter validation (bound coordinates, limit cap). Consider a simple API key check for programmatic access.

---

## Operational

### Build-Time Image Generation Fragility

**Issue:** `scripts/generate-ai-images.mjs` has three hard dependencies for a successful run:
1. `HF_TOKEN` environment variable (checked at line 25-28, hard exit if missing)
2. Hugging Face Inference API availability (`api-inference.huggingface.co`, line 72)
3. ImageMagick `convert` or `sharp-cli` for WebP conversion (lines 110-127)

If any of these fail, individual images are skipped but the script continues. However, the script is not wired into `astro build`, so build failures from image generation are not currently a deploy blocker. This is a time bomb if it's ever integrated.

**Files:**
- `scripts/generate-ai-images.mjs` — lines 24-28 (HF_TOKEN check), 70-137 (API call + conversion), 110-127 (fallback logic)
- `package.json` — no `sharp` or `sharp-cli` in dependencies

**Impact:** Not integrated yet, but when it is: missing env var = build failure, no ImageMagick = low-quality output or skipped images, API rate limits (line 154: 2s delay between calls) = slow builds.

**Fix approach:** Add `sharp` as a project dependency and use its programmatic Node.js API. Create a `build:full` script that chains image generation then astro build. Document system requirements.

### D1 Seeding Process — No Migration Tooling

**Issue:** 37 SQL batch files in `scripts/data/sql/` must be applied manually via `run_seed.sh` in order. There's no migration tracking — applying the same batch file twice would insert duplicate data (mitigated only by `INSERT OR IGNORE`). Schema changes (`schema.sql`) must be applied manually via `wrangler d1 execute`.

**Files:**
- `scripts/data/sql/batch_000.sql` through `batch_036.sql` — 37 files, ~3632 lines total
- `scripts/data/run_seed.sh` — sequential execution script
- `schema.sql` — DDL that must be applied manually

**Impact:** No automated schema migrations. No rollback capability. Risk of schema drift between local and production D1 instances. No `d1 migrations` usage.

**Fix approach:** Use Cloudflare D1 Migrations (`wrangler d1 migrations`). Create an initial migration from `schema.sql`, then incremental migrations for future changes. Replace the batch SQL files with a single seed script that checks for existing data before inserting.

### Env Loading from Home Directory

**Issue:** Scripts load environment from `~/.env.common` (home directory) as a fallback. This means API keys may live outside the project, making them invisible to other developers and creating a hidden dependency.

**Files:**
- `scripts/generate-ai-images.mjs` — line 17: `config({ path: resolve(homedir(), '.env.common') })`
- `scripts/collect-tour-images.mjs` — line 6: same
- `scripts/test-tourapi.mjs` — line 5: same

**Impact:** A fresh checkout of the repository cannot run these scripts. The env vars are not documented anywhere. If `~/.env.common` is lost or modified, the scripts silently fall back to project `.env` (which also doesn't exist in the repo).

**Fix approach:** Remove the `~/.env.common` fallback. Require `.env` at project root exclusively. Create `.env.example` with all keys documented.

---

## SEO & Content

### KPop Demon Hunters IP Referencing Risk

**Issue:** The primary SEO traffic hook (`/kpop-demon-hunters` page, `src/pages/kpop-demon-hunters.astro`, 826 lines) extensively references "KPop Demon Hunters" throughout page titles, meta descriptions, FAQ content, location descriptions, and schema. The page is explicitly designed to capture search traffic for "kpop demon hunters real locations" and similar queries. This could be considered trademark use if the IP holder objects, and it creates a dependency on the cultural relevance of a single entertainment property.

**Files:**
- `src/pages/kpop-demon-hunters.astro` — title (line 12), meta description (line 13), hero badge (line 162), all FAQ content (lines 15-44), all 6 location descriptions (lines 48-115), schema implications
- `src/pages/index.astro` — KDH hook section (lines 244-253) directs to the KDH page
- `src/pages/sitemap.xml.ts` — KDH URLs get priority 1.0 (line 17)
- `AGENTS.md` — references KDH as "핵심 트래픽 훅" and "첫 번째 트래픽 엔진"

**Impact:** If the IP holder issues a takedown, the primary SEO traffic source must be removed or rebranded. The content is speculative ("the film showcases...") without actual citation to specific scenes. No disclaimer is present on the page.

**Fix approach:** Add a clear disclaimer that K-Heritage Guide is not affiliated with, endorsed by, or connected to KPop Demon Hunters or its creators. Consider diversifying SEO strategy beyond this single keyword. Use the page as a "Seoul filming locations" guide that happens to include KDH, rather than a KDH-dedicated page.

### Content Freshness — No Update Mechanism

**Issue:** 9 guide pages under `src/pages/guide/` (gyeongbokgung, changdeokgung, changgyeonggung, deoksugung, jongmyo, secret-garden, palace-ticket, palace-hours, night-tour) contain static heritage information. There is no mechanism to track when heritage data changes (e.g., operating hours, ticket prices, restoration status). The `lastmod` in `sitemap.xml.ts` (line 7: `const today = new Date().toISOString()`) is generated fresh on each request, which is misleading — it doesn't reflect actual content changes.

**Files:**
- `src/pages/sitemap.xml.ts` — line 7: `lastmod` set to current date regardless of actual changes
- `src/pages/guide/` — 9 `.astro` guide pages with static content
- `src/lib/api.ts` — palace descriptions and data are hardcoded in the PALACES array (lines 18-84)

**Impact:** Search engines may flag artificially fresh `lastmod` dates without corresponding content changes. When heritage information updates (e.g., new operating hours for 2026), existing pages must be manually edited.

**Fix approach:** Either (1) set static `lastmod` dates in sitemap, or (2) implement a data-driven guide system that pulls information from D1/JSON with version tracking. Add an edit date footer to guide pages.

### Structured Data Quality — No Validation

**Issue:** The only structured data in the codebase is a `WebSite` JSON-LD block on the homepage (`src/pages/index.astro`, lines 266-273). There are no `Article`, `TouristAttraction`, `Place`, `Museum`, or other heritage-specific schema types. The existing JSON-LD is not validated against schema.org's requirements.

**Files:**
- `src/pages/index.astro` — lines 266-273: `WebSite` JSON-LD (minimal — only name, url, description, inLanguage)
- No other structured data found in the codebase

**Impact:** Search engines lack rich heritage/landmark-specific snippets. No star ratings, opening hours, or ticket price data exposed in search results. The `WebSite` schema provides basic info but misses the opportunity for rich results on individual palace pages.

**Fix approach:** Add `TouristAttraction` schema to each palace page with name, description, image, latitude/longitude, opening hours. Add `BreadcrumbList` schema. Validate all JSON-LD with Google's Rich Results Test during build.

### Image Alt Text Not Enforced

**Issue:** `OptimizedImage.astro` (`src/components/OptimizedImage.astro`, 43 lines) accepts an `alt` prop as a string but does not validate or enforce it. The hero image on `index.astro` (line 106) uses a reasonable alt text, but the KDH page uses generic English alt text (`"KPop Demon Hunters Seoul"`, line 158) regardless of the page's current language. Some images in `MapExplore.astro` and other pages do not consistently provide localized alt text.

**Files:**
- `src/components/OptimizedImage.astro` — line 4: `alt: string` — no validation or fallback
- `src/pages/kpop-demon-hunters.astro` — line 158: hardcoded English alt text
- `src/components/MapExplore.astro` — multiple image renders with varying alt quality
- `src/pages/index.astro` — line 135: Korean alt text on the minhwa image is appropriate

**Impact:** Accessibility gaps for screen reader users. Mixed-language pages may present alt text in the wrong language. No automated check for missing or generic alt text.

**Fix approach:** Add a build-time check (or lint rule) that flags images without descriptive alt text. Pass `lang` to `OptimizedImage.astro` and provide locale-aware alt text. Consider adding `role="presentation"` for purely decorative images.

---

## Maintainability

### AGENTS.md Drift from Actual Code

**Issue:** `AGENTS.md` (547 lines) serves as the project's design architecture document. It describes a comprehensive visual system (Dancheong x Neon palette, typography, CSS patterns) and development tracks (A through E) that may not fully match the current codebase state. The document references specific implementation details (e.g., "DancheongCard.astro", "NeonGlow.astro", "TimeSlider.astro") but the codebase has evolved independently.

**Files:**
- `AGENTS.md` — 547 lines, project design reference
- Various `.astro` components — may or may not follow AGENTS.md specs exactly

**Impact:** Inconsistencies between the design document and actual code. New developers reading AGENTS.md may get an inaccurate picture of the current architecture. The document references a "TRACK A/B/C/D/E" execution plan that may be outdated.

**Fix approach:** Either (1) keep AGENTS.md as a living document and update it to match the codebase, or (2) create a separate `ARCHITECTURE.md` that describes the as-built state and archive the original AGENTS.md as historical reference.

### No Typed Data Contracts Between JSON and TypeScript

**Issue:** `palace_data.json` (736KB) is imported as `any` in `src/lib/api.ts` (line 1: `import palaceData from './palace_data.json'`). The TypeScript interfaces (`BuildingItem`, `BuildingDetail`, `Palace`) defined in the same file are manually written and not validated against the actual JSON structure. There is no runtime schema validation (Zod, Ajv, etc.).

**Files:**
- `src/lib/api.ts` — line 1: `import palaceData from './palace_data.json'` (implicit `any`); lines 118-143: `BuildingItem` interface; lines 147-162: `BuildingDetail` interface
- `src/lib/palace_data.json` — the actual data, no type guarantee

**Impact:** If the JSON structure changes (e.g., a field is renamed or removed by `scripts/collect.mjs`), TypeScript will not catch the mismatch. The manual interfaces may drift from the actual data, causing runtime `undefined` errors.

**Fix approach:** Generate TypeScript types from the JSON data structure using `json-to-ts` or similar in a pre-build step. Alternatively, add Zod schemas that validate the JSON at import time and provide proper type inference. At minimum, add runtime checks in `fetchBuildingDetail` for required fields.

### Mixed Language Code Style — `var` vs `let`/`const`

**Issue:** Inline scripts use a mix of ES5-era `var` and modern `let`/`const`, indicating inconsistent authoring patterns. `Layout.astro` uses `var` in some inline scripts (lines 367, 369) but `let`/`const` in others (lines 179-180). Some scripts use ES5 function syntax (Layout.astro line 367: `(function(){`) while others use arrow functions.

**Files:**
- `src/layouts/Layout.astro` — line 367-374: `var nav=document.getElementById('site-nav')` (var)
- `src/layouts/Layout.astro` — lines 179-180: `let mouseX = 0, mouseY = 0;` (let)
- `src/components/AudioGuide.astro` — lines 122-861: uses `var` and `let` interchangeably

**Impact:** Maintainability issue. No consistent code style guidance. Makes automated refactoring harder.

**Fix approach:** Standardize on `const` by default, `let` only for reassignment. Remove all `var` usage. This can be automated with biome or eslint with `--fix`.

### Dead Code — Unused D1 Tables and Unreferenced Data

**Issue:** Several pieces of code and data exist without current usage:
1. 5 D1 tables (`palaces`, `buildings`, `building_details`, `images`, `movies`) defined in `schema.sql` but never populated
2. `scripts/collect.mjs` collects `palace_details.json` but it's not referenced by any page or seed script
3. `scripts/test-tourapi.mjs` — a one-off test script left in the repository
4. `scripts/data/progress.json` — incremental progress state, only meaningful during active collection

**Files:**
- `schema.sql` — 5 unused tables
- `scripts/collect.mjs` — collects palace_details.json that feeds nothing
- `scripts/test-tourapi.mjs` — development artifact
- `scripts/data/progress.json` — operational state file

**Impact:** Dead code increases cognitive load and suggests abandoned features. New developers may waste time understanding unused structures.

**Fix approach:** Remove or clearly mark dead code. For the D1 tables: either implement the seed pipeline or remove them from schema.sql. Move `test-tourapi.mjs` to a `scripts/archive/` directory.

---

*Concerns audit: 2026-07-01*
