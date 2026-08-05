import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm p-6',
        className,
      )}
      {...props}
    />
  );
}
