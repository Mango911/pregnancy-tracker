import { Context, Next } from 'hono';
import { verifyJWT } from '../utils/jwt';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verifyJWT(token, c.env.JWT_SECRET);

    // 检查 token 是否过期
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return c.json({ error: 'Token expired' }, 401);
    }

    // 将用户信息存储到上下文中
    c.set('userId', payload.userId);
    c.set('userEmail', payload.email);

    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}
