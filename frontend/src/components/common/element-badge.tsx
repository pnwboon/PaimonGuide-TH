// =============================================
// PaimonGuide TH - Element Badge Component
// =============================================

import { cn, getElementBgClass, getElementNameTh } from '@/lib/utils';

interface ElementBadgeProps {
  element: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function ElementBadge({ element, showLabel = true, size = 'md', className }: ElementBadgeProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        sizeClasses[size],
        getElementBgClass(element),
        className
      )}
    >
      {showLabel && getElementNameTh(element)}
    </span>
  );
}
