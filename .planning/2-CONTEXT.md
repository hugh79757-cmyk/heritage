# PHASE 2 — 트래픽 훅 + 콘텐츠 통합 (CONTEXT)

**생성일:** 2026-07-01  
**기반:** AGENTS.md PHASE 2 (트래픽 훅) + PHASE 3 (데이터 심화) 통합  
**의사결정 방식:** `/gsd-discuss-phase` — 사용자 4개 그레이 에리어 논의 완료

---

## 1. 확정 스코프 (LOCKED)

PHASE 2는 AGENTS.md의 PHASE 2 (트래픽 훅)와 PHASE 3 (데이터 심화)를 통합한다.
별도 PHASE 3은 존재하지 않는다 — 모든 콘텐츠 작업은 PHASE 2에서 처리한다.

### 1.1 포함 (IN SCOPE)

| ID | 작업 | 우선순위 | AGENTS.md 매핑 |
|----|------|----------|----------------|
| P2-1 | KDH 페이지 풀 미디어 경험 | P0 | C-3 확장 |
| P2-2 | 홈 히어로 궁궐 문 열림 애니메이션 | P0 | C-1 |
| P2-3 | TimeSlider 조선/현재 비교 개선 | P1 | C-2 |
| P2-4 | 궁궐 상세 페이지 리뉴얼 | P1 | C-4 |
| P2-5 | 건물 카드 그리드 + KDH 연결 | P1 | C-5 + A-3 |
| P2-6 | 건물 상세 페이지 콘텐츠 확장 | P2 | D-2, D-3 |
| P2-7 | AI 이미지 파이프라인 — KDH 씬 이미지 | P0 | B-3, B-4 |

### 1.2 불포함 (OUT OF SCOPE — LOCKED)

| 작업 | 이유 | 처리 |
|------|------|------|
| 보안 검증 | 민감 데이터 없음, env+CORS만 확인 | 별도 PHASE로 분리 |
| Three.js 3D 건물 모델 | pipeline/에 raw 파일 있지만 구현 스코프 아님 | 차기 PHASE |
| D1 실제 연동 (palace_data.json → D1) | 데이터 마이그레이션 부담 | 차기 PHASE |
| 오디오 가이드 개선 | AudioGuide.astro 이미 존재, 현재 수준 유지 | 차기 PHASE |

---

## 2. KDH 페이지 — 풀 미디어 경험 (P2-1)

### 2.1 현재 상태
- `src/pages/kpop-demon-hunters.astro` (826줄)
- 6개 장소 카드 + MapLibre 지도 + FAQ 4개국어
- 히어로 이미지: heritage.go.kr 외부 링크 (AI 이미지 아님)
- `guideLink` 4개가 `#` (미연결)
- 씬별 가이드 없음, 텍스트 설명만 존재
- 1일 코스 타임라인: FAQ 텍스트로만 존재, 시각화 없음

### 2.2 확정 결정
- **씬별 가이드 추가:** 6개 장소 각각에 영화 속 주요 장면 설명 + AI 생성 장면 이미지
- **AI 생성 이미지:** scripts/generate-ai-images.mjs 활용, KDH 씬 프롬프트 추가 (조선 단청 × 네온 스타일 유지, 9:16 모바일 비율)
- **1일 코스 타임라인 시각화:** AGENTS.md 섹션 3.3의 "성지순례 루트"를 시각적 타임라인 컴포넌트로 구현 (CSS로, 외부 라이브러리 불필요)
- **guideLink 연결:** palace/[id] 및 guide/* 페이지와 전부 연결
- **기존 유지:** FAQ 4개국어, MapLibre 지도, DancheongCard

### 2.3 디자인 방향
- `design` skill의 Dancheong Neon palette 준수
- `ui-ux-pro-max` Motion-Driven 스타일 적용 (scroll-driven, entrance animation)
- prefers-reduced-motion 대응 필수
- 모든 이미지: WebP, srcset 375/768/1200, aspect-ratio 명시
- KDH 페이지 히어로: AI 생성 이미지로 교체 (현재 heritage.go.kr 외부 링크)

### 2.4 구현 노트
```
새 파일: src/data/kdh-scenes.ts (씬 데이터 정리)
수정:    src/pages/kpop-demon-hunters.astro (씬 가이드 + 타임라인 추가)
수정:    scripts/generate-ai-images.mjs (KDH 씬 프롬프트 추가)
수정:    src/pages/palace/[id].astro (KDH 연결 섹션 추가)
```

---

## 3. 홈 히어로 — 궁궐 문 열림 애니메이션 (P2-2)

### 3.1 현재 상태
- `src/pages/index.astro` (339줄)
- 히어로 이미지: heritage.go.kr 외부 링크
- CSS 파티클 (tsParticles 대신 CSS span), 민화 reveal 섹션 있음
- 문 열림 애니메이션: 미구현

### 3.2 확정 결정
- AGENTS.md 3.1 섹션 1: "궁궐 문이 양쪽으로 열리는 효과 (CSS clip-path)" 구현
- 히어로 이미지를 AI 생성 이미지로 교체 (gyeongbok-hero)
- "글자가 단청 색상으로 순서대로 채워짐" 효과: CSS @keyframes + background-clip:text
- 모바일: touch-action: pan-y 유지, 스크롤 방해 금지
- prefers-reduced-motion: 미디어 쿼리로 애니메이션 OFF

### 3.3 디자인 방향
- AGENTS.md 1.2 타이포그래피 준수 (제목: Noto Serif KR, 금빛 글로우)
- 히어로 타이틀 크기: clamp(2rem, 8vw, 4rem)
- GSAP 불필요 — 순수 CSS @keyframes + clip-path로 구현
- 배경 파티클: 현행 CSS span 유지 (tsParticles로 업그레이드 불필요)

### 3.4 구현 노트
```
수정: src/pages/index.astro (히어로 섹션 clip-path + 타이틀 애니메이션)
수정: src/styles/global.css (문 열림 keyframes, 타이틀 채움 효과)
```

---

## 4. TimeSlider 개선 (P2-3)

### 4.1 현재 상태
- `src/components/TimeSlider.astro` (217줄)
- CSS clip-path 기반 before/after 비교
- 홈페이지에 geunjeongjeon-night.jpg vs tour-images/gyeongbokgung.jpg

### 4.2 확정 결정
- 현재 구현 유지, 콘텐츠만 보강
- 필요시 추가 비교 이미지 쌍 생성 (경회루, 창덕궁 비원 등)
- 모바일 터치 최적화는 현재 수준 유지

---

## 5. 궁궐 상세 페이지 리뉴얼 (P2-4)

### 5.1 현재 상태
- `src/pages/palace/[id].astro` (252줄)
- 건물 목록 + 이미지 + AdSense
- 시네마틱 히어로 미구현

### 5.2 확정 결정
- AGENTS.md 3.2 구조 적용: [1] 시네마틱 히어로 → [2] 건물 카드 그리드 → [3] KDH 연결
- 시네마틱 히어로: CSS perspective + translateZ 스크롤 효과 (AGENTS.md 5.2)
- 건물 카드: DancheongCard 재사용, 2열(모바일)/3열(데스크톱)
- KDH 연결 섹션 추가: "이 궁궐이 KDH에서 어떻게 등장했는지"

### 5.3 구현 노트
```
수정: src/pages/palace/[id].astro (시네마틱 히어로 + KDH 섹션 추가)
수정: src/data/kdh-scenes.ts (궁궐별 KDH 장면 데이터 포함)
```

---

## 6. 건물 카드 그리드 (P2-5)

### 6.1 현재 상태
- `src/components/DancheongCard.astro` (232줄)
- glassmorphism + 3D tilt + mouse glow
- 홈페이지 bento grid에서 사용 중

### 6.2 확정 결정
- 현행 컴포넌트 유지, 개선 불필요
- KDH 페이지에서도 동일 컴포넌트 재사용
- size prop 활용 (default/large)

---

## 7. AI 이미지 파이프라인 (P2-7)

### 7.1 확정 결정
- `scripts/generate-ai-images.mjs`에 KDH 씬 프롬프트 추가
- 기존 STYLE_PREFIX (조선 단청 × 네온 × KDH 애니메이션 스타일) 재사용
- 9:16 모바일 비율 (768×1344) 유지
- 변환: Sharp로 WebP + 3단계 리사이즈 (375/768/1200)
- 출력: `public/images/generated/` → 페이지에서 참조
- 런타임 AI 호출 금지 (빌드타임만)

### 7.2 추가 이미지 목록

| ID | 설명 | 대상 |
|----|------|------|
| kdh-gyeongbokgung | KDH 경복궁 결전 장면 | KDH 페이지 히어로 |
| kdh-bukchon | 북촌 한옥마을 추격 장면 | KDH 페이지 |
| kdh-naksan | 낙산공원 성곽 장면 | KDH 페이지 |
| kdh-nseoul-tower | N서울타워 클라이맥스 | KDH 페이지 |
| kdh-gwanghwamun | 광화문광장 오프닝 | KDH 페이지 |
| kdh-insadong | 인사동 전통시장 장면 | KDH 페이지 |
| gyeongbok-hero | 경복궁 히어로 (기존 재생성) | 홈페이지 히어로 |

---

## 8. 디자인 시스템

### 8.1 확정
- AGENTS.md의 Dancheong Neon Palette (1.1) — 변경 불가
- AGENTS.md 타이포그래피 (1.2) — Noto Serif KR + Cormorant Garamond + Pretendard
- AGENTS.md 단청 문양 CSS 패턴 (1.3) — 유지
- `ui-ux-pro-max` Motion-Driven 스타일 보조 참고 (기존 디자인 시스템이 우선)

### 8.2 활용 가능한 스크립트
```bash
# 디자인 시스템 검색 (필요시 보조)
python3 ~/.config/opencode/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>

# UI/UX 가이드라인 검색
python3 ~/.config/opencode/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux
```

---

## 9. 제약 조건 (LOCKED)

- AGENTS.md 9. "하지 말아야 할 것" 전부 준수
- KDH 저작권 이미지 직접 사용 금지 (AI 생성 이미지만)
- D1 마이그레이션은 PHASE 2 범위 아님 (palace_data.json 계속 사용)
- Three.js 사용 금지 (모바일 성능)
- 런타임 AI API 호출 금지
- GIF 사용 금지 (WebP 애니메이션으로 대체)

---

## 10. 성공 기준

- [ ] KDH 페이지: 6개 장소 × 씬 이미지 + 설명 + 1일 타임라인 + 모든 guideLink 연결
- [ ] 홈 히어로: CSS clip-path 문 열림 + 타이틀 채움 애니메이션
- [ ] 궁궐 상세: 시네마틱 히어로 + KDH 연결 섹션
- [ ] AI 이미지: 7장 생성, WebP 변환, public/ 배치
- [ ] 모바일 성능: prefers-reduced-motion 대응, touch-action 유지
- [ ] 빌드 정상 통과
