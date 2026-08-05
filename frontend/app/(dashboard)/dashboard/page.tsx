'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Plus } from 'lucide-react';
import { accountsService } from '@/services/accounts.service';
import { useAuthStore } from '@/store/auth.store';
import { Account, Currency } from '@/types/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

const currencies: Currency[] = ['EUR', 'USD', 'XOF', 'GBP'];

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrate = useAuthStore((s) => s.hydrateFromStorage);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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
    hydrate();
    loadAccounts();
  }, [hydrate]);

  async function handleCreateAccount(currency: Currency) {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    setCreating(true);
    try {
      await accountsService.create(parsedUser.id, currency);
      loadAccounts();
    } finally {
      setCreating(false);
    }
  }

  const totalEur = accounts
    .filter((a) => a.currency === 'EUR')
    .reduce((sum, a) => sum + Number(a.balance), 0);

  const missingCurrencies = currencies.filter(
    (c) => !accounts.some((a) => a.currency === c),
  );

  if (loading) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">
        Bonjour {user?.firstName ?? ''}
      </h1>
      <p className="text-slate-500 mb-8">Voici un aperçu de vos comptes.</p>

      <Card className="mb-8 bg-gradient-to-br from-indigo-600 to-indigo-800 border-0 text-white">
        <p className="text-indigo-200 text-sm mb-1">Solde total (EUR)</p>
        <p className="text-4xl font-semibold">{formatCurrency(totalEur, 'EUR')}</p>
      </Card>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Vos comptes
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-indigo-600" />
              </div>
              <Badge variant="neutral">{account.currency}</Badge>
            </div>
            <p className="text-xs text-slate-400 mb-1 font-mono">{account.accountNumber}</p>
            <p className="text-2xl font-semibold text-slate-900">
              {formatCurrency(account.balance, account.currency)}
            </p>
          </Card>
        ))}
      </div>

      {missingCurrencies.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Ouvrir un nouveau compte
          </h2>
          <div className="flex flex-wrap gap-2">
            {missingCurrencies.map((currency) => (
              <Button
                key={currency}
                variant="secondary"
                size="sm"
                disabled={creating}
                onClick={() => handleCreateAccount(currency)}
              >
                <Plus className="w-4 h-4 mr-1.5 inline" />
                Compte {currency}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
