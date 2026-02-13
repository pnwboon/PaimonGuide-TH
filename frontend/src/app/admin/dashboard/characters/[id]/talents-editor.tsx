// =============================================
// PaimonGuide TH - Talents Editor Component
// =============================================
'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, Save } from 'lucide-react';
import type { Talent, TalentType } from '@/types/character';
import { JsonEditor } from './json-editor';

const TALENT_TYPES: { value: TalentType; label: string }[] = [
  { value: 'normal_attack', label: 'Normal Attack' },
  { value: 'elemental_skill', label: 'Elemental Skill' },
  { value: 'elemental_burst', label: 'Elemental Burst' },
  { value: 'alternate_sprint', label: 'Alternate Sprint' },
  { value: 'passive_1', label: 'Passive 1' },
  { value: 'passive_2', label: 'Passive 2' },
  { value: 'passive_3', label: 'Passive 3' },
  { value: 'passive_4', label: 'Passive 4' },
];

interface TalentsEditorProps {
  characterId: string;
  talents: Talent[];
  onRefresh: () => void;
}

export function TalentsEditor({ characterId, talents, onRefresh }: TalentsEditorProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editData, setEditData] = useState<Record<string, Partial<Talent>>>({});
  const [error, setError] = useState('');

  const getEditValue = (talent: Talent, field: keyof Talent) => {
    if (editData[talent.id] && field in editData[talent.id]) {
      return editData[talent.id][field];
    }
    return talent[field];
  };

  const setEditValue = (talentId: string, field: keyof Talent, value: unknown) => {
    setEditData((prev) => ({
      ...prev,
      [talentId]: { ...prev[talentId], [field]: value },
    }));
  };

  const handleSave = async (talent: Talent) => {
    if (!editData[talent.id]) return;
    setSaving(talent.id);
    setError('');
    try {
      const res = await fetch('/api/admin/talents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: talent.id, ...editData[talent.id] }),
      });
      if (!res.ok) throw new Error('Save failed');
      setEditData((prev) => {
        const next = { ...prev };
        delete next[talent.id];
        return next;
      });
      onRefresh();
    } catch {
      setError('ไม่สามารถบันทึกได้');
    } finally {
      setSaving(null);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/admin/talents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character_id: characterId,
          type: 'normal_attack',
          name_en: 'New Talent',
          name_th: '',
        }),
      });
      if (!res.ok) throw new Error('Create failed');
      onRefresh();
    } catch {
      setError('ไม่สามารถเพิ่มได้');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/talents?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      onRefresh();
    } catch {
      setError('ไม่สามารถลบได้');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
          Talents ({talents.length})
        </h3>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
          เพิ่ม Talent
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {talents.length === 0 && (
        <p className="text-sm text-gray-500 py-4 text-center">
          ยังไม่มี Talent - กดปุ่มด้านบนเพื่อเพิ่ม
        </p>
      )}

      <div className="space-y-2">
        {talents.map((talent) => {
          const isExpanded = expanded === talent.id;
          const hasChanges = !!editData[talent.id];
          return (
            <div key={talent.id} className="border border-gray-800 rounded-lg overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : talent.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
              >
                {talent.icon_url && (
                  <img src={talent.icon_url} alt="" className="h-8 w-8 rounded bg-gray-800" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {(getEditValue(talent, 'name_en') as string) || talent.name_en}
                  </p>
                  <p className="text-xs text-gray-500">{talent.type}</p>
                </div>
                {hasChanges && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-full">
                    มีการแก้ไข
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {/* Body */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">ประเภท</label>
                      <select
                        value={(getEditValue(talent, 'type') as string) || talent.type}
                        onChange={(e) => setEditValue(talent.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                      >
                        {TALENT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Icon URL</label>
                      <input
                        type="text"
                        value={(getEditValue(talent, 'icon_url') as string) || ''}
                        onChange={(e) =>
                          setEditValue(talent.id, 'icon_url', e.target.value || null)
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">ชื่อ (EN)</label>
                      <input
                        type="text"
                        value={(getEditValue(talent, 'name_en') as string) || ''}
                        onChange={(e) => setEditValue(talent.id, 'name_en', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">ชื่อ (TH)</label>
                      <input
                        type="text"
                        value={(getEditValue(talent, 'name_th') as string) || ''}
                        onChange={(e) => setEditValue(talent.id, 'name_th', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">คำอธิบาย (EN)</label>
                    <textarea
                      value={(getEditValue(talent, 'description_en') as string) || ''}
                      onChange={(e) =>
                        setEditValue(talent.id, 'description_en', e.target.value || null)
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">คำอธิบาย (TH)</label>
                    <textarea
                      value={(getEditValue(talent, 'description_th') as string) || ''}
                      onChange={(e) =>
                        setEditValue(talent.id, 'description_th', e.target.value || null)
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      Scaling Data (JSON)
                    </label>
                    <p className="text-[10px] text-gray-600 mb-1">
                      {`{"params": ["1-Hit DMG", ...], "levels": {"1": ["48.4%", ...], ...}}`}
                    </p>
                    <JsonEditor
                      value={getEditValue(talent, 'scaling_data') || null}
                      onChange={(val) => setEditValue(talent.id, 'scaling_data', val)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                    <button
                      onClick={() => handleSave(talent)}
                      disabled={!hasChanges || saving === talent.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 rounded-lg text-xs font-medium transition-colors"
                    >
                      {saving === talent.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                      บันทึก
                    </button>
                    <button
                      onClick={() => handleDelete(talent.id)}
                      disabled={deleting === talent.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-xs font-medium transition-colors"
                    >
                      {deleting === talent.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      ลบ
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
