import { create } from 'zustand';
import { User } from '@/types/api';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('user');
    if (stored) {
      set({ user: JSON.parse(stored) });
    }
  },
}));
