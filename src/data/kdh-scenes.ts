import type { Lang } from '../lib/api';

/* ── KPop Demon Hunters Scene Interface ── */

export interface KDHScene {
  id: string;
  order: number;
  sceneTitle: Record<Lang, string>;
  sceneDescription: Record<Lang, string>;  // 영화 장면 설명 (넷플릭스 Tudum 기준)
  filmContext: Record<Lang, string>;       // 영화 속 의미
  imageId: string;
  palaceLink: string | null;
  guideLink: string;
  markerCoords: [number, number];
  // QuickAnswerBox용
  address: Record<Lang, string>;
  directions: Record<Lang, string>;
  hours: Record<Lang, string>;
  duration: Record<Lang, string>;
  mapLinks: {
    naver?: string;
    kakao?: string;
    google?: string;
  };
}

/* ── Map link helper ── */

function makeMapLinks(address: string): { naver: string; kakao: string; google: string } {
  return {
    naver: `https://map.naver.com/v5/search/${encodeURIComponent(address)}`,
    kakao: `https://map.kakao.com/?q=${encodeURIComponent(address)}`,
    google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ' 서울')}`,
  };
}

/* ── 9 KDH Scenes (Netflix Tudum-accurate) ── */

export const KDH_SCENES: KDHScene[] = [
  // 1. jamsil (order 1 — 오프닝)
  {
    id: 'jamsil',
    order: 1,
    sceneTitle: {
      kr: '서울종합운동장 — 오프닝 낙하산 강하',
      en: 'Jamsil Sports Complex — Opening Parachute Drop',
      ja: 'ジャムシルスポーツコンプレックス — オープニングのパラシュート降下',
      zh: '福土乐体育综合体 — 开场降落伞跳',
    },
    sceneDescription: {
      kr: "영화의 오프닝 시퀀스. 주인공들이 낙하산을 타고 서울종합운동장 상공에서 강하한다. 올림픽 주경기장·보조경기장 일대의 넓은 공간이 액션의 무대로 펼쳐진다. 곧이어 'How It's Done' 데뷔 무대가 이 일대에서 펼쳐진다.",
      en: "In the film's opening sequence, the protagonists descend by parachute over the Seoul Sports Complex. The vast space of the Olympic Stadium and auxiliary stadium unfolds as a stage for action. Immediately after, their debut performance 'How It's Done' takes place in this very district.",
      ja: "映画のオープニングシークエンス。主人公たちはパラシュートでソウル総合運動競技場上空から降下する。オリンピックメインスタジアムとサブスタジアム周辺の広い空間がアクションの舞台として繰り広げられる。その後すぐに、「How It's Done」デビューステージがこの一帯で行われる。",
      zh: "电影的开场段落。主人公们从首尔体育综合体上空跳伞降落。奥林匹克主体育场及辅助体育场周边的广阔空间成为动作场面的舞台。紧接着，“How It's Done”的出道舞台就在这一带展开。",
    },
    filmContext: {
      kr: '관객에게 영화의 스케일과 서울이라는 공간의 넓이를 단번에 각인시키는 오프닝. 실제 경기장 구조가 애니메이션 액션 연출의 기반이 된다.',
      en: "An opening that immediately impresses the audience with the film's scale and the breadth of Seoul's space. The actual stadium architecture serves as the foundation for the animated action choreography.",
      ja: "観客に映画のスケールとソウルという空間の広さを一気に刻み込むオープニング。実在の競技場構造がアニメーションアクション演出の基盤となっている。",
      zh: "向观众瞬间展示电影的规模和首尔这座城市的空间宽度的开场。真实的体育场结构成为动画动作设计的基础。",
    },
    imageId: 'kdh-jamsil',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters/jamsil',
    markerCoords: [37.5196, 127.0780],
    address: {
      kr: '서울 송파구 올림픽로 25 서울종합운동장',
      en: 'Seoul Sports Complex 25 Olympic-ro, Songpa-gu, Seoul',
      ja: 'ソウル特別市松坡区オリンピックロ25 ソウル総合運動競技場',
      zh: '首尔市松坡区奥林匹克路25号首尔体育综合体',
    },
    directions: {
      kr: '지하철 2·9호선 종합운동장역 6·7번 출구, 도보 3분',
      en: 'Subway Line 2/9, Sports Complex Station, Exit 6/7 — 3 min walk',
      ja: '地下鉄2号線・9号線総合運動場駅6・7番出口から徒歩3分',
      zh: '地铁2号线/9号线综合运动场站6/7号出口，步行3分钟',
    },
    hours: {
      kr: '경기장 외관은 24시간 개방 / 내부 시설은 경기 일정 따라 변동',
      en: 'Stadium exterior open 24 hours / Interior facilities vary by event schedule',
      ja: '競技場外観は24時間開放 / 内部施設は試合日程により変動',
      zh: '体育场外观全天开放 / 内部设施根据赛事日程变动',
    },
    duration: {
      kr: '둘러보기 20~30분 (외관 감상 기준)',
      en: '30 min sightseeing (exterior view)',
      ja: '所要時間20〜30分（外観鑑賞ベース）',
      zh: '参观20-30分钟（仅外观观赏）',
    },
    mapLinks: makeMapLinks('서울 송파구 올림픽로 25 서울종합운동장'),
  },

  // 2. cheongdam (order 2)
  {
    id: 'cheongdam',
    order: 2,
    sceneTitle: {
      kr: '청담대교 — 지하철 옥상 전투',
      en: 'Cheongdam Bridge — Rooftop Subway Battle',
      ja: 'チョンダム橋 — 地下鉄屋上バトル',
      zh: '清潭大桥 — 地铁车顶大战',
    },
    sceneDescription: {
      kr: 'OST "Takedown"이 흐르는 가운데, 지하철 전동차와 도심 옥상 위를 넘나드는 전투 시퀀스. 청담대교·자양역 일대의 한강변 고가도로와 지하철 노선이 액션의 뼈대를 구성한다.',
      en: "Powered by the soundtrack 'Takedown,' a battle sequence soars between subway trains and downtown rooftops. The elevated roads and subway lines along the Han River near Cheongdam Bridge and Jayang Station form the skeleton of the action.",
      ja: "主題歌「Takedown」が流れる中、地下鉄電車と都心の屋上間を縦横無尽に飛び交う戦闘シークエンス。チョンダム橋・紫陽駅周辺の漢江沿い高架道路と地下鉄路線がアクションの骨格を成している。",
      zh: "在《Takedown》的配乐中，展开一场乘客车厢与城市屋顶之间飞越的战斗序列。清潭大桥·紫阳站一代的汉江边高架道路和地铁路线构成了动作的骨架。",
    },
    filmContext: {
      kr: '영화 액션의 정점 중 하나. 서울 도심의 수직적 공간 구조(고층 빌딩·옥상·지하철)가 애니메이션 액션 연출과 결합된 대표적 장면.',
      en: "One of the film's action peaks. The vertical spatial structure of downtown Seoul (skyscrapers, rooftops, subway) merges with animated action choreography in this signature scene.",
      ja: "映画アクションのクライマックスの一つ。ソウル都心の垂直的な空間構造（高層ビル・屋上・地下鉄）がアニメーションアクション演出と融合した代表的なシーン。",
      zh: "电影动作场面的高峰之一。首尔市区的垂直空间结构（高层建筑、屋顶、地铁）与动画动作设计相结合的代表性场景。",
    },
    imageId: 'kdh-cheongdam',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters/cheongdam',
    markerCoords: [37.5400, 127.0490],
    address: {
      kr: '서울 광진구 자양동 청담대교 일대',
      en: 'Cheongdam Bridge area, Jayang-dong, Gwangjin-gu, Seoul',
      ja: 'ソウル特別市光津区紫陽洞 チョンダム橋周辺',
      zh: '首尔市光津区紫阳洞 清潭大桥周边',
    },
    directions: {
      kr: '지하철 7호선 뚝섬유원지역 2번 출구, 도보 10분 (청담대교 북단 접근)',
      en: 'Subway Line 7, Ttukseom Resort Station, Exit 2 — 10 min walk (Cheongdam Bridge north end)',
      ja: '地下鉄7号線 뚝섬유원지역駅2番出口から徒歩10分（チョンダム橋北端アクセス）',
      zh: '地铁7号线 뚝섬유원지역站2号出口，步行10分钟（清潭大桥北端）',
    },
    hours: {
      kr: '야외 공간으로 24시간 접근 가능',
      en: 'Outdoor area — accessible 24 hours',
      ja: '屋外空間として24時間アクセス可能',
      zh: '户外空间，全天可访问',
    },
    duration: {
      kr: '둘러보기 15~20분',
      en: '15~20 min sightseeing',
      ja: '所要時間15〜20分',
      zh: '参观15-20分钟',
    },
    mapLinks: makeMapLinks('서울 광진구 자양동 청담대교'),
  },

  // 3. coex (order 3)
  {
    id: 'coex',
    order: 3,
    sceneTitle: {
      kr: 'COEX K-POP 스퀘어 — 골든 티저 공개',
      en: 'COEX K-POP Square — Golden Teaser Reveal',
      ja: 'COEX K-POPスクエア — 「Golden」ティザー公開',
      zh: 'COEX K-POP广场 — 「Golden」预告片公开',
    },
    sceneDescription: {
      kr: "COEX K-POP 스퀘어(서울 삼성동)의 대형 옥외 스크린에 'Golden' 뮤직비디오 티저가 공개되는 장면. 스타필드 코엑스몰 입구의 미디어 파사드가 영화 속 미디어 이벤트의 배경이 된다.",
      en: "The scene where the 'Golden' music video teaser is unveiled on the large outdoor screen at COEX K-POP Square (Samseong-dong, Seoul). The media facade at the entrance of Starfield COEX Mall serves as the backdrop for the movie's media event.",
      ja: "COEX K-POPスクエア（ソウル・三成洞）の大型野外スクリーンに「Golden」ミュージックビデオティザーが公開されるシーン。スターフィールドCOEXモールの入り口のメディアファサードが映画のメディアイベントの舞台となる。",
      zh: "在COEX K-POP广场（首尔三成洞）的大型户外屏幕上公开《Golden》音乐录像带预告片的场景。星际场COEX购物中心入口的媒体立面成为电影中媒体活动的背景。",
    },
    filmContext: {
      kr: "케이팝 Demon Hunters 세계관에서 음악과 미디어가 중요한 축이라는 점을 보여주는 장면. 실제 COEX의 미디어 파사드 설비가 영화 렌더링의 현실적 참조점이 된다.",
      en: "A scene demonstrating that music and media are critical pillars in the K-Pop Demon Hunters universe. The actual COEX media facade equipment serves as the practical reference for the film's rendering.",
      ja: "K-POPデ몬・ハンターズの世界観において、音楽とメディアが重要な軸であることを示すシーン。実際のCOEXのメディアファサード設備が映画のレンダリングにおける現実的な参照点となっている。",
      zh: "该场景展示了音乐与媒体在《K-POP魔神猎手》宇宙中作为重要支柱的地位。实际COEX的媒体立面设施成为影片渲染的现实参照。",
    },
    imageId: 'kdh-coex',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters/coex',
    markerCoords: [37.5120, 127.0586],
    address: {
      kr: '서울 강남구 영동대로 513 COEX 스타필드',
      en: '13 Yeongdong-daero, Gangnam-gu, Seoul — COEX Starfield',
      ja: 'ソウル特別市江南区 ヨンドンデロ513番地 COEX スターフィールド',
      zh: '首尔市江南区岭东大路13号513 COEX星际场',
    },
    directions: {
      kr: '지하철 2호선 삼성역 5·6번 출구 직결 (스타필드 코엑스몰)',
      en: 'Subway Line 2, Samseong Station, Exit 5/6 — directly connected (Starfield COEX Mall)',
      ja: '地下鉄2号線三成駅5・6番出口から直結（スターフィールドCOEXモール）',
      zh: '地铁2号线三成站5/6号出口直达（星际场COEX购物中心）',
    },
    hours: {
      kr: '스타필드 코엑스몰: 10:30~22:00 (매장별 상이) / K-POP 스퀘어 스크린: 일몰 후~24:00 미디어 파사드',
      en: 'Starfield COEX Mall: 10:30–22:00 (varies by store) / K-POP Square screen: sunset–24:00 media facade',
      ja: 'スターフィールドCOEXモール: 10:30~22:00（店舗により異なる） / K-POPスクエアスクリーン: 日没後~24:00 メディアファサード',
      zh: '星际场COEX购物中心: 10:30-22:00（各店有异） / K-POP广场屏幕: 日落后至24:00媒体立面',
    },
    duration: {
      kr: '둘러보기 30분~1시간',
      en: '30 min~1 hour',
      ja: '所要時間30分〜1時間',
      zh: '参观30分钟至1小时',
    },
    mapLinks: makeMapLinks('서울 강남구 영동대로 513 COEX 스타필드'),
  },

  // 4. naksan (order 4)
  {
    id: 'naksan',
    order: 4,
    sceneTitle: {
      kr: '낙산공원 — 진우·루미 밀회',
      en: 'Naksan Park — Jinwoo & Rumi\'s Secret Meeting',
      ja: '駱山公園 — ジヌとルミの密会',
      zh: '乐山公园 — 珍宇与露米的秘密约会',
    },
    sceneDescription: {
      kr: '낙산공원의 한양도성 성곽길을 배경으로 진우와 루미가 서로의 마음을 확인하는 장면. 도성 성곽의 곡선, 서울 도심의 파노라마 뷰, 해질녘 빛이 감정적 클라이맥스를 조성한다.',
      en: "Set against the backdrop of the Seoul City Wall trail at Naksan Park, Jinwoo and Rumi confirm their feelings for each other. The curve of the fortress wall, the panoramic view of downtown Seoul, and the golden hour light create the emotional climax.",
      ja: "駱山公園の漢陽都城の城壁道を背景に、ジヌとルミがお互いの思いを確認し合うシーン。都城の城壁の曲線、ソウル都心のパノラマビュー、夕暮れの光が感情的なクライマックスを演出する。",
      zh: "以乐山公园的汉阳都城城墙路为背景，珍宇和露米确认彼此感情的场景。城墙的曲线、首尔市区的全景视图以及黄昏的光线营造了情感高潮。",
    },
    filmContext: {
      kr: "액션 일색의 영화에서 드문 로맨틱 시네마틱 순간. 낙산공원의 성곽길은 서울 한복판의 고요한 사적 공간으로, 두 캐릭터의 관계 변화를 공간적으로 표현한다.",
      en: "A rare romantic cinematic moment in an action-heavy film. Naksan Park's fortress trail is the serene historic space at the heart of Seoul, spatially expressing the two characters' relationship change.",
      ja: "アクション連続の映画では珍しいロマンチックなシネマティックモーメント。駱山公園の城壁道はソウルの中心にある静かな歴史的空間で、二人のキャラクターの関係変化を空間的に表現している。",
      zh: "在一心动作片中难得的浪漫电影时刻。乐山公园的城墙路是首尔中心的一片静谧历史空间，以空间方式表达了两个角色的关系变化。",
    },
    imageId: 'kdh-naksan',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters/naksan',
    markerCoords: [37.5800, 127.0070],
    address: {
      kr: '서울 성북구 낙산공원로 102 낙산공원',
      en: '102 Naksan Park-ro, Seongbuk-gu, Seoul — Naksan Park',
      ja: 'ソウル特別市城北区駱山公園路102番地 駱山公園',
      zh: '首尔市城北区乐山公园路102号乐山公园',
    },
    directions: {
      kr: '지하철 4호선 혜화역 1번 출구, 도보 15분 / 또는 2호선 을지로4가역에서 마을버스',
      en: 'Subway Line 4, Hyehwa Station, Exit 1 — 15 min walk / or village bus from Euljiro 4-ga Station (Line 2)',
      ja: '地下鉄4号線恵化駅1番出口から徒歩15分 / または2号線乙支路4街駅からコミバス',
      zh: '地铁4号线惠化站1号出口，步行15分钟 / 或从2号线乙支路4街站乘坐社区巴士',
    },
    hours: {
      kr: '공원: 24시간 개방 / 전시·편의시설은 10:00~18:00',
      en: 'Park: 24 hours open / Exhibitions & amenities: 10:00~18:00',
      ja: '公園: 24時間開放 / 展示・施設は10:00~18:00',
      zh: '公园: 24小时开放 / 展览及设施: 10:00-18:00',
    },
    duration: {
      kr: '둘러보기 30~40분 (성곽길 산책 포함 시 1시간~)',
      en: '30~40 min sightseeing (up to 1 hour with fortress wall walk)',
      ja: '所要時間30〜40分（城壁道散策込みで1時間〜）',
      zh: '参观30-40分钟（包含城墙散步约1小时）',
    },
    mapLinks: makeMapLinks('서울 성북구 낙산공원로 102 낙산공원'),
  },

  // 5. bukchon (order 5)
  {
    id: 'bukchon',
    order: 5,
    sceneTitle: {
      kr: '북촌 — 진우·루미, \'Free\'를 부르다',
      en: 'Bukchon — Jinwoo & Rumi Sing \'Free\'',
      ja: '北村 — ジヌとルミ、「Free」を歌う',
      zh: '北村 — 珍宇和露米演唱《Free》',
    },
    sceneDescription: {
      kr: "북촌 한옥마을의 좁은 골목과 기와지붕이 이어지는 풍경이 진우와 루미가 함께 'Free'를 부르며 걷는 장면의 배경. 캐릭터의 감정 변화와 한옥 골목의 정적인 공간이 대조를 이룬다.",
      en: "The narrow alleys and tiled roofs of Bukchon Hanok Village provide the backdrop as Jinwoo and Rumi walk while singing 'Free' together. The characters' emotional shift contrasts with the tranquil stillness of the hanok alleys.",
      ja: "北村韓屋村の狭い路地と瓦屋根が続く風景が、ジヌとルミが一緒に「Free」を歌いながら歩くシーンの背景。キャラクターたちの感情の変化と韓屋の路地の静けさが対比をなしている。",
      zh: "北村韩屋村的狭窄小巷和连续不断的瓦片屋顶 풍경，作为珍宇和露米一起演唱《Free》漫步的背景。角色们的情感变化与韩屋小巷的宁静形成了鲜明对比。",
    },
    filmContext: {
      kr: "북촌은 영화 전체에서 '일상과 비일상이 맞닿는 공간'으로 반복 등장한다. 한옥의 낮은 지붕선, 좁은 골목, 담장 너머 서울시내 뷰가 애니메이션 배경 아트에 영감을 준다.",
      en: "Bukchon repeatedly appears throughout the film as 'the space where daily life and the extraordinary meet.' The low rooflines of hanok, narrow alleys, and views of downtown Seoul beyond the walls inspire the animated background art.",
      ja: "北村は映画全体を通じて「日常と非日常が接する空間」として繰り返し登場する。韓屋の低い屋根線、狭い路地、塀の向こうのソウル市街の眺めがアニメーション背景アートにインスピレーションを与えている。",
      zh: "北村在电影中反复作为“日常与非日常交汇的空间”出现。韩屋低矮的屋顶线条、狭窄的小巷、围墙外的首尔市区景色都给动画背景美术提供了灵感。",
    },
    imageId: 'kdh-bukchon',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters/bukchon',
    markerCoords: [37.5826, 126.9857],
    address: {
      kr: '서울 종로구 계동길 북촌한옥마을',
      en: 'Gye-dong-gil, Jongno-gu, Seoul — Bukchon Hanok Village',
      ja: 'ソウル特別市鍾路区渓洞길 北村韓屋村',
      zh: '首尔市钟路区溪洞길 北村韩屋村',
    },
    directions: {
      kr: '지하철 3호선 안국역 3번 출구, 도보 10분 / 또는 3호선 경복궁역 4번 출구에서 도보 15분',
      en: 'Subway Line 3, Anguk Station, Exit 3 — 10 min walk / or Gyeongbokgung Station Exit 4 — 15 min walk',
      ja: '地下鉄3号線安国駅3番出口から徒歩10分 / または3号線景福宮駅4番出口から徒歩15分',
      zh: '地铁3号线安国站3号出口，步行10分钟 / 或3号线景福宫站4号出口，步行15分钟',
    },
    hours: {
      kr: '주거 지역이므로 조용히 방문 / 평일 09:00~18:00 추천 (주말 혼잡)',
      en: 'Residential area — visit quietly / Recommended weekdays 09:00~18:00 (weekends crowded)',
      ja: '住宅地域なので静かに訪問 / 平日09:00~18:00推奨（週末は混雑）',
      zh: '住宅区，务必安静参观 / 建议工作日09:00-18:00（周末拥挤）',
    },
    duration: {
      kr: '골목 산책 30분~1시간',
      en: 'Alley walk 30 min~1 hour',
      ja: '路地散策30分〜1時間',
      zh: '小巷散步30分钟至1小时',
    },
    mapLinks: makeMapLinks('서울 종로구 계동길 북촌한옥마을'),
  },

  // 6. nseoul-tower (order 6)
  {
    id: 'nseoul-tower',
    order: 6,
    sceneTitle: {
      kr: 'N서울타워 — 사자보이즈의 최후 공연',
      en: 'N Seoul Tower — Saja Boyz\'s Final Performance',
      ja: 'Nソウルタワー — サイジャボーイズのラストパフォーマンス',
      zh: 'N首尔塔 — 撒加男孩乐队的最后表演',
    },
    sceneDescription: {
      kr: "N서울타워가 영화 전반에 걸쳐 반복 등장하는 배경이자, 사자보이즈(Saja Boyz)의 마지막 공연이 펼쳐지는 공간적 클라이맥스. 전망대에서 내려다보는 서울 야경이 영화 마지막 감정의 정점을 구성한다.",
      en: "N Seoul Tower is both the recurring background throughout the film and the spatial climax where Saja Boyz's final performance unfolds. The night view of Seoul from the observation deck forms the emotional peak of the film's finale.",
      ja: "Nソウルタワーは映画全体を通じて繰り返し登場する背景であるとともに、サイジャボーイズのラストパフォーマンスが繰り広げられる空間的クライマックス。展望台から見下ろすソウルの夜景が映画最終盤の感情の頂点を構成する。",
      zh: "N首尔塔既是贯穿全片反复出现的背景，也是撒加男孩乐队最后表演展开的空间高潮。从观景台俯瞰首尔夜景构成了电影结尾情感的顶峰。",
    },
    filmContext: {
      kr: "N서울타워는 영화 내내 등장하며 '서울 전체를 조망하는 시점'을 상징한다. 특히 마지막 공연 장면에서는 건물 자체가 공연 무대의 일부로 기능한다.",
      en: "N Seoul Tower appears throughout the film, symbolizing 'the vantage point overlooking all of Seoul.' Especially in the final performance scene, the tower building itself functions as part of the stage.",
      ja: "Nソウルタワーは映画の途中で何度も登場し、「ソウル全体を見渡す視点」を象徴する。特にラストパフォーマンスのシーンでは、ビル自体が舞台の一部として機能する。",
      zh: "N首尔塔在电影中反复出现，象征着“俯瞰整个首尔的视角”。尤其是在最后表演场景中，大楼本身作为表演舞台的一部分发挥作用。",
    },
    imageId: 'kdh-nseoul-tower',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters/nseoul-tower',
    markerCoords: [37.5512, 126.9882],
    address: {
      kr: '서울 용산구 남산공원길 105 N서울타워',
      en: '105 Namsan Park-gil, Yongsan-gu, Seoul — N Seoul Tower',
      ja: 'ソウル特別市竜山区南山公園道105番地 Nソウルタワー',
      zh: '首尔市龙山区南山公园道105号 N首尔塔',
    },
    directions: {
      kr: '지하철 4호선 명동역 3번 출구, 남산순환버스 02·03·05번 탑승 → N서울타워 하차 (도보 약 15~20분) 또는 케이블카 이용',
      en: 'Subway Line 4, Myeongdong Station, Exit 3 → Namsan Loop Bus 02/03/05 → N Seoul Tower stop (or 15~20 min walk) or cable car',
      ja: '地下鉄4号線明洞駅3番出口 → ナムサン循環バス02・03・05番 → Nソウルタワー下車（徒歩約15〜20分）またはケーブルカー利用',
      zh: '地铁4号线明洞站3号出口 → 南山循环巴士02/03/05号 → N首尔塔站下车（步行约15-20分钟）或乘坐缆车',
    },
    hours: {
      kr: '전망대: 10:00~23:00 (마지막 입장 22:30) / 야외 전망대: 일몰~24:00',
      en: 'Observation deck: 10:00–23:00 (last entry 22:30) / Outdoor deck: sunset–24:00',
      ja: '展望台: 10:00~23:00（最終入場22:30） / 野外展望台: 日没〜24:00',
      zh: '观景台: 10:00-23:00（最后入场22:30） / 户外观景台: 日落至24:00',
    },
    duration: {
      kr: '둘러보기 1시간~1시간 30분 (전망대 포함)',
      en: '1 hour~1.5 hours (including observation deck)',
      ja: '所要時間1時間〜1時間30分（展望台込み）',
      zh: '参观1小时至1.5小时（含观景台）',
    },
    mapLinks: makeMapLinks('서울 용산구 남산공원길 105 N서울타워'),
  },

  // 7. myeongdong (order 7)
  {
    id: 'myeongdong',
    order: 7,
    sceneTitle: {
      kr: '명동거리 — 사자보이즈 \'Soda Pop\' 거리 공연',
      en: 'Myeongdong Street — Saja Boyz\'s \'Soda Pop\' Street Performance',
      ja: '明洞通り — サイジャボーイズの「Soda Pop」ストリートパフォーマンス',
      zh: '明洞街道 — 撒加男孩乐队《Soda Pop》街头表演',
    },
    sceneDescription: {
      kr: "명동의 번화한 거리를 배경으로 사자보이즈가 'Soda Pop'을 부르며 즉석 거리 공연을 펼치는 장면. 고층 건물과 유동 인구가 많은 상업 거리가 영화 속 에너지 넘치는 퍼포먼스 공간으로 전환된다.",
      en: "Set against the bustling streets of Myeongdong, Saja Boyz perform an impromptu street show singing 'Soda Pop.' The high-rise buildings and crowded commercial district transform into an energetic performance space within the movie.",
      ja: "明洞の賑やかな通りを背景に、サイジャボーイズが「Soda Pop」を歌いながら 즉석ストリートパフォーマンスを繰り広げるシーン。高層ビルと人の流れが多い商業地区が映画内で躍動感あふれるパフォーマンス空間に変貌する。",
      zh: "以明洞繁华的街道为背景，撒加男孩乐队演唱《Soda Pop》即兴街头表演的场景。高层建筑和人流密集的商业街化身为电影中充满活力的表演空间。",
    },
    filmContext: {
      kr: "명동 장면은 영화의 코믹하고 경쾌한 톤을 대표하는 시퀀스. 실제 명동 거리의 상업적 밀도가 애니메이션의 에너지 넘치는 군중 장면 연출의 참조점이 된다.",
      en: "The Myeongdong scene is a signature sequence representing the film's comedic and lighthearted tone. The commercial density of actual Myeongdong streets serves as the reference for the animated crowd scene choreography.",
      ja: "明洞のシーンは映画のコミカルで軽やかなトーンを代表するシークエンス。実際の明洞通りの商業的密度が、アニメーションのエネルギッシュな群衆シーンの演出の参照点となっている。",
      zh: "明洞场景是代表电影喜剧轻快基调的标志性段落。实际明洞街道的商业密度成为动画充满活力的群众场面设计的参照。",
    },
    imageId: 'kdh-myeongdong',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters/myeongdong',
    markerCoords: [37.5636, 126.9820],
    address: {
      kr: '서울 중구 명동2가 명동거리 (명동역~명동교차로 일대)',
      en: 'Myeongdong 2-ga, Jung-gu, Seoul — Myeongdong Street (Myeongdong Station to Myeongdong Intersection)',
      ja: 'ソウル特別市中区明洞2街 明洞通り（明洞駅〜明洞交差点周辺）',
      zh: '首尔市中区明洞2街 明洞街道（明洞站至明洞十字路口周边）',
    },
    directions: {
      kr: '지하철 4호선 명동역 6·7번 출구 / 2호선 을지로입구역 5·6번 출구에서 도보 5분',
      en: 'Subway Line 4, Myeongdong Station, Exit 6/7 / Line 2, Euljiro 1-ga Station, Exit 5/6 — 5 min walk',
      ja: '地下鉄4号線明洞駅6・7番出口 / 2号線乙支路入口駅5・6番出口から徒歩5分',
      zh: '地铁4号线明洞站6/7号出口 / 2号线乙支路入口站5/6号出口步行5分钟',
    },
    hours: {
      kr: '거리는 24시간 개방 / 상점가: 10:00~22:00 (매장별 상이)',
      en: 'Street open 24 hours / Commercial district: 10:00–22:00 (varies by store)',
      ja: '通りは24時間開放 / 商店街: 10:00~22:00（店舗により異なる）',
      zh: '街道全天开放 / 商业街: 10:00-22:00（各店有异）',
    },
    duration: {
      kr: '둘러보기 30분~1시간',
      en: '30 min~1 hour',
      ja: '所要時間30分〜1時間',
      zh: '参观30分钟至1小时',
    },
    mapLinks: makeMapLinks('서울 중구 명동2가 명동거리'),
  },

  // 8. lotte-world-tower (order 8 — 직접 등장 아님)
  {
    id: 'lotte-world-tower',
    order: 8,
    sceneTitle: {
      kr: '롯데월드타워 — 헌트릭스 숙소의 시각적 모티프',
      en: 'Lotte World Tower — Visual Motif for the Huntrix Base',
      ja: 'ロッテワールドタワー — ハントリックス基地のビジュアルモチーフ',
      zh: '乐天世界塔 — 猎魔者基地的视觉母题',
    },
    sceneDescription: {
      kr: "롯데월드타워는 애니메이션에 직접 등장하지 않는다. 다만 헌트릭스(Huntrix) 팀의 숙소 및 아지트 공간에 사용된 유리 큐브·메탈릭 질감·수직적 공간 구성 등 시각 디자인이 롯데월드타워의 아키텍처를 모티프로 삼았다. 즉, '촬영지가 아니라 디자인 레퍼런스'로 언급하는 것이 정확하다.",
      en: "Lotte World Tower does NOT directly appear in the animation. However, the visual design used in the Huntrix team's base and hideout — including the glass cube formations, metallic textures, and vertical spatial composition — took Lotte World Tower's architecture as a visual motif. In other words, it is accurate to describe it as a 'design reference, not a filming location.'",
      ja: "ロッテワールドタワーはアニメーションに直接登場しない。ただしハントリックス（Huntrix）チームの宿舎およびアジト空間に使用された、ガラスキューブ・メタリック質感・垂直的な空間構成などのビジュアルデザインは、ロッテワールドタワーのアーキテクチャをモチーフとしている。つまり、「撮影地ではなくデザインのレファレンス」として言及するのが正確である。",
      zh: "乐天世界塔并未在动画中直接出现。然而，猎魔者（Huntrix）团队的宿舍及据点空间所使用的视觉设计，包括玻璃立方体结构、金属质感和垂直空间构成，都以乐天世界塔的建筑为视觉母题。换句话说，准确的说法是将其称为“设计参考，而非拍摄地”。",
    },
    filmContext: {
      kr: '영화 속 헌트릭스 팀의 공간은 현대 서울의 초고층 건축 언어(유리·금속·수직성)에서 디자인 영감을 얻었다. 롯데월드타워는 그 시각적 레퍼런스 중 하나.',
      en: "The Huntrix team's spaces in the film draw design inspiration from the architectural language of modern Seoul's skyscrapers — glass, metal, verticality. Lotte World Tower is one of those visual references.",
      ja: "映画内のハントリックスチームの空間は、現代ソウルの超高層建築の言語（ガラス・金属・垂直性）からデザインのインスピレーションを得ている。ロッテワールドタワーはそのビジュアルレファレンスの一つである。",
      zh: "电影中猎魔者团队的空间从现代首尔超高层建筑的语言（玻璃、金属、垂直性）汲取设计灵感。乐天世界塔只是众多视觉参考之一。",
    },
    imageId: 'kdh-lotte',
    palaceLink: null,
    guideLink: '/kpop-demon-hunters/lotte-world-tower',
    markerCoords: [37.5128, 127.0788],
    address: {
      kr: '서울 송파구 올림픽로 300 롯데월드타워',
      en: '300 Olympic-ro, Songpa-gu, Seoul — Lotte World Tower',
      ja: 'ソウル特別市松坡区オリンピックロ300番地 ロッテワールドタワー',
      zh: '首尔市松坡区奥林匹克路300号 乐天世界塔',
    },
    directions: {
      kr: '지하철 2·8호선 잠실역 1·11번 출구 직결 (롯데월드몰 지하 연결)',
      en: 'Subway Line 2/8, Jamsil Station, Exit 1/11 — directly connected (Lotte World Mall underground)',
      ja: '地下鉄2号線・8号線ジャムシル駅1・11番出口から直結（ロッテワールドモール地下）',
      zh: '地铁2号线/8号线蚕室站1/11号出口直达（乐天世界购物城地下）',
    },
    hours: {
      kr: '타워 전망대 서울스카이: 10:30~22:00 (마지막 입장 21:30) / 지하 몰: 10:30~22:00',
      en: 'Tower observation deck Seoul Sky: 10:30–22:00 (last entry 21:30) / Underground mall: 10:30–22:00',
      ja: 'タワー展望台ソウルスカイ: 10:30~22:00（最終入場21:30） / 地下モール: 10:30~22:00',
      zh: '塔观景台首尔天空: 10:30-22:00（最后入场21:30） / 地下购物中心: 10:30-22:00',
    },
    duration: {
      kr: '둘러보기 1시간~1시간 30분 (서울스카이 포함)',
      en: '1 hour~1.5 hours (including Seoul Sky)',
      ja: '所要時間1時間〜1時間30分（ソウルスカイ込み）',
      zh: '参观1小时至1.5小时（含首尔天空观景台）',
    },
    mapLinks: makeMapLinks('서울 송파구 올림픽로 300 롯데월드타워'),
  },

  // 9. gyeongbokgung (order 9 — 마지막, 직접 등장 아님)
  {
    id: 'gyeongbokgung',
    order: 9,
    sceneTitle: {
      kr: '경복궁 — 진우의 회상, 조선으로 가는 문',
      en: 'Gyeongbokgung — Jinwoo\'s Memory, Gateway to Joseon',
      ja: '景福宮 — ジヌの回想、朝鮮へ通じる門',
      zh: '景福宫 — 珍宇的回忆，通往朝鲜的门',
    },
    sceneDescription: {
      kr: "경복궁은 애니메이션에 직접 등장하지 않는다. 진우가 400년 전 조선 시대로 들어가는 회상 시퀀스에서, 궁궐의 공간 구조·단청·기와지붕의 실루엣이 진우의 내면 세계를 구성하는 건축적 영감으로 사용된다. 즉, '촬영지'가 아니라 '시각적 세계관의 원천'이다.",
      en: "Gyeongbokgung does NOT directly appear in the animation. In the flashback sequence where Jinwoo enters the 400-year-old Joseon era, the palace's spatial structure, dancheong (traditional decorative coloring), and the silhouette of its tiled roof serve as the architectural inspiration shaping Jinwoo's inner world. In other words, it is not a 'filming location' but the 'source of the visual universe.'",
      ja: "景福宮はアニメーションに直接登場しない。ジヌが400年前の朝鮮時代へと入る回想シークエンスにおいて、宮殿の空間構造・丹青（伝統的な彩色装飾）・瓦屋根のシルエットが、ジヌの 내면世界を構成する建築的インスピレーションとして使用される。つまり、「撮影地」ではなく「ビジュアル世界観の源泉」である。",
      zh: "景福宫并未在动画中直接出现。在珍宇进入400年前朝鲜时代的回忆段落中，宫殿的空间结构、丹青（传统彩饰）、瓦顶轮廓作为构成珍宇内心世界的建筑灵感被使用。换句话说，它不是“拍摄地”，而是“视觉世界观的源泉”。",
    },
    filmContext: {
      kr: '경복궁은 영화의 시간 축을 가로지르는 상징적 공간이다. 현대적 서울 장면과 조선시대 회상 장면을 이어주는 시각적 연결고리.',
      en: "Gyeongbokgung is a symbolic space that bridges the film's time axis. It is the visual connecting thread linking modern Seoul scenes with Joseon-era flashbacks.",
      ja: "景福宮は映画の時間軸を横断する象徴的な空間である。現代ソウルのシーンと朝鮮時代の回想シーンをつなぐビジュアルのつながりとなっている。",
      zh: "景福宫是贯穿电影时间轴的象征性空间。它是连接现代首尔场景与朝鲜时代回忆段落的视觉纽带。",
    },
    imageId: 'kdh-gyeongbokgung',
    palaceLink: '/palace/1',
    guideLink: '/kpop-demon-hunters/gyeongbokgung',
    markerCoords: [37.5796, 126.9770],
    address: {
      kr: '서울 종로구 사직로 161 경복궁',
      en: '161 Sajik-ro, Jongno-gu, Seoul — Gyeongbokgung Palace',
      ja: 'ソウル特別市鍾路区社稷路161番地 景福宮',
      zh: '首尔市钟路区社稷路161号 景福宫',
    },
    directions: {
      kr: '지하철 3호선 경복궁역 5번 출구, 도보 3분',
      en: 'Subway Line 3, Gyeongbokgung Station, Exit 5 — 3 min walk',
      ja: '地下鉄3号線景福宮駅5番出口から徒歩3分',
      zh: '地铁3号线景福宫站5号出口，步行3分钟',
    },
    hours: {
      kr: '운영: 09:00~18:00 (화요일 휴무) / 계절별 변동',
      en: 'Hours: 09:00~18:00 (Closed Tuesdays) / Varies by season',
      ja: '営業時間: 09:00~18:00（火曜日休） / 季節により変動',
      zh: '开放时间: 09:00-18:00（周二休息）/ 季节性调整',
    },
    duration: {
      kr: '둘러보기 1시간~1시간 30분',
      en: '1 hour~1.5 hours',
      ja: '所要時間1時間〜1時間30分',
      zh: '参观1小时至1.5小时',
    },
    mapLinks: makeMapLinks('서울 종로구 사직로 161 경복궁'),
  },
];

/* ── Helper Functions ── */

// Image generation pending for these scenes (HF_TOKEN not yet available)
const MISSING_IMAGES = new Set(['kdh-jamsil', 'kdh-cheongdam', 'kdh-coex', 'kdh-myeongdong', 'kdh-lotte']);

export function hasSceneImage(scene: KDHScene): boolean {
  return !MISSING_IMAGES.has(scene.imageId);
}

export function getSceneByLocation(locId: string): KDHScene | undefined {
  return KDH_SCENES.find(scene => scene.id === locId);
}
