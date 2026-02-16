#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const list = JSON.parse(readFileSync('/Users/twinssn/Projects/heritage/scripts/data/heritage_list.json', 'utf-8'));
const withCoords = list.filter(i => i.lat !== 0 && i.lng !== 0);
console.log(`좌표 있는 것: ${withCoords.length}건`);

function esc(s) { return (s || '').replace(/'/g, "''"); }

const BATCH = 50;
let inserted = 0;

for (let i = 0; i < withCoords.length; i += BATCH) {
  const chunk = withCoords.slice(i, i + BATCH);
  const values = chunk.map(item =>
    `('${esc(item.kdcd)}','${esc(item.asno)}','${esc(item.ctcd)}','${esc(item.cpno)}','${esc(item.nameKr)}','${esc(item.nameHanja)}','${esc(item.kdName)}','${esc(item.city)}','${esc(item.district)}',${item.lat},${item.lng},'','N','${esc(item.regDt)}')`
  ).join(',');

  const sql = `INSERT OR IGNORE INTO heritage_index (ccbaKdcd,ccbaAsno,ccbaCtcd,ccbaCpno,name_kr,name_hanja,type_name,sido_name,sigungu_name,latitude,longitude,image_url,cancel_yn,reg_dt) VALUES ${values};`;

  try {
    execSync(`npx wrangler d1 execute heritage-db --remote --command="${sql.replace(/"/g, '\\"')}"`, { stdio: 'pipe' });
    inserted += chunk.length;
    if ((i / BATCH) % 10 === 0) console.log(`  ${inserted}/${withCoords.length} (${((inserted/withCoords.length)*100).toFixed(0)}%)`);
  } catch (e) {
    console.log(`  ⚠ batch ${i/BATCH} 실패, 개별 삽입 시도...`);
    for (const item of chunk) {
      const single = `INSERT OR IGNORE INTO heritage_index (ccbaKdcd,ccbaAsno,ccbaCtcd,ccbaCpno,name_kr,name_hanja,type_name,sido_name,sigungu_name,latitude,longitude,image_url,cancel_yn,reg_dt) VALUES ('${esc(item.kdcd)}','${esc(item.asno)}','${esc(item.ctcd)}','${esc(item.cpno)}','${esc(item.nameKr)}','${esc(item.nameHanja)}','${esc(item.kdName)}','${esc(item.city)}','${esc(item.district)}',${item.lat},${item.lng},'','N','${esc(item.regDt)}');`;
      try {
        execSync(`npx wrangler d1 execute heritage-db --remote --command="${single.replace(/"/g, '\\"')}"`, { stdio: 'pipe' });
        inserted++;
      } catch (e2) {
        console.log(`    ✗ 스킵: ${item.nameKr}`);
      }
    }
  }
}

console.log(`\n✅ 완료: ${inserted}건 삽입`);
