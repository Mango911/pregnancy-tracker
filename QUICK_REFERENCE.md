# 🚀 快速参考

## 📁 项目结构

```
pregnancy-tracker/
├── app/          👉 前端 Vue 3 PWA（原 frontend）
└── server/       👉 后端 Cloudflare Workers（原 backend）
```

## 🎯 路径别名

**所有从 `src/` 的导入都使用 `@/` 前缀**

```typescript
// ✅ 正确
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types';
import Home from '@/views/Home.vue';

// ❌ 不要用相对路径
import { useAuthStore } from '../stores/auth';
import type { User } from '../../types';
```

## 📦 常用命令

### 前端 (app/)

```bash
cd app

# 开发
bun run dev          # http://localhost:3000

# 构建
bun run build        # 输出到 dist/

# 类型检查
bun run type-check

# 预览
bun run preview
```

### 后端 (server/)

```bash
cd server

# 开发
npm run dev          # http://localhost:8787

# 部署
npm run deploy

# 数据库
npm run db:init      # 生产环境初始化
npm run db:local     # 本地环境初始化
```

## 🔧 初始设置

### 1. 安装依赖

```bash
cd app && bun install
cd ../server && npm install
```

### 2. 配置后端

```bash
cd server

# 登录 Cloudflare
npx wrangler login

# 创建数据库
npx wrangler d1 create pregnancy-tracker-db

# 生成密钥
npx web-push generate-vapid-keys
openssl rand -base64 32

# 编辑 wrangler.toml 填入上述密钥
```

### 3. 初始化数据库

```bash
npx wrangler d1 execute pregnancy-tracker-db --local --file=./schema.sql
```

### 4. 配置前端

```bash
cd app
cp .env.example .env
# 编辑 .env 填入 API URL
```

## 🌐 API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/auth/register` | POST | 注册 |
| `/api/auth/login` | POST | 登录 |
| `/api/records` | POST | 保存记录 |
| `/api/records/:date` | GET | 获取记录 |
| `/api/reports/week` | GET | 周报 |
| `/api/reports/month` | GET | 月报 |
| `/api/push/subscribe` | POST | 订阅推送 |
| `/api/push/test` | POST | 测试推送 |

## 📝 核心文件

### 前端

| 文件 | 说明 |
|------|------|
| `app/vite.config.ts` | Vite + PWA 配置 |
| `app/src/router/index.ts` | 路由配置 |
| `app/src/stores/auth.ts` | 认证状态 |
| `app/src/views/Home.vue` | 首页 |
| `app/src/components/RecordForm.vue` | 记录表单 |

### 后端

| 文件 | 说明 |
|------|------|
| `server/wrangler.toml` | Workers 配置 |
| `server/schema.sql` | 数据库表 |
| `server/src/index.ts` | 主入口 |
| `server/src/routes/auth.ts` | 认证路由 |
| `server/src/middleware/auth.ts` | JWT 中间件 |

## 🎨 样式定制

编辑 `app/tailwind.config.js` 修改主题色：

```javascript
colors: {
  ios: {
    blue: '#007AFF',  // 改这里
    green: '#34C759',
    // ...
  }
}
```

## 🔍 调试

### 查看 Workers 日志

```bash
cd server
npx wrangler tail pregnancy-tracker-api
```

### 查看数据库

```bash
# 本地
npx wrangler d1 execute pregnancy-tracker-db --local \
  --command "SELECT * FROM users"

# 生产
npx wrangler d1 execute pregnancy-tracker-db \
  --command "SELECT * FROM users"
```

## 📚 文档

| 文档 | 说明 |
|------|------|
| `README.md` | 项目概览 |
| `DEPLOYMENT.md` | 完整部署指南 |
| `QUICKSTART.md` | 5分钟快速开始 |
| `app/PATH_ALIAS.md` | 路径别名使用 |
| `REFACTOR_SUMMARY.md` | 重构总结 |

## 🐛 常见问题

### 构建失败

```bash
cd app
rm -rf node_modules bun.lockb
bun install
bun run build
```

### API 连接失败

检查 `app/.env` 中的 `VITE_API_URL` 是否正确。

### 数据库错误

```bash
cd server
npx wrangler d1 execute pregnancy-tracker-db --local --file=./schema.sql
```

## 🎯 快速部署

```bash
# 1. 部署后端
cd server && npm run deploy

# 2. 记录 Worker URL
# https://your-worker.workers.dev

# 3. 配置前端
cd ../app
echo "VITE_API_URL=https://your-worker.workers.dev" > .env

# 4. 部署前端
bun run build
npx wrangler pages deploy dist --project-name=pregnancy-tracker
```

---

**更多详情请查看各文档文件** 📖
