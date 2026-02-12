// =============================================
// PaimonGuide TH - Global Search API Route
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { SearchResult } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ data: [], error: null });
    }

    // Search across all tables in parallel
    const [charactersRes, weaponsRes, artifactsRes] = await Promise.all([
      supabase
        .from('characters')
        .select('id, slug, name_en, name_th, icon_url, rarity')
        .or(`name_en.ilike.%${query}%,name_th.ilike.%${query}%`)
        .limit(10),
      supabase
        .from('weapons')
        .select('id, slug, name_en, name_th, icon_url, rarity')
        .or(`name_en.ilike.%${query}%,name_th.ilike.%${query}%`)
        .limit(10),
      supabase
        .from('artifacts')
        .select('id, slug, name_en, name_th, icon_url, max_rarity')
        .or(`name_en.ilike.%${query}%,name_th.ilike.%${query}%`)
        .limit(10),
    ]);

    const results: SearchResult[] = [
      ...(charactersRes.data || []).map((c) => ({
        type: 'character' as const,
        id: c.id,
        slug: c.slug,
        name_en: c.name_en,
        name_th: c.name_th,
        icon_url: c.icon_url,
        rarity: c.rarity,
      })),
      ...(weaponsRes.data || []).map((w) => ({
        type: 'weapon' as const,
        id: w.id,
        slug: w.slug,
        name_en: w.name_en,
        name_th: w.name_th,
        icon_url: w.icon_url,
        rarity: w.rarity,
      })),
      ...(artifactsRes.data || []).map((a) => ({
        type: 'artifact' as const,
        id: a.id,
        slug: a.slug,
        name_en: a.name_en,
        name_th: a.name_th,
        icon_url: a.icon_url,
        rarity: a.max_rarity,
      })),
    ];

    return NextResponse.json({ data: results, error: null });
  } catch (err) {
    console.error('Search API Error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
