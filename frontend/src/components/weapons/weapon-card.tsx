// =============================================
// PaimonGuide TH - Weapon Card Component
// =============================================
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn, getRarityGradient, getRarityBorderClass, getWeaponTypeNameTh } from '@/lib/utils';
import { RarityStars } from '@/components/common/rarity-stars';
import type { Weapon } from '@/types';

interface WeaponCardProps {
  weapon: Weapon;
  className?: string;
}

export function WeaponCard({ weapon, className }: WeaponCardProps) {
  return (
    <Link
      href={`/weapons/${weapon.slug}`}
      className={cn(
        'group relative block rounded-xl overflow-hidden border-2 transition-all duration-300',
        'hover:scale-105 hover:shadow-xl hover:shadow-black/20',
        getRarityBorderClass(weapon.rarity),
        className
      )}
    >
      {/* Background */}
      <div className={cn('bg-gradient-to-b p-4 aspect-square', getRarityGradient(weapon.rarity))}>
        {/* Weapon type badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-0.5 text-xs font-medium bg-gray-800/80 text-gray-300 rounded-full">
            {getWeaponTypeNameTh(weapon.type)}
          </span>
        </div>

        {/* Weapon image */}
        <div className="relative w-full h-full flex items-center justify-center">
          {weapon.icon_url ? (
            <Image
              src={weapon.icon_url}
              alt={weapon.name_en}
              width={96}
              height={96}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
              unoptimized
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gray-700/50 flex items-center justify-center">
              <span className="text-2xl text-gray-500">⚔</span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-800/90 px-3 py-2">
        <h3 className="text-sm font-semibold text-white truncate">
          {weapon.name_th}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{weapon.name_en}</span>
          <RarityStars rarity={weapon.rarity} size="sm" />
        </div>
      </div>
    </Link>
  );
}
