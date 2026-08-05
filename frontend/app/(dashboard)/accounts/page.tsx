'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { accountsService } from '@/services/accounts.service';
import { Account } from '@/types/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TransactionModal } from '@/components/forms/TransactionModal';
import { formatCurrency, formatDate } from '@/lib/utils';

type TxnMode = 'deposit' | 'withdraw' | 'transfer' | null;

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<TxnMode>(null);

  function loadAccounts() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    accountsService
      .findByUser(parsedUser.id)
      .then(setAccounts)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  function handleSuccess() {
    setModalMode(null);
    setLoading(true);
    loadAccounts();
  }

  if (loading) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Mes comptes</h1>
          <p className="text-slate-500">{accounts.length} compte(s) actif(s)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setModalMode('deposit')}>
            <ArrowDownLeft className="w-4 h-4 mr-1.5 inline" />
            Dépôt
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setModalMode('withdraw')}>
            <ArrowUpRight className="w-4 h-4 mr-1.5 inline" />
            Retrait
          </Button>
          <Button size="sm" onClick={() => setModalMode('transfer')}>
            <ArrowLeftRight className="w-4 h-4 mr-1.5 inline" />
            Virement
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => (
          <Card key={account.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-mono text-sm text-slate-500">{account.accountNumber}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ouvert le {formatDate(account.createdAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="neutral" className="mb-1">
                {account.currency}
              </Badge>
              <p className="text-xl font-semibold text-slate-900">
                {formatCurrency(account.balance, account.currency)}
              </p>
            </div>
          </Card>
        ))}

        {accounts.length === 0 && <p className="text-slate-500">Aucun compte trouvé.</p>}
      </div>

      <TransactionModal
        mode={modalMode}
        accounts={accounts}
        onClose={() => setModalMode(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
