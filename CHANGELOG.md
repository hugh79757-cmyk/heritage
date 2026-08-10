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
