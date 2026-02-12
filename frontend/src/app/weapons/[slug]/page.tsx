// =============================================
// PaimonGuide TH - Weapon Detail Page
// =============================================

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { RarityStars } from '@/components/common/rarity-stars';
import { getWeaponTypeNameTh, getRarityGradient } from '@/lib/utils';
import type { Weapon } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getWeapon(slug: string): Promise<Weapon | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('weapons')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as Weapon;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const weapon = await getWeapon(slug);

  if (!weapon) return { title: 'ไม่พบอาวุธ' };

  return {
    title: `${weapon.name_th} (${weapon.name_en}) - ข้อมูลอาวุธ`,
    description: `ข้อมูลอาวุธ ${weapon.name_th} พร้อม Base ATK, Secondary Stat, และ Passive Effect`,
  };
}

export default async function WeaponDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const weapon = await getWeapon(slug);

  if (!weapon) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/weapons"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับไปรายการอาวุธ
      </Link>

      {/* Weapon Header */}
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${getRarityGradient(weapon.rarity)} p-8 mb-8`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            {weapon.icon_url ? (
              <Image
                src={weapon.icon_url}
                alt={weapon.name_en}
                width={160}
                height={160}
                className="rounded-xl"
                priority
              />
            ) : (
              <div className="w-40 h-40 bg-gray-700/50 rounded-xl flex items-center justify-center">
                <span className="text-6xl text-gray-500">⚔</span>
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <RarityStars rarity={weapon.rarity} size="lg" />
            <h1 className="text-4xl font-bold text-white mb-1 mt-2">
              {weapon.name_th}
            </h1>
            <p className="text-xl text-gray-300 mb-4">{weapon.name_en}</p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="px-3 py-1.5 bg-gray-800/60 rounded-lg">
                <span className="text-xs text-gray-400">ประเภท</span>
                <p className="text-sm font-semibold text-white">{getWeaponTypeNameTh(weapon.type)}</p>
              </div>
              <div className="px-3 py-1.5 bg-gray-800/60 rounded-lg">
                <span className="text-xs text-gray-400">Base ATK</span>
                <p className="text-sm font-semibold text-white">{weapon.base_atk}</p>
              </div>
              {weapon.secondary_stat && (
                <div className="px-3 py-1.5 bg-gray-800/60 rounded-lg">
                  <span className="text-xs text-gray-400">{weapon.secondary_stat}</span>
                  <p className="text-sm font-semibold text-white">{weapon.secondary_stat_value}</p>
                </div>
              )}
              {weapon.obtain_method && (
                <div className="px-3 py-1.5 bg-gray-800/60 rounded-lg">
                  <span className="text-xs text-gray-400">วิธีได้รับ</span>
                  <p className="text-sm font-semibold text-white">{weapon.obtain_method}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Passive */}
      {weapon.passive_name_th && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Passive Effect</h2>
          <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl">
            <h3 className="text-lg font-semibold text-amber-400 mb-2">
              {weapon.passive_name_th}
              {weapon.passive_name_en && (
                <span className="text-sm text-gray-400 ml-2">({weapon.passive_name_en})</span>
              )}
            </h3>
            <p className="text-gray-300">
              {weapon.passive_description_th || weapon.passive_description_en || 'ไม่มีข้อมูล'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
