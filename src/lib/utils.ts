// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidNickname(nickname: string): boolean {
  return /^[a-zA-Z0-9_]{3,32}$/.test(nickname);
}