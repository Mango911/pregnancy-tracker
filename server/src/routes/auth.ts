import { Hono } from 'hono';
import { createUser, getUserByEmail } from '../db/users';
import { verifyPassword } from '../utils/password';
import { generateJWT } from '../utils/jwt';

const auth = new Hono();

// 注册
auth.post('/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    // 验证输入
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    // 检查用户是否已存在
    const existingUser = await getUserByEmail(c.env.DB, email);
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // 创建用户
    const user = await createUser(c.env.DB, email, password, name);

    // 生成 JWT
    const token = await generateJWT(
      {
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 天
      },
      c.env.JWT_SECRET
    );

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// 登录
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // 查找用户
    const user = await getUserByEmail(c.env.DB, email);
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // 验证密码
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // 生成 JWT
    const token = await generateJWT(
      {
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 天
      },
      c.env.JWT_SECRET
    );

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default auth;
