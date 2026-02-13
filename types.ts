
export interface DayContent {
  id: number;
  title: string;
  reflection: string;
  prayer: string;
  scripture: string;
  scriptureRef: string;
}

export interface User {
  name: string;
  email: string;
}

export interface UserProgress {
  currentDay: number;
  completedDays: number[];
  onboarded: boolean;
  notes: Record<number, string>;
  darkMode: boolean;
  ambientSound: boolean;
  user: User | null;
}

export type ViewState = 'landing' | 'login' | 'onboarding' | 'dashboard' | 'day-detail';
