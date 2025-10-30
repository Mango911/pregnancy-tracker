# 📚 文档索引

> **快速导航**：点击下方链接直达相应文档

## 🆕 首次使用？从这里开始！

1. **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** ⭐⭐⭐⭐⭐
   - 📖 项目全览
   - 🎯 **给 Claude Code：必读！** 包含完整架构、技术栈、核心流程
   - 📊 项目结构、数据库设计、API 端点
   - 🔧 配置要点、代码规范

2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** ⭐⭐⭐⭐⭐
   - 🚀 快速参考卡片
   - 💡 常用命令、API 端点、核心文件
   - 🐛 常见问题快速解决

3. **[QUICKSTART.md](QUICKSTART.md)** ⭐⭐⭐⭐
   - ⚡ 5 分钟快速启动
   - 📦 安装依赖、初始化数据库
   - 🏃 启动开发服务器

## 📖 深入了解

### 项目介绍

4. **[README.md](README.md)** ⭐⭐⭐
   - 📝 项目概览和功能介绍
   - ✨ 功能特性列表
   - 🏗️ 技术栈说明
   - 📦 项目结构概览

### 部署指南

5. **[DEPLOYMENT.md](DEPLOYMENT.md)** ⭐⭐⭐⭐
   - 🚀 完整部署指南（从零到上线）
   - 📝 详细的 7 步部署流程
   - 🔧 配置 Cloudflare D1、Workers、Pages
   - ⚠️ 常见问题排查

### 文件说明

6. **[FILES.md](FILES.md)** ⭐⭐
   - 📁 完整的文件清单
   - 🗺️ 项目结构详解
   - 📊 文件统计和功能对照表

## 🔧 开发规范

### 路径别名（重要！）

7. **[app/PATH_ALIAS.md](app/PATH_ALIAS.md)** ⭐⭐⭐⭐⭐
   - 🎯 路径别名使用指南
   - ✅ 正确示例 vs ❌ 错误示例
   - 📂 目录结构映射
   - 💡 最佳实践

## 📝 项目历史

### 重构记录

8. **[REFACTOR_SUMMARY.md](REFACTOR_SUMMARY.md)** ⭐⭐⭐
   - 🔄 最近的重构总结
   - 📊 改动统计（目录重命名、路径别名）
   - ✅ 验证结果

## 📋 文档阅读顺序建议

### 🆕 新手（第一次接触项目）

```
1. PROJECT_OVERVIEW.md         ← 必读！了解全局
2. QUICK_REFERENCE.md          ← 快速上手
3. QUICKSTART.md               ← 运行项目
4. app/PATH_ALIAS.md           ← 代码规范
```

### 🚀 准备部署

```
1. DEPLOYMENT.md               ← 完整部署流程
2. QUICK_REFERENCE.md          ← 命令速查
```

### 🔍 深入开发

```
1. PROJECT_OVERVIEW.md         ← 架构和设计
2. FILES.md                    ← 文件结构
3. app/PATH_ALIAS.md           ← 代码规范
4. README.md                   ← 功能详情
```

### 🤖 给 Claude Code

```
1. PROJECT_OVERVIEW.md         ← 第一个阅读！
2. QUICK_REFERENCE.md          ← 常用命令
3. app/PATH_ALIAS.md           ← 导入规范
4. REFACTOR_SUMMARY.md         ← 最近改动
```

## 📊 文档概览表

| 文档 | 类型 | 优先级 | 字数 | 说明 |
|------|------|--------|------|------|
| `PROJECT_OVERVIEW.md` | 全览 | ⭐⭐⭐⭐⭐ | ~4000 | 项目完整概述（必读） |
| `QUICK_REFERENCE.md` | 参考 | ⭐⭐⭐⭐⭐ | ~2000 | 快速参考卡片 |
| `QUICKSTART.md` | 教程 | ⭐⭐⭐⭐ | ~1500 | 5分钟快速启动 |
| `DEPLOYMENT.md` | 教程 | ⭐⭐⭐⭐ | ~3000 | 完整部署指南 |
| `app/PATH_ALIAS.md` | 规范 | ⭐⭐⭐⭐⭐ | ~1500 | 路径别名使用 |
| `README.md` | 介绍 | ⭐⭐⭐ | ~2500 | 项目概览 |
| `FILES.md` | 参考 | ⭐⭐ | ~2500 | 文件清单 |
| `REFACTOR_SUMMARY.md` | 历史 | ⭐⭐⭐ | ~2000 | 重构记录 |

## 🔗 快速链接

### 核心配置文件

- **前端配置**: [`app/vite.config.ts`](app/vite.config.ts) - Vite + PWA + 路径别名
- **TypeScript**: [`app/tsconfig.json`](app/tsconfig.json) - 路径别名配置
- **样式配置**: [`app/tailwind.config.js`](app/tailwind.config.js) - iOS 主题
- **后端配置**: [`server/wrangler.toml`](server/wrangler.toml) - Workers 配置
- **数据库**: [`server/schema.sql`](server/schema.sql) - D1 表结构

### 核心源码文件

#### 前端核心

- **入口**: [`app/src/main.ts`](app/src/main.ts)
- **路由**: [`app/src/router/index.ts`](app/src/router/index.ts)
- **主题**: [`app/src/styles/main.css`](app/src/styles/main.css)

#### 状态管理

- [`app/src/stores/auth.ts`](app/src/stores/auth.ts) - 认证
- [`app/src/stores/records.ts`](app/src/stores/records.ts) - 记录
- [`app/src/stores/push.ts`](app/src/stores/push.ts) - 推送

#### 页面组件

- [`app/src/views/Home.vue`](app/src/views/Home.vue) - 首页
- [`app/src/views/Record.vue`](app/src/views/Record.vue) - 记录页
- [`app/src/views/Reports.vue`](app/src/views/Reports.vue) - 报告页

#### 后端核心

- **入口**: [`server/src/index.ts`](server/src/index.ts) - Hono 应用
- **认证**: [`server/src/routes/auth.ts`](server/src/routes/auth.ts)
- **中间件**: [`server/src/middleware/auth.ts`](server/src/middleware/auth.ts)

## 🎯 按场景查找文档

### 我想了解项目架构
→ [`PROJECT_OVERVIEW.md`](PROJECT_OVERVIEW.md)

### 我想快速运行项目
→ [`QUICKSTART.md`](QUICKSTART.md)

### 我想部署到生产环境
→ [`DEPLOYMENT.md`](DEPLOYMENT.md)

### 我想知道如何导入文件
→ [`app/PATH_ALIAS.md`](app/PATH_ALIAS.md)

### 我想查看所有 API 端点
→ [`QUICK_REFERENCE.md`](QUICK_REFERENCE.md)

### 我想了解数据库设计
→ [`PROJECT_OVERVIEW.md`](PROJECT_OVERVIEW.md) 的"数据库设计"章节

### 我想知道最近的改动
→ [`REFACTOR_SUMMARY.md`](REFACTOR_SUMMARY.md)

### 我想查找某个文件的作用
→ [`FILES.md`](FILES.md)

## 📝 补充资源

### 图标资源

- [`app/public/icons/README.md`](app/public/icons/README.md) - 图标文件说明

### 环境配置

- [`app/.env.example`](app/.env.example) - 前端环境变量示例
- [`server/wrangler.toml`](server/wrangler.toml) - 后端配置示例

## 💡 提示

### 给开发者

- 📖 **每次开发前**：先看 `QUICK_REFERENCE.md` 温习命令
- 🔧 **修改代码前**：复习 `app/PATH_ALIAS.md` 保持规范
- 🐛 **遇到问题时**：查看 `QUICK_REFERENCE.md` 的"常见问题"部分

### 给 Claude Code

- 🤖 **每次启动时**：优先阅读 `PROJECT_OVERVIEW.md`
- 📝 **修改代码时**：遵循 `app/PATH_ALIAS.md` 的导入规范
- 🔄 **了解历史时**：查看 `REFACTOR_SUMMARY.md`

---

## 📌 文档维护

| 项 | 状态 | 更新时间 |
|---|------|---------|
| 所有文档已创建 | ✅ | 2025-10-30 |
| 路径别名已应用 | ✅ | 2025-10-30 |
| 目录已重命名 | ✅ | 2025-10-30 |
| 文档已同步 | ✅ | 2025-10-30 |

---

**🎉 文档完整，随时可以开始！**

**建议下次启动时阅读顺序**：
1. `PROJECT_OVERVIEW.md` （全局概览）
2. `QUICK_REFERENCE.md` （命令速查）
3. `app/PATH_ALIAS.md` （代码规范）

**祝开发顺利！** 🚀
