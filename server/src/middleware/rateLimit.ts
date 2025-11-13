import { Context, Next } from 'hono';

interface RateLimitConfig {
  windowMs: number; // 时间窗口（毫秒）
  maxRequests: number; // 时间窗口内的最大请求数
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

// 存储客户端请求记录（生产环境建议使用 Redis 或 KV）
const requestMap = new Map<string, RequestRecord>();

/**
 * 速率限制中间件
 * @param config 配置对象
 * @returns 中间件函数
 */
export function rateLimitMiddleware(config: RateLimitConfig) {
  return async (c: Context, next: Next) => {
    // 获取客户端 IP（考虑代理）
    const clientIP = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';

    const now = Date.now();
    let record = requestMap.get(clientIP);

    // 如果没有记录或者时间窗口已过期，创建新记录
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      requestMap.set(clientIP, record);
    } else {
      record.count++;
    }

    // 检查是否超过限制
    if (record.count > config.maxRequests) {
      const resetTime = new Date(record.resetTime).toUTCString();
      return c.json(
        {
          error: 'Too many requests',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        },
        429
      );
    }

    // 添加速率限制信息到响应头
    c.header('X-RateLimit-Limit', config.maxRequests.toString());
    c.header('X-RateLimit-Remaining', (config.maxRequests - record.count).toString());
    c.header('X-RateLimit-Reset', record.resetTime.toString());

    await next();
  };
}

/**
 * 定期清理过期的请求记录（防止内存泄漏）
 */
export function cleanupOldRecords() {
  const now = Date.now();
  for (const [key, record] of requestMap.entries()) {
    if (now > record.resetTime) {
      requestMap.delete(key);
    }
  }
}

// 每分钟清理一次过期记录
setInterval(cleanupOldRecords, 60000);
