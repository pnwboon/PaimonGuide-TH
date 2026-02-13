// =============================================
// PaimonGuide TH - Character Detail Client Component
// =============================================
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Swords, Star, Sparkles, Info, User, BookOpen, Play, Mic } from 'lucide-react';
import { RarityStars } from '@/components/common/rarity-stars';
import { ElementBadge } from '@/components/common/element-badge';
import {
  getWeaponTypeNameTh,
  getRarityGradient,
  cn,
  formatBirthdayTh,
  formatReleaseDateTh,
} from '@/lib/utils';
import { TALENT_TYPE_NAMES, STAT_NAMES_TH, REGION_NAMES_TH } from '@/config/constants';
import type { CharacterWithDetails, Talent, TalentUpgrade, TalentScalingData } from '@/types';

interface CharacterDetailClientProps {
  character: CharacterWithDetails;
}

type TabKey = 'info' | 'talents' | 'constellations' | 'ascension' | 'lore' | 'videos';

export function CharacterDetailClient({ character }: CharacterDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('info');

  // Build tabs — only show tabs that have data or are core
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'info', label: 'ข้อมูลตัวละคร', icon: <User className="h-4 w-4" /> },
    { key: 'talents', label: 'ความสามารถ', icon: <Swords className="h-4 w-4" /> },
    { key: 'constellations', label: 'กลุ่มดาว', icon: <Star className="h-4 w-4" /> },
    { key: 'ascension', label: 'ข้อมูลอัพเกรด', icon: <Sparkles className="h-4 w-4" /> },
  ];

  // Only show lore/voice tab if data exists
  if (
    (character.stories && character.stories.length > 0) ||
    (character.voice_lines && character.voice_lines.length > 0)
  ) {
    tabs.push({ key: 'lore', label: 'เรื่องเล่า', icon: <BookOpen className="h-4 w-4" /> });
  }

  // Only show videos tab if data exists
  if (character.videos && character.videos.length > 0) {
    tabs.push({ key: 'videos', label: 'วิดีโอ', icon: <Play className="h-4 w-4" /> });
  }

  // Separate skill talents from passives
  const skillTalents = character.talents.filter((t) =>
    ['normal_attack', 'elemental_skill', 'elemental_burst', 'alternate_sprint'].includes(t.type),
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
      <div
        className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${getRarityGradient(character.rarity)} p-8 mb-8`}
      >
        {/* Gacha Splash Background */}
        {character.gacha_splash_url && (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <Image
              src={character.gacha_splash_url}
              alt=""
              fill
              className="object-cover object-top"
              unoptimized
            />
          </div>
        )}

        <div className="relative flex flex-col md:flex-row items-center gap-8">
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
                unoptimized
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
            <h1 className="text-4xl font-bold text-white mb-1">{character.name_th}</h1>
            <p className="text-xl text-gray-300">{character.name_en}</p>
            {character.title && (
              <p className="text-sm text-gray-400 mt-1 italic">&quot;{character.title}&quot;</p>
            )}

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
              <StatBadge label="อาวุธ" value={getWeaponTypeNameTh(character.weapon_type)} />
              {character.region && (
                <StatBadge
                  label="ภูมิภาค"
                  value={REGION_NAMES_TH[character.region] || character.region}
                />
              )}
              {character.constellation_name && (
                <StatBadge label="กลุ่มดาว" value={character.constellation_name} />
              )}
              {character.version && <StatBadge label="เวอร์ชัน" value={character.version} />}
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
          <div className="relative mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-300 leading-relaxed">{character.description}</p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-700 mb-8 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px] whitespace-nowrap',
              activeTab === tab.key
                ? 'text-amber-400 border-amber-400'
                : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== TAB: Character Info ==================== */}
      {activeTab === 'info' && (
        <div className="space-y-8">
          {/* Attributes Grid */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">ข้อมูลทั่วไป (Attributes)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <InfoRow label="ชื่อ" value={character.name_th} />
                    <InfoRow label="Name" value={character.name_en} />
                    {character.title && <InfoRow label="ฉายา" value={character.title} />}
                    {character.birthday && (
                      <InfoRow label="วันเกิด" value={formatBirthdayTh(character.birthday)} />
                    )}
                    {character.constellation_name && (
                      <InfoRow label="กลุ่มดาวชื่อ" value={character.constellation_name} />
                    )}
                    {character.region && (
                      <InfoRow
                        label="ภูมิภาค"
                        value={REGION_NAMES_TH[character.region] || character.region}
                      />
                    )}
                    {character.affiliation && (
                      <InfoRow label="สังกัด" value={character.affiliation} />
                    )}
                    {character.gender && (
                      <InfoRow
                        label="เพศ"
                        value={
                          character.gender === 'Male'
                            ? 'ชาย'
                            : character.gender === 'Female'
                              ? 'หญิง'
                              : character.gender
                        }
                      />
                    )}
                  </tbody>
                </table>
              </div>

              {/* Right column */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <InfoRow label="ธาตุ" value={character.element} />
                    <InfoRow label="อาวุธ" value={getWeaponTypeNameTh(character.weapon_type)} />
                    <InfoRow
                      label="ระดับดาว"
                      value={`${'★'.repeat(character.rarity)} (${character.rarity})`}
                    />
                    {character.version && (
                      <InfoRow label="เวอร์ชันเปิดตัว" value={character.version} />
                    )}
                    {character.release_date && (
                      <InfoRow
                        label="วันเปิดตัว"
                        value={formatReleaseDateTh(character.release_date)}
                      />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Voice Actors */}
          {(character.cv_cn || character.cv_en || character.cv_jp || character.cv_kr) && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">นักพากย์ (Voice Actors)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {character.cv_cn && (
                  <VoiceActorCard lang="จีน (CN)" name={character.cv_cn} flag="🇨🇳" />
                )}
                {character.cv_jp && (
                  <VoiceActorCard lang="ญี่ปุ่น (JP)" name={character.cv_jp} flag="🇯🇵" />
                )}
                {character.cv_en && (
                  <VoiceActorCard lang="อังกฤษ (EN)" name={character.cv_en} flag="🇺🇸" />
                )}
                {character.cv_kr && (
                  <VoiceActorCard lang="เกาหลี (KR)" name={character.cv_kr} flag="🇰🇷" />
                )}
              </div>
            </div>
          )}

          {/* Namecard */}
          {character.namecard_url && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">เนมการ์ด (Namecard)</h2>
              <div className="rounded-xl overflow-hidden border border-gray-700/50 max-w-md">
                <Image
                  src={character.namecard_url}
                  alt={`${character.name_en} Namecard`}
                  width={840}
                  height={400}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Special Dish */}
          {character.special_dish_name && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">อาหารพิเศษ (Special Dish)</h2>
              <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl max-w-md flex items-center gap-4">
                {character.special_dish_image_url && (
                  <Image
                    src={character.special_dish_image_url}
                    alt={character.special_dish_name}
                    width={64}
                    height={64}
                    className="rounded-lg bg-gray-700/50 p-1 flex-shrink-0"
                    unoptimized
                  />
                )}
                <div>
                  <h3 className="text-white font-semibold">{character.special_dish_name}</h3>
                  {character.special_dish_description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {character.special_dish_description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Constellation Shape */}
          {character.constellation_shape_url && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                รูปร่างกลุ่มดาว (Constellation)
              </h2>
              <div className="flex justify-center">
                <Image
                  src={character.constellation_shape_url}
                  alt={`${character.constellation_name || character.name_en} Constellation`}
                  width={300}
                  height={300}
                  className="opacity-80"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* TCG Card */}
          {character.tcg_card_image_url && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">การ์ด TCG (Genius Invokation)</h2>
              <div className="rounded-xl overflow-hidden border border-gray-700/50 max-w-xs">
                <Image
                  src={character.tcg_card_image_url}
                  alt={`${character.name_en} TCG Card`}
                  width={400}
                  height={600}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB: Talents ==================== */}
      {activeTab === 'talents' && (
        <div className="space-y-8">
          {/* Skill Talents */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">สกิลตัวละคร (Combat Talents)</h2>
            <div className="space-y-4">
              {skillTalents.map((talent) => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
              {skillTalents.length === 0 && <p className="text-gray-500">ยังไม่มีข้อมูลสกิล</p>}
            </div>
          </div>

          {/* Passive Talents */}
          {passiveTalents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                พรสวรรค์ติดตัว (Passive Talents)
              </h2>
              <div className="space-y-4">
                {passiveTalents.map((talent) => (
                  <TalentCard key={talent.id} talent={talent} />
                ))}
              </div>
            </div>
          )}

          {/* Talent Level-Up Materials */}
          {character.talent_materials_data &&
            Object.keys(character.talent_materials_data).length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  วัตถุดิบอัพเกรดสกิล (Talent Materials)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(character.talent_materials_data).map(([level, materials]) => (
                    <div
                      key={level}
                      className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl"
                    >
                      <h3 className="text-sm font-bold text-amber-400 mb-3">Lv. {level}</h3>
                      <div className="space-y-2">
                        {materials.map((mat, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            {mat.image_url && (
                              <Image
                                src={mat.image_url}
                                alt={mat.name}
                                width={28}
                                height={28}
                                className="rounded bg-gray-700/50 p-0.5 flex-shrink-0"
                                unoptimized
                              />
                            )}
                            <span className="text-gray-300 flex-1 truncate">{mat.name}</span>
                            <span className="text-white font-medium flex-shrink-0">
                              x{mat.value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* ==================== TAB: Constellations ==================== */}
      {activeTab === 'constellations' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            กลุ่มดาว{character.constellation_name ? ` — ${character.constellation_name}` : ''}
          </h2>

          {/* Constellation shape at center */}
          {character.constellation_shape_url && (
            <div className="flex justify-center mb-6">
              <Image
                src={character.constellation_shape_url}
                alt={character.constellation_name || 'Constellation'}
                width={200}
                height={200}
                className="opacity-60"
                unoptimized
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.constellations.map((c) => (
              <div key={c.id} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  {c.icon_url ? (
                    <Image
                      src={c.icon_url}
                      alt={c.name_en}
                      width={40}
                      height={40}
                      className="rounded-full bg-gray-700/50 p-1"
                      unoptimized
                    />
                  ) : (
                    <span className="w-10 h-10 flex items-center justify-center text-sm font-bold bg-amber-500/20 text-amber-400 rounded-full">
                      C{c.level}
                    </span>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400">C{c.level}</span>
                      <h3 className="text-sm font-semibold text-white">{c.name_en}</h3>
                    </div>
                    {c.name_th !== c.name_en && (
                      <p className="text-xs text-gray-400">{c.name_th}</p>
                    )}
                  </div>
                </div>
                {(c.description_en || c.description_th) && (
                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line mt-2">
                    {c.description_th || c.description_en}
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

      {/* ==================== TAB: Ascension ==================== */}
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
                      const knownKeys = ['AscensionPhase', 'Level', 'BaseHP', 'BaseAtk', 'BaseDef'];
                      const ascStatKey = Object.keys(phase).find((k) => !knownKeys.includes(k));

                      return (
                        <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="py-2.5 px-4 text-amber-400 font-medium">
                            {phase.AscensionPhase}
                          </td>
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
          {character.ascension_materials_data &&
            Object.keys(character.ascension_materials_data).length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">วัตถุดิบอัพเกรด</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(character.ascension_materials_data).map(([level, materials]) => (
                    <div
                      key={level}
                      className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl"
                    >
                      <h3 className="text-sm font-bold text-amber-400 mb-3">
                        {level.replace('level_', 'Lv. ')}
                      </h3>
                      <div className="space-y-2">
                        {materials.map(
                          (mat: { name: string; value: number; image_url?: string }, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              {mat.image_url && (
                                <Image
                                  src={mat.image_url}
                                  alt={mat.name}
                                  width={28}
                                  height={28}
                                  className="rounded bg-gray-700/50 p-0.5 flex-shrink-0"
                                  unoptimized
                                />
                              )}
                              <span className="text-gray-300 flex-1 truncate">{mat.name}</span>
                              <span className="text-white font-medium flex-shrink-0">
                                x{mat.value.toLocaleString()}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Fallback if no ascension data */}
          {(!character.ascension_data || character.ascension_data.length === 0) &&
            (!character.ascension_materials_data ||
              Object.keys(character.ascension_materials_data).length === 0) && (
              <p className="text-gray-500">ยังไม่มีข้อมูลอัพเกรด</p>
            )}
        </div>
      )}

      {/* ==================== TAB: Lore ==================== */}
      {activeTab === 'lore' && (
        <div className="space-y-8">
          {/* Character Stories */}
          {character.stories && character.stories.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                เรื่องราวตัวละคร (Character Stories)
              </h2>
              <div className="space-y-4">
                {character.stories.map((story) => (
                  <StoryCard
                    key={story.id}
                    title={story.title}
                    content={story.content}
                    unlockCondition={story.unlock_condition}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Voice Lines */}
          {character.voice_lines && character.voice_lines.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                <span className="inline-flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  บทพูด (Voice Lines)
                </span>
              </h2>
              <div className="space-y-3">
                {character.voice_lines.map((line) => (
                  <VoiceLineCard
                    key={line.id}
                    title={line.title}
                    content={line.content}
                    unlockCondition={line.unlock_condition}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(!character.stories || character.stories.length === 0) &&
            (!character.voice_lines || character.voice_lines.length === 0) && (
              <p className="text-gray-500">ยังไม่มีข้อมูลเรื่องเล่า</p>
            )}
        </div>
      )}

      {/* ==================== TAB: Videos ==================== */}
      {activeTab === 'videos' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">วิดีโอ (Video Collection)</h2>
          {character.videos && character.videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {character.videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">ยังไม่มีวิดีโอ</p>
          )}
        </div>
      )}
    </div>
  );
}

// ===== Sub-components =====

function TalentCard({ talent }: { talent: Talent }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const upgrades = talent.scaling as TalentUpgrade[] | null;
  const scalingData = talent.scaling_data as TalentScalingData | null;

  // Determine if we have multi-level data
  const hasMultiLevel = scalingData && scalingData.params && scalingData.levels;
  const maxLevel = hasMultiLevel ? Math.max(...Object.keys(scalingData.levels).map(Number)) : 1;

  return (
    <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Talent Icon */}
          {talent.icon_url && (
            <Image
              src={talent.icon_url}
              alt={talent.name_en}
              width={44}
              height={44}
              className="rounded-lg bg-gray-700/50 p-1 flex-shrink-0 mt-0.5"
              unoptimized
            />
          )}
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
        </div>
        {(talent.description_en || upgrades || hasMultiLevel) && (
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
          {(talent.description_th || talent.description_en) && (
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {talent.description_th || talent.description_en}
            </p>
          )}

          {/* Multi-level Scaling Table */}
          {hasMultiLevel && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ค่าสกิล (Talent Scaling)
                </h4>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">Lv.</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(Number(e.target.value))}
                    className="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600"
                  >
                    {Array.from({ length: maxLevel }, (_, i) => i + 1).map((lv) => (
                      <option key={lv} value={lv}>
                        {lv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {scalingData.params.map((paramName, i) => {
                  const levelData = scalingData.levels[String(selectedLevel)];
                  const value = levelData ? levelData[i] : '-';
                  if (!paramName || !value) return null;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-gray-700/30"
                    >
                      <span className="text-gray-400">{paramName}</span>
                      <span className="text-white font-medium ml-2">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fallback: Single-level scaling (Lv.1 only) */}
          {!hasMultiLevel && upgrades && upgrades.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                ค่าความเสียหาย (Lv.1)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {upgrades.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-gray-700/30"
                  >
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-gray-700/30 last:border-0">
      <td className="py-2.5 px-4 text-gray-400 font-medium w-1/3">{label}</td>
      <td className="py-2.5 px-4 text-white">{value}</td>
    </tr>
  );
}

function VoiceActorCard({ lang, name, flag }: { lang: string; name: string; flag: string }) {
  return (
    <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-center">
      <span className="text-2xl mb-2 block">{flag}</span>
      <p className="text-xs text-gray-400 mb-1">{lang}</p>
      <p className="text-sm font-semibold text-white">{name}</p>
    </div>
  );
}

function StoryCard({
  title,
  content,
  unlockCondition,
}: {
  title: string;
  content: string;
  unlockCondition?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {unlockCondition && <p className="text-xs text-gray-500 mt-0.5">{unlockCondition}</p>}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
        >
          {expanded ? 'ซ่อน' : 'อ่านเพิ่มเติม'}
        </button>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{content}</p>
        </div>
      )}
    </div>
  );
}

function VoiceLineCard({
  title,
  content,
  unlockCondition,
}: {
  title: string;
  content: string;
  unlockCondition?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="h-3.5 w-3.5 text-gray-500" />
          <h3 className="text-sm font-medium text-white">{title}</h3>
          {unlockCondition && <span className="text-xs text-gray-500">({unlockCondition})</span>}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
        >
          {expanded ? 'ซ่อน' : 'ดูบทพูด'}
        </button>
      </div>
      {expanded && (
        <p className="mt-2 text-sm text-gray-300 leading-relaxed whitespace-pre-line pl-5">
          {content}
        </p>
      )}
    </div>
  );
}

function VideoCard({
  video,
}: {
  video: { title: string; youtube_url: string; video_type?: string };
}) {
  // Extract YouTube video ID for embedding
  const getYouTubeId = (url: string): string | null => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/,
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(video.youtube_url);

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
      {videoId ? (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gray-900 flex items-center justify-center">
          <a
            href={video.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            ดูวิดีโอบน YouTube
          </a>
        </div>
      )}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white">{video.title}</h3>
        {video.video_type && (
          <span className="text-xs text-gray-500 capitalize">
            {video.video_type.replace('_', ' ')}
          </span>
        )}
      </div>
    </div>
  );
}
