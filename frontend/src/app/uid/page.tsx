// =============================================
// PaimonGuide TH - UID Lookup Page
// =============================================

import type { Metadata } from 'next';
import { UidLookupClient } from './uid-lookup-client';

export const metadata: Metadata = {
  title: 'ค้นหาผู้เล่น - ดูข้อมูล Showcase จาก UID',
  description:
    'ค้นหาข้อมูลผู้เล่น Genshin Impact จาก UID ดูตัวละคร สเตตัส อาวุธ Artifacts ที่ตั้งไว้ใน Showcase ผ่าน Enka.Network',
};

export default function UidLookupPage() {
  return <UidLookupClient />;
}
