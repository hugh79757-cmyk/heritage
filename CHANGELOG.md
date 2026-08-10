# CHANGELOG.md — K-Heritage Guide

## v1 → v2 전환 (2026-08-10)

### 핵심 판단 변경

**이전 (v1)**
- 콘텐츠를 "페이지 수"와 "단어 수"로 정의
- 케데헌 장소 6곳, 경복궁 34개 지점 등 양적 확장 중심
- "실제 서울 촬영지" — 실사 촬영 전제로 페이지 구성

**이후 (v2)**
- 콘텐츠를 "3초 신뢰 → 30초 즉답 → 감정적 몰입" 퍼널 구조로 재정의
- 각 페이지는 타입 A/B/C/D 중 하나에 속하며, 해당 타입의 심리적 단계를 순서대로 통과해야 함
- 케데헌은 **애니메이션**임을 명확히 함 → "실제 촬영지" 표현 전면 폐기
- Netflix Tudum 기준 9개 장소의 정확한 장면 컨텍스트로 데이터 재작성
- 롯데월드타워·경복궁은 "직접 등장 아님" 명시 (디자인 모티프 / 건축적 영감)

### v2 판단 근거

1. **사실 정확성**: 기존 kdh-scenes.ts의 장면 설명(경복궁=최후결전, 광화문=오프닝추격, 인사동=전통시장)은 Netflix Tudum에 근거가 없음. 애니메이션의 배경을 "촬영지"로 소개하는 것은 독자 기만.
2. **콘텐츠의 질**: 방문자가 3초 안에 "여기 맞다"고 느끼게 하려면, 페이지 타입별 퍼널 구조가 먼저 설계되어야 함. 구조 없는 양적 확장은 체류시간 증가에 기여하지 않음.
3. **서사 공식**: 모든 궁궐 지점 콘텐츠를 "훅 → 인간의 순간 → 사실 → 현재 연결 → 다음 초대" 5단 구조로 리라이트. 길게 쓰는 것이 목표가 아님.

### 구현 완료 항목

| 항목 | 상태 | 설명 |
|------|------|------|
| `QuickAnswerBox.astro` | ✅ 완료 | 타입 A 페이지용 즉답 정보 컴포넌트. 주소·가는 법·운영시간·소요시간·지도링크. 히어로 바로 아래 배치 |
| `kdh-scenes.ts` v2 | ✅ 완료 | 6→9개 장소 확장. Netflix Tudum 기준 장면 설명. address/directions/hours/duration/mapLinks 필드 추가. 경복궁·롯데월드타워 "직접 등장 아님" 명시 |
| `kpop-demon-hunters/[id].astro` | ✅ 완료 | 타입 A 구조: Hero → QuickAnswerBox(즉답) → Film Context(몰입, 서사 5단) → 네비게이션(행동). 9개 페이지 prerender |
| `kpop-demon-hunters.astro` (허브) | ✅ 완료 | 타입 C 구조: 히어로 + QuickAnswerBox + MapLibre 지도(9개 핀, 타입별 색상 구분) + 카드 그리드(최소정보 노출) + 순례 루트(9단계) + FAQ. 지도-카드 클릭 연동 |
| AI 이미지 5종 | ⏳ 보류 | kdh-jamsil, kdh-cheongdam, kdh-coex, kdh-myeongdong, kdh-lotte. HF_TOKEN 부재. scripts/generate-ai-images.mjs에 프롬프트 추가됨 (영화 스틸 톤) |

### 이미지 생성 보류 사유

`scripts/generate-ai-images.mjs`에 5개 신규 프롬프트가 추가되었으나, Hugging Face 토큰(HF_TOKEN)이 `.env.common`에 없어 생성을 실행하지 못함. 실행 명령어:

```bash
HF_TOKEN=xxx node scripts/generate-ai-images.mjs
```

프롬프트 스타일: 기존 파스텔 단청 톤과 달리 **영화 스틸 톤** (블루아워·골든아워, 조명 대비, 인물 없음, 광각)

### 기존 이미지 정리 예정

- `kdh-gwanghwamun-*.webp` — v2에서 광화문 제거. 추후 삭제
- `kdh-insadong-*.webp` — v2에서 인사동 제거. 추후 삭제

---

## v2 추가 작업 (2026-08-10 후반 세션)

### v2 지시서 준수도 완성

**이전 상태 (세션 초반)**
- CSS 변수 크라이시스: `--bg-night`, `--neon-gold`, `--neon-blue`, `--neon-red`, `--neon-purple`, `--bg-glass`, `--bg-glass-border`, `--color-hero-overlay`, `--glow-gold`, `--dancheong-white` 등 20여 개 변수가 `:root`에 정의되지 않은 채 전역에 사용됨. 히어로·네비게이션·글라스 카드·네온 텍스트 등 핵심 비주얼이 브라우저 기본값으로 폴백되고 있었음.
- 타이포그래피: 글로벌 h1/h2/h3 사이즈 정의 없음. 모든 컴포넌트 페이지에서 개별 clamp()로 정의.
- 홈 KDH 섹션: "실제 서울 장소", "Real Locations from KPop Demon Hunters" 등 v2 사실성 원칙 위반 표현 사용 중.
- KDH 상세 페이지: 타입 라벨(장면 배경/건축적 영감/디자인 모티프) 미표시.
- 궁궐 목록 페이지: 백과사전식 desc만 표시, 서사 훅 없음.

**이후 상태 (세션 종료 시점)**
- `:root`에 누락된 모든 변수 추가 완료. 히어로 배경·네비게이션 유리 효과·네온 글로우·그라디언트 보더·샵머 로딩 등 기존 CSS가 의도대로 렌더링됨.
- 글로벌 typography 규칙 추가: `h1 clamp(2.25rem, 6vw, 3.5rem)`, `h2 clamp(1.5rem, 4vw, 2.2rem)`, `h3 clamp(1.2rem, 3vw, 1.5rem)`, `p line-height 1.8`. 컴포넌트별 clamp()와 충돌 없이 기본값으로 작동.
- 홈 KDH 섹션: "실제 서울 장소/Real Locations from" → "영감의 장소들/Seoul Inspirations of"로 변경. 히어로 아래에 "※ KPop Demon Hunters는 애니메이션 영화입니다" 노트 추가.
- KDH 상세 페이지: 히어로에 타입 배지 추가. `getTypeLabel()` 헬퍼 함수로 장면 배경/건축적 영감/디자인 모티프 라벨을 4개 국어로 표시. `lang === 'kr'` 케이스 누락 버그 수정.
- 궁궐 목록 페이지(palace/[id].astro): `getPalaceHook()` 헬퍼 추가, PALACES 데이터에 5개 궁궐별 서사 훅(한/일/영/중) 추가. 히어로 서브타이틀을 desc에서 hook으로 교체, 그 아래에 desc를 리드 문단(palace-lead)으로 표시.
- navLabels: "이전 장면/다음 장면/전체 촬영지" → "이전 장소/다음 장소/전체 장소"로 변경 (한/일/영/중 모두). 섹션 라벨 "촬영지 가이드" → "장소별 가이드".

### CSS 변수 추가 목록

| 변수 | 값 | 사용처 |
|------|-----|--------|
| `--bg-night` | `#080510` | 히어로, 궁궐 히어로 배경 |
| `--bg-card` | `#12101A` | shimmer 로딩 |
| `--bg-card-hover` | `#1a1625` | shimmer 로딩 |
| `--dancheong-white` | `#F5F0E8` | 선택 색상, 히어로 텍스트, 네비 로고 |
| `--dancheong-black` | `#0A0806` | (보완용) |
| `--neon-blue` | `#00C8FF` | 네온 텍스트, 커서, 파티클 |
| `--neon-red` | `#FF3B5C` | 네온 텍스트, 배지 |
| `--neon-gold` | `#FFD700` | 버튼, 배지, 텍스트 글로우 |
| `--neon-purple` | `#B066FF` | 네온 텍스트 purple |
| `--glow-gold` | `0 0 20px rgba(255,215,0,0.4)` | 글로우 효과 |
| `--bg-glass` | `rgba(18,16,26,0.55)` | 글라스 카드 배경 |
| `--bg-glass-border` | `rgba(255,255,255,0.08)` | 글라스 카드 보더 |
| `--color-hero-overlay` | `linear-gradient(...)` | 히어로 오버레이 |
| `--dancheong-blue` | `#1B4FD8` | 단청 divider |
| `--dancheong-red` | `#C8231E` | 단청 divider, 배지 |
| `--dancheong-yellow` | `#E8A020` | 단청 divider, 링크 색상 |

### 완성된 v2 완료 기준 (Definition of Done) 대비

| 기준 | 상태 | 비고 |
|------|------|------|
| 모든 타입 A 페이지에 QuickAnswerBox가 스크롤 없이 노출 | ✅ | jamsil/gyeongbokgung/lotte-world-tower 등 9개 페이지 모두 확인 |
| 궁궐 지점 콘텐츠 샘플 10개 무작위 추출 시 5단 구조 확인 | ⏳ | 경복궁 34개 지점 리라이트 미완료 (v2-PLAN.md Task 1) |
| 첫 화면 3초 내 페이지 목적 파악 가능 | ✅ | 홈: "단청이 깨어난다" + 히어로 이미지. KDH: "애니메이션 영화" 명시 + 영감의 장소 |
| 이미지 아트 디렉션: 영화 스틸 톤 | ⏳ | AI 이미지 5종 HF_TOKEN 부재로 생성 불가. 기존 이미지는 필름 스틸 프롬프트로 생성된 것만 사용 중 |
| 케데헌 콘텐츠에 사실 오류 없음 (0번 표 기준) | ✅ | 9개 장소 모두 Netflix Tudum 기준. FAQ에서 "애니메이션" 명시. 롯데월드타워·경복궁 "직접 등장 아님" |
| 타입 D 페이지 최소 1개에 다운로드/공유 결과물 | ⏳ | 테마 가이드(Task 6) 미시작 |
| CHANGELOG.md에 v1→v2 판단 변경 사유 기록 | ✅ | 기록 완료 |
