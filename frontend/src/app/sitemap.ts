// =============================================
// PaimonGuide TH - Dynamic Sitemap
// =============================================

import type { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();

  // Fetch all slugs in parallel
  const [charactersRes, weaponsRes, artifactsRes] = await Promise.all([
    supabase.from('characters').select('slug, updated_at'),
    supabase.from('weapons').select('slug, updated_at'),
    supabase.from('artifacts').select('slug, updated_at'),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/characters`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/weapons`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/artifacts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/builds`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const characterPages: MetadataRoute.Sitemap = (charactersRes.data || []).map((c) => ({
    url: `${BASE_URL}/characters/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const weaponPages: MetadataRoute.Sitemap = (weaponsRes.data || []).map((w) => ({
    url: `${BASE_URL}/weapons/${w.slug}`,
    lastModified: new Date(w.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const artifactPages: MetadataRoute.Sitemap = (artifactsRes.data || []).map((a) => ({
    url: `${BASE_URL}/artifacts/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...characterPages, ...weaponPages, ...artifactPages];
}
