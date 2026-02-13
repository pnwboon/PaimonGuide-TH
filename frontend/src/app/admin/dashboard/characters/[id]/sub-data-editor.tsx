// =============================================
// PaimonGuide TH - Generic Sub-Data Editor
// =============================================
// ใช้สำหรับ character_stories, character_voice_lines, character_videos
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, Save, GripVertical } from 'lucide-react';

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number';
}

interface SubDataEditorProps {
  characterId: string;
  table: string;
  title: string;
  fields: FieldDef[];
}

interface SubItem {
  id: string;
  character_id: string;
  sort_order: number;
  [key: string]: unknown;
}

export function SubDataEditor({ characterId, table, title, fields }: SubDataEditorProps) {
  const [items, setItems] = useState<SubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editData, setEditData] = useState<Record<string, Record<string, unknown>>>({});
  const [error, setError] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/sub-data?table=${table}&character_id=${characterId}`);
      if (res.ok) {
        const { data } = await res.json();
        setItems(data || []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [characterId, table]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const getEditValue = (item: SubItem, field: string) => {
    if (editData[item.id] && field in editData[item.id]) {
      return editData[item.id][field];
    }
    return item[field];
  };

  const setEditValue = (id: string, field: string, value: unknown) => {
    setEditData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (item: SubItem) => {
    if (!editData[item.id]) return;
    setSaving(item.id);
    setError('');
    try {
      const res = await fetch('/api/admin/sub-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, id: item.id, ...editData[item.id] }),
      });
      if (!res.ok) throw new Error('Save failed');
      setEditData((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      fetchItems();
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
      const defaultData: Record<string, unknown> = {
        character_id: characterId,
        sort_order: items.length,
      };

      // Set default values for each field
      for (const field of fields) {
        if (field.key === 'sort_order') continue;
        if (field.type === 'number') defaultData[field.key] = 0;
        else defaultData[field.key] = '';
      }

      const res = await fetch('/api/admin/sub-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, ...defaultData }),
      });
      if (!res.ok) throw new Error('Create failed');
      fetchItems();
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
      const res = await fetch(`/api/admin/sub-data?table=${table}&id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchItems();
    } catch {
      setError('ไม่สามารถลบได้');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
          {title} ({items.length})
        </h3>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
          เพิ่ม{title}
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {items.length === 0 && (
        <p className="text-sm text-gray-500 py-4 text-center">
          ยังไม่มี{title} - กดปุ่มด้านบนเพื่อเพิ่ม
        </p>
      )}

      <div className="space-y-2">
        {items.map((item, index) => {
          const isExpanded = expanded === item.id;
          const hasChanges = !!editData[item.id];
          const displayTitle = (getEditValue(item, 'title') as string) || `#${index + 1}`;

          return (
            <div key={item.id} className="border border-gray-800 rounded-lg overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-gray-600 shrink-0" />
                <div className="h-6 w-6 rounded bg-gray-800 flex items-center justify-center text-xs text-gray-500 shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{displayTitle}</p>
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
                <div className="px-4 pb-4 space-y-4 border-t border-gray-800 pt-4">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-gray-400 mb-1.5">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={String(getEditValue(item, field.key) ?? '')}
                          onChange={(e) => setEditValue(item.id, field.key, e.target.value || null)}
                          rows={4}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white resize-y"
                        />
                      ) : field.type === 'number' ? (
                        <input
                          type="number"
                          value={Number(getEditValue(item, field.key) ?? 0)}
                          onChange={(e) => setEditValue(item.id, field.key, Number(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                        />
                      ) : (
                        <input
                          type="text"
                          value={String(getEditValue(item, field.key) ?? '')}
                          onChange={(e) => setEditValue(item.id, field.key, e.target.value || null)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                        />
                      )}
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                    <button
                      onClick={() => handleSave(item)}
                      disabled={!hasChanges || saving === item.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 rounded-lg text-xs font-medium transition-colors"
                    >
                      {saving === item.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                      บันทึก
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-xs font-medium transition-colors"
                    >
                      {deleting === item.id ? (
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
