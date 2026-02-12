// =============================================
// PaimonGuide TH - Characters Page Client
// =============================================
'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { PageLoading } from '@/components/common/loading-spinner';
import { ErrorDisplay } from '@/components/common/error-display';
import { EmptyState } from '@/components/common/empty-state';
import { CharacterCard } from '@/components/characters/character-card';
import { CharacterFilter } from '@/components/characters/character-filter';
import type { Character } from '@/types';

async function fetchCharacters(): Promise<Character[]> {
  const res = await fetch('/api/characters?pageSize=500');
  if (!res.ok) throw new Error('Failed to fetch characters');
  const json = await res.json();
  return json.data || [];
}

export function CharactersPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<string | undefined>();
  const [selectedWeaponType, setSelectedWeaponType] = useState<string | undefined>();
  const [selectedRarity, setSelectedRarity] = useState<number | undefined>();

  const { data: characters = [], isLoading, error, refetch } = useQuery({
    queryKey: ['characters'],
    queryFn: fetchCharacters,
  });

  // Filter characters
  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !char.name_en.toLowerCase().includes(q) &&
          !char.name_th.includes(q)
        ) {
          return false;
        }
      }
      // Element filter
      if (selectedElement && char.element !== selectedElement) return false;
      // Weapon filter
      if (selectedWeaponType && char.weapon_type !== selectedWeaponType) return false;
      // Rarity filter
      if (selectedRarity && char.rarity !== selectedRarity) return false;
      return true;
    });
  }, [characters, searchQuery, selectedElement, selectedWeaponType, selectedRarity]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedElement(undefined);
    setSelectedWeaponType(undefined);
    setSelectedRarity(undefined);
  };

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorDisplay onRetry={() => refetch()} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="ตัวละครทั้งหมด"
        description="รายการตัวละครใน Genshin Impact พร้อม Build แนะนำและข้อมูลสถิติ"
      />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อตัวละคร..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Filters */}
      <CharacterFilter
        selectedElement={selectedElement}
        selectedWeaponType={selectedWeaponType}
        selectedRarity={selectedRarity}
        onElementChange={setSelectedElement}
        onWeaponTypeChange={setSelectedWeaponType}
        onRarityChange={setSelectedRarity}
        onClearAll={clearAllFilters}
        className="mb-8"
      />

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-4">
        แสดง {filteredCharacters.length} จาก {characters.length} ตัวละคร
      </p>

      {/* Character Grid */}
      {filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="ไม่พบตัวละคร"
          message="ลองเปลี่ยนตัวกรองหรือคำค้นหาใหม่"
        />
      )}
    </div>
  );
}
