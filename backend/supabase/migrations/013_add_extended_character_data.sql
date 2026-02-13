-- =============================================
-- PaimonGuide TH - Extended Character Data
-- =============================================
-- เพิ่มข้อมูลเพิ่มเติมสำหรับหน้ารายละเอียดตัวละครแบบ HoYoLAB Wiki
-- รันที่ Supabase SQL Editor

-- ===== 1. Voice Actors & Extra Info on Characters =====
ALTER TABLE characters ADD COLUMN IF NOT EXISTS cv_cn TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS cv_en TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS cv_jp TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS cv_kr TEXT;

ALTER TABLE characters ADD COLUMN IF NOT EXISTS version TEXT;            -- เวอร์ชันที่เปิดตัว เช่น "4.2"
ALTER TABLE characters ADD COLUMN IF NOT EXISTS special_dish_name TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS special_dish_description TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS special_dish_image_url TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS tcg_card_image_url TEXT;

-- ===== 2. Talent Materials (JSONB) on Characters =====
-- เก็บวัตถุดิบอัพเกรด talent เป็น JSONB (คล้ายกับ ascension_materials_data)
-- รูปแบบ: { "2": [ {name, value, image_url}, ... ], "3": [...], ..., "10": [...] }
ALTER TABLE characters ADD COLUMN IF NOT EXISTS talent_materials_data JSONB;

-- ===== 3. Multi-level Talent Scaling =====
-- เพิ่ม column สำหรับค่าสกิลหลายเลเวล (Lv.1-15)
-- รูปแบบ JSONB:
-- {
--   "params": ["1-Hit DMG", "2-Hit DMG", "Charged Attack DMG", ...],
--   "levels": {
--     "1": ["48.4%", "43.7%", "74.2%", ...],
--     "2": ["52.3%", "47.3%", "80.3%", ...],
--     ...
--     "15": ["129.4%", "117.0%", "189.8%", ...]
--   }
-- }
ALTER TABLE talents ADD COLUMN IF NOT EXISTS scaling_data JSONB;

-- ===== 4. Character Stories (Lore) =====
CREATE TABLE IF NOT EXISTS character_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,              -- ชื่อหัวข้อ เช่น "เรื่องราวตัวละคร 1"
  content TEXT NOT NULL,            -- เนื้อหา
  unlock_condition TEXT,            -- เงื่อนไขปลดล็อก เช่น "มิตรภาพ Lv.2"
  sort_order INTEGER DEFAULT 0,    -- ลำดับการแสดงผล
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_char_stories_character ON character_stories(character_id);

CREATE TRIGGER update_character_stories_updated_at
  BEFORE UPDATE ON character_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===== 5. Character Voice Lines =====
CREATE TABLE IF NOT EXISTS character_voice_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,              -- หัวข้อ เช่น "สวัสดี", "เกี่ยวกับ Xiangling"
  content TEXT NOT NULL,            -- เนื้อหาบทพูด
  unlock_condition TEXT,            -- เงื่อนไขปลดล็อก
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_char_voice_lines_character ON character_voice_lines(character_id);

CREATE TRIGGER update_character_voice_lines_updated_at
  BEFORE UPDATE ON character_voice_lines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===== 6. Character Videos =====
CREATE TABLE IF NOT EXISTS character_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,              -- ชื่อวิดีโอ
  youtube_url TEXT NOT NULL,        -- URL ของ YouTube
  video_type TEXT,                  -- ประเภท: 'demo', 'teaser', 'collected_miscellany', 'other'
  thumbnail_url TEXT,               -- รูป thumbnail (ถ้ามี)
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_char_videos_character ON character_videos(character_id);

CREATE TRIGGER update_character_videos_updated_at
  BEFORE UPDATE ON character_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===== 7. RLS Policies =====
ALTER TABLE character_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_voice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_videos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read character_stories"
  ON character_stories FOR SELECT USING (true);

CREATE POLICY "Allow public read character_voice_lines"
  ON character_voice_lines FOR SELECT USING (true);

CREATE POLICY "Allow public read character_videos"
  ON character_videos FOR SELECT USING (true);
