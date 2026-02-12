-- =============================================
-- PaimonGuide TH - Constellations Table Migration
-- =============================================

CREATE TABLE IF NOT EXISTS constellations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 6),
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description_en TEXT,
  description_th TEXT,
  icon_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique constellation level per character
  UNIQUE (character_id, level)
);

CREATE INDEX IF NOT EXISTS idx_constellations_character ON constellations(character_id);
