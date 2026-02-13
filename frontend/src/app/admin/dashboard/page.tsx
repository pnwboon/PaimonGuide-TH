// =============================================
// PaimonGuide TH - Admin Dashboard Page
// =============================================

import { createAdminClient } from '@/lib/supabase/admin';
import { Users, ScrollText, Star, Database } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  // Fetch counts in parallel
  const [charResult, talentResult, constResult] = await Promise.all([
    supabase.from('characters').select('id', { count: 'exact', head: true }),
    supabase.from('talents').select('id', { count: 'exact', head: true }),
    supabase.from('constellations').select('id', { count: 'exact', head: true }),
  ]);

  const stats = [
    {
      label: 'ตัวละครทั้งหมด',
      value: charResult.count ?? 0,
      icon: Users,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      href: '/admin/dashboard/characters',
    },
    {
      label: 'Talents',
      value: talentResult.count ?? 0,
      icon: Star,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      href: '/admin/dashboard/characters',
    },
    {
      label: 'Constellations',
      value: constResult.count ?? 0,
      icon: ScrollText,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      href: '/admin/dashboard/characters',
    },
  ];

  // Recently updated characters
  const { data: recentChars } = await supabase
    .from('characters')
    .select('id, name_th, name_en, element, rarity, icon_url, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">ภาพรวมข้อมูลทั้งหมดในระบบ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/dashboard/characters/new"
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-amber-500/30 transition-colors flex items-center gap-4"
        >
          <div className="p-2.5 bg-green-500/10 rounded-lg">
            <Database className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-white">เพิ่มตัวละครใหม่</p>
            <p className="text-xs text-gray-500">สร้างข้อมูลตัวละครใหม่ในฐานข้อมูล</p>
          </div>
        </Link>
        <Link
          href="/admin/dashboard/characters"
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-amber-500/30 transition-colors flex items-center gap-4"
        >
          <div className="p-2.5 bg-blue-500/10 rounded-lg">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-white">จัดการตัวละคร</p>
            <p className="text-xs text-gray-500">แก้ไข เพิ่ม ลบข้อมูลตัวละครทั้งหมด</p>
          </div>
        </Link>
      </div>

      {/* Recent updates */}
      {recentChars && recentChars.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">อัปเดตล่าสุด</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-800">
                  <th className="text-left py-3 px-4">ตัวละคร</th>
                  <th className="text-left py-3 px-4 hidden sm:table-cell">ธาตุ</th>
                  <th className="text-left py-3 px-4 hidden sm:table-cell">ดาว</th>
                  <th className="text-left py-3 px-4">อัปเดตล่าสุด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {recentChars.map((char) => (
                  <tr key={char.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/dashboard/characters/${char.id}`}
                        className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors"
                      >
                        {char.icon_url ? (
                          <img
                            src={char.icon_url}
                            alt={char.name_en}
                            className="h-8 w-8 rounded-lg bg-gray-800 object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                            ?
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{char.name_th || char.name_en}</p>
                          <p className="text-xs text-gray-500">{char.name_en}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-xs text-gray-400">{char.element || '-'}</span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-xs text-amber-400">{'★'.repeat(char.rarity || 0)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-gray-500">
                        {char.updated_at
                          ? new Date(char.updated_at).toLocaleDateString('th-TH', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
