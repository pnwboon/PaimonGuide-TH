-- =============================================
-- PaimonGuide TH - Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE constellations ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_ascension_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_materials ENABLE ROW LEVEL SECURITY;

-- Public read access for all game data tables
CREATE POLICY "Allow public read access on characters"
  ON characters FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on talents"
  ON talents FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on constellations"
  ON constellations FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on weapons"
  ON weapons FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on artifacts"
  ON artifacts FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on materials"
  ON materials FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on character_builds"
  ON character_builds FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on character_ascension_materials"
  ON character_ascension_materials FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on talent_materials"
  ON talent_materials FOR SELECT
  USING (true);

-- Write access only for service role (admin operations via API routes)
-- Note: Write operations should only happen through server-side API routes
-- using the SUPABASE_SERVICE_ROLE_KEY (never exposed to the client)
