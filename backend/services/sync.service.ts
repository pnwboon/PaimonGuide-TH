// =============================================
// PaimonGuide TH - Backend Sync Service
// =============================================
// ใช้สำหรับ sync ข้อมูลจาก Genshin.dev API ลง Supabase
// รัน server-side เท่านั้น

import { createClient } from '@supabase/supabase-js';

const GENSHIN_API_BASE = process.env.GENSHIN_DEV_API_URL || 'https://genshin.jmp.blue';

// ใช้ Service Role Key สำหรับ write operations
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase credentials for admin client');
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Map vision names from API to our schema
function normalizeElement(vision: string): string {
  const map: Record<string, string> = {
    pyro: 'Pyro',
    hydro: 'Hydro',
    cryo: 'Cryo',
    electro: 'Electro',
    anemo: 'Anemo',
    geo: 'Geo',
    dendro: 'Dendro',
  };
  return map[vision.toLowerCase()] || vision;
}

function normalizeWeaponType(weapon: string): string {
  const map: Record<string, string> = {
    sword: 'Sword',
    claymore: 'Claymore',
    polearm: 'Polearm',
    bow: 'Bow',
    catalyst: 'Catalyst',
  };
  return map[weapon.toLowerCase()] || weapon;
}

function normalizeObtainMethod(location: string | undefined | null): string | null {
  if (!location) return null;
  const map: Record<string, string> = {
    gacha: 'Gacha',
    wish: 'Gacha',
    wishes: 'Gacha',
    craftable: 'Craftable',
    crafting: 'Craftable',
    forge: 'Craftable',
    'battle pass': 'Battle Pass',
    'bp bounty': 'Battle Pass',
    event: 'Event',
    starglitter: 'Starglitter',
    'starglitter exchange': 'Starglitter',
    fishing: 'Fishing',
    quest: 'Quest',
    free: 'Free',
  };
  return map[location.toLowerCase()] || null;
}

export class SyncService {
  private supabase = getAdminClient();

  /**
   * Sync all characters from Genshin.dev API
   */
  async syncCharacters(): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = [];
    let synced = 0;

    try {
      // Get character list
      const listRes = await fetch(`${GENSHIN_API_BASE}/characters`);
      const characterNames: string[] = await listRes.json();

      for (const name of characterNames) {
        try {
          const res = await fetch(`${GENSHIN_API_BASE}/characters/${name}`);
          if (!res.ok) {
            errors.push(`Failed to fetch character: ${name}`);
            continue;
          }

          const data = await res.json();
          const slug = slugify(name);

          const characterData = {
            slug,
            name_en: data.name || name,
            name_th: data.name || name, // Will need manual Thai translation
            rarity: data.rarity || 4,
            element: normalizeElement(data.vision || ''),
            weapon_type: normalizeWeaponType(data.weapon || ''),
            region: data.nation || null,
            base_hp: 0, // API doesn't provide base stats directly
            base_atk: 0,
            base_def: 0,
            description: data.description || null,
            icon_url: `${GENSHIN_API_BASE}/characters/${name}/icon`,
            card_url: `${GENSHIN_API_BASE}/characters/${name}/card`,
            avatar_url: `${GENSHIN_API_BASE}/characters/${name}/portrait`,
          };

          const { error } = await this.supabase
            .from('characters')
            .upsert(characterData, { onConflict: 'slug' });

          if (error) {
            errors.push(`DB error for ${name}: ${error.message}`);
          } else {
            synced++;
          }

          // Rate limiting
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (err) {
          errors.push(`Error processing ${name}: ${String(err)}`);
        }
      }
    } catch (err) {
      errors.push(`Failed to fetch character list: ${String(err)}`);
    }

    return { synced, errors };
  }

  /**
   * Sync all weapons from Genshin.dev API
   */
  async syncWeapons(): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = [];
    let synced = 0;

    try {
      const listRes = await fetch(`${GENSHIN_API_BASE}/weapons`);
      const weaponNames: string[] = await listRes.json();

      for (const name of weaponNames) {
        try {
          const res = await fetch(`${GENSHIN_API_BASE}/weapons/${name}`);
          if (!res.ok) {
            errors.push(`Failed to fetch weapon: ${name}`);
            continue;
          }

          const data = await res.json();
          const slug = slugify(name);

          const obtainMethod = normalizeObtainMethod(data.location);
          const weaponData: Record<string, unknown> = {
            slug,
            name_en: data.name || name,
            name_th: data.name || name,
            rarity: data.rarity || 3,
            type: normalizeWeaponType(data.type || ''),
            base_atk: data.baseAttack || 0,
            secondary_stat: data.subStat || null,
            passive_name_en: data.passiveName || null,
            passive_description_en: data.passiveDesc || null,
            icon_url: `${GENSHIN_API_BASE}/weapons/${name}/icon`,
          };

          // Only include obtain_method if it maps to a valid enum value
          if (obtainMethod) {
            weaponData.obtain_method = obtainMethod;
          }

          const { error } = await this.supabase
            .from('weapons')
            .upsert(weaponData, { onConflict: 'slug' });

          if (error) {
            errors.push(`DB error for ${name}: ${error.message}`);
          } else {
            synced++;
          }

          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (err) {
          errors.push(`Error processing ${name}: ${String(err)}`);
        }
      }
    } catch (err) {
      errors.push(`Failed to fetch weapon list: ${String(err)}`);
    }

    return { synced, errors };
  }

  /**
   * Sync all artifacts from Genshin.dev API
   */
  async syncArtifacts(): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = [];
    let synced = 0;

    try {
      const listRes = await fetch(`${GENSHIN_API_BASE}/artifacts`);
      const artifactNames: string[] = await listRes.json();

      for (const name of artifactNames) {
        try {
          const res = await fetch(`${GENSHIN_API_BASE}/artifacts/${name}`);
          if (!res.ok) {
            errors.push(`Failed to fetch artifact: ${name}`);
            continue;
          }

          const data = await res.json();
          const slug = slugify(name);

          const artifactData = {
            slug,
            name_en: data.name || name,
            name_th: data.name || name,
            max_rarity: data.max_rarity || 5,
            bonus_2pc_en: data['2-piece_bonus'] || null,
            bonus_4pc_en: data['4-piece_bonus'] || null,
          };

          const { error } = await this.supabase
            .from('artifacts')
            .upsert(artifactData, { onConflict: 'slug' });

          if (error) {
            errors.push(`DB error for ${name}: ${error.message}`);
          } else {
            synced++;
          }

          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (err) {
          errors.push(`Error processing ${name}: ${String(err)}`);
        }
      }
    } catch (err) {
      errors.push(`Failed to fetch artifact list: ${String(err)}`);
    }

    return { synced, errors };
  }

  /**
   * Sync everything
   */
  async syncAll(): Promise<{
    characters: { synced: number; errors: string[] };
    weapons: { synced: number; errors: string[] };
    artifacts: { synced: number; errors: string[] };
  }> {
    console.log('Starting full sync...');

    const characters = await this.syncCharacters();
    console.log(`Characters: ${characters.synced} synced, ${characters.errors.length} errors`);

    const weapons = await this.syncWeapons();
    console.log(`Weapons: ${weapons.synced} synced, ${weapons.errors.length} errors`);

    const artifacts = await this.syncArtifacts();
    console.log(`Artifacts: ${artifacts.synced} synced, ${artifacts.errors.length} errors`);

    console.log('Sync complete!');
    return { characters, weapons, artifacts };
  }
}
