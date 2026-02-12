// =============================================
// PaimonGuide TH - Character Types
// =============================================

export type Element = 'Pyro' | 'Hydro' | 'Cryo' | 'Electro' | 'Anemo' | 'Geo' | 'Dendro';

export type WeaponType = 'Sword' | 'Claymore' | 'Polearm' | 'Bow' | 'Catalyst';

export type TalentType =
  | 'normal_attack'
  | 'elemental_skill'
  | 'elemental_burst'
  | 'passive_1'
  | 'passive_2'
  | 'passive_3';

export interface Character {
  id: string;
  slug: string;
  name_en: string;
  name_th: string;
  rarity: 4 | 5;
  element: Element;
  weapon_type: WeaponType;
  region?: string;

  base_hp: number;
  base_atk: number;
  base_def: number;
  ascension_stat?: string;
  ascension_stat_value?: number;

  icon_url?: string;
  card_url?: string;
  avatar_url?: string;

  release_date?: string;
  description?: string;

  created_at: string;
  updated_at: string;
}

export interface Talent {
  id: string;
  character_id: string;
  type: TalentType;
  name_en: string;
  name_th: string;
  description_en?: string;
  description_th?: string;
  scaling?: Record<string, unknown>;
}

export interface Constellation {
  id: string;
  character_id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  name_en: string;
  name_th: string;
  description_en?: string;
  description_th?: string;
  icon_url?: string;
}

export interface CharacterWithDetails extends Character {
  talents: Talent[];
  constellations: Constellation[];
  ascension_materials?: AscensionMaterial[];
  talent_materials?: TalentMaterial[];
}

export interface AscensionMaterial {
  id: string;
  character_id: string;
  material_id: string;
  ascension_level: number;
  quantity: number;
  material?: Material;
}

export interface TalentMaterial {
  id: string;
  character_id: string;
  material_id: string;
  talent_level: number;
  quantity: number;
  material?: Material;
}

// Re-export for convenience
import type { Material } from './material';
export type { Material };
