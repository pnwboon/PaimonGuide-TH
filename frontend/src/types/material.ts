// =============================================
// PaimonGuide TH - Material Types
// =============================================

export type MaterialType =
  | 'Character Ascension'
  | 'Talent'
  | 'Weapon Ascension'
  | 'Common'
  | 'Local Specialty'
  | 'Boss Drop';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Material {
  id: string;
  slug: string;
  name_en: string;
  name_th: string;
  type: MaterialType;
  rarity?: number;

  description_en?: string;
  description_th?: string;

  sources?: string[];
  availability?: DayOfWeek[];

  icon_url?: string;

  created_at: string;
}
