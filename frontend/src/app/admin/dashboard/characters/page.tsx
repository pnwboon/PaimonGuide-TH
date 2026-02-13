// =============================================
// PaimonGuide TH - Character List (Admin)
// =============================================
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Trash2, Loader2, AlertTriangle, ChevronDown } from 'lucide-react';
import type { Character, Element, WeaponType } from '@/types/character';

const ELEMENTS: Element[] = ['Pyro', 'Hydro', 'Cryo', 'Electro', 'Anemo', 'Geo', 'Dendro'];
const WEAPONS: WeaponType[] = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];

const ELEMENT_COLORS: Record<string, string> = {
  Pyro: 'text-red-400',
  Hydro: 'text-blue-400',
  Cryo: 'text-cyan-300',
  Electro: 'text-purple-400',
  Anemo: 'text-teal-400',
  Geo: 'text-yellow-400',
  Dendro: 'text-green-400',
};

export default function AdminCharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterElement, setFilterElement] = useState('');
  const [filterWeapon, setFilterWeapon] = useState('');
  const [filterRarity, setFilterRarity] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/characters');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin');
          return;
        }
        throw new Error('Failed to fetch');
      }
      const { data } = await res.json();
      setCharacters(data || []);
    } catch {
      setError('ไม่สามารถโหลดข้อมูลตัวละครได้');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/characters?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setCharacters((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirm(null);
    } catch {
      setError('ไม่สามารถลบตัวละครได้');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = useMemo(() => {
    return characters.filter((c) => {
      const matchSearch =
        !search ||
        c.name_en.toLowerCase().includes(search.toLowerCase()) ||
        c.name_th?.toLowerCase().includes(search.toLowerCase());
      const matchElement = !filterElement || c.element === filterElement;
      const matchWeapon = !filterWeapon || c.weapon_type === filterWeapon;
      const matchRarity = !filterRarity || c.rarity === Number(filterRarity);
      return matchSearch && matchElement && matchWeapon && matchRarity;
    });
  }, [characters, search, filterElement, filterWeapon, filterRarity]);

  // Data completeness indicator
  const completeness = (c: Character) => {
    let score = 0;
    const total = 8;
    if (c.name_th) score++;
    if (c.description) score++;
    if (c.icon_url) score++;
    if (c.gacha_splash_url) score++;
    if (c.base_hp && c.base_hp > 0) score++;
    if (c.ascension_data && Array.isArray(c.ascension_data) && c.ascension_data.length > 0) score++;
    if (c.cv_jp) score++;
    if (c.version) score++;
    const pct = Math.round((score / total) * 100);
    return { score, total, pct };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">จัดการตัวละคร</h1>
          <p className="text-gray-400 text-sm mt-1">{characters.length} ตัวละคร</p>
        </div>
        <Link
          href="/admin/dashboard/characters/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          เพิ่มตัวละครใหม่
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="ค้นหาตัวละคร..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="relative">
            <select
              value={filterElement}
              onChange={(e) => setFilterElement(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="">ธาตุทั้งหมด</option>
              {ELEMENTS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterWeapon}
              onChange={(e) => setFilterWeapon(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="">อาวุธทั้งหมด</option>
              {WEAPONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="">ดาวทั้งหมด</option>
              <option value="5">★★★★★</option>
              <option value="4">★★★★</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Character table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800 uppercase tracking-wider">
                <th className="text-left py-3 px-4">ตัวละคร</th>
                <th className="text-left py-3 px-4 hidden md:table-cell">ธาตุ</th>
                <th className="text-left py-3 px-4 hidden md:table-cell">อาวุธ</th>
                <th className="text-left py-3 px-4 hidden sm:table-cell">ดาว</th>
                <th className="text-left py-3 px-4 hidden lg:table-cell">ข้อมูลครบ</th>
                <th className="text-left py-3 px-4 w-20">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map((char) => {
                const comp = completeness(char);
                return (
                  <tr key={char.id} className="hover:bg-gray-800/50 transition-colors group">
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/dashboard/characters/${char.id}`}
                        className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors"
                      >
                        {char.icon_url ? (
                          <img
                            src={char.icon_url}
                            alt={char.name_en}
                            className="h-10 w-10 rounded-lg bg-gray-800 object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-600 shrink-0">
                            ?
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {char.name_th || char.name_en}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{char.name_en}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span
                        className={`text-sm ${ELEMENT_COLORS[char.element] || 'text-gray-400'}`}
                      >
                        {char.element}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-gray-400">{char.weapon_type}</span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-sm text-amber-400">{'★'.repeat(char.rarity)}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              comp.pct >= 80
                                ? 'bg-green-500'
                                : comp.pct >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${comp.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{comp.pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {deleteConfirm === char.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(char.id)}
                            disabled={deleting === char.id}
                            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                          >
                            {deleting === char.id ? '...' : 'ยืนยัน'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(char.id)}
                          className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="ลบ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    {search || filterElement || filterWeapon || filterRarity
                      ? 'ไม่พบตัวละครที่ตรงกับตัวกรอง'
                      : 'ยังไม่มีข้อมูลตัวละคร'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
