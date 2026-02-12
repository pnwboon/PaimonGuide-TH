// =============================================
// PaimonGuide TH - Site Configuration
// =============================================
// Public safe configuration (ไม่มี secrets)

export const siteConfig = {
  name: 'PaimonGuide TH',
  nameEn: 'PaimonGuide TH',
  description: 'คู่มือ Genshin Impact ภาษาไทยฉบับสมบูรณ์ - ตัวละคร, อาวุธ, Artifacts, Build แนะนำ และอื่นๆ',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  // SEO
  ogImage: '/og-image.png',
  locale: 'th_TH',
  alternateLocale: 'en_US',

  // Navigation Links
  mainNav: [
    { title: 'หน้าแรก', href: '/' },
    { title: 'ตัวละคร', href: '/characters' },
    { title: 'อาวุธ', href: '/weapons' },
    { title: 'Artifacts', href: '/artifacts' },
    { title: 'Build แนะนำ', href: '/builds' },
    { title: 'ค้นหา UID', href: '/uid' },
  ],

  // Social Links
  links: {
    github: 'https://github.com/paimonguide-th',
    discord: '#',
  },

  // Footer
  disclaimer: {
    th: 'เว็บไซต์นี้เป็น Unofficial Fan Wiki ไม่ได้เกี่ยวข้องหรือได้รับการสนับสนุนจาก HoYoverse/Cognosphere/miHoYo',
    trademark: 'Genshin Impact™ เป็นเครื่องหมายการค้าของ Cognosphere Pte. Ltd.',
    copyright: 'เนื้อหา ภาพ และข้อมูลจากเกมเป็นลิขสิทธิ์ของ HoYoverse',
    fairUse: 'เว็บไซต์นี้ใช้เนื้อหาภายใต้หลักการ Fair Use เพื่อการศึกษาและให้ข้อมูล',
  },

  // Element Display Config
  elements: [
    { key: 'Pyro', nameTh: 'ไฟ', color: '#FF6B6B', icon: '🔥' },
    { key: 'Hydro', nameTh: 'น้ำ', color: '#4ECDC4', icon: '💧' },
    { key: 'Cryo', nameTh: 'น้ำแข็ง', color: '#95E1D3', icon: '❄️' },
    { key: 'Electro', nameTh: 'สายฟ้า', color: '#A78BFA', icon: '⚡' },
    { key: 'Anemo', nameTh: 'ลม', color: '#86EFAC', icon: '🌀' },
    { key: 'Geo', nameTh: 'หิน', color: '#FCD34D', icon: '🪨' },
    { key: 'Dendro', nameTh: 'พืช', color: '#84CC16', icon: '🌿' },
  ],

  // Weapon Types
  weaponTypes: [
    { key: 'Sword', nameTh: 'ดาบเดี่ยว', icon: '⚔️' },
    { key: 'Claymore', nameTh: 'ดาบใหญ่', icon: '🗡️' },
    { key: 'Polearm', nameTh: 'หอก', icon: '🔱' },
    { key: 'Bow', nameTh: 'ธนู', icon: '🏹' },
    { key: 'Catalyst', nameTh: 'ตำราเวท', icon: '📖' },
  ],

  // Pagination defaults
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // Cache durations (in seconds)
  cache: {
    characters: 300, // 5 minutes
    weapons: 300,
    artifacts: 300,
    builds: 60,
    search: 60,
  },
} as const;

export type SiteConfig = typeof siteConfig;
