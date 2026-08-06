'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Wallet, User as UserIcon, MapPin, Phone, Mail } from 'lucide-react';
import { accountsService } from '@/services/accounts.service';
import { transactionsService } from '@/services/transactions.service';
import { Account, Transaction } from '@/types/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AccountStatusBanner } from '@/components/ui/AccountStatusBanner';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    Promise.all([accountsService.findOne(id), transactionsService.findByAccount(id)])
      .then(([acc, txns]) => {
        setAccount(acc);
        setTransactions(txns);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (!account) return <p className="text-slate-500">Compte introuvable.</p>;

  return (
    <div>
      <Link
        href="/accounts"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux comptes
      </Link>

      {account.status && account.status !== 'ACTIVE' && (
        <AccountStatusBanner status={account.status} reason={account.statusReason} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-mono text-sm text-slate-500">{account.accountNumber}</p>
                  <p className="text-xs text-slate-400">
                    {account.accountType === 'SAVINGS' ? 'Compte épargne' : account.accountType === 'BUSINESS' ? 'Compte professionnel' : 'Compte courant'}
                  </p>
                </div>
              </div>
              <Badge variant="neutral">{account.currency}</Badge>
            </div>

            <p className="text-sm text-slate-500 mb-1">Solde disponible</p>
            <p className="text-4xl font-bold text-slate-900 mb-4">
              {formatCurrency(account.balance, account.currency)}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
              <div>
                <p className="text-slate-400">Découvert autorisé</p>
                <p className="font-medium text-slate-900">
                  {formatCurrency(account.overdraftLimit ?? '0', account.currency)}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Ouvert le</p>
                <p className="font-medium text-slate-900">{formatDate(account.createdAt)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-900 mb-4">Historique des opérations</h3>
            <div className="divide-y divide-slate-100">
              {transactions.map((txn) => (
                <div key={txn.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {txn.type === 'DEPOSIT' ? 'Dépôt' : txn.type === 'WITHDRAWAL' ? 'Retrait' : 'Virement'}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">{txn.reference}</p>
                    <p className="text-xs text-slate-400">{formatDate(txn.createdAt)}</p>
                  </div>
                  <p
                    className={`font-semibold ${
                      txn.destinationAccountId === account.id ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {txn.destinationAccountId === account.id ? '+' : '-'}
                    {formatCurrency(txn.amount, account.currency)}
                  </p>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-slate-400 text-sm py-4">Aucune opération enregistrée.</p>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="font-semibold text-slate-900 mb-4">Titulaire du compte</h3>
            {account.user && (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-900 font-medium">
                    {account.user.firstName} {account.user.lastName}
                  </span>
                </div>
                {account.user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{account.user.email}</span>
                  </div>
                )}
                {account.user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{account.user.phone}</span>
                  </div>
                )}
                {account.user.addressLine && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span className="text-slate-600">
                      {account.user.addressLine}
                      <br />
                      {account.user.city}, {account.user.country}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
