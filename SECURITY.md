# 安全政策和实现 (Security Policy & Implementation)

## 🔒 安全概览

个人健康监测系统实现了企业级的安全措施来保护用户数据和隐私。

## 🛡️ 实现的安全特性

### 1. 认证与密码安全

#### PBKDF2 密码哈希
- **算法**: PBKDF2-HMAC-SHA256
- **迭代次数**: 100,000
- **盐值长度**: 16 字节（随机）
- **哈希长度**: 32 字节
- **实现位置**: `server/src/utils/password.ts`

**优势**:
- 抵抗彩虹表攻击
- 抵抗暴力破解
- 符合 NIST 建议

#### 密码强度要求
- 最少 12 个字符
- 必须包含大写字母 (A-Z)
- 必须包含小写字母 (a-z)
- 必须包含数字 (0-9)

示例强密码: `MyHealth2024!`

### 2. JWT Token 安全

#### Token 配置
- **算法**: HS256 (HMAC-SHA256)
- **过期时间**: 30 天
- **秘钥管理**: 通过 Wrangler secrets

#### 实现
- 位置: `server/src/utils/jwt.ts`
- 常数时间签名比较 (防止时间攻击)
- 强制 exp (过期时间) 字段验证

### 3. 时间攻击防护

#### 常数时间比较函数
```typescript
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
```

**使用位置**:
- JWT 签名验证 (jwt.ts)
- 密码验证 (password.ts)

### 4. API 速率限制

#### 配置
```
登录/注册端点:
- 时间窗口: 15 分钟
- 最大请求数: 5

其他 API 端点:
- 时间窗口: 1 分钟
- 最大请求数: 60
```

#### 实现
- 位置: `server/src/middleware/rateLimit.ts`
- 防止暴力破解
- 防止 DDoS 攻击
- 自动清理过期记录（每分钟）

### 5. 输入验证

#### Email 验证
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```
- 位置: `server/src/routes/auth.ts`
- 防止无效 email
- 最大长度: 255 字符

#### 密码验证
- 见上文密码强度要求

### 6. 密钥管理

#### 本地开发 (.dev.vars)
```
JWT_SECRET=your-secret-key
VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
```

#### 生产环境
```bash
npx wrangler secret put JWT_SECRET
npx wrangler secret put VAPID_PUBLIC_KEY
npx wrangler secret put VAPID_PRIVATE_KEY
```

**重要**:
- `.dev.vars` 在 .gitignore 中
- secrets 不存储在 wrangler.toml
- 不使用默认密钥

### 7. CORS 配置

```typescript
cors({
  origin: (origin) => {
    if (
      origin.includes('localhost') ||
      origin.includes('pages.dev')
    ) {
      return origin;
    }
    return 'https://your-app.pages.dev';
  },
  credentials: true,
})
```

- 限制跨域请求
- 只允许特定来源
- 支持生产域配置

### 8. PWA 缓存安全

#### 策略
```
API 请求:
- Handler: NetworkFirst
- 缓存时间: 5 分钟
- 超时: 5 秒

图片资源:
- Handler: CacheFirst
- 缓存时间: 1 天
- 最大条目: 50
```

**目的**: 防止缓存过期数据

### 9. 数据库安全

#### Schema 特性
- 外键约束
- 唯一约束（user_id + date）
- Check 约束（1-5 评分）
- 性能索引

#### SQL 注入防护
- 使用参数化查询（D1 处理）
- 类型安全（TypeScript）

### 10. 传输安全

#### HTTPS
- 生产环境强制 HTTPS
- 开发环境可使用 HTTP
- Cloudflare 自动 SSL

#### 安全头（需配置）
建议添加:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
```

## 📋 安全检查清单

### 开发
- [x] 密码使用 PBKDF2 哈希
- [x] JWT Token 实现
- [x] 时间攻击防护
- [x] API 速率限制
- [x] Email 格式验证
- [x] 强密码要求
- [x] 常数时间比较

### 部署
- [x] 密钥通过 wrangler secret 管理
- [x] .dev.vars 在 .gitignore
- [ ] 配置生产 CORS 域名
- [ ] 生成 VAPID 密钥
- [ ] 设置 JWT_SECRET
- [ ] HTTPS 强制
- [ ] 安全头配置

### 维护
- [ ] 定期更新依赖
- [ ] 定期审计日志
- [ ] 定期备份数据库
- [ ] 定期更新密钥
- [ ] 监控异常流量

## 🚨 安全隐患和修复

### 已修复

#### 1. 明文密钥在版本控制中 ✅
**状态**: 已修复
- **变更**: 从 wrangler.toml 移除
- **实现**: 使用 .dev.vars 和 wrangler secret

#### 2. 不安全的密码哈希 ✅
**状态**: 已修复
- **变更**: 从 SHA-256 升级到 PBKDF2
- **实现**: 带盐值和高迭代次数

#### 3. 时间攻击漏洞 ✅
**状态**: 已修复
- **变更**: 添加常数时间比较
- **实现**: 位于 jwt.ts 和 password.ts

#### 4. 缺乏 API 速率限制 ✅
**状态**: 已修复
- **实现**: 新建 rateLimit 中间件
- **配置**: 15 分钟 5 次登录

#### 5. JWT 过期检查不完整 ✅
**状态**: 已修复
- **变更**: 强制验证 exp 字段
- **位置**: auth 中间件

#### 6. 缺乏 Email 验证 ✅
**状态**: 已修复
- **实现**: 正则表达式验证
- **位置**: auth 路由

#### 7. 低密码强度要求 ✅
**状态**: 已修复
- **变更**: 从 6 字符升级到 12 字符
- **要求**: 必须包含大小写和数字

## 📚 安全资源

### 相关标准
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST 密码指南](https://pages.nist.gov/800-63-3/)
- [Web Application Security](https://cheatsheetseries.owasp.org/)

### 推荐阅读
- JWT 最佳实践
- PBKDF2 规范
- PWA 安全指南
- Cloudflare Workers 安全

## 🔄 安全更新流程

1. **监控** - 持续监控安全公告
2. **评估** - 评估对项目的影响
3. **修复** - 紧急修复严重问题
4. **测试** - 充分测试修复
5. **部署** - 部署到生产环境

## 📞 安全报告

如发现安全漏洞，请:
1. **勿公开** - 不要在 Issue 中公开
2. **私密报告** - 通过邮件或 GitHub Security Advisory
3. **详细信息** - 提供复现步骤和影响范围

---

**安全更新时间**: 2025年1月
**下次安全审计**: 待定
