// =============================================
// PaimonGuide TH - Element Badge Component
// =============================================

import Image from 'next/image';
import { cn, getElementBgClass, getElementNameTh } from '@/lib/utils';

const GENSHIN_API = 'https://genshin.jmp.blue';

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

  const iconSize = size === 'sm' ? 14 : 18;
  const elementIconUrl = `${GENSHIN_API}/elements/${element.toLowerCase()}/icon`;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        sizeClasses[size],
        getElementBgClass(element),
        className
      )}
    >
      <Image
        src={elementIconUrl}
        alt={element}
        width={iconSize}
        height={iconSize}
        className="object-contain"
        unoptimized
      />
      {showLabel && getElementNameTh(element)}
    </span>
  );
}
