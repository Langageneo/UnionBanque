import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'danger' | 'warning' | 'neutral';
}

export function Badge({ variant = 'neutral', className, ...props }: BadgeProps) {
  const variants = {
    success: 'bg-green-50 text-green-700',
    danger: 'bg-red-50 text-red-700',
    warning: 'bg-amber-50 text-amber-700',
    neutral: 'bg-slate-100 text-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
