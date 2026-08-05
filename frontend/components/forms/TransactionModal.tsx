'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { transactionsService } from '@/services/transactions.service';
import { getApiErrorMessage } from '@/lib/api-client';
import { Account } from '@/types/api';

type TxnMode = 'deposit' | 'withdraw' | 'transfer' | null;

interface TransactionModalProps {
  mode: TxnMode;
  accounts: Account[];
  onClose: () => void;
  onSuccess: () => void;
}

const titles = {
  deposit: 'Effectuer un dépôt',
  withdraw: 'Effectuer un retrait',
  transfer: 'Effectuer un virement',
};

export function TransactionModal({ mode, accounts, onClose, onSuccess }: TransactionModalProps) {
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '');
  const [destAccountId, setDestAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!mode) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const numAmount = parseFloat(amount);

      if (mode === 'deposit') {
        await transactionsService.deposit(accountId, numAmount);
      } else if (mode === 'withdraw') {
        await transactionsService.withdraw(accountId, numAmount);
      } else if (mode === 'transfer') {
        await transactionsService.transfer(accountId, destAccountId, numAmount);
      }

      onSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={!!mode} onClose={onClose} title={titles[mode]}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          id="account"
          label={mode === 'transfer' ? 'Compte source' : 'Compte'}
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.accountNumber} — {acc.currency}
            </option>
          ))}
        </Select>

        {mode === 'transfer' && (
          <Select
            id="destAccount"
            label="Compte destinataire (ID)"
            value={destAccountId}
            onChange={(e) => setDestAccountId(e.target.value)}
            required
          >
            <option value="">Sélectionner...</option>
            {accounts
              .filter((a) => a.id !== accountId)
              .map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountNumber} — {acc.currency}
                </option>
              ))}
          </Select>
        )}

        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          label="Montant"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Traitement...' : 'Confirmer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
