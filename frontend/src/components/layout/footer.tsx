// =============================================
// PaimonGuide TH - Footer Component
// =============================================

import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-gray-950">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✦</span>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">ลิงก์ด่วน</h3>
            <ul className="space-y-2">
              {siteConfig.mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">แหล่งข้อมูล</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://genshin.hoyoverse.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Genshin Impact Official
                </a>
              </li>
              <li>
                <a
                  href="https://wiki.hoyolab.com/pc/genshin/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  HoYoLAB Wiki
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 pt-8">
          <div className="text-xs text-gray-500 space-y-1">
            <p>{siteConfig.disclaimer.th}</p>
            <p>{siteConfig.disclaimer.trademark}</p>
            <p>{siteConfig.disclaimer.copyright}</p>
            <p>{siteConfig.disclaimer.fairUse}</p>
          </div>

          <p className="text-xs text-gray-600 mt-4">
            &copy; {currentYear} {siteConfig.name}. Fan-made project.
          </p>
        </div>
      </div>
    </footer>
  );
}
