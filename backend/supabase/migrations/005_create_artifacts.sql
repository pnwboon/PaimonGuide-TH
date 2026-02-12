-- =============================================
-- PaimonGuide TH - Artifacts Table Migration
-- =============================================

CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  max_rarity INTEGER NOT NULL CHECK (max_rarity BETWEEN 1 AND 5),

  -- Set bonuses
  bonus_2pc_en TEXT,
  bonus_2pc_th TEXT,
  bonus_4pc_en TEXT,
  bonus_4pc_th TEXT,

  -- Piece types available
  pieces JSONB DEFAULT '["flower", "plume", "sands", "goblet", "circlet"]'::jsonb,

  -- Assets
  icon_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artifacts_slug ON artifacts(slug);
CREATE INDEX IF NOT EXISTS idx_artifacts_max_rarity ON artifacts(max_rarity);

CREATE TRIGGER update_artifacts_updated_at
  BEFORE UPDATE ON artifacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
