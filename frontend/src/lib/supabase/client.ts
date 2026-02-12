// =============================================
// PaimonGuide TH - Supabase Browser Client
// =============================================
// ใช้สำหรับ Client Components (CSR)
// ใช้ ANON KEY เท่านั้น (ปลอดภัย เปิดเผยได้)

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
