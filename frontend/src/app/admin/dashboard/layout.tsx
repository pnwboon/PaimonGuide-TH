// =============================================
// PaimonGuide TH - Admin Dashboard Layout
// =============================================
// Wraps all /admin/dashboard/* pages with the admin shell

import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/admin-auth';
import { AdminShell } from '../components/admin-shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    redirect('/admin');
  }

  return <AdminShell>{children}</AdminShell>;
}
