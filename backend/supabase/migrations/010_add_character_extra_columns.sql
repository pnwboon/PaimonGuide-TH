-- =============================================
-- PaimonGuide TH - Add Extra Character Columns
-- =============================================
-- เพิ่ม column ที่ขาดไปจาก migration ก่อนหน้า

-- Character extra info
ALTER TABLE characters ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS birthday TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS affiliation TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS constellation_name TEXT;

-- Ascension data (JSONB) — เก็บข้อมูล stat ทุก ascension phase
ALTER TABLE characters ADD COLUMN IF NOT EXISTS ascension_data JSONB;

-- Ascension materials (JSONB) — เก็บวัตถุดิบ ascension แบบกระชับ
ALTER TABLE characters ADD COLUMN IF NOT EXISTS ascension_materials_data JSONB;
