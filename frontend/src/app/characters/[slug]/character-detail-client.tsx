// =============================================
// PaimonGuide TH - Character Detail Client Component
// =============================================
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Swords, Star, Sparkles, Info } from 'lucide-react';
import { RarityStars } from '@/components/common/rarity-stars';
import { ElementBadge } from '@/components/common/element-badge';
import { getWeaponTypeNameTh, getRarityGradient, cn } from '@/lib/utils';
import { TALENT_TYPE_NAMES, STAT_NAMES_TH, REGION_NAMES_TH } from '@/config/constants';
import type { CharacterWithDetails, Talent, TalentUpgrade } from '@/types';

interface CharacterDetailClientProps {
  character: CharacterWithDetails;
}

type TabKey = 'talents' | 'constellations' | 'ascension';

export function CharacterDetailClient({ character }: CharacterDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('talents');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'talents', label: 'ความสามารถ', icon: <Swords className="h-4 w-4" /> },
    { key: 'constellations', label: 'กลุ่มดาว', icon: <Star className="h-4 w-4" /> },
    { key: 'ascension', label: 'ข้อมูลอัพเกรด', icon: <Sparkles className="h-4 w-4" /> },
  ];

  // Separate skill talents from passives
  const skillTalents = character.talents.filter((t) =>
    ['normal_attack', 'elemental_skill', 'elemental_burst', 'alternate_sprint'].includes(t.type)
  );
  const passiveTalents = character.talents.filter((t) => t.type.startsWith('passive_'));

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
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <ElementBadge element={character.element} />
              <RarityStars rarity={character.rarity} size="lg" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-1">
              {character.name_th}
            </h1>
            <p className="text-xl text-gray-300">{character.name_en}</p>
            {character.title && (
              <p className="text-sm text-gray-400 mt-1 italic">&quot;{character.title}&quot;</p>
            )}

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
              <StatBadge label="อาวุธ" value={getWeaponTypeNameTh(character.weapon_type)} />
              {character.region && (
                <StatBadge label="ภูมิภาค" value={REGION_NAMES_TH[character.region] || character.region} />
              )}
              {character.affiliation && (
                <StatBadge label="สังกัด" value={character.affiliation} />
              )}
              {character.constellation_name && (
                <StatBadge label="กลุ่มดาว" value={character.constellation_name} />
              )}
            </div>

            {/* Base Stats Row */}
            <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
              <StatBadge label="HP พื้นฐาน" value={character.base_hp.toLocaleString()} />
              <StatBadge label="ATK พื้นฐาน" value={character.base_atk.toLocaleString()} />
              <StatBadge label="DEF พื้นฐาน" value={character.base_def.toLocaleString()} />
              {character.ascension_stat && (
                <StatBadge
                  label={STAT_NAMES_TH[character.ascension_stat] || character.ascension_stat}
                  value={`${character.ascension_stat_value || 0}%`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {character.description && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-300 leading-relaxed">{character.description}</p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px]',
              activeTab === tab.key
                ? 'text-amber-400 border-amber-400'
                : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'talents' && (
        <div className="space-y-8">
          {/* Skill Talents */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">สกิลตัวละคร (Combat Talents)</h2>
            <div className="space-y-4">
              {skillTalents.map((talent) => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
              {skillTalents.length === 0 && (
                <p className="text-gray-500">ยังไม่มีข้อมูลสกิล</p>
              )}
            </div>
          </div>

          {/* Passive Talents */}
          {passiveTalents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">พรสวรรค์ติด (Passive Talents)</h2>
              <div className="space-y-4">
                {passiveTalents.map((talent) => (
                  <TalentCard key={talent.id} talent={talent} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'constellations' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            กลุ่มดาว{character.constellation_name ? ` — ${character.constellation_name}` : ''}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.constellations.map((c) => (
              <div key={c.id} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-amber-500/20 text-amber-400 rounded-full">
                    C{c.level}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{c.name_en}</h3>
                    {c.name_th !== c.name_en && (
                      <p className="text-xs text-gray-400">{c.name_th}</p>
                    )}
                  </div>
                </div>
                {c.description_en && (
                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line mt-2">
                    {c.description_en}
                  </p>
                )}
              </div>
            ))}
            {character.constellations.length === 0 && (
              <p className="text-gray-500 text-sm">ยังไม่มีข้อมูลกลุ่มดาว</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ascension' && (
        <div className="space-y-8">
          {/* Ascension Stats Table */}
          {character.ascension_data && character.ascension_data.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">สถิติตามระดับอัพเกรด</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Phase</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Level</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">HP</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">ATK</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">DEF</th>
                      {character.ascension_stat && (
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">
                          {STAT_NAMES_TH[character.ascension_stat] || character.ascension_stat}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {character.ascension_data.map((phase, i) => {
                      // Find the ascension stat key dynamically
                      const knownKeys = ['AscensionPhase', 'Level', 'BaseHP', 'BaseAtk', 'BaseDef'];
                      const ascStatKey = Object.keys(phase).find((k) => !knownKeys.includes(k));

                      return (
                        <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="py-2.5 px-4 text-amber-400 font-medium">{phase.AscensionPhase}</td>
                          <td className="py-2.5 px-4 text-white">{phase.Level}</td>
                          <td className="py-2.5 px-4 text-right text-green-400">{phase.BaseHP}</td>
                          <td className="py-2.5 px-4 text-right text-red-400">{phase.BaseAtk}</td>
                          <td className="py-2.5 px-4 text-right text-blue-400">{phase.BaseDef}</td>
                          {ascStatKey && (
                            <td className="py-2.5 px-4 text-right text-purple-400">
                              {phase[ascStatKey]}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Ascension Materials */}
          {character.ascension_materials_data && Object.keys(character.ascension_materials_data).length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">วัตถุดิบอัพเกรด</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(character.ascension_materials_data).map(([level, materials]) => (
                  <div key={level} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <h3 className="text-sm font-bold text-amber-400 mb-3">
                      {level.replace('level_', 'Lv. ')}
                    </h3>
                    <div className="space-y-1.5">
                      {materials.map((mat, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{mat.name}</span>
                          <span className="text-white font-medium">x{mat.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback if no ascension data */}
          {(!character.ascension_data || character.ascension_data.length === 0) &&
            (!character.ascension_materials_data || Object.keys(character.ascension_materials_data).length === 0) && (
              <p className="text-gray-500">ยังไม่มีข้อมูลอัพเกรด</p>
            )}
        </div>
      )}
    </div>
  );
}

// ===== Sub-components =====

function TalentCard({ talent }: { talent: Talent }) {
  const [expanded, setExpanded] = useState(false);
  const upgrades = talent.scaling as TalentUpgrade[] | null;

  return (
    <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded">
              {TALENT_TYPE_NAMES[talent.type] || talent.type}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">{talent.name_en}</h3>
          {talent.name_th !== talent.name_en && (
            <p className="text-sm text-gray-400">{talent.name_th}</p>
          )}
        </div>
        {(talent.description_en || (upgrades && upgrades.length > 0)) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1 mt-1"
          >
            <Info className="h-3.5 w-3.5" />
            {expanded ? 'ซ่อน' : 'รายละเอียด'}
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-3">
          {/* Description */}
          {talent.description_en && (
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {talent.description_en}
            </p>
          )}

          {/* Scaling / Upgrades Table */}
          {upgrades && upgrades.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                ค่าความเสียหาย (Lv.1)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {upgrades.map((u, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-gray-700/30">
                    <span className="text-gray-400">{u.name}</span>
                    <span className="text-white font-medium ml-2">{u.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-1.5 bg-gray-800/60 rounded-lg">
      <span className="text-xs text-gray-400">{label}</span>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
