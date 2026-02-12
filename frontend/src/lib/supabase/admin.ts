// =============================================
// PaimonGuide TH - Supabase Admin Client
// =============================================
// !! อันตราย !! ใช้เฉพาะ Server-side เท่านั้น
// ใช้ SERVICE_ROLE_KEY (ห้ามเปิดเผยโดยเด็ดขาด)
// ใช้สำหรับ admin operations: sync data, seed, migrations

import { createClient } from '@supabase/supabase-js';

/**
 * Admin client - ใช้สำหรับ server-side operations เท่านั้น
 * ข้าม RLS policies ทั้งหมด
 * ห้ามใช้ใน client components โดยเด็ดขาด
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. ' +
      'Admin client can only be used server-side.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
