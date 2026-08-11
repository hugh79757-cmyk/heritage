# AI Image Prompts — K-Heritage Guide

**모델:** black-forest-labs/FLUX.1-schnell  
**사이즈:** 768×1344 (9:16 모바일)  
**num_inference_steps:** 4  
**출력:** `public/images/generated/{id}-{sm,md,lg}.webp` (375w / 768w / 1200w)

---

## Style Prefix (공통)

```
Joseon Dynasty palace Korea, traditional dancheong colors (red, blue, gold), night scene, warm moonlight, subtle traditional lantern light on architecture, cinematic lighting, realistic photography, natural colors, ultra detailed, photorealistic, 8K, shot on professional camera
```

---

## PHASE 2 — KDH Scene Images (필수, 8개)

### 1. kdh-hero
KDH 페이지 히어로 — 경복궁 근정전 결전
```
{prefix}, Gyeongbokgung Palace Geunjeongjeon at night, dramatic action scene composition, red and blue dancheong pillars lit by moonlight and lanterns, heroic epic scale, cinematic movie still style, moonlight casting dramatic shadows, 9:16 mobile portrait
```

### 2. kdh-gyeongbokgung
KDH 씬 — 경복궁 메인 안뜰
```
{prefix}, Gyeongbokgung Palace main courtyard at night, dramatic standoff under full moon, characters between dancheong pillars, warm lantern light and cool moonlight contrast, traditional lanterns, dramatic cinematic composition, 9:16 mobile portrait
```

### 3. kdh-bukchon
KDH 씬 — 북촌 한옥마을 추격
```
{prefix}, Bukchon Hanok Village narrow alleyway at night, chase scene through traditional Korean houses with curved tiled roofs, warm golden light spilling from hanok windows, cinematic motion blur, dramatic perspective looking down alley, realistic night photography, 9:16 mobile portrait
```

### 4. kdh-naksan
KDH 씬 — 낙산공원 성곽
```
{prefix}, Naksan Park Seoul City Wall at night, rooftop chase along ancient fortress wall, Seoul skyline glowing in background, full moon, warm lantern light on stone wall, dramatic height perspective looking down at city lights, realistic nightscape, 9:16 mobile portrait
```

### 5. kdh-nseoul-tower
KDH 씬 — N서울타워 클라이맥스
```
{prefix}, N Seoul Tower at night seen from observation deck, climactic confrontation scene, Seoul city lights far below spread across skyline, cinematic wide angle, dramatic clouds illuminated by city glow, realistic night photography, 9:16 mobile portrait
```

### 6. kdh-gwanghwamun
KDH 씬 — 광화문광장 오프닝
```
{prefix}, Gwanghwamun Square at night with King Sejong statue silhouette, dramatic opening chase scene wide shot, street reflections on wet ground after rain, government buildings softly lit in background, cinematic movie still, realistic urban night, 9:16 mobile portrait
```

### 7. kdh-insadong
KDH 씬 — 인사동 전통시장
```
{prefix}, Insadong traditional street at night, bustling market scene, traditional Korean tea houses and art galleries, paper lanterns hanging overhead casting warm light on cobblestone street, cinematic depth with crowd activity, realistic street photography, 9:16 mobile portrait
```

### 8. gyeongbok-hero
홈페이지 히어로 — 경복궁 근정전 입구
```
{prefix}, Gyeongbokgung Palace Geunjeongjeon main hall at night, grand entrance view, full moon illuminating golden roof tiles, red and blue dancheong pillars under moonlight, palace courtyard with stone pavement, majestic cinematic wide shot, 9:16 mobile portrait
```

---

## Original Images (있으면 좋음, 5개)

### 9. gyeonghoeru-night
경회루 야경
```
{prefix}, Gyeonghoeru Pavilion reflected in moonlit pond, lotus flowers, 9:16 mobile portrait
```

### 10. changdeokgung-secret
창덕궁 비원
```
{prefix}, Changdeokgung Secret Garden pavilion surrounded by autumn foliage, warm golden lanterns, mysterious atmosphere, 9:16 mobile portrait
```

### 11. jongno-joseon
종로 조선 거리
```
{prefix}, Joseon era Jongno street scene, merchants and nobles in colorful hanbok, traditional shop signs, lantern festival, 9:16 mobile portrait
```

### 12. deoksugung-modern
덕수궁 석조전
```
{prefix}, Deoksugung Palace Seokjojeon Western-style building at night, contrast of modern and traditional architecture, 9:16 mobile portrait
```

---

## 실행 명령어

```bash
cd /Users/twinssn/Projects/heritage
HF_TOKEN="your-token" node scripts/generate-ai-images.mjs
```

생성된 파일: `public/images/generated/{id}-{sm,md,lg}.webp` (각 이미지당 3개 = 총 36개)
