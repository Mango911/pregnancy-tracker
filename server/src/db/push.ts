import { D1Database } from '@cloudflare/workers-types';

export interface PushSubscription {
  id: number;
  user_id: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  created_at: string;
}

export async function savePushSubscription(
  db: D1Database,
  userId: number,
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  },
  userAgent?: string
): Promise<PushSubscription> {
  const result = await db
    .prepare(`
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, endpoint) DO UPDATE SET
        p256dh = excluded.p256dh,
        auth = excluded.auth,
        user_agent = excluded.user_agent
      RETURNING *
    `)
    .bind(
      userId,
      subscription.endpoint,
      subscription.keys.p256dh,
      subscription.keys.auth,
      userAgent || null
    )
    .first<PushSubscription>();

  if (!result) {
    throw new Error('Failed to save push subscription');
  }

  return result;
}

export async function getUserPushSubscriptions(
  db: D1Database,
  userId: number
): Promise<PushSubscription[]> {
  const result = await db
    .prepare('SELECT * FROM push_subscriptions WHERE user_id = ?')
    .bind(userId)
    .all<PushSubscription>();

  return result.results || [];
}

export async function getAllPushSubscriptions(db: D1Database): Promise<PushSubscription[]> {
  const result = await db
    .prepare('SELECT * FROM push_subscriptions')
    .all<PushSubscription>();

  return result.results || [];
}

export async function deletePushSubscription(
  db: D1Database,
  userId: number,
  endpoint: string
): Promise<void> {
  await db
    .prepare('DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?')
    .bind(userId, endpoint)
    .run();
}
