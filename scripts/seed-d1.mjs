#!/usr/bin/env node
/**
 * heritage_list.json → D1 시딩용 SQL 파일 생성
 * D1은 한 번에 큰 SQL을 못 받으므로 100건씩 나눠서 파일 생성
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const DATA_DIR = new URL('./data/', import.meta.url).pathname;
const SQL_DIR = DATA_DIR + 'sql/';
mkdirSync(SQL_DIR, { recursive: true });

const list = JSON.parse(readFileSync(DATA_DIR + 'heritage_list.json', 'utf-8'));

// 좌표 있는 것만 필터 (지도에 표시할 수 있는 것)
const withCoords = list.filter(i => i.lat !== 0 && i.lng !== 0);
const withoutCoords = list.filter(i => i.lat === 0 || i.lng === 0);

console.log(`전체: ${list.length}건`);
console.log(`좌표 있음: ${withCoords.length}건 → D1에 시딩`);
console.log(`좌표 없음: ${withoutCoords.length}건 → 스킵`);

// SQL 이스케이프
function esc(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

// 100건씩 묶어서 SQL 파일 생성
const BATCH = 100;
const batches = [];

for (let i = 0; i < withCoords.length; i += BATCH) {
  const chunk = withCoords.slice(i, i + BATCH);
  const values = chunk.map(item =>
    `('${esc(item.kdcd)}','${esc(item.asno)}','${esc(item.ctcd)}','${esc(item.cpno)}','${esc(item.nameKr)}','${esc(item.nameHanja)}','${esc(item.kdName)}','${esc(item.city)}','${esc(item.district)}',${item.lat},${item.lng},'','N','${esc(item.regDt)}')`
  ).join(',\n');

  const sql = `INSERT OR IGNORE INTO heritage_index (ccbaKdcd,ccbaAsno,ccbaCtcd,ccbaCpno,name_kr,name_hanja,type_name,sido_name,sigungu_name,latitude,longitude,image_url,cancel_yn,reg_dt) VALUES\n${values};`;

  const filename = `batch_${String(Math.floor(i / BATCH)).padStart(3, '0')}.sql`;
  writeFileSync(SQL_DIR + filename, sql);
  batches.push(filename);
}

console.log(`\nSQL 파일 ${batches.length}개 생성: ${SQL_DIR}`);

// 실행 스크립트 생성
const runScript = batches.map((f, idx) =>
  `echo "[${idx + 1}/${batches.length}] ${f}" && npx wrangler d1 execute heritage-db --remote --file=scripts/data/sql/${f}`
).join(' && \\\n');

writeFileSync(DATA_DIR + 'run_seed.sh', `#!/bin/bash\nset -e\n${runScript}\necho "\\n✅ 시딩 완료!"\n`);
console.log(`실행 스크립트: ${DATA_DIR}run_seed.sh`);

