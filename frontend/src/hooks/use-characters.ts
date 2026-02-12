// =============================================
// PaimonGuide TH - Character Hooks
// =============================================
'use client';

import { useQuery } from '@tanstack/react-query';
import type { Character, CharacterWithDetails } from '@/types';

async function fetchCharacters(): Promise<Character[]> {
  const res = await fetch('/api/characters');
  if (!res.ok) throw new Error('Failed to fetch characters');
  const json = await res.json();
  return json.data || [];
}

async function fetchCharacter(slug: string): Promise<CharacterWithDetails> {
  const res = await fetch(`/api/characters?search=${slug}`);
  if (!res.ok) throw new Error('Failed to fetch character');
  const json = await res.json();
  if (!json.data || json.data.length === 0) {
    throw new Error('Character not found');
  }
  return json.data[0];
}

/**
 * Hook: ดึงรายการตัวละครทั้งหมด
 */
export function useCharacters() {
  return useQuery({
    queryKey: ['characters'],
    queryFn: fetchCharacters,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook: ดึงข้อมูลตัวละครเดียว
 */
export function useCharacter(slug: string) {
  return useQuery({
    queryKey: ['character', slug],
    queryFn: () => fetchCharacter(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
