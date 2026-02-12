// =============================================
// PaimonGuide TH - Debounce Hook
// =============================================
'use client';

import { useState, useEffect } from 'react';

/**
 * Hook: Debounce ค่าที่เปลี่ยนแปลงบ่อย (เช่น search input)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
