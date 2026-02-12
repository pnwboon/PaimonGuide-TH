// =============================================
// PaimonGuide TH - Seed Data Script
// =============================================
// รัน: npx tsx backend/scripts/seed-data.ts
// ต้องตั้งค่า environment variables ก่อนรัน

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('ตั้งค่า environment variables ก่อนรัน seed script');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// =============================================
// Sample Seed Data (ตัวละคร 5 ดาวยอดนิยม)
// =============================================

const sampleCharacters = [
  {
    slug: 'hu-tao',
    name_en: 'Hu Tao',
    name_th: 'หูเถา',
    rarity: 5,
    element: 'Pyro',
    weapon_type: 'Polearm',
    region: 'Liyue',
    base_hp: 15552,
    base_atk: 106,
    base_def: 876,
    ascension_stat: 'Crit DMG%',
    ascension_stat_value: 38.4,
    description: 'ผู้อำนวยการที่ 77 ของสถานจัดพิธีศพ ว่างสือ',
  },
  {
    slug: 'raiden-shogun',
    name_en: 'Raiden Shogun',
    name_th: 'ไรเดน โชกุน',
    rarity: 5,
    element: 'Electro',
    weapon_type: 'Polearm',
    region: 'Inazuma',
    base_hp: 12907,
    base_atk: 337,
    base_def: 789,
    ascension_stat: 'Energy Recharge%',
    ascension_stat_value: 32.0,
    description: 'โชกุนแห่งอินาซึมะ ผู้ครองสายฟ้านิรันดร์',
  },
  {
    slug: 'zhongli',
    name_en: 'Zhongli',
    name_th: 'จงหลี',
    rarity: 5,
    element: 'Geo',
    weapon_type: 'Polearm',
    region: 'Liyue',
    base_hp: 14695,
    base_atk: 251,
    base_def: 738,
    ascension_stat: 'Geo DMG Bonus%',
    ascension_stat_value: 28.8,
    description: 'ที่ปรึกษามากความสามารถของสถานจัดพิธีศพ ว่างสือ',
  },
  {
    slug: 'kazuha',
    name_en: 'Kaedehara Kazuha',
    name_th: 'คาเอเดฮาระ คาซึฮะ',
    rarity: 5,
    element: 'Anemo',
    weapon_type: 'Sword',
    region: 'Inazuma',
    base_hp: 13348,
    base_atk: 297,
    base_def: 807,
    ascension_stat: 'Elemental Mastery',
    ascension_stat_value: 115.2,
    description: 'ซามูไรพเนจรจากอินาซึมะ',
  },
  {
    slug: 'nahida',
    name_en: 'Nahida',
    name_th: 'นาฮิดา',
    rarity: 5,
    element: 'Dendro',
    weapon_type: 'Catalyst',
    region: 'Sumeru',
    base_hp: 10360,
    base_atk: 299,
    base_def: 630,
    ascension_stat: 'Elemental Mastery',
    ascension_stat_value: 115.2,
    description: 'เทพเจ้าแห่งปัญญาผู้ครองสุเมรุ',
  },
];

const sampleWeapons = [
  {
    slug: 'staff-of-homa',
    name_en: 'Staff of Homa',
    name_th: 'คทาโฮมา',
    rarity: 5,
    type: 'Polearm',
    base_atk: 608,
    secondary_stat: 'Crit DMG%',
    secondary_stat_value: 66.2,
    passive_name_en: 'Reckless Cinnabar',
    passive_name_th: 'ชาดอันบ้าคลั่ง',
    passive_description_en: 'HP increased by 20%. Additionally, provides an ATK Bonus based on 0.8% of the wielder\'s Max HP.',
    passive_description_th: 'เพิ่ม HP 20% นอกจากนี้ยังเพิ่มพลังโจมตีตาม 0.8% ของ HP สูงสุด',
    obtain_method: 'Gacha',
  },
  {
    slug: 'engulfing-lightning',
    name_en: 'Engulfing Lightning',
    name_th: 'สายฟ้าเผาผลาญ',
    rarity: 5,
    type: 'Polearm',
    base_atk: 608,
    secondary_stat: 'Energy Recharge%',
    secondary_stat_value: 55.1,
    passive_name_en: 'Timeless Dream: Eternal Stove',
    passive_name_th: 'ความฝันนิรันดร์: เตาไฟอมตะ',
    obtain_method: 'Gacha',
  },
  {
    slug: 'the-catch',
    name_en: 'The Catch',
    name_th: 'คันเบ็ดจับปลา',
    rarity: 4,
    type: 'Polearm',
    base_atk: 510,
    secondary_stat: 'Energy Recharge%',
    secondary_stat_value: 45.9,
    passive_name_en: 'Shanty',
    passive_name_th: 'เพลงชาวเรือ',
    obtain_method: 'Fishing',
  },
];

const sampleArtifacts = [
  {
    slug: 'crimson-witch-of-flames',
    name_en: 'Crimson Witch of Flames',
    name_th: 'แม่มดเพลิงสีแดงเข้ม',
    max_rarity: 5,
    bonus_2pc_en: 'Pyro DMG Bonus +15%',
    bonus_2pc_th: 'โบนัสความเสียหาย Pyro +15%',
    bonus_4pc_en: 'Increases Overloaded and Burning DMG by 40%. Increases Vaporize and Melt DMG by 15%.',
    bonus_4pc_th: 'เพิ่มความเสียหาย Overloaded และ Burning 40% เพิ่มความเสียหาย Vaporize และ Melt 15%',
    pieces: ['flower', 'plume', 'sands', 'goblet', 'circlet'],
  },
  {
    slug: 'emblem-of-severed-fate',
    name_en: 'Emblem of Severed Fate',
    name_th: 'ตราประทับแห่งชะตากรรมที่ถูกตัดขาด',
    max_rarity: 5,
    bonus_2pc_en: 'Energy Recharge +20%',
    bonus_2pc_th: 'ฟื้นฟูพลังงาน +20%',
    bonus_4pc_en: 'Increases Elemental Burst DMG by 25% of Energy Recharge. A maximum of 75% bonus DMG can be obtained.',
    bonus_4pc_th: 'เพิ่มความเสียหายท่าไม้ตายธาตุ 25% ของฟื้นฟูพลังงาน สูงสุด 75%',
    pieces: ['flower', 'plume', 'sands', 'goblet', 'circlet'],
  },
  {
    slug: 'viridescent-venerer',
    name_en: 'Viridescent Venerer',
    name_th: 'นักล่าเขียวมรกต',
    max_rarity: 5,
    bonus_2pc_en: 'Anemo DMG Bonus +15%',
    bonus_2pc_th: 'โบนัสความเสียหาย Anemo +15%',
    bonus_4pc_en: 'Increases Swirl DMG by 60%. Decreases opponent\'s Elemental RES to the element infused in the Swirl by 40% for 10s.',
    bonus_4pc_th: 'เพิ่มความเสียหาย Swirl 60% ลดค่าต้านทานธาตุของศัตรูตามธาตุที่ Swirl 40% เป็นเวลา 10 วินาที',
    pieces: ['flower', 'plume', 'sands', 'goblet', 'circlet'],
  },
];

async function seed() {
  console.log('🌱 เริ่มต้น Seed Data...\n');

  // Seed Characters
  console.log('📋 กำลัง seed ตัวละคร...');
  const { error: charError } = await supabase
    .from('characters')
    .upsert(sampleCharacters, { onConflict: 'slug' });

  if (charError) {
    console.error('❌ Character seed error:', charError.message);
  } else {
    console.log(`✅ Seed ตัวละคร ${sampleCharacters.length} ตัว สำเร็จ`);
  }

  // Seed Weapons
  console.log('⚔️ กำลัง seed อาวุธ...');
  const { error: weapError } = await supabase
    .from('weapons')
    .upsert(sampleWeapons, { onConflict: 'slug' });

  if (weapError) {
    console.error('❌ Weapon seed error:', weapError.message);
  } else {
    console.log(`✅ Seed อาวุธ ${sampleWeapons.length} อัน สำเร็จ`);
  }

  // Seed Artifacts
  console.log('🏺 กำลัง seed artifacts...');
  const { error: artError } = await supabase
    .from('artifacts')
    .upsert(sampleArtifacts, { onConflict: 'slug' });

  if (artError) {
    console.error('❌ Artifact seed error:', artError.message);
  } else {
    console.log(`✅ Seed artifacts ${sampleArtifacts.length} ชิ้น สำเร็จ`);
  }

  console.log('\n🎉 Seed data เสร็จสิ้น!');
}

seed().catch(console.error);
