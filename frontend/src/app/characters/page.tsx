// =============================================
// PaimonGuide TH - Characters List Page
// =============================================

import type { Metadata } from 'next';
import { CharactersPageClient } from './characters-client';

export const metadata: Metadata = {
  title: 'ตัวละคร - รายการตัวละครทั้งหมด',
  description: 'รายการตัวละครทั้งหมดใน Genshin Impact พร้อมตัวกรอง ธาตุ, ประเภทอาวุธ, และระดับดาว',
};

export default function CharactersPage() {
  return <CharactersPageClient />;
}
