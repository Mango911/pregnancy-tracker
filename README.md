# 备孕记录 PWA 应用

基于 Cloudflare 全家桶（Pages + Workers + D1 + Web Push）构建的自用备孕健康记录应用。

## ✨ 功能特性

- ✅ 完整的用户认证系统（注册/登录）
- 📝 每日健康数据记录（睡眠、运动、饮食、心情等）
- 📊 可视化统计报告（周报/月报）
- 🔔 Web Push 推送提醒
- 🌓 深色模式支持
- 📱 iOS 风格 UI 设计
- 💾 离线数据缓存
- 🚀 可安装到 iOS 主屏幕

## 🏗️ 技术栈

### 前端
- Vue 3 + TypeScript
- Vite
- TailwindCSS
- Pinia (状态管理)
- Chart.js (数据可视化)
- PWA (Service Worker)

### 后端
- Cloudflare Workers
- Hono (路由框架)
- D1 数据库
- Web Push API

## 📦 项目结构

```
pregnancy-tracker/
├── app/                 # Vue 3 前端
│   ├── src/
│   │   ├── api/             # API 封装
│   │   ├── components/      # Vue 组件
│   │   ├── views/           # 页面视图
│   │   ├── stores/          # Pinia 状态管理
│   │   ├── router/          # 路由配置
│   │   ├── styles/          # 全局样式
│   │   ├── types/           # TypeScript 类型
│   │   └── main.ts
│   ├── public/
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   └── icons/
│   └── package.json
│
└── server/                  # Cloudflare Workers 后端
    ├── src/
    │   ├── routes/          # API 路由
    │   ├── db/              # 数据库操作
    │   ├── middleware/      # 中间件
    │   ├── utils/           # 工具函数
    │   └── index.ts
    ├── schema.sql           # D1 数据库 Schema
    ├── wrangler.toml
    └── package.json
```

## 🚀 快速开始

### 1. 克隆项目

```bash
cd pregnancy-tracker
```

### 2. 后端部署

#### 2.1 安装依赖

```bash
cd server
npm install
```

#### 2.2 创建 D1 数据库

```bash
# 创建数据库
npx wrangler d1 create pregnancy-tracker-db

# 记录返回的 database_id，填入 wrangler.toml
```

#### 2.3 初始化数据库

```bash
# 本地开发环境
npm run db:local

# 生产环境
npm run db:init
```

#### 2.4 生成 VAPID 密钥（用于 Web Push）

```bash
npx web-push generate-vapid-keys
```

将生成的密钥填入 `wrangler.toml` 的 `VAPID_PUBLIC_KEY` 和 `VAPID_PRIVATE_KEY`。

#### 2.5 配置环境变量

编辑 `server/wrangler.toml`：

```toml
[vars]
JWT_SECRET = "your-super-secret-jwt-key-change-this"
VAPID_PUBLIC_KEY = "your-vapid-public-key"
VAPID_PRIVATE_KEY = "your-vapid-private-key"
VAPID_EMAIL = "mailto:your-email@example.com"
```

#### 2.6 部署到 Cloudflare Workers

```bash
npm run deploy
```

部署成功后，记录你的 Worker URL（例如：`https://pregnancy-tracker-api.your-account.workers.dev`）。

### 3. 前端部署

#### 3.1 安装依赖

```bash
cd app
npm install
```

#### 3.2 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env`，填入后端 Worker URL：

```env
VITE_API_URL=https://pregnancy-tracker-api.your-account.workers.dev
```

#### 3.3 本地开发

```bash
npm run dev
```

访问 `http://localhost:3000`。

#### 3.4 构建生产版本

```bash
npm run build
```

#### 3.5 部署到 Cloudflare Pages

方式一：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages**
3. 点击 **Create a project**
4. 连接你的 Git 仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment variables**: 添加 `VITE_API_URL`
6. 点击 **Save and Deploy**

方式二：使用 Wrangler CLI

```bash
npx wrangler pages deploy dist
```

### 4. 配置 CORS

在后端 `src/index.ts` 中更新 CORS 配置，允许你的前端域名：

```typescript
origin: (origin) => {
  if (
    origin.includes('localhost') ||
    origin.includes('your-app.pages.dev') // 替换为你的 Pages 域名
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

## 📱 PWA 安装（iOS）

### 在 Safari 浏览器中：

1. 访问你的应用 URL
2. 点击底部的 **分享** 按钮
3. 选择 **添加到主屏幕**
4. 点击 **添加**

### 启用推送通知：

1. 打开应用（从主屏幕图标启动）
2. 在首页点击 **每日提醒** 开关
3. 允许通知权限

⚠️ **注意**：iOS 16.4+ 才支持 PWA 推送通知，且必须从主屏幕图标启动的应用中才能工作。

## 🔧 开发说明

### 本地开发（前后端联调）

1. 启动后端（本地模拟）：

```bash
cd server
npm run dev
# 运行在 http://localhost:8787
```

2. 启动前端：

```bash
cd app
npm run dev
# 运行在 http://localhost:3000
```

3. 前端会自动连接到本地后端 API。

### 数据库管理

```bash
# 查看本地数据库
npx wrangler d1 execute pregnancy-tracker-db --local --command "SELECT * FROM users"

# 查看生产数据库
npx wrangler d1 execute pregnancy-tracker-db --command "SELECT * FROM users"
```

### 修改定时任务时间

编辑 `server/wrangler.toml`：

```toml
[triggers]
crons = ["0 1 * * *"]  # 每天 UTC 01:00 (北京时间 09:00)
```

Cron 语法：`分 时 日 月 星期`

## 🎨 UI 定制

### 修改主题色

编辑 `app/tailwind.config.js`：

```javascript
colors: {
  ios: {
    blue: '#007AFF',  // 修改为你喜欢的颜色
    // ...
  }
}
```

### 修改深色模式

深色模式自动根据系统设置启用，也可以手动切换（首页右上角太阳/月亮图标）。

## 📊 数据库设计

### users 表
- 用户认证信息

### records 表
- 每日健康记录
- 包含睡眠、运动、饮食、心情、健康指标等

### push_subscriptions 表
- Web Push 订阅信息

详见 `server/schema.sql`。

## 🔒 安全注意事项

1. **修改 JWT_SECRET**：在 `wrangler.toml` 中设置强密码
2. **HTTPS Only**：生产环境必须使用 HTTPS
3. **数据加密**：敏感数据建议客户端加密后再存储
4. **定期备份**：定期导出 D1 数据库数据

## 🐛 常见问题

### Q: 推送通知不工作？

A:
- 确保在 iOS 16.4+ 的 Safari 浏览器中
- 必须从主屏幕图标启动应用
- 检查通知权限是否允许
- VAPID 密钥配置是否正确

### Q: API 请求失败？

A:
- 检查 CORS 配置
- 确认前端 `.env` 中的 `VITE_API_URL` 正确
- 查看浏览器控制台错误信息

### Q: 数据库初始化失败？

A:
- 确认 `database_id` 正确填入 `wrangler.toml`
- 使用 `npx wrangler d1 list` 查看数据库列表

## 📝 TODO

- [ ] 数据导出功能（CSV/JSON）
- [ ] 多语言支持
- [ ] 数据加密
- [ ] 社区分享功能
- [ ] AI 健康建议

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**Made with ❤️ using Cloudflare Stack**
