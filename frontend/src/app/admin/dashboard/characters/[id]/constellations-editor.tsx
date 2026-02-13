// =============================================
// PaimonGuide TH - Constellations Editor Component
// =============================================
'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, Save } from 'lucide-react';
import type { Constellation } from '@/types/character';

interface ConstellationsEditorProps {
  characterId: string;
  constellations: Constellation[];
  onRefresh: () => void;
}

export function ConstellationsEditor({
  characterId,
  constellations,
  onRefresh,
}: ConstellationsEditorProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editData, setEditData] = useState<Record<string, Partial<Constellation>>>({});
  const [error, setError] = useState('');

  const getEditValue = (constellation: Constellation, field: keyof Constellation) => {
    if (editData[constellation.id] && field in editData[constellation.id]) {
      return editData[constellation.id][field];
    }
    return constellation[field];
  };

  const setEditValue = (id: string, field: keyof Constellation, value: unknown) => {
    setEditData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (constellation: Constellation) => {
    if (!editData[constellation.id]) return;
    setSaving(constellation.id);
    setError('');
    try {
      const res = await fetch('/api/admin/constellations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: constellation.id, ...editData[constellation.id] }),
      });
      if (!res.ok) throw new Error('Save failed');
      setEditData((prev) => {
        const next = { ...prev };
        delete next[constellation.id];
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
      const nextLevel =
        constellations.length > 0
          ? Math.min(6, Math.max(...constellations.map((c) => c.level)) + 1)
          : 1;

      const res = await fetch('/api/admin/constellations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character_id: characterId,
          level: nextLevel,
          name_en: `Constellation ${nextLevel}`,
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
      const res = await fetch(`/api/admin/constellations?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      onRefresh();
    } catch {
      setError('ไม่สามารถลบได้');
    } finally {
      setDeleting(null);
    }
  };

  const sorted = [...constellations].sort((a, b) => a.level - b.level);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
          Constellations ({constellations.length}/6)
        </h3>
        {constellations.length < 6 && (
          <button
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
            เพิ่ม Constellation
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {sorted.length === 0 && (
        <p className="text-sm text-gray-500 py-4 text-center">
          ยังไม่มี Constellation - กดปุ่มด้านบนเพื่อเพิ่ม
        </p>
      )}

      <div className="space-y-2">
        {sorted.map((constellation) => {
          const isExpanded = expanded === constellation.id;
          const hasChanges = !!editData[constellation.id];
          return (
            <div
              key={constellation.id}
              className="border border-gray-800 rounded-lg overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : constellation.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                  C{constellation.level}
                </div>
                {constellation.icon_url && (
                  <img
                    src={constellation.icon_url}
                    alt=""
                    className="h-8 w-8 rounded bg-gray-800"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {(getEditValue(constellation, 'name_en') as string) || constellation.name_en}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(getEditValue(constellation, 'name_th') as string) ||
                      constellation.name_th ||
                      '-'}
                  </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Level (C1-C6)</label>
                      <select
                        value={String(getEditValue(constellation, 'level') || constellation.level)}
                        onChange={(e) =>
                          setEditValue(constellation.id, 'level', Number(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                      >
                        {[1, 2, 3, 4, 5, 6].map((l) => (
                          <option key={l} value={l}>
                            C{l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">ชื่อ (EN)</label>
                      <input
                        type="text"
                        value={(getEditValue(constellation, 'name_en') as string) || ''}
                        onChange={(e) => setEditValue(constellation.id, 'name_en', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">ชื่อ (TH)</label>
                      <input
                        type="text"
                        value={(getEditValue(constellation, 'name_th') as string) || ''}
                        onChange={(e) => setEditValue(constellation.id, 'name_th', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Icon URL</label>
                    <input
                      type="text"
                      value={(getEditValue(constellation, 'icon_url') as string) || ''}
                      onChange={(e) =>
                        setEditValue(constellation.id, 'icon_url', e.target.value || null)
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">คำอธิบาย (EN)</label>
                    <textarea
                      value={(getEditValue(constellation, 'description_en') as string) || ''}
                      onChange={(e) =>
                        setEditValue(constellation.id, 'description_en', e.target.value || null)
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">คำอธิบาย (TH)</label>
                    <textarea
                      value={(getEditValue(constellation, 'description_th') as string) || ''}
                      onChange={(e) =>
                        setEditValue(constellation.id, 'description_th', e.target.value || null)
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white resize-y"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                    <button
                      onClick={() => handleSave(constellation)}
                      disabled={!hasChanges || saving === constellation.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 rounded-lg text-xs font-medium transition-colors"
                    >
                      {saving === constellation.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                      บันทึก
                    </button>
                    <button
                      onClick={() => handleDelete(constellation.id)}
                      disabled={deleting === constellation.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-xs font-medium transition-colors"
                    >
                      {deleting === constellation.id ? (
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
