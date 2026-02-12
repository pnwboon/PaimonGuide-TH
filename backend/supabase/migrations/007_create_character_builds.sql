-- =============================================
-- PaimonGuide TH - Character Builds Table Migration
-- =============================================

CREATE TABLE IF NOT EXISTS character_builds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,

  title_th TEXT NOT NULL,
  description_th TEXT,

  -- Build details
  recommended_weapons JSONB,
  recommended_artifacts JSONB,
  main_stats JSONB,
  sub_stats_priority JSONB,

  -- Team compositions
  team_comps JSONB,

  -- Ratings
  dps_rating INTEGER CHECK (dps_rating BETWEEN 1 AND 10),
  support_rating INTEGER CHECK (support_rating BETWEEN 1 AND 10),

  -- Metadata
  author_id UUID,
  is_official BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_builds_character ON character_builds(character_id);
CREATE INDEX IF NOT EXISTS idx_builds_is_official ON character_builds(is_official);

CREATE TRIGGER update_character_builds_updated_at
  BEFORE UPDATE ON character_builds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
