// =============================================
// PaimonGuide TH - Artifact Detail Page
// =============================================

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ArtifactDetailClient } from './artifact-detail-client';
import type { Artifact } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArtifact(slug: string): Promise<Artifact | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as Artifact;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artifact = await getArtifact(slug);

  if (!artifact) {
    return { title: 'ไม่พบ Artifact' };
  }

  return {
    title: `${artifact.name_th} (${artifact.name_en}) - ข้อมูล Artifact Set`,
    description: `ข้อมูลชุด Artifact ${artifact.name_th} พร้อม Set Bonus 2 ชิ้นและ 4 ชิ้น`,
    openGraph: {
      images: artifact.icon_url ? [artifact.icon_url] : [],
    },
  };
}

export default async function ArtifactDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const artifact = await getArtifact(slug);

  if (!artifact) {
    notFound();
  }

  return <ArtifactDetailClient artifact={artifact} />;
}
