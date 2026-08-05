import { apiClient } from '@/lib/api-client';
import { Transaction } from '@/types/api';

export const transactionsService = {
  async deposit(accountId: string, amount: number): Promise<Transaction> {
    const res = await apiClient.post('/transactions/deposit', { accountId, amount });
    return res.data;
  },

  async withdraw(accountId: string, amount: number): Promise<Transaction> {
    const res = await apiClient.post('/transactions/withdraw', { accountId, amount });
    return res.data;
  },

  async transfer(
    sourceAccountId: string,
    destinationAccountId: string,
    amount: number,
  ): Promise<Transaction> {
    const res = await apiClient.post('/transactions/transfer', {
      sourceAccountId,
      destinationAccountId,
      amount,
    });
    return res.data;
  },

  async findByAccount(accountId: string): Promise<Transaction[]> {
    const res = await apiClient.get(`/transactions/account/${accountId}`);
    return res.data;
  },
};
