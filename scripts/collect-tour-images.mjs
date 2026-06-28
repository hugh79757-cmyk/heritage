import { config } from 'dotenv';
import { resolve } from 'path';
import { homedir } from 'os';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

config({ path: resolve(homedir(), '.env.common') });

const SERVICE_KEY = process.env.DATA_GO_KR_API_KEY;
const BASE_URL = 'http://apis.data.go.kr/B551011/PhotoGalleryService1';
const OUTPUT_DIR = new URL('../public/tour-images/', import.meta.url).pathname;

mkdirSync(OUTPUT_DIR, { recursive: true });

const TARGETS = [
  { id: 'gyeongbokgung', keyword: '경복궁', label: '경복궁' },
  { id: 'bukchon', keyword: '북촌한옥마을', label: '북촌한옥마을' },
  { id: 'naksan', keyword: '낙산공원 한양도성', label: '낙산공원' },
  { id: 'gwanghwamun', keyword: '광화문광장', label: '광화문광장' },
  { id: 'insadong', keyword: '인사동', label: '인사동' },
  { id: 'nseoul', keyword: 'N서울타워', label: 'N서울타워' },
];

async function searchPhoto(keyword) {
  const url = `${BASE_URL}/gallerySearchList1?serviceKey=${SERVICE_KEY}&keyword=${encodeURIComponent(keyword)}&MobileOS=ETC&MobileApp=KHeritageGuide&_type=json&numOfRows=5`;
  const res = await fetch(url);
  const data = await res.json();
  const items = data?.response?.body?.items?.item;
  if (!items || items.length === 0) return null;
  // 이미지가 있는 것 중 첫 번째
  for (const item of items) {
    if (item.galWebImageUrl) {
      return {
        url: item.galWebImageUrl,
        title: item.galTitle,
        photographer: item.galPhotographer,
        keyword: item.galSearchKeyword,
      };
    }
  }
  return null;
}

async function downloadImage(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(filepath, buffer);
  return buffer.length;
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  TourAPI 사진 수집기');
  console.log('═══════════════════════════════════════\n');

  const index = {};

  for (const target of TARGETS) {
    console.log(`🔍 ${target.label} (${target.keyword})...`);
    const photo = await searchPhoto(target.keyword);

    if (!photo) {
      console.log(`  ⚠️  사진 없음\n`);
      continue;
    }

    console.log(`  📸 ${photo.title}`);
    console.log(`  📷 ${photo.photographer}`);

    try {
      const filepath = `${OUTPUT_DIR}/${target.id}.jpg`;
      const size = await downloadImage(photo.url, filepath);
      console.log(`  ✅ 저장: ${target.id}.jpg (${(size / 1024).toFixed(0)}KB)`);

      index[target.id] = {
        url: photo.url,
        localPath: `/tour-images/${target.id}.jpg`,
        title: photo.title,
        photographer: photo.photographer,
      };
    } catch (e) {
      console.log(`  ❌ 다운로드 실패: ${e.message}`);
    }

    console.log('');
    await new Promise(r => setTimeout(r, 1500)); // rate limit
  }

  // index.json 저장
  const indexPath = `${OUTPUT_DIR}/index.json`;
  writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`📋 index.json 저장: ${indexPath}`);
  console.log(`\n✅ 완료: ${Object.keys(index).length}건 수집`);
}

main().catch(console.error);
