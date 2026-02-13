// =============================================
// PaimonGuide TH - Admin Sub-Data CRUD API
// =============================================
// จัดการ: character_stories, character_voice_lines, character_videos

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

const ALLOWED_TABLES = ['character_stories', 'character_voice_lines', 'character_videos'] as const;
type AllowedTable = (typeof ALLOWED_TABLES)[number];

function isAllowedTable(table: string): table is AllowedTable {
  return ALLOWED_TABLES.includes(table as AllowedTable);
}

async function requireAdmin() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET - List items for a character
export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const characterId = searchParams.get('character_id');

    if (!table || !isAllowedTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }
    if (!characterId) {
      return NextResponse.json({ error: 'Missing character_id' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('character_id', characterId)
      .order('sort_order');

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - Create item
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { table, ...itemData } = await request.json();

    if (!table || !isAllowedTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.from(table).insert(itemData).select().single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT - Update item
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { table, id, ...updateData } = await request.json();

    if (!table || !isAllowedTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - Delete item
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const id = searchParams.get('id');

    if (!table || !isAllowedTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
