import { D1Database } from '@cloudflare/workers-types';
import { hashPassword } from '../utils/password';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export async function createUser(
  db: D1Database,
  email: string,
  password: string,
  name?: string
): Promise<User> {
  const passwordHash = await hashPassword(password);

  const result = await db
    .prepare(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?) RETURNING *'
    )
    .bind(email, passwordHash, name || null)
    .first<User>();

  if (!result) {
    throw new Error('Failed to create user');
  }

  return result;
}

export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> {
  return await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first<User>();
}

export async function getUserById(db: D1Database, id: number): Promise<User | null> {
  return await db
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first<User>();
}
