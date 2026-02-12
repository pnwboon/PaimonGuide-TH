-- =============================================
-- PaimonGuide TH - Materials Table Migration
-- =============================================

CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Character Ascension', 'Talent', 'Weapon Ascension', 'Common', 'Local Specialty', 'Boss Drop')),
  rarity INTEGER CHECK (rarity BETWEEN 1 AND 5),

  description_en TEXT,
  description_th TEXT,

  -- Sources (e.g., ['Domain: Forsaken Rift', 'Boss: Stormterror'])
  sources JSONB,

  -- Availability (days of week for domains)
  availability JSONB,

  icon_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_slug ON materials(slug);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);
