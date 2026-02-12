// =============================================
// PaimonGuide TH - Weapon Hooks
// =============================================
'use client';

import { useQuery } from '@tanstack/react-query';
import type { Weapon } from '@/types';

async function fetchWeapons(): Promise<Weapon[]> {
  const res = await fetch('/api/weapons');
  if (!res.ok) throw new Error('Failed to fetch weapons');
  const json = await res.json();
  return json.data || [];
}

/**
 * Hook: ดึงรายการอาวุธทั้งหมด
 */
export function useWeapons() {
  return useQuery({
    queryKey: ['weapons'],
    queryFn: fetchWeapons,
    staleTime: 5 * 60 * 1000,
  });
}
