// src/app/lk/components/useUserProfile.ts

import useSWR from "swr";

type Profile = {
  name: string | null;
  nickname: string | null;
  bio: string | null;
  avatar_url: string | null;
};

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.error || "Ошибка загрузки профиля");
    }
    return res.json();
  });

/**
 * useUserProfile
 * Возвращает: { profile, isLoading, isError, mutate, saveProfile }
 */
export function useUserProfile() {
  const { data, error, isLoading, mutate } = useSWR<{ profile: Profile }>(
    "/api/lk/profile",
    fetcher
  );

  // Функция для сохранения изменений профиля
  async function saveProfile(nextProfile: Profile) {
    const res = await fetch("/api/lk/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextProfile),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.error) {
      throw new Error(json?.error || "Ошибка сохранения профиля");
    }
    // Обновить swr-кеш с новым профилем
    await mutate();
    return json.profile as Profile;
  }

  return {
    profile: data?.profile ?? null,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
    saveProfile,
  };
}

export default useUserProfile;
