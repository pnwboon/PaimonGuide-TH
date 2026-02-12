// =============================================
// PaimonGuide TH - Artifact Types
// =============================================

export type ArtifactPiece = 'flower' | 'plume' | 'sands' | 'goblet' | 'circlet';

export interface Artifact {
  id: string;
  slug: string;
  name_en: string;
  name_th: string;
  max_rarity: number;

  bonus_2pc_en?: string;
  bonus_2pc_th?: string;
  bonus_4pc_en?: string;
  bonus_4pc_th?: string;

  pieces?: ArtifactPiece[];

  icon_url?: string;

  created_at: string;
  updated_at: string;
}

export type ArtifactMainStat =
  | 'HP'
  | 'HP%'
  | 'ATK'
  | 'ATK%'
  | 'DEF%'
  | 'Elemental Mastery'
  | 'Energy Recharge%'
  | 'Crit Rate%'
  | 'Crit DMG%'
  | 'Physical DMG Bonus%'
  | 'Pyro DMG Bonus%'
  | 'Hydro DMG Bonus%'
  | 'Cryo DMG Bonus%'
  | 'Electro DMG Bonus%'
  | 'Anemo DMG Bonus%'
  | 'Geo DMG Bonus%'
  | 'Dendro DMG Bonus%'
  | 'Healing Bonus%';
