// =============================================
// PaimonGuide TH - Enka.Network Types
// =============================================

/** Enka.Network API Response */
export interface EnkaResponse {
  playerInfo: EnkaPlayerInfo;
  avatarInfoList?: EnkaAvatarInfo[];
  ttl: number;
  uid: string;
}

/** Player basic info */
export interface EnkaPlayerInfo {
  nickname: string;
  level: number;
  signature?: string;
  worldLevel?: number;
  nameCardId?: number;
  finishAchievementNum?: number;
  towerFloorIndex?: number;
  towerLevelIndex?: number;
  showAvatarInfoList?: { avatarId: number; level: number; costumeId?: number }[];
  showNameCardIdList?: number[];
  profilePicture?: { avatarId?: number; id?: number; costumeId?: number };
  fetterCount?: number;
}

/** Character detailed info from showcase */
export interface EnkaAvatarInfo {
  avatarId: number;
  propMap: Record<string, { type: number; ival: string; val?: string }>;
  talentIdList?: number[];
  fightPropMap: Record<string, number>;
  skillDepotId: number;
  inherentProudSkillList?: number[];
  skillLevelMap: Record<string, number>;
  proudSkillExtraLevelMap?: Record<string, number>;
  equipList: EnkaEquip[];
  fetterInfo?: { expLevel: number };
}

/** Equipment (weapon or artifact) */
export interface EnkaEquip {
  itemId: number;
  weapon?: {
    level: number;
    promoteLevel?: number;
    affixMap?: Record<string, number>;
  };
  reliquary?: {
    level: number;
    mainPropId: number;
    appendPropIdList?: number[];
  };
  flat: EnkaFlat;
}

/** Flat equipment data */
export interface EnkaFlat {
  nameTextMapHash: string;
  setNameTextMapHash?: string;
  rankLevel: number;
  itemType: 'ITEM_WEAPON' | 'ITEM_RELIQUARY';
  icon: string;
  equipType?: 'EQUIP_BRACER' | 'EQUIP_NECKLACE' | 'EQUIP_SHOES' | 'EQUIP_RING' | 'EQUIP_DRESS';
  setId?: number;
  weaponStats?: EnkaStat[];
  reliquaryMainstat?: EnkaStat;
  reliquarySubstats?: EnkaStat[];
}

export interface EnkaStat {
  appendPropId?: string;
  mainPropId?: string;
  statValue: number;
}

// =============================================
// Parsed / Display types (transformed from raw Enka data)
// =============================================

export interface ParsedPlayer {
  uid: string;
  nickname: string;
  level: number;
  signature: string;
  worldLevel: number;
  achievements: number;
  spiralAbyss: string;
  profilePictureUrl: string;
  characters: ParsedCharacter[];
}

export interface ParsedCharacter {
  avatarId: number;
  name: string;
  element: string;
  rarity: number;
  level: number;
  ascension: number;
  friendship: number;
  constellations: number;
  iconUrl: string;
  sideIconUrl: string;
  // Stats
  stats: ParsedStats;
  // Skill levels
  skills: ParsedSkill[];
  // Equipment
  weapon: ParsedWeapon | null;
  artifacts: ParsedArtifact[];
}

export interface ParsedStats {
  maxHp: number;
  atk: number;
  def: number;
  critRate: number;
  critDmg: number;
  energyRecharge: number;
  elementalMastery: number;
  healingBonus: number;
  // Element DMG bonus (highest)
  elementDmgBonus: number;
  elementDmgType: string;
  physicalDmgBonus: number;
}

export interface ParsedSkill {
  id: string;
  name: string;
  level: number;
  extraLevel: number;
  iconUrl: string;
}

export interface ParsedWeapon {
  name: string;
  rarity: number;
  level: number;
  ascension: number;
  refinement: number;
  baseAtk: number;
  subStat?: { name: string; value: number };
  iconUrl: string;
}

export interface ParsedArtifact {
  name: string;
  setName: string;
  type: string; // flower, feather, sands, goblet, circlet
  typeName: string;
  rarity: number;
  level: number;
  mainStat: { name: string; value: string };
  subStats: { name: string; value: string }[];
  iconUrl: string;
}
