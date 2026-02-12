// =============================================
// PaimonGuide TH - Constants
// =============================================

/** All playable elements */
export const ELEMENTS = ['Pyro', 'Hydro', 'Cryo', 'Electro', 'Anemo', 'Geo', 'Dendro'] as const;

/** All weapon types */
export const WEAPON_TYPES = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'] as const;

/** All rarity levels */
export const RARITIES = [5, 4, 3, 2, 1] as const;

/** Character rarity levels */
export const CHARACTER_RARITIES = [5, 4] as const;

/** All regions */
export const REGIONS = [
  'Mondstadt',
  'Liyue',
  'Inazuma',
  'Sumeru',
  'Fontaine',
  'Natlan',
  'Snezhnaya',
] as const;

/** Region to Thai name mapping */
export const REGION_NAMES_TH: Record<string, string> = {
  Mondstadt: 'มอนด์สตัดท์',
  Liyue: 'ลี่เยว่',
  Inazuma: 'อินาซึมะ',
  Sumeru: 'สุเมรุ',
  Fontaine: 'ฟงแตน',
  Natlan: 'นัตลัน',
  Snezhnaya: 'สเนจนายา',
};

/** Talent types display */
export const TALENT_TYPE_NAMES: Record<string, string> = {
  normal_attack: 'การโจมตีปกติ',
  elemental_skill: 'สกิลธาตุ',
  elemental_burst: 'ท่าไม้ตายธาตุ',
  alternate_sprint: 'วิ่งทางเลือก',
  passive_1: 'พรสวรรค์ที่ 1',
  passive_2: 'พรสวรรค์ที่ 2',
  passive_3: 'พรสวรรค์ที่ 3',
  passive_4: 'พรสวรรค์ที่ 4',
};

/** Stat name translations */
export const STAT_NAMES_TH: Record<string, string> = {
  'HP': 'พลังชีวิต',
  'ATK': 'พลังโจมตี',
  'DEF': 'พลังป้องกัน',
  'HP%': 'พลังชีวิต%',
  'ATK%': 'พลังโจมตี%',
  'DEF%': 'พลังป้องกัน%',
  'Elemental Mastery': 'ความชำนาญธาตุ',
  'Energy Recharge%': 'ฟื้นฟูพลังงาน%',
  'Crit Rate%': 'อัตราคริติคอล%',
  'Crit DMG%': 'ความเสียหายคริติคอล%',
  'Physical DMG Bonus%': 'โบนัสความเสียหายกายภาพ%',
  'Healing Bonus%': 'โบนัสการรักษา%',
};
