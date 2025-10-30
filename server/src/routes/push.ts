import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import {
  savePushSubscription,
  getUserPushSubscriptions,
  deletePushSubscription,
} from '../db/push';
import { sendPushNotification } from '../utils/push';

const push = new Hono();

push.use('/*', authMiddleware);

// 保存 Push 订阅
push.post('/subscribe', async (c) => {
  try {
    const userId = c.get('userId');
    const { subscription } = await c.req.json();
    const userAgent = c.req.header('User-Agent');

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return c.json({ error: 'Invalid subscription data' }, 400);
    }

    const saved = await savePushSubscription(c.env.DB, userId, subscription, userAgent);

    return c.json({ success: true, subscription: saved });
  } catch (error) {
    console.error('Save push subscription error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// 获取用户的订阅
push.get('/subscriptions', async (c) => {
  try {
    const userId = c.get('userId');
    const subscriptions = await getUserPushSubscriptions(c.env.DB, userId);

    return c.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// 取消订阅
push.delete('/subscribe', async (c) => {
  try {
    const userId = c.get('userId');
    const { endpoint } = await c.req.json();

    if (!endpoint) {
      return c.json({ error: 'Endpoint is required' }, 400);
    }

    await deletePushSubscription(c.env.DB, userId, endpoint);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete subscription error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// 测试推送
push.post('/test', async (c) => {
  try {
    const userId = c.get('userId');
    const subscriptions = await getUserPushSubscriptions(c.env.DB, userId);

    if (subscriptions.length === 0) {
      return c.json({ error: 'No subscriptions found' }, 404);
    }

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        sendPushNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          {
            title: '测试通知',
            body: '这是一条测试推送通知',
            icon: '/icons/icon-192x192.png',
          },
          c.env
        )
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;

    return c.json({
      success: true,
      sent: successful,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('Test push error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default push;
