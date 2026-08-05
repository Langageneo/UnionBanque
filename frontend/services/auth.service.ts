import { apiClient } from '@/lib/api-client';
import { LoginResponse } from '@/types/api';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<LoginResponse> {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
