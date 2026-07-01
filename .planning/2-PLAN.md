# PHASE 2 — Traffic Hook + Content Integration (Executable Plan)

**Phase Goal:** Deliver immersive KPop Demon Hunters scene-by-scene guide with AI-generated imagery, cinematic homepage hero with gate-opening animation, and palace detail page renewal with KDH cross-linking — all using pure CSS and build-time assets.

---

## Source Coverage Audit

| Source | Items | Coverage |
|--------|-------|----------|
| **CONTEXT.md D-01** | P2-1 KDH page full media experience | **PLAN 2** |
| **CONTEXT.md D-02** | P2-2 Home hero gate opening animation | **PLAN 1, PLAN 2** |
| **CONTEXT.md D-03** | P2-3 TimeSlider content reinforcement (keep current) | **No code changes — LOCKED as-is** |
| **CONTEXT.md D-04** | P2-4 Palace detail page renewal | **PLAN 3** |
| **CONTEXT.md D-05** | P2-5 DancheongCard reuse (keep current) | **No code changes — LOCKED as-is** |
| **CONTEXT.md D-06** | P2-6 Building detail content expansion | **PLAN 3** |
| **CONTEXT.md D-07** | P2-7 AI image pipeline — 7 KDH scene images | **PLAN 1** |
| **CONTEXT.md §9** | No Three.js, no GSAP, no runtime AI, no GIF, WebP+srcset, mobile-first, 4 languages, Dancheong palette | **All plans comply** |
| **RESEARCH.md** | CSS clip-path gate animation, title fill, cinematic hero, scene layout patterns, browser compat fallbacks | **Integrated into all plans** |

**No deferred or out-of-scope items appear in these plans.**

---

## Task Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BATCH 1 — Foundation (parallel)                                           │
│                                                                             │
│  ┌──────────────────┐  ┌────────────────────┐  ┌─────────────────────────┐ │
│  │ 1.1 kdh-scenes.ts│  │ 1.2 global.css     │  │ 1.3 AI Image Pipeline   │ │
│  │ (new data module)│  │ (keyframes +       │  │ (7 new KDH prompts +    │ │
│  │                  │  │  layout classes)   │  │  generate)               │ │
│  └────────┬─────────┘  └────────┬───────────┘  └──────────┬──────────────┘ │
│           │                     │                          │                │
└───────────┼─────────────────────┼──────────────────────────┼────────────────┘
            │                     │                          │
            ▼                     ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  BATCH 2 — Page modifications (depends on Batch 1)                         │
│                                                                             │
│  ┌────────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │ 2.1 index.astro — Hero rewrite    │  │ 2.2 kpop-demon-hunters.astro  │ │
│  │ • Gate opening clip-path          │  │    — Full media experience     │ │
│  │ • Title character fill effect     │  │ • AI hero image                │ │
│  │ • AI hero image (gyeongbok-hero)  │  │ • 6 scene-by-scene sections    │ │
│  │ • prefers-reduced-motion handle   │  │ • Timeline thumbnails          │ │
│  └────────────────┬───────────────────┘  │ • Fix 5 guideLinks            │ │
│                   │                      └──────────────┬─────────────────┘ │
└───────────────────┼─────────────────────────────────────┼───────────────────┘
                    │                                     │
                    ▼                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  BATCH 3 — Palace detail (depends on Batch 2)                             │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 3.1 palace/[id].astro — Renewal                                       │ │
│  │ • Cinematic hero scroll effect (CSS perspective + translateZ)         │ │
│  │ • KDH connection section (import KDH_SCENES, filter by palace)        │ │
│  └────────────────────────────────┬───────────────────────────────────────┘ │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  BATCH 4 — Verification                                                     │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 4.1 Build test & final checks                                         │ │
│  │ • npm run build passes                                                │ │
│  │ • Visual verification checklist                                       │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## BATCH 1 — Foundation Tasks (Parallel, No Dependencies)

---

### TASK 1.1: Create `src/data/kdh-scenes.ts` — Centralized Scene Data Module

**Type:** auto
**Files to create:**
- `src/data/kdh-scenes.ts` (new file)

**Action:**

Create a TypeScript data module exporting the `KDHScene` interface and `KDH_SCENES` array with all 6 KDH locations. Each scene includes 4-language content for scene titles, descriptions, and film context. Follow the existing `api.ts` pattern (`Lang` type import, `Record<Lang, string>` dictionaries).

**Exact content specification:**

```typescript
import type { Lang } from '../lib/api';

export interface KDHScene {
  id: string;                           // matches location id
  order: number;                        // display order (1-6)
  sceneTitle: Record<Lang, string>;     // scene title per language
  sceneDescription: Record<Lang, string>; // what happens in the scene
  filmContext: Record<Lang, string>;    // how it fits in the movie
  imageId: string;                      // references generated image filename (without -sm/-md/-lg suffix)
  palaceLink: string | null;            // /palace/[id] or null if non-palace
  guideLink: string;                    // /guide/* path or page anchor
  markerCoords: [number, number];       // [lat, lng] for map
}
```

**KDH_SCENES array — 6 entries:**

| order | id | sceneTitle (en) | imageId | palaceLink | guideLink |
|-------|-----|----------------|---------|------------|-----------|
| 1 | gyeongbokgung | "Gyeongbokgung — The Final Confrontation" | kdh-gyeongbokgung | /palace/1 | /guide/gyeongbokgung |
| 2 | bukchon | "Bukchon — Alley Chase" | kdh-bukchon | null | /kpop-demon-hunters#scene-bukchon |
| 3 | naksan | "Naksan Park — Rooftop Chase" | kdh-naksan | null | /kpop-demon-hunters#scene-naksan |
| 4 | nseoul-tower | "N Seoul Tower — Climax" | kdh-nseoul-tower | null | /kpop-demon-hunters#scene-nseoul-tower |
| 5 | gwanghwamun | "Gwanghwamun Square — Opening Chase" | kdh-gwanghwamun | null | /kpop-demon-hunters#scene-gwanghwamun |
| 6 | insadong | "Insadong — Market Scene" | kdh-insadong | null | /kpop-demon-hunters#scene-insadong |

For each scene, provide full `sceneDescription` and `filmContext` in all 4 languages. Use the RESEARCH.md §2 content as reference but expand with specific, engaging prose.

**Translations for `sceneTitle`:**
- gyeongbokgung: { kr: '경복궁 — 최후의 결전', en: 'Gyeongbokgung — The Final Confrontation', ja: '景福宮 — 最後の対決', zh: '景福宫 — 最终对决' }
- bukchon: { kr: '북촌 — 한옥 골목 추격전', en: 'Bukchon — Alley Chase', ja: '北村 — 韓屋路地の追跡', zh: '北村 — 韩屋小巷追逐' }
- naksan: { kr: '낙산공원 — 성곽 위 추격', en: 'Naksan Park — Rooftop Chase', ja: '駱山公園 — 城壁の追跡', zh: '骆山公园 — 城墙追逐' }
- nseoul-tower: { kr: 'N서울타워 — 클라이맥스', en: 'N Seoul Tower — Climax', ja: 'Nソウルタワー — クライマックス', zh: 'N首尔塔 — 高潮' }
- gwanghwamun: { kr: '광화문광장 — 오프닝 추격', en: 'Gwanghwamun Square — Opening Chase', ja: '光化門広場 — オープニング', zh: '光化门广场 — 开场追逐' }
- insadong: { kr: '인사동 — 전통시장 장면', en: 'Insadong — Market Scene', ja: '仁寺洞 — 伝統市場', zh: '仁寺洞 — 传统市场' }

For `sceneDescription` and `filmContext`, write 1-2 sentences per language (kr/en/ja/zh) describing the actual scene and its film context. Keep descriptions vivid but concise.

**`markerCoords` values** (from existing locations array in kpop-demon-hunters.astro):
- gyeongbokgung: [37.5796, 126.9770]
- bukchon: [37.5826, 126.9857]
- naksan: [37.5800, 127.0070]
- nseoul-tower: [37.5512, 126.9882]
- gwanghwamun: [37.5724, 126.9769]
- insadong: [37.5710, 126.9882]

**DO NOT** create `src/data/` directory — it doesn't exist yet. Use `mkdir` or write with intermediate directory creation.

**Verify:**
```bash
node -e "import('./src/data/kdh-scenes.ts').then(m => console.log('Export KDH_SCENES:', m.KDH_SCENES.length, 'scenes'))"
```

**Edge cases:**
- `palaceLink` is `null` for non-palace locations — consumers must handle null
- All 4 languages must be provided for every string field (no fallback needed — consuming code uses `[lang] ?? 'en'` pattern)

---

### TASK 1.2: Add CSS Keyframes and Layout Classes to `src/styles/global.css`

**Type:** auto
**Files to modify:**
- `src/styles/global.css` (append additions before the `@media (prefers-reduced-motion)` section, i.e., before line 1225)

**Action:**

Add the following CSS blocks to `global.css`. Insert each block in a logical section (new section after line 1201, before the "모바일 반응형" section at line 1206).

**A) Gate Opening Animation (for index.astro hero):**

```css
/* ═══════════════════════════════════════════════
   PHASE 2 — Gate Opening & Hero Animations
   ═══════════════════════════════════════════════ */
   
/* Palace Gate panels — covers hero image, slides open */
.hero-gate {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 5;
  background: var(--bg-night);
  pointer-events: none;
  will-change: clip-path;
}

.hero-gate-left {
  left: 0;
  animation: gateOpenLeft 1.8s cubic-bezier(0.77, 0, 0.18, 1) 0.3s forwards;
}

.hero-gate-right {
  right: 0;
  animation: gateOpenRight 1.8s cubic-bezier(0.77, 0, 0.18, 1) 0.3s forwards;
}

@keyframes gateOpenLeft {
  0%   { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  100% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
}

@keyframes gateOpenRight {
  0%   { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  100% { clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%); }
}
```

**B) Title Character Fill Effect:**

```css
/* Character-by-character fill animation */
.hero-title-fill {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
}

.fill-char {
  display: inline-block;
  background: linear-gradient(
    90deg,
    var(--neon-gold) 0%,
    var(--dancheong-yellow) 30%,
    var(--neon-red) 60%,
    var(--neon-blue) 80%,
    var(--neon-gold) 100%
  );
  background-size: 300% 100%;
  background-position: 300% 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: charFill 0.6s ease-out forwards;
  will-change: background-position;
}

@keyframes charFill {
  0%   { background-position: 300% 0; }
  100% { background-position: 0% 0; }
}
```

**C) Cinematic Hero Scroll Effect (for palace/[id].astro):**

```css
/* Palace cinematic hero — scroll-driven camera enter */
.palace-hero-content {
  perspective: 1000px;
}

.palace-hero-title-anim {
  animation: cameraEnter 1.2s ease-out forwards;
}

/* Progressive enhancement: scroll-driven on supported browsers */
@supports (animation-timeline: view()) {
  .palace-hero-title-anim {
    animation: cameraEnter 1.5s ease-out forwards;
    animation-timeline: view();
    animation-range: entry 0% contain 50%;
  }
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

**D) KDH Scene Guide Layout Classes:**

```css
/* ═══════════════════════════════════════════════
   PHASE 2 — KDH Scene-by-Scene Guide
   ═══════════════════════════════════════════════ */

/* Each scene section — full width */
.kdh-scene {
  padding: 40px 0;
  border-bottom: 1px solid var(--color-border-light);
  scroll-margin-top: 80px; /* for anchor link offset */
}

.kdh-scene:last-of-type {
  border-bottom: none;
}

.kdh-scene-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
}

/* Desktop: alternate image/text layout */
@media (min-width: 768px) {
  .kdh-scene-inner {
    grid-template-columns: 1fr 1fr;
  }
  
  /* Alternate: scene order even = image-right, odd = image-left */
  .kdh-scene:nth-child(even) .kdh-scene-inner {
    direction: rtl; /* flips column order */
  }
  .kdh-scene:nth-child(even) .kdh-scene-inner > * {
    direction: ltr; /* restore text direction inside */
  }
  
  /* Re-apply text alignment for RTL-safe rendering */
  .kdh-scene:nth-child(even) .kdh-scene-text {
    text-align: left;
  }
}

.kdh-scene-image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.kdh-scene-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.6s ease, filter 0.6s;
  filter: brightness(0.85) saturate(1.1);
}

.kdh-scene-image:hover img {
  transform: scale(1.03);
  filter: brightness(0.95) saturate(1.2);
}

.kdh-scene-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--neon-red), #FF6B8A);
  color: #fff;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.kdh-scene-text h3 {
  font-family: 'Noto Serif KR', serif;
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--neon-gold);
}

.kdh-scene-desc {
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.7;
  margin-bottom: 12px;
}

.kdh-scene-context {
  font-size: 0.85rem;
  color: var(--color-text-light);
  line-height: 1.6;
  margin-bottom: 20px;
  font-style: italic;
  padding-left: 12px;
  border-left: 2px solid var(--color-border-light);
}

/* KDH section header */
.kdh-section-title {
  font-family: 'Noto Serif KR', serif;
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}

.kdh-section-sub {
  text-align: center;
  color: var(--color-text-light);
  font-size: 1rem;
  margin-bottom: 40px;
}
```

**E) Timeline Thumbnail Enhancement:**

```css
/* ═══════════════════════════════════════════════
   PHASE 2 — Timeline Thumbnails
   ═══════════════════════════════════════════════ */

.route-step-image {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid var(--color-border-light);
  filter: brightness(0.8);
  transition: filter 0.3s, transform 0.3s;
}

.route-step:hover .route-step-image {
  filter: brightness(1);
  transform: scale(1.05);
}

/* On mobile (where route-info may stack) */
@media (max-width: 640px) {
  .route-step {
    gap: 12px;
  }
  .route-step-image {
    width: 48px;
    height: 72px;
  }
}
```

**F) KDH Connection Section (for palace/[id].astro):**

```css
/* ═══════════════════════════════════════════════
   PHASE 2 — KDH Connection on Palace Pages
   ═══════════════════════════════════════════════ */

.kdh-connection {
  padding: 40px 0 60px;
}

.kdh-connection-inner {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  background: var(--bg-glass);
  backdrop-filter: blur(12px) saturate(1.2);
  -webkit-backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  padding: 40px 32px;
}

.kdh-connection-inner p {
  font-size: 0.95rem;
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: 24px;
}
```

**Placement in file:** Insert all the above blocks as a new section `/* ═════ PHASE 2 — NEW ANIMATIONS & LAYOUTS ═════ */` between line 1201 (end of KDH hook section) and line 1206 (mobile responsive).

**Verify:**
```bash
grep -c 'gateOpenLeft\|gateOpenRight\|cameraEnter\|kdh-scene\|fill-char\|route-step-image\|kdh-connection' src/styles/global.css
```
Expected: at least 7 matches (one per new block).

---

### TASK 1.3: Add 7 KDH Prompts to AI Image Pipeline + Generate

**Type:** auto
**Files to modify:**
- `scripts/generate-ai-images.mjs`

**Files to create (at runtime via script):**
- `public/images/generated/kdh-hero-{sm,md,lg}.webp` (3 sizes each × 7 images = 21 files)
- `public/images/generated/kdh-gyeongbokgung-{sm,md,lg}.webp`
- `public/images/generated/kdh-bukchon-{sm,md,lg}.webp`
- `public/images/generated/kdh-naksan-{sm,md,lg}.webp`
- `public/images/generated/kdh-nseoul-tower-{sm,md,lg}.webp`
- `public/images/generated/kdh-gwanghwamun-{sm,md,lg}.webp`
- `public/images/generated/kdh-insadong-{sm,md,lg}.webp`
- Also regenerate `gyeongbok-hero-{sm,md,lg}.webp` (improved prompt)

**Action:**

**Step 1:** Add 8 new entries to the `IMAGES` array in `scripts/generate-ai-images.mjs` (append after line 62, keeping existing 5 images). The 8 new entries are:

```javascript
// ═══════════════════════════════════════════════════
// PHASE 2 — KDH Scene Images (added below existing 5)
// ═══════════════════════════════════════════════════

{
  id: 'kdh-hero',
  prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace Geunjeongjeon at night, KPop Demon Hunters main confrontation scene, dramatic action composition, red and blue neon lighting between dancheong pillars, heroic epic scale, action movie poster style, moonlight casting shadows, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-gyeongbokgung',
  prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace main courtyard at night, action sequence under full moon, characters facing off between dancheong pillars, neon blue and gold light beams cutting through darkness, traditional lanterns, dramatic composition, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-bukchon',
  prompt: `${STYLE_PREFIX}, Bukchon Hanok Village narrow alleyway at night, chase scene through traditional Korean houses with curved tiled roofs, warm golden light spilling from hanok windows, neon pink accents, cinematic motion blur, dramatic perspective looking down alley, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-naksan',
  prompt: `${STYLE_PREFIX}, Naksan Park Seoul City Wall at night, rooftop chase along ancient fortress wall, Seoul skyline glowing in background, full moon, neon teal and gold lighting on stone wall, dramatic height perspective looking down at city, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-nseoul-tower',
  prompt: `${STYLE_PREFIX}, N Seoul Tower at night seen from below observation deck, climactic confrontation scene, neon pink and blue beams sweeping across night sky, Seoul city lights far below, cinematic wide angle, dramatic clouds, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-gwanghwamun',
  prompt: `${STYLE_PREFIX}, Gwanghwamun Square at night with King Sejong statue silhouette, dramatic opening chase scene wide shot, street reflections on wet ground after rain, traffic light trails, government buildings lit in background, cinematic movie still, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'kdh-insadong',
  prompt: `${STYLE_PREFIX}, Insadong traditional street at night, bustling market scene, traditional Korean tea houses and art galleries with colorful signs, paper lanterns hanging overhead, warm neon glow on cobblestone street, cinematic depth with crowd activity, 9:16 mobile portrait`,
  size: '768x1344',
},
{
  id: 'gyeongbok-hero',
  prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace Geunjeongjeon main hall at night, grand entrance view, full moon illuminating golden roof tiles, red and blue dancheong pillars glowing with neon light, palace courtyard with stone pavement, majestic cinematic wide shot, 9:16 mobile portrait`,
  size: '768x1344',
},
```

**Step 2:** Run the generation script:
```bash
HF_TOKEN=$(grep HF_TOKEN ~/.env.common | cut -d '=' -f2) node scripts/generate-ai-images.mjs
```

**Pre-flight check:**
```bash
echo "HF_TOKEN set: $([ -n "$(grep HF_TOKEN ~/.env.common 2>/dev/null | cut -d= -f2)" ] && echo 'YES' || echo 'NO')"
```

**Verify after generation:**
```bash
ls -la public/images/generated/ | grep -c webp
```
Expected: 24 webp files (8 images × 3 sizes = 24; existing 5 × 3 = 15; total = 39 webp files if regenerating everything, or 24 new ones)

```bash
# Verify specific files exist
for img in kdh-hero kdh-gyeongbokgung kdh-bukchon kdh-naksan kdh-nseoul-tower kdh-gwanghwamun kdh-insadong gyeongbok-hero; do
  echo "$img: $(ls public/images/generated/${img}-sm.webp 2>/dev/null && echo OK || echo MISSING)"
done
```

**Edge cases:**
- **HF_TOKEN missing:** Script exits with error message. Check `~/.env.common` contains `HF_TOKEN=<value>`. Create it if missing (user must get token from huggingface.co/settings/tokens).
- **API rate limit:** Script has 2s delay between calls. If individual image fails, it logs error and continues. Rerun script for failed images.
- **ImageMagick not available:** Falls back to `sharp-cli`. Both verified available in environment.
- **Directory doesn't exist:** Script creates `public/images/generated/` via `mkdirSync({recursive: true})`.

---

## BATCH 2 — Page Modifications (Depends on Batch 1)

---

### TASK 2.1: Rewrite Homepage Hero — Gate Opening + Title Fill + AI Image

**Type:** auto
**Files to modify:**
- `src/pages/index.astro` (339 lines)

**Action:**

Modify `src/pages/index.astro` hero section (lines 104-130). Three specific changes:

**Change 1 — Hero image (line 106):**
Replace:
```astro
<img src="https://www.heritage.go.kr/gung/gogung1/images/ic-e21.jpg" alt="Gyeongbokgung Geunjeongjeon" fetchpriority="high" />
```
With:
```astro
<img
  src="/images/generated/gyeongbok-hero-md.webp"
  srcset="/images/generated/gyeongbok-hero-sm.webp 375w, /images/generated/gyeongbok-hero-md.webp 768w, /images/generated/gyeongbok-hero-lg.webp 1200w"
  sizes="100vw"
  alt="Gyeongbokgung Geunjeongjeon"
  fetchpriority="high"
  width="768"
  height="1344"
  style="aspect-ratio: 768/1344; object-fit: cover;"
  decoding="async"
/>
```

**Change 2 — Add gate panels inside `.hero-full` (after line 108 `.hero-overlay`, before line 109 `.hero-particles`):**
Insert:
```astro
<!-- Gate opening animation panels (Phase 2) -->
<div class="hero-gate hero-gate-left"></div>
<div class="hero-gate hero-gate-right"></div>
```

**Change 3 — Replace title with character fill effect (line 119):**
Replace:
```astro
<h1 class="hero-title hero-title-mask">{h.title}</h1>
```
With:
```astro
<h1 class="hero-title hero-title-fill">
  {h.title.split('').map(char => (
    <span class="fill-char" style={`animation-delay: ${Array.from(h.title).indexOf(char) * 0.06}s`}>{char === ' ' ? '\u00A0' : char}</span>
  ))}
</h1>
```

**IMPORTANT:** The `split('').map()` approach requires unique index for each character. Use a different approach to avoid duplicate animation delays for repeated characters. Alternative:

```astro
<h1 class="hero-title hero-title-fill">
  {Array.from(h.title).map((char, i) => (
    <span class="fill-char" style={`animation-delay: ${i * 0.06}s`}>{char === ' ' ? '\u00A0' : char}</span>
  ))}
</h1>
```

Note: `Array.from()` is used instead of `.split('')` for correct Unicode handling (Korean characters).

**Change 4 — Remove old `hero-title-mask` CSS (lines 285-294 in the `<style>` block):**
Delete the entire `.hero-title-mask` CSS block (lines 285-294):
```css
/* BEFORE — REMOVE THESE LINES */
.hero-title-mask {
  background-image: url('/l3GGabnn.jpeg');
  background-size: cover;
  background-position: center;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  filter: brightness(1.2) saturate(1.3);
}
```

**Change 5 — Add `touch-action: pan-y` to hero section.**
In the `.hero-full` CSS (line 633 in global.css, or the inline style):
Add `touch-action: pan-y;` to the `.hero-full` class in global.css (add to existing rule around line 633).

**Change 6 — Add prefers-reduced-motion override for gate + fill.**
In the existing `@media (prefers-reduced-motion: reduce)` block (global.css line 1225):
Add these lines inside the block:
```css
.hero-gate { display: none; } /* Make gates invisible — already open */
.fill-char { background-position: 0% 0; -webkit-text-fill-color: var(--neon-gold); color: var(--neon-gold); } /* Show fully filled */
```

**Don't forget:** Ensure there are no duplicate `.hero-title-mask` references in the existing `<style>` block (lines 276-339 in index.astro).

**Verify:**
```bash
# Check hero image is local, not external
grep -c 'gyeongbok-hero' src/pages/index.astro
# Expected: 4 (src, srcset x3)
grep -c 'heritage.go.kr.*ic-e21' src/pages/index.astro
# Expected: 0 (should be removed)
grep -c 'hero-gate' src/pages/index.astro
# Expected: 2 (left + right)
grep -c 'fill-char' src/pages/index.astro
# Expected: > 1
```

**Visual check (post-build):**
- Open `http://localhost:4321` after `npm run dev`
- Hero image loads from `/images/generated/gyeongbok-hero-md.webp`
- Two dark gate panels slide open on page load (1.8s animation)
- Title characters fill in with gradient sequentially
- SCROLL text bounces at bottom
- On mobile: touch scrolling works (not blocked by gate panels)
- With `prefers-reduced-motion: reduce`: gates invisible, title fully gold

---

### TASK 2.2: Rewrite KDH Page — Scene Guide + Timeline + guideLinks

**Type:** auto
**Files to modify:**
- `src/pages/kpop-demon-hunters.astro` (826 lines)

**Files to reference:**
- `src/data/kdh-scenes.ts` (created in Task 1.1)

**Action:**

**Change 1 — Import KDH_SCENES at top (after line 7):**
Insert:
```typescript
import { KDH_SCENES } from '../data/kdh-scenes';
```

**Change 2 — Replace hero image (line 158):**
Replace:
```astro
<img src="https://www.heritage.go.kr/gung/gogung1/images/ic-e21.jpg" alt="KPop Demon Hunters Seoul" fetchpriority="high" />
```
With:
```astro
<img
  src="/images/generated/kdh-hero-md.webp"
  srcset="/images/generated/kdh-hero-sm.webp 375w, /images/generated/kdh-hero-md.webp 768w, /images/generated/kdh-hero-lg.webp 1200w"
  sizes="100vw"
  alt="KPop Demon Hunters Seoul"
  fetchpriority="high"
  width="768"
  height="1344"
  style="aspect-ratio: 768/1344; object-fit: cover;"
  decoding="async"
/>
```

**Change 3 — Fix 5 guideLink entries (lines 67, 79, 89, 99, 111):**
Change from `'#'` to:
- bukchon guideLink (line 67): `'/kpop-demon-hunters#scene-bukchon'`
- naksan guideLink (line 79): `'/kpop-demon-hunters#scene-naksan'`
- nseoul-tower guideLink (line 89): `'/kpop-demon-hunters#scene-nseoul-tower'`
- gwanghwamun guideLink (line 99): `'/kpop-demon-hunters#scene-gwanghwamun'`
- insadong guideLink (line 111): `'/kpop-demon-hunters#scene-insadong'`

**Change 4 — Insert scene-by-scene guide section after hero (between line 174 `</section>` and line 177 `<div class="minhwa-divider">`).**

Insert:
```astro
  <!-- ═══ PHASE 2: Scene-by-Scene Guide ═══ -->
  <div class="container">
    <div class="kdh-section-title">
      <h2 class="kdh-section-title">
        {lang === 'kr' ? '장면별 가이드' : lang === 'ja' ? 'シーン別ガイド' : lang === 'zh' ? '分场指南' : 'Scene-by-Scene Guide'}
      </h2>
      <p class="kdh-section-sub">
        {lang === 'kr' ? '영화 속 6개 주요 장면을 실제 촬영지와 함께 탐험하세요' :
         lang === 'ja' ? '映画の6つの主要シーンを実際のロケ地とともに探索' :
         lang === 'zh' ? '跟随电影6个主要场景探索实际拍摄地' :
         'Explore all 6 key scenes from the film at their real Seoul locations'}
      </p>
    </div>

    {KDH_SCENES.sort((a, b) => a.order - b.order).map(scene => (
      <section class="kdh-scene" id={`scene-${scene.id}`}>
        <div class="kdh-scene-inner">
          <div class="kdh-scene-image">
            <img
              src={`/images/generated/${scene.imageId}-md.webp`}
              srcset={`
                /images/generated/${scene.imageId}-sm.webp 375w,
                /images/generated/${scene.imageId}-md.webp 768w,
                /images/generated/${scene.imageId}-lg.webp 1200w
              `}
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={scene.sceneTitle[lang] || scene.sceneTitle.en}
              loading="lazy"
              width="768"
              height="1344"
              style="aspect-ratio: 768/1344; object-fit: cover;"
              decoding="async"
            />
          </div>
          <div class="kdh-scene-text">
            <span class="kdh-scene-badge">{lang === 'kr' ? `장면 ${scene.order}` : lang === 'ja' ? `シーン ${scene.order}` : lang === 'zh' ? `场景 ${scene.order}` : `Scene ${scene.order}`}</span>
            <h3>{scene.sceneTitle[lang] || scene.sceneTitle.en}</h3>
            <p class="kdh-scene-desc">{scene.sceneDescription[lang] || scene.sceneDescription.en}</p>
            <p class="kdh-scene-context">{scene.filmContext[lang] || scene.filmContext.en}</p>
            {scene.palaceLink && (
              <a href={`${scene.palaceLink}?lang=${lang}`} class="btn btn-outline" style="margin-top: 8px;">
                {lang === 'kr' ? '궁궐 자세히 보기' : lang === 'ja' ? '宮殿を詳しく見る' : lang === 'zh' ? '查看宫殿详情' : 'View Palace Details'} &rarr;
              </a>
            )}
          </div>
        </div>
      </section>
    ))}
  </div>
```

**Change 5 — Enhance timeline with thumbnails.**

In the route-timeline section (around lines 262-306), modify each `.route-step` to include scene images. The timeline steps correspond to:
- 09:00 → gyeongbokgung (kdh-gyeongbokgung)
- 11:00 → gwanghwamun (kdh-gwanghwamun)
- 12:30 → insadong (kdh-insadong)
- 14:00 → bukchon (kdh-bukchon)
- 16:00 → naksan (kdh-naksan)
- 18:30 → nseoul-tower (kdh-nseoul-tower)

For each route step, add an `<img>` tag with scene thumbnail BEFORE the `.route-info` div. Structure:

```astro
<div class="route-step">
  <span class="route-time">09:00</span>
  <img
    src="/images/generated/kdh-gyeongbokgung-sm.webp"
    alt="Gyeongbokgung"
    class="route-step-image"
    loading="lazy"
    width="60"
    height="90"
  />
  <div class="route-info">
    ...
  </div>
</div>
```

Do this for all 6 steps. Map each time to its corresponding scene image.

**Change 6 — Add section anchor to map cards (popup link fix).**
The map popup currently links to `loc.link` (line 392). Update the popup link generation in the `<script>` block (line 392):
```javascript
'<a href="' + (loc.link && loc.link !== '#' ? loc.link + '?lang=' + L : '/kpop-demon-hunters?lang=' + L + '#scene-' + loc.id) + '" class="popup-link">' + popupLabels[L] + ' &rarr;</a>'
```

This ensures non-palace locations link to their scene anchor instead of `#`.

**Verify:**
```bash
# Check imports
grep -c "from '../data/kdh-scenes'" src/pages/kpop-demon-hunters.astro
# Expected: 1
grep -c 'kdh-scene' src/pages/kpop-demon-hunters.astro
# Expected: >= 6 (scene sections)
grep -c "guideLink: '/kpop-demon-hunters#" src/pages/kpop-demon-hunters.astro
# Expected: 5 (fixed guideLinks)
grep -c 'route-step-image' src/pages/kpop-demon-hunters.astro
# Expected: 6 (timeline thumbnails)
grep -c 'heritage.go.kr.*ic-e21' src/pages/kpop-demon-hunters.astro
# Expected: 0
```

---

## BATCH 3 — Palace Detail Renewal

---

### TASK 3.1: Renew Palace Detail Page — Cinematic Hero + KDH Section

**Type:** auto
**Files to modify:**
- `src/pages/palace/[id].astro` (252 lines)

**Action:**

**Change 1 — Import KDH_SCENES at the top (after line 6):**
Insert:
```typescript
import { KDH_SCENES } from '../../data/kdh-scenes';
```

**Change 2 — Add cinematic hero scroll effect to the palace hero.**

In the template section, add the `palace-hero-title-anim` class to the `<h1 class="palace-title">` element (line 64):
Change:
```astro
<h1 class="palace-title">{palaceName}</h1>
```
To:
```astro
<h1 class="palace-title palace-hero-title-anim">{palaceName}</h1>
```

Also wrap the hero content in a div with `palace-hero-content` class — it already has this class (line 62), so ensure the CSS from global.css applies. Verify the existing class on line 62:
```astro
<div class="palace-hero-content">
```
This is correct — the CSS from Task 1.2 targets `.palace-hero-content`.

Add `touch-action: pan-y;` to `.palace-hero` to ensure mobile scroll works. In the `<style>` block of palace/[id].astro (line 142), find the `.palace-hero` rule (line 142) and add `touch-action: pan-y;`.

**Change 3 — Add KDH connection section after building list (after line 97, before line 100 `</div>`).**

Before the closing `</div>` of `.container` (line 100), and after the `</section>` closing the building list (line 97), insert:

```astro
    <!-- ═══ PHASE 2: KDH Connection Section ═══ -->
    {
      const palaceScene = KDH_SCENES.find(s => s.palaceLink === `/palace/${palaceId}`);
      const kdhTitle: Record<string, string> = {
        kr: 'KPop Demon Hunters 속 이 궁궐',
        en: 'This Palace in KPop Demon Hunters',
        ja: 'KPop Demon Huntersのこの宮殿',
        zh: 'KPop Demon Hunters中的这座宫殿',
      };
      const kdhDesc: Record<string, string> = {
        kr: `영화 속 ${palaceName}의 장면을 확인하고, 실제 촬영지와의 연결을 경험해보세요.`,
        en: `See how ${palaceName} appears in the film and experience the connection to real filming locations.`,
        ja: `映画の中で${palaceName}がどのように登場するか確認し、実際のロケ地とのつながりを体験してください。`,
        zh: `了解${palaceName}在电影中的场景，体验与实际拍摄地的联系。`,
      };
      const kdhBtn: Record<string, string> = {
        kr: 'KDH 촬영지 보기',
        en: 'View KDH Locations',
        ja: 'KDHロケ地を見る',
        zh: '查看KDH拍摄地',
      };
    }
    <section class="kdh-connection">
      <hr class="dancheong-divider" />
      <div class="container" style="padding: 40px 0;">
        <div class="kdh-connection-inner">
          <h2 style="font-family:'Noto Serif KR',serif;font-size:clamp(1.2rem,3vw,1.6rem);font-weight:700;margin-bottom:12px;">
            {kdhTitle[lang] || kdhTitle.en}
          </h2>
          <p>{kdhDesc[lang] || kdhDesc.en}</p>
          <a href={`/kpop-demon-hunters?lang=${lang}${palaceScene ? '#' + palaceScene.id : ''}`} class="btn btn-primary">
            {kdhBtn[lang] || kdhBtn.en} &rarr;
          </a>
        </div>
      </div>
    </section>
```

**Verify:**
```bash
grep -c "from '../../data/kdh-scenes'" src/pages/palace/\[id\].astro
# Expected: 1
grep -c 'kdh-connection' src/pages/palace/\[id\].astro
# Expected: 1
grep -c 'palace-hero-title-anim' src/pages/palace/\[id\].astro
# Expected: 1
grep -c 'KDH_SCENES.find' src/pages/palace/\[id\].astro
# Expected: 1
```

---

## BATCH 4 — Verification

---

### TASK 4.1: Full Build Test and Visual Verification

**Type:** checkpoint:human-verify
**What-built:** All Phase 2 changes — homepage hero with gate animation, KDH scene-by-scene guide, palace detail cinematic hero + KDH section, AI-generated images.

**How to verify:**

**Step 1 — Build:**
```bash
npm run build
```
Expected: Build succeeds with exit code 0. No errors. No warnings about missing images.

**Step 2 — Local dev server check:**
```bash
npm run dev
```
Open `http://localhost:4321` in browser.

**Step 3 — Visual verification checklist:**

| # | Check | Expected | Pass/Fail |
|---|-------|----------|-----------|
| 1 | Homepage hero image | Loads from `/images/generated/gyeongbok-hero-md.webp` (not heritage.go.kr) | |
| 2 | Gate opening animation | Two dark panels slide open from center on page load (1.8s) | |
| 3 | Title fill effect | Title characters fill in with gold gradient one by one | |
| 4 | prefers-reduced-motion | With OS reduce-motion ON: gates invisible, title solid gold, no animation | |
| 5 | Mobile touch scroll | Hero section scrolls on touch (not blocked by gate panels) | |
| 6 | KDH page hero | Loads from `/images/generated/kdh-hero-md.webp` | |
| 7 | KDH scene guide | 6 scene sections visible with AI images, badges, descriptions, film context | |
| 8 | KDH scene anchors | Clicking guide links goes to `#scene-{id}` anchors | |
| 9 | Timeline thumbnails | Each route step has a small scene image thumbnail (60×90) | |
| 10 | Timeline hover | Thumbnail brightens on hover | |
| 11 | Palace detail hero | Title has camera-enter animation on scroll | |
| 12 | Palace KDH section | Shows "This Palace in KPop Demon Hunters" section after building list | |
| 13 | Palace KDH link | Button links to `/kpop-demon-hunters?lang=XX#gyeongbokgung` | |
| 14 | All AI images load | Check a few scene images — all load as WebP with srcset | |
| 15 | Image responsiveness | Resize browser — images switch srcset sizes appropriately | |
| 16 | 4-language check | Append `?lang=en`, `?lang=ja`, `?lang=zh` — all content renders in correct language | |

**Step 4 — Browser console check:**
Open browser DevTools console. Expected: No 404 errors for missing images, no JavaScript errors.

**Step 5 — Lighthouse mobile audit (bonus):**
```bash
# If you have Lighthouse CLI:
npx lighthouse http://localhost:4321 --view --preset=desktop
```

**Resume signal:**
```
approved
```
Or list any issues found.

---

## AI Image Generation Spec (Detailed Reference)

### Environment Check
```bash
# Pre-flight check
echo "=== Pre-flight Checks ==="
echo "HF_TOKEN exists: $(grep -c 'HF_TOKEN' ~/.env.common 2>/dev/null || echo '0 (MISSING! Set one up at https://huggingface.co/settings/tokens)')"
echo "ImageMagick: $(which convert && convert --version | head -1 || echo 'NOT FOUND (fallback: sharp-cli)')"
echo "Node: $(node --version)"
echo "Output dir: public/images/generated/"
```

### 7 New Image Prompts Summary

| ID | Subject | Key Visual Elements |
|----|---------|-------------------|
| `kdh-hero` | Gyeongbokgung Geunjeongjeon night confrontation | Dancheong pillars, neon blue/red, epic poster style |
| `kdh-gyeongbokgung` | Palace courtyard action | Full moon, neon beams, traditional lanterns |
| `kdh-bukchon` | Hanok alley chase | Tiled roofs, warm window light, motion blur |
| `kdh-naksan` | City wall rooftop chase | Seoul skyline, fortress wall, dramatic height |
| `kdh-nseoul-tower` | Tower climax | Pink/blue beams, city far below, wide angle |
| `kdh-gwanghwamun` | Square opening chase | King Sejong statue, wet ground reflections |
| `kdh-insadong` | Traditional market scene | Lanterns, tea houses, cobblestone street |
| `gyeongbok-hero`*(regenerated)* | Palace main hall entrance | Full moon, golden roof, majestic wide shot |

### Execution Command
```bash
HF_TOKEN=$(grep HF_TOKEN ~/.env.common | cut -d '=' -f2) node scripts/generate-ai-images.mjs
```

### Image File Naming Convention
```
public/images/generated/{id}-sm.webp    # 375px width
public/images/generated/{id}-md.webp    # 768px width
public/images/generated/{id}-lg.webp    # 1200px width
```

### Image Reference in Astro Pages
For non-hero images (below the fold):
```astro
<img
  src="/images/generated/{id}-md.webp"
  srcset="/images/generated/{id}-sm.webp 375w, /images/generated/{id}-md.webp 768w, /images/generated/{id}-lg.webp 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="..."
  loading="lazy"
  width="768" height="1344"
  style="aspect-ratio: 768/1344; object-fit: cover;"
  decoding="async"
/>
```

For hero image (above the fold):
```astro
<img
  src="/images/generated/{id}-md.webp"
  srcset="..."
  sizes="100vw"
  alt="..."
  fetchpriority="high"
  width="768" height="1344"
  style="aspect-ratio: 768/1344; object-fit: cover;"
  decoding="async"
/>
```

---

## Files Modified Summary

| File | Change Type | Batch | Lines Changed |
|------|-------------|-------|---------------|
| `src/data/kdh-scenes.ts` | **CREATE** | 1 | ~180 lines (new file) |
| `src/styles/global.css` | **MODIFY** | 1 | Insert ~200 lines between line 1201-1206 |
| `scripts/generate-ai-images.mjs` | **MODIFY** | 1 | Append 8 entries (~80 lines) after line 62 |
| `src/pages/index.astro` | **MODIFY** | 2 | Replace hero image (line 106), add gate panels (after 108), replace title (line 119), remove old CSS (lines 285-294) |
| `src/pages/kpop-demon-hunters.astro` | **MODIFY** | 2 | Add import (after line 7), replace hero image (line 158), fix 5 guideLinks, insert scene guide section (after line 174), enhance 6 timeline steps |
| `src/pages/palace/[id].astro` | **MODIFY** | 3 | Add import (after line 6), add title-anim class (line 64), add KDH section (after line 97), add touch-action to hero CSS |

---

## Threat Model

### Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Build script → HF API | External API call with API token |
| Astro SSR → public/ images | Static asset serving via Workers ASSETS |

### STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation |
|-----------|----------|-----------|-------------|------------|
| T-02-01 | Information Disclosure | HF_TOKEN in scripts/generate-ai-images.mjs | Mitigate | Token loaded from `~/.env.common` (not in repo). Script is build-time only, not deployed |
| T-02-02 | Tampering | public/images/generated/ | Accept | Static assets served from Workers ASSETS. No user uploads. Risk is limited to deployment-time corruption |
| T-02-03 | Denial of Service | HF API calls (7 sequential) | Accept | 2s delay between calls. If API unavailable, script logs error, individual image fails gracefully. Page falls back gracefully (no alt text display but no crash) |
| T-02-SC | Tampering | npm/pip/cargo installs | Accept | No new packages installed this phase. Zero npm install. Existing deps unchanged |

---

## Success Criteria

- [ ] `npm run build` passes without errors
- [ ] Homepage hero: AI image loads, gate opens via CSS clip-path, title fills in character by character
- [ ] KDH page: 6 scene sections with AI images, descriptions, film context (4 languages each)
- [ ] KDH page: 4 broken guideLinks fixed to anchor links
- [ ] KDH page: timeline has scene thumbnails (6 images)
- [ ] Palace detail: title has camera-enter scroll animation
- [ ] Palace detail: KDH connection section visible with contextual link
- [ ] All 8 AI images generated with 3 WebP sizes each (24 files total)
- [ ] All images use `aspect-ratio`, explicit `width`/`height`, `loading="lazy"` (hero: `fetchpriority="high"`)
- [ ] `prefers-reduced-motion` disables all new animations
- [ ] Mobile: `touch-action: pan-y` applied to hero sections
- [ ] Mobile: scene layout is single column (stacks image above text)
- [ ] Desktop: scene layouts alternate (image-left, image-right)
- [ ] All text renders in 4 languages (kr/en/ja/zh) via `?lang=` parameter
- [ ] Dancheong Neon Palette used throughout (no new colors)
- [ ] No external heritage.go.kr image references remain on modified pages
