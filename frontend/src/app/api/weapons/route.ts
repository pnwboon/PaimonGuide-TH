// =============================================
// PaimonGuide TH - Weapons API Route
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type');
    const rarity = searchParams.get('rarity');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 500);

    let query = supabase
      .from('weapons')
      .select('*', { count: 'exact' });

    if (type) query = query.eq('type', type);
    if (rarity) query = query.eq('rarity', parseInt(rarity));
    if (search) {
      query = query.or(`name_en.ilike.%${search}%,name_th.ilike.%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('rarity', { ascending: false })
      .order('name_en', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Weapons API Error:', error);
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      error: null,
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (err) {
    console.error('Weapons API Unexpected Error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
