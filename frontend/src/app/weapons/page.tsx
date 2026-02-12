// =============================================
// PaimonGuide TH - Weapons List Page
// =============================================

import type { Metadata } from 'next';
import { WeaponsPageClient } from './weapons-client';

export const metadata: Metadata = {
  title: 'อาวุธ - รายการอาวุธทั้งหมด',
  description: 'รายการอาวุธทั้งหมดใน Genshin Impact พร้อมสถิติ, Passive Effect, และ Refinement',
};

export default function WeaponsPage() {
  return <WeaponsPageClient />;
}
