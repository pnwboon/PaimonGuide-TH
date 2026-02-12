// =============================================
// PaimonGuide TH - Characters API Route
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const element = searchParams.get('element');
    const weaponType = searchParams.get('weapon_type');
    const rarity = searchParams.get('rarity');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const sortBy = searchParams.get('sortBy') || 'name_en';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? false : true;

    // Build query
    let query = supabase
      .from('characters')
      .select('*', { count: 'exact' });

    // Apply filters
    if (element) query = query.eq('element', element);
    if (weaponType) query = query.eq('weapon_type', weaponType);
    if (rarity) query = query.eq('rarity', parseInt(rarity));
    if (search) {
      query = query.or(`name_en.ilike.%${search}%,name_th.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Execute
    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder })
      .range(from, to);

    if (error) {
      console.error('Characters API Error:', error);
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
    console.error('Characters API Unexpected Error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
