import { apiClient } from '@/lib/api-client';
import { Account, Currency } from '@/types/api';

export const accountsService = {
  async findByUser(userId: string): Promise<Account[]> {
    const res = await apiClient.get(`/accounts/user/${userId}`);
    return res.data;
  },

  async findOne(id: string): Promise<Account> {
    const res = await apiClient.get(`/accounts/${id}`);
    return res.data;
  },

  async create(userId: string, currency?: Currency): Promise<Account> {
    const res = await apiClient.post('/accounts', { userId, currency });
    return res.data;
  },
};
