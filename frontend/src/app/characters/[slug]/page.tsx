// =============================================
// PaimonGuide TH - Character Detail Page
// =============================================

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CharacterDetailClient } from './character-detail-client';
import type { CharacterWithDetails } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCharacter(slug: string): Promise<CharacterWithDetails | null> {
  const supabase = await createServerSupabaseClient();

  // Fetch character
  const { data: character, error } = await supabase
    .from('characters')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !character) return null;

  // Fetch related data in parallel
  const [talentsRes, constellationsRes, storiesRes, voiceLinesRes, videosRes] = await Promise.all([
    supabase.from('talents').select('*').eq('character_id', character.id).order('type'),
    supabase.from('constellations').select('*').eq('character_id', character.id).order('level'),
    supabase
      .from('character_stories')
      .select('*')
      .eq('character_id', character.id)
      .order('sort_order'),
    supabase
      .from('character_voice_lines')
      .select('*')
      .eq('character_id', character.id)
      .order('sort_order'),
    supabase
      .from('character_videos')
      .select('*')
      .eq('character_id', character.id)
      .order('sort_order'),
  ]);

  return {
    ...character,
    talents: talentsRes.data || [],
    constellations: constellationsRes.data || [],
    stories: storiesRes.data || [],
    voice_lines: voiceLinesRes.data || [],
    videos: videosRes.data || [],
  } as CharacterWithDetails;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const character = await getCharacter(slug);

  if (!character) {
    return { title: 'ไม่พบตัวละคร' };
  }

  return {
    title: `${character.name_th} (${character.name_en}) - คู่มือ Build และ Team`,
    description: `คู่มือ ${character.name_th} ฉบับสมบูรณ์ พร้อม Build แนะนำ, อาวุธที่ดีที่สุด, Artifacts, และ Team Composition ภาษาไทย`,
    openGraph: {
      images: character.card_url ? [character.card_url] : [],
    },
  };
}

export default async function CharacterDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const character = await getCharacter(slug);

  if (!character) {
    notFound();
  }

  return <CharacterDetailClient character={character} />;
}
