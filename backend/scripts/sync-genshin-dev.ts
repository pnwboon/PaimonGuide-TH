// =============================================
// PaimonGuide TH - Sync Script
// =============================================
// รัน: npx tsx backend/scripts/sync-genshin-dev.ts
// ต้องตั้งค่า environment variables ก่อนรัน

import { SyncService } from '../services/sync.service';

async function main() {
  console.log('🔄 เริ่มต้น sync ข้อมูลจาก Genshin.dev API...\n');

  const syncService = new SyncService();
  const results = await syncService.syncAll();

  console.log('\n========== สรุปผล ==========');
  console.log(`ตัวละคร: ${results.characters.synced} synced, ${results.characters.errors.length} errors`);
  console.log(`อาวุธ: ${results.weapons.synced} synced, ${results.weapons.errors.length} errors`);
  console.log(`Artifacts: ${results.artifacts.synced} synced, ${results.artifacts.errors.length} errors`);

  // Print errors if any
  const allErrors = [
    ...results.characters.errors,
    ...results.weapons.errors,
    ...results.artifacts.errors,
  ];

  if (allErrors.length > 0) {
    console.log('\n========== Errors ==========');
    allErrors.forEach((err) => console.error(`  ❌ ${err}`));
  }
}

main().catch(console.error);
