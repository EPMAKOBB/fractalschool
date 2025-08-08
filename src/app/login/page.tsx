// src/app/login/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 1) Вынесенная форма
function LoginForm() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorMessage = searchParams.get('error');
    if (errorMessage) setError(errorMessage);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setMessage(null);
    setLoading(true);

    const redirectUrl = `${window.location.origin}/auth/callback`;

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectUrl },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      setMessage('Ссылка для входа отправлена. Проверьте почту.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Вход / регистрация</h1>

      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          type="email"
          placeholder="Ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full"
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Отправка...' : 'Получить ссылку для входа'}
        </Button>
      </form>

      {error && <p className="mt-4 text-center text-destructive">{error}</p>}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

// 2) Обёртка с Suspense
export default function LoginPage() {
  return (
    <main className="p-6">
      <Suspense fallback={<div>Загрузка...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
