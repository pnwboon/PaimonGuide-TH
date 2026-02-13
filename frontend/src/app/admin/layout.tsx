// =============================================
// PaimonGuide TH - Admin Layout
// =============================================
// Layout แยกจากหน้าเว็บหลัก (ไม่มี Header/Footer)

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | PaimonGuide TH',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-950 text-gray-100">{children}</div>;
}
