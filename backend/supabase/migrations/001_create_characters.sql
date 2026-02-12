-- =============================================
-- PaimonGuide TH - Characters Table Migration
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Characters Table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  rarity INTEGER NOT NULL CHECK (rarity IN (4, 5)),
  element TEXT NOT NULL CHECK (element IN ('Pyro', 'Hydro', 'Cryo', 'Electro', 'Anemo', 'Geo', 'Dendro')),
  weapon_type TEXT NOT NULL CHECK (weapon_type IN ('Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst')),
  region TEXT,

  -- Stats
  base_hp INTEGER NOT NULL,
  base_atk INTEGER NOT NULL,
  base_def INTEGER NOT NULL,
  ascension_stat TEXT,
  ascension_stat_value DECIMAL,

  -- Assets
  icon_url TEXT,
  card_url TEXT,
  avatar_url TEXT,

  -- Metadata
  release_date DATE,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_characters_element ON characters(element);
CREATE INDEX IF NOT EXISTS idx_characters_weapon_type ON characters(weapon_type);
CREATE INDEX IF NOT EXISTS idx_characters_rarity ON characters(rarity);
CREATE INDEX IF NOT EXISTS idx_characters_slug ON characters(slug);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
