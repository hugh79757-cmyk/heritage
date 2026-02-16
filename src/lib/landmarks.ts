export interface Landmark {
  id: string;
  nameKr: string;
  nameEn: string;
  nameJa: string;
  nameZh: string;
  type: 'palace' | 'treasure' | 'historic' | 'scenic';
  typeLabelKr: string;
  typeLabelEn: string;
  lat: number;
  lng: number;
  image: string;
  link: string;
  descKr: string;
  descEn: string;
}

export const LANDMARKS: Landmark[] = [
  /* ── 5대 궁궐·종묘 ── */
  {
    id: 'palace-1',
    nameKr: '경복궁', nameEn: 'Gyeongbokgung Palace',
    nameJa: '景福宮', nameZh: '景福宫',
    type: 'palace', typeLabelKr: '궁궐', typeLabelEn: 'Palace',
    lat: 37.5796, lng: 126.9770,
    image: 'https://www.heritage.go.kr/gung/gogung1/images/ic-c1.jpg',
    link: '/palace/1',
    descKr: '조선왕조 제일의 법궁', descEn: 'The primary royal palace of the Joseon dynasty',
  },
  {
    id: 'palace-2',
    nameKr: '창덕궁', nameEn: 'Changdeokgung Palace',
    nameJa: '昌德宮', nameZh: '昌德宫',
    type: 'palace', typeLabelKr: '궁궐', typeLabelEn: 'Palace',
    lat: 37.5794, lng: 126.9910,
    image: 'https://www.heritage.go.kr/gung/gogung2/images/img_changdeok_story_bg_00_00.jpg',
    link: '/palace/2',
    descKr: 'UNESCO 세계유산', descEn: 'UNESCO World Heritage Site',
  },
  {
    id: 'palace-3',
    nameKr: '창경궁', nameEn: 'Changgyeonggung Palace',
    nameJa: '昌慶宮', nameZh: '昌庆宫',
    type: 'palace', typeLabelKr: '궁궐', typeLabelEn: 'Palace',
    lat: 37.5789, lng: 126.9948,
    image: 'https://www.heritage.go.kr/gung/gogung3/images/img_changgyeong_story_bg_00_00.jpg',
    link: '/palace/3',
    descKr: '생활 궁궐로서의 역사', descEn: 'History as a residential palace',
  },
  {
    id: 'palace-4',
    nameKr: '덕수궁', nameEn: 'Deoksugung Palace',
    nameJa: '徳寿宮', nameZh: '德寿宫',
    type: 'palace', typeLabelKr: '궁궐', typeLabelEn: 'Palace',
    lat: 37.5658, lng: 126.9751,
    image: 'https://www.heritage.go.kr/gung/gogung4/images/mode_general_00_01.jpg',
    link: '/palace/4',
    descKr: '근대와 전통이 공존', descEn: 'Modern and traditional coexist',
  },
  {
    id: 'palace-5',
    nameKr: '종묘', nameEn: 'Jongmyo Shrine',
    nameJa: '宗廟', nameZh: '宗庙',
    type: 'palace', typeLabelKr: '종묘', typeLabelEn: 'Shrine',
    lat: 37.5741, lng: 126.9942,
    image: 'https://www.heritage.go.kr/gung/gogung5/images/img_jongmyo_story_bg_00_00.jpg',
    link: '/palace/5',
    descKr: 'UNESCO 세계유산, 왕실 사당', descEn: 'UNESCO World Heritage, royal shrine',
  },
  /* ── 서울 주요 문화유산 ── */
  {
    id: 'nt-1',
    nameKr: '숭례문', nameEn: 'Sungnyemun Gate',
    nameJa: '崇礼門', nameZh: '崇礼门',
    type: 'treasure', typeLabelKr: '국보', typeLabelEn: 'National Treasure',
    lat: 37.5600, lng: 126.9753,
    image: 'http://www.khs.go.kr/unisearch/images/national_treasure/2685609.jpg',
    link: '#',
    descKr: '서울 숭례문 (남대문)', descEn: 'Sungnyemun, the Great South Gate',
  },
  {
    id: 'nt-2',
    nameKr: '흥인지문', nameEn: 'Heunginjimun Gate',
    nameJa: '興仁之門', nameZh: '兴仁之门',
    type: 'treasure', typeLabelKr: '보물', typeLabelEn: 'Treasure',
    lat: 37.5711, lng: 127.0095,
    image: 'http://www.khs.go.kr/unisearch/images/treasure/1633002.jpg',
    link: '#',
    descKr: '한양도성 동대문', descEn: 'East Gate of Seoul Fortress',
  },
  {
    id: 'hs-1',
    nameKr: '한양도성', nameEn: 'Seoul City Wall',
    nameJa: '漢陽都城', nameZh: '汉阳都城',
    type: 'historic', typeLabelKr: '사적', typeLabelEn: 'Historic Site',
    lat: 37.5884, lng: 126.9668,
    image: 'http://www.khs.go.kr/unisearch/images/historic_site/1712208.jpg',
    link: '#',
    descKr: '조선시대 도성 성곽', descEn: 'Joseon Dynasty city wall',
  },
  {
    id: 'hs-2',
    nameKr: '종묘 시민공원', nameEn: 'Jongmyo Park',
    nameJa: '宗廟市民公園', nameZh: '宗庙市民公园',
    type: 'historic', typeLabelKr: '사적', typeLabelEn: 'Historic Site',
    lat: 37.5718, lng: 126.9922,
    image: 'https://www.heritage.go.kr/gung/gogung5/images/img_jongmyo_story_bg_00_00.jpg',
    link: '/palace/5',
    descKr: '종묘 앞 공원', descEn: 'Park in front of Jongmyo',
  },
  {
    id: 'hs-3',
    nameKr: '북촌한옥마을', nameEn: 'Bukchon Hanok Village',
    nameJa: '北村韓屋村', nameZh: '北村韩屋村',
    type: 'scenic', typeLabelKr: '명소', typeLabelEn: 'Scenic',
    lat: 37.5826, lng: 126.9857,
    image: '',
    link: '#',
    descKr: '전통 한옥이 밀집한 마을', descEn: 'Traditional Korean village with hanok houses',
  },
  {
    id: 'hs-4',
    nameKr: '원각사지 십층석탑', nameEn: 'Wongaksa 10-story Pagoda',
    nameJa: '円覚寺址十層石塔', nameZh: '圆觉寺址十层石塔',
    type: 'treasure', typeLabelKr: '국보', typeLabelEn: 'National Treasure',
    lat: 37.5710, lng: 126.9882,
    image: '',
    link: '#',
    descKr: '탑골공원 내 국보 제2호', descEn: 'National Treasure No. 2 in Tapgol Park',
  },
  {
    id: 'hs-5',
    nameKr: '광화문광장', nameEn: 'Gwanghwamun Square',
    nameJa: '光化門広場', nameZh: '光化门广场',
    type: 'scenic', typeLabelKr: '명소', typeLabelEn: 'Scenic',
    lat: 37.5724, lng: 126.9769,
    image: '',
    link: '#',
    descKr: '세종대왕·이순신 동상', descEn: 'Statues of King Sejong & Admiral Yi Sun-sin',
  },
  {
    id: 'hs-6',
    nameKr: '사직단', nameEn: 'Sajikdan Altar',
    nameJa: '社稷壇', nameZh: '社稷坛',
    type: 'historic', typeLabelKr: '사적', typeLabelEn: 'Historic Site',
    lat: 37.5755, lng: 126.9688,
    image: '',
    link: '#',
    descKr: '토지신과 곡식신에게 제사 지내던 곳', descEn: 'Altar for gods of earth and grain',
  },
  {
    id: 'hs-7',
    nameKr: '동관왕묘', nameEn: 'Dongmyo Shrine',
    nameJa: '東関王廟', nameZh: '东关王庙',
    type: 'treasure', typeLabelKr: '보물', typeLabelEn: 'Treasure',
    lat: 37.5702, lng: 127.0141,
    image: '',
    link: '#',
    descKr: '관우를 모신 사당', descEn: 'Shrine dedicated to Guan Yu',
  },
  {
    id: 'hs-8',
    nameKr: '서울 한양도성 낙산구간', nameEn: 'Naksan Section of Seoul City Wall',
    nameJa: '漢陽都城 駱山区間', nameZh: '汉阳都城 骆山区间',
    type: 'historic', typeLabelKr: '사적', typeLabelEn: 'Historic Site',
    lat: 37.5800, lng: 127.0070,
    image: '',
    link: '#',
    descKr: '성곽길 산책로', descEn: 'Walkable fortress wall trail',
  },
];

/* ── Distance calculation (Haversine) ── */
export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearbyLandmarks(lat: number, lng: number, radiusKm: number = 3): (Landmark & { distance: number })[] {
  return LANDMARKS
    .map((lm) => ({ ...lm, distance: getDistance(lat, lng, lm.lat, lm.lng) }))
    .filter((lm) => lm.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}
