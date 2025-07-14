// src/app/lk/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* -------------------------------------------------- */
/*  Types & helpers                                   */
/* -------------------------------------------------- */

type Profile = {
  name: string;
  nickname: string;
  bio: string;
  avatar_url: string;
};

/** Проверяет, есть ли в ответе JSON-контент */
const isJsonResponse = (res: Response) =>
  res.headers.get("content-type")?.includes("application/json");

/* -------------------------------------------------- */
/*  Component                                         */
/* -------------------------------------------------- */

export default function ProfilePage() {
  /* ---------- state ---------- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    nickname: "",
    bio: "",
    avatar_url: "",
  });

  /* ---------- load profile ---------- */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/lk/profile");

        const data = isJsonResponse(res)
          ? await res.json()
          : { error: await res.text() };

        if (cancelled) return;

        if (!res.ok || data.error) {
          setError(data.error || "Не удалось загрузить профиль");
        } else if (data.profile) {
          setProfile({
            name: data.profile.name ?? "",
            nickname: data.profile.nickname ?? "",
            bio: data.profile.bio ?? "",
            avatar_url: data.profile.avatar_url ?? "",
          });
        }
      } catch {
        if (!cancelled) setError("Сетевая ошибка при загрузке профиля");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- save profile ---------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // нативная HTML-валидация
    if (!e.currentTarget.reportValidity()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const trimmedNickname = profile.nickname.trim().toLowerCase();

    try {
      const res = await fetch("/api/lk/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          nickname: trimmedNickname,
        }),
      });

      const data = isJsonResponse(res)
        ? await res.json()
        : { error: await res.text() };

      if (!res.ok || data.error) {
        setError(data.error || "Ошибка сервера");
      } else {
        setSuccess("Профиль сохранён!");
      }
    } catch {
      setError("Сетевая ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- UI ---------- */
  if (loading) return <p className="p-4">Загрузка…</p>;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Профиль</h1>

      {/* Имя */}
      <div>
        <Input
          value={profile.name}
          placeholder="Ермаков Виктор"
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
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
          placeholder="Super_Victor"
          onChange={(e) =>
            setProfile({ ...profile, nickname: e.target.value })
          }
          maxLength={32}
          pattern="^[a-zA-Z0-9_]{3,32}$"
          title="Никнейм может содержать только латиницу, цифры или _ , 3–32 символа."
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
          onChange={(e) =>
            setProfile({ ...profile, bio: e.target.value })
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Любая информация о себе (необязательно)
        </p>
      </div>

      {/* TODO: AvatarUploader */}

      {/* Сообщения */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Сохраняю…" : "Сохранить"}
      </Button>
    </form>
  );
}
