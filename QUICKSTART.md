# ⚡ 快速启动指南

5 分钟内本地运行项目！

## 📦 安装依赖

```bash
# 后端
cd server
npm install

# 前端
cd ../app
npm install
```

## 🗄️ 初始化本地数据库

```bash
cd server

# 登录 Cloudflare
npx wrangler login

# 创建 D1 数据库
npx wrangler d1 create pregnancy-tracker-db

# 记录输出的 database_id，填入 wrangler.toml

# 初始化本地数据库
npx wrangler d1 execute pregnancy-tracker-db --local --file=./schema.sql
```

## 🔑 生成密钥

```bash
# 生成 VAPID 密钥
npx web-push generate-vapid-keys

# 生成 JWT Secret
openssl rand -base64 32
# 或者
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

将生成的密钥填入 `server/wrangler.toml`。

## 🚀 启动开发服务器

### 终端 1 - 启动后端

```bash
cd server
npm run dev
```

后端运行在 `http://localhost:8787`

### 终端 2 - 启动前端

```bash
cd app
cp .env.example .env
# 编辑 .env，确保 VITE_API_URL=http://localhost:8787
npm run dev
```

前端运行在 `http://localhost:3000`

## 🧪 测试

1. 访问 `http://localhost:3000`
2. 注册新账号
3. 登录
4. 记录今天的数据
5. 查看统计报告

## 📁 项目结构

```
pregnancy-tracker/
├── server/               # Cloudflare Workers API
│   ├── src/
│   │   ├── routes/       # API 路由 (auth, records, reports, push)
│   │   ├── db/           # 数据库操作
│   │   ├── middleware/   # 认证中间件
│   │   ├── utils/        # 工具函数 (JWT, password, push)
│   │   └── index.ts      # 入口文件
│   ├── schema.sql        # D1 数据库 Schema
│   └── wrangler.toml     # Workers 配置
│
└── app/             # Vue 3 PWA
    ├── src/
    │   ├── api/          # API 调用封装
    │   ├── components/   # Vue 组件 (AuthForm, RecordForm)
    │   ├── views/        # 页面 (Home, Record, Reports)
    │   ├── stores/       # Pinia 状态管理
    │   ├── router/       # 路由配置
    │   ├── styles/       # 全局样式 (iOS 风格)
    │   └── types/        # TypeScript 类型
    └── public/
        ├── manifest.json # PWA Manifest
        └── sw.js         # Service Worker
```

## 🎨 主要功能

### ✅ 用户认证
- 文件：`server/src/routes/auth.ts`
- 注册/登录使用 JWT Token
- 密码使用 SHA-256 哈希

### ✅ 数据记录
- 文件：`app/src/components/RecordForm.vue`
- 睡眠、运动、饮食、心情、健康指标
- 离线缓存支持（最后写入优先）

### ✅ 统计报告
- 文件：`app/src/views/Reports.vue`
- 周报/月报可视化
- 使用 Chart.js 展示趋势

### ✅ 推送通知
- 文件：`server/src/routes/push.ts`
- Web Push API
- 定时任务（Cron Trigger）

### ✅ PWA 支持
- 可安装到 iOS 主屏幕
- 离线访问
- iOS 16.4+ 推送通知

## 📚 核心 API 端点

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录

### 记录
- `POST /api/records` - 创建/更新记录
- `GET /api/records/:date` - 获取指定日期记录
- `GET /api/records?start=&end=` - 获取日期范围记录
- `GET /api/records?limit=30` - 获取最近记录

### 报告
- `GET /api/reports/week` - 周报
- `GET /api/reports/month` - 月报

### 推送
- `POST /api/push/subscribe` - 订阅推送
- `DELETE /api/push/subscribe` - 取消订阅
- `POST /api/push/test` - 测试推送

## 🐛 常见问题

### 问题：端口被占用

```bash
# 修改前端端口
# 编辑 app/vite.config.ts
server: {
  port: 3001, // 改为其他端口
}
```

### 问题：API 连接失败

检查 `app/.env` 中的 `VITE_API_URL` 是否正确。

### 问题：数据库表不存在

```bash
cd server
npx wrangler d1 execute pregnancy-tracker-db --local --file=./schema.sql
```

## 🚢 部署到生产环境

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整部署指南。

简要步骤：

```bash
# 1. 部署后端
cd server
npm run deploy

# 2. 构建前端
cd ../app
npm run build

# 3. 部署前端到 Pages
npx wrangler pages deploy dist --project-name=pregnancy-tracker
```

## 📖 更多文档

- [README.md](./README.md) - 项目概览
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署指南

---

**Happy Coding! 🎉**
