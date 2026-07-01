import type { Lang } from '../lib/api';

/* ── KPop Demon Hunters Scene Interface ── */

export interface KDHScene {
  id: string;
  order: number;
  sceneTitle: Record<Lang, string>;
  sceneDescription: Record<Lang, string>;
  filmContext: Record<Lang, string>;
  imageId: string;
  palaceLink: string | null;
  guideLink: string;
  markerCoords: [number, number];
}

/* ── 6 KDH Scenes ── */

export const KDH_SCENES: KDHScene[] = [
  {
    id: 'gyeongbokgung',
    order: 1,
    sceneTitle: {
      kr: '경복궁 — 최후의 결전',
      en: 'Gyeongbokgung — The Final Confrontation',
      ja: '景福宮 — 最後の対決',
      zh: '景福宫 — 最终对决',
    },
    sceneDescription: {
      kr: '달빛이 근정전 마당을 비추는 가운데, 단청 기둥 사이로 주인공과 적이 마주 선다. 푸른 네온 빛이 기와지붕을 스치며 궁궐 전체가 전장으로 변한다.',
      en: 'Under the full moon illuminating Geunjeongjeon courtyard, the protagonist faces the antagonist between dancheong pillars. Blue neon light sweeps across the tiled roof as the entire palace transforms into a battlefield.',
      ja: '満月が勤政殿の中庭を照らす中、丹青の柱の間で主人公と敵が対峙する。青いネオン光が瓦屋根を走り、宮殿全体が戦場と化す。',
      zh: '月光照亮勤政殿庭院，主角与对手在丹青柱子间对峙。蓝色霓虹光掠过瓦片屋顶，整座宫殿化为战场。',
    },
    filmContext: {
      kr: '영화의 클라이맥스 장면으로, 모든 이야기가 이곳에서 마무리된다. 경복궁의 웅장한 건축물이 극적인 대결의 배경이 되어 한국 전통 공간의 현대적 재해석을 보여준다.',
      en: 'The climactic finale where every story thread converges at Gyeongbokgung. The palace\'s majestic architecture serves as the backdrop for the dramatic showdown, reimagining traditional Korean space in a contemporary context.',
      ja: '映画のクライマックスシーンで、全ての物語がここで完結する。景福宮の壮大な建築が劇的な対決の背景となり、韓国伝統空間の現代的再解釈を示している。',
      zh: '电影的高潮场面，所有故事线索在此交汇。景福宫的雄伟建筑成为戏剧性对决的背景，展现了韩国传统空间的现代重构。',
    },
    imageId: 'kdh-gyeongbokgung',
    palaceLink: '/palace/1',
    guideLink: '/guide/gyeongbokgung',
    markerCoords: [37.5796, 126.9770],
  },
  {
    id: 'bukchon',
    order: 2,
    sceneTitle: {
      kr: '북촌 — 한옥 골목 추격전',
      en: 'Bukchon — Alley Chase',
      ja: '北村 — 韓屋路地の追跡',
      zh: '北村 — 韩屋小巷追逐',
    },
    sceneDescription: {
      kr: '좁은 한옥 골목을 질주하는 추격전. 기와지붕 위를 뛰어넘고, 전통 가옥의 창문 사이로 펼쳐지는 아크로바틱한 액션 시퀀스가 펼쳐진다.',
      en: 'A breathless chase through narrow hanok alleyways. The action leaps across traditional tiled rooftops and weaves through wooden window frames in one of the film\'s most acrobatic sequences.',
      ja: '狭い韓屋路地を駆け抜ける息詰まる追逐戦。瓦屋根を飛び越え、伝統家屋の窓枠を縫うアクロバティックなアクションシークエンスが展開する。',
      zh: '在狭窄的韩屋小巷中展开令人窒息的追逐。跃过传统瓦片屋顶，穿梭于木窗之间，呈现电影中最具杂技感的动作场面。',
    },
    filmContext: {
      kr: '2막 전반부의 액션 하이라이트. 주인공이 적을 피해 북촌의 복잡한 골목길을 활용하는 장면으로, 전통 한옥 마을의 지형이 추격전의 긴장감을 극대화한다.',
      en: 'The action highlight of Act 2. The protagonist uses Bukchon\'s labyrinthine alleyways to evade pursuers, with the traditional hanok village terrain amplifying the tension of the chase.',
      ja: '第2幕前半のアクションハイライト。主人公が敵を避けるために北村の迷路のような路地を活用するシーンで、伝統韓屋村の地形が追逐の緊張感を最大化する。',
      zh: '第二幕前半的动作高潮。主角利用北村迷宫般的小巷躲避追捕，传统韩屋村庄的地形将追逐的紧张感最大化。',
    },
    imageId: 'kdh-bukchon',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters#scene-bukchon',
    markerCoords: [37.5826, 126.9857],
  },
  {
    id: 'naksan',
    order: 3,
    sceneTitle: {
      kr: '낙산공원 — 성곽 위 추격',
      en: 'Naksan Park — Rooftop Chase',
      ja: '駱山公園 — 城壁の追跡',
      zh: '骆山公园 — 城墙追逐',
    },
    sceneDescription: {
      kr: '한양도성 성곽 위를 질주하는 추격전. 서울의 스카이라인을 배경으로 고대 성벽과 현대 도시가 하나의 액션 무대로 합쳐진다.',
      en: 'A rooftop chase along the ancient Seoul City Wall. The historic fortress ridge becomes a high-octane action runway, with the modern Seoul skyline glittering in the background as tradition and present collide.',
      ja: '漢陽都城の城壁の上を駆ける追逐戦。ソウルのスカイラインを背景に、古代の城壁と現代都市が一つのアクション舞台となる。',
      zh: '沿着汉阳都城城墙展开的屋顶追逐。以首尔天际线为背景，古城墙与现代都市融为一体，成为高强度的动作舞台。',
    },
    filmContext: {
      kr: '추격전의 종착점으로, 주인공이 낙산의 성곽길로 유인되어 위기에 빠지는 장면이다. 서울의 파노라마 뷰가 극적인 반전을 더한다.',
      en: 'The chase sequence finale where the protagonist is lured to Naksan\'s fortress trail and trapped against the city wall. Seoul\'s panoramic night view amplifies the dramatic reversal.',
      ja: '追逐戦の終着点で、主人公が駱山の城壁道に誘い込まれ危機に陥るシーン。ソウルのパノラマビューが劇的な逆転を盛り上げる。',
      zh: '追逐戏的终点，主角被引诱至骆山城郭路陷入危机。首尔的全景夜色为戏剧性反转增添了张力。',
    },
    imageId: 'kdh-naksan',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters#scene-naksan',
    markerCoords: [37.5800, 127.0070],
  },
  {
    id: 'nseoul-tower',
    order: 4,
    sceneTitle: {
      kr: 'N서울타워 — 클라이맥스',
      en: 'N Seoul Tower — Climax',
      ja: 'Nソウルタワー — クライマックス',
      zh: 'N首尔塔 — 高潮',
    },
    sceneDescription: {
      kr: 'N서울타워 전망대에서 펼쳐지는 최후의 대결. 서울의 화려한 야경이 펼쳐지는 가운데, 핑크와 블루 네온 빛이 하늘을 가르며 극적인 결말을 장식한다.',
      en: 'The final showdown on the N Seoul Tower observation deck. Seoul\'s glittering nightscape spreads below as pink and blue neon beams slice through the night sky, framing the film\'s dramatic conclusion.',
      ja: 'Nソウルタワー展望台で繰り広げられる最後の対決。ソウルの華やかな夜景が広がる中、ピンクとブルーのネオンの光が空を切り裂き、劇的な結末を飾る。',
      zh: '在N首尔塔观景台上演的最终对决。首尔璀璨的夜景在脚下铺展，粉色和蓝色霓虹光束划破夜空，映衬着电影的戏剧性结局。',
    },
    filmContext: {
      kr: '영화의 피날레 장면. 모든 갈등이 이곳에서 해소되며, 주인공과 적의 운명이 결정된다. N서울타워는 영화에서 희망과 마무리의 상징으로 사용된다.',
      en: 'The finale of the film where all conflicts resolve and the fates of protagonist and antagonist are decided. N Seoul Tower serves as a symbol of hope and closure throughout the narrative.',
      ja: '映画のフィナーレシーン。全ての葛藤がここで解消され、主人公と敵の運命が決定される。Nソウルタワーは希望と決着の象徴として使用される。',
      zh: '电影的终场画面。所有冲突在此化解，主角与对手的命运尘埃落定。N首尔塔在叙事中作为希望与终结的象征。',
    },
    imageId: 'kdh-nseoul-tower',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters#scene-nseoul-tower',
    markerCoords: [37.5512, 126.9882],
  },
  {
    id: 'gwanghwamun',
    order: 5,
    sceneTitle: {
      kr: '광화문광장 — 오프닝 추격',
      en: 'Gwanghwamun Square — Opening Chase',
      ja: '光化門広場 — オープニング',
      zh: '光化门广场 — 开场追逐',
    },
    sceneDescription: {
      kr: '빗길에 반사된 도시 불빛 속, 세종대왕 동상을 지나며 펼쳐지는 오프닝 추격전. 광화문광장이 통제되지 않은 액션의 광장으로 변한다.',
      en: 'An electrifying opening chase across rain-slicked Gwanghwamun Square, past the statue of King Sejong. The historic civic plaza transforms into an uncontrolled action arena with traffic light trails streaking through the frame.',
      ja: '雨に濡れた光化門広場を駆け抜ける衝撃のオープニング追逐。世宗大王像を横切る中、歴史的な市民広場が制御不能なアクションの舞台となる。',
      zh: '一场震撼的开场追逐在雨后湿滑的光化门广场展开，经过世宗大王铜像。这座历史性的市民广场沦为失控的动作舞台。',
    },
    filmContext: {
      kr: '영화의 오프닝 시퀀스로, 관객을 단숨에 이야기 속으로 빨아들이는 도입부다. 광화문광장의 상징성이 영화의 스케일을 암시한다.',
      en: 'The opening sequence that plunges audiences into the story from the first frame. Gwanghwamun Square\'s symbolic significance as Korea\'s historic heart immediately establishes the film\'s epic scale.',
      ja: '映画のオープニングシークエンスで、観客を一気に物語の中に引き込む導入部。光化門広場の象徴性が映画のスケールを示唆する。',
      zh: '电影的开场段落，将观众瞬间拉入故事。光化门广场作为韩国历史中心的象征意义，暗示了电影的宏大格局。',
    },
    imageId: 'kdh-gwanghwamun',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters#scene-gwanghwamun',
    markerCoords: [37.5724, 126.9769],
  },
  {
    id: 'insadong',
    order: 6,
    sceneTitle: {
      kr: '인사동 — 전통시장 장면',
      en: 'Insadong — Market Scene',
      ja: '仁寺洞 — 伝統市場',
      zh: '仁寺洞 — 传统市场',
    },
    sceneDescription: {
      kr: '인사동 좁은 거리에서 펼쳐지는 전통 시장 액션. 천장에 매달린 색색의 등불 아래, 골동품과 전통 찻집 사이로 추격전이 벌어진다.',
      en: 'A dynamic market scene set in Insadong\'s narrow streets. Under a canopy of colorful paper lanterns, the chase weaves through antique shops and traditional tea houses, turning everyday objects into improvised weapons.',
      ja: '仁寺洞の狭い通りで展開される伝統市場のアクション。色とりどりの提灯の下、骨董品店と伝統茶屋の間を追逐戦が繰り広げられる。',
      zh: '在仁寺洞狭窄街道上展开的传统市场动作场面。五彩纸灯笼下，追逐戏穿梭于古董店和传统茶馆之间，日常物品化为即兴武器。',
    },
    filmContext: {
      kr: '영화의 중반부 코믹 릴리프이자 액션 장면. 전통 시장의 혼란스러운 환경이 독특한 액션 연출을 가능하게 하며, 캐릭터 간 유대를 강화하는 역할을 한다.',
      en: 'A mid-film sequence blending comic relief with action. The chaotic traditional market environment enables creative fight choreography while strengthening the bond between characters.',
      ja: '映画中盤のコミックリリーフでありアクションシーン。伝統市場の混沌とした環境がユニークなアクション演出を可能にし、キャラクター間の絆を強める役割を果たす。',
      zh: '电影中段融合喜剧调剂与动作的段落。传统市场的混乱环境催生了独特的动作编排，同时加深了角色之间的羁绊。',
    },
    imageId: 'kdh-insadong',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters#scene-insadong',
    markerCoords: [37.5710, 126.9882],
  },
];

/* ── Helper Functions ── */

export function getSceneByLocation(locId: string): KDHScene | undefined {
  return KDH_SCENES.find(scene => scene.id === locId);
}
