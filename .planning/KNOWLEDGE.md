# KNOWLEDGE — 배포 및 이미지 파이프라인 (2026-08-11 세션에서 학습)

- **배포 인증**: `CLOUDFLARE_API_TOKEN` env는 배포 권한 없음 (Authentication error 10000).
  반드시 wrangler 프로필 `hugh79757` 사용 — `zsh -c 'unset CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID CF_DNS_TOKEN CLOUDFLARE_WORKERS_AI_API_TOKEN R2_ENDPOINT; npx wrangler deploy'`.
  (TECHNICAL_DOC.md §10.2에 문서화됨)
- **이미지 에셋**: 페이지는 `public/images/generated/{id}-{sm,md,lg}.webp` 3단계를 참조.
  jpeg 원본 수신 시 파일명 앞 공백(숨은 문자) 확인(`ls -b`) 후 제거, `magick convert -resize {375|768|1200}x -quality 82`로 변환.
- **배포 직후 404**: Cloudflare 에셋 프로파게이션 지연으로 첫 배포 직후 잠깐 404 보일 수 있음 — 재배포로 해결됨. 곧바로 재시도할 것.
- **KDH 씬 이미지**: `src/data/kdh-scenes.ts`의 `imageId`가 소스 of truth. 9개 씬 전부 이미지 보유 중.
- **라이트 모드 팔레트**: `--color-primary: #3D7EAA` (진한 청색) — 파스텔 블루는 베이지 카드 위 대비 부족으로 교체함. 파스텔 원색은 `--dancheong-*-pastel`에 유지.
