import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'danger' | 'warning';
}

export function Alert({ variant = 'danger', className, ...props }: AlertProps) {
  const variants = {
    success: 'bg-green-50 text-green-800 border-green-200',
    danger: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border text-sm',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
