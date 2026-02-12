-- =============================================
-- PaimonGuide TH - Junction Tables Migration
-- =============================================

-- Character Ascension Materials
CREATE TABLE IF NOT EXISTS character_ascension_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  ascension_level INTEGER NOT NULL CHECK (ascension_level BETWEEN 1 AND 6),
  quantity INTEGER NOT NULL CHECK (quantity > 0),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate entries
  UNIQUE (character_id, material_id, ascension_level)
);

CREATE INDEX IF NOT EXISTS idx_char_asc_materials_character ON character_ascension_materials(character_id);
CREATE INDEX IF NOT EXISTS idx_char_asc_materials_material ON character_ascension_materials(material_id);

-- Talent Materials
CREATE TABLE IF NOT EXISTS talent_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  talent_level INTEGER NOT NULL CHECK (talent_level BETWEEN 2 AND 10),
  quantity INTEGER NOT NULL CHECK (quantity > 0),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate entries
  UNIQUE (character_id, material_id, talent_level)
);

CREATE INDEX IF NOT EXISTS idx_talent_materials_character ON talent_materials(character_id);
CREATE INDEX IF NOT EXISTS idx_talent_materials_material ON talent_materials(material_id);
