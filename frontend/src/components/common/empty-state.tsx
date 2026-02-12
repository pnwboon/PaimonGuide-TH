// =============================================
// PaimonGuide TH - Empty State Component
// =============================================

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'ไม่พบข้อมูล',
  message = 'ลองเปลี่ยนตัวกรองหรือคำค้นหาใหม่',
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex items-center justify-center min-h-[300px]', className)}>
      <div className="text-center max-w-md">
        {icon || <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}
