import palaceData from './palace_data.json';
import palaceOther from './palace_other.json';

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
  hookKr: string;
  hookEn: string;
  hookJa: string;
  hookZh: string;
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
    hookKr: '밤이 되면 이 문은 늘 잠겨 있었다. 왜 조선의 왕들은 궁궐의 북쪽 문을 두려워했을까?',
    hookEn: 'When night fell, this gate was always locked. Why did Joseon\'s kings fear their palace\'s northern door?',
    hookJa: '夜になるとこの門はいつも閉ざされていた。なぜ朝鮮の王たちは宮殿の北門を恐れたのか？',
    hookZh: '夜幕降临，这扇门总是上了锁。为什么朝鲜的国王们害怕宫殿的北门？',
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
    hookKr: '산자락을 깎지 않고, 산자락에 안긴 궁궐. 조선의 건축은 자연을 지배하지 않고 자연에 들었다.',
    hookEn: 'A palace that did not cut into the mountain — but rested against it. Joseon architecture did not conquer nature; it entered it.',
    hookJa: '山肌を切り崩さず、山懐に抱かれた宮殿。朝鮮の建築は自然を支配せず、自然の中に入った。',
    hookZh: '不去砍削山坡，而是依偎在山怀里的宫殿。朝鲜的建筑不征服自然，而是走进自然。',
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
    hookKr: '한때 이 자리에는 동물원과 식물원이 있었다. 왕실의 삶이 머물던 공간이 도민의 놀거리로 바뀐 날, 무엇이 사라졌을까?',
    hookEn: 'At one time, this ground held a zoo and botanical garden. The day a royal residence became public amusement — what disappeared?',
    hookJa: 'かつてこの場所には動物園と植物園があった。王室の生活が息づいた空間が市民の憩いの場に変わった日、何が消えたのか？',
    hookZh: '曾经这里有一座动物园和植物园。皇家生活的空间变成市民娱乐场那一天，消失了什么？',
  },
  {
    id: 4,
    nameKr: '덕수궁',
    nameEn: 'Deoksugung Palace',
    nameJa: '徳寿宮',
    nameZh: '德寿宫',
    image: 'https://www.heritage.go.kr/gung/gung4/images/mode_general_00_01.jpg',
    heroImage: 'https://www.heritage.go.kr/gung/gung4/images/mode_general_00_01.jpg',
    descKr: '근대와 전통이 공존하는 궁궐',
    descEn: 'A palace where modern and traditional architecture coexist',
    descJa: '近代と伝統が共存する宮殿',
    descZh: '现代与传统共存的宫殿',
    hookKr: '돌담길을 따라 걷다 보면, 어느 순간 서양식 석조 건물이 나타난다. 한옥과 석조가 나란히 선 이 풍경은, 조선이 끝내 닫지 못한 문을 보여준다.',
    hookEn: 'Walk the stone wall path, and at some point a Western-style stone building appears. This scene — hanok and stone standing side by side — shows the door Joseon could never fully close.',
    hookJa: '石垣道を歩いていると、ある瞬間西洋式の石造建築物が現れる。韓屋と石造が並び立つこの風景は、朝鮮がついに閉じられなかった扉を見せている。',
    hookZh: '沿着石墙路走着，忽然间一座西式石质建筑 appeared。这种韩屋与石砌并立的景象，展示了朝鲜始终没能关闭的门。',
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
    hookKr: '가장 평범한 건물이, 가장 오랜 시간을 품고 있었다. 매년 이 자리에서 죽은 이들을 기억하는 제사는, 600년째 끊어지지 않았다.',
    hookEn: 'The most ordinary-looking building held the longest time. The ritual that remembers the dead, held at this spot every year — has not stopped for 600 years.',
    hookJa: '最も平凡に見える建物が、最も長い時間を待っていた。毎年この場所で死者を記憶する祭祀は、600年にわたり絶えることがなかった。',
    hookZh: '最平凡的建筑，却承载着最长的时间。在这里每年纪念逝者的礼仪——已连续600年从未中断。',
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

export function getPalaceHook(p: Palace, lang: Lang): string {
  const map: Record<Lang, string> = { kr: p.hookKr, en: p.hookEn, ja: p.hookJa, zh: p.hookZh };
  return map[lang];
}

/* ── Palace other (other palaces building data) ── */
export const PALACE_OTHER = palaceOther as Record<string, any[]>;

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

/* ── Fetch palace building list (from local JSON) ── */
export async function fetchPalaceList(gungNumber: number): Promise<BuildingItem[]> {
  const buildings = (palaceData as Record<string, any[]>)[String(gungNumber)] || [];
  return buildings.map((b: any) => ({
    serialNumber: b.serialNumber,
    detailCode: b.detailCode,
    nameKr: b.nameKr,
    nameEn: b.nameEn || b.nameKr,
    nameJa: b.nameJa || b.nameKr,
    nameZh: b.nameZh || b.nameKr,
    imageUrl: b.mainImage,
    explanationKr: b.explanationKr,
    explanationEn: b.explanationEn || b.explanationKr,
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
  const buildings = (palaceData as Record<string, any[]>)[String(gungNumber)] || [];
  const b = buildings.find((item: any) =>
    String(item.serialNumber) === String(serialNumber) &&
    String(item.detailCode) === String(detailCode)
  );
  if (!b) return null;

  return {
    serialNumber: b.serialNumber,
    detailCode: b.detailCode,
    gungNumber: b.gungNumber,
    nameKr: b.nameKr,
    nameEn: b.nameEn || b.nameKr,
    nameJa: b.nameJa || b.nameKr,
    nameZh: b.nameZh || b.nameKr,
    explanationKr: b.explanationKr,
    explanationEn: b.explanationEn || b.explanationKr,
    explanationJa: b.explanationJa || b.explanationKr,
    explanationZh: b.explanationZh || b.explanationKr,
    mainImage: b.mainImage,
    images: b.images || [],
    videos: b.videos || [],
  };
}

/* ── Fetch building list from palaceOther (for other palaces) ── */
export async function fetchPalaceOtherList(gungNumber: number): Promise<BuildingItem[]> {
  const buildings = PALACE_OTHER[String(gungNumber)] || [];
  return buildings.map((b: any) => ({
    serialNumber: b.serialNumber,
    detailCode: b.detailCode,
    nameKr: b.nameKr,
    nameEn: b.nameEn || b.nameKr,
    nameJa: b.nameJa || b.nameKr,
    nameZh: b.nameZh || b.nameKr,
    imageUrl: b.mainImage,
    explanationKr: b.explanationKr,
    explanationEn: b.explanationEn || b.explanationKr,
  }));
}

/* ── Fetch building detail from palaceOther ── */
export async function fetchPalaceOtherDetail(
  gungNumber: number,
  serialNumber: number,
  detailCode: number,
): Promise<BuildingDetail | null> {
  const buildings = PALACE_OTHER[String(gungNumber)] || [];
  const b = buildings.find((item: any) =>
    String(item.serialNumber) === String(serialNumber) &&
    String(item.detailCode) === String(detailCode)
  );
  if (!b) return null;

  return {
    serialNumber: b.serialNumber,
    detailCode: b.detailCode,
    gungNumber: b.gungNumber,
    nameKr: b.nameKr,
    nameEn: b.nameEn || b.nameKr,
    nameJa: b.nameJa || b.nameKr,
    nameZh: b.nameZh || b.nameKr,
    explanationKr: b.explanationKr,
    explanationEn: b.explanationEn || b.explanationKr,
    explanationJa: b.explanationJa || b.explanationKr,
    explanationZh: b.explanationZh || b.explanationKr,
    mainImage: b.mainImage,
    images: b.images || [],
    videos: b.videos || [],
  };
}
