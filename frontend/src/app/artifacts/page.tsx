// =============================================
// PaimonGuide TH - Artifacts List Page
// =============================================

import type { Metadata } from 'next';
import { ArtifactsPageClient } from './artifacts-client';

export const metadata: Metadata = {
  title: 'Artifacts - รายการ Artifact Sets ทั้งหมด',
  description: 'รายการชุด Artifact ทั้งหมดใน Genshin Impact พร้อม Set Bonus และคำแนะนำ',
};

export default function ArtifactsPage() {
  return <ArtifactsPageClient />;
}
