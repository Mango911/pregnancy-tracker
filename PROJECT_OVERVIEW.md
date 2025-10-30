# 📖 项目全览 - 备孕记录 PWA

> **给未来的 Claude Code：** 这是一个完整的、已部署的备孕记录应用。请仔细阅读本文档快速了解项目全貌。

## 🎯 项目简介

**项目名称**: 备孕记录 PWA
**技术栈**: Vue 3 + Cloudflare Workers + D1 + Web Push
**UI 风格**: iOS 原生风格 + 深色模式
**部署状态**: ✅ 已成功部署

这是一个用于记录备孕期间健康数据的渐进式 Web 应用，支持：
- ✅ 用户认证（注册/登录）
- ✅ 每日健康记录（睡眠、运动、饮食、心情等）
- ✅ 可视化统计报告（周报/月报）
- ✅ Web Push 推送通知
- ✅ iOS PWA（可安装到主屏幕）
- ✅ 离线支持

## 📁 项目结构

```
pregnancy-tracker/
│
├── app/                                # 前端 Vue 3 PWA（原 frontend）
│   ├── src/
│   │   ├── api/                       # API 封装层
│   │   │   ├── config.ts              # API 基础配置 + 请求封装
│   │   │   ├── auth.ts                # 认证 API (login/register)
│   │   │   ├── records.ts             # 记录 API (CRUD)
│   │   │   ├── reports.ts             # 报告 API (周报/月报)
│   │   │   └── push.ts                # 推送 API (订阅/取消)
│   │   │
│   │   ├── components/                # Vue 组件
│   │   │   ├── AuthForm.vue           # 登录/注册表单
│   │   │   └── RecordForm.vue         # 每日记录表单（详细）
│   │   │
│   │   ├── views/                     # 页面视图
│   │   │   ├── Home.vue               # 首页（仪表盘、今日记录、本周概览）
│   │   │   ├── Record.vue             # 记录页面
│   │   │   └── Reports.vue            # 统计报告页面（Chart.js 图表）
│   │   │
│   │   ├── stores/                    # Pinia 状态管理
│   │   │   ├── auth.ts                # 认证状态（user, token, login, register）
│   │   │   ├── records.ts             # 记录状态（CRUD 操作）
│   │   │   └── push.ts                # 推送状态（订阅管理）
│   │   │
│   │   ├── router/                    # Vue Router
│   │   │   └── index.ts               # 路由配置（4个路由 + 认证守卫）
│   │   │
│   │   ├── types/                     # TypeScript 类型定义
│   │   │   └── index.ts               # 所有接口类型
│   │   │
│   │   ├── styles/                    # 全局样式
│   │   │   └── main.css               # iOS 风格主题（深色模式）
│   │   │
│   │   ├── App.vue                    # 根组件
│   │   └── main.ts                    # 应用入口
│   │
│   ├── public/
│   │   ├── manifest.json              # PWA Manifest
│   │   ├── sw.js                      # Service Worker
│   │   └── icons/                     # 应用图标（需自行添加）
│   │
│   ├── vite.config.ts                 # ✅ 已配置路径别名 @/
│   ├── tsconfig.json                  # ✅ 已配置路径别名
│   ├── tailwind.config.js             # iOS 风格主题配置
│   ├── package.json                   # 依赖配置
│   ├── .env.example                   # 环境变量示例
│   └── PATH_ALIAS.md                  # 📖 路径别名使用指南
│
├── server/                             # 后端 Cloudflare Workers（原 backend）
│   ├── src/
│   │   ├── routes/                    # API 路由
│   │   │   ├── auth.ts                # 认证路由（注册/登录）
│   │   │   ├── records.ts             # 记录路由（CRUD）
│   │   │   ├── reports.ts             # 报告路由（周报/月报统计）
│   │   │   └── push.ts                # 推送路由（订阅/测试）
│   │   │
│   │   ├── db/                        # 数据库操作层
│   │   │   ├── users.ts               # 用户表 CRUD
│   │   │   ├── records.ts             # 记录表 CRUD
│   │   │   └── push.ts                # 推送订阅表 CRUD
│   │   │
│   │   ├── middleware/                # 中间件
│   │   │   └── auth.ts                # JWT 认证中间件
│   │   │
│   │   ├── utils/                     # 工具函数
│   │   │   ├── jwt.ts                 # JWT 生成和验证
│   │   │   ├── password.ts            # 密码哈希（SHA-256）
│   │   │   └── push.ts                # Web Push 实现
│   │   │
│   │   └── index.ts                   # 主入口（Hono 应用 + Cron 任务）
│   │
│   ├── schema.sql                     # D1 数据库 Schema（3张表）
│   ├── wrangler.toml                  # Workers 配置（需填入密钥）
│   ├── tsconfig.json                  # TypeScript 配置
│   └── package.json                   # 依赖配置
│
├── README.md                           # 📖 项目概览和功能介绍
├── DEPLOYMENT.md                       # 📖 完整部署指南（从零到上线）
├── QUICKSTART.md                       # 📖 5分钟快速启动
├── QUICK_REFERENCE.md                  # 📖 快速参考卡片
├── FILES.md                            # 📖 完整文件清单
├── REFACTOR_SUMMARY.md                 # 📖 最近的重构总结
├── PROJECT_OVERVIEW.md                 # 📖 本文件（项目全览）
└── .gitignore                          # Git 忽略配置
```

## 🔑 核心技术点

### 前端 (app/)

1. **路径别名** ⭐ 重要！
   - 所有导入使用 `@/` 前缀，不使用相对路径
   - 例如：`import { useAuthStore } from '@/stores/auth'`
   - 详见 `app/PATH_ALIAS.md`

2. **状态管理**
   - 使用 Pinia，3 个 store：auth、records、push
   - 所有 API 调用封装在 `api/` 目录

3. **UI 风格**
   - 完全 iOS 原生风格
   - TailwindCSS + 自定义 iOS 主题
   - 支持深色模式（自动/手动切换）
   - 流畅动画（0.2s-0.3s 过渡）

4. **PWA 特性**
   - Service Worker 离线支持
   - 可安装到 iOS 主屏幕
   - Web Push 通知（iOS 16.4+）

### 后端 (server/)

1. **框架**
   - Hono（轻量级 Web 框架）
   - Cloudflare Workers Runtime

2. **认证**
   - JWT Token 认证
   - 密码 SHA-256 哈希
   - 中间件保护路由

3. **数据库**
   - Cloudflare D1 (SQLite)
   - 3 张表：users、records、push_subscriptions
   - 完整的索引优化

4. **推送通知**
   - Web Push API + VAPID
   - Cron Trigger 定时任务（每天 9:00）

## 🚀 快速命令

### 开发环境

```bash
# 前端
cd app
bun run dev              # http://localhost:3000

# 后端
cd server
npm run dev              # http://localhost:8787
```

### 构建和部署

```bash
# 前端构建
cd app
bun run build            # 输出到 dist/

# 后端部署
cd server
npm run deploy           # 部署到 Cloudflare Workers
```

### 数据库操作

```bash
cd server

# 初始化数据库
npm run db:init          # 生产环境
npm run db:local         # 本地环境

# 查询数据
npx wrangler d1 execute pregnancy-tracker-db \
  --command "SELECT * FROM users"
```

## 📊 数据库设计

### users 表
```sql
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- password_hash (TEXT)
- name (TEXT)
- created_at, updated_at
```

### records 表
```sql
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER)
- date (DATE UNIQUE per user)
- sleep_hours, sleep_quality
- exercise_minutes, exercise_type
- diet_breakfast, diet_lunch, diet_dinner, diet_snacks
- water_intake
- mood, stress_level
- body_temperature, weight
- notes
- created_at, updated_at
```

### push_subscriptions 表
```sql
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER)
- endpoint (TEXT)
- p256dh, auth (TEXT)
- user_agent
- created_at
```

## 🔐 配置文件

### ⚠️ 需要配置的文件

1. **`server/wrangler.toml`** - 必须填入：
   ```toml
   database_id = "xxx"           # D1 数据库 ID
   JWT_SECRET = "xxx"            # JWT 密钥（32字符+）
   VAPID_PUBLIC_KEY = "xxx"      # Web Push 公钥
   VAPID_PRIVATE_KEY = "xxx"     # Web Push 私钥
   VAPID_EMAIL = "xxx"           # 你的邮箱
   ```

2. **`app/.env`** - 必须创建：
   ```env
   VITE_API_URL=https://your-worker.workers.dev
   ```

## 🎨 UI 特色

### 配色方案（iOS 风格）
- **主色**: `#007AFF` (iOS Blue)
- **绿色**: `#34C759` (iOS Green)
- **粉色**: `#FF2D55` (iOS Pink)
- **紫色**: `#AF52DE` (iOS Purple)

### 组件风格
- 圆角：10px / 12px
- 阴影：细腻的 iOS 风格阴影
- 动画：0.2s-0.3s 缓动过渡
- 字体：-apple-system 优先

### 深色模式
- 自动检测系统主题
- 手动切换（首页右上角）
- 完整的深色配色适配

## 📱 API 端点

| 端点 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/api/auth/register` | POST | 用户注册 | ❌ |
| `/api/auth/login` | POST | 用户登录 | ❌ |
| `/api/records` | POST | 保存记录 | ✅ |
| `/api/records/:date` | GET | 获取记录 | ✅ |
| `/api/records?start=&end=` | GET | 日期范围 | ✅ |
| `/api/reports/week` | GET | 周报统计 | ✅ |
| `/api/reports/month` | GET | 月报统计 | ✅ |
| `/api/push/subscribe` | POST | 订阅推送 | ✅ |
| `/api/push/test` | POST | 测试推送 | ✅ |
| `/api/vapid-public-key` | GET | 获取公钥 | ❌ |

## 🎯 核心功能流程

### 用户注册/登录
1. 前端：`AuthForm.vue` 提交表单
2. API：`app/src/api/auth.ts` 调用后端
3. 后端：`server/src/routes/auth.ts` 处理请求
4. 数据库：`server/src/db/users.ts` 操作用户表
5. 返回：JWT Token
6. 存储：localStorage + Pinia store

### 保存记录
1. 前端：`RecordForm.vue` 提交数据
2. Store：`stores/records.ts` 调用 API
3. 后端：`routes/records.ts` → `db/records.ts`
4. 数据库：UPSERT 操作（有则更新，无则插入）
5. 返回：保存的记录
6. 更新：本地缓存

### 查看报告
1. 前端：`Reports.vue` 加载
2. API：`api/reports.ts` 请求周报/月报
3. 后端：`routes/reports.ts` 计算统计
4. 数据库：查询日期范围内的记录
5. 计算：平均值、总和等
6. 渲染：Chart.js 图表

### 推送通知
1. 前端：用户开启推送
2. 请求：浏览器通知权限
3. 订阅：Service Worker Push Manager
4. 后端：保存订阅信息
5. Cron：每天 UTC 01:00 触发
6. 推送：向所有订阅发送通知

## ⚠️ 已知限制

1. **iOS 推送不稳定**
   - 必须 iOS 16.4+
   - 必须从主屏幕图标启动
   - 系统可能随时撤销权限

2. **离线同步**
   - 采用"最后写入优先"策略
   - 可能丢失冲突的编辑

3. **图标缺失**
   - 需要自行添加 8 个尺寸的图标
   - 详见 `app/public/icons/README.md`

## 🐛 常见问题

### 构建失败
```bash
cd app
rm -rf node_modules bun.lockb
bun install
bun run build
```

### API 连接失败
- 检查 `app/.env` 中的 `VITE_API_URL`
- 检查 CORS 配置（`server/src/index.ts`）

### 数据库错误
```bash
cd server
npx wrangler d1 execute pregnancy-tracker-db \
  --local --file=./schema.sql
```

### 推送不工作
- 确认 VAPID 密钥配置正确
- 确认在 HTTPS 环境
- 确认 iOS 从主屏幕启动

## 📚 重要文档

| 文档 | 说明 | 优先级 |
|------|------|--------|
| `PROJECT_OVERVIEW.md` | 本文件（项目全览） | ⭐⭐⭐⭐⭐ |
| `QUICK_REFERENCE.md` | 快速参考卡片 | ⭐⭐⭐⭐⭐ |
| `app/PATH_ALIAS.md` | 路径别名使用 | ⭐⭐⭐⭐⭐ |
| `DEPLOYMENT.md` | 完整部署指南 | ⭐⭐⭐⭐ |
| `QUICKSTART.md` | 5分钟快速开始 | ⭐⭐⭐⭐ |
| `REFACTOR_SUMMARY.md` | 最近的重构 | ⭐⭐⭐ |
| `README.md` | 项目概览 | ⭐⭐⭐ |
| `FILES.md` | 文件清单 | ⭐⭐ |

## 🔍 代码规范

### 前端

1. **导入路径**
   - ✅ 使用 `@/` 别名
   - ❌ 不使用相对路径 `../`

2. **组件风格**
   - 使用 `<script setup>` 语法
   - TypeScript 类型标注
   - Props 和 Emits 明确定义

3. **样式**
   - 使用 TailwindCSS 类名
   - 自定义 iOS 风格类（`ios-card`, `ios-button`）
   - 支持深色模式类（`dark:`）

### 后端

1. **路由结构**
   - 使用 Hono 框架
   - 路由按功能分文件
   - 中间件统一认证

2. **数据库操作**
   - 所有操作封装在 `db/` 目录
   - 使用 Prepared Statements
   - 错误处理完整

## 🎓 给未来 Claude Code 的建议

1. **首先阅读**
   - 本文件（`PROJECT_OVERVIEW.md`）
   - `QUICK_REFERENCE.md`
   - `app/PATH_ALIAS.md`

2. **理解架构**
   - 前后端分离
   - 路径别名规范
   - 状态管理模式

3. **修改代码时**
   - 遵循路径别名规范（`@/`）
   - 保持 iOS 风格一致性
   - 更新相关文档

4. **调试问题时**
   - 检查 `.env` 配置
   - 查看浏览器控制台
   - 使用 `wrangler tail` 查看日志

## 📝 项目状态

| 项目 | 状态 | 说明 |
|------|------|------|
| 前端开发 | ✅ 完成 | 所有功能已实现 |
| 后端开发 | ✅ 完成 | 所有 API 已实现 |
| 数据库设计 | ✅ 完成 | Schema 已优化 |
| UI 设计 | ✅ 完成 | iOS 风格 + 深色模式 |
| 路径重构 | ✅ 完成 | 已使用别名 |
| 文档编写 | ✅ 完成 | 7 个文档已完成 |
| 部署 | ✅ 完成 | 用户已成功部署 |
| 图标资源 | ⚠️ 待添加 | 需用户自行添加 |

## 🔗 有用的链接

- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Vue 3 文档**: https://vuejs.org/
- **Hono 文档**: https://hono.dev/
- **TailwindCSS**: https://tailwindcss.com/
- **Chart.js**: https://www.chartjs.org/

---

## 🚀 下次启动项目的步骤

1. **阅读本文档**（你现在正在做）
2. **查看 `QUICK_REFERENCE.md`**（快速命令）
3. **运行 `cd app && bun run dev`**（启动前端）
4. **运行 `cd server && npm run dev`**（启动后端）
5. **访问 http://localhost:3000**（开始开发）

---

**项目完整、文档齐全、随时可以开发！** 🎉

最后修改时间：2025-10-30
项目状态：✅ 生产就绪
