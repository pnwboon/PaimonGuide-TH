// =============================================
// PaimonGuide TH - Type Barrel Export
// =============================================

export type {
  Element,
  WeaponType,
  TalentType,
  Character,
  Talent,
  TalentUpgrade,
  TalentScalingData,
  Constellation,
  CharacterWithDetails,
  AscensionMaterial,
  TalentMaterial,
  CharacterStory,
  CharacterVoiceLine,
  CharacterVideo,
} from './character';

export type { Weapon, ObtainMethod, RefinementData } from './weapon';

export type { Artifact, ArtifactPiece, ArtifactMainStat } from './artifact';

export type { Material, MaterialType, DayOfWeek } from './material';

export type {
  CharacterBuild,
  RecommendedWeapon,
  RecommendedArtifact,
  MainStatRecommendation,
  TeamComposition,
} from './build';

export type { ApiResponse, PaginatedResponse, FilterParams, SearchResult } from './api';
