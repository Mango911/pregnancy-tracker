import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth';
import records from './routes/records';
import reports from './routes/reports';
import push from './routes/push';
import { getAllPushSubscriptions } from './db/push';
import { sendPushNotification } from './utils/push';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  VAPID_EMAIL: string;
  FRONTEND_URL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS 配置
app.use(
  '/*',
  cors({
    origin: (origin) => {
      // 允许 localhost 和 Cloudflare Pages 域名
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('pages.dev')
      ) {
        return origin;
      }
      return 'https://your-app.pages.dev'; // 替换为你的域名
    },
    credentials: true,
  })
);

// 健康检查
app.get('/', (c) => {
  return c.json({
    service: 'Pregnancy Tracker API',
    status: 'healthy',
    version: '1.0.0',
  });
});

// 路由
app.route('/api/auth', auth);
app.route('/api/records', records);
app.route('/api/reports', reports);
app.route('/api/push', push);

// VAPID 公钥接口（前端需要）
app.get('/api/vapid-public-key', (c) => {
  return c.json({
    publicKey: c.env.VAPID_PUBLIC_KEY,
  });
});

// 定时任务：每天发送提醒
export default {
  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },

  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    console.log('Running scheduled task:', new Date().toISOString());

    try {
      // 获取所有 Push 订阅
      const subscriptions = await getAllPushSubscriptions(env.DB);

      console.log(`Found ${subscriptions.length} subscriptions`);

      // 发送推送通知
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
              title: '📝 每日记录提醒',
              body: '别忘了记录今天的健康数据哦！',
              icon: '/icons/icon-192x192.png',
              badge: '/icons/badge-72x72.png',
              data: {
                url: '/',
                timestamp: Date.now(),
              },
            },
            env
          )
        )
      );

      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      console.log(`Push notifications sent: ${successful} successful, ${failed} failed`);
    } catch (error) {
      console.error('Scheduled task error:', error);
    }
  },
};
