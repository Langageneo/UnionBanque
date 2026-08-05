'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Wallet, History } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const links = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/accounts', label: 'Comptes', icon: Wallet },
  { href: '/transactions', label: 'Historique', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <Logo />
        <h2 className="text-lg font-semibold text-white">UnionBanque</h2>
      </div>
      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-2 text-xs text-slate-500 border-t border-slate-800 pt-4">
        UnionBanque © 2026
      </div>
    </aside>
  );
}
