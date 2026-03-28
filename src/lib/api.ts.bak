/* ── Palace metadata ── */
export interface Palace {
  id: number;
  nameKr: string;
  nameEn: string;
  nameJa: string;
  nameZh: string;
  image: string;
  heroImage: string;
  descKr: string;
  descEn: string;
  descJa: string;
  descZh: string;
}

export const PALACES: Palace[] = [
  {
    id: 1,
    nameKr: '경복궁',
    nameEn: 'Gyeongbokgung Palace',
    nameJa: '景福宮',
    nameZh: '景福宫',
    image: 'https://www.heritage.go.kr/gung/gogung1/images/ic-c1.jpg',
    heroImage: 'https://www.heritage.go.kr/gung/gogung1/images/ic-e21.jpg',
    descKr: '조선왕조 제일의 법궁',
    descEn: 'The primary royal palace of the Joseon dynasty',
    descJa: '朝鮮王朝第一の法宮',
    descZh: '朝鲜王朝第一法宫',
  },
  {
    id: 2,
    nameKr: '창덕궁',
    nameEn: 'Changdeokgung Palace',
    nameJa: '昌德宮',
    nameZh: '昌德宫',
    image: 'https://www.heritage.go.kr/gung/gogung2/images/img_changdeok_story_bg_00_00.jpg',
    heroImage: 'https://www.heritage.go.kr/gung/gogung2/images/img_changdeok_story_bg_00_00.jpg',
    descKr: 'UNESCO 세계유산, 자연과 조화를 이룬 궁궐',
    descEn: 'UNESCO World Heritage palace harmonized with nature',
    descJa: 'UNESCO世界遺産、自然と調和した宮殿',
    descZh: 'UNESCO世界遗产，与自然和谐的宫殿',
  },
  {
    id: 3,
    nameKr: '창경궁',
    nameEn: 'Changgyeonggung Palace',
    nameJa: '昌慶宮',
    nameZh: '昌庆宫',
    image: 'https://www.heritage.go.kr/gung/gogung3/images/img_changgyeong_story_bg_00_00.jpg',
    heroImage: 'https://www.heritage.go.kr/gung/gogung3/images/img_changgyeong_story_bg_00_00.jpg',
    descKr: '생활 궁궐로서의 역사를 간직한 곳',
    descEn: 'A palace preserving the history of royal daily life',
    descJa: '生活宮殿としての歴史を刻む場所',
    descZh: '保留皇室日常生活历史的宫殿',
  },
  {
    id: 4,
    nameKr: '덕수궁',
    nameEn: 'Deoksugung Palace',
    nameJa: '徳寿宮',
    nameZh: '德寿宫',
    image: 'https://www.heritage.go.kr/gung/gogung4/images/mode_general_00_01.jpg',
    heroImage: 'https://www.heritage.go.kr/gung/gogung4/images/mode_general_00_01.jpg',
    descKr: '근대와 전통이 공존하는 궁궐',
    descEn: 'A palace where modern and traditional architecture coexist',
    descJa: '近代と伝統が共存する宮殿',
    descZh: '现代与传统共存的宫殿',
  },
  {
    id: 5,
    nameKr: '종묘',
    nameEn: 'Jongmyo Shrine',
    nameJa: '宗廟',
    nameZh: '宗庙',
    image: 'https://www.heritage.go.kr/gung/gogung5/images/img_jongmyo_story_bg_00_00.jpg',
    heroImage: 'https://www.heritage.go.kr/gung/gogung5/images/img_jongmyo_story_bg_19_00.jpg',
    descKr: 'UNESCO 세계유산, 조선 왕실의 사당',
    descEn: 'UNESCO World Heritage, the royal ancestral shrine of Joseon',
    descJa: 'UNESCO世界遺産、朝鮮王室の祠堂',
    descZh: 'UNESCO世界遗产，朝鲜王室祠堂',
  },
];

/* ── Language helpers ── */
export type Lang = 'kr' | 'en' | 'ja' | 'zh';

export function getLang(url: URL): Lang {
  const p = url.searchParams.get('lang');
  if (p === 'en' || p === 'ja' || p === 'zh') return p;
  return 'kr';
}

export function getPalaceName(p: Palace, lang: Lang): string {
  const map: Record<Lang, string> = { kr: p.nameKr, en: p.nameEn, ja: p.nameJa, zh: p.nameZh };
  return map[lang];
}

export function getPalaceDesc(p: Palace, lang: Lang): string {
  const map: Record<Lang, string> = { kr: p.descKr, en: p.descEn, ja: p.descJa, zh: p.descZh };
  return map[lang];
}

/* ── XML helpers ── */
function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const m = xml.match(re);
  return m ? m[1].replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim() : '';
}

function extractBlocks(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}>[\\s\\S]*?</${tag}>`, 'g');
  return xml.match(re) || [];
}

/* ── Building list item ── */
export interface BuildingItem {
  serialNumber: string;
  detailCode: string;
  nameKr: string;
  nameEn: string;
  nameJa: string;
  nameZh: string;
  imageUrl: string;
  explanationKr: string;
  explanationEn: string;
}

/* ── Fetch palace building list ── */
export async function fetchPalaceList(gungNumber: number): Promise<BuildingItem[]> {
  const url = `https://www.heritage.go.kr/heri/gungDetail/gogungListOpenApi.do?gung_number=${gungNumber}`;
  const res = await fetch(url);
  const xml = await res.text();
  const items = extractBlocks(xml, 'list');

  return items.map((block) => ({
    serialNumber: extractTag(block, 'serial_number'),
    detailCode: extractTag(block, 'detail_code'),
    nameKr: extractTag(block, 'contents_kor'),
    nameEn: extractTag(block, 'contents_eng') || extractTag(block, 'contents_kor'),
    nameJa: extractTag(block, 'contents_jpa') || extractTag(block, 'contents_kor'),
    nameZh: extractTag(block, 'contents_chi') || extractTag(block, 'contents_kor'),
    imageUrl: extractTag(block, 'imgUrl'),
    explanationKr: extractTag(block, 'explanation_kor'),
    explanationEn: extractTag(block, 'explanation_eng') || extractTag(block, 'explanation_kor'),
  }));
}

/* ── Building detail ── */
export interface BuildingDetail {
  serialNumber: string;
  detailCode: string;
  gungNumber: string;
  nameKr: string;
  nameEn: string;
  nameJa: string;
  nameZh: string;
  explanationKr: string;
  explanationEn: string;
  explanationJa: string;
  explanationZh: string;
  mainImage: string;
  images: { url: string; descKr: string; descEn: string }[];
  videos: { titleKr: string; titleEn: string; urlKr: string; urlEn: string; urlJa: string; urlZh: string }[];
}

export async function fetchBuildingDetail(
  gungNumber: number,
  serialNumber: number,
  detailCode: number,
): Promise<BuildingDetail | null> {
  const url = `https://www.heritage.go.kr/heri/gungDetail/gogungDetailOpenApi.do?serial_number=${serialNumber}&detail_code=${detailCode}&gung_number=${gungNumber}`;
  const res = await fetch(url);
  const xml = await res.text();

  if (!xml.includes('<result>')) return null;

  /* mainImage */
  const mainImageRaw = extractTag(xml, 'imgUrl');
  const mainImage = mainImageRaw.replace(/\s+/g, '').trim();

  /* images */
  const imgBlocks = extractBlocks(xml, 'imageInfo');
  const images = imgBlocks.map((b) => ({
    url: extractTag(b, 'imageUrl').replace(/\s+/g, '').trim(),
    descKr: extractTag(b, 'imageExplanationKor'),
    descEn: extractTag(b, 'imageExplanationEng') || extractTag(b, 'imageExplanationKor'),
  }));

  /* videos */
  const vidBlocks = extractBlocks(xml, 'movieInfo');
  const videos = vidBlocks.map((b) => ({
    titleKr: extractTag(b, 'movieContentsKor'),
    titleEn: extractTag(b, 'movieContentsEng') || extractTag(b, 'movieContentsKor'),
    urlKr: extractTag(b, 'movieUrlKor'),
    urlEn: extractTag(b, 'movieUrlEng') || extractTag(b, 'movieUrlKor'),
    urlJa: extractTag(b, 'movieUrlJpa') || extractTag(b, 'movieUrlKor'),
    urlZh: extractTag(b, 'movieUrlChi') || extractTag(b, 'movieUrlKor'),
  }));

  return {
    serialNumber: extractTag(xml, 'serial_number'),
    detailCode: extractTag(xml, 'detail_code'),
    gungNumber: extractTag(xml, 'gung_number'),
    nameKr: extractTag(xml, 'contents_kor'),
    nameEn: extractTag(xml, 'contents_eng') || extractTag(xml, 'contents_kor'),
    nameJa: extractTag(xml, 'contents_jpa') || extractTag(xml, 'contents_kor'),
    nameZh: extractTag(xml, 'contents_chi') || extractTag(xml, 'contents_kor'),
    explanationKr: extractTag(xml, 'explanation_kor'),
    explanationEn: extractTag(xml, 'explanation_eng') || extractTag(xml, 'explanation_kor'),
    explanationJa: extractTag(xml, 'explanation_jpa') || extractTag(xml, 'explanation_kor'),
    explanationZh: extractTag(xml, 'explanation_chi') || extractTag(xml, 'explanation_kor'),
    mainImage,
    images,
    videos,
  };
}
