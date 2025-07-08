// src/types/dashboard.ts
export type UserRole = "guest" | "subscriber" | "course";

export interface SubjectStat {
  id: number;
  slug: string;
  name: string;
  progress: number; // 0-100
  lastActivity: string;
}

export interface FocusTopic {
  id: number;
  name: string;
  score: number; // 0-100
}

export interface DashboardData {
  role: UserRole;
  expiresAt: string | null;
  subjects: SubjectStat[];
  focusTopics: FocusTopic[];
}
