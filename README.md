# 个人健康监测系统 (Personal Health Tracker)

基于 Cloudflare 全家桶（Pages + Workers + D1 + Web Push）构建的通用个人健康监测应用。支持睡眠、运动、饮食、心理健康、生理指标等多维度数据记录与分析。

## ✨ 功能特性

- ✅ 完整的用户认证系统（注册/登录）- 支持强密码、Email 验证
- 📝 灵活的每日健康数据记录
  - 睡眠：时长、质量
  - 运动：时长、类型、强度
  - 饮食：早午晚餐、零食、饮水
  - 心理健康：情绪、压力、焦虑
  - 生理指标：体温、体重、心率、血压
  - 症状和用药记录
- 📊 可视化统计报告（周报/月报）
- 🔔 Web Push 推送提醒
- 🌓 深色模式支持
- 📱 iOS 风格 UI 设计
- 💾 离线数据缓存
- 🚀 可安装到手机主屏幕
- 🔒 高安全性（PBKDF2 密码哈希、JWT Token、速率限制）

## 🏗️ 技术栈

### 前端
- Vue 3 + TypeScript
- Vite（现代化构建工具）
- TailwindCSS（响应式设计）
- Pinia（轻量级状态管理）
- Chart.js（数据可视化）
- PWA（Service Worker、离线支持）

### 后端
- Cloudflare Workers（无服务器运行环境）
- Hono（轻量级 Web 框架）
- D1 数据库（SQLite）
- Web Push API（推送通知）

### 安全特性
- PBKDF2 密码哈希（带盐值，100000 次迭代）
- JWT Token 认证（30 天过期）
- API 速率限制（防止暴力破解）
- 常数时间比较（防止时间攻击）
- HTTPS 强制
- CORS 配置

## 📦 项目结构

```
health-tracker/
├── app/                     # Vue 3 PWA 前端
│   ├── src/
│   │   ├── api/            # API 客户端
│   │   ├── components/     # Vue 组件
│   │   ├── views/          # 页面视图
│   │   ├── stores/         # Pinia 状态管理
│   │   ├── router/         # 路由配置
│   │   ├── styles/         # 全局样式
│   │   ├── types/          # TypeScript 类型
│   │   └── main.ts         # 入口点
│   ├── public/
│   │   ├── manifest.json   # PWA manifest
│   │   ├── sw.js           # Service Worker
│   │   └── icons/          # 应用图标
│   ├── vite.config.ts
│   └── package.json
│
├── server/                  # Cloudflare Workers 后端
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── db/             # 数据库操作
│   │   ├── middleware/     # 中间件（认证、速率限制）
│   │   ├── utils/          # 工具函数（JWT、密码、推送）
│   │   └── index.ts        # Worker 入口
│   ├── schema.sql          # D1 数据库 Schema
│   ├── wrangler.toml       # Cloudflare Workers 配置
│   ├── .dev.vars.example   # 本地开发环境变量示例
│   └── package.json
│
├── README.md               # 项目文档
├── .gitignore              # Git 忽略配置
├── package.json            # 根 Monorepo 配置
└── bun.lockb               # Bun 依赖锁定文件
```

## 🚀 快速开始

### 前置要求

- [Bun](https://bun.sh/) >= 1.0.0
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- Cloudflare 账户

### 1. 克隆项目

```bash
git clone <repository>
cd health-tracker
bun install
```

### 2. 后端部署

#### 2.1 创建 D1 数据库

```bash
cd server
npx wrangler d1 create health-tracker-db
```

记录返回的 `database_id`，更新到 `wrangler.toml`：

```toml
[[d1_databases]]
database_id = "YOUR_DATABASE_ID_HERE"
```

#### 2.2 初始化数据库

```bash
# 应用 schema
npx wrangler d1 execute health-tracker-db --file schema.sql
```

#### 2.3 生成 VAPID 密钥（用于 Web Push）

```bash
npx web-push generate-vapid-keys
```

#### 2.4 配置本地开发密钥

复制 `.dev.vars.example` 为 `.dev.vars`：

```bash
cp .dev.vars.example .dev.vars
```

编辑 `.dev.vars` 并填入：

```env
JWT_SECRET=your-random-secret-key-minimum-32-chars
VAPID_PUBLIC_KEY=your-generated-vapid-public-key
VAPID_PRIVATE_KEY=your-generated-vapid-private-key
```

⚠️ **重要**：`.dev.vars` 已在 `.gitignore` 中，不会被上传

#### 2.5 配置生产密钥

使用 Wrangler 创建生产密钥：

```bash
# 交互式设置密钥
npx wrangler secret put JWT_SECRET
npx wrangler secret put VAPID_PUBLIC_KEY
npx wrangler secret put VAPID_PRIVATE_KEY
```

#### 2.6 部署到 Cloudflare Workers

```bash
npm run deploy
```

记录返回的 Worker URL，例如：`https://health-tracker-api.your-account.workers.dev`

### 3. 前端部署

#### 3.1 配置环境变量

编辑 `app/.env.development`（本地开发）：

```env
VITE_API_URL=http://localhost:8787
```

编辑 `app/.env.production`（生产环境）：

```env
VITE_API_URL=https://health-tracker-api.your-account.workers.dev
```

#### 3.2 本地开发

**终端 1 - 后端**：

```bash
cd server
npm run dev
```

**终端 2 - 前端**：

```bash
cd app
npm run dev
```

访问 `http://localhost:3000`

#### 3.3 构建生产版本

```bash
# 根目录
npm run build
```

#### 3.4 部署到 Cloudflare Pages

方式一：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages**
3. 点击 **Create a project** → **Upload assets**
4. 上传 `app/dist` 文件夹

方式二：使用 CLI

```bash
cd app
npm run build
npx wrangler pages deploy dist
```

### 4. 配置 CORS

在 `server/src/index.ts` 中更新 CORS 配置：

```typescript
origin: (origin) => {
  if (
    origin.includes('localhost') ||
    origin.includes('your-app.pages.dev')
  ) {
    return origin;
  }
  return 'https://your-app.pages.dev';
}
```

重新部署后端：

```bash
cd server
npm run deploy
```

## 📱 PWA 安装

### iOS（Safari）

1. 访问应用 URL
2. 点击底部 **分享** 按钮
3. 选择 **添加到主屏幕**
4. 点击 **添加**

⚠️ **注意**：推送通知需要 iOS 16.4+ 且从主屏幕图标启动

### Android（Chrome）

1. 访问应用 URL
2. 点击菜单（三点）→ **安装应用**
3. 确认安装

## 🔧 开发指南

### 项目命令

```bash
# 开发环境（前后端）
npm run dev

# 仅前端
npm run dev:app

# 仅后端
npm run dev:server

# 构建前端
npm run build

# 构建检查（编译 + 类型检查）
npm run build:check

# 部署（前后端）
npm run deploy

# 部署后端
npm run deploy:server

# 部署前端
npm run deploy:app
```

### 数据库管理

```bash
# 查看本地数据库（开发）
npx wrangler d1 execute health-tracker-db --local --command "SELECT * FROM users"

# 查看生产数据库
npx wrangler d1 execute health-tracker-db --command "SELECT * FROM users"

# 执行 SQL 文件
npx wrangler d1 execute health-tracker-db --file schema.sql
```

### 修改定时提醒

编辑 `server/wrangler.toml`：

```toml
[triggers]
crons = ["0 1 * * *"]  # Cron 格式：分 时 日 月 星期
```

当前设置：每天 UTC 01:00（北京时间 09:00）发送提醒

### 密码安全要求

- 最少 12 个字符
- 必须包含大写字母
- 必须包含小写字母
- 必须包含数字

例如：`MyHealth2024!`

## 📊 数据库设计

### users 表
- 用户认证和基本信息
- 字段：email、password_hash、name、age、gender、health_goals

### records 表
- 每日健康记录
- 支持多维度数据：睡眠、运动、饮食、心理、生理指标
- 字段：超过 20 个健康指标字段

### push_subscriptions 表
- Web Push 订阅管理
- 字段：endpoint、keys、notification_enabled

详见 `server/schema.sql`

## 🔒 安全特性

### 认证安全
- ✅ PBKDF2 密码哈希（100000 次迭代）
- ✅ 随机盐值（16 字节）
- ✅ JWT 30 天过期
- ✅ 强密码要求（12+ 字符、大小写、数字）

### API 安全
- ✅ 速率限制
  - 登录/注册：15 分钟 5 次
  - 其他 API：1 分钟 60 次
- ✅ 常数时间比较（防止时间攻击）
- ✅ Email 格式验证
- ✅ CORS 限制

### 数据安全
- ✅ HTTPS 强制
- ✅ Token 存储在 localStorage
- ✅ 敏感信息不在 Git 历史中

### 密钥管理
- ✅ Secrets 不在 wrangler.toml 中
- ✅ 使用 `.dev.vars` 和 `wrangler secret put`
- ✅ .gitignore 保护

## 🎨 UI 定制

### 修改主题色

编辑 `app/tailwind.config.js`：

```javascript
colors: {
  ios: {
    blue: '#007AFF',  // 修改颜色
  }
}
```

### 深色模式

自动根据系统设置，也可手动切换（首页右上角）

## 📈 性能优化

- Service Worker 离线支持
- 智能缓存策略：
  - API：NetworkFirst（5 分钟缓存）
  - 图片：CacheFirst（1 天缓存）
- 代码分割和懒加载
- PWA 自动更新

## 🐛 常见问题

### Q: 推送通知不工作？

A:
- 确保 iOS 16.4+ 或 Android Chrome
- 从主屏幕图标启动应用
- 允许通知权限
- 检查 VAPID 密钥配置

### Q: API 请求失败？

A:
- 检查 CORS 配置和前端 API URL
- 确认后端已部署
- 查看浏览器控制台和后端日志
- 检查速率限制（HTTP 429）

### Q: 数据库初始化失败？

A:
- 确认 database_id 正确
- 使用 `npx wrangler d1 list` 查看数据库
- 检查 schema.sql 权限

### Q: 本地开发时 VAPID 密钥错误？

A:
- 确认 `.dev.vars` 文件存在
- 检查密钥格式正确
- 重启开发服务器

## 📝 TODO

- [ ] 数据导出（CSV/JSON/PDF）
- [ ] 多语言支持（i18n）
- [ ] 端到端数据加密
- [ ] 社交分享功能
- [ ] AI 健康建议
- [ ] 多设备同步
- [ ] 健康目标跟踪
- [ ] 数据可视化增强

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**用 ❤️ 使用 Cloudflare Stack 构建**

**最后更新**: 2025年1月
