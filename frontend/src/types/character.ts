// =============================================
// PaimonGuide TH - Character Types
// =============================================

export type Element = 'Pyro' | 'Hydro' | 'Cryo' | 'Electro' | 'Anemo' | 'Geo' | 'Dendro';

export type WeaponType = 'Sword' | 'Claymore' | 'Polearm' | 'Bow' | 'Catalyst';

export type TalentType =
  | 'normal_attack'
  | 'elemental_skill'
  | 'elemental_burst'
  | 'alternate_sprint'
  | 'passive_1'
  | 'passive_2'
  | 'passive_3'
  | 'passive_4';

export interface Character {
  id: string;
  slug: string;
  name_en: string;
  name_th: string;
  rarity: 4 | 5;
  element: Element;
  weapon_type: WeaponType;
  region?: string;

  // Extra info
  title?: string;
  gender?: string;
  birthday?: string;
  affiliation?: string;
  constellation_name?: string;

  // Voice actors
  cv_cn?: string;
  cv_en?: string;
  cv_jp?: string;
  cv_kr?: string;

  // Version & extras
  version?: string;
  special_dish_name?: string;
  special_dish_description?: string;
  special_dish_image_url?: string;
  tcg_card_image_url?: string;

  base_hp: number;
  base_atk: number;
  base_def: number;
  ascension_stat?: string;
  ascension_stat_value?: number;

  // Ascension data (JSONB)
  ascension_data?: AscensionPhaseData[];
  ascension_materials_data?: Record<string, AscensionMaterialEntry[]>;

  // Talent materials (JSONB)
  talent_materials_data?: Record<string, AscensionMaterialEntry[]>;

  icon_url?: string;
  card_url?: string;
  avatar_url?: string;
  gacha_card_url?: string;
  gacha_splash_url?: string;
  icon_big_url?: string;
  icon_side_url?: string;
  namecard_url?: string;
  constellation_shape_url?: string;

  release_date?: string;
  description?: string;

  created_at: string;
  updated_at: string;
}

export interface AscensionPhaseData {
  AscensionPhase: string;
  Level: string;
  BaseHP: string;
  BaseAtk: string;
  BaseDef: string;
  [statKey: string]: string; // e.g. "CRIT DMG": "38.4%"
}

export interface AscensionMaterialEntry {
  name: string;
  value: number;
  image_url?: string;
}

export interface TalentUpgrade {
  name: string;
  value: string;
}

export interface Talent {
  id: string;
  character_id: string;
  type: TalentType;
  name_en: string;
  name_th: string;
  description_en?: string;
  description_th?: string;
  scaling?: TalentUpgrade[] | null;
  scaling_data?: TalentScalingData | null;
  icon_url?: string;
}

/** Multi-level talent scaling data (Lv.1-15) */
export interface TalentScalingData {
  params: string[]; // ชื่อ param เช่น ["1-Hit DMG", "2-Hit DMG", ...]
  levels: Record<string, string[]>; // { "1": ["48.4%", ...], "2": [...], ... }
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
  stories?: CharacterStory[];
  voice_lines?: CharacterVoiceLine[];
  videos?: CharacterVideo[];
}

export interface CharacterStory {
  id: string;
  character_id: string;
  title: string;
  content: string;
  unlock_condition?: string;
  sort_order: number;
}

export interface CharacterVoiceLine {
  id: string;
  character_id: string;
  title: string;
  content: string;
  unlock_condition?: string;
  sort_order: number;
}

export interface CharacterVideo {
  id: string;
  character_id: string;
  title: string;
  youtube_url: string;
  video_type?: string;
  thumbnail_url?: string;
  sort_order: number;
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
