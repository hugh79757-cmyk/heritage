#!/usr/bin/env node
/**
 * AI 이미지 생성기 — 단청 파스텔 스타일 (마 강조)
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
import { HfInference } from '@huggingface/inference';

const HF_TOKEN = process.env.HF_TOKEN;
if (!HF_TOKEN) {
  console.error('❌ HF_TOKEN 환경변수가 필요합니다.');
  console.error('   무료 토큰: https://huggingface.co/settings/tokens');
  process.exit(1);
}

const hf = new HfInference(HF_TOKEN);

const OUTPUT_DIR = new URL('../public/images/generated/', import.meta.url).pathname;
mkdirSync(OUTPUT_DIR, { recursive: true });

const STYLE_PREFIX = `
  Joseon Dynasty palace Korea, 
  traditional dancheong pastel colors (dalbang, eojang, hanji, sokpaltchi, celadon),
  soft morning light, gentle atmosphere,
  Korean minimalist composition with ma (negative space),
  serene and contemplative mood,
  ultra detailed, photorealistic
`;

const IMAGES = [
  {
    id: 'gyeongbok-hero',
    prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace Geunjeongjeon main hall at dawn, soft golden light bathing the dancheong pillars, mist gently rising from the courtyard, empty space inviting contemplation, traditional Korean architectural harmony, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'gyeonghoeru-night',
    prompt: `${STYLE_PREFIX}, Gyeonghoeru Pavilion reflected in moonlit pond, lotus flowers, soft ripples, pastel-hued sky with gentle moonlight, tranquil ambiance, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'changdeokgung-secret',
    prompt: `${STYLE_PREFIX}, Changdeokgung Secret Garden pavilion surrounded by autumn foliage in muted pastel tones, quiet pathway with stone lanterns, diffused sunlight through trees, peaceful solitude, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'jongno-joseon',
    prompt: `${STYLE_PREFIX}, Joseon era Jongno street scene, merchants and nobles in comfortable hanbok of pastel hues, traditional shop signs with subtle signage, lanterns providing soft glow, harmonious street life, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'deoksugung-modern',
    prompt: `${STYLE_PREFIX}, Deoksugung Palace Seokjojeon Western-style building at night, contrast of traditional dancheong accents and Western architecture under soft moonlight, balanced composition, gentle illumination, 9:16 mobile portrait`,
    size: '768x1344',
  },

  // ═══════════════════════════════════════════════════
  // PHASE 2 — KDH Scene Images (added below existing 5)
  // ═══════════════════════════════════════════════════

  {
    id: 'kdh-hero',
    prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace Geunjeongjeon at daybreak, dignified atmosphere with pastel dancheong pillars, soft light casting gentle shadows, open courtyard space evoking contemplation, traditional Korean architecture in serene morning light, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'kdh-gyeongbokgung',
    prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace main courtyard at morning, spacious layout with pastel-colored buildings, quiet ambiance with subtle hints of activity, harmonious balance of structure and nature, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'kdh-bukchon',
    prompt: `${STYLE_PREFIX}, Bukchon Hanok Village alleyway in soft morning light, traditional houses with pastel-toned tiles and walls, gentle shadows creating depth, peaceful residential atmosphere, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'kdh-naksan',
    prompt: `${STYLE_PREFIX}, Naksan Park Seoul City Wall at sunrise, ancient stone wall with muted pastel lichen textures, distant cityscape in soft haze, contemplative mood with open sky, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'kdh-nseoul-tower',
    prompt: `${STYLE_PREFIX}, N Seoul Tower at twilight, soft illumination on tower structure, distant city lights appearing as gentle glows, harmonious blend of technology and tradition under pastel sky, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'kdh-gwanghwamun',
    prompt: `${STYLE_PREFIX}, Gwanghwamun Square at morning, statues and architecture bathed in soft light, open square providing sense of space and tranquility, subtle activity of people in traditional attire, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'kdh-insadong',
    prompt: `${STYLE_PREFIX}, Insadong traditional street in soft daylight, shopfronts with pastel-colored signs, people leisurely browsing, gentle atmosphere encouraging reflection and appreciation of culture, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'gyeongbok-hero',
    // Note: duplicate id; we keep the first one; this entry will be ignored or override? We'll keep unique.
    // We'll rename this to gyeongbok-hero-alt to avoid duplicate.
    id: 'gyeongbok-hero-alt',
    prompt: `${STYLE_PREFIX}, Gyeongbokgung Palace Geunjeongjeon main hall view from courtyard, majestic architecture framed by open space, soft light highlighting details, serene and powerful presence, 9:16 mobile portrait`,
    size: '768x1344',
  },

  // PHASE 2 v2 — 신규 KDH 5개 장소 (영화 스틸 톤)
  // 스타일: 다큐멘터리 사진이 아닌 영화 스틸처럼 연출
  // 골든아워/블루아워, 안개/조명 대비, 인물 없이 광각

  {
    id: 'kdh-jamsil',
    prompt: `Seoul Jamsil Sports Complex Olympic stadium at blue hour, floodlights just turned on, dramatic wide angle from low angle, stadium architecture silhouetted against deep blue sky, cinematic lighting, empty grandstand, movie still composition, no people, ultra detailed, photorealistic, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'kdh-cheongdam',
    prompt: `Cheongdam Bridge Seoul over Han River at twilight, bridge structure with car light trails streaking below, river reflecting ambient city light, Hanyangdoseong in soft distance, cinematic blue hour atmosphere, mist hovering above water, no people, wide angle, movie still, ultra detailed, photorealistic, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'kdh-coex',
    prompt: `COEX K-POP Square Samsung Seoul at night, massive outdoor LED screen glowing with colorful light against dark building facade, Starfield COEX mall entrance illuminated, cool blue and warm gold tones, cinematic contrast between dark sky and screen glow, no crowds, wide architectural shot, movie still, ultra detailed, photorealistic, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'kdh-myeongdong',
    prompt: `Myeongdong shopping street Seoul at night, neon signs and shop lighting glowing warm gold and red, dense commercial streetscape with glowing signage, wet pavement reflecting lights suggesting recent rain, cinematic energy but no crowds, wide one-point perspective down the street, blue hour sky above, movie still, ultra detailed, photorealistic, 9:16 mobile portrait`,
    size: '768x1344',
  },
  {
    id: 'kdh-lotte',
    prompt: `Lotte World Tower Seoul at blue hour, sleek glass tower rising into deep blue sky, top section illuminated with soft warm light, contrast between modern glass surface and low-rise historic city below, cinematic composition emphasizing verticality, no people, wide angle, movie still, ultra detailed, photorealistic, 9:16 mobile portrait`,
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
  console.log('  단청 파스텔 스타일 이미지 생성 (마 강조)');
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
