// =============================================
// PaimonGuide TH — UID Lookup + Build Card
// =============================================
// Horizontal build card — gacha splash, stats, artifacts
// Save as PNG for sharing
'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { toPng } from 'html-to-image';
import {
  Search, Loader2, User, Trophy, Swords, Zap, Star, Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  ParsedPlayer, ParsedCharacter, ParsedArtifact,
} from '@/types/enka';

// ═══════════════════════════════════════
// Element theme config
// ═══════════════════════════════════════
const THEME: Record<string, {
  text: string; accent: string; grad: string;
  border: string; glow: string; bar: string;
}> = {
  Pyro:    { text: 'text-red-400',    accent: '#ef4444', grad: 'from-red-800/60 via-red-950/40 to-transparent',    border: 'border-red-500/30',    glow: 'shadow-red-500/15',    bar: 'bg-red-500/70' },
  Hydro:   { text: 'text-blue-400',   accent: '#3b82f6', grad: 'from-blue-800/60 via-blue-950/40 to-transparent',   border: 'border-blue-500/30',   glow: 'shadow-blue-500/15',   bar: 'bg-blue-500/70' },
  Cryo:    { text: 'text-cyan-300',   accent: '#22d3ee', grad: 'from-cyan-800/60 via-cyan-950/40 to-transparent',   border: 'border-cyan-400/30',   glow: 'shadow-cyan-400/15',   bar: 'bg-cyan-400/70' },
  Electro: { text: 'text-purple-400', accent: '#a855f7', grad: 'from-purple-800/60 via-purple-950/40 to-transparent', border: 'border-purple-500/30', glow: 'shadow-purple-500/15', bar: 'bg-purple-500/70' },
  Anemo:   { text: 'text-teal-400',   accent: '#2dd4bf', grad: 'from-teal-800/60 via-teal-950/40 to-transparent',   border: 'border-teal-400/30',   glow: 'shadow-teal-400/15',   bar: 'bg-teal-400/70' },
  Geo:     { text: 'text-amber-400',  accent: '#f59e0b', grad: 'from-amber-800/60 via-amber-950/40 to-transparent',  border: 'border-amber-500/30',  glow: 'shadow-amber-500/15',  bar: 'bg-amber-500/70' },
  Dendro:  { text: 'text-lime-400',   accent: '#84cc16', grad: 'from-lime-800/60 via-lime-950/40 to-transparent',   border: 'border-lime-400/30',   glow: 'shadow-lime-400/15',   bar: 'bg-lime-400/70' },
};

const DEFAULT_THEME = { text: 'text-gray-400', accent: '#6b7280', grad: 'from-gray-800/60 via-gray-950/40 to-transparent', border: 'border-gray-500/30', glow: 'shadow-gray-500/15', bar: 'bg-gray-500/70' };

function t(element: string) { return THEME[element] || DEFAULT_THEME; }

// ═══════════════════════════════════════
// Stat icon map (unicode)
// ═══════════════════════════════════════
const STAT_ICON: Record<string, string> = {
  'Max HP': '♥', ATK: '⚔', DEF: '🛡', 'Elemental Mastery': '✦',
  'CRIT Rate': '☆', 'CRIT DMG': '✶', 'Energy Recharge': '⟳',
};

// ═══════════════════════════════════════
// Artifact set detector
// ═══════════════════════════════════════
function detectSets(artifacts: ParsedArtifact[]): string {
  const counts: Record<string, number> = {};
  artifacts.forEach((a) => { counts[a.setName] = (counts[a.setName] || 0) + 1; });
  const active = Object.entries(counts)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1]);
  if (active.length === 0) return '';
  return active.map(([name, c]) => `${c >= 4 ? '4' : '2'}× ${name}`).join(' + ');
}

// ═══════════════════════════════════════
// Sub-stat roll estimation (5★ artifact averages)
// ═══════════════════════════════════════
const ROLL_AVG: Record<string, number> = {
  'HP': 253.94, 'HP%': 4.955, 'ATK': 16.54, 'ATK%': 4.955,
  'DEF': 19.68, 'DEF%': 6.195, 'อัตราคริ': 3.305, 'ดาเมจคริ': 6.605,
  'ฟื้นฟูพลังงาน': 5.505, 'ความชำนาญธาตุ': 19.82,
};

function estimateRolls(name: string, valueStr: string): number {
  const avg = ROLL_AVG[name];
  if (!avg) return 1;
  const num = parseFloat(valueStr.replace('%', '').replace('+', '').replace(',', ''));
  if (isNaN(num)) return 1;
  return Math.max(1, Math.min(6, Math.round(num / avg)));
}

function rollColor(rolls: number): string {
  if (rolls >= 5) return '#fbbf24'; // gold — excellent
  if (rolls >= 4) return '#4ade80'; // green — great
  if (rolls >= 3) return '#60a5fa'; // blue — good
  if (rolls >= 2) return '#94a3b8'; // slate — decent
  return '#4b5563';                 // gray — base
}

// ═══════════════════════════════════════
// Main Export
// ═══════════════════════════════════════

export function UidLookupClient() {
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [player, setPlayer] = useState<ParsedPlayer | null>(null);

  const handleSearch = useCallback(async () => {
    const v = uid.trim();
    if (!v) return;
    if (!/^\d{9,10}$/.test(v)) { setError('UID ต้องเป็นตัวเลข 9-10 หลัก'); return; }
    setLoading(true); setError(''); setPlayer(null);
    try {
      const res = await fetch(`/api/enka/${v}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'เกิดข้อผิดพลาด'); return; }
      setPlayer(data);
    } catch { setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'); }
    finally { setLoading(false); }
  }, [uid]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">🔍 ค้นหาผู้เล่น</h1>
        <p className="text-gray-400 text-sm">ใส่ UID เพื่อดู Build — กดบันทึก Card แชร์อวดเพื่อนได้เลย!</p>
      </div>

      {/* Search */}
      <div className="max-w-lg mx-auto mb-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text" value={uid}
              onChange={(e) => setUid(e.target.value.replace(/\D/g, '').slice(0, 10))}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="ใส่ UID (เช่น 618285856)"
              className="w-full px-4 py-3 pl-11 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-lg"
              disabled={loading}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          <button onClick={handleSearch} disabled={loading || !uid.trim()}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold rounded-xl transition-colors flex items-center gap-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            ค้นหา
          </button>
        </div>
        {error && <p className="mt-3 text-red-400 text-center text-sm">{error}</p>}
        <p className="mt-2 text-xs text-gray-600 text-center">ข้อมูลจาก Enka.Network — ต้องเปิด Character Showcase ในเกมก่อน</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-amber-400 mx-auto mb-4" />
          <p className="text-gray-400">กำลังดึงข้อมูล...</p>
        </div>
      )}

      {/* Player + Build Cards */}
      {player && !loading && (
        <div className="space-y-8">
          <PlayerInfoCard player={player} />
          {player.characters.length > 0 ? (
            <div className="space-y-8">
              {player.characters.map((c) => (
                <BuildCard key={c.avatarId} character={c} uid={player.uid} playerName={player.nickname} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <User className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">ผู้เล่นยังไม่ได้ตั้ง Character Showcase</p>
              <p className="text-gray-600 text-sm mt-1">เปิดใน: Paimon Menu → ตั้งค่า → แสดงรายละเอียดตัวละคร</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// Player Info Card
// ═══════════════════════════════════════

function PlayerInfoCard({ player }: { player: ParsedPlayer }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {player.profilePictureUrl && (
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/50 flex-shrink-0">
            <Image src={player.profilePictureUrl} alt={player.nickname} width={64} height={64} className="object-cover" unoptimized />
          </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-white">{player.nickname}</h2>
          {player.signature && <p className="text-sm text-gray-400 italic">&ldquo;{player.signature}&rdquo;</p>}
          <p className="text-xs text-gray-500">UID: {player.uid}</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Pill icon={<Star className="h-3.5 w-3.5" />} label="AR" value={player.level.toString()} />
          <Pill icon={<Zap className="h-3.5 w-3.5" />} label="WL" value={player.worldLevel.toString()} />
          <Pill icon={<Trophy className="h-3.5 w-3.5" />} label="Achieve" value={player.achievements.toString()} />
          <Pill icon={<Swords className="h-3.5 w-3.5" />} label="Abyss" value={player.spiralAbyss} />
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700/50 rounded-lg">
      <span className="text-amber-400">{icon}</span>
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════
// BUILD CARD — The main showcase card
// ═══════════════════════════════════════════════

function BuildCard({ character, uid, playerName }: {
  character: ParsedCharacter; uid: string; playerName: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const theme = t(character.element);

  // Gacha art URL (computed from sideIconUrl)
  const gachaUrl = character.sideIconUrl
    .replace('UI_AvatarIcon_Side_', 'UI_Gacha_AvatarImg_');

  const handleSave = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const url = await toPng(cardRef.current, {
        pixelRatio: 2, backgroundColor: '#0d1117', cacheBust: true,
      });
      const a = document.createElement('a');
      a.download = `${character.name}_Build_UID${uid}.png`;
      a.href = url; a.click();
    } catch (err) { console.error('Save error:', err); }
    finally { setSaving(false); }
  }, [character.name, uid, saving]);

  // Artifact sets info
  const setInfo = detectSets(character.artifacts);

  return (
    <div>
      {/* Save button (outside the card) */}
      <div className="flex justify-end mb-2">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-amber-500 hover:text-black text-gray-300 text-sm font-medium rounded-lg border border-gray-700 hover:border-amber-500 transition-all disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          {saving ? 'กำลังบันทึก...' : 'บันทึกรูป'}
        </button>
      </div>

      {/* ═══ THE CARD ═══ */}
      <div ref={cardRef} className={cn('rounded-2xl border overflow-hidden shadow-lg', theme.border, theme.glow)}
        style={{ backgroundColor: '#0d1117' }}>

        {/* 3-column layout */}
        <div className="flex flex-col lg:flex-row min-h-[420px]">

          {/* ── LEFT: Character Splash ── */}
          <div className="relative w-full lg:w-[380px] flex-shrink-0 overflow-hidden"
            style={{ minHeight: 300 }}>
            {/* Gacha art background */}
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gachaUrl}
                alt={character.name}
                className="absolute inset-0 w-full h-full object-cover object-top"
                onError={(e) => { (e.target as HTMLImageElement).src = character.sideIconUrl; }}
              />
              {/* Gradient overlays */}
              <div className={cn('absolute inset-0 bg-gradient-to-r', theme.grad)} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d1117]/90" />
            </div>

            {/* Character info overlay */}
            <div className="relative z-10 flex flex-col justify-between h-full p-5">
              {/* Top: Name + Element */}
              <div>
                <h3 className="text-2xl font-black text-white drop-shadow-lg leading-tight">
                  {character.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('text-sm font-semibold', theme.text)}>{character.element}</span>
                  <span className="text-amber-400 text-sm tracking-tight">
                    {'★'.repeat(character.rarity)}
                  </span>
                </div>

                {/* Level + Friendship */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-md text-sm font-bold text-white">
                    Lv. {character.level}
                  </span>
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-md text-sm text-pink-300">
                    ♡ {character.friendship}
                  </span>
                </div>

                {/* Constellation diamonds */}
                <div className="flex items-center gap-1 mt-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className={cn(
                      'text-base',
                      i < character.constellations
                        ? theme.text + ' drop-shadow-lg'
                        : 'text-gray-700'
                    )}>
                      {i < character.constellations ? '◆' : '◇'}
                    </span>
                  ))}
                  <span className="ml-1.5 text-xs text-gray-400">C{character.constellations}</span>
                </div>
              </div>

              {/* Bottom: Skills */}
              <div>
                {character.skills.length > 0 && (
                  <div className="flex gap-3 mt-4">
                    {character.skills.map((skill, i) => (
                      <div key={skill.id} className="flex flex-col items-center">
                        <div className={cn(
                          'w-11 h-11 rounded-full overflow-hidden border-2 bg-black/60 backdrop-blur-sm',
                          theme.border
                        )}>
                          {skill.iconUrl && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={skill.iconUrl} alt={`Skill ${i + 1}`}
                              width={44} height={44} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className={cn(
                          'text-sm font-black mt-1 drop-shadow-md',
                          skill.extraLevel > 0 ? 'text-cyan-300' : 'text-white'
                        )}>
                          {skill.level + skill.extraLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* UID + Branding */}
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/10">
                  <span className="text-[11px] text-gray-500 font-medium">{uid}</span>
                  <span className="text-[11px] text-gray-500 font-medium">{playerName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CENTER: Stats + Weapon ── */}
          <div className="flex-1 min-w-0 p-5 flex flex-col" style={{ backgroundColor: '#0d1117' }}>
            {/* Weapon bar */}
            {character.weapon && (
              <div className={cn('flex items-center gap-3 p-3 rounded-xl mb-4 border', theme.border)}
                style={{ backgroundColor: '#161b22' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={character.weapon.iconUrl} alt={character.weapon.name}
                  width={52} height={52}
                  className="rounded-lg bg-gray-800/50 p-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white truncate">{character.weapon.name}</span>
                    <span className="text-amber-400 text-[10px]">{'★'.repeat(character.weapon.rarity)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={cn('px-1.5 py-0.5 rounded text-[11px] font-extrabold text-white', theme.bar)}>
                      R{character.weapon.refinement}
                    </span>
                    <span className="text-xs text-gray-400">Lv.{character.weapon.level}</span>
                    <span className="text-xs text-gray-300">⚔ {character.weapon.baseAtk}</span>
                    {character.weapon.subStat && (
                      <span className="text-xs text-gray-400">
                        {character.weapon.subStat.name} {character.weapon.subStat.value.toFixed(1)}
                        {isPercentStat(character.weapon.subStat.name) ? '%' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="space-y-1 flex-1">
              <StatLine icon="♥" label="HP" value={character.stats.maxHp.toLocaleString()} accent={theme.accent} />
              <StatLine icon="⚔" label="ATK" value={character.stats.atk.toLocaleString()} accent={theme.accent} />
              <StatLine icon="🛡" label="DEF" value={character.stats.def.toLocaleString()} accent={theme.accent} />
              <StatLine icon="✦" label="Elemental Mastery" value={character.stats.elementalMastery.toString()} accent={theme.accent} />
              <StatLine icon="☆" label="CRIT Rate" value={`${character.stats.critRate.toFixed(1)}%`} accent={theme.accent} highlight />
              <StatLine icon="✶" label="CRIT DMG" value={`${character.stats.critDmg.toFixed(1)}%`} accent={theme.accent} highlight />
              <StatLine icon="⟳" label="Energy Recharge" value={`${character.stats.energyRecharge.toFixed(1)}%`} accent={theme.accent} />
              {character.stats.elementDmgBonus > 0.5 && (
                <StatLine icon="◈" label={`${character.stats.elementDmgType} DMG Bonus`}
                  value={`${character.stats.elementDmgBonus.toFixed(1)}%`} accent={theme.accent} />
              )}
              {character.stats.physicalDmgBonus > 0.5 && (
                <StatLine icon="◈" label="Physical DMG Bonus"
                  value={`${character.stats.physicalDmgBonus.toFixed(1)}%`} accent={theme.accent} />
              )}
              {character.stats.healingBonus > 0.5 && (
                <StatLine icon="✚" label="Healing Bonus"
                  value={`${character.stats.healingBonus.toFixed(1)}%`} accent={theme.accent} />
              )}
            </div>

            {/* CRIT ratio bar */}
            <div className="mt-4 pt-3 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">CRIT Ratio</span>
                <span className="text-base font-black text-white tracking-wider">
                  {character.stats.critRate.toFixed(1)}
                  <span className="text-gray-500 mx-1">:</span>
                  {character.stats.critDmg.toFixed(1)}
                </span>
              </div>
            </div>

            {/* PaimonGuide branding */}
            <div className="mt-2 pt-2 border-t border-gray-800/50 flex items-center justify-between">
              <span className="text-[10px] text-gray-600 tracking-wide">PaimonGuide TH</span>
              <span className="text-[10px] text-gray-700">Powered by Enka.Network</span>
            </div>
          </div>

          {/* ── RIGHT: Artifacts ── */}
          <div className="w-full lg:w-[360px] flex-shrink-0 p-4 lg:pl-0 flex flex-col gap-2"
            style={{ backgroundColor: '#0d1117' }}>
            {character.artifacts.map((art, i) => (
              <ArtifactCard key={i} artifact={art} accent={theme.accent} />
            ))}
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 5 - character.artifacts.length) }).map((_, i) => (
              <div key={`e-${i}`}
                className="h-[56px] rounded-xl border border-gray-800/50 flex items-center justify-center"
                style={{ backgroundColor: '#161b22' }}>
                <span className="text-gray-700 text-xs">—</span>
              </div>
            ))}
            {/* Set bonus */}
            {setInfo && (
              <div className="mt-1 px-3 py-2 rounded-lg border border-gray-800/50 text-center"
                style={{ backgroundColor: '#161b22' }}>
                <span className="text-[11px] text-gray-400">🎭 {setInfo}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// StatLine — single stat row
// ═══════════════════════════════════════

function StatLine({ icon, label, value, accent, highlight }: {
  icon: string; label: string; value: string; accent: string; highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-[7px] rounded-lg group"
      style={{ backgroundColor: '#161b22' }}>
      {/* Element-colored left bar */}
      <div className="w-[3px] h-5 rounded-full" style={{ backgroundColor: accent, opacity: 0.6 }} />
      <span className="text-sm w-5 text-center opacity-70">{icon}</span>
      <span className="text-xs text-gray-400 flex-1">{label}</span>
      <span className={cn(
        'text-sm font-bold tabular-nums',
        highlight ? 'text-amber-300' : 'text-white'
      )}>
        {value}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════
// ArtifactCard — compact artifact row
// ═══════════════════════════════════════

function ArtifactCard({ artifact, accent }: { artifact: ParsedArtifact; accent: string }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-gray-800/50"
      style={{ backgroundColor: '#161b22' }}>
      {/* Icon */}
      <div className="relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artifact.iconUrl} alt={artifact.typeName}
          width={40} height={40}
          className="rounded-lg bg-gray-900/50 p-0.5" />
      </div>

      {/* Main stat — big value */}
      <div className="flex-shrink-0 w-[64px]">
        <div className="text-lg font-black text-white leading-tight">{artifact.mainStat.value}</div>
        <div className="text-[9px] text-gray-500 leading-tight truncate">{artifact.mainStat.name}</div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-amber-400 text-[8px]">{'★'.repeat(Math.min(artifact.rarity, 5))}</span>
          <span className="text-[9px] text-gray-500">+{artifact.level}</span>
        </div>
      </div>

      {/* Sub stats — 2×2 grid with roll pips */}
      <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
        {artifact.subStats.map((sub, i) => {
          const rolls = estimateRolls(sub.name, sub.value);
          const color = rollColor(rolls);
          return (
            <div key={i}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500 truncate mr-1">{sub.name}</span>
                <span className="text-[11px] text-gray-300 font-semibold tabular-nums flex-shrink-0">
                  {sub.value}
                </span>
              </div>
              {/* Roll pips below */}
              <div className="flex gap-[2px] mt-[1px]">
                {Array.from({ length: rolls }).map((_, r) => (
                  <span key={r} className="block w-[5px] h-[3px] rounded-[1px]"
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Helpers
// ═══════════════════════════════════════

function isPercentStat(name: string): boolean {
  const pct = ['อัตราคริ', 'ดาเมจคริ', 'ฟื้นฟูพลังงาน', 'โบนัสการรักษา', 'ATK%', 'HP%', 'DEF%'];
  return pct.some(p => name.includes(p));
}
