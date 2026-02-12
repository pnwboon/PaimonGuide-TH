// =============================================
// PaimonGuide TH - Artifact Card Component
// =============================================
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn, getRarityGradient, getRarityBorderClass } from '@/lib/utils';
import { RarityStars } from '@/components/common/rarity-stars';
import type { Artifact } from '@/types';

interface ArtifactCardProps {
  artifact: Artifact;
  className?: string;
}

export function ArtifactCard({ artifact, className }: ArtifactCardProps) {
  return (
    <Link
      href={`/artifacts/${artifact.slug}`}
      className={cn(
        'group relative block rounded-xl overflow-hidden border-2 transition-all duration-300',
        'hover:scale-105 hover:shadow-xl hover:shadow-black/20',
        getRarityBorderClass(artifact.max_rarity),
        className
      )}
    >
      {/* Background */}
      <div className={cn('bg-gradient-to-b p-6 aspect-square', getRarityGradient(artifact.max_rarity))}>
        <div className="relative w-full h-full flex items-center justify-center">
          {artifact.icon_url ? (
            <Image
              src={artifact.icon_url}
              alt={artifact.name_en}
              width={96}
              height={96}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              loading="lazy"              unoptimized            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center">
              <span className="text-2xl text-gray-500">🏺</span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-800/90 px-3 py-2">
        <h3 className="text-sm font-semibold text-white truncate">
          {artifact.name_th}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{artifact.name_en}</span>
          <RarityStars rarity={artifact.max_rarity} size="sm" />
        </div>
        {artifact.bonus_2pc_th && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            2 ชิ้น: {artifact.bonus_2pc_th}
          </p>
        )}
      </div>
    </Link>
  );
}
