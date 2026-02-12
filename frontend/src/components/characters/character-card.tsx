// =============================================
// PaimonGuide TH - Character Card Component
// =============================================
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn, getRarityGradient, getRarityBorderClass } from '@/lib/utils';
import { RarityStars } from '@/components/common/rarity-stars';
import { ElementBadge } from '@/components/common/element-badge';
import type { Character } from '@/types';

interface CharacterCardProps {
  character: Character;
  className?: string;
}

export function CharacterCard({ character, className }: CharacterCardProps) {
  return (
    <Link
      href={`/characters/${character.slug}`}
      className={cn(
        'group relative block rounded-xl overflow-hidden border-2 transition-all duration-300',
        'hover:scale-105 hover:shadow-xl hover:shadow-black/20',
        getRarityBorderClass(character.rarity),
        className
      )}
    >
      {/* Background gradient based on rarity */}
      <div className={cn('bg-gradient-to-b p-4 aspect-[3/4]', getRarityGradient(character.rarity))}>
        {/* Element badge */}
        <div className="absolute top-2 left-2 z-10">
          <ElementBadge element={character.element} size="sm" />
        </div>

        {/* Character image */}
        <div className="relative w-full h-full flex items-center justify-center">
          {character.icon_url ? (
            <Image
              src={character.icon_url}
              alt={character.name_en}
              width={128}
              height={128}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-700/50 flex items-center justify-center">
              <span className="text-2xl text-gray-500">?</span>
            </div>
          )}
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-gray-800/90 px-3 py-2">
        <h3 className="text-sm font-semibold text-white truncate">
          {character.name_th}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{character.name_en}</span>
          <RarityStars rarity={character.rarity} size="sm" />
        </div>
      </div>
    </Link>
  );
}
