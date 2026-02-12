// =============================================
// PaimonGuide TH - Error Display Component
// =============================================

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({
  title = 'เกิดข้อผิดพลาด',
  message = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
  onRetry,
  className,
}: ErrorDisplayProps) {
  return (
    <div className={cn('flex items-center justify-center min-h-[300px]', className)}>
      <div className="text-center max-w-md">
        <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            ลองใหม่
          </button>
        )}
      </div>
    </div>
  );
}
