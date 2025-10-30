export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface DailyRecord {
  id?: number;
  user_id?: number;
  date: string;
  sleep_hours?: number;
  sleep_quality?: number; // 1-5
  exercise_minutes?: number;
  exercise_type?: string;
  diet_breakfast?: string;
  diet_lunch?: string;
  diet_dinner?: string;
  diet_snacks?: string;
  water_intake?: number; // 毫升
  mood?: number; // 1-5
  stress_level?: number; // 1-5
  body_temperature?: number;
  weight?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReportStats {
  totalRecords: number;
  sleep: {
    avgHours: number;
    avgQuality: number;
  };
  exercise: {
    totalMinutes: number;
    avgMinutes: number;
    days: number;
  };
  water: {
    avgIntake: number;
  };
  mood: {
    avgMood: number;
  };
  stress: {
    avgLevel: number;
  };
  bodyTemp: {
    avg: number;
  };
  weight: {
    avg: number;
  };
}

export interface Report {
  period: {
    start: string;
    end: string;
  };
  stats: ReportStats | null;
  records: DailyRecord[];
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
