// =============================================
// PaimonGuide TH - Artifact Detail Client Component
// =============================================
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RarityStars } from '@/components/common/rarity-stars';
import { getRarityGradient, cn } from '@/lib/utils';
import type { Artifact } from '@/types';

const GENSHIN_API = 'https://genshin.jmp.blue';

interface ArtifactDetailClientProps {
  artifact: Artifact;
}

// Map piece key → Thai name & API image name
const PIECE_INFO: Record<string, { label: string; apiName: string }> = {
  flower: { label: 'ดอกไม้แห่งชีวิต (Flower of Life)', apiName: 'flower-of-life' },
  plume: { label: 'ขนนกแห่งความตาย (Plume of Death)', apiName: 'plume-of-death' },
  sands: { label: 'นาฬิกาทราย (Sands of Eon)', apiName: 'sands-of-eon' },
  goblet: { label: 'ถ้วยศักดิ์สิทธิ์ (Goblet of Eonothem)', apiName: 'goblet-of-eonothem' },
  circlet: { label: 'มงกุฎ (Circlet of Logos)', apiName: 'circlet-of-logos' },
};

export function ArtifactDetailClient({ artifact }: ArtifactDetailClientProps) {
  const pieces = artifact.pieces || ['flower', 'plume', 'sands', 'goblet', 'circlet'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/artifacts"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับไปรายการ Artifact
      </Link>

      {/* Artifact Header */}
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${getRarityGradient(artifact.max_rarity)} p-8 mb-8`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Artifact Icon */}
          <div className="flex-shrink-0">
            {artifact.icon_url ? (
              <Image
                src={artifact.icon_url}
                alt={artifact.name_en}
                width={160}
                height={160}
                className="rounded-xl"
                priority
                unoptimized
              />
            ) : (
              <div className="w-40 h-40 bg-gray-700/50 rounded-xl flex items-center justify-center">
                <span className="text-6xl text-gray-500">🏺</span>
              </div>
            )}
          </div>

          {/* Artifact Info */}
          <div className="text-center md:text-left flex-1">
            <RarityStars rarity={artifact.max_rarity} size="lg" />
            <h1 className="text-4xl font-bold text-white mb-1 mt-2">
              {artifact.name_th}
            </h1>
            <p className="text-xl text-gray-300">{artifact.name_en}</p>
          </div>
        </div>
      </div>

      {/* Set Bonuses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 2-Piece Bonus */}
        {(artifact.bonus_2pc_en || artifact.bonus_2pc_th) && (
          <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-bold bg-green-500/20 text-green-400 rounded-full">
                2 ชิ้น
              </span>
              <h2 className="text-lg font-semibold text-white">Set Bonus 2 ชิ้น</h2>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {artifact.bonus_2pc_th || artifact.bonus_2pc_en}
            </p>
            {artifact.bonus_2pc_th && artifact.bonus_2pc_en && (
              <p className="text-xs text-gray-500 mt-2 italic">{artifact.bonus_2pc_en}</p>
            )}
          </div>
        )}

        {/* 4-Piece Bonus */}
        {(artifact.bonus_4pc_en || artifact.bonus_4pc_th) && (
          <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-bold bg-amber-500/20 text-amber-400 rounded-full">
                4 ชิ้น
              </span>
              <h2 className="text-lg font-semibold text-white">Set Bonus 4 ชิ้น</h2>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {artifact.bonus_4pc_th || artifact.bonus_4pc_en}
            </p>
            {artifact.bonus_4pc_th && artifact.bonus_4pc_en && (
              <p className="text-xs text-gray-500 mt-2 italic">{artifact.bonus_4pc_en}</p>
            )}
          </div>
        )}
      </div>

      {/* Artifact Pieces */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">ชิ้นส่วนในชุด</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {pieces.map((piece) => {
            const info = PIECE_INFO[piece];
            if (!info) return null;
            const pieceImageUrl = `${GENSHIN_API}/artifacts/${artifact.slug}/${info.apiName}`;

            return (
              <div
                key={piece}
                className={cn(
                  'rounded-xl overflow-hidden border border-gray-700/50 bg-gray-800/50',
                  'hover:border-amber-500/50 transition-colors'
                )}
              >
                <div className={cn('p-4 aspect-square flex items-center justify-center', getRarityGradient(artifact.max_rarity))}>
                  <Image
                    src={pieceImageUrl}
                    alt={info.label}
                    width={80}
                    height={80}
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs text-gray-300 text-center leading-tight">
                    {info.label.split('(')[0].trim()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
