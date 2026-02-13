// =============================================
// PaimonGuide TH - JSON Editor Component
// =============================================
'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface JsonEditorProps {
  value: unknown;
  onChange: (val: unknown) => void;
  placeholder?: string;
}

export function JsonEditor({ value, onChange, placeholder }: JsonEditorProps) {
  const [text, setText] = useState('');
  const [parseError, setParseError] = useState('');
  const [valid, setValid] = useState(true);

  useEffect(() => {
    try {
      setText(JSON.stringify(value, null, 2));
    } catch {
      setText('');
    }
  }, [value]);

  const handleChange = (newText: string) => {
    setText(newText);
    if (!newText.trim()) {
      setParseError('');
      setValid(true);
      onChange(null);
      return;
    }
    try {
      const parsed = JSON.parse(newText);
      setParseError('');
      setValid(true);
      onChange(parsed);
    } catch (e: unknown) {
      setParseError(e instanceof Error ? e.message : 'Invalid JSON');
      setValid(false);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
        spellCheck={false}
        className={`
          w-full px-3 py-2 bg-gray-800 border rounded-lg text-sm text-white font-mono
          placeholder-gray-600 focus:outline-none focus:ring-2 transition-colors resize-y
          ${
            valid
              ? 'border-gray-700 focus:ring-amber-500/50 focus:border-amber-500'
              : 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
          }
        `}
      />
      {parseError && (
        <div className="flex items-center gap-2 text-xs text-red-400">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <span>{parseError}</span>
        </div>
      )}
      {valid && text.trim() && !parseError && (
        <div className="flex items-center gap-2 text-xs text-green-400">
          <CheckCircle2 className="h-3 w-3 shrink-0" />
          <span>JSON ถูกต้อง</span>
        </div>
      )}
    </div>
  );
}
