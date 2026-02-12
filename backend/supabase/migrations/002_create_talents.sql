-- =============================================
-- PaimonGuide TH - Talents Table Migration
-- =============================================

CREATE TABLE IF NOT EXISTS talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('normal_attack', 'elemental_skill', 'elemental_burst', 'passive_1', 'passive_2', 'passive_3')),
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description_en TEXT,
  description_th TEXT,

  -- Scaling data (JSONB for flexibility)
  scaling JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_talents_character ON talents(character_id);
CREATE INDEX IF NOT EXISTS idx_talents_type ON talents(type);
