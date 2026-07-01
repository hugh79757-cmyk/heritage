# External Integrations

**Analysis Date:** 2026-07-01

## APIs & External Services

### Korea Heritage Service (KHS) OpenAPI — Heritage Data

**Endpoints used:**
| Endpoint | Purpose | File |
|----------|---------|------|
| `selectEventListOpenapi.do` | Monthly events at palaces | `src/pages/api/events.ts` |
| `selectVoiceListOpenapi.do` | Narration/audio guide URLs | `src/pages/api/narration.ts` |

**Data flow:**
- `src/pages/api/events.ts` — GET proxy: forwards `page`/`count` params, fetches XML from `http://www.khs.go.kr/cha/openapi/selectEventListOpenapi.do`, parses `<item>` blocks into JSON, returns JSON response to client
- `src/pages/api/narration.ts` — GET proxy: accepts `kdcd`/`asno`/`ctcd`/`gbn` params, tries 2 endpoint variants (`selectVoiceListOpenapi.do` + `SearchVoiceOpenapi.do`), extracts `<narration_title>` and `<narration_url>`, returns JSON with audio URL array
- `scripts/collect.mjs` — Batch heritage data collection: fetches list + detail from multiple endpoints, stores as JSON files in `scripts/data/`

**Protocol:** HTTP GET, responses in XML format
**Auth:** None (public API)
**Failure mode:**
- `events.ts`: Returns `{ error: "API {status}" }` with HTTP 502 on non-ok response, `{ error: message }` with HTTP 500 on exception
- `narration.ts`: Tries 2 fallback endpoints; returns empty `{ items: [], count: 0 }` if both fail
- `collect.mjs`: Retry logic (3 retries with exponential backoff), progress saved to `progress.json` for resume capability

### Hugging Face Inference API — AI Image Generation

**Endpoint:**
- `https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell`

**Data flow:**
- `scripts/generate-ai-images.mjs` — Sends POST with prompt + parameters (width, height, num_inference_steps=4), receives PNG buffer
- Generates 5 images with "Joseon Dancheong x Neon" style prompts
- Post-processes: raw PNG → ImageMagick/Sharp → WebP at 3 sizes (375/768/1200)
- Output: `public/images/generated/{id}-{suffix}.webp`
- **Build-time only** — Never called at runtime

**Auth:** Bearer token via `HF_TOKEN` environment variable (loaded from `~/.env.common` or `.env`)
**Rate limiting:** 2-second delay between requests for free tier
**Failure mode:** Logs error to console, continues to next image; success/fail count reported at end

### Korea Tour API — Photo Gallery Service

**Endpoint:**
- `http://apis.data.go.kr/B551011/PhotoGalleryService1/gallerySearchList1`

**Data flow:**
- `scripts/collect-tour-images.mjs` — Searches by keyword (6 targets: 경복궁, 북촌한옥마을, etc.), downloads first matching image from `galWebImageUrl`
- Stores to `public/tour-images/{id}.jpg`
- **Build-time only** — Never called at runtime

**Auth:** Service key via `DATA_GO_KR_API_KEY` environment variable (query parameter `serviceKey`)
**Failure mode:** Logs error, continues to next target

### Google Analytics 4 (GA4)

**Tracking ID:** `G-HCV3PDCWQ5`
**Location:** `src/layouts/Layout.astro`, lines 24-31
**Protocol:** Client-side gtag.js, loaded from `https://www.googletagmanager.com/gtag/js?id=G-HCV3PDCWQ5`
**Implementation:** Async `<script>` tag in `<head>`, inline gtag config
**Failure mode:** Script fails to load → no analytics (no site functionality impact)

### Google AdSense

**Publisher ID:** `ca-pub-5938862195544185`
**Ad Slot ID:** `4797390169`
**Location:** `src/layouts/Layout.astro`, line 84 (script tag) + `src/pages/index.astro`, lines 256-263 (ad unit)
**Implementation:** Async script in `<head>`, `adsbygoogle` `<ins>` tag in homepage with in-article fluid format
**Failure mode:** Ad script fails → blank ad space (no site functionality impact)

### Google Translate

**Implementation:** `src/layouts/Layout.astro`, lines 377-402
**Service:** `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`
**Included languages:** en, ja, zh-CN, zh-TW, es, fr, de, pt, ru, ar, th, vi, id, ms, hi, it, nl, pl, tr, sv, uk
**UI:** Toggleable banner with horizontal layout, close button, lazy-loaded on first toggle
**Failure mode:** Script fails to load → translate banner silently hidden

### MapLibre GL JS + OpenFreeMap Tiles

**Library:** MapLibre GL JS v4.7.1
**Tiles:** OpenFreeMap (free tile server, no API key)
**Location:** `src/components/MapExplore.astro` (682 lines)
**Features:** Geolocation, marker clustering, radius filtering, bottom sheet details
**Failure mode:** Map fails to load → section shows blank map area; `AbortController.timeout(15000)` for geolocation; no-op if `document.getElementById('map')` not found

### Google Fonts + jsDelivr CDN

**Fonts loaded:**
- Pretendard from `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css`
- Noto Serif KR, Cormorant Garamond, Gmarket Sans, Space Grotesk from `https://fonts.googleapis.com`

**Preconnects:** `cdn.jsdelivr.net`, `fonts.googleapis.com`, `fonts.gstatic.com`, `unpkg.com` (in `Layout.astro`, lines 42-45)

### flagcdn.com — Language Flags

**Usage:** `https://flagcdn.com/w80/{kr,us,jp,cn}.png` for language selector flag icons
**Location:** `src/layouts/Layout.astro`, lines 147-150

### Pinterest Domain Verification

**Meta tag:** `<meta name="p:domain_verify" content="a2f1f9d5f2c18d423c1d99f6c2d0247b" />`
**Location:** `src/layouts/Layout.astro`, line 66

### Google Search Console

**Meta tag:** `<meta name="google-site-verification" content="kpr0gRmGKIFUW5dNLsfxba1aKpbV7wolSFk6cSOJZXA" />`
**Location:** `src/layouts/Layout.astro`, line 82

### Naver Search Advisor

**Meta tag:** `<meta name="naver-site-verification" content="fa2baf09d65dfb84a55787b8740941430187b234" />`
**Location:** `src/layouts/Layout.astro`, line 83

## Data Storage

### Cloudflare D1 Database

**Binding:** `DB` (defined in `wrangler.jsonc`)
**Database name:** `heritage-db`
**Database ID:** `b4f2264e-d032-442b-a260-48b7ffd99414`

**Tables (defined in `schema.sql`):**
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `palaces` | Palace metadata (5 rows) | id, gung_number, name_*, desc_*, lat, lng |
| `buildings` | Building list per palace | gung_number, serial_number, detail_code, name_*, image_url |
| `building_details` | Detailed explanations per building | gung_number, serial_number, detail_code, explanation_* |
| `images` | Image gallery per building | gung_number, serial_number, detail_code, image_url |
| `movies` | Video URLs per building | gung_number, serial_number, detail_code, url_* |

**Access patterns:**
- `src/pages/api/heritage.ts` — Spatial query: bounding box + Haversine approximation
  ```sql
  SELECT ... FROM heritage_index WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?
  ```
- `src/lib/api.ts` — JSON data file fallback (reads `palace_data.json` directly, no D1 usage for palace content pages)
- D1 is used ONLY by the `/api/heritage` route for nearby-heritage geospatial queries

**Failure mode:** D1 query failure → API returns `{ items: [], count: 0 }` or HTTP 500

### Local JSON Data Store

**File:** `src/lib/palace_data.json` (git-committed)
**Role:** Primary data source for palace building content (name, description, images, videos)
**Usage:** `src/lib/api.ts` imports directly, provides `fetchPalaceList()` and `fetchBuildingDetail()` functions
**Schema:** Object keyed by `gungNumber` (string), each containing array of building objects
**Failure mode:** Static file — always available; import error would be a build-time failure

### Cloudflare Assets Binding

**Binding:** `ASSETS` (defined in `wrangler.jsonc`)
**Directory:** `./dist`
**Role:** Serves static files (images, fonts, compiled CSS) at runtime
**Connection:** `env.D1Database` accessed via `locals.runtime.env.DB` in Astro API routes

## Authentication

**Auth Provider:** None (no user authentication — public site)
**Search engine verification:** Meta tags for Google (search console), Naver (search advisor), Pinterest (domain verify)
**API authentication:**
- Hugging Face: Bearer token (`HF_TOKEN`)
- Korea Tour API: Query parameter API key (`DATA_GO_KR_API_KEY`)

## Secrets & Environment Configuration

**Required env vars:**
| Variable | Purpose | Used In |
|----------|---------|---------|
| `HF_TOKEN` | Hugging Face API auth | `scripts/generate-ai-images.mjs` |
| `DATA_GO_KR_API_KEY` | Korea Tour API service key | `scripts/collect-tour-images.mjs` |

**Loading order:**
1. `~/.env.common` (system-level shared secrets)
2. `.env` (project-local overrides)

**Files not committed:**
- `.env` (gitignored)
- `.env.production` (gitignored)
- `scripts/data/*.json` (gitignored — regenerable)

## Internal Integrations

### Astro SSR → API Routes

**Pattern:** Astro file-based routing (`src/pages/api/*.ts`) creates Workers endpoints
**Routes:**
| Route | Method | Purpose | Backend |
|-------|--------|---------|---------|
| `/api/events` | GET | KHS monthly events (proxy) | KHS OpenAPI XML → JSON |
| `/api/heritage` | GET | Nearby heritage (geospatial) | D1 SQL query |
| `/api/narration` | GET | Audio narration URLs (proxy) | KHS Voice API XML → JSON |

### Astro SSR → D1

**Connection chain:**
```
Client → Astro SSR Worker → locals.runtime.env.DB → D1 SQLite
```
**Type definitions:** `src/env.d.ts` declares `DB: D1Database` and `ASSETS: { fetch }` on `App.Locals`

### Static Data Flow

**For palace content pages** (no D1 dependency):
```
src/lib/palace_data.json (imported) → src/lib/api.ts (fetchPalaceList/fetchBuildingDetail) → pages
```
**For homepage** (palace metadata):
```
src/lib/api.ts (PALACES constant, hardcoded) → src/pages/index.astro
```

### CI/CD & Deployment

**Hosting:** Cloudflare Workers (edge) via `@astrojs/cloudflare` adapter
**Build command:** `astro build` (outputs to `dist/`)
**Deployment:** wrangler CLI (manual, no CI detected)
**Domain:** `heritage.aikorea24.kr` (custom domain, Cloudflare-managed)

### SEO & Structured Data

**Sitemap:** `/sitemap.xml` — Dynamic XML generated at `src/pages/sitemap.xml.ts`
  - Covers homepage, KDH page, guide pages (10), palace listing, building detail pages
  - 4 language variants per page
  - Priorities: 1.0 (home, KDH) → 0.9 (guides) → 0.8 (palaces) → 0.7 (building details)

**Structured data:**
- `src/pages/index.astro` — `WebSite` schema in JSON-LD
- `src/components/BreadcrumbNav.astro` — `BreadcrumbList` schema
- `src/components/FAQSection.astro` — `FAQPage` schema

**robots.txt:** (`public/robots.txt`)
```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://heritage.aikorea24.kr/sitemap.xml
```

### Webhooks & Callbacks

**Incoming:** None
**Outgoing:** None

---

*Integration audit: 2026-07-01*
