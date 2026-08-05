'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { accountsService } from '@/services/accounts.service';
import { transactionsService } from '@/services/transactions.service';
import { Account, Transaction } from '@/types/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const typeConfig = {
  DEPOSIT: { icon: ArrowDownLeft, color: 'text-green-600', bg: 'bg-green-50', label: 'Dépôt' },
  WITHDRAWAL: { icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50', label: 'Retrait' },
  TRANSFER: { icon: ArrowLeftRight, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Virement' },
};

const statusVariant = {
  COMPLETED: 'success' as const,
  PENDING: 'warning' as const,
  FAILED: 'danger' as const,
  REVERSED: 'neutral' as const,
};

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    accountsService.findByUser(parsedUser.id).then(async (accounts: Account[]) => {
      const allTxns = await Promise.all(
        accounts.map((a) => transactionsService.findByAccount(a.id)),
      );
      const merged = allTxns.flat();
      const unique = Array.from(new Map(merged.map((t) => [t.id, t])).values());
      unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTransactions(unique);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Historique</h1>
      <p className="text-slate-500 mb-8">{transactions.length} transaction(s)</p>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-medium text-slate-500">Type</th>
              <th className="text-left px-6 py-3 font-medium text-slate-500">Référence</th>
              <th className="text-left px-6 py-3 font-medium text-slate-500">Date</th>
              <th className="text-left px-6 py-3 font-medium text-slate-500">Statut</th>
              <th className="text-right px-6 py-3 font-medium text-slate-500">Montant</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => {
              const config = typeConfig[txn.type];
              const Icon = config.icon;
              return (
                <tr key={txn.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <span className="font-medium text-slate-900">{config.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{txn.reference}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(txn.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant[txn.status]}>{txn.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    {formatCurrency(txn.amount)}
                  </td>
                </tr>
              );
            })}

            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Aucune transaction pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
