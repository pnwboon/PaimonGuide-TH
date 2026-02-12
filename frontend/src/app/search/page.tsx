// =============================================
// PaimonGuide TH - Search Page
// =============================================

import type { Metadata } from 'next';
import { SearchPageClient } from './search-client';

export const metadata: Metadata = {
  title: 'ค้นหา',
  description: 'ค้นหาตัวละคร, อาวุธ, Artifacts และข้อมูลอื่นๆ ใน Genshin Impact',
};

export default function SearchPage() {
  return <SearchPageClient />;
}
