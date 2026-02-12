// =============================================
// PaimonGuide TH - Artifacts Page Client
// =============================================
'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { PageLoading } from '@/components/common/loading-spinner';
import { ErrorDisplay } from '@/components/common/error-display';
import { EmptyState } from '@/components/common/empty-state';
import { ArtifactCard } from '@/components/artifacts/artifact-card';
import type { Artifact } from '@/types';

async function fetchArtifacts(): Promise<Artifact[]> {
  const res = await fetch('/api/artifacts');
  if (!res.ok) throw new Error('Failed to fetch artifacts');
  const json = await res.json();
  return json.data || [];
}

export function ArtifactsPageClient() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: artifacts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['artifacts'],
    queryFn: fetchArtifacts,
  });

  const filteredArtifacts = useMemo(() => {
    if (!searchQuery) return artifacts;
    const q = searchQuery.toLowerCase();
    return artifacts.filter(
      (a) =>
        a.name_en.toLowerCase().includes(q) || a.name_th.includes(q)
    );
  }, [artifacts, searchQuery]);

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorDisplay onRetry={() => refetch()} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Artifact Sets ทั้งหมด"
        description="รายการชุด Artifact ใน Genshin Impact พร้อม Set Bonus 2 ชิ้นและ 4 ชิ้น"
      />

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหา Artifact Set..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors"
          />
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        แสดง {filteredArtifacts.length} จาก {artifacts.length} ชุด
      </p>

      {filteredArtifacts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredArtifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
      ) : (
        <EmptyState title="ไม่พบ Artifact" message="ลองเปลี่ยนคำค้นหาใหม่" />
      )}
    </div>
  );
}
