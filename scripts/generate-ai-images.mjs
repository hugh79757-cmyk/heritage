#!/usr/bin/env node
/**
 * AI 이미지 생성기 — 단청 네온 스타일
 * Hugging Face FLUX.1-schnell로 빌드타임 생성
 * 
 * 사용법:
 *   node scripts/generate-ai-images.mjs
 * 
 * 출력: public/images/generated/ (WebP, 3단계 리사이즈)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { homedir } from 'os';

// 공통 환경변수 먼저 로드
config({ path: resolve(homedir(), '.env.common') });
// 프로젝트 로컬 .env가 있으면 덮어씀
config({ path: resolve(process.cwd(), '.env') });

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const HF_TOKEN = process.env.HF_TOKEN;
if (!HF_TOKEN) {
  console.error('❌ HF_TOKEN 환경변수가 필요합니다.');
  console.error('   무료 토큰: https://huggingface.co/settings/tokens');
  process.exit(1);
}

const OUTPUT_DIR = new URL('../public/images/generated/', import.meta.url).pathname;
mkdirSync(OUTPUT_DIR, { recursive: true });

const STYLE_PREFIX = `Joseon Dynasty palace Korea, traditional dancheong colors (red, blue, gold, white), night scene, neon glow effect on traditional architecture, cinematic lighting, vibrant colors, KPop Demon Hunters animation style, ultra detailed, photorealistic`;

const IMAGES = [
  {
    id: 'gyeongbok-hero',
    prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace Geunjeongjeon main hall, full moon, golden lanterns, red and blue dancheong pillars glowing, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'gyeonghoeru-night',
    prompt: `${STYLE_PREFIX}, Gyeonghoeru Pavilion reflected in moonlit pond, lotus flowers, teal neon water reflection, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'changdeokgung-secret',
    prompt: `${STYLE_PREFIX}, Changdeokgung Secret Garden pavilion surrounded by autumn foliage, warm golden lanterns, mysterious atmosphere, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'jongno-joseon',
    prompt: `${STYLE_PREFIX}, Joseon era Jongno street scene, merchants and nobles in colorful hanbok, traditional shop signs, lantern festival, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'deoksugung-modern',
    prompt: `${STYLE_PREFIX}, Deoksugung Palace Seokjojeon Western-style building at night, contrast of modern and traditional, neon street lights, 9:16 mobile portrait`,
    size: '768x1344',
  },
];

async function generateImage(imageDef) {
  const { id, prompt, size } = imageDef;
  const [width, height] = size.split('x').map(Number);

  console.log(`🎨 Generating: ${id} (${size})...`);

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width,
            height,
            num_inference_steps: 4,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error(`  ❌ API error ${response.status}: ${err}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const rawPath = `${OUTPUT_DIR}/${id}-raw.png`;
    writeFileSync(rawPath, buffer);
    console.log(`  ✅ Raw saved: ${rawPath}`);

    // WebP 변환 + 리사이즈 (3단계)
    const sizes = [
      { suffix: 'sm', width: 375 },
      { suffix: 'md', width: 768 },
      { suffix: 'lg', width: 1200 },
    ];

    for (const { suffix, width: w } of sizes) {
      const outPath = `${OUTPUT_DIR}/${id}-${suffix}.webp`;
      try {
        execSync(
          `convert "${rawPath}" -resize ${w}x -quality 82 -define webp:lossless=false "${outPath}"`,
          { stdio: 'pipe' }
        );
        console.log(`  ✅ ${suffix}: ${outPath}`);
      } catch {
        // ImageMagick 없으면 Sharp 시도
        try {
          execSync(
            `npx sharp-cli -i "${rawPath}" -o "${outPath}" -- resize ${w} --format webp --quality 82`,
            { stdio: 'pipe' }
          );
          console.log(`  ✅ ${suffix} (sharp): ${outPath}`);
        } catch {
          console.log(`  ⚠️  리사이즈 스킵 (ImageMagick/Sharp 미설치)`);
        }
      }
    }

    // 원본 PNG 삭제 (디스크 절약)
    try { execSync(`rm "${rawPath}"`, { stdio: 'pipe' }); } catch {}

    return true;
  } catch (e) {
    console.error(`  ❌ Failed: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  K-Heritage AI Image Generator');
  console.log('  단청 네온 스타일 이미지 생성');
  console.log('═══════════════════════════════════════\n');

  let success = 0;
  let fail = 0;

  for (const img of IMAGES) {
    const ok = await generateImage(img);
    if (ok) success++;
    else fail++;
    // 무료 티어 rate limit 대응
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`  완료: ${success}개 성공, ${fail}개 실패`);
  console.log(`  출력: ${OUTPUT_DIR}`);
  console.log(`═══════════════════════════════════════`);
}

main().catch(console.error);
