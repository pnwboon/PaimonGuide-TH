// =============================================
// PaimonGuide TH - Home Page
// =============================================

import Link from 'next/link';
import { Swords, Shield, BookOpen, Search } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-gray-900 to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-4 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <span className="text-sm text-amber-400">Unofficial Fan Wiki</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              PaimonGuide TH
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            {siteConfig.description}
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <Link
              href="/search"
              className="flex items-center gap-3 px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-400 hover:border-amber-500/50 hover:text-gray-300 transition-all"
            >
              <Search className="h-5 w-5" />
              <span>ค้นหาตัวละคร, อาวุธ, Artifacts...</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <QuickLinkCard
              href="/characters"
              icon={<Swords className="h-8 w-8" />}
              title="ตัวละคร"
              description="ข้อมูลตัวละครทั้งหมด พร้อม Build แนะนำ"
              color="text-amber-400"
            />
            <QuickLinkCard
              href="/weapons"
              icon={<Shield className="h-8 w-8" />}
              title="อาวุธ"
              description="อาวุธทุกประเภท พร้อมสถิติและ Passive"
              color="text-blue-400"
            />
            <QuickLinkCard
              href="/artifacts"
              icon={<BookOpen className="h-8 w-8" />}
              title="Artifacts"
              description="ชุด Artifact แนะนำสำหรับแต่ละตัวละคร"
              color="text-purple-400"
            />
            <QuickLinkCard
              href="/builds"
              icon={<Swords className="h-8 w-8" />}
              title="Build แนะนำ"
              description="คู่มือ Build ภาษาไทยฉบับสมบูรณ์"
              color="text-green-400"
            />
          </div>
        </div>
      </section>

      {/* Element Icons Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            ธาตุทั้ง 7
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {siteConfig.elements.map((el) => (
              <Link
                key={el.key}
                href={`/characters?element=${el.key}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors"
              >
                <span
                  className="text-4xl group-hover:scale-125 transition-transform"
                  style={{ filter: `drop-shadow(0 0 8px ${el.color})` }}
                >
                  {el.icon}
                </span>
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {el.nameTh}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Quick Link Card sub-component
function QuickLinkCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-gray-600 hover:bg-gray-800 transition-all"
    >
      <div className={`${color} mb-3 group-hover:scale-110 transition-transform inline-block`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  );
}
