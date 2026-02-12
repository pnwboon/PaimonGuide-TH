// =============================================
// PaimonGuide TH - Not Found Page
// =============================================

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <span className="text-8xl mb-4 block">404</span>
        <h1 className="text-2xl font-bold text-white mb-2">ไม่พบหน้านี้</h1>
        <p className="text-gray-400 mb-6">
          หน้าที่คุณกำลังมองหาไม่มีอยู่หรืออาจถูกย้ายไปแล้ว
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium rounded-lg transition-colors"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}
