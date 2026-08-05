'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export function Topbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  async function handleLogout() {
    await authService.logout();
    localStorage.removeItem('user');
    router.push('/login');
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div />
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <span className="text-sm font-medium text-slate-700">
              {user.firstName} {user.lastName}
            </span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-1.5 inline" />
          Déconnexion
        </Button>
      </div>
    </header>
  );
}
