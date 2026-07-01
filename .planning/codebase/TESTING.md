# Testing Patterns

**Analysis Date:** 2026-07-01

## Current State

**No test infrastructure exists.** The project has:
- No test framework installed (`package.json` has no `vitest`, `jest`, `mocha`, `playwright`, or any test dependency — lines 1-15)
- No test files — no `*.test.*`, `*.spec.*`, or `__tests__` directories anywhere in the codebase
- No test scripts in `package.json` (`scripts` block has only `dev`, `build`, `preview`, and `astro`)
- No CI configuration — no `.github/`, `.circleci/`, `.gitlab-ci.yml` detected
- No coverage configuration
- No testing-related config files (no `vitest.config.ts`, `jest.config.*`)
- No `tsconfig.json` testing-specific paths or types

The project runs on Astro 5.17.1 SSR with Cloudflare Workers runtime (`@astrojs/cloudflare`). The runtime dependencies (`DB: D1Database`, `ASSETS`) are only available in Cloudflare Workers environment, making unit testing of API routes that access `locals.runtime.env` difficult without mocking.

## What Should Be Tested

### Critical Paths (Priority 1 — Production Risk)

**1. API Routes (data integrity & reliability)**

| Route | File | What to test |
|-------|------|-------------|
| `/api/heritage` | `src/pages/api/heritage.ts` | D1 spatial query logic, coord parsing, bounding box math, response shape, empty results, missing params |
| `/api/events` | `src/pages/api/events.ts` | XML parsing from `khs.go.kr`, error handling, timeout behavior, malformed XML resilience |
| `/api/narration` | `src/pages/api/narration.ts` | Multi-endpoint fallback chain, XML extraction, URL normalization (`https:` prefix), missing `asno`/`ctcd` params |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | All palace × language URL generation, building detail URL generation, error handling during `fetchPalaceList` |

**2. Data Layer (business logic correctness)**

| Module | File | What to test |
|--------|------|-------------|
| api.ts | `src/lib/api.ts` | `getLang()` — default kr, valid lang params, invalid params. `getPalaceName()` / `getPalaceDesc()` — all 4 languages, missing fields. `fetchPalaceList()` — data mapping, fallback fields (`b.nameEn \|\| b.nameKr`). `fetchBuildingDetail()` — matching logic, null return on not found |
| landmarks.ts | `src/lib/landmarks.ts` | `getDistance()` — Haversine correctness (known coordinates). `getNearbyLandmarks()` — radius filtering, sort order, empty results |

### Edge Cases & Error States (Priority 2)

**3. Client-Side Component Logic**

| Component | File | What to test |
|-----------|------|-------------|
| TimeSlider | `src/components/TimeSlider.astro` | Touch/mouse drag interaction, clipPath positioning, boundary clamping (0% and 100%), initial 50% state, mobile `pan-y` touch-action |
| AudioGuide | `src/components/AudioGuide.astro` | 3-state machine (loading→player/empty), API fetch error → empty state, TTS fallback when narration unavailable, singleton pattern (pause other players), language switching, progress bar seek, keyboard navigation |
| MapExplore | `src/components/MapExplore.astro` | Geolocation success/failure handling, overseas vs Korea-in-Seoul logic, radius button state management, SVG marker rendering, bottom sheet open/close, nearby list rendering with 0 results |
| DancheongCard | `src/components/DancheongCard.astro` | Mouse tracking for radial gradient, 3D tilt effect (desktop only, disabled on touch), hover/active states, `color` prop fallback to `var(--dancheong-yellow)` |

**4. Multi-Language Rendering**

Every page with `Record<string, string>` maps must render correctly for all 4 languages. Pages to verify:
- `src/pages/index.astro` — hero text, badge, section headings, CTA buttons, KDH hook, SEO titles/descriptions
- `src/pages/palace/[id].astro` — building names via `getBuildingName()`, `countLabel`, guide labels
- `src/pages/palace/[id]/[code].astro` — building name + explanation via `getName()`, `getExplanation()`, video URL mapping, gallery/video section headings
- `src/pages/guide/gyeongbokgung.astro` (and all 8 other guide pages)
- `src/pages/kpop-demon-hunters.astro` — FAQ, location names, hero content, route timeline
- `src/components/FAQSection.astro` — `Record<string, FAQItem[]>` branching
- Language fallback behavior: missing lang key falls back to `kr` or `en` depending on context

### Visual Regression (Priority 3)

**5. Responsive Breakpoints**
- Mobile (375px): single-column bento grid, reduced neon shadows, card transforms disabled, audio guide compact layout, map height 350px
- Desktop (1440px): 12-column bento grid, full cursor system, GSAP animations, 3D card tilt

**6. Dancheong Visual System**
- CSS custom properties resolve correctly (no `undefined` or invalid color values)
- Glassmorphism effects render with `backdrop-filter`
- Neon text shadows don't overflow containers
- Dancheong divider gradient renders at all widths

## Recommended Testing Approach

### Framework: Vitest

Vitest is recommended because:
- First-class TypeScript support (matches project's `astro/tsconfigs/strict`)
- Compatible with Astro's module resolution
- Native ESM support (matches `"type": "module"` in package.json)
- Fast, with watch mode
- Can test simple utility functions without any special setup

### E2E: Playwright

Playwright is recommended for:
- Testing client-side interactivity (TimeSlider drag, AudioGuide playback, MapExplore geolocation)
- Multi-language rendering verification across 4 language variants
- Responsive layout testing at mobile (375px) and desktop breakpoints
- Accessibility checks (axe-core integration)

### Test Types Distribution

```
Unit Tests  (Vitest)       60%  — lib/api.ts, lib/landmarks.ts, API route logic, data utilities
Integration (Vitest)       20%  — API routes with mocked D1/fetch, component interaction
E2E Tests  (Playwright)    20%  — Full page rendering, language switching, client interactivity
```

## Priority Test Targets

### 1. `src/lib/api.ts` — Language Helpers & Data Parsing

**Test file:** `src/lib/api.test.ts`

```
getLang()
  ✓ returns 'kr' with no ?lang param
  ✓ returns 'kr' with invalid ?lang=fr
  ✓ returns 'en' with ?lang=en
  ✓ returns 'ja' with ?lang=ja
  ✓ returns 'zh' with ?lang=zh

getPalaceName()
  ✓ returns correct name for each Lang
  ✓ has all 4 languages defined for all 5 palaces

getPalaceDesc()
  ✓ returns correct description for each Lang
  ✓ has all 4 languages defined for all 5 palaces

fetchPalaceList()
  ✓ returns array for valid gungNumber
  ✓ falls back nameEn to nameKr when empty
  ✓ falls back nameJa to nameKr when empty
  ✓ falls back nameZh to nameKr when empty
  ✓ returns empty array for invalid gungNumber

fetchBuildingDetail()
  ✓ returns matching building by serialNumber + detailCode
  ✓ returns null when no match found
  ✓ falls back explanation for missing languages
```

### 2. `src/lib/landmarks.ts` — Distance & Nearby Logic

**Test file:** `src/lib/landmarks.test.ts`

```
getDistance()
  ✓ returns 0 for same coordinates
  ✓ Gyeongbokgung to Changdeokgung ≈ 1.2km
  ✓ Gyeongbokgung to Jongmyo ≈ 1.5km
  ✓ Gyeongbokgung to Deoksugung ≈ 1.6km

getNearbyLandmarks()
  ✓ returns landmarks within radius
  ✓ sorts by distance ascending
  ✓ returns empty array when no landmarks within radius
  ✓ includes distance property on each result
```

### 3. `src/pages/api/heritage.ts` — D1 Spatial Query

**Test file:** `src/pages/api/heritage.test.ts`

```
GET /api/heritage
  ✓ returns valid JSON with items array
  ✓ uses default coords (37.5796, 126.977) when no params
  ✓ applies lat/lng/radius/limit from query params
  ✓ returns items with correct shape (id, nameKr, type, lat, lng, ...)
  ✓ responds with CORS header Access-Control-Allow-Origin: *
  ✓ handles empty D1 results gracefully
```

**Note:** Requires mocking `locals.runtime.env.DB` — use `vitest` with `unstable_vite_config` or `astro/virtual-modules` to mock the D1 binding.

### 4. `src/pages/api/events.ts` + `src/pages/api/narration.ts` — API Proxy Reliability

**Test file:** `src/pages/api/events.test.ts` and `src/pages/api/narration.test.ts`

```
GET /api/events
  ✓ proxies to khs.go.kr XML API
  ✓ parses XML blocks with multiple field names (evNm|event_name, etc.)
  ✓ returns { items, total, count } JSON
  ✓ returns 502 on upstream API failure
  ✓ returns 500 on network error
  ✓ applies AbortSignal.timeout(10000)

GET /api/narration
  ✓ returns { items, count } for valid params
  ✓ returns empty result when asno or ctcd missing
  ✓ tries fallback endpoint on first failure
  ✓ normalizes narration_url with https: prefix when missing
  ✓ handles XML parsing errors gracefully
  ✓ applies CORS header Access-Control-Allow-Origin: *
```

### 5. Interactive Components — TimeSlider, MapExplore, AudioGuide

**Test file:** `src/components/TimeSlider.test.ts` (or Playwright E2E)

```
TimeSlider interaction
  ✓ initial clipPath is 50%
  ✓ drag handle updates clipPath
  ✓ touch drag works (touch events)
  ✓ boundary clamping at 0% and 100%
  ✓ labels render in all 4 languages

AudioGuide interaction
  ✓ shows loading state initially
  ✓ transitions to player when audio URL found
  ✓ transitions to empty when no audio found
  ✓ play/pause toggles correctly
  ✓ singleton pattern: playing new pauses other
  ✓ language buttons load different narration
  ✓ TTS fallback works when no narration API available
  ✓ keyboard navigation: Space/Enter triggers play

MapExplore interaction
  ✓ renders MapLibre map on load
  ✓ shows markers for all LANDMARKS
  ✓ locate button triggers geolocation
  ✓ radius buttons filter nearby list
  ✓ bottom sheet opens on marker click
  ✓ overseas user sees farAway banner
```

### 6. Multi-Language Rendering

**Test file:** `e2e/language.spec.ts` (Playwright)

```
Home page language switching
  ✓ default lang=kr renders Korean text
  ✓ ?lang=en renders English text
  ✓ ?lang=ja renders Japanese text
  ✓ ?lang=zh renders Chinese text
  ✓ flag buttons update ?lang param
  ✓ hreflang tags present for all 4 languages
  ✓ JSON-LD inLanguage includes all 4

Palace page language switching
  ✓ building names change with lang param
  ✓ breadcrumb updates with lang
  ✓ count label updates with lang

Guide pages
  ✓ all 9 guide pages render in all 4 languages
  ✓ FAQSection renders correct language FAQ items
```

## Test Infrastructure Setup

### Package.json Additions

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "vitest": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@playwright/test": "^1.50.0",
    "vitest-environment-miniflare": "^2.14.0"
  }
}
```

### Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['node_modules', 'dist', '.astro'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**', 'src/pages/api/**'],
      exclude: ['src/lib/palace_data.json'],
    },
  },
});
```

### Playwright Config (`playwright.config.ts`)

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 1,
  workers: 2,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 4321,
    reuseExistingServer: true,
  },
});
```

### Mocking Strategy for D1

For testing `api/heritage.ts` without a real D1 database, mock the `locals.runtime.env.DB` binding:

```typescript
// test-utils.ts
export function createMockDb(results: any[]) {
  return {
    prepare: () => ({
      bind: (...args: any[]) => ({
        all: async () => ({ results, success: true }),
      }),
    }),
  };
}

// heritage.test.ts
import { createMockDb } from './test-utils';

const mockDb = createMockDb([
  { id: 1, name_kr: '경복궁', name_hanja: '景福宮', ... }
]);
```

### Mocking Strategy for Fetch (API Proxy Tests)

```typescript
// narration.test.ts
import { vi } from 'vitest';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Test endpoint fallback
mockFetch
  .mockRejectedValueOnce(new Error('First endpoint down'))
  .mockResolvedValueOnce(new Response('<items><item>...</item></items>', {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  }));
```

## Test File Organization

```
src/
├── lib/
│   ├── api.test.ts
│   ├── api.ts
│   ├── landmarks.test.ts
│   ├── landmarks.ts
│   └── palace_data.json
├── pages/
│   ├── api/
│   │   ├── heritage.test.ts
│   │   ├── heritage.ts
│   │   ├── events.test.ts
│   │   ├── events.ts
│   │   ├── narration.test.ts
│   │   └── narration.ts
│   └── sitemap.xml.test.ts
└── components/
    ├── DancheongCard.test.ts
    ├── FAQSection.test.ts
    ├── TimeSlider.test.ts
    ├── AudioGuide.test.ts
    └── BreadcrumbNav.test.ts
e2e/
├── language.spec.ts
├── homepage.spec.ts
├── palace-detail.spec.ts
├── kpop-demon-hunters.spec.ts
├── guide-pages.spec.ts
└── accessibility.spec.ts
```

## CI Pipeline Skeleton (`.github/workflows/test.yml`)

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm test                       # Vitest unit + integration
      - run: npx playwright install         # Browser dependencies
      - run: npm run test:e2e               # Playwright E2E
```

## Coverage Goals

| Area | Current | Target |
|------|---------|--------|
| `src/lib/api.ts` | 0% | 90%+ |
| `src/lib/landmarks.ts` | 0% | 95%+ |
| `src/pages/api/heritage.ts` | 0% | 85%+ |
| `src/pages/api/events.ts` | 0% | 80%+ |
| `src/pages/api/narration.ts` | 0% | 85%+ |
| Components (interactive) | 0% | 70%+ |
| Overall | 0% | 80%+ |

---

*Testing analysis: 2026-07-01*
