#!/usr/bin/env node
/**
 * Placeholder 이미지 생성기
 * HF API가 offline일 때 대체용
 * 단색 배경 + 텍스트 라벨 PNG 생성 후 WebP 변환
 */

import { mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const OUTPUT_DIR = new URL('../public/images/generated/', import.meta.url).pathname;
mkdirSync(OUTPUT_DIR, { recursive: true });

const IMAGES = [
  { id: 'kdh-hero',          label: 'KDH Hero\nGyeongbokgung',          color: '#1B4FD8' },
  { id: 'kdh-gyeongbokgung', label: 'Gyeongbokgung\nCourtyard',         color: '#C8231E' },
  { id: 'kdh-bukchon',       label: 'Bukchon\nAlley Chase',             color: '#E8A020' },
  { id: 'kdh-naksan',        label: 'Naksan Park\nFortress Wall',       color: '#1B4FD8' },
  { id: 'kdh-nseoul-tower',  label: 'N Seoul Tower\nClimax',            color: '#C8231E' },
  { id: 'kdh-gwanghwamun',   label: 'Gwanghwamun\nOpening Chase',      color: '#E8A020' },
  { id: 'kdh-insadong',      label: 'Insadong\nMarket Scene',           color: '#8B4513' },
  { id: 'gyeongbok-hero',    label: 'Gyeongbokgung\nHero',              color: '#0A0806' },
];

const SIZES = [
  { suffix: 'sm', width: 375, height: 656 },
  { suffix: 'md', width: 768, height: 1344 },
  { suffix: 'lg', width: 1200, height: 2100 },
];

console.log('═══════════════════════════════════════');
console.log('  Placeholder 이미지 생성');
console.log('═══════════════════════════════════════\n');

for (const img of IMAGES) {
  const { id, label, color } = img;
  const fullLabel = `${id}\n\n${label}`;

  for (const { suffix, width, height } of SIZES) {
    const outPath = `${OUTPUT_DIR}/${id}-${suffix}.webp`;
    const pointSize = Math.max(20, Math.floor(width / 12));

    try {
      execSync(
        `convert -size ${width}x${height} xc:'${color}' -fill '#FFD700' -pointsize ${pointSize} -gravity center -font Helvetica -annotate 0 '${fullLabel}' -quality 82 -define webp:lossless=false '${outPath}'`,
        { stdio: 'pipe' }
      );
      console.log(`  ✅ ${id}-${suffix}.webp`);
    } catch (err) {
      // Fallback: solid color only
      try {
        execSync(
          `convert -size ${width}x${height} xc:'${color}' -quality 82 -define webp:lossless=false '${outPath}'`,
          { stdio: 'pipe' }
        );
        console.log(`  ⚠️  ${id}-${suffix}.webp (solid only)`);
      } catch (e) {
        console.log(`  ❌ ${id}-${suffix}.webp failed: ${e.message}`);
      }
    }
  }
}

console.log(`\n═══════════════════════════════════════`);
console.log(`  완료: ${OUTPUT_DIR}`);
console.log(`═══════════════════════════════════════`);
