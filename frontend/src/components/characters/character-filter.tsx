// =============================================
// PaimonGuide TH - Character Filter Component
// =============================================
'use client';

import { cn } from '@/lib/utils';
import { ELEMENTS, WEAPON_TYPES, CHARACTER_RARITIES } from '@/config/constants';
import { siteConfig } from '@/config/site';
import { X } from 'lucide-react';

interface CharacterFilterProps {
  selectedElement?: string;
  selectedWeaponType?: string;
  selectedRarity?: number;
  onElementChange: (element: string | undefined) => void;
  onWeaponTypeChange: (weaponType: string | undefined) => void;
  onRarityChange: (rarity: number | undefined) => void;
  onClearAll: () => void;
  className?: string;
}

export function CharacterFilter({
  selectedElement,
  selectedWeaponType,
  selectedRarity,
  onElementChange,
  onWeaponTypeChange,
  onRarityChange,
  onClearAll,
  className,
}: CharacterFilterProps) {
  const hasFilters = selectedElement || selectedWeaponType || selectedRarity;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Element Filter */}
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">ธาตุ</h4>
        <div className="flex flex-wrap gap-2">
          {siteConfig.elements.map((el) => (
            <button
              key={el.key}
              onClick={() => onElementChange(selectedElement === el.key ? undefined : el.key)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
                selectedElement === el.key
                  ? 'bg-white/20 text-white ring-1 ring-white/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              )}
            >
              {el.icon} {el.nameTh}
            </button>
          ))}
        </div>
      </div>

      {/* Weapon Type Filter */}
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">ประเภทอาวุธ</h4>
        <div className="flex flex-wrap gap-2">
          {siteConfig.weaponTypes.map((wt) => (
            <button
              key={wt.key}
              onClick={() => onWeaponTypeChange(selectedWeaponType === wt.key ? undefined : wt.key)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
                selectedWeaponType === wt.key
                  ? 'bg-white/20 text-white ring-1 ring-white/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              )}
            >
              {wt.icon} {wt.nameTh}
            </button>
          ))}
        </div>
      </div>

      {/* Rarity Filter */}
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">ระดับดาว</h4>
        <div className="flex gap-2">
          {CHARACTER_RARITIES.map((r) => (
            <button
              key={r}
              onClick={() => onRarityChange(selectedRarity === r ? undefined : r)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
                selectedRarity === r
                  ? 'bg-white/20 text-white ring-1 ring-white/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              )}
            >
              {'★'.repeat(r)}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
        >
          <X className="h-3 w-3" />
          ล้างตัวกรองทั้งหมด
        </button>
      )}
    </div>
  );
}
