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
  private materialImageMap: Map<string, string> | null = null;

  // Map API talent type strings to our DB enum
  private normalizeTalentType(apiType: string): string {
    const map: Record<string, string> = {
      NORMAL_ATTACK: 'normal_attack',
      ELEMENTAL_SKILL: 'elemental_skill',
      ELEMENTAL_BURST: 'elemental_burst',
    };
    return map[apiType] || 'alternate_sprint';
  }

  // Parse base stats from ascension_data (last phase max stats)
  private parseBaseStats(ascensionData: Array<Record<string, string>> | undefined): {
    base_hp: number;
    base_atk: number;
    base_def: number;
    ascension_stat: string | null;
    ascension_stat_value: number | null;
  } {
    if (!ascensionData || ascensionData.length === 0) {
      return { base_hp: 0, base_atk: 0, base_def: 0, ascension_stat: null, ascension_stat_value: null };
    }

    // Last phase (max stats)
    const lastPhase = ascensionData[ascensionData.length - 1];
    const parseNum = (v: string | undefined) => {
      if (!v) return 0;
      return Math.round(parseFloat(v.replace(/,/g, '')) || 0);
    };

    // Find ascension stat (the stat key that isn't AscensionPhase/Level/BaseHP/BaseAtk/BaseDef)
    const knownKeys = ['AscensionPhase', 'Level', 'BaseHP', 'BaseAtk', 'BaseDef'];
    let ascStat: string | null = null;
    let ascValue: number | null = null;
    for (const key of Object.keys(lastPhase)) {
      if (!knownKeys.includes(key)) {
        ascStat = key;
        const rawVal = lastPhase[key];
        ascValue = rawVal ? parseFloat(rawVal.replace('%', '')) : null;
        break;
      }
    }

    return {
      base_hp: parseNum(lastPhase.BaseHP),
      base_atk: parseNum(lastPhase.BaseAtk),
      base_def: parseNum(lastPhase.BaseDef),
      ascension_stat: ascStat,
      ascension_stat_value: ascValue,
    };
  }

  /**
   * Build a map of material name → image URL by fetching all material categories.
   * Called once before character sync to enrich ascension_materials_data with images.
   */
  private async buildMaterialImageMap(): Promise<Map<string, string>> {
    if (this.materialImageMap) return this.materialImageMap;

    const map = new Map<string, string>();
    const categories = [
      'boss-material',
      'character-ascension',
      'common-ascension',
      'local-specialties',
      'talent-book',
      'talent-boss',
    ];

    for (const category of categories) {
      try {
        const res = await fetch(`${GENSHIN_API_BASE}/materials/${category}`);
        if (!res.ok) continue;
        const data = await res.json() as Record<string, unknown>;

        // Different categories have different structures
        if (category === 'local-specialties') {
          // { mondstadt: [{ id, name, ... }], liyue: [...], ... }
          for (const [, regionMats] of Object.entries(data)) {
            if (!Array.isArray(regionMats)) continue;
            for (const mat of regionMats) {
              if (mat.id && mat.name) {
                map.set(mat.name, `${GENSHIN_API_BASE}/materials/${category}/${mat.id}`);
              }
            }
          }
        } else if (category === 'character-ascension') {
          // { anemo: { sliver: { id, name }, fragment: {...} }, ... }
          for (const [, elementGems] of Object.entries(data)) {
            if (typeof elementGems !== 'object' || elementGems === null) continue;
            for (const [, gem] of Object.entries(elementGems as Record<string, unknown>)) {
              const g = gem as Record<string, unknown>;
              if (g.id && g.name) {
                map.set(g.name as string, `${GENSHIN_API_BASE}/materials/${category}/${g.id}`);
              }
            }
          }
        } else if (category === 'boss-material') {
          // { hurricane-seed: { name, source, ... }, ... }
          for (const [id, matObj] of Object.entries(data)) {
            const m = matObj as Record<string, unknown>;
            if (m.name && id !== 'id') {
              map.set(m.name as string, `${GENSHIN_API_BASE}/materials/${category}/${id}`);
            }
          }
        } else if (category === 'talent-boss') {
          // { azhdaha: { name, ... }, ... }
          for (const [id, matObj] of Object.entries(data)) {
            const m = matObj as Record<string, unknown>;
            if (m.name && id !== 'id') {
              map.set(m.name as string, `${GENSHIN_API_BASE}/materials/${category}/${id}`);
            }
          }
        } else {
          // common-ascension, talent-book: { groupKey: { items: [{ id, name }] } }
          for (const [, group] of Object.entries(data)) {
            if (typeof group !== 'object' || group === null) continue;
            const g = group as Record<string, unknown>;
            const items = g.items as Array<Record<string, unknown>> | undefined;
            if (items && Array.isArray(items)) {
              for (const item of items) {
                if (item.id && item.name) {
                  map.set(item.name as string, `${GENSHIN_API_BASE}/materials/${category}/${item.id}`);
                }
              }
            }
          }
        }
      } catch {
        // Silently skip failed categories
      }
    }

    this.materialImageMap = map;
    console.log(`Built material image map: ${map.size} materials`);
    return map;
  }

  /**
   * Sync all characters from Genshin.dev API (with talents, constellations, ascension data)
   */
  async syncCharacters(): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = [];
    let synced = 0;

    try {
      // Build material image lookup before syncing characters
      const matImageMap = await this.buildMaterialImageMap();

      // Get character list
      const listRes = await fetch(`${GENSHIN_API_BASE}/characters`);
      const characterNames: string[] = await listRes.json() as string[];

      for (const name of characterNames) {
        try {
          const res = await fetch(`${GENSHIN_API_BASE}/characters/${name}`);
          if (!res.ok) {
            errors.push(`Failed to fetch character: ${name}`);
            continue;
          }

          const data: any = await res.json();
          const slug = slugify(name);

          // Parse ascension data for base stats
          const ascensionData = data.ascension_materials?.ascension_data;
          const stats = this.parseBaseStats(ascensionData);

          const characterData: Record<string, unknown> = {
            slug,
            name_en: data.name || name,
            name_th: data.name || name, // Will need manual Thai translation
            rarity: data.rarity || 4,
            element: normalizeElement(data.vision || ''),
            weapon_type: normalizeWeaponType(data.weapon || ''),
            region: data.nation || null,
            base_hp: stats.base_hp,
            base_atk: stats.base_atk,
            base_def: stats.base_def,
            ascension_stat: stats.ascension_stat,
            ascension_stat_value: stats.ascension_stat_value,
            description: data.description || null,
            title: data.title || null,
            gender: data.gender || null,
            birthday: data.birthday || null,
            release_date: data.release || null,
            affiliation: data.affiliation || null,
            constellation_name: data.constellation || null,
            // Character images
            icon_url: `${GENSHIN_API_BASE}/characters/${name}/icon`,
            icon_big_url: `${GENSHIN_API_BASE}/characters/${name}/icon-big`,
            icon_side_url: `${GENSHIN_API_BASE}/characters/${name}/icon-side`,
            card_url: `${GENSHIN_API_BASE}/characters/${name}/card`,
            avatar_url: `${GENSHIN_API_BASE}/characters/${name}/portrait`,
            gacha_card_url: `${GENSHIN_API_BASE}/characters/${name}/gacha-card`,
            gacha_splash_url: `${GENSHIN_API_BASE}/characters/${name}/gacha-splash`,
            namecard_url: `${GENSHIN_API_BASE}/characters/${name}/namecard-background`,
            constellation_shape_url: `${GENSHIN_API_BASE}/characters/${name}/constellation-shape`,
          };

          // Store ascension data & materials as JSONB
          if (ascensionData) {
            characterData.ascension_data = ascensionData;
          }
          // Collect all ascension material levels (level_20, level_40, etc.) with image URLs
          if (data.ascension_materials) {
            const materialsOnly: Record<string, unknown> = {};
            for (const [key, val] of Object.entries(data.ascension_materials)) {
              if (key !== 'ascension_data') {
                // Enrich each material entry with image_url
                if (Array.isArray(val)) {
                  const enriched = (val as Array<{ name: string; value: number }>).map((mat) => ({
                    ...mat,
                    image_url: matImageMap.get(mat.name) || null,
                  }));
                  materialsOnly[key] = enriched;
                } else {
                  materialsOnly[key] = val;
                }
              }
            }
            if (Object.keys(materialsOnly).length > 0) {
              characterData.ascension_materials_data = materialsOnly;
            }
          }

          // Upsert character
          const { data: upsertedChar, error } = await this.supabase
            .from('characters')
            .upsert(characterData, { onConflict: 'slug' })
            .select('id')
            .single();

          if (error || !upsertedChar) {
            errors.push(`DB error for ${name}: ${error?.message || 'no data returned'}`);
            continue;
          }

          const characterId = upsertedChar.id;

          // ========== Sync Talents ==========
          // Delete existing talents for this character (clean sync)
          await this.supabase.from('talents').delete().eq('character_id', characterId);

          // Map talent type to image name
          const talentImageMap: Record<string, string> = {
            normal_attack: 'talent-na',
            elemental_skill: 'talent-skill',
            elemental_burst: 'talent-burst',
            alternate_sprint: 'talent-passive-misc',
          };

          // Skill talents (normal attack, elemental skill, elemental burst, alternate sprint)
          if (data.skillTalents && Array.isArray(data.skillTalents)) {
            for (const talent of data.skillTalents) {
              const talentType = this.normalizeTalentType(talent.type || '');
              const imageName = talentImageMap[talentType] || 'talent-na';

              const talentData = {
                character_id: characterId,
                type: talentType,
                name_en: talent.name || '',
                name_th: talent.name || '',
                description_en: talent.description || null,
                description_th: null,
                scaling: talent.upgrades || null,
                icon_url: `${GENSHIN_API_BASE}/characters/${name}/${imageName}`,
              };

              const { error: talentError } = await this.supabase
                .from('talents')
                .insert(talentData);

              if (talentError) {
                errors.push(`Talent error for ${name}/${talent.name}: ${talentError.message}`);
              }
            }
          }

          // Passive talents
          if (data.passiveTalents && Array.isArray(data.passiveTalents)) {
            for (let i = 0; i < data.passiveTalents.length; i++) {
              const passive = data.passiveTalents[i];
              const passiveType = `passive_${i + 1}`;

              const passiveData = {
                character_id: characterId,
                type: passiveType,
                name_en: passive.name || '',
                name_th: passive.name || '',
                description_en: passive.description || null,
                description_th: null,
                scaling: null,
                icon_url: `${GENSHIN_API_BASE}/characters/${name}/talent-passive-${i}`,
              };

              const { error: passiveError } = await this.supabase
                .from('talents')
                .insert(passiveData);

              if (passiveError) {
                errors.push(`Passive error for ${name}/${passive.name}: ${passiveError.message}`);
              }
            }
          }

          // ========== Sync Constellations ==========
          if (data.constellations && Array.isArray(data.constellations)) {
            for (const constellation of data.constellations) {
              const level = constellation.level || 1;
              const constData = {
                character_id: characterId,
                level,
                name_en: constellation.name || '',
                name_th: constellation.name || '',
                description_en: constellation.description || null,
                description_th: null,
                icon_url: `${GENSHIN_API_BASE}/characters/${name}/constellation-${level}`,
              };

              const { error: constError } = await this.supabase
                .from('constellations')
                .upsert(constData, { onConflict: 'character_id,level' });

              if (constError) {
                errors.push(`Constellation error for ${name}/${constellation.name}: ${constError.message}`);
              }
            }
          }

          synced++;

          // Rate limiting
          await new Promise((resolve) => setTimeout(resolve, 300));
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
      const weaponNames: string[] = await listRes.json() as string[];

      for (const name of weaponNames) {
        try {
          const res = await fetch(`${GENSHIN_API_BASE}/weapons/${name}`);
          if (!res.ok) {
            errors.push(`Failed to fetch weapon: ${name}`);
            continue;
          }

          const data: any = await res.json();
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
      const artifactNames: string[] = await listRes.json() as string[];

      for (const name of artifactNames) {
        try {
          const res = await fetch(`${GENSHIN_API_BASE}/artifacts/${name}`);
          if (!res.ok) {
            errors.push(`Failed to fetch artifact: ${name}`);
            continue;
          }

          const data: any = await res.json();
          const slug = slugify(name);

          // Determine icon & available pieces
          let iconPiece = 'flower-of-life';
          let availablePieces: string[] = ['flower', 'plume', 'sands', 'goblet', 'circlet'];
          const apiToPiece: Record<string, string> = {
            'flower-of-life': 'flower',
            'plume-of-death': 'plume',
            'sands-of-eon': 'sands',
            'goblet-of-eonothem': 'goblet',
            'circlet-of-logos': 'circlet',
          };
          try {
            const piecesRes = await fetch(`${GENSHIN_API_BASE}/artifacts/${name}/list`);
            if (piecesRes.ok) {
              const rawPieces: string[] = await piecesRes.json() as string[];
              if (rawPieces.length > 0) {
                availablePieces = rawPieces.map(p => apiToPiece[p] || p).filter(Boolean);
                if (!rawPieces.includes('flower-of-life')) {
                  iconPiece = rawPieces[0];
                }
              }
            }
          } catch {
            // Use defaults
          }

          const artifactData = {
            slug,
            name_en: data.name || name,
            name_th: data.name || name,
            max_rarity: data.max_rarity || 5,
            bonus_2pc_en: data['2-piece_bonus'] || null,
            bonus_4pc_en: data['4-piece_bonus'] || null,
            icon_url: `${GENSHIN_API_BASE}/artifacts/${name}/${iconPiece}`,
            pieces: availablePieces,
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
