# Continue — K-Heritage Guide

## Last action

**홈 지도 "내 주변 문화유산" 카드 13종 전부 실사 이미지로 통일 + 배포 완료.**

**문제:** 이미지 없는 카드 7종(북촌, 원각사지, 광화문광장, 사직단, 동관왕묘, 한양도성, 낙산구간) + 흥인지문 → 카드가 사진 없이 노출. 사용자가 "실사 이미지로 통일해야 한다" 지적.

**수정:** `src/lib/landmarks.ts` — 빈 이미지 7곳에 Wikimedia Commons 실사 사진 연결 (전부 CC 라이선스, 960px 썸네일):
- 북촌한옥마을: `Bukchon_Hanok_Village_01.jpg` (CC0, Quality image)
- 광화문광장: `Gwanghwamun_Square.jpg` (CC BY-SA 3.0)
- 사직단: `Sajikdan_Shrine_in_Seoul,_Korea_02.jpg` (CC BY-SA 3.0)
- 원각사지: `Tapgol_Park_Pagoda.jpg` (CC BY 2.0, 500px)
- 한양도성·낙산구간: `한양도성낙산구간.jpg` (CC BY-SA 4.0, **WLM 2017 한국 1등 수상작** — 낙산공원에서 본 성곽)
- 흥인지문: `Heunginjimun,_Seoul_02.jpg` (CC BY-SA 4.0)
- 동관왕묘: `Dongmyo_Shrine_-_Seoul,_South_Korea_13-03139.JPG` (CC BY-SA 3.0)

**검증:** dev + 실사이트 Playwright — 근처 카드 13개 전부 이미지 보유, 깨짐 0, 요청 실패 0. `npm run build` 성공.
**배포:** Version `562b9124-9a58-4791-870d-47338e96a78b`

**참고:** 숭례문은 기존 khs.go.kr 이미지 유지(200 확인됨). 궁궐 5곳·종묘는 heritage.go.kr 유지.

## Next action

- 이미지 없는 카드 문제 해결됨. 다음으로 모바일 AdSense 광고 배치/타이밍 최적화 검토 가능

## Open threads

- `MapExplore.astro` 근처 목록: 이미지 없는 카드 8종의 시각적 표현 — 사용자 확인 필요
- `~/.env.common`의 `CLOUDFLARE_API_TOKEN`은 배포 권한 없음 — 배포는 wrangler 프로필(`hugh79757`) 사용
- `response.txt`, `dev.log`, `preview.log`, `qa-screenshots/`, `test-results/`, `.commandcode/`, `.omo/`는 untracked 유지 (커밋 제외 대상)

## Do not

- **배포 시**: `npx wrangler deploy` 단독 실행 금지. 반드시 `zsh -c 'unset CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID CF_DNS_TOKEN CLOUDFLARE_WORKERS_AI_API_TOKEN R2_ENDPOINT; npx wrangler deploy'` 로 실행 (env 토큰이 프로필 인증을 덮어써서 실패함).
- **jpeg 파일 수신 시**: 파일명 앞에 공백이 붙는 경우가 있음 — `ls -b`로 확인 후 공백 제거하고 3단계 WebP 변환(`magick convert -resize {375|768|1200}x -quality 82 -define webp:lossless=false`) 필수. 페이지는 `{id}-{sm,md,lg}.webp`를 참조.
- KDH 씬 이미지 id는 `src/data/kdh-scenes.ts`의 `imageId` 필드가 소스 of truth — 새 이미지 추가 시 `MISSING_IMAGES` 셋 비워둔 상태 유지.
- **언어 전환 수정 시**: KDH 상세 페이지는 SSR 동적 라우트임을 유지할 것. `prerender = true`로 되돌리면 쿼리스트링 기반 언어 전환이 다시 깨짐.
- **목록 페이지 스크립트**: 클라이언트에서 `lang` 쓸 때 `define:vars` 필수. 마커/레이어 추가는 `map.on('load')` 안에서.
