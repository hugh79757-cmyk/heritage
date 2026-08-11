# K-Heritage Guide — 기술 문서

> 마지막 업데이트: 2026-06-22

---

## 1. 프로젝트 개요

**K-Heritage Guide**는 한국의 5대 궁궐(경복궁, 창덕궁, 창경궁,덕수궁)과 종묘를 4개 언어(한국어, 영어, 일본어, 중국어)로 소개하는 웹 애플리케이션이다. 각 궁궐의 건축물별 상세 해설, 사진 갤러리, 동영상을 제공하며, 사용자 위치 기반 근처 문화유산 탐색 기능을 포함한다.

| 항목 | 값 |
|------|-----|
| URL | `https://heritage.aikorea24.kr` |
| 프레임워크 | Astro 5.17.1 (SSR) |
| 호스팅 | Cloudflare Workers |
| 데이터베이스 | Cloudflare D1 (`heritage-db`) |
| 언어 | 한국어, 영어, 일본어, 중국어 (추가 언어 Google Translate) |

---

## 2. 기술 스택

### 2.1 핵심

| 기술 | 버전 | 용도 |
|------|------|------|
| Astro | 5.17.1 | 메인 프레임워크 (SSR) |
| @astrojs/cloudflare | 12.6.12 | Cloudflare Workers 어댑터 |
| TypeScript | strict 모드 | 타입 안전 |
| Cloudflare Workers | — | 엣지 런타임 |
| Cloudflare D1 | — | 서버리스 SQLite DB |

### 2.2 프론트엔드

| 기술 | 용도 |
|------|------|
| MapLibre GL JS 4.7.1 | 인터랙티브 지도 (오픈소스) |
| OpenFreeMap tiles | 지도 타일 (무료, API 키 불필요) |
| Pretendard | 본문 폰트 |
| Noto Serif KR | 제목 폰트 (한국어 세리프) |
| Google Translate | 추가 언어 번역 |
| Google AdSense | 광고 수익화 |

### 2.3 데이터 수집

| 도구 | 용도 |
|------|------|
| `scripts/collect.mjs` | khs.go.kr + heritage.go.kr API에서 데이터 수집 |
| `scripts/seed-d1.mjs` | JSON → SQL 배치 파일 생성 |
| `scripts/seed-direct.mjs` | wrangler CLI로 D1 직접 시딩 |

---

## 3. 프로젝트 구조

```
heritage/
├── astro.config.mjs          # Astro 설정 (SSR + Cloudflare)
├── wrangler.jsonc             # Cloudflare Workers 설정
├── schema.sql                 # D1 테이블 정의
├── package.json               # 의존성
├── tsconfig.json              # TypeScript 설정 (strict)
│
├── src/
│   ├── layouts/
│   │   └── Layout.astro       # 루트 레이아웃 (SEO, 다크모드, 번역)
│   ├── pages/
│   │   ├── index.astro        # 홈 페이지
│   │   ├── palace/
│   │   │   ├── [id].astro     # 궁궐 건물 목록
│   │   │   └── [id]/
│   │   │       └── [code].astro # 건물 상세 페이지
│   │   └── sitemap.xml.ts     # 동적 XML 사이트맵
│   ├── components/
│   │   └── MapExplore.astro   # 지도 컴포넌트 (MapLibre GL)
│   ├── lib/
│   │   ├── api.ts             # 궁궐 데이터, 언어 헬퍼, API 함수
│   │   ├── palace_data.json   # 궁궐 건물 데이터 (로컬 JSON)
│   │   └── landmarks.ts       # 문화유산 마커 데이터 + 거리 계산
│   └── styles/
│       └── global.css         # 디자인 시스템 (507줄)
│
├── scripts/
│   ├── collect.mjs            # 3단계 데이터 수집기
│   ├── seed-d1.mjs            # JSON → SQL 배치 생성
│   ├── seed-direct.mjs        # D1 직접 시딩
│   └── data/
│       ├── heritage_list.json # 수집된 국가유산 목록
│       ├── progress.json      # 수집 진행 상태
│       ├── sql/               # D1 시딩용 SQL 배치 파일
│       │   ├── batch_000.sql
│       │   └── ... (37파일)
│       └── run_seed.sh        # 배치 실행 스크립트
│
├── public/
│   ├── favicon.svg
│   ├── favicon.ico
│   └── robots.txt
│
└── pipeline/
    ├── prototype.html         # 파이프라인 프로토타입
    └── prototype_v2.html
```

---

## 4. 아키텍처

### 4.1 요청 흐름

```
사용자 → Cloudflare Edge (Workers) → Astro SSR → 페이지 렌더링
                                            ↓
                                    D1 (SQLite) 또는 로컬 JSON
                                            ↓
                                    HTML 응답 → Edge → 사용자
```

- **SSR 모드**: `astro.config.mjs`의 `output: 'server'`로 설정
- **데이터 소스**: 궁궐 건물 데이터는 `src/lib/palace_data.json`에서 로컬 로드
- **D1**: `heritage-db`에 국가유산 인덱스 데이터 시딩됨 (현재 페이지 렌더링에는 미사용, 향후 확장용)

### 4.2 다국어 전략

```
URL 파라미터: ?lang=kr | en | ja | zh

기본 언어: 한국어 (kr)
- 4개 언어: 쿼리 파라미터 기반 라우팅
- 추가 언어: Google Translate 위젯 (20+ 언어)
```

- 모든 페이지에서 `getLang(Astro.url)`로 현재 언어 판정
- `<link rel="alternate" hreflang="...">`으로 SEO hreflang 태그 생성
- 언어 선택 UI: 네비게이션 바의 국기 버튼

**⚠️ 프리렌더 함정 (2026-08-11 실전 교훈):**

- `output: 'server'`에서 `export const prerender = true` + `getStaticPaths`를 쓰는 페이지는 빌드 시점에 **정적 HTML로 미리 생성**되어 Cloudflare Assets이 그대로 서빙한다. 이 경우 `Astro.url`에 쿼리스트링이 없어 `getLang`이 항상 `'kr'`로 폴백 → **언어 전환이 동작하지 않는다**.
- 동적 라우트(`/kpop-demon-hunters/[id]` 등)는 `getStaticPaths` 없이 `Astro.params.id`로 직접 조회하는 순수 SSR로 유지할 것. (`palace/[id].astro` 패턴)
- 없는 id 접근은 `KDH_SCENES.find(...)` 후 `if (!scene) return Astro.redirect('/')`로 처리 (200+폴백 금지).

**⚠️ Cloudflare 엣지 캐시 언어 오염 (2026-08-11):**

- `?lang=` 쿼리 응답에 `Cache-Control` 헤더가 없으면 Cloudflare가 HTML을 캐시해 **다른 언어 응답이 서로 덮어쓸 수 있다** (예: `?lang=en`에 한국어 페이지가 캐시됨).
- `src/middleware.ts`가 `?lang=` 쿼리가 있는 HTML 응답에 `Cache-Control: private, no-cache`를 설정해 방지한다. 새 페이지 추가 시 미들웨어는 전역 적용되므로 별도 작업 불필요.
- 클라이언트 `<script>`에서 `lang` 등을 쓸 때는 반드시 `<script define:vars={{ lang }}>`로 전달할 것. 미전달 시 `lang is not defined` 런타임 에러가 난다.

### 4.3 다크모드

- `localStorage.getItem('theme')` + `prefers-color-scheme` 미디어 쿼리 기반
- `html.dark` 클래스 토글로 CSS 변수 전환
- 첫 로드 시 인라인 스크립트로 FOUC 방지

---

## 5. 데이터베이스 스키마 (D1)

`schema.sql` 정의 — 5개 테이블, 다국어 컬럼 (ko/en/ja/zh):

### 5.1 테이블 구조

```sql
-- 궁궐 기본 정보
palaces (
  id INTEGER PRIMARY KEY,
  gung_number INTEGER UNIQUE NOT NULL,  -- 1~5
  name_ko, name_en, name_ja, name_zh,
  desc_ko, desc_en, desc_ja, desc_zh,
  image_url, hero_image_url,
  lat REAL, lng REAL,
  total_buildings INTEGER DEFAULT 0
)

-- 건물 목록
buildings (
  id INTEGER PRIMARY KEY,
  gung_number, serial_number, detail_code,  -- 복합 키
  name_ko, name_en, name_ja, name_zh,
  desc_ko, desc_en, desc_ja, desc_zh,
  image_url, detail_link, sort_order
)

-- 건물 상세 정보
building_details (
  id INTEGER PRIMARY KEY,
  gung_number, serial_number, detail_code,
  explanation_ko, explanation_en, explanation_ja, explanation_zh,
  main_image_url
)

-- 이미지 갤러리
images (
  id INTEGER PRIMARY KEY,
  gung_number, serial_number, detail_code, image_index,
  name_ko, name_en, name_ja, name_zh,
  desc_ko, desc_en, desc_ja, desc_zh,
  image_url NOT NULL
)

-- 동영상
movies (
  id INTEGER PRIMARY KEY,
  gung_number, serial_number, detail_code, movie_index,
  name_ko, name_en, name_ja, name_zh,
  url_ko, url_en, url_ja, url_zh
)
```

### 5.2 인덱스

```sql
idx_buildings_gung       ON buildings(gung_number)
idx_buildings_serial     ON buildings(serial_number)
idx_building_details     ON building_details(gung_number, serial_number, detail_code)
idx_images_building      ON images(gung_number, serial_number, detail_code)
idx_movies_building      ON movies(gung_number, serial_number, detail_code)
```

### 5.3 현재 데이터 흐름

현재 페이지 렌더링은 D1이 아닌 `palace_data.json`을 사용:
- `fetchPalaceList(gungNumber)` → JSON에서 건물 목록 반환
- `fetchBuildingDetail(gungNumber, serialNumber, detailCode)` → JSON에서 상세 반환
- D1은 국가유산 인덱스만 시딩됨 (향후 확장용)

---

## 6. 핵심 모듈

### 6.1 `src/lib/api.ts` — 데이터 레이어

```typescript
// 궁궐 메타데이터 (5개, 하드코딩)
PALACES: Palace[]  // id 1~5, 4개국어 이름/설명, 이미지 URL

// 언어 헬퍼
getLang(url: URL): Lang          // URL 파라미터에서 언어 추출
getPalaceName(p, lang): string   // 언어별 궁궐 이름
getPalaceDesc(p, lang): string   // 언어별 궁궐 설명

// XML 파싱
extractTag(xml, tag): string     // 단일 태그 값 추출
extractBlocks(xml, tag): string[] // 복수 블록 추출

// 데이터 페칭
fetchPalaceList(gungNumber): BuildingItem[]
fetchBuildingDetail(gungNumber, serialNumber, detailCode): BuildingDetail | null
```

**인터페이스:**
- `Palace` — 궁궐 메타데이터 (id, 4lang 이름/설명, 이미지)
- `BuildingItem` — 건물 목록 항목
- `BuildingDetail` — 건물 상세 (설명, 이미지 갤러리, 동영상)

### 6.2 `src/lib/landmarks.ts` — 지도 마커 데이터

```typescript
// 15개 랜드마크 (5 궁궐 + 10 인근 유산)
LANDMARKS: Landmark[]
// 타입: 'palace' | 'treasure' | 'historic' | 'scenic'

// 거리 계산
getDistance(lat1, lng1, lat2, lng2): number  // Haversine (km)
getNearbyLandmarks(lat, lng, radiusKm): (Landmark & { distance })[]
```

### 6.3 `src/components/MapExplore.astro` — 지도 컴포넌트

MapLibre GL JS 기반 인터랙티브 지도:
- **타일 소스**: `https://tiles.openfreemap.org/styles/liberty`
- **커스텀 SVG 마커**: 궁궐(팔작지붕), 보물(범종), 사적(석탑), 명승(산과나무)
- **기능**: 위치 기반 주변 탐색, 반경 선택 (1/3/5/10km), 마커 클릭 시 바텀 시트
- **해외 사용자 감지**: 서울로부터 200km 이상일 때 "서울 궁궐 보기" 안내

---

## 7. 페이지 라우팅

| 경로 | 파일 | 설명 |
|------|------|------|
| `/` | `index.astro` | 홈: 히어로, 지도, 궁궐 카드 그리드 |
| `/palace/:id` | `palace/[id].astro` | 궁궐별 건물 목록 |
| `/palace/:id/:code` | `palace/[id]/[code].astro` | 건물 상세 (설명, 갤러리, 영상) |
| `/sitemap.xml` | `sitemap.xml.ts` | 동적 XML 사이트맵 |

### 7.1 URL 패턴

```
/home?lang=kr
/palace/1?lang=en          # 경복궁
/palace/1/21?sn=1&lang=ja  # 경복궁 근정전
```

- `:id` — 궁궐 ID (1~5)
- `:code` — 건물 detail_code
- `?sn=` — 건물 serial_number (쿼리 파라미터)
- `?lang=` — 언어 (kr/en/ja/zh)

---

## 8. SEO 및 메타

### 8.1 메타 태그 (`Layout.astro`)

```html
<meta name="description" content="..." />
<link rel="canonical" href="..." />
<meta property="og:title/description/image/url/type" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="alternate" hreflang="ko/en/ja/zh/x-default" />
```

### 8.2 JSON-LD 구조화 데이터

- 홈: `WebSite`
- 궁궐 페이지: `TouristAttraction`
- 건물 상세: `LandmarksOrHistoricalBuildings`

### 8.3 검증 코드

```
Google:  kpr0gRmGKIFUW5dNLsfxba1aKpbV7wolSFk6cSOJZXA
Naver:   fa2baf09d65dfb84a55787b8740941430187b234
Pinterest: a2f1f9d5f2c18d423c1d99f6c2d0247b
```

---

## 9. 데이터 수집 파이프라인

### 9.1 `scripts/collect.mjs` — 3단계 수집기

재시작 가능 (progress.json으로 상태 저장):

| 단계 | 설명 | 데이터 소스 |
|------|------|-------------|
| Phase 1 | 국가유산 목록 수집 | `khs.go.kr/cha/SearchKindOpenapiList.do` |
| Phase 2 | 좌표 있는 유산 상세 수집 | `khs.go.kr/cha/SearchKindOpenapiDt.do` |
| Phase 3 | 궁궐 건물 상세 수집 (4개국어) | `heritage.go.kr/heri/gungDetail/gogung*.do` |

**수집 대상:**
- 종목코드: 국보(11), 보물(12), 사적(13), 명승(15), 천연기념물(16), 국가민속(18), 국가등록(79)
- 궁궐: gung_number 1~5 (경복궁~종묘)

**출력:**
- `scripts/data/heritage_list.json` — 전체 국가유산 목록
- `scripts/data/palace_details.json` — 궁궐 건물 상세

### 9.2 `scripts/seed-d1.mjs` — D1 시딩

```bash
# SQL 배치 파일 생성 (100건씩)
node scripts/seed-d1.mjs

# 배치 실행
bash scripts/data/run_seed.sh
```

- 좌표 있는 유산만 D1에 시딩
- 37개 SQL 배치 파일 (`batch_000.sql` ~ `batch_036.sql`)

---

## 10. 배포

### 10.1 빌드

```bash
npm install
npm run build    # → dist/
```

### 10.2 Cloudflare Workers 배포

> **중요**: 배포는 환경변수 토큰이 아닌 **wrangler 프로필 인증**을 사용한다.
> `~/.env.common`의 `CLOUDFLARE_API_TOKEN`은 배포 권한이 없어 `Authentication error [code: 10000]`로 실패한다.
> 배포 전 반드시 아래 env 토큰들을 unset해야 한다 (5000 프로젝트 agent.md 규칙과 동일).

```bash
# 1) 빌드
npm run build          # → dist/

# 2) env 토큰 unset 후 프로필 인증으로 배포
unset CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID CF_DNS_TOKEN CLOUDFLARE_WORKERS_AI_API_TOKEN R2_ENDPOINT
npx wrangler deploy
```

**배포 인증 정보:**
- 활성 프로필: `hugh79757` (토큰 위치: `~/.wrangler/config/hugh79757.toml`)
- 계정: `fac9808c757df31d797190c529aaa71a` (hugh79757@gmail.com)
- 프로필 토큰 권한: `workers:write`, `workers_routes:write`, `d1:write`, `pages:write`, `zone:read` 등 (DNS 쓰기 없음)
- **주의**: `npx wrangler`를 셸 함수 없이 직접 실행하면 `CLOUDFLARE_API_TOKEN` env가 우선해서 인증 실패한다.
  `~/.zshrc`의 `wrangler` 셸 함수는 env를 자동 unset하므로 `wrangler deploy`로 실행해도 된다.

**배포 확인:**
```
Uploaded heritage (9.27 sec)
Deployed heritage triggers (3.32 sec)
  heritage.aikorea24.kr (custom domain)
```

`wrangler.jsonc` 설정:
- Entry: `dist/_worker.js/index.js`
- Assets: `./dist`
- D1 바인딩: `DB` → `heritage-db`
- 호환 플래그: `nodejs_compat`, `global_fetch_strictly_public`
- Observability: 활성화

### 10.3 로컬 개발

```bash
npm run dev       # localhost:4321
npm run preview   # 빌드 미리보기
```

---

## 11. 디자인 시스템

### 11.1 색상 팔레트

**라이트 모드:**
| 변수 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#C8956C` | 메인 포인트 |
| `--color-bg` | `#FAF6F1` | 배경 |
| `--color-card` | `#FFFFFF` | 카드 |
| `--color-text` | `#1A1210` | 본문 |
| `--color-border` | `#E8DDD4` | 테두리 |

**다크 모드:**
| 변수 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#D4A574` | 메인 포인트 |
| `--color-bg` | `#0F0D0B` | 배경 |
| `--color-card` | `#1C1916` | 카드 |
| `--color-text` | `#F0E6DC` | 본문 |
| `--color-border` | `#2D2720` | 테두리 |

### 11.2 반응형

- 컨테이너: `max-width: 1080px`
- 모바일 브레이크포인트: `640px`
- 카드 그리드: `auto-fill, minmax(300px, 1fr)`
- 지도 높이: 420px (데스크톱), 350px (모바일)

---

## 12. 광고 (AdSense)

- **퍼블리셔 ID**: `ca-pub-5938862195544185`
- **슬롯 ID**: `4797390169`
- **배치 위치**:
  - 홈: 히어로 하단 인아티클
  - 궁궐 목록: 건물 리스트 중간 (6개 이상일 때 5번째, 12개 이상일 때 11번째)
  - 건물 상세: 메인 이미지 하단 + 설명 하단

---

## 13. 외부 의존성

| 의존성 | 버전 | 라이선스 | 비고 |
|--------|------|----------|------|
| astro | 5.17.1 | MIT | 프레임워크 |
| @astrojs/cloudflare | 12.6.12 | MIT | 어댑터 |
| maplibre-gl | 4.7.1 | BSD-3 | 지도 (CDN) |
| Pretendard | — | OFL | 본문 폰트 (CDN) |
| Noto Serif KR | — | OFL | 제목 폰트 (Google Fonts) |
| OpenFreeMap tiles | — | ODbL | 지도 타일 |

---

## 14. 환경 변수 및 보안

현재 `.env` 파일 사용 없음. 모든 설정은 코드에 직접 포함:
- AdSense ID: 코드 하드코딩
- D1 DB ID: `wrangler.jsonc`에 명시
- API 키: khs.go.kr 공공 API (키 불필요)
- 사이트 검증 코드: `Layout.astro` 메타 태그

---

## 15. 문제점 및 개선 여부

| 항목 | 상태 | 비고 |
|------|------|------|
| D1 미사용 | 현재 `palace_data.json` 로컬 사용 | D1에 시딩은 되어 있으나 미연결 |
| API 키 없음 | khs.go.kr 공공 API | 합법적 사용 |
| 백업 파일 | `.gitignore`에 포함됨 | `backup*.txt`, `backup*.py` |
| `.bak` 파일 | `api.ts.bak`, `Layout.astro.bak` 등 | 버전 관리 불필요 파일 |
