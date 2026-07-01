# Technology Stack

**Analysis Date:** 2026-07-01

## Languages

**Primary:**
- TypeScript (strict mode via `astro/tsconfigs/strict`) — All backend API routes, data fetching, and component scripts
- Astro — Template/component language (`.astro` files), used for all pages, layouts, and UI components

**Secondary:**
- JavaScript (ESM) — Inline `<script>` blocks in components (GSAP, Google Translate, custom cursor, theme toggle)
- SQL — D1 schema in `schema.sql`, DDL for 5 tables with indexes
- CSS — 1260-line `src/styles/global.css` with custom properties, animations, responsive design
- XML — Parsing KHS OpenAPI responses in API routes and `scripts/collect.mjs`
- JSON — Static data store (`src/lib/palace_data.json`) and data pipeline output

**Support Scripts:**
- Node.js (ESM `.mjs`) — 6 scripts under `scripts/` for data collection, AI image generation, and DB seeding

## Runtime

**Environment:**
- **Cloudflare Workers** via `@astrojs/cloudflare` adapter (output: `server`)
  - Compatibility date: `2026-02-16`
  - Compatibility flags: `nodejs_compat`, `global_fetch_strictly_public`
  - Worker name: `heritage`
  - Custom domain: `heritage.aikorea24.kr`
  - Entry point: `dist/_worker.js/index.js` (Astro build output)

**Package Manager:**
- npm (lockfile: `package-lock.json` present)
- ESM mode (`"type": "module"` in `package.json`)

**Node.js:**
- Runtime for scripts and Astro dev/build toolchain
- Uses `dotenv` and `dotenv-expand` v13 for environment variable loading

## Frameworks

**Core:**
- **Astro 5.17.1** — Static site generation / server-side rendering framework
  - SSR mode via `@astrojs/cloudflare` adapter
  - Config: `astro.config.mjs`, site: `https://heritage.aikorea24.kr`
  - File-based routing in `src/pages/`
  - Component model: `.astro` files with frontmatter (server) + HTML template + scoped CSS + client scripts

**CSS Framework:**
- None — Pure custom CSS with CSS custom properties (Dancheong Neon palette)
- Design system: glassmorphism, bento grid, kinetic typography, neon glow effects
- 1260 lines of global CSS with no external CSS framework dependency

**Animation:**
- **GSAP 3.12.5** (GreenSock Animation Platform) — Loaded from CDN (`https://unpkg.com/gsap@3.12.5/dist/gsap.min.js`)
- **ScrollTrigger 3.12.5** — GSAP plugin for scroll-driven animations (hero parallax, reveal animations, stagger effects)
- CSS scroll-driven animations (`animation-timeline: view()`) for minhwa reveal section
- CSS keyframe animations for floating particles, shimmer text, ambient orbs, gradient rotation
- `prefers-reduced-motion: reduce` media query to disable all animations

**Maps:**
- **MapLibre GL JS 4.7.1** — Interactive map in `MapExplore.astro` (682 lines)
  - Tiles from OpenFreeMap (free, no API key required)
  - Geolocation API for user location, Haversine distance calculation
  - Custom markers, bottom sheet UI

**Fonts:**
- Pretendard — Korean/body text (`https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css`)
- Noto Serif KR — Korean/English headings (Google Fonts)
- Cormorant Garamond — English headings (Google Fonts)
- Gmarket Sans — Bold/display text (Google Fonts)
- Space Grotesk — Modern English text (Google Fonts)

**Testing:**
- Not detected — No test framework, test files, or test configuration found

## Key Dependencies

**Critical:**
| Package | Version | Purpose |
|---------|---------|---------|
| `astro` | ^5.17.1 | Core framework |
| `@astrojs/cloudflare` | ^12.6.12 | Cloudflare Workers adapter (SSR) |

**Infrastructure:**
| Package | Version | Purpose |
|---------|---------|---------|
| `dotenv-expand` | ^13.0.0 | Environment variable expansion for scripts |
| `dotenv` | (indirect) | Loading `.env` files in scripts |
| `@huggingface/inference` | (via API) | AI image generation (FLUX.1-schnell) |

**Build-time only (scripts):**
| Tool | Purpose |
|------|---------|
| ImageMagick `convert` | WebP conversion + 3-step resizing (375/768/1200) |
| `sharp-cli` | Fallback image processor |
| `wrangler` | D1 database seeding, Cloudflare deployment |

## Configuration

**Framework:**
- `astro.config.mjs` — Output: server, adapter: cloudflare(), site URL
- `tsconfig.json` — Extends `astro/tsconfigs/strict`, includes `.astro/types.d.ts`

**Cloudflare:**
- `wrangler.jsonc` — Worker name, compatibility date/flags, D1 binding (DB → `heritage-db`), assets binding, custom domain routing, observability

**Environment:**
- `.env` (gitignored) — Local development variables
- `~/.env.common` (system-level) — Shared environment variables (HF_TOKEN, DATA_GO_KR_API_KEY)
- `scripts/generate-ai-images.mjs` loads both locations sequentially
- Required env vars: `HF_TOKEN`, `DATA_GO_KR_API_KEY`

**Database:**
- `schema.sql` — DDL for 5 D1 tables with indexes
- D1 database ID: `b4f2264e-d032-442b-a260-48b7ffd99414`
- Binding name: `DB`

**Build:**
- Astro build output directory: `dist/`
- Generated types: `.astro/` (gitignored)
- `.wrangler/` (gitignored, wrangler metadata)

## Platform Requirements

**Development:**
- Node.js runtime
- npm package manager
- Cloudflare account for D1 and Workers
- wrangler CLI (v4+, via npm or standalone)
- Hugging Face account with HF token for AI image generation
- Korea Data Portal API key (`DATA_GO_KR_API_KEY`) for image collection

**Production:**
- **Deployment target:** Cloudflare Workers (edge runtime)
- **Database:** Cloudflare D1 (`heritage-db`)
- **Custom domain:** `heritage.aikorea24.kr` (Cloudflare-managed)
- **Observability:** Cloudflare Workers observability (enabled in `wrangler.jsonc`)
- **CI/CD:** Not detected — no CI configuration files found

## Data Pipeline

**Collection:**
- `scripts/collect.mjs` — Fetches heritage data from KHS OpenAPI, stores as JSON with progress tracking
- `scripts/collect-tour-images.mjs` — Downloads tour photos via Korea Tour API PhotoGalleryService
- `scripts/generate-ai-images.mjs` — Generates AI images via Hugging Face FLUX.1-schnell

**Seeding:**
- `scripts/seed-d1.mjs` — Converts collected JSON to batch SQL files for D1
- `scripts/seed-direct.mjs` — Alternative seeding method (direct D1 API)

**Output:**
- `scripts/data/` — Collected JSON data (gitignored: `scripts/data/*.json`, `scripts/data/progress.json`)
- `scripts/data/sql/` — Generated SQL batch files (gitignored)
- `public/tour-images/` — Downloaded tour photos
- `public/images/generated/` — AI-generated images

---

*Stack analysis: 2026-07-01*
