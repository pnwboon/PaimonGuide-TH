// =============================================
// PaimonGuide TH - Weapon Types
// =============================================

import type { WeaponType } from './character';

export type ObtainMethod =
  | 'Gacha'
  | 'Craftable'
  | 'Battle Pass'
  | 'Event'
  | 'Starglitter'
  | 'Fishing'
  | 'Quest'
  | 'Free';

export interface Weapon {
  id: string;
  slug: string;
  name_en: string;
  name_th: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  type: WeaponType;

  base_atk: number;
  secondary_stat?: string;
  secondary_stat_value?: number;

  passive_name_en?: string;
  passive_name_th?: string;
  passive_description_en?: string;
  passive_description_th?: string;

  refinements?: RefinementData;

  icon_url?: string;
  awakened_icon_url?: string;

  obtain_method?: ObtainMethod;

  created_at: string;
  updated_at: string;
}

export interface RefinementData {
  r1?: string;
  r2?: string;
  r3?: string;
  r4?: string;
  r5?: string;
}

export type { WeaponType };
