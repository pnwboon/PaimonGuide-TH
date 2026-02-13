// =============================================
// PaimonGuide TH - Admin Login API
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createAdminSession, setAdminCookie } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'กรุณาใส่รหัสผ่าน' }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      // Delay to prevent brute force
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json({ error: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    const token = await createAdminSession();
    await setAdminCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
