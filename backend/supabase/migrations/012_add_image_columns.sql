-- =============================================
-- PaimonGuide TH - Add Image Columns
-- =============================================
-- เพิ่ม column สำหรับเก็บ URL รูปภาพเพิ่มเติม

-- ===== Characters =====
-- Gacha images
ALTER TABLE characters ADD COLUMN IF NOT EXISTS gacha_card_url TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS gacha_splash_url TEXT;

-- Side icon & big icon
ALTER TABLE characters ADD COLUMN IF NOT EXISTS icon_big_url TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS icon_side_url TEXT;

-- Namecard & constellation shape
ALTER TABLE characters ADD COLUMN IF NOT EXISTS namecard_url TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS constellation_shape_url TEXT;

-- ===== Talents =====
ALTER TABLE talents ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- ===== Constellations =====
-- icon_url already exists in schema
