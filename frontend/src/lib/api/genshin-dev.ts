// =============================================
// PaimonGuide TH - Genshin.dev API Client
// =============================================
// ใช้ดึงข้อมูลจาก Genshin.dev API (Public API)

const GENSHIN_API_BASE = process.env.GENSHIN_DEV_API_URL || 'https://genshin.jmp.blue';

interface GenshinCharacterRaw {
  name: string;
  title?: string;
  vision: string;
  weapon: string;
  gender: string;
  nation: string;
  affiliation: string;
  rarity: number;
  release?: string;
  constellation: string;
  birthday: string;
  description: string;
  skillTalents?: Array<{
    name: string;
    unlock: string;
    description: string;
    type: string;
  }>;
  passiveTalents?: Array<{
    name: string;
    unlock: string;
    description: string;
  }>;
  constellations?: Array<{
    name: string;
    unlock: string;
    description: string;
    level: number;
  }>;
}

interface GenshinWeaponRaw {
  name: string;
  type: string;
  rarity: number;
  baseAttack: number;
  subStat: string;
  passiveName: string;
  passiveDesc: string;
  location: string;
}

interface GenshinArtifactRaw {
  name: string;
  max_rarity: number;
  '2-piece_bonus': string;
  '4-piece_bonus': string;
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GENSHIN_API_BASE}${endpoint}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Genshin API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const genshinDevApi = {
  // Characters
  async getCharacterList(): Promise<string[]> {
    return fetchApi<string[]>('/characters');
  },

  async getCharacter(name: string): Promise<GenshinCharacterRaw> {
    return fetchApi<GenshinCharacterRaw>(`/characters/${name}`);
  },

  async getCharacterIcon(name: string): Promise<string> {
    return `${GENSHIN_API_BASE}/characters/${name}/icon`;
  },

  async getCharacterCard(name: string): Promise<string> {
    return `${GENSHIN_API_BASE}/characters/${name}/card`;
  },

  // Weapons
  async getWeaponList(): Promise<string[]> {
    return fetchApi<string[]>('/weapons');
  },

  async getWeapon(name: string): Promise<GenshinWeaponRaw> {
    return fetchApi<GenshinWeaponRaw>(`/weapons/${name}`);
  },

  async getWeaponIcon(name: string): Promise<string> {
    return `${GENSHIN_API_BASE}/weapons/${name}/icon`;
  },

  // Artifacts
  async getArtifactList(): Promise<string[]> {
    return fetchApi<string[]>('/artifacts');
  },

  async getArtifact(name: string): Promise<GenshinArtifactRaw> {
    return fetchApi<GenshinArtifactRaw>(`/artifacts/${name}`);
  },
};

export type { GenshinCharacterRaw, GenshinWeaponRaw, GenshinArtifactRaw };
