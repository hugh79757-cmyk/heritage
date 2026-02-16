-- =============================================
-- K-Heritage Guide D1 Schema
-- =============================================

-- 궁궐 기본 정보
CREATE TABLE IF NOT EXISTS palaces (
  id INTEGER PRIMARY KEY,
  gung_number INTEGER UNIQUE NOT NULL,
  name_ko TEXT NOT NULL,
  name_en TEXT,
  name_ja TEXT,
  name_zh TEXT,
  desc_ko TEXT,
  desc_en TEXT,
  desc_ja TEXT,
  desc_zh TEXT,
  image_url TEXT,
  hero_image_url TEXT,
  lat REAL,
  lng REAL,
  total_buildings INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 건물 목록
CREATE TABLE IF NOT EXISTS buildings (
  id INTEGER PRIMARY KEY,
  gung_number INTEGER NOT NULL,
  serial_number INTEGER NOT NULL,
  detail_code INTEGER NOT NULL,
  name_ko TEXT NOT NULL,
  name_en TEXT,
  name_ja TEXT,
  name_zh TEXT,
  desc_ko TEXT,
  desc_en TEXT,
  desc_ja TEXT,
  desc_zh TEXT,
  image_url TEXT,
  detail_link TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(gung_number, serial_number, detail_code)
);

-- 건물 상세 정보
CREATE TABLE IF NOT EXISTS building_details (
  id INTEGER PRIMARY KEY,
  gung_number INTEGER NOT NULL,
  serial_number INTEGER NOT NULL,
  detail_code INTEGER NOT NULL,
  explanation_ko TEXT,
  explanation_en TEXT,
  explanation_ja TEXT,
  explanation_zh TEXT,
  main_image_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(gung_number, serial_number, detail_code)
);

-- 이미지 갤러리
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY,
  gung_number INTEGER NOT NULL,
  serial_number INTEGER NOT NULL,
  detail_code INTEGER NOT NULL,
  image_index INTEGER DEFAULT 0,
  name_ko TEXT,
  name_en TEXT,
  name_ja TEXT,
  name_zh TEXT,
  desc_ko TEXT,
  desc_en TEXT,
  desc_ja TEXT,
  desc_zh TEXT,
  image_url TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 동영상
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY,
  gung_number INTEGER NOT NULL,
  serial_number INTEGER NOT NULL,
  detail_code INTEGER NOT NULL,
  movie_index INTEGER DEFAULT 0,
  name_ko TEXT,
  name_en TEXT,
  name_ja TEXT,
  name_zh TEXT,
  url_ko TEXT,
  url_en TEXT,
  url_ja TEXT,
  url_zh TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_buildings_gung ON buildings(gung_number);
CREATE INDEX IF NOT EXISTS idx_buildings_serial ON buildings(serial_number);
CREATE INDEX IF NOT EXISTS idx_building_details_gung ON building_details(gung_number, serial_number, detail_code);
CREATE INDEX IF NOT EXISTS idx_images_building ON images(gung_number, serial_number, detail_code);
CREATE INDEX IF NOT EXISTS idx_movies_building ON movies(gung_number, serial_number, detail_code);
