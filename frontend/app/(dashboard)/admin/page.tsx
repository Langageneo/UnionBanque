'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Account } from '@/types/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { StatusDot } from '@/components/ui/StatusDot';
import { formatCurrency } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    apiClient
      .get('/accounts')
      .then((res) => setAccounts(res.data))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = accounts.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.accountNumber.toLowerCase().includes(q) ||
      a.user?.firstName?.toLowerCase().includes(q) ||
      a.user?.lastName?.toLowerCase().includes(q) ||
      a.user?.email?.toLowerCase().includes(q)
    );
  });

  if (loading) return <p className="text-slate-500">Chargement...</p>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-6 h-6 text-amber-600" />
        <h1 className="text-2xl font-semibold text-slate-900">Supervision bancaire</h1>
      </div>
      <p className="text-slate-500 mb-6">
        {accounts.length} compte(s) au total sur la plateforme
      </p>

      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client, un numéro de compte..."
          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-medium text-slate-500">Client</th>
              <th className="text-left px-6 py-3 font-medium text-slate-500">Compte</th>
              <th className="text-left px-6 py-3 font-medium text-slate-500">Statut</th>
              <th className="text-right px-6 py-3 font-medium text-slate-500">Solde</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((account) => (
              <tr
                key={account.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                onClick={() => router.push(`/accounts/${account.id}`)}
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">
                    {account.user?.firstName} {account.user?.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{account.user?.email}</p>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">
                  {account.accountNumber}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <StatusDot status={account.status} />
                    <Badge variant="neutral">{account.status ?? 'ACTIVE'}</Badge>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">
                  {formatCurrency(account.balance, account.currency)}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Aucun résultat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
