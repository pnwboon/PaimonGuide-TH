// =============================================
// PaimonGuide TH - Character Editor Page
// =============================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, AlertTriangle, CheckCircle2, ArrowLeft, ImageIcon } from 'lucide-react';
import type { Character, Talent, Constellation } from '@/types/character';
import { TalentsEditor } from './talents-editor';
import { ConstellationsEditor } from './constellations-editor';
import { SubDataEditor } from './sub-data-editor';
import { JsonEditor } from './json-editor';

const TABS = [
  { id: 'basic', label: 'ข้อมูลพื้นฐาน' },
  { id: 'stats', label: 'Status & Ascension' },
  { id: 'images', label: 'รูปภาพ' },
  { id: 'talents', label: 'Talents' },
  { id: 'constellations', label: 'Constellations' },
  { id: 'stories', label: 'เรื่องราว' },
  { id: 'voicelines', label: 'เสียงพากย์' },
  { id: 'videos', label: 'วิดีโอ' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const ELEMENTS = ['Pyro', 'Hydro', 'Cryo', 'Electro', 'Anemo', 'Geo', 'Dendro'];
const WEAPONS = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];
const REGIONS = ['Mondstadt', 'Liyue', 'Inazuma', 'Sumeru', 'Fontaine', 'Natlan', 'Snezhnaya'];

type CharData = Partial<Character> & { name_en: string };

export default function CharacterEditorPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;
  const isNew = characterId === 'new';

  const [tab, setTab] = useState<TabId>('basic');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [character, setCharacter] = useState<CharData>({
    name_en: '',
    name_th: '',
    rarity: 5,
    element: 'Pyro',
    weapon_type: 'Sword',
    base_hp: 0,
    base_atk: 0,
    base_def: 0,
  } as CharData);

  const [talents, setTalents] = useState<Talent[]>([]);
  const [constellations, setConstellations] = useState<Constellation[]>([]);

  // Fetch character data
  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const res = await fetch('/api/admin/characters');
        if (!res.ok) throw new Error('Failed to fetch');
        const { data } = await res.json();
        const char = data.find((c: Character) => c.id === characterId);
        if (!char) {
          setError('ไม่พบตัวละคร');
          return;
        }
        setCharacter(char);
      } catch {
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    })();
  }, [characterId, isNew]);

  // Fetch talents & constellations when switching to those tabs
  const fetchTalents = useCallback(async () => {
    if (isNew || !characterId) return;
    try {
      const res = await fetch(`/api/admin/talents?character_id=${characterId}`);
      if (res.ok) {
        const { data } = await res.json();
        setTalents(data || []);
      }
    } catch {
      /* ignore */
    }
  }, [characterId, isNew]);

  const fetchConstellations = useCallback(async () => {
    if (isNew || !characterId) return;
    try {
      const res = await fetch(`/api/admin/constellations?character_id=${characterId}`);
      if (res.ok) {
        const { data } = await res.json();
        setConstellations(data || []);
      }
    } catch {
      /* ignore */
    }
  }, [characterId, isNew]);

  useEffect(() => {
    if (tab === 'talents') fetchTalents();
    if (tab === 'constellations') fetchConstellations();
  }, [tab, fetchTalents, fetchConstellations]);

  // Update field
  const updateField = (field: string, value: unknown) => {
    setCharacter((prev) => ({ ...prev, [field]: value }));
    setSuccess('');
  };

  // Save character
  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!character.name_en) {
        setError('ต้องกรอกชื่อภาษาอังกฤษ');
        setSaving(false);
        return;
      }

      const method = isNew ? 'POST' : 'PUT';
      const body = isNew ? { ...character } : { id: characterId, ...character };

      const res = await fetch('/api/admin/characters', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Save failed');

      setSuccess('บันทึกสำเร็จ!');

      if (isNew && result.data?.id) {
        router.replace(`/admin/dashboard/characters/${result.data.id}`);
      } else {
        setCharacter(result.data);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/dashboard/characters')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            {character.icon_url ? (
              <img
                src={character.icon_url}
                alt=""
                className="h-12 w-12 rounded-xl bg-gray-800 object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-gray-600" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-white">
                {isNew ? 'เพิ่มตัวละครใหม่' : character.name_th || character.name_en}
              </h1>
              {!isNew && character.name_en && (
                <p className="text-sm text-gray-500">{character.name_en}</p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 font-semibold rounded-lg transition-colors text-sm"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> กำลังบันทึก...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> บันทึก
            </>
          )}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
          <p className="text-sm text-green-400">{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-800 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map((t) => {
            // Disable sub-data tabs for new characters
            const disabled =
              isNew &&
              ['talents', 'constellations', 'stories', 'voicelines', 'videos'].includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => !disabled && setTab(t.id)}
                disabled={disabled}
                className={`
                  px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${
                    tab === t.id
                      ? 'border-amber-500 text-amber-400'
                      : disabled
                        ? 'border-transparent text-gray-700 cursor-not-allowed'
                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }
                `}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {tab === 'basic' && <BasicInfoTab character={character} updateField={updateField} />}
        {tab === 'stats' && <StatsTab character={character} updateField={updateField} />}
        {tab === 'images' && <ImagesTab character={character} updateField={updateField} />}
        {tab === 'talents' && !isNew && (
          <TalentsEditor characterId={characterId} talents={talents} onRefresh={fetchTalents} />
        )}
        {tab === 'constellations' && !isNew && (
          <ConstellationsEditor
            characterId={characterId}
            constellations={constellations}
            onRefresh={fetchConstellations}
          />
        )}
        {tab === 'stories' && !isNew && (
          <SubDataEditor
            characterId={characterId}
            table="character_stories"
            title="เรื่องราว"
            fields={[
              { key: 'title', label: 'หัวข้อ', type: 'text' },
              { key: 'content', label: 'เนื้อหา', type: 'textarea' },
              { key: 'unlock_condition', label: 'เงื่อนไขปลดล็อก', type: 'text' },
              { key: 'sort_order', label: 'ลำดับ', type: 'number' },
            ]}
          />
        )}
        {tab === 'voicelines' && !isNew && (
          <SubDataEditor
            characterId={characterId}
            table="character_voice_lines"
            title="เสียงพากย์"
            fields={[
              { key: 'title', label: 'หัวข้อ', type: 'text' },
              { key: 'content', label: 'เนื้อหา', type: 'textarea' },
              { key: 'unlock_condition', label: 'เงื่อนไขปลดล็อก', type: 'text' },
              { key: 'sort_order', label: 'ลำดับ', type: 'number' },
            ]}
          />
        )}
        {tab === 'videos' && !isNew && (
          <SubDataEditor
            characterId={characterId}
            table="character_videos"
            title="วิดีโอ"
            fields={[
              { key: 'title', label: 'ชื่อวิดีโอ', type: 'text' },
              { key: 'youtube_url', label: 'YouTube URL', type: 'text' },
              { key: 'video_type', label: 'ประเภท', type: 'text' },
              { key: 'thumbnail_url', label: 'Thumbnail URL', type: 'text' },
              { key: 'sort_order', label: 'ลำดับ', type: 'number' },
            ]}
          />
        )}
      </div>
    </div>
  );
}

// =============================================
// Basic Info Tab
// =============================================
function BasicInfoTab({
  character,
  updateField,
}: {
  character: CharData;
  updateField: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionTitle>ข้อมูลหลัก</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldInput
          label="ชื่อ (EN) *"
          value={character.name_en}
          onChange={(v) => updateField('name_en', v)}
        />
        <FieldInput
          label="ชื่อ (TH)"
          value={character.name_th || ''}
          onChange={(v) => updateField('name_th', v)}
        />
        <FieldInput
          label="Slug"
          value={character.slug || ''}
          onChange={(v) => updateField('slug', v)}
          placeholder="auto-generated if empty"
        />
        <FieldInput
          label="Title"
          value={character.title || ''}
          onChange={(v) => updateField('title', v)}
        />
        <FieldSelect
          label="ธาตุ *"
          value={character.element || ''}
          options={ELEMENTS}
          onChange={(v) => updateField('element', v)}
        />
        <FieldSelect
          label="อาวุธ *"
          value={character.weapon_type || ''}
          options={WEAPONS}
          onChange={(v) => updateField('weapon_type', v)}
        />
        <FieldSelect
          label="ดาว *"
          value={String(character.rarity || 5)}
          options={['4', '5']}
          onChange={(v) => updateField('rarity', Number(v))}
        />
        <FieldSelect
          label="ภูมิภาค"
          value={character.region || ''}
          options={['', ...REGIONS]}
          onChange={(v) => updateField('region', v || null)}
        />
        <FieldInput
          label="เพศ"
          value={character.gender || ''}
          onChange={(v) => updateField('gender', v || null)}
        />
        <FieldInput
          label="วันเกิด"
          value={character.birthday || ''}
          onChange={(v) => updateField('birthday', v || null)}
          placeholder="MM-DD"
        />
        <FieldInput
          label="สังกัด"
          value={character.affiliation || ''}
          onChange={(v) => updateField('affiliation', v || null)}
        />
        <FieldInput
          label="ชื่อกลุ่มดาว"
          value={character.constellation_name || ''}
          onChange={(v) => updateField('constellation_name', v || null)}
        />
        <FieldInput
          label="เวอร์ชัน"
          value={character.version || ''}
          onChange={(v) => updateField('version', v || null)}
          placeholder="e.g. 1.0"
        />
        <FieldInput
          label="วันวางจำหน่าย"
          value={character.release_date || ''}
          onChange={(v) => updateField('release_date', v || null)}
          placeholder="YYYY-MM-DD"
        />
      </div>

      <SectionTitle>นักพากย์</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldInput
          label="CV จีน"
          value={character.cv_cn || ''}
          onChange={(v) => updateField('cv_cn', v || null)}
        />
        <FieldInput
          label="CV อังกฤษ"
          value={character.cv_en || ''}
          onChange={(v) => updateField('cv_en', v || null)}
        />
        <FieldInput
          label="CV ญี่ปุ่น"
          value={character.cv_jp || ''}
          onChange={(v) => updateField('cv_jp', v || null)}
        />
        <FieldInput
          label="CV เกาหลี"
          value={character.cv_kr || ''}
          onChange={(v) => updateField('cv_kr', v || null)}
        />
      </div>

      <SectionTitle>อาหารพิเศษ</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldInput
          label="ชื่ออาหาร"
          value={character.special_dish_name || ''}
          onChange={(v) => updateField('special_dish_name', v || null)}
        />
        <FieldInput
          label="รูปอาหาร (URL)"
          value={character.special_dish_image_url || ''}
          onChange={(v) => updateField('special_dish_image_url', v || null)}
        />
        <div className="md:col-span-2">
          <FieldTextarea
            label="คำอธิบายอาหาร"
            value={character.special_dish_description || ''}
            onChange={(v) => updateField('special_dish_description', v || null)}
          />
        </div>
      </div>

      <SectionTitle>TCG</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldInput
          label="TCG Card Image URL"
          value={character.tcg_card_image_url || ''}
          onChange={(v) => updateField('tcg_card_image_url', v || null)}
        />
      </div>

      <SectionTitle>คำอธิบาย</SectionTitle>
      <FieldTextarea
        label="คำอธิบายตัวละคร"
        value={character.description || ''}
        onChange={(v) => updateField('description', v || null)}
        rows={4}
      />
    </div>
  );
}

// =============================================
// Stats Tab
// =============================================
function StatsTab({
  character,
  updateField,
}: {
  character: CharData;
  updateField: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionTitle>Base Stats (Lv.90)</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FieldNumber
          label="Base HP"
          value={character.base_hp || 0}
          onChange={(v) => updateField('base_hp', v)}
        />
        <FieldNumber
          label="Base ATK"
          value={character.base_atk || 0}
          onChange={(v) => updateField('base_atk', v)}
        />
        <FieldNumber
          label="Base DEF"
          value={character.base_def || 0}
          onChange={(v) => updateField('base_def', v)}
        />
      </div>

      <SectionTitle>Ascension Stat</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldInput
          label="Ascension Stat Name"
          value={character.ascension_stat || ''}
          onChange={(v) => updateField('ascension_stat', v || null)}
          placeholder="e.g. CRIT DMG, CRIT Rate, ATK%"
        />
        <FieldNumber
          label="Ascension Stat Value"
          value={character.ascension_stat_value || 0}
          onChange={(v) => updateField('ascension_stat_value', v)}
          step={0.1}
        />
      </div>

      <SectionTitle>Ascension Data (JSON)</SectionTitle>
      <p className="text-xs text-gray-500 mb-2">
        อาร์เรย์ของ Phase แต่ละตัว มี AscensionPhase, Level, BaseHP, BaseAtk, BaseDef และ stat อื่นๆ
      </p>
      <JsonEditor
        value={character.ascension_data || []}
        onChange={(val) => updateField('ascension_data', val)}
        placeholder='[{"AscensionPhase":"0","Level":"1-20","BaseHP":"1003","BaseAtk":"26","BaseDef":"62"}]'
      />

      <SectionTitle>Ascension Materials (JSON)</SectionTitle>
      <p className="text-xs text-gray-500 mb-2">
        Object ของ phase &#x2192; array ของ materials {'{'}&quot;1&quot;: [&#123;&quot;name&quot;:
        &quot;...&quot;, &quot;value&quot;: 3&#125;]{'}'}
      </p>
      <JsonEditor
        value={character.ascension_materials_data || {}}
        onChange={(val) => updateField('ascension_materials_data', val)}
        placeholder='{"1": [{"name": "Prithiva Topaz Sliver", "value": 1}]}'
      />

      <SectionTitle>Talent Materials (JSON)</SectionTitle>
      <p className="text-xs text-gray-500 mb-2">Object ของ level &#x2192; array ของ materials</p>
      <JsonEditor
        value={character.talent_materials_data || {}}
        onChange={(val) => updateField('talent_materials_data', val)}
        placeholder='{"2": [{"name": "Teachings of Freedom", "value": 3}]}'
      />
    </div>
  );
}

// =============================================
// Images Tab
// =============================================
function ImagesTab({
  character,
  updateField,
}: {
  character: CharData;
  updateField: (field: string, value: unknown) => void;
}) {
  const IMAGE_FIELDS = [
    { key: 'icon_url', label: 'Icon' },
    { key: 'card_url', label: 'Card' },
    { key: 'avatar_url', label: 'Avatar' },
    { key: 'gacha_card_url', label: 'Gacha Card' },
    { key: 'gacha_splash_url', label: 'Gacha Splash' },
    { key: 'icon_big_url', label: 'Icon Big' },
    { key: 'icon_side_url', label: 'Icon Side' },
    { key: 'namecard_url', label: 'Namecard' },
    { key: 'constellation_shape_url', label: 'Constellation Shape' },
  ] as const;

  return (
    <div className="space-y-6">
      <SectionTitle>รูปภาพ</SectionTitle>
      <p className="text-xs text-gray-500">
        ใส่ URL ของรูปภาพ แนะนำให้ใช้ CDN เช่น enka.network หรือ ambr.top
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {IMAGE_FIELDS.map(({ key, label }) => {
          const url = ((character as Record<string, unknown>)[key] as string) || '';
          return (
            <div key={key} className="space-y-2">
              <FieldInput
                label={label}
                value={url}
                onChange={(v) => updateField(key, v || null)}
                placeholder="https://..."
              />
              {url && (
                <div className="relative w-full h-32 bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={label}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================
// Shared Form Components
// =============================================
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider border-b border-gray-800 pb-2">
      {children}
    </h3>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
      />
    </div>
  );
}

function FieldNumber({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
      />
    </div>
  );
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || '-- ไม่ระบุ --'}
          </option>
        ))}
      </select>
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors resize-y"
      />
    </div>
  );
}
