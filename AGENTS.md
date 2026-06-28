# K-Heritage Guide v3.0 — "조선 단청 × 현대 네온 × AI 복원"
# Agent Instructions — MOBILE FIRST, ZERO COST, WORLD FIRST

---

## 0. 프로젝트 선언

**이 사이트는 세상에 없던 것을 만든다.**

케이팝 데몬 헌터스가 전 세계에 보여준 것:
"조선의 공간은 고리타분하지 않다. 화려하고 살아있다."

K-Heritage Guide가 할 것:
그 감성으로 경복궁·경회루·종로를 **웹에서 경험**하게 한다.

단청 오방색 × 네온 글로우 × AI 복원 이미지 × 스크롤 시네마틱
= 문화재 안내 사이트가 아닌 **몰입형 문화 경험 플랫폼**

**모든 설계의 기준: 모바일 퍼스트**
데스크톱은 보너스다. 모바일이 전부다.

---

## 1. 비주얼 시스템 — "단청 네온 팔레트"

### 1.1 오방색 기반 컬러 시스템

```css
/* 단청 오방색을 현대적으로 재해석 */
:root {
  /* 청(靑) — 동쪽, 봄, 목 */
  --dancheong-blue:    #1B4FD8;  /* 전통 군청 */
  --neon-blue:         #00C8FF;  /* 글로우 버전 */

  /* 적(赤) — 남쪽, 여름, 화 */
  --dancheong-red:     #C8231E;  /* 전통 주홍 */
  --neon-red:          #FF3B5C;  /* 글로우 버전 */

  /* 황(黃) — 중앙, 땅, 토 */
  --dancheong-yellow:  #E8A020;  /* 전통 황금 */
  --neon-gold:         #FFD700;  /* 글로우 버전 */

  /* 백(白) — 서쪽, 가을, 금 */
  --dancheong-white:   #F5F0E8;  /* 따뜻한 백 */

  /* 흑(黑) — 북쪽, 겨울, 수 */
  --dancheong-black:   #0A0806;  /* 깊은 흑 */

  /* 배경 — 밤의 궁궐 */
  --bg-night:          #080510;  /* 극도로 어두운 남색 */
  --bg-card:           #12101A;

  /* 글로우 효과 */
  --glow-blue:   0 0 20px rgba(0,200,255,0.6);
  --glow-red:    0 0 20px rgba(255,59,92,0.6);
  --glow-gold:   0 0 20px rgba(255,215,0,0.5);
}
```

### 1.2 타이포그래피

```
제목 (한국어): Noto Serif KR — 전통적 무게감
제목 (영어):   Cormorant Garamond — 우아한 세리프
본문:          Pretendard — 가독성
강조/숫자:     Gmarket Sans Bold — 현대적 임팩트

모바일 기준 폰트 사이즈:
- 히어로 제목: clamp(2rem, 8vw, 4rem)
- 섹션 제목:   clamp(1.4rem, 5vw, 2.4rem)
- 본문:        1rem (16px 고정)
```

### 1.3 단청 문양 CSS 패턴

```css
/* 단청 패턴을 SVG로 구현 — 이미지 없이 순수 CSS */
.dancheong-border {
  border-image: url("data:image/svg+xml,...") 20 round;
}
.dancheong-divider {
  background: repeating-linear-gradient(
    90deg,
    var(--dancheong-red) 0px,
    var(--dancheong-red) 8px,
    var(--dancheong-yellow) 8px,
    var(--dancheong-yellow) 16px,
    var(--dancheong-blue) 16px,
    var(--dancheong-blue) 24px,
    var(--dancheong-white) 24px,
    var(--dancheong-white) 32px
  );
  height: 4px;
}
```

---

## 2. 기술 스택 — 무료 티어 완전 활용

### 2.1 확정 스택

```
레이어           기술                    이유
─────────────────────────────────────────────────
프레임워크       Astro 5.17.1 SSR        기존 유지
런타임           Cloudflare Workers      무료, 엣지
DB               Cloudflare D1           무료
이미지 저장      Cloudflare R2           10GB 무료
CDN              Cloudflare (자동)       무료, 글로벌
─────────────────────────────────────────────────
애니메이션       GSAP (무료 tier)        ScrollTrigger
                 → 모바일: reduced       성능 보장
3D/WebGL         Three.js (CDN)          경량 씬만
                 → 모바일: CSS 3D로 폴백
스크롤 효과      CSS scroll-driven       네이티브, 무료
                 animations (Chrome 115+)
파티클           tsParticles (무료)      벚꽃/눈/불꽃
─────────────────────────────────────────────────
AI 이미지        Hugging Face            무료 크레딧
                 (FLUX.1-schnell)        빌드타임 생성
                 → 런타임 아님           정적 이미지로 저장
지도             MapLibre GL JS 4.7.1    기존 유지
폰트             Google Fonts CDN        무료
```

### 2.2 모바일 성능 원칙

```
Three.js 사용 기준:
- 모바일 GPU 탐지 → 저사양이면 CSS 3D로 자동 폴백
- 씬당 폴리곤 제한: 50,000개 이하
- 텍스처: 512×512 이하 (모바일)
- requestAnimationFrame 중단: 탭 비활성시

GSAP 사용 기준:
- prefers-reduced-motion 감지 → 애니메이션 OFF
- 모바일에서 ScrollTrigger scrub 값: 0.5 이하
- transform만 사용 (layout 재계산 금지)
- will-change: transform 선언 필수

이미지 원칙:
- 모든 이미지: WebP 포맷
- srcset: 375w, 768w, 1200w 3단계
- 기본 표시: 375w (모바일 우선)
- lazy loading: 폴드 아래 전부
- aspect-ratio: 반드시 명시 (CLS 방지)
- AI 생성 이미지: 빌드타임에 생성 후 R2에 저장
  (런타임 API 호출 없음 → 속도 + 비용 절약)
```

---

## 3. 페이지 설계 — 모바일 시네마틱

### 3.1 홈페이지 — "밤의 경복궁 입장"

```
섹션 1: 히어로 (풀스크린, 세로형)
───────────────────────────────
[AI 복원 경복궁 야경 이미지 — 단청 네온 버전]
화면 중앙: "景福宮" (한자, Noto Serif KR, 금빛 글로우)
아래: "조선의 화려함이 깨어난다" (한국어)
      "The Palace Awakens" (영어)
스크롤 유도: 단청 문양 bounce 화살표

애니메이션:
- 입장 시: 궁궐 문이 양쪽으로 열리는 효과 (CSS clip-path)
- 배경: 미세한 불빛 파티클 (tsParticles, 모바일 30개 제한)
- 타이틀: 글자가 단청 색상으로 순서대로 채워짐

섹션 2: 타임슬라이더
───────────────────────────────
드래그/스와이프로 시간 이동:
[1395년 준공] ←──────── 슬라이더 ────────→ [현재]

조선 전성기: AI 복원 채색 이미지 (화려한 단청)
현재:        실제 사진 (탈색된 현재 모습)

모바일: 터치 스와이프로 조작
데스크톱: 마우스 드래그

구현: CSS clip-path + touch events
이미지: 빌드타임 AI 생성 후 R2 저장

섹션 3: 5대 궁궐 카드
───────────────────────────────
세로 스크롤 (모바일 전체 너비)
각 카드:
- 풀너비 AI 생성 야경 이미지 (9:16 비율)
- 궁궐 이름 (한자 + 한국어 + 영어)
- 대표 문구 한 줄
- 단청 색상 글로우 테두리

섹션 4: 케데헌 연결 섹션
───────────────────────────────
제목: "케이팝 데몬 헌터스 속 그 장소"
      "Real Locations from KPop Demon Hunters"

케데헌에 등장한 실제 서울 장소 →
K-Heritage Guide 해당 페이지 연결

※ 이게 핵심 트래픽 훅
  "gyeongbokgung kpop demon hunters" 검색자 포획
```

### 3.2 궁궐 상세 페이지 — "시네마틱 투어"

```
구조 (모바일 세로 스크롤):

[1] 시네마틱 히어로
    - 스크롤하면 카메라가 궁궐 문으로 "들어가는" 효과
    - CSS perspective + translateZ

[2] 조선/현재 비교
    - 좌우 슬라이드로 AI 복원 vs 현재 사진 비교
    - 모바일 터치 최적화

[3] 건물 카드 그리드
    - 2열 (모바일) / 3열 (데스크톱)
    - 카드: 단청 테두리 + 네온 호버/탭 효과
    - 탭하면 상세 페이지

[4] 케데헌 연결
    - 이 궁궐이 케데헌에서 어떻게 등장했는지

[5] 오디오 가이드
    - 국가유산청 나레이션 API
    - 커스텀 플레이어 (단청 디자인)
    - 언어 자동 선택 (getLang 기반)

[6] 이달의 행사
    - 국가유산청 행사 API
    - 캘린더 카드 형식
```

### 3.3 /kpop-demon-hunters 전용 페이지 ★ 핵심

```
URL: /kpop-demon-hunters
제목: "KPop Demon Hunters — Real Seoul Locations Guide"

이 페이지가 첫 번째 트래픽 엔진이다.

내용:
- 케데헌에 등장한 서울 장소 완전 가이드
- 경복궁, 북촌한옥마을, 낙산공원, N서울타워...
- 각 장소: 실제 위치 + 영화 장면 설명 + K-Heritage 링크
- 지도: MapLibre로 성지순례 루트 표시
- 다국어: 영어/중국어/일본어

타깃 키워드:
"kpop demon hunters real locations"
"kpop demon hunters gyeongbokgung"
"kpop demon hunters seoul guide"
"케이팝 데몬 헌터스 촬영지"
```

---

## 4. AI 이미지 파이프라인 — 빌드타임 생성

### 4.1 전략

```
❌ 런타임 AI API 호출 (느리고 돈 나감)
✅ 빌드타임에 생성 → R2에 저장 → 정적 제공

프로세스:
1. scripts/generate-ai-images.mjs 실행 (로컬)
2. Hugging Face FLUX.1-schnell API 호출
3. WebP 변환 + 3단계 리사이즈 (375/768/1200)
4. Cloudflare R2 업로드
5. 빌드시 R2 URL 참조
```

### 4.2 프롬프트 전략 — "조선 단청 × 네온" 스타일

```javascript
// scripts/generate-ai-images.mjs
const STYLE_PREFIX = `
  Joseon Dynasty palace Korea, 
  traditional dancheong colors (red, blue, gold, white),
  night scene, neon glow effect on traditional architecture,
  cinematic lighting, vibrant colors, 
  KPop Demon Hunters animation style,
  mobile portrait orientation 9:16,
  ultra detailed, photorealistic
`;

const IMAGES = [
  {
    id: 'gyeongbok-hero',
    prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace Geunjeongjeon 
             main hall, full moon, golden lanterns, 
             red and blue dancheong pillars glowing`,
    size: '768x1344'  // 9:16 모바일 비율
  },
  {
    id: 'gyeonghoeru-night',
    prompt: `${STYLE_PREFIX}, Gyeonghoeru Pavilion reflected 
             in moonlit pond, lotus flowers, 
             teal neon water reflection`,
    size: '768x1344'
  },
  {
    id: 'jongno-joseon',
    prompt: `${STYLE_PREFIX}, Joseon era Jongno street scene,
             merchants and nobles, colorful hanbok,
             traditional shop signs, lantern festival`,
    size: '768x1344'
  }
  // ... 궁궐별 히어로, 건물별 카드, 비교용 복원 이미지
];
```

### 4.3 Hugging Face 무료 설정

```javascript
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);
// 무료 토큰: https://huggingface.co/settings/tokens

const result = await hf.textToImage({
  model: "black-forest-labs/FLUX.1-schnell",
  inputs: prompt,
  parameters: {
    width: 768,
    height: 1344,  // 9:16 모바일
    num_inference_steps: 4,  // schnell은 4스텝으로 충분
  }
});
```

---

## 5. 핵심 컴포넌트

### 5.1 TimeSlider.astro — 조선/현재 비교

```
모바일 터치 스와이프로 시간 이동
왼쪽: AI 복원 조선시대 이미지
오른쪽: 현재 실제 사진
중앙: 드래그 핸들 (단청 문양)

구현: CSS clip-path + Pointer Events API
Three.js 불필요 — 순수 CSS/JS
```

### 5.2 PalaceHero.astro — 시네마틱 입장

```
CSS scroll-driven animation:
스크롤 0%:   문 닫힘 (clip-path: polygon 양쪽 닫힘)
스크롤 30%:  문이 열리며 궁궐 내부 드러남
스크롤 60%:  카메라가 앞으로 이동 (scale + translateZ)
스크롤 100%: 완전 입장, 콘텐츠 시작

모바일: touch-action: pan-y 유지 (스크롤 방해 금지)
```

### 5.3 DancheongCard.astro — 건물 카드

```
기본 상태:
- 어두운 배경 (#12101A)
- 궁궐 이미지 (WebP, lazy)
- 건물명 (한자 + 한국어)
- 하단: 단청 색상 그라디언트 오버레이

탭/호버 상태:
- 단청 테두리 글로우 애니메이션
- 해당 궁궐 대표색 (경복궁=청, 창덕궁=적 등)
- 건물 설명 슬라이드업

모바일 터치: active: scale(0.98) 햅틱 피드백 유도
```

### 5.4 NeonGlow.astro — 재사용 글로우 효과

```css
.neon-text-gold {
  color: var(--neon-gold);
  text-shadow:
    0 0 7px var(--neon-gold),
    0 0 10px var(--neon-gold),
    0 0 21px var(--neon-gold),
    0 0 42px #FFD700,
    0 0 82px #FFD700;
}

/* 모바일에서 과도한 그림자 제한 */
@media (max-width: 640px) {
  .neon-text-gold {
    text-shadow:
      0 0 7px var(--neon-gold),
      0 0 21px var(--neon-gold);
  }
}
```

---

## 6. 트랙 재정의

### TRACK A — 비주얼 기반 구축 ★★★ 최우선

```
A-1: global.css 전면 교체
     → 단청 네온 팔레트 + 다크 배경 시스템
A-2: Layout.astro 업데이트
     → 새 폰트 (Cormorant Garamond 추가)
     → 새 컬러 변수
A-3: DancheongCard 컴포넌트
A-4: NeonGlow 컴포넌트
A-5: 단청 SVG 문양 라이브러리 제작
     (divider, border, pattern 3종)
```

### TRACK B — AI 이미지 파이프라인 ★★★

```
B-1: scripts/generate-ai-images.mjs 작성
     → HF FLUX.1-schnell 연동
     → 9:16 모바일 비율 기준
     → WebP 변환
B-2: Cloudflare R2 버킷 설정
     → wrangler.jsonc R2 바인딩 추가
B-3: 궁궐별 히어로 이미지 생성 (5개)
B-4: 경회루 야경 이미지 생성 (시그니처)
B-5: 조선/현재 비교용 복원 이미지 생성
```

### TRACK C — 핵심 페이지 구현 ★★★

```
C-1: 홈 히어로 — 궁궐 문 열림 애니메이션
C-2: TimeSlider 컴포넌트 (조선/현재 비교)
C-3: /kpop-demon-hunters 페이지 ← SEO 핵심
C-4: 궁궐 상세 페이지 리뉴얼
C-5: 건물 카드 그리드 (DancheongCard)
```

### TRACK D — 데이터 연동 ★★

```
D-1: D1 실제 연동 (palace_data.json → D1)
D-2: 나레이션 API → 오디오 가이드 컴포넌트
D-3: 행사 API → 이달의 행사 섹션
D-4: /guide SEO 콘텐츠 페이지
```

### TRACK E — 성능 최적화 ★★

```
E-1: 모바일 Core Web Vitals
     LCP < 2.5s / FID < 100ms / CLS < 0.1
E-2: 이미지 최적화 자동화
     (srcset, WebP, lazy)
E-3: Three.js 모바일 폴백 시스템
E-4: prefers-reduced-motion 대응
```

---

## 7. 실행 순서

```
PHASE 1 — 비주얼 혁신 (1~2주)
  A-1 (global.css 전면 교체)
  → A-3, A-4, A-5 (컴포넌트)
  → B-1, B-2 (AI 파이프라인)
  → B-3, B-4 (핵심 이미지 생성)
  결과물: 새로운 비주얼의 홈 화면

PHASE 2 — 트래픽 훅 (2~3주)
  C-3 (/kpop-demon-hunters 페이지) ← 즉시
  → C-1, C-2 (홈 시네마틱)
  → C-4, C-5 (궁궐 상세)
  결과물: 케데헌 트래픽 포획 시작

PHASE 3 — 데이터 심화 (4~6주)
  D-1 → D-2 → D-3
  → D-4 (SEO 가이드 콘텐츠)
  결과물: 오디오 가이드 + 행사 정보

PHASE 4 — 최적화 (6~8주)
  E-1 ~ E-4
  → AdSense 배치 최적화
  결과물: Core Web Vitals 그린, 수익화 안정
```

---

## 8. 성공 지표 (수정)

```
1개월: 새 비주얼 런칭, /kpop-demon-hunters 인덱싱
3개월: 일 방문자 500~1,000명
       "kpop demon hunters real locations" 검색 상위
6개월: 일 방문자 1,500~3,000명
       AdSense 월 $150~300
9개월: 일 방문자 3,000~5,000명
       AdSense 월 $300~600 ← 목표 초과 달성
       템플릿 완성 → 다음 사이트 준비
```

---

## 9. 하지 말아야 할 것

```
성능:
- 모바일에서 Three.js 씬 2개 이상 동시 실행 금지
- 런타임 AI API 호출 금지 (빌드타임만)
- 폴드 위 autoplay 동영상 금지
- GIF 사용 금지 (WebP 애니메이션으로 대체)

SEO:
- 케데헌 저작권 이미지 직접 사용 금지
  (설명 텍스트 + 자체 AI 생성 이미지만)
- AdSense 코드 수정 금지
- 검증 메타태그 삭제 금지

기존 유지:
- palace_data.json (Phase 3 전 읽기 전용)
- wrangler.jsonc D1 바인딩 ID
- khs.go.kr API 클라이언트 직접 호출 금지
```

---

## 10. 시작 명령어

```bash
claude

# 첫 메시지:
"AGENT.md를 읽어줘.
PHASE 1부터 시작한다.
[TRACK A-1] global.css를 
단청 네온 팔레트 시스템으로 전면 교체해줘.
현재 파일을 먼저 읽고 진행해."
```
