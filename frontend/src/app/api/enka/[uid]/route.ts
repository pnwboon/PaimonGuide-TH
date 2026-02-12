// =============================================
// PaimonGuide TH - Enka.Network API Proxy
// =============================================

import { NextResponse } from 'next/server';
import { parseEnkaResponse } from '@/lib/enka-parser';
import type { EnkaResponse } from '@/types/enka';

interface RouteParams {
  params: Promise<{ uid: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { uid } = await params;

  // Validate UID format (9 digits, starts with 6/7/8/9/1/2)
  if (!/^\d{9,10}$/.test(uid)) {
    return NextResponse.json(
      { error: 'รูปแบบ UID ไม่ถูกต้อง (ต้องเป็นตัวเลข 9-10 หลัก)' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://enka.network/api/uid/${uid}/`, {
      headers: {
        'User-Agent': 'PaimonGuideTH/1.0',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const statusMessages: Record<number, string> = {
        400: 'รูปแบบ UID ไม่ถูกต้อง',
        404: 'ไม่พบผู้เล่น UID นี้',
        424: 'เซิร์ฟเวอร์เกมกำลังปิดปรับปรุง',
        429: 'คำขอมากเกินไป กรุณารอสักครู่',
        500: 'เซิร์ฟเวอร์ Enka ขัดข้อง',
      };

      return NextResponse.json(
        { error: statusMessages[res.status] || `ข้อผิดพลาด: ${res.status}` },
        { status: res.status }
      );
    }

    const raw: EnkaResponse = await res.json();
    const parsed = await parseEnkaResponse(raw);

    return NextResponse.json(parsed, {
      headers: {
        'Cache-Control': `public, s-maxage=${raw.ttl || 60}, stale-while-revalidate=30`,
      },
    });
  } catch (err) {
    console.error('Enka API error:', err);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ Enka.Network' },
      { status: 500 }
    );
  }
}
