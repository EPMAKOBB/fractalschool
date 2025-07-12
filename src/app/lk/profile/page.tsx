// src/app/lk/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // загрузка профиля
  useEffect(() => {
    fetch("/api/lk/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setProfile(d.profile);
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile() {
    if (!profile) return;
    setLoading(true);
    const res = await fetch("/api/lk/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: profile.full_name,
        bio: profile.bio,
      }),
    });
    const json = await res.json();
    if (json.error) setError(json.error);
    else setProfile(json.profile);
    setLoading(false);
  }

  if (loading) return <p className="p-4">Загрузка…</p>;
  if (error) return <p className="p-4 text-destructive">{error}</p>;
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Профиль</h1>

      <label className="space-y-1">
        <span className="text-sm text-muted-foreground">Полное имя</span>
        <Input
          value={profile.full_name ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, full_name: e.target.value })
          }
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm text-muted-foreground">О себе</span>
        <Textarea
          rows={4}
          value={profile.bio ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, bio: e.target.value })
          }
        />
      </label>

      <Button disabled={loading} onClick={saveProfile} className="w-full">
        {loading ? "Сохраняю…" : "Сохранить"}
      </Button>
    </div>
  );
}
