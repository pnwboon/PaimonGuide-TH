// =============================================
// PaimonGuide TH - Weapons Page Client
// =============================================
'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { PageLoading } from '@/components/common/loading-spinner';
import { ErrorDisplay } from '@/components/common/error-display';
import { EmptyState } from '@/components/common/empty-state';
import { WeaponCard } from '@/components/weapons/weapon-card';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { RARITIES } from '@/config/constants';
import type { Weapon } from '@/types';

async function fetchWeapons(): Promise<Weapon[]> {
  const res = await fetch('/api/weapons');
  if (!res.ok) throw new Error('Failed to fetch weapons');
  const json = await res.json();
  return json.data || [];
}

export function WeaponsPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedRarity, setSelectedRarity] = useState<number | undefined>();

  const { data: weapons = [], isLoading, error, refetch } = useQuery({
    queryKey: ['weapons'],
    queryFn: fetchWeapons,
  });

  const filteredWeapons = useMemo(() => {
    return weapons.filter((weapon) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !weapon.name_en.toLowerCase().includes(q) &&
          !weapon.name_th.includes(q)
        ) {
          return false;
        }
      }
      if (selectedType && weapon.type !== selectedType) return false;
      if (selectedRarity && weapon.rarity !== selectedRarity) return false;
      return true;
    });
  }, [weapons, searchQuery, selectedType, selectedRarity]);

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorDisplay onRetry={() => refetch()} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="อาวุธทั้งหมด"
        description="รายการอาวุธใน Genshin Impact พร้อมสถิติ, Passive Effect, และ Refinement"
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่ออาวุธ..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Weapon Type */}
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">ประเภท</h4>
          <div className="flex flex-wrap gap-2">
            {siteConfig.weaponTypes.map((wt) => (
              <button
                key={wt.key}
                onClick={() => setSelectedType(selectedType === wt.key ? undefined : wt.key)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
                  selectedType === wt.key
                    ? 'bg-white/20 text-white ring-1 ring-white/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                )}
              >
                {wt.icon} {wt.nameTh}
              </button>
            ))}
          </div>
        </div>
        {/* Rarity */}
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">ระดับดาว</h4>
          <div className="flex gap-2">
            {RARITIES.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRarity(selectedRarity === r ? undefined : r)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
                  selectedRarity === r
                    ? 'bg-white/20 text-white ring-1 ring-white/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                )}
              >
                {'★'.repeat(r)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        แสดง {filteredWeapons.length} จาก {weapons.length} อาวุธ
      </p>

      {filteredWeapons.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredWeapons.map((weapon) => (
            <WeaponCard key={weapon.id} weapon={weapon} />
          ))}
        </div>
      ) : (
        <EmptyState title="ไม่พบอาวุธ" message="ลองเปลี่ยนตัวกรองหรือคำค้นหาใหม่" />
      )}
    </div>
  );
}
