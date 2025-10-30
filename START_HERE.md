# 🎯 从这里开始！

> **欢迎回来！** 下次打开项目时，请先阅读本文件。

## ✅ 项目已就绪

你的备孕记录 PWA 应用已经**完全准备好**，包括：

- ✅ 前端 Vue 3 应用（`app/` 目录）
- ✅ 后端 Cloudflare Workers API（`server/` 目录）
- ✅ 完整的文档体系（9 个文档文件）
- ✅ 路径别名配置（`@/` 替代相对路径）
- ✅ iOS 风格 UI + 深色模式
- ✅ 已成功部署

## 📚 下次启动时的阅读顺序

### 给人类（你）

1. **本文件** - 快速回顾
2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - 常用命令速查
3. 直接开始开发！

### 给 AI (Claude Code)

1. **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - 必读！完整架构
2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - 命令和 API
3. **[app/PATH_ALIAS.md](app/PATH_ALIAS.md)** - 代码规范

## 🚀 立即开始开发

### 方式一：快速启动（推荐）

```bash
# 在项目根目录 /Users/mango/Documents/GitHub/pregnancy-tracker/

# 终端 1 - 启动前端
cd app && bun run dev

# 终端 2 - 启动后端
cd server && npm run dev
```

然后访问 http://localhost:3000

### 方式二：只启动前端

```bash
cd app
bun run dev
```

如果后端已部署，前端会自动连接到生产 API。

## 📖 完整文档列表

你有 **9 个文档**可供参考：

### 🌟 最重要的 3 个

1. **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** ⭐⭐⭐⭐⭐
   - 给 Claude Code 的完整指南
   - 项目架构、技术栈、核心流程
   - 数据库设计、API 端点

2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** ⭐⭐⭐⭐⭐
   - 快速参考卡片
   - 常用命令、API、核心文件
   - 常见问题解决

3. **[app/PATH_ALIAS.md](app/PATH_ALIAS.md)** ⭐⭐⭐⭐⭐
   - 路径别名使用规范
   - 所有导入必须用 `@/` 前缀

### 📚 其他文档

4. **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - 文档索引导航
5. **[QUICKSTART.md](QUICKSTART.md)** - 5 分钟快速启动
6. **[DEPLOYMENT.md](DEPLOYMENT.md)** - 完整部署指南
7. **[README.md](README.md)** - 项目概览
8. **[FILES.md](FILES.md)** - 完整文件清单
9. **[REFACTOR_SUMMARY.md](REFACTOR_SUMMARY.md)** - 最近的重构记录

## 🎯 项目关键信息

### 目录结构

```
pregnancy-tracker/
├── app/          # 前端（原 frontend）
└── server/       # 后端（原 backend）
```

### 路径别名（重要！）

```typescript
// ✅ 正确 - 使用别名
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types';

// ❌ 错误 - 不要用相对路径
import { useAuthStore } from '../stores/auth';
```

### 核心配置文件

需要配置的文件：

1. **`server/wrangler.toml`**
   - `database_id` - D1 数据库 ID
   - `JWT_SECRET` - JWT 密钥
   - `VAPID_PUBLIC_KEY` 和 `VAPID_PRIVATE_KEY` - 推送密钥
   - `VAPID_EMAIL` - 你的邮箱

2. **`app/.env`**
   - `VITE_API_URL` - 后端 API 地址

## 🔧 常用命令速查

```bash
# === 前端 (app/) ===
bun run dev              # 开发服务器
bun run build            # 构建生产版本
bun run type-check       # 类型检查

# === 后端 (server/) ===
npm run dev              # 本地开发
npm run deploy           # 部署到 Cloudflare
npm run db:init          # 初始化生产数据库
npm run db:local         # 初始化本地数据库

# === 数据库查询 ===
cd server
npx wrangler d1 execute pregnancy-tracker-db \
  --command "SELECT * FROM users"

# === 查看日志 ===
cd server
npx wrangler tail pregnancy-tracker-api
```

## 🎨 项目特色

- **iOS 原生风格 UI** - 完全模拟 iOS 设计语言
- **深色模式** - 自动检测系统主题
- **路径别名** - 统一使用 `@/` 前缀
- **PWA 支持** - 可安装到 iOS 主屏幕
- **Web Push** - 每日提醒（iOS 16.4+）
- **离线支持** - Service Worker 缓存

## 📊 当前状态

| 项目 | 状态 |
|------|------|
| 代码开发 | ✅ 100% 完成 |
| 路径重构 | ✅ 已完成 |
| 文档编写 | ✅ 9 个文档 |
| 部署 | ✅ 已成功部署 |
| 图标资源 | ⚠️ 需自行添加 |

## ⚠️ 待办事项

如果你想完善项目，可以考虑：

1. **添加图标**
   - 在 `app/public/icons/` 添加 8 个尺寸的图标
   - 详见 `app/public/icons/README.md`

2. **配置自定义域名**（可选）
   - 在 Cloudflare Pages 添加域名
   - 更新 CORS 配置

3. **数据导出功能**（未来扩展）
   - 导出为 CSV / JSON
   - 数据备份

## 🐛 遇到问题？

### 构建失败

```bash
cd app
rm -rf node_modules bun.lockb
bun install
bun run build
```

### API 连接失败

1. 检查 `app/.env` 的 `VITE_API_URL`
2. 检查 `server/src/index.ts` 的 CORS 配置
3. 确认后端已部署或正在运行

### 数据库错误

```bash
cd server
npx wrangler d1 execute pregnancy-tracker-db \
  --local --file=./schema.sql
```

更多问题请查看 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) 的"常见问题"部分。

## 🎓 给未来 Claude Code 的话

如果下次是 Claude Code 打开这个项目：

1. **先读 [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)**
   - 这是最重要的文档
   - 包含完整的架构、技术栈、核心流程

2. **遵循代码规范**
   - 所有导入使用 `@/` 别名
   - 保持 iOS 风格一致性
   - 详见 [app/PATH_ALIAS.md](app/PATH_ALIAS.md)

3. **修改代码前**
   - 理解现有架构
   - 查看相关文档
   - 保持风格统一

## 📞 有用的资源

- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **项目路径**: `/Users/mango/Documents/GitHub/pregnancy-tracker/`
- **前端端口**: http://localhost:3000
- **后端端口**: http://localhost:8787

## 🎉 总结

你现在拥有：

- ✅ 一个**完整的、可运行的** PWA 应用
- ✅ **9 个详尽的文档**，涵盖所有方面
- ✅ **统一的代码规范**（路径别名）
- ✅ **清晰的项目结构**（app / server）
- ✅ **已成功部署**

**随时可以继续开发或部署！** 🚀

---

## 🚀 下次启动三步走

```bash
# 1. 阅读本文件（你现在正在做）✅
# 2. 启动开发服务器
cd app && bun run dev

# 3. 开始开发！
```

---

**项目位置**: `/Users/mango/Documents/GitHub/pregnancy-tracker/`

**上次修改**: 2025-10-30

**项目状态**: ✅ 就绪

**祝开发顺利！关机前请记得保存所有更改。** 💾
