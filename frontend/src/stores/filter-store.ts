// =============================================
// PaimonGuide TH - Filter Store (Zustand)
// =============================================
'use client';

import { create } from 'zustand';

interface FilterState {
  // Character filters
  characterElement?: string;
  characterWeaponType?: string;
  characterRarity?: number;
  characterSearch: string;

  // Weapon filters
  weaponType?: string;
  weaponRarity?: number;
  weaponSearch: string;

  // Actions
  setCharacterElement: (element: string | undefined) => void;
  setCharacterWeaponType: (weaponType: string | undefined) => void;
  setCharacterRarity: (rarity: number | undefined) => void;
  setCharacterSearch: (search: string) => void;
  clearCharacterFilters: () => void;

  setWeaponType: (type: string | undefined) => void;
  setWeaponRarity: (rarity: number | undefined) => void;
  setWeaponSearch: (search: string) => void;
  clearWeaponFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  // Initial state
  characterSearch: '',
  weaponSearch: '',

  // Character filter actions
  setCharacterElement: (element) => set({ characterElement: element }),
  setCharacterWeaponType: (weaponType) => set({ characterWeaponType: weaponType }),
  setCharacterRarity: (rarity) => set({ characterRarity: rarity }),
  setCharacterSearch: (search) => set({ characterSearch: search }),
  clearCharacterFilters: () =>
    set({
      characterElement: undefined,
      characterWeaponType: undefined,
      characterRarity: undefined,
      characterSearch: '',
    }),

  // Weapon filter actions
  setWeaponType: (type) => set({ weaponType: type }),
  setWeaponRarity: (rarity) => set({ weaponRarity: rarity }),
  setWeaponSearch: (search) => set({ weaponSearch: search }),
  clearWeaponFilters: () =>
    set({
      weaponType: undefined,
      weaponRarity: undefined,
      weaponSearch: '',
    }),
}));
