// src/app/lk/hooks/useDashboardData.ts
"use client";
import useSWR from "swr";
import { DashboardData } from "@/types/dashboard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardData() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    "/api/dashboard",
    fetcher,
  );
  return { data, error, isLoading, mutate };
}
