// =============================================
// PaimonGuide TH - Character Detail Client Component
// =============================================
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RarityStars } from '@/components/common/rarity-stars';
import { ElementBadge } from '@/components/common/element-badge';
import { getWeaponTypeNameTh, getRarityGradient } from '@/lib/utils';
import { TALENT_TYPE_NAMES, STAT_NAMES_TH, REGION_NAMES_TH } from '@/config/constants';
import type { CharacterWithDetails } from '@/types';

interface CharacterDetailClientProps {
  character: CharacterWithDetails;
}

export function CharacterDetailClient({ character }: CharacterDetailClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/characters"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับไปรายการตัวละคร
      </Link>

      {/* Character Header */}
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${getRarityGradient(character.rarity)} p-8 mb-8`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Character Image */}
          <div className="flex-shrink-0">
            {character.card_url || character.icon_url ? (
              <Image
                src={character.card_url || character.icon_url || ''}
                alt={character.name_en}
                width={200}
                height={200}
                className="rounded-xl"
                priority
              />
            ) : (
              <div className="w-48 h-48 bg-gray-700/50 rounded-xl flex items-center justify-center">
                <span className="text-6xl text-gray-500">?</span>
              </div>
            )}
          </div>

          {/* Character Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <ElementBadge element={character.element} />
              <RarityStars rarity={character.rarity} size="lg" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-1">
              {character.name_th}
            </h1>
            <p className="text-xl text-gray-300 mb-4">{character.name_en}</p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <StatBadge label="อาวุธ" value={getWeaponTypeNameTh(character.weapon_type)} />
              {character.region && (
                <StatBadge label="ภูมิภาค" value={REGION_NAMES_TH[character.region] || character.region} />
              )}
              <StatBadge label="HP พื้นฐาน" value={character.base_hp.toLocaleString()} />
              <StatBadge label="ATK พื้นฐาน" value={character.base_atk.toLocaleString()} />
              <StatBadge label="DEF พื้นฐาน" value={character.base_def.toLocaleString()} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Talents */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">ความสามารถ (Talents)</h2>
          <div className="space-y-4">
            {character.talents.map((talent) => (
              <div key={talent.id} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded">
                    {TALENT_TYPE_NAMES[talent.type] || talent.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{talent.name_th}</h3>
                <p className="text-sm text-gray-400">{talent.name_en}</p>
                {talent.description_th && (
                  <p className="text-sm text-gray-300 mt-2">{talent.description_th}</p>
                )}
              </div>
            ))}
            {character.talents.length === 0 && (
              <p className="text-gray-500">ยังไม่มีข้อมูลความสามารถ</p>
            )}
          </div>
        </div>

        {/* Constellations */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">กลุ่มดาว (Constellations)</h2>
          <div className="space-y-3">
            {character.constellations.map((c) => (
              <div key={c.id} className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-bold bg-amber-500/20 text-amber-400 rounded-full">
                    {c.level}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{c.name_th}</h3>
                </div>
                <p className="text-xs text-gray-400">{c.name_en}</p>
                {c.description_th && (
                  <p className="text-xs text-gray-300 mt-1">{c.description_th}</p>
                )}
              </div>
            ))}
            {character.constellations.length === 0 && (
              <p className="text-gray-500 text-sm">ยังไม่มีข้อมูลกลุ่มดาว</p>
            )}
          </div>
        </div>
      </div>

      {/* Ascension Stats */}
      {character.ascension_stat && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">สถิติอัพเกรด (Ascension Stat)</h2>
          <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl inline-block">
            <span className="text-gray-400">{STAT_NAMES_TH[character.ascension_stat] || character.ascension_stat}: </span>
            <span className="text-white font-semibold">{character.ascension_stat_value}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Badge sub-component
function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-1.5 bg-gray-800/60 rounded-lg">
      <span className="text-xs text-gray-400">{label}</span>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
