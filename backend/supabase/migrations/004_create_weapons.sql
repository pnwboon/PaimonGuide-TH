-- =============================================
-- PaimonGuide TH - Weapons Table Migration
-- =============================================

CREATE TABLE IF NOT EXISTS weapons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  rarity INTEGER NOT NULL CHECK (rarity BETWEEN 1 AND 5),
  type TEXT NOT NULL CHECK (type IN ('Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst')),

  -- Stats
  base_atk INTEGER NOT NULL,
  secondary_stat TEXT,
  secondary_stat_value DECIMAL,

  -- Passive
  passive_name_en TEXT,
  passive_name_th TEXT,
  passive_description_en TEXT,
  passive_description_th TEXT,

  -- Refinement data
  refinements JSONB,

  -- Assets
  icon_url TEXT,
  awakened_icon_url TEXT,

  -- Obtain method
  obtain_method TEXT CHECK (obtain_method IN ('Gacha', 'Craftable', 'Battle Pass', 'Event', 'Starglitter', 'Fishing', 'Quest', 'Free')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weapons_type ON weapons(type);
CREATE INDEX IF NOT EXISTS idx_weapons_rarity ON weapons(rarity);
CREATE INDEX IF NOT EXISTS idx_weapons_slug ON weapons(slug);

CREATE TRIGGER update_weapons_updated_at
  BEFORE UPDATE ON weapons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
