// =============================================
// PaimonGuide TH - Admin Shell (Sidebar + Layout)
// =============================================
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Users, LogOut, Menu, X, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/characters', label: 'ตัวละคร', icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gray-900 border-r border-gray-800 flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <span className="text-2xl">✦</span>
              <div>
                <h1 className="font-bold text-amber-400 text-sm">PaimonGuide TH</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Admin Panel</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors group
                  ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }
                `}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-amber-500/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? 'กำลังออก...' : 'ออกจากระบบ'}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm flex items-center px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white mr-4"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Breadcrumbs pathname={pathname} />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

function Breadcrumbs({ pathname }: { pathname: string }) {
  const parts = pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];

  let currentPath = '';
  for (const part of parts) {
    currentPath += `/${part}`;
    let label = part;
    if (part === 'admin') label = 'Admin';
    else if (part === 'dashboard') label = 'Dashboard';
    else if (part === 'characters') label = 'ตัวละคร';
    else label = decodeURIComponent(part);

    breadcrumbs.push({ label, href: currentPath });
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      {breadcrumbs.map((bc, i) => (
        <span key={bc.href} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="h-3 w-3 text-gray-600" />}
          {i === breadcrumbs.length - 1 ? (
            <span className="text-gray-200">{bc.label}</span>
          ) : (
            <Link href={bc.href} className="hover:text-white transition-colors">
              {bc.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
