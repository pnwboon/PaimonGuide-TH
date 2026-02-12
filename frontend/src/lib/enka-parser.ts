// =============================================
// PaimonGuide TH - Enka.Network Data Parser
// =============================================
// แปลงข้อมูลดิบจาก Enka.Network API ให้พร้อมแสดงผล

import type {
  EnkaResponse,
  EnkaAvatarInfo,
  EnkaEquip,
  ParsedPlayer,
  ParsedCharacter,
  ParsedStats,
  ParsedSkill,
  ParsedWeapon,
  ParsedArtifact,
} from '@/types/enka';

// ========== Constants ==========

const ENKA_UI_BASE = 'https://enka.network/ui';

/** FightProp ID → Thai display name */
const FIGHT_PROP_NAMES: Record<string, string> = {
  FIGHT_PROP_HP: 'HP',
  FIGHT_PROP_HP_PERCENT: 'HP%',
  FIGHT_PROP_ATTACK: 'ATK',
  FIGHT_PROP_ATTACK_PERCENT: 'ATK%',
  FIGHT_PROP_DEFENSE: 'DEF',
  FIGHT_PROP_DEFENSE_PERCENT: 'DEF%',
  FIGHT_PROP_CRITICAL: 'อัตราคริ',
  FIGHT_PROP_CRITICAL_HURT: 'ดาเมจคริ',
  FIGHT_PROP_CHARGE_EFFICIENCY: 'ฟื้นฟูพลังงาน',
  FIGHT_PROP_HEAL_ADD: 'โบนัสการรักษา',
  FIGHT_PROP_ELEMENT_MASTERY: 'ความชำนาญธาตุ',
  FIGHT_PROP_PHYSICAL_ADD_HURT: 'โบนัสกายภาพ',
  FIGHT_PROP_FIRE_ADD_HURT: 'โบนัส Pyro',
  FIGHT_PROP_ELEC_ADD_HURT: 'โบนัส Electro',
  FIGHT_PROP_WATER_ADD_HURT: 'โบนัส Hydro',
  FIGHT_PROP_WIND_ADD_HURT: 'โบนัส Anemo',
  FIGHT_PROP_ICE_ADD_HURT: 'โบนัส Cryo',
  FIGHT_PROP_ROCK_ADD_HURT: 'โบนัส Geo',
  FIGHT_PROP_GRASS_ADD_HURT: 'โบนัส Dendro',
  FIGHT_PROP_BASE_ATTACK: 'Base ATK',
};

/** FightProp ID → whether the value is a percentage */
const PERCENT_PROPS = new Set([
  'FIGHT_PROP_HP_PERCENT',
  'FIGHT_PROP_ATTACK_PERCENT',
  'FIGHT_PROP_DEFENSE_PERCENT',
  'FIGHT_PROP_CRITICAL',
  'FIGHT_PROP_CRITICAL_HURT',
  'FIGHT_PROP_CHARGE_EFFICIENCY',
  'FIGHT_PROP_HEAL_ADD',
  'FIGHT_PROP_PHYSICAL_ADD_HURT',
  'FIGHT_PROP_FIRE_ADD_HURT',
  'FIGHT_PROP_ELEC_ADD_HURT',
  'FIGHT_PROP_WATER_ADD_HURT',
  'FIGHT_PROP_WIND_ADD_HURT',
  'FIGHT_PROP_ICE_ADD_HURT',
  'FIGHT_PROP_ROCK_ADD_HURT',
  'FIGHT_PROP_GRASS_ADD_HURT',
]);

/** Equip type → Thai name */
const EQUIP_TYPE_NAMES: Record<string, string> = {
  EQUIP_BRACER: 'ดอกไม้',
  EQUIP_NECKLACE: 'ขนนก',
  EQUIP_SHOES: 'นาฬิกาทราย',
  EQUIP_RING: 'ถ้วย',
  EQUIP_DRESS: 'มงกุฎ',
};

const EQUIP_TYPE_EN: Record<string, string> = {
  EQUIP_BRACER: 'flower',
  EQUIP_NECKLACE: 'feather',
  EQUIP_SHOES: 'sands',
  EQUIP_RING: 'goblet',
  EQUIP_DRESS: 'circlet',
};

/** Element DMG FightProp IDs */
const ELEMENT_DMG_PROPS: Record<number, string> = {
  30: 'Physical',
  40: 'Pyro',
  41: 'Electro',
  42: 'Hydro',
  43: 'Dendro',
  44: 'Anemo',
  45: 'Geo',
  46: 'Cryo',
};

/** Element key from character store */
const ELEMENT_MAP: Record<string, string> = {
  Fire: 'Pyro',
  Ice: 'Cryo',
  Water: 'Hydro',
  Wind: 'Anemo',
  Rock: 'Geo',
  Electric: 'Electro',
  Grass: 'Dendro',
};

// ========== Character & Localization Store ==========
// We fetch these once and cache them

let characterStore: Record<string, CharacterStoreEntry> | null = null;
let locStore: Record<string, Record<string, string>> | null = null;

interface CharacterStoreEntry {
  Element: string;
  Consts: string[];
  SkillOrder: number[];
  Skills: Record<string, string>;
  ProudMap: Record<string, number>;
  NameTextMapHash: number;
  SideIconName: string;
  QualityType: string;
  WeaponType: string;
  Costumes?: Record<string, { sideIconName: string; icon: string; art: string }>;
}

async function getCharacterStore(): Promise<Record<string, CharacterStoreEntry>> {
  if (characterStore) return characterStore;
  const res = await fetch(
    'https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/characters.json',
    { next: { revalidate: 86400 } }
  );
  characterStore = await res.json();
  return characterStore!;
}

async function getLocStore(): Promise<Record<string, Record<string, string>>> {
  if (locStore) return locStore;
  const res = await fetch(
    'https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/loc.json',
    { next: { revalidate: 86400 } }
  );
  locStore = await res.json();
  return locStore!;
}

// ========== Format Helpers ==========

function formatStatValue(propId: string, value: number): string {
  if (PERCENT_PROPS.has(propId)) {
    return `${value.toFixed(1)}%`;
  }
  if (propId === 'FIGHT_PROP_ELEMENT_MASTERY') {
    return Math.round(value).toString();
  }
  return Math.round(value).toLocaleString();
}

function getStatDisplayName(propId: string): string {
  return FIGHT_PROP_NAMES[propId] || propId.replace('FIGHT_PROP_', '');
}

// ========== Main Parser ==========

export async function parseEnkaResponse(data: EnkaResponse): Promise<ParsedPlayer> {
  const [charStore, loc] = await Promise.all([getCharacterStore(), getLocStore()]);
  const en = loc.en || {};

  const player = data.playerInfo;

  // Profile picture
  let profilePictureUrl = '';
  if (player.profilePicture?.avatarId) {
    const avatarChar = charStore[player.profilePicture.avatarId.toString()];
    if (avatarChar) {
      const iconName = avatarChar.SideIconName.replace('_Side', '');
      profilePictureUrl = `${ENKA_UI_BASE}/${iconName}.png`;
    }
  }

  // Parse characters
  const characters: ParsedCharacter[] = [];
  if (data.avatarInfoList) {
    for (const avatar of data.avatarInfoList) {
      const parsed = parseCharacter(avatar, charStore, en);
      if (parsed) characters.push(parsed);
    }
  }

  return {
    uid: data.uid,
    nickname: player.nickname,
    level: player.level,
    signature: player.signature || '',
    worldLevel: player.worldLevel || 0,
    achievements: player.finishAchievementNum || 0,
    spiralAbyss: player.towerFloorIndex
      ? `${player.towerFloorIndex}-${player.towerLevelIndex || 0}`
      : '-',
    profilePictureUrl,
    characters,
  };
}

function parseCharacter(
  avatar: EnkaAvatarInfo,
  charStore: Record<string, CharacterStoreEntry>,
  en: Record<string, string>
): ParsedCharacter | null {
  const charData = charStore[avatar.avatarId.toString()];
  if (!charData) return null;

  // Name from localization
  const name = en[charData.NameTextMapHash.toString()] || `Character ${avatar.avatarId}`;

  // Element
  const element = ELEMENT_MAP[charData.Element] || charData.Element;

  // Rarity
  const rarity = charData.QualityType === 'QUALITY_ORANGE' || charData.QualityType === 'QUALITY_ORANGE_SP' ? 5 : 4;

  // Level & Ascension
  const level = Number(avatar.propMap?.['4001']?.val || 0);
  const ascension = Number(avatar.propMap?.['1002']?.val || 0);

  // Friendship
  const friendship = avatar.fetterInfo?.expLevel || 0;

  // Constellations
  const constellations = avatar.talentIdList?.length || 0;

  // Icons
  const iconName = charData.SideIconName.replace('_Side', '');
  const iconUrl = `${ENKA_UI_BASE}/${iconName}.png`;
  const sideIconUrl = `${ENKA_UI_BASE}/${charData.SideIconName}.png`;

  // Stats
  const stats = parseStats(avatar.fightPropMap);

  // Skills
  const skills = parseSkills(avatar, charData);

  // Equipment
  let weapon: ParsedWeapon | null = null;
  const artifacts: ParsedArtifact[] = [];

  for (const equip of avatar.equipList) {
    if (equip.flat.itemType === 'ITEM_WEAPON') {
      weapon = parseWeapon(equip, en);
    } else if (equip.flat.itemType === 'ITEM_RELIQUARY') {
      artifacts.push(parseArtifact(equip, en));
    }
  }

  return {
    avatarId: avatar.avatarId,
    name,
    element,
    rarity,
    level,
    ascension,
    friendship,
    constellations,
    iconUrl,
    sideIconUrl,
    stats,
    skills,
    weapon,
    artifacts,
  };
}

function parseStats(fightPropMap: Record<string, number>): ParsedStats {
  // Find highest element DMG bonus
  let elementDmgBonus = 0;
  let elementDmgType = '';
  for (const [propId, element] of Object.entries(ELEMENT_DMG_PROPS)) {
    const val = fightPropMap[propId] || 0;
    if (val > elementDmgBonus) {
      elementDmgBonus = val;
      elementDmgType = element;
    }
  }

  return {
    maxHp: Math.round(fightPropMap['2000'] || 0),
    atk: Math.round(fightPropMap['2001'] || 0),
    def: Math.round(fightPropMap['2002'] || 0),
    critRate: (fightPropMap['20'] || 0) * 100,
    critDmg: (fightPropMap['22'] || 0) * 100,
    energyRecharge: (fightPropMap['23'] || 0) * 100,
    elementalMastery: Math.round(fightPropMap['28'] || 0),
    healingBonus: (fightPropMap['26'] || 0) * 100,
    elementDmgBonus: elementDmgBonus * 100,
    elementDmgType,
    physicalDmgBonus: (fightPropMap['30'] || 0) * 100,
  };
}

function parseSkills(
  avatar: EnkaAvatarInfo,
  charData: CharacterStoreEntry
): ParsedSkill[] {
  const skills: ParsedSkill[] = [];

  for (const skillId of charData.SkillOrder) {
    const level = avatar.skillLevelMap[skillId.toString()] || 0;
    const proudId = charData.ProudMap[skillId.toString()];
    const extraLevel = proudId
      ? avatar.proudSkillExtraLevelMap?.[proudId.toString()] || 0
      : 0;

    const iconName = charData.Skills[skillId.toString()];
    const iconUrl = iconName ? `${ENKA_UI_BASE}/${iconName}.png` : '';

    skills.push({
      id: skillId.toString(),
      name: '',
      level,
      extraLevel,
      iconUrl,
    });
  }

  return skills;
}

function parseWeapon(equip: EnkaEquip, en: Record<string, string>): ParsedWeapon {
  const name = en[equip.flat.nameTextMapHash] || 'Unknown Weapon';
  const rarity = equip.flat.rankLevel;
  const level = equip.weapon?.level || 1;
  const ascension = equip.weapon?.promoteLevel || 0;

  // Refinement: affixMap values are 0-based, so R1 = 0
  let refinement = 1;
  if (equip.weapon?.affixMap) {
    const val = Object.values(equip.weapon.affixMap)[0];
    refinement = (val || 0) + 1;
  }

  // Weapon stats
  let baseAtk = 0;
  let subStat: { name: string; value: number } | undefined;

  if (equip.flat.weaponStats) {
    for (const stat of equip.flat.weaponStats) {
      const propId = stat.appendPropId || stat.mainPropId || '';
      if (propId === 'FIGHT_PROP_BASE_ATTACK') {
        baseAtk = stat.statValue;
      } else {
        subStat = {
          name: getStatDisplayName(propId),
          value: stat.statValue,
        };
      }
    }
  }

  const iconUrl = `${ENKA_UI_BASE}/${equip.flat.icon}.png`;

  return { name, rarity, level, ascension, refinement, baseAtk, subStat, iconUrl };
}

function parseArtifact(equip: EnkaEquip, en: Record<string, string>): ParsedArtifact {
  const name = en[equip.flat.nameTextMapHash] || 'Unknown Artifact';
  const setName = equip.flat.setNameTextMapHash
    ? en[equip.flat.setNameTextMapHash] || ''
    : '';
  const rarity = equip.flat.rankLevel;
  const level = (equip.reliquary?.level || 1) - 1; // level is 1-based in API

  const equipType = equip.flat.equipType || '';
  const type = EQUIP_TYPE_EN[equipType] || 'unknown';
  const typeName = EQUIP_TYPE_NAMES[equipType] || equipType;

  // Main stat
  let mainStat = { name: '', value: '' };
  if (equip.flat.reliquaryMainstat) {
    const propId = equip.flat.reliquaryMainstat.mainPropId || '';
    mainStat = {
      name: getStatDisplayName(propId),
      value: formatStatValue(propId, equip.flat.reliquaryMainstat.statValue),
    };
  }

  // Sub stats
  const subStats: { name: string; value: string }[] = [];
  if (equip.flat.reliquarySubstats) {
    for (const sub of equip.flat.reliquarySubstats) {
      const propId = sub.appendPropId || '';
      subStats.push({
        name: getStatDisplayName(propId),
        value: formatStatValue(propId, sub.statValue),
      });
    }
  }

  const iconUrl = `${ENKA_UI_BASE}/${equip.flat.icon}.png`;

  return { name, setName, type, typeName, rarity, level, mainStat, subStats, iconUrl };
}
