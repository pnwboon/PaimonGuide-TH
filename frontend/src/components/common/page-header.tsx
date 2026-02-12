// =============================================
// PaimonGuide TH - Page Header Component
// =============================================

import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      {description && (
        <p className="text-gray-400 max-w-2xl">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
