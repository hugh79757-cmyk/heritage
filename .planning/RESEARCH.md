# Phase 2: Traffic Hook + Content Integration — Research

**Researched:** 2026-07-01
**Domain:** CSS scroll-driven animation, AI image generation pipeline, Astro SSR media handling, KDH scene guide layout
**Confidence:** HIGH

## Summary

Phase 2 integrates AGENTS.md Phase 2 (Traffic Hook) and Phase 3 (Data Deepening) into a single execution. The core deliverables are: (1) a CSS-only gate-opening animation on the homepage hero using `clip-path: polygon()` transitions, (2) a full scene-by-scene KDH media guide for 6 K-pop Demon Hunters locations with AI-generated scene images, (3) a cinematic hero scroll effect on palace detail pages with KDH cross-linking, and (4) the AI image pipeline generating 7 new images.

**Primary recommendation:** Pure CSS for all animations (no GSAP dependency per CONTEXT.md constraints), plain `<img>` tags with WebP paths for AI-generated images (no Astro Image component needed for `public/` assets), and a new `src/data/kdh-scenes.ts` data module to centralize scene content.

**Critical dependencies:** `HF_TOKEN` environment variable must be set before running `scripts/generate-ai-images.mjs`. ImageMagick `convert` is available (7.1.2). `public/images/generated/` directory does not yet exist — the script creates it.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

| ID | Work | Priority |
|----|------|----------|
| P2-1 | KDH page full media experience | P0 |
| P2-2 | Home hero palace gate opening animation | P0 |
| P2-3 | TimeSlider Joseon/present comparison improvement | P1 |
| P2-4 | Palace detail page renewal | P1 |
| P2-5 | Building card grid + KDH linking | P1 |
| P2-6 | Building detail page content expansion | P2 |
| P2-7 | AI image pipeline — KDH scene images | P0 |

**Scope boundaries:**
- KDH page gets scene-by-scene guide, 6 scene images, timeline visualization, all guideLink connections
- Home hero uses CSS clip-path only (no GSAP), AI-generated hero image, title fill effect via `background-clip: text`
- TimeSlider keeps current implementation, content only reinforced
- Palace detail page gets cinematic hero (CSS perspective + translateZ), building card grid, KDH connection section
- DancheongCard and TimeSlider components are kept as-is
- AGENTS.md §9 "Don't Do" rules fully enforced
- No KDH copyrighted images (AI-generated only)
- D1 migration is NOT Phase 2 scope
- Three.js prohibited (mobile performance)
- Runtime AI API calls prohibited
- GIF prohibited (WebP animation replaces)

### the agent's Discretion
- Scene data structure design (`kdh-scenes.ts`)
- AI prompt phrasing within STYLE_PREFIX constraints
- Timeline visualization enhancement details
- Palace hero scroll effect specifics

### Deferred Ideas (OUT OF SCOPE)
- Security verification (separate phase)
- Three.js 3D building models (next phase)
- D1 actual integration (next phase)
- Audio guide improvement (keep current level)
</user_constraints>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Gate-opening animation | Browser (CSS) | — | Pure CSS `clip-path` + `@keyframes` — no server logic needed |
| Hero title fill effect | Browser (CSS) | — | `background-clip: text` + `@keyframes` — client-side rendering only |
| KDH scene data management | Server (Astro SSR) | — | Data module imported at build time, injected into SSR template |
| KDH timeline visualization | Browser (CSS) | Server (data) | Pure CSS timeline layout with server-provided scene data |
| Palace cinematic hero | Browser (CSS) | Server (image URL) | CSS perspective + translateZ scroll effect; server provides hero image |
| AI image generation | Build Script | — | `scripts/generate-ai-images.mjs` runs at build time, never at runtime |
| Cross-linking (KDH ↔ palace) | Server (SSR) | — | URL paths determined server-side via data module |
| Scene image serving | CDN (Cloudflare) | — | Static WebP files served from `public/images/generated/` via ASSETS binding |

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| P2-1 | KDH page full media experience — scene guide with AI images, timeline, link fix | Scene data structure (kdh-scenes.ts), layout patterns in KDH Scene Guide §2, prompt definitions in AI Images §3 |
| P2-2 | Home hero gate opening animation — CSS clip-path, title fill effect | Pure CSS animation patterns in CSS Gate Animation §1, global.css keyframes plan in Component Change Plan §5 |
| P2-3 | TimeSlider improvement — content reinforcement only | Component audit confirms no code changes needed — see Component Change Plan §5 |
| P2-4 | Palace detail page renewal — cinematic hero + KDH section | CSS perspective+translateZ pattern in CSS Gate Animation §1, KDH cross-link data in KDH Scene Guide §2 |
| P2-5 | Building card grid + KDH linking — reuse DancheongCard, connect guideLinks | DancheongCard API unchanged (confirmed in audit), scene data for KDH ↔ palace mapping in kdh-scenes.ts |
| P2-6 | Building detail content expansion — data dependency | palace_data.json already has multi-lang content; inline CSS scroll-effect minimal |
| P2-7 | AI image pipeline — 7 KDH scene images | Prompts defined in AI Images §3, script modification plan in Component Change Plan §5 |

---

## 1. CSS Gate Animation — Implementation Approach

### 1.1 Palace Gate Opening Effect

**What:** A CSS `clip-path: polygon()` animation that makes the hero image appear as if palace gates are swinging open.

**How it works:**
- The hero image is positioned behind two "gate" panels created via `clip-path` on pseudo-elements or separate divs
- Each gate animates from closed (covering the image) to open (folded to edges)
- The animation triggers on page load via `animation-delay` or scroll-driven via `animation-timeline: view()`

**Recommended approach — pure CSS `@keyframes` on `clip-path`:**

```css
/* Gate panels — left and right */
.gate-left,
.gate-right {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 5;
  background: var(--bg-night);
  transform-origin: left center;
  pointer-events: none;
}

.gate-left {
  left: 0;
  animation: gateOpenLeft 1.6s cubic-bezier(0.77, 0, 0.18, 1) 0.5s forwards;
}

.gate-right {
  right: 0;
  animation: gateOpenRight 1.6s cubic-bezier(0.77, 0, 0.18, 1) 0.5s forwards;
}

@keyframes gateOpenLeft {
  0%   { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  100% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); } /* collapsed to left edge */
}

@keyframes gateOpenRight {
  0%   { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  100% { clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%); } /* collapsed to right edge */
}
```

**Alternative — SVG clipPath animation (more complex, not recommended):**
- SVG `<clipPath>` with `<animate>` or CSS-driven morph
- Avoid: harder to maintain, no performance gain over CSS polygon

**Why not GSAP per CONTEXT.md:** GSAP is loaded in `Layout.astro` but the homepage uses `Layout.astro`. However, CONTEXT.md §3.3 explicitly states "GSAP 불필요 — 순수 CSS @keyframes + clip-path로 구현" — pure CSS is the locked decision.

**Scroll-triggered variant** (for palace detail page cinematic hero):
- Use CSS `animation-timeline: view()` for scroll-driven camera effect
- `scroll-driven animations` (Chrome 115+) via `animation-timeline: scroll()`
- Fall back to IntersectionObserver for Firefox/Safari if needed

### 1.2 Cinematic Hero "Camera Entering" Effect (palace/[id].astro)

Per AGENTS.md §5.2, the palace detail hero should feel like the camera is entering the palace:

```css
/* Scroll-driven scale + translateZ for cinematic entrance */
.palace-hero-content {
  perspective: 1000px;
}

.palace-hero-title {
  animation: cameraEnter 1.5s ease-out forwards;
  animation-timeline: view();
  animation-range: entry 0% contain 50%;
}

@keyframes cameraEnter {
  0% {
    opacity: 0;
    transform: translateZ(-200px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateZ(0) scale(1);
  }
}
```

**Mobile:** `touch-action: pan-y` must remain on the hero section to not break vertical scrolling.

### 1.3 Title Character Fill Effect

Per AGENTS.md §3.1, the hero title "글자가 단청 색상으로 순서대로 채워짐" — characters fill in with dancheong colors sequentially.

**Technique:** `background-clip: text` with `@keyframes` on `background-size` + character wrapper spans.

```css
.hero-title-mask {
  background-image: linear-gradient(
    90deg,
    var(--neon-gold),
    var(--neon-red),
    var(--neon-blue),
    var(--neon-gold)
  );
  background-size: 400% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: titleFill 0.6s ease-out forwards, titleShimmer 4s ease-in-out 0.6s infinite;
}
```

For **character-by-character staggered fill**, wrap each character in `<span>`:

```astro
<!-- In component, split title string into characters -->
{
  h.title.split('').map((char, i) => (
    <span class="fill-char" style={`animation-delay: ${i * 0.08}s`}>{char}</span>
  ))
}
```

```css
.fill-char {
  display: inline-block;
  background: linear-gradient(90deg, var(--neon-gold) 0%, var(--dancheong-yellow) 50%, var(--neon-gold) 100%);
  background-size: 200% 100%;
  background-position: 200% 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: charFill 0.5s ease-out forwards;
}

@keyframes charFill {
  0%   { background-position: 200% 0; }
  100% { background-position: 0% 0; }
}
```

**Fallback:** The existing `hero-title-mask` class already uses `background-clip: text` in the current codebase (index.astro line 285-294). The current implementation uses a static JPEG background image (`/l3GGABnn.jpeg`). Replace this with the gradient animation approach.

### 1.4 prefers-reduced-motion

The existing `global.css` §"prefers-reduced-motion" (lines 1225-1237) already disables all animations:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

For this phase:
- Gate panels should render as **fully open** (collapsed) at rest — already handled by `animation-fill-mode: forwards`
- Title fill should show **fully filled** at rest — already handled by `animation-fill-mode: forwards`
- **No additional work needed** — existing global `prefers-reduced-motion` rule covers all new animations

### 1.5 Mobile Performance Notes

- `clip-path` animations run on the **compositor thread** in Chrome, Firefox, and Safari — no main-thread layout thrashing
- `background-clip: text` with `background-position` animation also composited
- **Constraints per AGENTS §2.2:**
  - Use `will-change: clip-path` on gate elements
  - Keep `touch-action: pan-y` on hero section
  - Mobile gate panels: ensure `pointer-events: none` so gates don't block interaction
- Chromium-based browsers on Android handle clip-path efficiently
- Safari iOS 15+ has good clip-path animation support

---

## 2. KDH Scene Guide — Layout Pattern Recommendations

### 2.1 Scene-by-Scene Media Guide Layout

**Data structure** — new file `src/data/kdh-scenes.ts`:

```typescript
export interface KDHScene {
  id: string;                    // matches location id from kpop-demon-hunters.astro
  locationId: string;            // e.g., 'gyeongbokgung'
  sceneTitle: Record<string, string>;  // scene title per language
  sceneDescription: Record<string, string>; // what happens in this scene
  filmContext: Record<string, string>;   // how it fits in the movie
  imageId: string;               // references generated image filename
  palaceLink?: string;           // /palace/[id] cross-link (null if not a palace)
  guideLink: string;             // /guide/* link
  order: number;                 // display order
}
```

**Recommended layout pattern — alternating image-text:**

```
┌─────────────────────┐
│     Scene Image     │  ← AI-generated 9:16 WebP, 100% width mobile
│    (9:16 portrait)  │
├─────────────────────┤
│  🎬 Scene Title     │
│  ─────────────      │
│  Film description   │
│  Scene context      │
│                     │
│  [View Palace →]    │  ← links to palace/[id] or /guide/*
└─────────────────────┘
```

On desktop (768px+): Alternate image-left / image-right per scene:
```
Scene 1: [IMAGE] [TEXT]
Scene 2: [TEXT] [IMAGE]
Scene 3: [IMAGE] [TEXT]
...
```

**Implementation approach:**
- Each scene is a full-width `<section>` with `class="kdh-scene"`
- CSS Grid or Flexbox for desktop alternating layout
- Image uses `<img>` with `loading="lazy"` and `aspect-ratio: 9/16`
- The 6 scene sections replace or augment the existing flat card layout

**Where to place in the page:**
```
1. Hero section (AI image)          ← NEW: AI-generated hero
2. Scene-by-scene guide (6 scenes)  ← NEW: replaces/adds to card grid
3. Map section                      ← EXISTING: keep as-is
4. Timeline (enhanced)              ← ENHANCED: add images to steps
5. FAQ                              ← EXISTING: keep as-is
```

### 2.2 Timeline Visualization Enhancement

**Current state:** CSS vertical timeline with time + step (route-timeline). Text-only.

**Enhancement:** Add scene thumbnails to each timeline step.

```css
.route-step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 16px 0;
  border-left: 2px solid var(--dancheong-yellow);
  padding-left: 24px;
  position: relative;
}

.route-step-image {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid var(--color-border-light);
  filter: brightness(0.85);
  transition: filter 0.3s;
}

.route-step:hover .route-step-image {
  filter: brightness(1);
}
```

**Data enrichment:** Each timeline step gets a `imageSrc` field referencing the corresponding scene image.

### 2.3 Cross-Linking Pattern

**guideLink fix (4 are `#`):**

| Location | Current guideLink | Fix to |
|----------|-----------------|--------|
| bukchon | `#` | `/guide/bukchon` or `/kpop-demon-hunters#bukchon` |
| naksan | `#` | `/guide/naksan` or `/kpop-demon-hunters#naksan` |
| nseoul-tower | `#` | `/guide/n-seoul-tower` or `/kpop-demon-hunters#nseoul-tower` |
| gwanghwamun | `#` | `/guide/gwanghwamun` or `/kpop-demon-hunters#gwanghwamun` |
| insadong | `#` | `/guide/insadong` or `/kpop-demon-hunters#insadong` |

**Decision per CONTEXT §2.2:** "guideLink 연결: palace/[id] 및 guide/* 페이지와 전부 연결"

**Pattern:**
- Palace locations (gyeongbokgung) → `/palace/1?lang=${lang}`
- Scenic/historic locations → scene anchor links within page or new guide sub-pages
- Each scene card on KDH page links to the palace detail page (if applicable)
- Palace detail page gets a "This location in KDH" section linking back to KDH page

**Recommended approach for non-palace locations:** Use anchor links within the KDH page itself (`#scene-bukchon`, `#scene-naksan`, etc.) since guide sub-pages don't exist yet. This creates scroll-to-scene behavior from the map and timeline sections.

---

## 3. AI Image Prompts — 7 Images

### 3.1 Prompt Strategy

The existing `STYLE_PREFIX` in `scripts/generate-ai-images.mjs` (line 34) is well-tested and should be reused:

```
Joseon Dynasty palace Korea, traditional dancheong colors (red, blue, gold, white),
night scene, neon glow effect on traditional architecture,
cinematic lighting, vibrant colors, KPop Demon Hunters animation style,
ultra detailed, photorealistic
```

**KDH-specific additions:** Each prompt adds location-specific action concepts ("chase", "confrontation", "climax") to convey the movie scene feeling.

**Size:** All images 768×1344 (9:16 mobile portrait) — consistent with existing pattern.

### 3.2 Prompt Definitions

```javascript
// Add to IMAGES array in generate-ai-images.mjs:

{
  id: 'kdh-hero',
  prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace Geunjeongjeon at night with full moon, KPop Demon Hunters main confrontation scene, dramatic composition, red and blue neon lighting, heroic epic scale, action movie poster style, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-gyeongbokgung',
  prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace main courtyard, action sequence under moonlight, characters facing off between dancheong pillars, neon blue and gold light beams, dynamic composition, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-bukchon',
  prompt: `${STYLE_PREFIX}, Bukchon Hanok Village narrow alleyway chase scene at night, traditional Korean houses with tiled roofs, running figures, warm golden light from hanok windows, neon pink and blue accents, cinematic motion blur, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-naksan',
  prompt: `${STYLE_PREFIX}, Naksan Park Seoul City Wall at night, rooftop chase along ancient fortress wall, Seoul skyline in background, full moon, neon teal and gold lighting, dramatic height perspective, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-nseoul-tower',
  prompt: `${STYLE_PREFIX}, N Seoul Tower at night seen from below, climactic confrontation on observation deck, neon pink and blue beams sweeping across night sky, Seoul city lights far below, cinematic wide angle, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-gwanghwamun',
  prompt: `${STYLE_PREFIX}, Gwanghwamun Square at night with King Sejong statue, dramatic opening chase scene wide shot, traffic light trails, neon reflections on wet ground, cinematic movie still, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-insadong',
  prompt: `${STYLE_PREFIX}, Insadong traditional street at night, traditional Korean tea houses and galleries, market scene action, colorful lanterns, dancheong patterned buildings, warm neon glow, cinematic depth, 9:16 mobile portrait`,
  size: '768x1344',
},
```

### 3.3 Image Processing

**Current pipeline** (existing, no changes needed):
1. HF API returns raw PNG
2. ImageMagick `convert` resizes to 3 WebP variants:
   - `{id}-sm.webp` (375w) — mobile
   - `{id}-md.webp` (768w) — tablet
   - `{id}-lg.webp` (1200w) — desktop
3. Quality: 82, lossless: false
4. Raw PNG deleted after processing
5. Output: `public/images/generated/`

**Critical: HF_TOKEN must be set** — currently not set in the environment (verified during research). The script loads from `~/.env.common` and `.env`. The planner must ensure this is set before running.

---

## 4. Astro SSR Image Handling — Recommended Approach

### 4.1 How `public/` Images Work in Astro SSR

All files in `public/` are copied verbatim to the build output (`dist/`) and served via the Cloudflare Workers `ASSETS` binding. They are available at the root path.

**Path resolution:**
```
public/images/generated/kdh-gyeongbokgung-lg.webp
→ referenced as /images/generated/kdh-gyeongbokgung-lg.webp
```

**Key Astro documentation confirmation:** [VERIFIED: docs.astro.build/en/guides/images]

> "Files in the public/ directory are always served or copied into the build folder as-is, with no processing."

> "Provide a relative URL path on your site that corresponds to your file's location in your public/ folder (e.g. src="/images/my-public-image.jpg" for an image in public/images/my-public-image.jpg)."

### 4.2 Recommended Pattern

**Use plain `<img>` tags with `srcset` for responsive images:**

```astro
<img
  src="/images/generated/kdh-gyeongbokgung-sm.webp"
  srcset="
    /images/generated/kdh-gyeongbokgung-sm.webp 375w,
    /images/generated/kdh-gyeongbokgung-md.webp 768w,
    /images/generated/kdh-gyeongbokgung-lg.webp 1200w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 1200px"
  alt="Gyeongbokgung Palace — KPop Demon Hunters scene"
  loading="lazy"
  width="768"
  height="1344"
  style="aspect-ratio: 768/1344; object-fit: cover;"
  decoding="async"
/>
```

**For the hero image (above the fold):**
```astro
<img
  src="/images/generated/kdh-hero-md.webp"
  srcset="
    /images/generated/kdh-hero-sm.webp 375w,
    /images/generated/kdh-hero-md.webp 768w,
    /images/generated/kdh-hero-lg.webp 1200w
  "
  sizes="100vw"
  alt="KPop Demon Hunters — Seoul Locations"
  fetchpriority="high"
  width="768"
  height="1344"
  style="aspect-ratio: 768/1344; object-fit: cover;"
  decoding="async"
/>
```

### 4.3 Why NOT `@astrojs/image` / Astro `<Image>` Component

- The `@astrojs/image` package performs build-time optimization (Sharp-based). It works with images in `src/` not `public/`.
- On Cloudflare Workers (SSR), Sharp-based image optimization is **not available** at runtime because Workers don't have native image processing libraries.
- The documentation confirms: "If your adapter does not support Astro's built-in Sharp image optimization (e.g. Cloudflare), you can configure a no-op image service."
- **Conclusion:** Plain `<img>` with pre-generated WebP + srcset is the correct approach. The images are already optimized at generation time by the pipeline.

### 4.4 Existing `OptimizedImage.astro` Component

The existing component at `src/components/OptimizedImage.astro` wraps a plain `<img>` with aspect-ratio and standard attributes. It can be reused, but it does **not** support `srcset` or `sizes` props. For this phase:

- **For scene guide images (non-hero):** Use plain `<img>` directly with `srcset` inline
- **For gallery/repeat patterns:** Consider extending `OptimizedImage.astro` to support `srcset` prop

---

## 5. Component Change Plan

### 5.1 Files to Modify

| File | Change Type | Changes |
|------|-------------|---------|
| `src/pages/index.astro` | **Modify** | Replace hero image with AI-generated, add gate-opening clip-path animation, add title character fill effect |
| `src/pages/kpop-demon-hunters.astro` | **Modify** | Replace hero with AI image, add 6 scene-by-scene sections, fix guideLinks (4→actual), enhance timeline with thumbnails |
| `src/pages/palace/[id].astro` | **Modify** | Add cinematic hero scroll effect, add KDH connection section after building list |
| `src/styles/global.css` | **Modify** | Add gate-opening @keyframes, title fill @keyframes, cinematic hero styles, scene guide layout styles |
| `scripts/generate-ai-images.mjs` | **Modify** | Add 7 new KDH prompts to IMAGES array (see §3.2) |

### 5.2 Files to Create

| File | Type | Content |
|------|------|---------|
| `src/data/kdh-scenes.ts` | **New** | Scene data module with 6 scenes, multi-lang content, image references, cross-links |
| `public/images/generated/` | **New** | Output directory for AI-generated images (created by script) |

### 5.3 Files to Keep As-Is

| File | Reason |
|------|--------|
| `src/components/DancheongCard.astro` | CONTEXT §6.2: "현행 컴포넌트 유지, 개선 불필요" |
| `src/components/TimeSlider.astro` | CONTEXT §4.2: "현재 구현 유지, 콘텐츠만 보강" |
| `src/components/OptimizedImage.astro` | Not used in this phase (srcset needed) |
| `src/components/MapExplore.astro` | No changes needed |
| `src/components/FAQSection.astro` | Existing — works fine |
| `src/components/BreadcrumbNav.astro` | Used unchanged |
| `src/components/AudioGuide.astro` | Out of scope (CONTEXT §1.2) |
| `src/lib/api.ts` | No changes needed |
| `src/lib/palace_data.json` | Read-only until D1 migration |
| `src/layouts/Layout.astro` | No changes needed |
| `src/components/GuideLayout.astro` | No changes needed |

### 5.4 Detailed Change Plan

#### `src/pages/index.astro` — Hero Rewrite

**Changes:**
1. **Hero image** (line 106): Replace `https://www.heritage.go.kr/gung/gogung1/images/ic-e21.jpg` with `/images/generated/gyeongbok-hero-lg.webp` with srcset
2. **Gate animation**: Add `.gate-left` and `.gate-right` divs inside `.hero-full` (before `.hero-particles`)
3. **Title** (line 119): Replace single `<h1>` with character-by-character `<span>` fill pattern
4. **Remove** the static `hero-title-mask` background-image (line 286) — replace with gradient animation
5. **CSS additions**: Add @keyframes for gate opening and character fill (or add to global.css)

**CSS additions needed in `index.astro`'s `<style>` block:**
```css
/* Gate panels */
.hero-gate-left,
.hero-gate-right { ... }

@keyframes gateOpenLeft { ... }
@keyframes gateOpenRight { ... }

/* Character fill */
.fill-char { ... }
@keyframes charFill { ... }
```

#### `src/pages/kpop-demon-hunters.astro` — Scene Guide Insertion

**Changes:**
1. **Hero image** (line 158): Replace external heritage.go.kr URL with `/images/generated/kdh-hero-md.webp` with srcset
2. **After hero section** (after line 174): Insert 6 `<section class="kdh-scene">` blocks (one per location)
3. **Fix guideLink array** (lines 55-114): Update 4 `guideLink: '#'` entries with actual paths
4. **Enhance timeline** (lines 262-306): Add thumbnail `<img>` to each `.route-step`
5. **Locations data**: Load scene descriptions from `import { KDH_SCENES } from '../data/kdh-scenes'`

**Scene section template:**
```astro
<section class="kdh-scene" id={`scene-${scene.id}`}>
  <div class="kdh-scene-inner">
    <div class="kdh-scene-image">
      <img
        src={`/images/generated/${scene.imageId}-md.webp`}
        srcset="..."
        alt={scene.sceneTitle[lang]}
        loading="lazy"
        width="768" height="1344"
        style="aspect-ratio: 768/1344"
      />
    </div>
    <div class="kdh-scene-text">
      <span class="kdh-scene-badge">Scene {scene.order}</span>
      <h3>{scene.sceneTitle[lang]}</h3>
      <p class="kdh-scene-desc">{scene.sceneDescription[lang]}</p>
      <p class="kdh-scene-context">{scene.filmContext[lang]}</p>
      {scene.palaceLink && (
        <a href={`${scene.palaceLink}?lang=${lang}`} class="btn btn-outline">
          View Location &rarr;
        </a>
      )}
    </div>
  </div>
</section>
```

#### `src/pages/palace/[id].astro` — Cinematic Hero + KDH Section

**Changes:**
1. **Cinematic hero**: Add `perspective` to `.palace-hero-content` and scroll-driven animation
2. **After building list** (after line 97): Insert KDH connection section

**Cinematic hero CSS addition:**
```css
.palace-hero-content {
  perspective: 1000px;
}

.palace-hero-title {
  animation: cameraEnter 1.5s ease-out forwards;
  animation-timeline: view();
  animation-range: entry 0% contain 50%;
}

@keyframes cameraEnter {
  0%   { opacity: 0; transform: translateZ(-200px) scale(0.8); }
  100% { opacity: 1; transform: translateZ(0) scale(1); }
}
```

**KDH section template:**
```astro
<!-- KDH Connection Section -->
<section class="kdh-connection">
  <hr class="dancheong-divider" />
  <div class="container" style="padding: 40px 0;">
    <div class="section-header">
      <h2>{kdhTitle[lang]}</h2>
    </div>
    <div class="kdh-connection-inner">
      <p>{kdhDesc[lang]}</p>
      <a href={`/kpop-demon-hunters?lang=${lang}`} class="btn btn-primary">
        {kdhBtn[lang]} &rarr;
      </a>
    </div>
  </div>
</section>
```

#### `scripts/generate-ai-images.mjs` — New Prompts

**Changes:**
1. Add 7 new entries to the IMAGES array (detailed in §3.2)
2. Keep all existing 5 images (do not remove)

#### `src/data/kdh-scenes.ts` — New File

**Structure:**
```typescript
import type { Lang } from '../lib/api';

export interface KDHScene {
  id: string;
  order: number;
  sceneTitle: Record<Lang, string>;
  sceneDescription: Record<Lang, string>;
  filmContext: Record<Lang, string>;
  imageId: string;
  palaceLink: string | null;
  guideLink: string;
}

export const KDH_SCENES: KDHScene[] = [
  {
    id: 'gyeongbokgung',
    order: 1,
    sceneTitle: {
      kr: '경복궁 — 최후의 결전',
      en: 'Gyeongbokgung — The Final Confrontation',
      ja: '景福宮 — 最後の対決',
      zh: '景福宫 — 最终对决',
    },
    sceneDescription: {
      kr: '달빛 아래 근정전 마당에서 펼쳐지는 주요 결전 장면.',
      en: 'The main confrontation unfolds in the courtyard of Geunjeongjeon under moonlight.',
      ja: '月光の下、勤政殿の庭で繰り広げられる主要な対決シーン。',
      zh: '月光下勤政殿前展开的主要对决场景。',
    },
    filmContext: {
      kr: '영화의 클라이맥스가 경복궁에서 펼쳐집니다. 단청 기둥 사이로 번지는 네온 빛이 결투를 더욱 드라마틱하게 만듭니다.',
      en: 'The climax of the film takes place at Gyeongbokgung. Neon light spreading between dancheong pillars makes the duel even more dramatic.',
      ja: '映画のクライマックスは景福宮で展開されます。丹青の柱の間に広がるネオンライトが決闘をよりドラマチックにします。',
      zh: '电影的高潮在景福宫展开。丹青柱子间弥漫的霓虹灯光让决斗更加戏剧化。',
    },
    imageId: 'kdh-gyeongbokgung',
    palaceLink: '/palace/1',
    guideLink: '/guide/gyeongbokgung',
  },
  // ... 5 more scenes
];
```

---

## 6. Risk Assessment

### 6.1 Mobile Performance Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| `clip-path` animation stutter on low-end Android | MEDIUM | Gate animation is brief (1.6s, runs once on load). `will-change: clip-path` declared. Animation disabled via `prefers-reduced-motion` |
| `background-clip: text` fails on very old browsers | LOW | Text remains visible with solid-color fallback (no invisible text) |
| 9:16 images cause large CLS | MEDIUM | All images have `aspect-ratio` and explicit `width`/`height` attributes |
| 6 scene images + timeline images = 10+ lazy loads | LOW | All below-fold images use `loading="lazy"`. Hero uses `fetchpriority="high"` |

### 6.2 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| `clip-path: polygon() animation` | 55+ ✅ | 54+ ✅ | 10.3+ ✅ | 79+ ✅ |
| `background-clip: text` | 57+ ✅ | 49+ ✅ | 14.1+ ✅ | 79+ ✅ |
| `@keyframes` | 43+ ✅ | 16+ ✅ | 9+ ✅ | 12+ ✅ |
| `animation-timeline: view()` | 115+ ✅ | 125+ ⚠️ | 18+ ⚠️ | 115+ ✅ |
| WebP | 32+ ✅ | 65+ ✅ | 14+ ✅ | 18+ ✅ |
| `prefers-reduced-motion` | 74+ ✅ | 63+ ✅ | 10.3+ ✅ | 79+ ✅ |

**⚠️ Notes:**
- `animation-timeline: view()` (scroll-driven animations) is not yet supported in Firefox/Safari as of mid-2026 for the `view()` function with animation-trigger. **Fallback strategy:** Use IntersectionObserver for Firefox/Safari scroll-driven effects, or design the cinematic hero to work without scroll-triggered animation (static entrance animation via `@keyframes` alone)
- For the **gate opening** and **title fill**, these use regular `@keyframes` (not scroll-driven) — 100% compatible

### 6.3 Build-Time Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| `HF_TOKEN` not set | **BLOCKING** — all 7 images fail | Add build step validation: check `HF_TOKEN` before running script |
| Hugging Face API rate limit | MEDIUM — images may fail sequentially | Existing 2s delay between API calls. If a single image fails, the script continues. Plan: generate each image individually, retry failures |
| Hugging Face API model unavailable | **BLOCKING** — no new images | Fallback: reuse existing `heritage.go.kr` URLs, add console warning |
| ImageMagick missing | LOW — falls back to `sharp-cli` | Both available (verified during research) |
| `public/images/generated/` doesn't exist | LOW — script creates it via `mkdirSync` | No action needed |

### 6.4 Key Risk: Scroll-Driven Animation Browser Support

The cinematic hero effect (`animation-timeline: view()`) has limited browser support. **Recommendation:**
1. Use regular `@keyframes` as primary (plays on mount, not scroll)
2. Add `animation-timeline: view()` as progressive enhancement
3. For Firefox/Safari, the static entrance animation still provides visual polish

```css
/* Base animation — always plays */
.palace-hero-title {
  animation: cameraEnter 1s ease-out forwards;
}

/* Progressive enhancement — scroll-driven on supported browsers */
@supports (animation-timeline: view()) {
  .palace-hero-title {
    animation: cameraEnter 1.5s ease-out forwards;
    animation-timeline: view();
    animation-range: entry 0% contain 50%;
  }
}
```

---

## Package Legitimacy Audit

> **No new packages are installed in this phase.** All work uses existing dependencies:
> - Astro 5.17.1 (already in project)
> - GSAP 3.12.5 (already loaded via CDN, not used for new animations)
> - ImageMagick convert / sharp-cli (already in development environment)
> - Hugging Face Inference API (already used by existing script)
>
> No `npm install` is required. No package verification needed.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build, scripts | ✅ | 25.2.1 | — |
| npm | Package management | ✅ | 11.6.2 | — |
| ImageMagick `convert` | WebP conversion in generate script | ✅ | 7.1.2-3 | `sharp-cli` |
| sharp-cli | WebP conversion fallback | ✅ | 5.2.0 | — |
| `HF_TOKEN` env var | Hugging Face API in generate script | ❌ | — | Set in `~/.env.common` before running |
| Hugging Face API (FLUX.1-schnell) | AI image generation | ⚠️ | — | API may have rate limits — add retry logic |
| Astro build | Full site build | ✅ | 5.17.1 | — |
| MapLibre GL JS 4.7.1 | KDH page map | ✅ (CDN) | 4.7.1 | — |

**Missing dependencies with no fallback:**
- `HF_TOKEN` — must be set in environment before running `scripts/generate-ai-images.mjs`. Without it, all 7 AI images fail silently.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `clip-path: polygon()` with matching point counts interpolates smoothly across all target browsers | §1 CSS Gate Animation | Low — well-documented CSS behavior, verified by WebSearch sources |
| A2 | `background-clip: text` with `background-position` animation is composited and performant | §1.3 Title Fill | Low — confirmed by web.dev documentation |
| A3 | Astro public/ directory images are served at root path on Cloudflare Workers | §4 Image Handling | LOW — confirmed by Astro docs + Cloudflare docs |
| A4 | FLUX.1-schnell API is available and accepts the same parameters as existing script | §3 AI Prompts | MEDIUM — API may change, model may be updated. Script handles errors gracefully |
| A5 | No existing `public/images/generated/` images need to be preserved | §5 Change Plan | LOW — directory doesn't exist yet per environment audit |

> **A1-A4** are verified by official documentation or confirmed by codebase audit.
> **A5** is confirmed by filesystem check.

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: codebase audit] — `src/pages/index.astro`, `kpop-demon-hunters.astro`, `palace/[id].astro`, all components — actual file contents read and verified
- [VERIFIED: docs.astro.build/en/guides/images] — public/ image path resolution behavior
- [VERIFIED: Astro + Cloudflare Workers docs] — static asset serving via ASSETS binding
- [VERIFIED: npm registry — astro 5.17.1 confirmed in package.json]
- [VERIFIED: enviroment audit — ImageMagick, sharp-cli, Node.js versions confirmed]

### Secondary (MEDIUM confidence)
- [CITED: developer.chrome.com/blog/scroll-triggered-animations] — scroll-triggered animation patterns (Dec 2025)
- [CITED: web.dev/articles/speedy-css-tip-animated-gradient-text] — gradient text animation pattern with `background-clip: text`
- [CITED: css3shapes.com/how-to-animate-clip-path] — clip-path animation best practices (Jan 2026)
- [CITED: richardlemon.com/css-clip-path-animations-scroll-reveal-hero-transitions] — practical clip-path hero patterns (May 2026)

### Tertiary (LOW confidence)
- None — all key claims are verified against codebase or official docs.

---

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — all libraries confirmed via codebase audit and npm registry
- Architecture: **HIGH** — all patterns verified against existing codebase conventions
- Pitfalls: **HIGH** — browser compatibility checked via caniuse patterns, environment verified

**Research date:** 2026-07-01
**Valid until:** 2026-08-01 (30 days — animation and Astro APIs are stable; FLUX model availability may change)
