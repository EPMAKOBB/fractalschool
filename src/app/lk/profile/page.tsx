// src/app/lk/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/* -------------------- Types & helpers -------------------- */

type Profile = {
  name: string;
  nickname: string;
  bio: string;
  avatar_url: string;
};

type ApiProfileResponse =
  | { profile: Partial<Profile> }
  | { error: string };

const isJsonResponse = (res: Response) =>
  res.headers.get('content-type')?.includes('application/json');

/* ------------------------- Page -------------------------- */

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient(); // <-- вместо import { supabase }

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({
    name: '',
    nickname: '',
    bio: '',
    avatar_url: '',
  });

  // загрузка профиля
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/lk/profile');
        const data: ApiProfileResponse = isJsonResponse(res)
          ? await res.json()
          : ({ error: await res.text() } as any);

        if (cancelled) return;

        if (!res.ok || 'error' in data) {
          setError(('error' in data && data.error) || 'Не удалось загрузить профиль');
        } else if ('profile' in data) {
          setProfile(p => ({
            ...p,
            name: data.profile.name ?? '',
            nickname: data.profile.nickname ?? '',
            bio: data.profile.bio ?? '',
            avatar_url: data.profile.avatar_url ?? '',
          }));
        }
      } catch {
        if (!cancelled) setError('Сетевая ошибка при загрузке профиля');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // сохранение профиля
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const trimmedNickname = profile.nickname.trim().toLowerCase();

    try {
      const res = await fetch('/api/lk/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, nickname: trimmedNickname }),
      });

      const data: ApiProfileResponse = isJsonResponse(res)
        ? await res.json()
        : ({ error: await res.text() } as any);

      if (!res.ok || 'error' in data) {
        setError(('error' in data && data.error) || 'Ошибка сервера');
      } else {
        setSuccess('Профиль сохранён!');
        router.refresh();
      }
    } catch {
      setError('Сетевая ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  }

  // выход из аккаунта
  const handleLogout = async () => {
    if (!window.confirm('Вы уверены, что хотите выйти из аккаунта?')) return;
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) return <p className="p-4">Загрузка…</p>;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Профиль</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Имя */}
        <div>
          <Input
            value={profile.name}
            placeholder="Иван Иванов"
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            maxLength={64}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Ваши Фамилия Имя в любом формате (необязательно)
          </p>
        </div>

        {/* Никнейм */}
        <div>
          <Input
            value={profile.nickname}
            placeholder="Super_Ivan"
            onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
            maxLength={32}
            pattern="^[a-zA-Z0-9_]{3,32}$"
            title="Никнейм: латиница/цифры/_, 3–32 символа."
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Уникальный nickname (необязательно)
          </p>
        </div>

        {/* Bio */}
        <div>
          <Textarea
            rows={4}
            value={profile.bio}
            placeholder="Пару слов о себе"
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Любая информация о себе (необязательно)
          </p>
        </div>

        {/* TODO: AvatarUploader */}

        {/* Сообщения */}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? 'Сохраняю…' : 'Сохранить'}
        </Button>
      </form>

      <hr />

      <Button type="button" variant="link" onClick={handleLogout} className="w-full">
        Выйти из аккаунта
      </Button>
    </div>
  );
}
