// =============================================
// PaimonGuide TH - Admin Login Page
// =============================================

import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/admin-auth';
import { AdminLoginForm } from './login-form';

export default async function AdminPage() {
  const isAdmin = await verifyAdminSession();
  if (isAdmin) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">✦</span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
            PaimonGuide TH
          </h1>
          <p className="text-gray-400 mt-2">Admin Panel</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
