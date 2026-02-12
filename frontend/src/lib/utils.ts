// =============================================
// PaimonGuide TH - Utility Functions
// =============================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * รวม class names ด้วย clsx + tailwind-merge
 * ป้องกัน Tailwind class conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * สร้าง slug จากชื่อ
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * แปลง Element เป็นสีไทย
 */
export function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    Pyro: '#FF6B6B',
    Hydro: '#4ECDC4',
    Cryo: '#95E1D3',
    Electro: '#A78BFA',
    Anemo: '#86EFAC',
    Geo: '#FCD34D',
    Dendro: '#84CC16',
  };
  return colors[element] || '#9CA3AF';
}

/**
 * แปลง Element เป็นชื่อไทย
 */
export function getElementNameTh(element: string): string {
  const names: Record<string, string> = {
    Pyro: 'ไฟ',
    Hydro: 'น้ำ',
    Cryo: 'น้ำแข็ง',
    Electro: 'สายฟ้า',
    Anemo: 'ลม',
    Geo: 'หิน',
    Dendro: 'พืช',
  };
  return names[element] || element;
}

/**
 * แปลง WeaponType เป็นชื่อไทย
 */
export function getWeaponTypeNameTh(weaponType: string): string {
  const names: Record<string, string> = {
    Sword: 'ดาบเดี่ยว',
    Claymore: 'ดาบใหญ่',
    Polearm: 'หอก',
    Bow: 'ธนู',
    Catalyst: 'ตำราเวท',
  };
  return names[weaponType] || weaponType;
}

/**
 * แปลงจำนวนดาว (rarity) เป็น star icons
 */
export function getStars(rarity: number): string {
  return '★'.repeat(rarity);
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

/**
 * Format date เป็นภาษาไทย
 */
export function formatDateTh(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format birthday "0000-MM-DD" → "15 กรกฎาคม"
 * ตัวละครในเกมไม่มีปีเกิด จึงแสดงแค่วันและเดือน
 */
export function formatBirthdayTh(birthday: string): string {
  // strip the "0000-" or any year prefix
  const parts = birthday.replace(/^\d{4}-/, '').split('-');
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  if (!month || !day) return birthday;
  return `${day} ${THAI_MONTHS[month - 1]}`;
}

/**
 * Format release date "2021-03-02" → "2 มีนาคม 2021 (4 ปี 11 เดือนที่แล้ว)"
 */
export function formatReleaseDateTh(releaseDate: string): string {
  const parts = releaseDate.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (!year || !month || !day) return releaseDate;

  const formatted = `${day} ${THAI_MONTHS[month - 1]} ${year}`;

  // Calculate relative time
  const release = new Date(year, month - 1, day);
  const now = new Date();
  let diffYears = now.getFullYear() - release.getFullYear();
  let diffMonths = now.getMonth() - release.getMonth();
  if (now.getDate() < release.getDate()) diffMonths--;
  if (diffMonths < 0) {
    diffYears--;
    diffMonths += 12;
  }

  const parts2: string[] = [];
  if (diffYears > 0) parts2.push(`${diffYears} ปี`);
  if (diffMonths > 0) parts2.push(`${diffMonths} เดือน`);
  const relative = parts2.length > 0 ? parts2.join(' ') + 'ที่แล้ว' : 'เพิ่งเปิดตัว';

  return `${formatted} (${relative})`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Delay utility (for loading states, etc.)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * สร้าง Tailwind class สำหรับสี Element
 */
export function getElementBgClass(element: string): string {
  const classes: Record<string, string> = {
    Pyro: 'bg-pyro/20 text-pyro',
    Hydro: 'bg-hydro/20 text-hydro',
    Cryo: 'bg-cryo/20 text-cryo',
    Electro: 'bg-electro/20 text-electro',
    Anemo: 'bg-anemo/20 text-anemo',
    Geo: 'bg-geo/20 text-geo',
    Dendro: 'bg-dendro/20 text-dendro',
  };
  return classes[element] || 'bg-gray-500/20 text-gray-500';
}

/**
 * สร้าง Tailwind class สำหรับ border ตาม rarity
 */
export function getRarityBorderClass(rarity: number): string {
  const classes: Record<number, string> = {
    5: 'border-amber-400',
    4: 'border-purple-400',
    3: 'border-blue-400',
    2: 'border-green-400',
    1: 'border-gray-400',
  };
  return classes[rarity] || 'border-gray-400';
}

/**
 * สร้าง gradient background ตาม rarity
 */
export function getRarityGradient(rarity: number): string {
  const gradients: Record<number, string> = {
    5: 'from-amber-900/40 to-amber-700/20',
    4: 'from-purple-900/40 to-purple-700/20',
    3: 'from-blue-900/40 to-blue-700/20',
    2: 'from-green-900/40 to-green-700/20',
    1: 'from-gray-900/40 to-gray-700/20',
  };
  return gradients[rarity] || 'from-gray-900/40 to-gray-700/20';
}
