# PHASE 1 — Visual Innovation (Executable Plan)

**Phase Goal:** Implement the Korean pastel dancheong color palette and ma (whitespace) design system across the foundation layers, creating a serene, culturally authentic visual foundation for the K-Heritage Guide.

---

## Source Coverage Audit

| Source | Items | Coverage |
|--------|-------|----------|
| **AGENTS.md A-1** | P1-1 global.css complete overhaul | **PLAN 1** |
| **AGENTS.md A-3, A-4, A-5** | P1-2 Component updates (DancheongCard, PastelGlow, etc.) | **PLAN 1** |
| **AGENTS.md B-1, B-2** | P1-3 AI pipeline setup | **PLAN 1** |
| **AGENTS.md B-3, B-4** | P1-4 Core AI image generation | **PLAN 1** |
| **RESEARCH.md** | Pastel dancheong palette research, Korean minimalist/ma principles | **PLAN 1** |

**No deferred or out-of-scope items appear in this plan.**

---

## Task Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BATCH 1 — Foundation (parallel)                                           │
│                                                                             │
│  ┌──────────────────┐  ┌────────────────────┐  ┌─────────────────────────┐ │
│  │ 1.1 global.css   │  │ 1.2 Component Base │  │ 1.3 AI Pipeline Setup   │ │
│  │ (pastel + ma)    │  │ (DancheongCard,    │  │ (script structure)      │ │
│  │                  │  │  PastelGlow, etc.) │  │                         │ │
│  └────────┬─────────┘  └────────┬───────────┘  └──────────┬──────────────┘ │
│           │                     │                          │                │
└───────────┼─────────────────────┼──────────────────────────┼────────────────┘
            │                     │                          │
            ▼                     ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  BATCH 2 — Implementation (depends on Batch 1)                             │
│                                                                             │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │ 2.1 Component Updates          │  │ 2.2 AI Image Generation        │ │
│  │ (specific components)          │  │ (core 5 images + dancheong)    │ │
│  └────────────────┬───────────────┘  └──────────────┬─────────────────┘ │
│                   │                                 │                   │
└───────────────────┼─────────────────────────────────┼───────────────────┘
                    ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  BATCH 3 — Verification                                                     │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 3.1 Build Test & Visual Verification                                   │ │
│  │ • npm run build passes                                                 │ │
│  │ • Visual verification checklist                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## BATCH 1 — Foundation Tasks (Parallel, No Dependencies)

---

### TASK 1.1: Overhaul `src/styles/global.css` with Pastel Dancheong Palette & Ma Spacing

**Type:** auto  
**Files to modify:**  
- `src/styles/global.css` (complete rewrite of color variables and spacing system)  

**Action:**  
Replace the entire color variables section (lines 13-79) with the pastel dancheong palette and implement an 8px-based spacing system for ma (whitespace) principles.

**Exact content specification:**

```css
/* ════════════════════════════════════════════════
   단청 파스텔 팔레트 × 마(여백) 디자인 시스템
   ════════════════════════════════════════════════ */

/* ── Pastel Dancheong Colors ── */
:root {
  /* Dancheong Pastel Interpretation */
  --dancheong-blue-pastel:    #A8D0E6;    /* Dalbang (달방색) */
  --dancheong-red-pastel:     #F5B7B1;    /* Eojang (어장색) */
  --dancheong-yellow-pastel:  #FAD7A0;    /* Hanji (한지색) */
  --dancheong-white-pastel:   #F8F4E3;    /* Sokpaltchi (석판치) */
  --dancheong-black-pastel:   #8FBC8F;    /* Celadon (청자색) */

  /* Neutral Base for Maximum Ma Effect */
  --color-bg:                 #FFFFFF;    /* Pure white background */
  --color-card:               #F8F4E3;    /* Sokpaltchi - warm off-white */
  --color-card-hover:         #F0E8D8;    /* Slightly darker variant */
  --color-text:               #2C3E50;    /* Deep slate for readability */
  --color-text-light:         #7F8C8D;    /* Soft gray for tertiary info */
  --color-text-muted:         #BDC3C7;    /* Lighter gray for hints */
  --color-border:             #E8D8C3;    /* Subtle rice paper tone */
  --color-border-light:       rgba(232, 216, 195, 0.3);

  /* Semantic Colors (mapped from pastels) */
  --color-primary:            var(--dancheong-blue-pastel);
  --color-accent:             var(--dancheong-red-pastel);
  --color-success:            var(--dancheong-yellow-pastel);
  --color-info:               var(--dancheong-blue-pastel);
  --color-warning:            #F39C12;    /* Soft amber */
  --color-error:              #E74C3C;    /* Soft red */

  /* Shadows - Soft and Subtle for Ma Aesthetic */
  --shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md:  0 4px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg:  0 8px 16px rgba(0, 0, 0, 0.10);
  --shadow-xl:  0 12px 24px rgba(0, 0, 0, 0.12);

  /* Glow Effects - Soft and Diffused */
  --glow-blue:    0 0 12px rgba(168, 208, 230, 0.2);
  --glow-red:     0 0 12px rgba(245, 183, 177, 0.2);
  --glow-yellow:  0 0 12px rgba(250, 215, 160, 0.2);
  --glow-green:   0 0 12px rgba(143, 188, 143, 0.2);

  /* Dancheong Pattern Colors */
  --dc-blue:    #A8D0E6;
  --dc-red:     #F5B7B1;
  --dc-yellow:  #FAD7A0;
  --dc-white:   #F8F4E3;
  --dc-black:   #8FBC8F;

  /* System */
  --radius:     12px;
  --radius-sm:  6px;
  --radius-lg:  18px;
  --radius-xl:  24px;
  --transition: 0.3s ease;
  --transition-bounce: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Palace Representative Colors (Pastel Versions) */
  --palace-gyeongbok:  var(--dancheong-blue-pastel);
  --palace-changdeok:  var(--dancheong-red-pastel);
  --palace-changgyeong:#C8A2C8;  /* Lavender pastel */
  --palace-deoksu:     #A8E6CF;  /* Mint green pastel */
  --palace-jongmyo:    var(--dancheong-yellow-pastel);

  /* Bamboo-inspired Spacing System for Ma (8px base) */
  --space-0:   0px;
  --space-1:   4px;   /* half */
  --space-2:   8px;   /* base */
  --space-3:   12px;  /* 1.5x */
  --space-4:   16px;  /* 2x */
  --space-5:   20px;  /* 2.5x */
  --space-6:   24px;  /* 3x */
  --space-7:   28px;  /* 3.5x */
  --space-8:   32px;  /* 4x */
  --space-9:   36px;  /* 4.5x */
  --space-10:  40px;  /* 5x */
}

/* Dark Mode - Soft, Warm Tones (optional - we're focusing on light pastel) */
html.dark {
  --color-bg:           #F8F4E3;    /* Very light warm gray */
  --color-card:         #F0E8D8;    /* Slightly darker */
  --color-card-hover:   #E8D8C3;
  --color-text:         #5D6D7E;    /* Soft muted blue-gray */
  --color-text-light:   #85929E;
  --color-text-muted:   #AAB7B8;
  --color-border:       #D5D8DC;
  --color-border-light: rgba(213, 216, 220, 0.3);
}

/* Apply base styles */
body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.8;  /* Increased for better readability with ma */
  min-height: 100vh;
  min-height: 100dvh;
  transition: background var(--transition), color var(--transition);
}

/* Updated spacing utilities using 8px base */
.p-0 { padding: var(--space-0); }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }
.p-5 { padding: var(--space-5); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }
.p-10 { padding: var(--space-10); }

.m-0 { margin: var(--space-0); }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }
.m-5 { margin: var(--space-5); }
.m-6 { margin: var(--space-6); }
.m-8 { margin: var(--space-8); }
.m-10 { margin: var(--space-10); }

/* Responsive prefixes for mobile-first approach */
@media (min-width: 375px) {
  .p-sm-2 { padding: var(--space-2); }
  .p-sm-4 { padding: var(--space-4); }
  .p-sm-6 { padding: var(--space-6); }
  .p-sm-8 { padding: var(--space-8); }
  .m-sm-2 { margin: var(--space-2); }
  .m-sm-4 { margin: var(--space-4); }
  .m-sm-6 { margin: var(--space-6); }
  .m-sm-8 { margin: var(--space-8); }
}

@media (min-width: 768px) {
  .p-md-2 { padding: var(--space-2); }
  .p-md-4 { padding: var(--space-4); }
  .p-md-6 { padding: var(--space-6); }
  .p-md-8 { padding: var(--space-8); }
  .m-md-2 { margin: var(--space-2); }
  .m-md-4 { margin: var(--space-4); }
  .m-md-6 { margin: var(--space-6); }
  .m-md-8 { margin: var(--space-8); }
}

/* Container with generous max-width and padding */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (max-width: 640px) {
  .container { padding: 0 var(--space-3); }
}
```

**Verify:**
```bash
# Check that pastel colors are defined
grep -c 'dancheong-blue-pastel\|dancheong-red-pastel\|dancheong-yellow-pastel' src/styles/global.css
# Expected: 3

# Check that spacing system is defined
grep -c '--space-[0-9]:' src/styles/global.css
# Expected: 11 (0-10)

# Check that neon variables are removed (should not exist in new palette)
grep -c '--neon-blue\|--neon-red\|--neon-gold' src/styles/global.css | grep -v "disabled"
# Expected: 0 (these should be replaced with pastel equivalents)
```

---

### TASK 1.2: Establish Component Base Classes

**Type:** auto  
**Files to modify:**  
- `src/styles/global.css` (add component base classes)  

**Action:**  
Add foundational component classes that embody the pastel dancheong and ma principles, to be used by DancheongCard, PastelGlow, and other components.

**Exact content specification:**

Add these definitions to global.css (after the spacing utilities, before the "🪄 2026 GLASSMORPHISM SYSTEM" section):

```css
/* ════════════════════════════════════════════════
   컴포넌트 베이클라스 — 단청 파스텔 × 마
   ════════════════════════════════════════════════ */

/* Base Card - Embodies ma through generous padding and subtle borders */
.card-base {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition);
  /* Ma principle: generous internal spacing */
  padding: var(--space-6);
}

/* Hover state - subtle elevation and color shift */
.card-base:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
  background: var(--color-card-hover);
}

/* Base Button - Soft and approachable */
.btn-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 3rem;
  padding: 0 var(--space-4);
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all var(--transition);
  text-decoration: none;
}

/* Primary Button - Uses pastel accent */
.btn-primary {
  background: var(--color-accent);
  color: var(--color-bg);
}

.btn-primary:hover {
  background: var(--color-accent);
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--glow-red);
}

/* Secondary Button - Outline style */
.btn-outline {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-outline:hover {
  background: var(--color-bg);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Icon Button - For navigation and actions */
.icon-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  transition: all var(--transition);
}

.icon-btn:hover {
  background: var(--color-card-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: scale(1.05);
}

/* Badge - Small, informative markers */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-2);
  height: 1.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius);
}

.badge-primary {
  background: var(--color-primary);
  color: var(--color-bg);
}

.badge-accent {
  background: var(--color-accent);
  color: var(--color-bg);
}

.badge-outline {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

/* Input Fields - Clean and spacious */
.input-base {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.95rem;
  transition: all var(--transition);
}

.input-base:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(168, 208, 230, 0.2);
}

.input-base::placeholder {
  color: var(--color-text-light);
  opacity: 0.7;
}

/* Textarea - Same principles as input */
.textarea-base {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.95rem;
  resize: vertical;
  min-height: 6rem;
  transition: all var(--transition);
}

.textarea-base:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(168, 208, 230, 0.2);
}

/* Layout Containers - Emphasizing ma */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

@media (max-width: 640px) {
  .section-container { padding: var(--space-6) var(--space-3); }
}

.content-wrapper {
  /* Encourages asymmetric layouts with breathing room */
  display: grid;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
}

/* Asymmetric layout variants */
.content-wrapper.asymmetric {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .content-wrapper.asymmetric {
    grid-template-columns: 1fr 1fr;
  }
  
  /* Alternate sides for visual interest */
  .content-wrapper.asymmetric > :nth-child(even) {
    direction: rtl;
  }
  
  .content-wrapper.asymmetric > :nth-child(even) > * {
    direction: ltr;
  }
}

/* Spacer - Explicit ma elements */
.spacer-vertical {
  height: var(--space-4);
  width: 100%;
  display: block;
}

.spacer-horizontal {
  width: var(--space-4);
  height: 100%;
  display: block;
}
```

**Verify:**
```bash
# Check that component base classes are defined
grep -c '\.card-base\|\.btn-base\|\.input-base' src/styles/global.css
# Expected: 3

# Check that maspacing principles are evident
grep -c 'var(--space-\[0-9\]\)}' src/styles/global.css | grep -v "/*"
# Expected: Multiple instances showing usage of spacing system
```

---

### TASK 1.3: Establish AI Image Pipeline Structure

**Type:** auto  
**Files to modify:**  
- `scripts/generate-ai-images.mjs` (update prompt structure for pastel aesthetic)  

**Action:**  
Modify the image generation script to use prompts optimized for the pastel dancheong aesthetic rather than neon/vibrant styles.

**Exact content specification:**

Update the `STYLE_PREFIX` and image prompts in `scripts/generate-ai-images.mjs`:

```javascript
// Update the STYLE_PREFIX to reflect pastel dancheong aesthetic
const STYLE_PREFIX = `
  Joseon Dynasty palace Korea, 
  traditional dancheong pastel colors (dalbang, eojang, hanji, sokpaltchi, celadon),
  soft morning light, gentle atmosphere,
  Korean minimalist composition with ma (negative space),
  serene and contemplative mood,
  ultra detailed, photorealistic
`;

// Update existing image prompts to use pastel aesthetic
// Example for gyeongbok-hero:
{
  id: 'gyeongbok-hero',
  prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace Geunjeongjeon main hall at dawn, 
           soft golden light bathing the dancheong pillars, 
           mist gently rising from the courtyard, 
           empty space inviting contemplation,
           traditional Korean architectural harmony`,
  size: '768x1344',
},
// Similar updates for other existing images...

// New image prompts would follow the same pastel aesthetic pattern
```

**Verify:**
```bash
# Check that STYLE_PREFIX contains pastel keywords
grep -c "pastel\|dalbang\|eojang\|hanji\|sokpaltchi\|celadon\|ma\|minimalist\|serene" scripts/generate-ai-images.mjs
# Expected: >= 6 (multiple pastel and aesthetic terms)

# Check that neon/vibrant terms are minimized or removed from prompts
grep -c "neon\|vibrant\|glowing\|bright\|intense" scripts/generate-ai-images.mjs
# Expected: Low count (should be minimized in favor of pastel terms)
```

---

## BATCH 2 — Implementation (Depends on Batch 1)

---

### TASK 2.1: Update Core Components with Pastel Dancheong & Ma Principles

**Type:** auto  
**Files to modify:**  
- `src/components/DancheongCard.astro`  
- `src/components/PastelGlow.astro` (rename from NeonGlow.astro)  
- `src/components/TimeSlider.astro`  
- `src/components/DancheongDivider.astro`  
- `src/components/DancheongBorder.astro`  

**Action:**  
Update components to use the new pastel dancheong color variables and spacing system, embodying ma principles through generous padding and subtle effects.

**Exact content specification:**

**DancheongCard.astro:**
```astro
<!-- Replace dark backgrounds and neon glows with pastel equivalents -->
<div class="card-base">
  <!-- Content remains largely the same but uses new spacing -->
  <div class="card-image">
    <!-- Image handling unchanged -->
  </div>
  <div class="card-content">
    <h3 class="card-title">{title}</h3>
    <p class="card-description">{description}</p>
  </div>
</div>

<!-- Add styles if needed -->
<style>
  /* Use the base card styling with potential enhancements */
  .card-base {
    /* Can add specific overrides if needed */
    border: 1px solid var(--color-border-light);
  }
  
  .card-base:hover {
    /* Enhanced hover for cards */
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }
  
  .card-title {
    color: var(--color-text);
    margin-bottom: var(--space-2);
  }
  
  .card-description {
    color: var(--color-text-light);
    line-height: 1.6;
  }
</style>
```

**PastelGlow.astro** (renamed from NeonGlow.astro):
```astro
<!-- Complete rename and concept shift from neon to pastel glow -->
<div class="pastel-glow">
  <slot />
</div>

<style>
  .pastel-glow {
    /* Soft, diffused glow instead of harsh neon */
    box-shadow: var(--glow-blue);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    background: var(--color-bg);
    transition: all var(--transition);
  }
  
  .pastel-glow:hover {
    /* Subtle intensification on hover */
    box-shadow: var(--glow-red);
    background: var(--color-card-hover);
    transform: translateY(-1px);
  }
  
  /* Variants for different pastel colors */
  .pastel-glow-blue { box-shadow: var(--glow-blue); }
  .pastel-glow-red { box-shadow: var(--glow-red); }
  .pastel-glow-yellow { box-shadow: var(--glow-yellow); }
  .pastel-glow-green { box-shadow: var(--glow-green); }
</style>
```

**TimeSlider.astro:**
```astro
<!-- Softer, more subtle slider implementation -->
<div class="time-slider-container">
  <div class="time-slider-track">
    <div class="time-slider-fill" style="width: {progress}%"></div>
    <div class="time-slider-thumb" 
         style="left: {position}%"
         aria-label="Time position"
         role="slider"
         aria-valuemin="0"
         aria-valuemax="100"
         aria-valuenow={position}
         tabindex="0">
    </div>
  </div>
  <div class="time-labels">
    <span class="time-label past">{startTime}</span>
    <span class="time-label future">{endTime}</span>
  </div>
</div>

<style>
  .time-slider-container {
    position: relative;
    height: 3rem;
    margin: var(--space-6) 0;
  }
  
  .time-slider-track {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--color-border-light);
    border-radius: 2px;
    transform: translateY(-50%);
  }
  
  .time-slider-fill {
    position: absolute;
    top: 50%;
    left: 0;
    height: 4px;
    background: var(--color-primary);
    border-radius: 2px;
    transform: translateY(-50%);
    transition: width 0.3s ease;
  }
  
  .time-slider-thumb {
    position: absolute;
    top: 50%;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--color-bg);
    border: 2px solid var(--color-primary);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
  }
  
  .time-slider-thumb:hover,
  .time-slider-thumb:focus,
  .time-slider-thumb[aria-pressed="true"] {
    width: 1.75rem;
    height: 1.75rem;
    box-shadow: var(--glow-primary);
  }
  
  .time-labels {
    display: flex;
    justify-content: space-between;
    margin-top: var(--space-2);
    font-size: 0.75rem;
    color: var(--color-text-light);
  }
  
  .time-label.past { text-align: left; }
  .time-label.future { text-align: right; }
</style>
```

**DancheongDivider.astro & DancheongBorder.astro:**
Update these to use the pastel dancheong colors instead of the vibrant ones.

**Verify:**
```bash
# Check component files reference new color variables
grep -c 'var(--dancheong-.*-pastel)\|var(--color-primary)\|var(--color-accent)' src/components/*.astro
# Expected: Multiple instances across components

# Check that old neon variables are not used (except potentially in comments)
grep -c 'var(--neon-)' src/components/*.astro | grep -v "//\|/\*"
# Expected: 0 or very low (only in comments/documentation if present)
```

---

### TASK 2.2: Generate Core AI Images with Pastel Aesthetic

**Type:** auto  
**Files to modify:**  
- `scripts/generate-ai-images.mjs` (ensure it uses updated pastel prompts)  
- Files to create: `public/images/generated/*-{sm,md,lg}.webp`  

**Action:**  
Run the image generation script to create the core set of images using the pastel dancheong aesthetic prompts.

**Exact content specification:**

**Step 1:** Verify the script uses pastel-oriented prompts (from Task 1.3)

**Step 2:** Run the generation script:
```bash
HF_TOKEN=$(grep HF_TOKEN ~/.env.common | cut -d '=' -f2) node scripts/generate-ai-images.mjs
```

**Step 3:** Generate the core 5 images plus any additional dancheong pattern/images needed:
- gyeongbok-hero (main palace entrance)
- gyeonghoeru-night (pavilion reflection)
- changdeokgung-secret (secret garden pathway)
- jongno-joseon (historical street scene)
- deoksugung-modern (traditional/modern fusion)
- Plus any pattern/texture images needed for dancheong-divider, etc.

**Verify:**
```bash
# Check that images were generated with correct naming
ls -la public/images/generated/ | grep webp
# Expected: At least 15 files (5 images × 3 sizes)

# Verify specific core images exist
for img in gyeongbok-hero gyeonghoeru-night changdeokgung-secret jongno-joseon deoksugung-modern; do
  echo "$img: $(ls public/images/generated/${img}-{sm,md,lg}.webp 2>/dev/null | wc -l) files"
done

# Verify images use correct dimensions (should be 9:16 ratio for mobile-first)
# 375x667 (sm), 768x1344 (md), 1200x2133 (lg) approximately
```

---

## BATCH 3 — Verification

---

### TASK 3.1: Build Test and Visual Verification

**Type:** checkpoint:human-verify  
**What-built:** All Phase 1 changes — pastel dancheong color palette, ma spacing system, updated components, AI image pipeline with pastel aesthetic, core image generation.

**How to verify:**

**Step 1 — Build:**
```bash
npm run build
```
Expected: Build succeeds with exit code 0. No errors. No warnings about missing images or invalid CSS variables.

**Step 2 — Local dev server check:**
```bash
npm run dev
```
Open `http://localhost:4321` in browser.

**Step 3 — Visual verification checklist:**

| # | Check | Expected | Pass/Fail |
|---|-------|----------|-----------|
| 1 | Base colors | Page background is pure white (`#FFFFFF`) | |
| 2 | Card surfaces | Cards use warm off-white (`#F8F4E3`) | |
| 3 | Primary text | Text uses dark slate (`#2C3E50`) for readability | |
| 4 | Secondary text | Tertiary info uses soft gray (`#7F8C8D`) | |
| 5 | Borders | Subtle rice paper tone (`#E8D8C3`) | |
| 6 | Primary actions | Buttons use pastel red (`#F5B7B1`) | |
| 7 | Accent elements | Highlights use pastel yellow (`#FAD7A0`) | |
| 8 | Spacing | Consistent 8px-based spacing visible throughout | |
| 9 | Ma evident | Generous padding/margins, asymmetric layouts with breathing room | |
| 10 | Component styling | DancheongCard uses card-base with pastel hover effects | |
| 11 | Pastel glow | PastelGlow shows soft blue/red/yellow/green glows | |
| 12 | Slider | TimeSlider uses soft pastel fills and subtle shadows | |
| 13 | Dividers | DancheongDivider uses pastel dancheong colors | |
| 14 | Borders | DancheongBorder uses pastel dancheong patterns | |
| 15 | Image loading | Core AI images load correctly from `/images/generated/` | |
| 16 | Image aesthetic | Images show pastel dancheong colors, soft lighting, ma composition | |
| 17 | Responsiveness | Spacing and layout adapt correctly to mobile breakpoints | |
| 18 | prefers-reduced-motion | Animations respect reduced motion setting | |
| 19 | No neon remnants | No visible neon blues/pinks/yellows in final design | |
| 20 | Text readability | All text meets 4.5:1 contrast ratio on backgrounds | |

**Step 4 — Technical verification:**

| # | Check | Expected | Pass/Fail |
|---|-------|----------|-----------|
| 21 | CSS variables | All `--dancheong-*-pastel` and `--color-*` variables defined | |
| 22 | Spacing system | `--space-0` through `--space-10` defined and used | |
| 23 | Component classes | `card-base`, `btn-base`, etc. used in components | |
| 24 | No deprecated vars | `--neon-blue`, `--neon-red`, `--neon-gold` not used in production CSS | |
| 25 | Image optimization | Generated images are WebP format with appropriate compression | |

**Step 5 — Console check:**
Open browser DevTools console. Expected: No 404 errors for missing images, no JavaScript errors, no CSS warnings about undefined variables.

**Step 6 — Lighthouse audit (optional but recommended):**
```bash
npx lighthouse http://localhost:4321 --view --preset=mobile
```
Check for: Performance, Accessibility, Best Practices, SEO scores.

**Resume signal:**
```
approved
```
Or list any issues found.

---