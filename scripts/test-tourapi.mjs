import { config } from 'dotenv';
import { resolve } from 'path';
import { homedir } from 'os';

config({ path: resolve(homedir(), '.env.common') });

const SERVICE_KEY = process.env.DATA_GO_KR_API_KEY;
const BASE_URL = 'http://apis.data.go.kr/B551011/KorService1';

async function testTourAPI() {
  // 테스트 1: 경복궁 상세 이미지
  const imgUrl = `${BASE_URL}/detailImage1?serviceKey=${SERVICE_KEY}&contentId=264337&imageYN=Y&subImageYN=Y&MobileOS=ETC&MobileApp=KHeritageGuide&_type=json`;
  const res = await fetch(imgUrl);
  const text = await res.text();
  console.log('=== 경복궁 이미지 (raw first 500 chars) ===');
  console.log(text.slice(0, 500));

  try {
    const data = JSON.parse(text);
    const items = data?.response?.body?.items?.item;
    if (items && items.length > 0) {
      console.log('\n총', items.length, '건');
      console.log('첫 번째:', JSON.stringify(items[0], null, 2));
    }
  } catch(e) {
    console.log('\nJSON 파싱 실패 — 원본 응답 확인 필요');
  }

  // 테스트 2: 검색
  const searchUrl = `${BASE_URL}/searchKeyword1?serviceKey=${SERVICE_KEY}&keyword=북촌한옥마을&MobileOS=ETC&MobileApp=KHeritageGuide&_type=json&numOfRows=3`;
  const res2 = await fetch(searchUrl);
  const text2 = await res2.text();
  console.log('\n=== 북촌 검색 (raw first 500 chars) ===');
  console.log(text2.slice(0, 500));
}

testTourAPI().catch(console.error);
