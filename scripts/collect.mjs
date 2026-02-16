#!/usr/bin/env node
/**
 * 국가유산 데이터 수집기
 * - 중단 후 재시작 가능 (progress.json으로 진행상태 저장)
 * - 수집 결과: scripts/data/heritage_list.json, palace_details.json
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { setTimeout as sleep } from 'timers/promises';

const DATA_DIR = new URL('./data/', import.meta.url).pathname;
const PROGRESS_FILE = DATA_DIR + 'progress.json';
const LIST_FILE = DATA_DIR + 'heritage_list.json';
const PALACE_FILE = DATA_DIR + 'palace_details.json';

/* ── 진행상태 관리 ── */
function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return {
    // Phase 1: 국가유산 목록 수집
    listDone: false,
    listKdIdx: 0,      // 종목코드 배열 인덱스
    listPageIdx: 1,     // 현재 페이지
    listTotal: 0,       // 현재 종목 총 건수
    listCollected: 0,   // 전체 수집 건수
    // Phase 2: 국가유산 상세 수집
    detailDone: false,
    detailIdx: 0,       // heritage_list 배열 인덱스
    // Phase 3: 궁궐 상세 수집
    palaceDone: false,
    palaceGungIdx: 0,   // 궁 번호 인덱스 (0~4)
    palaceBldIdx: 0,    // 건물 인덱스
  };
}

function saveProgress(p) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

function loadList() {
  if (existsSync(LIST_FILE)) return JSON.parse(readFileSync(LIST_FILE, 'utf-8'));
  return [];
}
function saveList(list) {
  writeFileSync(LIST_FILE, JSON.stringify(list, null, 2));
}

function loadPalace() {
  if (existsSync(PALACE_FILE)) return JSON.parse(readFileSync(PALACE_FILE, 'utf-8'));
  return [];
}
function savePalace(list) {
  writeFileSync(PALACE_FILE, JSON.stringify(list, null, 2));
}

/* ── XML 파싱 헬퍼 ── */
function tag(xml, name) {
  const re = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`);
  const m = xml.match(re);
  if (!m) return '';
  return m[1].replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim();
}

function blocks(xml, name) {
  const re = new RegExp(`<${name}>[\\s\\S]*?</${name}>`, 'g');
  return xml.match(re) || [];
}

/* ── HTTP fetch with retry ── */
async function fetchXML(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      console.log(`  ⚠ retry ${i + 1}/${retries}: ${e.message}`);
      await sleep(2000 * (i + 1));
    }
  }
  console.log(`  ✗ FAILED: ${url}`);
  return null;
}

/* ═══════════════════════════════════════
   Phase 1: 국가유산 목록 수집
   ═══════════════════════════════════════ */
// 종목코드: 국보(11), 보물(12), 사적(13), 명승(15), 천연기념물(16), 국가민속(18), 국가등록(79)
const KIND_CODES = ['11', '12', '13', '15', '16', '18', '79'];
const KIND_NAMES = { '11': '국보', '12': '보물', '13': '사적', '15': '명승', '16': '천연기념물', '18': '국가민속문화유산', '79': '국가등록유산' };
const PAGE_SIZE = 100;

async function collectList() {
  const progress = loadProgress();
  if (progress.listDone) {
    console.log('✅ Phase 1 이미 완료 — 스킵');
    return;
  }

  const list = loadList();
  console.log(`\n📋 Phase 1: 국가유산 목록 수집 (기존 ${list.length}건)`);

  for (let ki = progress.listKdIdx; ki < KIND_CODES.length; ki++) {
    const kdcd = KIND_CODES[ki];
    let page = (ki === progress.listKdIdx) ? progress.listPageIdx : 1;
    let totalCnt = (ki === progress.listKdIdx) ? progress.listTotal : 0;

    console.log(`\n── ${KIND_NAMES[kdcd]} (${kdcd}) ──`);

    while (true) {
      const url = `http://www.khs.go.kr/cha/SearchKindOpenapiList.do?pageUnit=${PAGE_SIZE}&pageIndex=${page}&ccbaCncl=N&ccbaKdcd=${kdcd}`;
      console.log(`  page ${page} ...`);

      const xml = await fetchXML(url);
      if (!xml) { page++; continue; }

      if (totalCnt === 0) {
        totalCnt = parseInt(tag(xml, 'totalCnt')) || 0;
        console.log(`  총 ${totalCnt}건`);
      }

      const items = blocks(xml, 'item');
      if (items.length === 0) break;

      for (const item of items) {
        const lat = parseFloat(tag(item, 'latitude')) || 0;
        const lng = parseFloat(tag(item, 'longitude')) || 0;

        list.push({
          no: tag(item, 'no'),
          sn: tag(item, 'sn'),
          kdcd: tag(item, 'ccbaKdcd'),
          kdName: KIND_NAMES[kdcd],
          ctcd: tag(item, 'ccbaCtcd'),
          asno: tag(item, 'ccbaAsno'),
          cpno: tag(item, 'ccbaCpno'),
          nameKr: tag(item, 'ccbaMnm1'),
          nameHanja: tag(item, 'ccbaMnm2'),
          city: tag(item, 'ccbaCtcdNm'),
          district: tag(item, 'ccsiName'),
          cancel: tag(item, 'ccbaCncl'),
          lat, lng,
          regDt: tag(item, 'regDt'),
          // 상세는 Phase 2에서 채움
          detail: null,
        });
      }

      // 진행 저장
      progress.listKdIdx = ki;
      progress.listPageIdx = page + 1;
      progress.listTotal = totalCnt;
      progress.listCollected = list.length;
      saveProgress(progress);
      saveList(list);
      console.log(`  → 누적 ${list.length}건 저장`);

      if (page * PAGE_SIZE >= totalCnt) break;
      page++;
      await sleep(300); // API 부하 방지
    }
  }

  progress.listDone = true;
  progress.listKdIdx = KIND_CODES.length;
  saveProgress(progress);
  saveList(list);
  console.log(`\n✅ Phase 1 완료: 총 ${list.length}건`);
}

/* ═══════════════════════════════════════
   Phase 2: 국가유산 상세 수집 (좌표 있는 것만)
   ═══════════════════════════════════════ */
async function collectDetail() {
  const progress = loadProgress();
  if (progress.detailDone) {
    console.log('✅ Phase 2 이미 완료 — 스킵');
    return;
  }

  const list = loadList();
  // 좌표가 있는 것만 상세 수집 (지도에 표시할 수 있는 것)
  const targets = list.filter(item => item.lat !== 0 && item.lng !== 0);
  console.log(`\n🔍 Phase 2: 상세 수집 (좌표 있는 ${targets.length}건 중 ${progress.detailIdx}번째부터)`);

  for (let i = progress.detailIdx; i < targets.length; i++) {
    const item = targets[i];
    const url = `http://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=${item.kdcd}&ccbaAsno=${item.asno}&ccbaCtcd=${item.ctcd}`;

    if (i % 50 === 0) console.log(`  ${i}/${targets.length} (${((i/targets.length)*100).toFixed(1)}%)`);

    const xml = await fetchXML(url);
    if (xml) {
      // 원본 list에서 해당 항목 찾아서 detail 채움
      const idx = list.findIndex(l => l.asno === item.asno && l.kdcd === item.kdcd && l.ctcd === item.ctcd);
      if (idx >= 0) {
        list[idx].detail = {
          content: tag(xml, 'content'),
          era: tag(xml, 'ccceName'),
          address: tag(xml, 'ccbaLcad'),
          owner: tag(xml, 'ccbaPoss'),
          admin: tag(xml, 'ccbaAdmin'),
          quantity: tag(xml, 'ccbaQuan'),
          designatedDate: tag(xml, 'ccbaAsdt'),
          imageUrl: tag(xml, 'imageUrl').replace(/\s+/g, ''),
          category1: tag(xml, 'gcodeName'),
          category2: tag(xml, 'bcodeName'),
          category3: tag(xml, 'mcodeName'),
          category4: tag(xml, 'scodeName'),
        };
      }
    }

    progress.detailIdx = i + 1;
    // 100건마다 저장
    if (i % 100 === 0) {
      saveProgress(progress);
      saveList(list);
    }
    await sleep(200);
  }

  progress.detailDone = true;
  saveProgress(progress);
  saveList(list);
  console.log(`✅ Phase 2 완료`);
}

/* ═══════════════════════════════════════
   Phase 3: 궁궐 상세 수집 (4개국어)
   ═══════════════════════════════════════ */
const GUNG_NUMBERS = [1, 2, 3, 4, 5];
const GUNG_NAMES = { 1: '경복궁', 2: '창덕궁', 3: '창경궁', 4: '덕수궁', 5: '종묘' };

async function collectPalace() {
  const progress = loadProgress();
  if (progress.palaceDone) {
    console.log('✅ Phase 3 이미 완료 — 스킵');
    return;
  }

  const palaceData = loadPalace();
  console.log(`\n🏛 Phase 3: 궁궐 상세 수집 (기존 ${palaceData.length}건)`);

  for (let gi = progress.palaceGungIdx; gi < GUNG_NUMBERS.length; gi++) {
    const gungNum = GUNG_NUMBERS[gi];
    console.log(`\n── ${GUNG_NAMES[gungNum]} (${gungNum}) ──`);

    // 먼저 목록 가져오기
    const listUrl = `https://www.heritage.go.kr/heri/gungDetail/gogungListOpenApi.do?gung_number=${gungNum}`;
    const listXml = await fetchXML(listUrl);
    if (!listXml) continue;

    const buildings = blocks(listXml, 'list');
    console.log(`  건물 ${buildings.length}개`);

    const startIdx = (gi === progress.palaceGungIdx) ? progress.palaceBldIdx : 0;

    for (let bi = startIdx; bi < buildings.length; bi++) {
      const bld = buildings[bi];
      const sn = tag(bld, 'serial_number');
      const dc = tag(bld, 'detail_code');

      // 상세 API 호출
      const detailUrl = `https://www.heritage.go.kr/heri/gungDetail/gogungDetailOpenApi.do?serial_number=${sn}&detail_code=${dc}&gung_number=${gungNum}`;
      console.log(`  ${bi + 1}/${buildings.length} sn=${sn} dc=${dc}`);

      const xml = await fetchXML(detailUrl);
      if (!xml) continue;

      // 이미지 목록
      const imgBlocks = blocks(xml, 'imageInfo');
      const images = imgBlocks.map(b => ({
        idx: tag(b, 'imageIndex'),
        nameKr: tag(b, 'imageContentsKor'),
        nameEn: tag(b, 'imageContentsEng'),
        nameJa: tag(b, 'imageContentsJpa'),
        nameZh: tag(b, 'imageContentsChi'),
        descKr: tag(b, 'imageExplanationKor'),
        descEn: tag(b, 'imageExplanationEng'),
        descJa: tag(b, 'imageExplanationJpa'),
        descZh: tag(b, 'imageExplanationChi'),
        url: tag(b, 'imageUrl').replace(/\s+/g, ''),
      }));

      // 동영상 목록
      const movBlocks = blocks(xml, 'movieInfo');
      const movies = movBlocks.map(b => ({
        idx: tag(b, 'movieIndex'),
        nameKr: tag(b, 'movieContentsKor'),
        nameEn: tag(b, 'movieContentsEng'),
        nameJa: tag(b, 'movieContentsJpa'),
        nameZh: tag(b, 'movieContentsChi'),
        urlKr: tag(b, 'movieUrlKor').replace(/\s+/g, ''),
        urlEn: tag(b, 'movieUrlEng').replace(/\s+/g, ''),
        urlJa: tag(b, 'movieUrlJpa').replace(/\s+/g, ''),
        urlZh: tag(b, 'movieUrlChi').replace(/\s+/g, ''),
      }));

      palaceData.push({
        gungNumber: gungNum,
        gungName: GUNG_NAMES[gungNum],
        serialNumber: sn,
        detailCode: dc,
        nameKr: tag(xml, 'contents_kor'),
        nameEn: tag(xml, 'contents_eng'),
        nameJa: tag(xml, 'contents_jpa'),
        nameZh: tag(xml, 'contents_chi'),
        explanationKr: tag(xml, 'explanation_kor'),
        explanationEn: tag(xml, 'explanation_eng'),
        explanationJa: tag(xml, 'explanation_jpa'),
        explanationZh: tag(xml, 'explanation_chi'),
        mainImage: tag(xml, 'imgUrl').replace(/\s+/g, ''),
        images,
        movies,
      });

      progress.palaceGungIdx = gi;
      progress.palaceBldIdx = bi + 1;
      saveProgress(progress);
      savePalace(palaceData);
      await sleep(500);
    }
  }

  progress.palaceDone = true;
  saveProgress(progress);
  savePalace(palaceData);
  console.log(`\n✅ Phase 3 완료: 총 ${palaceData.length}건`);
}

/* ═══════════════════════════════════════
   메인 실행
   ═══════════════════════════════════════ */
async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  국가유산 데이터 수집기');
  console.log('  Ctrl+C로 중단해도 다시 실행하면 이어서 수집');
  console.log('═══════════════════════════════════════');

  const p = loadProgress();
  console.log(`\n현재 진행: Phase1=${p.listDone ? '✅' : '⏳'} Phase2=${p.detailDone ? '✅' : '⏳'} Phase3=${p.palaceDone ? '✅' : '⏳'}`);

  await collectList();    // Phase 1: 목록
  await collectDetail();  // Phase 2: 상세
  await collectPalace();  // Phase 3: 궁궐

  console.log('\n🎉 전체 수집 완료!');
  console.log(`  목록: ${LIST_FILE}`);
  console.log(`  궁궐: ${PALACE_FILE}`);

  // 통계
  const list = loadList();
  const withCoords = list.filter(i => i.lat !== 0);
  const withDetail = list.filter(i => i.detail);
  console.log(`  목록 총 ${list.length}건 / 좌표 ${withCoords.length}건 / 상세 ${withDetail.length}건`);
}

main().catch(console.error);
