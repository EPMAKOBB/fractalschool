// src/app/components/AuthNav.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import useUserProfile from '@/app/lk/components/useUserProfile';

export function AuthNav() {
  const supabase = createClient();

  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  // Следим за сессией
  useEffect(() => {
    let mounted = true;

    // первичный статус
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setIsAuth(!!session);
    });

    // подписка на изменения
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setIsAuth(!!session);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase]);

  // профиль (хук сам должен уметь работать без авторизации)
  const { profile, isLoading } = useUserProfile();

  if (isAuth === null) return <span className="text-gray-500">…</span>;

  if (!isAuth) {
    return (
      <Link href="/login" className="hover:underline">
        Вход / Регистрация
      </Link>
    );
  }

  const label =
    profile?.name && profile.name.trim().length > 0
      ? profile.name
      : 'Личный кабинет';

  return (
    <Link href="/lk" className="hover:underline">
      {isLoading ? '…' : label}
    </Link>
  );
}

export default AuthNav;
