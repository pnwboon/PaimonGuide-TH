-- =============================================
-- PaimonGuide TH - Fix Talent Type Constraint
-- =============================================
-- เพิ่ม talent type ใหม่: alternate_sprint, passive_4

ALTER TABLE talents DROP CONSTRAINT IF EXISTS talents_type_check;
ALTER TABLE talents ADD CONSTRAINT talents_type_check CHECK (
  type IN (
    'normal_attack',
    'elemental_skill',
    'elemental_burst',
    'alternate_sprint',
    'passive_1',
    'passive_2',
    'passive_3',
    'passive_4'
  )
);
