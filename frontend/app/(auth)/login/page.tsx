'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { getApiErrorMessage } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center mb-8">
        <Logo className="w-20 h-20 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">UnionBanque</h1>
        <p className="text-sm text-slate-500 mt-1">Votre banque, simple et sécurisée</p>
      </div>

      <Card className="w-full max-w-sm">
        <p className="text-sm text-slate-500 mb-6">Connectez-vous à votre espace</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            type="password"
            label="Mot de passe"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <Alert variant="danger">{error}</Alert>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
