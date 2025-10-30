import { D1Database } from '@cloudflare/workers-types';

export interface Record {
  id: number;
  user_id: number;
  date: string;
  sleep_hours: number | null;
  sleep_quality: number | null;
  exercise_minutes: number | null;
  exercise_type: string | null;
  diet_breakfast: string | null;
  diet_lunch: string | null;
  diet_dinner: string | null;
  diet_snacks: string | null;
  water_intake: number | null;
  mood: number | null;
  stress_level: number | null;
  body_temperature: number | null;
  weight: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function createOrUpdateRecord(
  db: D1Database,
  userId: number,
  data: Partial<Record>
): Promise<Record> {
  const {
    date,
    sleep_hours,
    sleep_quality,
    exercise_minutes,
    exercise_type,
    diet_breakfast,
    diet_lunch,
    diet_dinner,
    diet_snacks,
    water_intake,
    mood,
    stress_level,
    body_temperature,
    weight,
    notes,
  } = data;

  const result = await db
    .prepare(`
      INSERT INTO records (
        user_id, date, sleep_hours, sleep_quality, exercise_minutes, exercise_type,
        diet_breakfast, diet_lunch, diet_dinner, diet_snacks, water_intake,
        mood, stress_level, body_temperature, weight, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, date) DO UPDATE SET
        sleep_hours = excluded.sleep_hours,
        sleep_quality = excluded.sleep_quality,
        exercise_minutes = excluded.exercise_minutes,
        exercise_type = excluded.exercise_type,
        diet_breakfast = excluded.diet_breakfast,
        diet_lunch = excluded.diet_lunch,
        diet_dinner = excluded.diet_dinner,
        diet_snacks = excluded.diet_snacks,
        water_intake = excluded.water_intake,
        mood = excluded.mood,
        stress_level = excluded.stress_level,
        body_temperature = excluded.body_temperature,
        weight = excluded.weight,
        notes = excluded.notes,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `)
    .bind(
      userId,
      date,
      sleep_hours || null,
      sleep_quality || null,
      exercise_minutes || null,
      exercise_type || null,
      diet_breakfast || null,
      diet_lunch || null,
      diet_dinner || null,
      diet_snacks || null,
      water_intake || null,
      mood || null,
      stress_level || null,
      body_temperature || null,
      weight || null,
      notes || null
    )
    .first<Record>();

  if (!result) {
    throw new Error('Failed to create/update record');
  }

  return result;
}

export async function getRecordsByDateRange(
  db: D1Database,
  userId: number,
  startDate: string,
  endDate: string
): Promise<Record[]> {
  const result = await db
    .prepare(
      'SELECT * FROM records WHERE user_id = ? AND date >= ? AND date <= ? ORDER BY date DESC'
    )
    .bind(userId, startDate, endDate)
    .all<Record>();

  return result.results || [];
}

export async function getRecordByDate(
  db: D1Database,
  userId: number,
  date: string
): Promise<Record | null> {
  return await db
    .prepare('SELECT * FROM records WHERE user_id = ? AND date = ?')
    .bind(userId, date)
    .first<Record>();
}

export async function getRecentRecords(
  db: D1Database,
  userId: number,
  limit: number = 30
): Promise<Record[]> {
  const result = await db
    .prepare('SELECT * FROM records WHERE user_id = ? ORDER BY date DESC LIMIT ?')
    .bind(userId, limit)
    .all<Record>();

  return result.results || [];
}
