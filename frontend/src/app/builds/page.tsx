// =============================================
// PaimonGuide TH - Builds Page
// =============================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/common/page-header';

export const metadata: Metadata = {
  title: 'Build แนะนำ - คู่มือ Build ตัวละคร',
  description: 'คู่มือ Build ตัวละคร Genshin Impact ภาษาไทย พร้อมอาวุธ, Artifacts, และ Team Composition แนะนำ',
};

export default function BuildsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Build แนะนำ"
        description="คู่มือ Build ตัวละครภาษาไทย พร้อมอาวุธ, Artifacts, และ Team Composition แนะนำ"
      />

      {/* Placeholder - will be filled with actual build data */}
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center max-w-md">
          <span className="text-6xl mb-4 block">🏗️</span>
          <h3 className="text-lg font-semibold text-white mb-2">กำลังพัฒนา</h3>
          <p className="text-sm text-gray-400 mb-4">
            ส่วน Build แนะนำกำลังอยู่ในระหว่างการพัฒนา กรุณากลับมาเร็วๆ นี้
          </p>
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium rounded-lg transition-colors"
          >
            ดูตัวละครทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  );
}
