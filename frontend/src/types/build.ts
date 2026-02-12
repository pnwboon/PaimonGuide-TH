// =============================================
// PaimonGuide TH - Build Types
// =============================================

import type { ArtifactMainStat } from './artifact';

export interface CharacterBuild {
  id: string;
  character_id: string;

  title_th: string;
  description_th?: string;

  recommended_weapons?: RecommendedWeapon[];
  recommended_artifacts?: RecommendedArtifact[];
  main_stats?: MainStatRecommendation;
  sub_stats_priority?: string[];

  team_comps?: TeamComposition[];

  dps_rating?: number;
  support_rating?: number;

  author_id?: string;
  is_official: boolean;
  upvotes: number;

  created_at: string;
  updated_at: string;
}

export interface RecommendedWeapon {
  weapon_id: string;
  priority: number;
  notes_th?: string;
}

export interface RecommendedArtifact {
  artifact_id: string;
  pieces: number; // 2 or 4
  alternative_id?: string;
  alternative_pieces?: number;
  notes_th?: string;
}

export interface MainStatRecommendation {
  sands: ArtifactMainStat[];
  goblet: ArtifactMainStat[];
  circlet: ArtifactMainStat[];
}

export interface TeamComposition {
  name_th: string;
  character_ids: string[];
  description_th?: string;
}
