// =============================================
// PaimonGuide TH - Rarity Stars Component
// =============================================

import { cn } from '@/lib/utils';

interface RarityStarsProps {
  rarity: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RarityStars({ rarity, size = 'md', className }: RarityStarsProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const colorClasses: Record<number, string> = {
    5: 'text-amber-400',
    4: 'text-purple-400',
    3: 'text-blue-400',
    2: 'text-green-400',
    1: 'text-gray-400',
  };

  return (
    <span className={cn(sizeClasses[size], colorClasses[rarity] || 'text-gray-400', className)}>
      {'★'.repeat(rarity)}
    </span>
  );
}
