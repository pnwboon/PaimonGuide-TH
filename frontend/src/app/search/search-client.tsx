// =============================================
// PaimonGuide TH - Search Page Client
// =============================================
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { RarityStars } from '@/components/common/rarity-stars';
import type { SearchResult } from '@/types';

async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  const json = await res.json();
  return json.data || [];
}

export function SearchPageClient() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Simple debounce
  const handleSearch = (value: string) => {
    setQuery(value);
    const timer = setTimeout(() => setDebouncedQuery(value), 300);
    return () => clearTimeout(timer);
  };

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => fetchSearchResults(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const typeLabels: Record<string, string> = {
    character: 'ตัวละคร',
    weapon: 'อาวุธ',
    artifact: 'Artifact',
  };

  const typeHrefs: Record<string, string> = {
    character: '/characters',
    weapon: '/weapons',
    artifact: '/artifacts',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="ค้นหา" description="ค้นหาตัวละคร, อาวุธ, Artifacts" />

      {/* Search Input */}
      <div className="relative max-w-lg mb-8">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="พิมพ์ชื่อเพื่อค้นหา..."
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors text-lg"
          autoFocus
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400 animate-spin" />
        )}
      </div>

      {/* Results */}
      {debouncedQuery.length >= 2 && !isLoading && results.length === 0 && (
        <EmptyState
          title="ไม่พบผลลัพธ์"
          message={`ไม่พบข้อมูลสำหรับ "${debouncedQuery}"`}
        />
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400 mb-4">พบ {results.length} ผลลัพธ์</p>
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={`${typeHrefs[result.type]}/${result.slug}`}
              className="flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:bg-gray-800 hover:border-gray-600 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-700 text-gray-300 rounded">
                    {typeLabels[result.type]}
                  </span>
                  {result.rarity && <RarityStars rarity={result.rarity} size="sm" />}
                </div>
                <h3 className="text-white font-medium">{result.name_th}</h3>
                <p className="text-sm text-gray-400">{result.name_en}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
