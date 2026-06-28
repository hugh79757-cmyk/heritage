# K-Heritage Guide — 개발 진행 기록
> 마지막 업데이트: 2026-06-22

---

## 긴급 수정 내역 (2026-06-22)

### FIX 1: FAQ 언어 혼재 수정
- `kpop-demon-hunters.astro` — FAQ를 `faqByLang` 객체로 4개 언어 분리
- lang=kr → 한국어, lang=en → 영어, lang=ja → 일본어, lang=zh → 중국어

### FIX 2: 낙산공원 이미지 깨짐
- HTTP 외부 URL (`khs.go.kr`) → 로컬 `/geunjeongjeon-night.jpg`로 교체

### FIX 3: 민화 배경 CSS 준비
- `global.css`에 `.minhwa-bg`, `.minhwa-divider` 클래스 추가
- `kpop-demon-hunters.astro`에 민화 구분선 자리 마련

### FIX 4: 텍스트 마스크 효과
- 홈 히어로 타이틀에 `hero-title-mask` 클래스 적용
- `background-clip: text` + 이미지 마스킹 + 밝기/채도 강화

### FIX 5: 카드 호버 글로우 리플
- `DancheongCard.astro`에 마우스 위치 추적 radial-gradient
- `--mouse-x`, `--mouse-y` CSS 변수로 빛 추적
- 모바일(`pointer: coarse`)에서는 비활성화

### FIX 6: 단청 문양 파티클
- 홈 히어로에 CSS 애니메이션 기반 파티클 15개
- 색상: 골드(40%), 블루(30%), 레드(30%)
- `prefers-reduced-motion` 대응

### FIX 7: 민화 호랑이-까치 이미지 적용
- `public/minhwa-tiger-magpie.jpeg` (네이비 배경 + 골드 라인아트)
- 홈 히어로 하단 reveal 섹션 (스크롤 reveal 애니메이션)
- 케데헌 페이지 순례루트-FAQ 사이 구분선
- 푸터 배경 (opacity 0.08 은은하게)
- 모바일 280px / 데스크톱 380px

### FIX 8: 지도 리뉴얼
- 중심: 경복궁 (126.9769, 37.5760) / zoom 14 / minZoom 11
- 커스텀 마커: 핀 형태 + 펄스 애니메이션 + 궁궐별 대표색
- 팝업: 골드 테두리 + 설명 + 페이지 링크
- 둥둥 카드 슬라이더: 6개 장소 수평 스크롤 + 떠다니는 애니메이션
- 카드 클릭 → 해당 마커 팝업 자동 열기
- `prefers-reduced-motion` 대응

### FIX 9: TourAPI 사진 수집 + TimeSlider + 카드 이미지
- **PhotoGalleryService1 API** 사용 확인 (KorService1/2 아님)
- 6개 장소 사진 수집 완료 (`public/tour-images/`)
  - gyeongbokgung.jpg (725KB), bukchon.jpg (453KB), naksan.jpg (1.5MB)
  - gwanghwamun.jpg (956KB), insadong.jpg (823KB), nseoul.jpg (554KB)
- TimeSlider: props 기반 (beforeSrc/afterSrc) — 조선: geunjeongjeon-night.jpg, 현재: TourAPI 사진
- 케데헌 카드: 6개 전부 TourAPI 실제 사진으로 교체
- 카드 이모지 → 컬러 도트 인디케이터
- 지도 zoom 13→14

### FIX 10: 가이드 페이지 언어 혼재 전수 수정
- **FAQSection 컴포넌트**: `Record<string, FAQItem[]>` 타입 추가 (언어별 FAQ 지원)
- **gyeongbokgung.astro**: FAQ + 본문 콘텐츠 전부 4개 언어 분리
- **나머지 8개 guide 페이지**: `faqItems` → `faqByLang` 변환 (KR/EN/JA/ZH)
- 수정 파일: FAQSection.astro, gyeongbokgung.astro, changdeokgung.astro, changgyeonggung.astro, deoksugung.astro, jongmyo.astro, secret-garden.astro, palace-ticket.astro, palace-hours.astro, night-tour.astro

### UI 품질 개선 (ui-skills 적용)
- `min-height: 100dvh` (모바일 주소창 대응)
- `text-wrap: balance` (h1-h3), `text-wrap: pretty` (p, li)
- letter-spacing -0.03em → -0.02em
- hero-title-mask filter 완화 (brightness 1.2, saturate 1.3)

---

## 전체 진단 결과 (2026-06-22)

### 페이지 상태 — 전부 200 정상
| 경로 | 상태 |
|------|------|
| `/` | ✅ 200 |
| `/kpop-demon-hunters` | ✅ 200 |
| `/guide` | ✅ 200 |
| `/guide/gyeongbokgung` | ✅ 200 |
| `/guide/changdeokgung` | ✅ 200 |
| `/guide/changgyeonggung` | ✅ 200 |
| `/guide/deoksugung` | ✅ 200 |
| `/guide/jongmyo` | ✅ 200 |
| `/guide/secret-garden` | ✅ 200 |
| `/guide/palace-ticket` | ✅ 200 |
| `/guide/palace-hours` | ✅ 200 |
| `/guide/night-tour` | ✅ 200 |
| `/palace/1` | ✅ 200 |
| `/palace/2` | ✅ 200 |
| `/palace/3` | ✅ 200 |
| `/palace/4` | ✅ 200 |
| `/palace/5` | ✅ 200 |
| `/sitemap.xml` | ✅ 200 |

### 수정 사항
1. **네온 글로우 번짐 축소** — global.css `.neon-text-gold` 5단계→2단계로 축소
2. **궁궐 페이지 text-shadow 축소** — `[id].astro`, `[id]/[code].astro` 30px→12px
3. **도메인 라우팅 수정** — Cloudflare Pages 프로젝트 삭제 → Workers로 라우팅

### public 이미지 현황
| 파일 | 크기 | 상태 |
|------|------|------|
| og-image.jpg | 848KB | ✅ |
| geunjeongjeon-night.jpg | 780KB | ✅ |
| gyeonghoeru-night.jpg | 872KB | ✅ |
| jongno-joseon.jpg | 1.0MB | ✅ |
| favicon.svg | 716KB | ⚠️ 과대 |
| apple-touch-icon.png | 60KB | ✅ |
| favicon.ico | 16KB | ✅ |

---

## 프로젝트 개요

**K-Heritage Guide**는 한국 5대 궁궐을 4개 언어로 소개하는
"조선 단청 × 현대 네온 × AI 복원" 콘셉트의 몰입형 문화 경험 웹앱.

| 항목 | 값 |
|------|-----|
| URL | https://heritage.aikorea24.kr |
| 프레임워크 | Astro 5.17.1 (SSR) |
| 런타임 | Cloudflare Workers |
| DB | Cloudflare D1 (heritage-db) |
| 이미지 저장 | Cloudflare R2 |
| 언어 | 한국어, 영어, 일본어, 중국어 |
| 수익화 | Google AdSense |

---

## 콘셉트

### 비주얼 아이덴티티
**"조선 단청 × 현대 네온 × AI 복원"**

케이팝 데몬 헌터스(넷플릭스)가 보여준 감성:
→ 전통 단청 오방색 + 네온 글로우 + 조선시대 화려함 재현
→ 고리타분한 문화재 사이트가 아닌 몰입형 경험 플랫폼
→ 모바일 퍼스트 (9:16 세로 구도 기준 설계)

### 수익화 전략
- AdSense 월 $200~500 목표 (일 방문자 1,500~3,000명)
- 케데헌 팬덤 트래픽 포획 (/kpop-demon-hunters 페이지)
- 롱테일 SEO 키워드 공략
- 이 프로젝트를 템플릿으로 복제 가능한 구조 검증

---

## 기술 스택

### 핵심
| 기술 | 버전 | 용도 |
|------|------|------|
| Astro | 5.17.1 | 메인 프레임워크 (SSR) |
| @astrojs/cloudflare | 12.6.12 | Workers 어댑터 |
| TypeScript | strict | 타입 안전 |
| Cloudflare Workers | — | 엣지 런타임 |
| Cloudflare D1 | — | 서버리스 SQLite |
| Cloudflare R2 | — | 이미지 스토리지 (10GB 무료) |

### 프론트엔드
| 기술 | 용도 |
|------|------|
| MapLibre GL JS 4.7.1 | 인터랙티브 지도 |
| CSS scroll-driven | 네이티브 스크롤 애니메이션 |

### 폰트
| 폰트 | 용도 |
|------|------|
| Noto Serif KR | 한국어 제목 |
| Cormorant Garamond | 영어 제목 (우아한 세리프) |
| Gmarket Sans | 강조/숫자 |
| Pretendard | 본문 |

### AI 이미지
| 도구 | 용도 |
|------|------|
| Hugging Face FLUX.1-schnell | 빌드타임 자동 생성 파이프라인 |

---

## 컬러 시스템 — 단청 네온 팔레트

### 오방색 기반
```css
/* 단청 전통색 */
--dancheong-blue:   #1B4FD8   /* 청(靑) — 경복궁 */
--dancheong-red:    #C8231E   /* 적(赤) — 창덕궁 */
--dancheong-yellow: #E8A020   /* 황(黃) */
--dancheong-white:  #F5F0E8   /* 백(白) */
--dancheong-black:  #0A0806   /* 흑(黑) */

/* 네온 글로우 버전 */
--neon-blue:  #00C8FF
--neon-red:   #FF3B5C
--neon-gold:  #FFD700

/* 배경 */
--bg-night:   #080510   /* 밤의 궁궐 — 기본 배경 */
--bg-card:    #12101A
```

### 궁궐별 대표색
| 궁궐 | 색상 | CSS 변수 |
|------|------|----------|
| 경복궁 | 청(#00C8FF) | `--palace-gyeongbok` |
| 창덕궁 | 적(#FF3B5C) | `--palace-changdeok` |
| 창경궁 | 보라(#9B59B6) | `--palace-changgyeong` |
| 덕수궁 | 초록(#27AE60) | `--palace-deoksu` |
| 종묘 | 금(#FFD700) | `--palace-jongmyo` |

---

## 완료된 작업

### PHASE 1 — 비주얼 혁신
| 트랙 | 작업 | 상태 |
|------|------|------|
| A-1 | global.css 전면 교체 (단청 네온 팔레트) | ✅ |
| A-2 | Layout.astro 업데이트 (다크 기본, 새 폰트, theme-color) | ✅ |
| A-3 | DancheongCard.astro 컴포넌트 | ✅ |
| A-4 | NeonGlow 유틸리티 클래스 (global.css) | ✅ |
| A-5 | 단청 SVG 문양 라이브러리 (DancheongPatterns) | ✅ |
| B-1 | AI 이미지 파이프라인 스크립트 (dotenv 로딩 포함) | ✅ |
| B-2 | Cloudflare R2 바인딩 (wrangler.jsonc) | ✅ |

### PHASE 2 — 트래픽 훅 + 콘텐츠
| 트랙 | 작업 | 상태 |
|------|------|------|
| C-1 | 홈 히어로 리뉴얼 (한자 + 네온 골드 + DancheongCard) | ✅ |
| C-2 | TimeSlider.astro (조선/현재 비교, 터치 지원) | ✅ |
| C-3 | /kpop-demon-hunters 페이지 (지도 + 6개 촬영지 + 순례루트) | ✅ |
| C-4 | 궁궐 상세 리뉴얼 ([id].astro 시네마틱 히어로 + [code].astro 빌딩 히어로) | ✅ |
| C-5 | 건물 카드 — DancheongCard 적용 (홈 + 케데헌) | ✅ |
| D-4 | /guide SEO 콘텐츠 (허브 + 9개 가이드 × 4개 언어) | ✅ |
| E-1 | Core Web Vitals (preconnect, fetchpriority) | ✅ |
| E-2 | OptimizedImage.astro 컴포넌트 | ✅ |
| E-4 | prefers-reduced-motion 대응 (global.css) | ✅ |

### SEO + 메타 + 진단
| 항목 | 상태 |
|------|------|
| OG 이미지 고정 URL (og-image.jpg, 1200×630) | ✅ |
| OG image:alt 언어별 분기 | ✅ |
| twitter:image 고정 URL | ✅ |
| sitemap.xml 동적 생성 (가이드 + 케데헌 포함) | ✅ |
| JSON-LD (WebSite, FAQPage, BreadcrumbList, TouristAttraction, LandmarksOrHistoricalBuildings) | ✅ |
| hreflang alternate (4개 언어) | ✅ |
| 파비콘 (단청 네온 스타일) | ✅ |
| dotenv ~/.env.common 로딩 | ✅ |
| 기술부채 정리 (.bak, backup 파일 삭제) | ✅ |
| 전체 페이지 진단 + 링크 전수 조사 | ✅ |
| 네온 글로우 번짐 축소 (5단계→2단계) | ✅ |
| 도메인 라우팅 수정 (Pages→Workers) | ✅ |

---

## 생성된 컴포넌트

| 파일 | 용도 |
|------|------|
| DancheongCard.astro | 궁궐/촬영지 카드 (궁궐별 대표색 글로우) |
| DancheongPatterns.astro | 단청 문양 SVG (운문, 연꽃, 기하학) |
| TimeSlider.astro | 조선/현재 비교 슬라이더 (CSS clip-path) |
| BreadcrumbNav.astro | 빵부스러기 + JSON-LD BreadcrumbList |
| FAQSection.astro | FAQ + JSON-LD FAQPage 자동 생성 |
| GuideLayout.astro | 가이드 전용 레이아웃 (SEO + 다크모드) |
| OptimizedImage.astro | srcset/aspect-ratio/lazy 자동화 |

---

## 페이지 구조

```
/                                  # 홈 (히어로 + 지도 + 타임슬라이더 + 궁궐 카드 + 케데헌 훅)
/kpop-demon-hunters                # 케데헌 촬영지 (지도 + 6개 장소 + 순례루트 + FAQ)
/palace/{id}                       # 궁궐 상세 (시네마틱 히어로 + 건물 목록)
/palace/{id}/{code}                # 건물 상세 (빌딩 히어로 + 설명/갤러리/동영상)
/guide                             # 가이드 허브 (9개 카드)
/guide/gyeongbokgung               # 경복궁 가이드 (영어 1,200+ 단어, FAQ 7개)
/guide/changdeokgung               # 창덕궁 가이드
/guide/changgyeonggung             # 창경궁 가이드
/guide/deoksugung                  # 덕수궁 가이드
/guide/jongmyo                     # 종묘 가이드
/guide/secret-garden               # 창덕궁 비원 가이드
/guide/palace-ticket               # 통합관람권 가이드
/guide/palace-hours                # 개방시간 가이드
/guide/night-tour                  # 야간개장 가이드
/sitemap.xml                       # 동적 XML 사이트맵
```

---

## 생성된 AI 이미지

| 파일명 | 내용 | 생성 도구 |
|--------|------|----------|
| gyeonghoeru-night.jpg | 경회루 야경 + 연못 반영 | Imagen 3 |
| jongno-joseon.jpg | 조선시대 종로 시장 거리 | Imagen 3 |
| geunjeongjeon-night.jpg | 근정전 야경 네온 | Imagen 3 |
| og-image.jpg | OG 소셜 공유 이미지 | Imagen 3 |
| favicon.svg | 파비콘 | Imagen 3 → 변환 |

---

## SEO 현황

### 타깃 키워드
```
[케데헌 트래픽 — 즉시 효과]
kpop demon hunters real locations
kpop demon hunters gyeongbokgung
케이팝 데몬 헌터스 촬영지

[실용 정보 — 전환 의도 높음]
gyeongbokgung palace ticket price 2026
gyeongbokgung opening hours
changdeokgung secret garden reservation
korea palace free admission

[중국어 — 경쟁 낮음]
景福宫门票价格2026
首尔宫殿旅游攻略
```

### 구조화 데이터
| 페이지 | 스키마 |
|--------|--------|
| / | WebSite |
| /kpop-demon-hunters | FAQPage |
| /palace/{id} | TouristAttraction |
| /palace/{id}/{code} | LandmarksOrHistoricalBuildings |
| /guide/* | FAQPage + BreadcrumbList |

---

## 국가유산청 오픈 API

```
유산 목록    : http://www.khs.go.kr/cha/SearchKindOpenapiList.do
유산 상세    : http://www.khs.go.kr/cha/SearchKindOpenapiDt.do
이미지       : http://www.khs.go.kr/cha/SearchImageOpenapi.do
동영상       : http://www.khs.go.kr/cha/SearchVideoOpenapi.do
나레이션     : http://www.khs.go.kr/cha/SearchVoiceOpenapi.do
             (ccbaGbn: kr/en/jpn/chn)
행사         : http://www.khs.go.kr/cha/openapi/selectEventListOpenapi.do
위치         : http://www.gis-heritage.go.kr/openapi/xmlService/spca.do

⚠️ XML 반환 / 클라이언트 직접 호출 불가 / SSR에서만
⚠️ API 키 불필요
```

---

## 환경변수

| 변수 | 위치 | 용도 |
|------|------|------|
| HF_TOKEN | ~/.env.common | Hugging Face API |

---

## 배포

```bash
# 빌드 + 배포
npm run build && npx wrangler deploy

# AI 이미지 생성 (빌드타임)
node scripts/generate-ai-images.mjs
```

---

## 미완료 작업

### PHASE 3 — 데이터 연동
| 트랙 | 작업 | 상태 |
|------|------|------|
| D-1 | D1 실제 연동 — `/api/heritage` API 라우트 | ✅ |
| D-2 | 나레이션 API — `/api/narration` (khs.go.kr 네트워크 제한) | ⚠️ 빌드타임 수집 필요 |
| D-3 | 행사 API — `/api/events` (khs.go.kr 네트워크 제한) | ⚠️ 빌드타임 수집 필요 |

### PHASE 4 — 최적화
| 트랙 | 작업 | 상태 |
|------|------|------|
| E-3 | Three.js 모바일 폴백 (미사용) | ⏸ |
| E-5 | AdSense 배치 최적화 (가이드 페이지 인라인 광고) | ✅ |

---

## 다음 우선순위 작업

```
1. Search Console 색인 요청
   → https://heritage.aikorea24.kr
   → https://heritage.aikorea24.kr/kpop-demon-hunters

2. [TRACK D-1] D1 실제 연동
   → palace_data.json을 D1 쿼리로 전환

3. [TRACK E-5] AdSense 배치 최적화

4. [TRACK D-2] 나레이션 오디오 가이드
```

---

## 성공 지표

```
1개월:  /kpop-demon-hunters 구글 인덱싱
        일 방문자 100~300명
3개월:  일 방문자 500~1,000명
        AdSense 월 $30~80
6개월:  일 방문자 1,500~3,000명
        AdSense 월 $150~300
9개월:  AdSense 월 $300~500 ← 목표
        복제 템플릿 완성
```
