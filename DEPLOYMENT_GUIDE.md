# 部署指南 (Deployment Guide)

## 目录
1. [前置要求](#前置要求)
2. [快速开始（自动化）](#快速开始自动化)
3. [详细步骤（手动）](#详细步骤手动)
4. [验证部署](#验证部署)
5. [故障排除](#故障排除)

---

## 前置要求

### 必需
- ✅ Node.js >= 16.0.0（npm 或 yarn）
- ✅ Cloudflare 账户（免费账户即可）
- ✅ Git（已有）
- ✅ 文本编辑器

### 可选但推荐
- Bun（比 npm 更快）
- Cloudflare CLI（wrangler）本地安装

### 安装 Wrangler（可选）
```bash
npm install -g wrangler
# 或
curl -fsSL https://get.wrangler.dev | sh
```

---

## 快速开始（自动化）

### 1. 使用部署脚本

我已经为您创建了自动化部署脚本：

```bash
# 赋予执行权限
chmod +x DEPLOY.sh

# 运行脚本
./DEPLOY.sh
```

脚本会逐步指导您：
- ✅ 检查前置条件
- ✅ 验证 Cloudflare 认证
- ✅ 生成 VAPID 密钥
- ✅ 创建 D1 数据库
- ✅ 初始化数据库 Schema
- ✅ 设置生产 Secrets
- ✅ 部署后端和前端

---

## 详细步骤（手动）

如果您想手动部署，请按以下步骤进行：

### 步骤 1：Cloudflare 认证

在您的本地机器上：

```bash
npx wrangler login
```

或者如果已全局安装：
```bash
wrangler login
```

这会打开浏览器窗口，按照提示进行授权。

**验证**:
```bash
npx wrangler whoami
# 应该显示您的 Cloudflare 账户信息
```

### 步骤 2：生成 VAPID 密钥

这些密钥用于 Web Push 通知。

```bash
cd server
npx web-push generate-vapid-keys
```

您会看到：
```
Public Key:  BBxxxxxxxxxxxxxxxxxxxxx...
Private Key: YYYyyyyyyyyyyyyyyy...
```

**保存这两个密钥！** 您稍后会需要它们。

### 步骤 3：配置本地开发环境

在 `server/` 目录中：

```bash
# 如果文件不存在，复制模板
cp .dev.vars.example .dev.vars

# 编辑文件
nano .dev.vars  # 或使用您喜欢的编辑器
```

编辑内容，填入以下信息：

```env
# 生成一个 32+ 字符的随机密钥
JWT_SECRET=MySecureRandomKeyWithAtLeast32Characters1234!

# 从步骤 2 的 web-push 命令获得
VAPID_PUBLIC_KEY=BBxxxxx...
VAPID_PRIVATE_KEY=YYYyyy...
```

**重要**: `.dev.vars` 已在 `.gitignore` 中，不会被提交。

### 步骤 4：创建 D1 数据库

```bash
cd server
npx wrangler d1 create health-tracker-db
```

输出示例：
```
✨ Successfully created D1 database 'health-tracker-db'

Binding this database to your current project:
[[d1_databases]]
binding = "DB"
database_name = "health-tracker-db"
database_id = "12345678-1234-1234-1234-123456789012"
```

**记录 `database_id`**，下一步需要。

### 步骤 5：更新 wrangler.toml

编辑 `server/wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "health-tracker-db"
database_id = "12345678-1234-1234-1234-123456789012"  # 替换为实际 ID
```

### 步骤 6：初始化数据库 Schema

```bash
# 本地开发环境（可选，用于本地测试）
npm run db:local

# 生产环境（必需）
npm run db:init
```

这会应用 `schema.sql` 中的所有数据库表和索引。

**验证**:
```bash
npx wrangler d1 execute health-tracker-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

应该返回 3 个表：
- `users`
- `records`
- `push_subscriptions`

### 步骤 7：设置生产环境 Secrets

这些是敏感信息，必须通过 Wrangler 安全地存储。

```bash
# 交互式输入（会提示您粘贴或输入值）
npx wrangler secret put JWT_SECRET

# 输入您的 JWT_SECRET，然后按 Ctrl+D (Mac) 或 Ctrl+Z+Enter (Windows)
# 粘贴并按 Enter 然后 Ctrl+D
```

重复操作其他两个 secret：

```bash
npx wrangler secret put VAPID_PUBLIC_KEY
# 粘贴 VAPID_PUBLIC_KEY，按 Ctrl+D

npx wrangler secret put VAPID_PRIVATE_KEY
# 粘贴 VAPID_PRIVATE_KEY，按 Ctrl+D
```

**验证**:
```bash
npx wrangler secret list
# 应该显示已设置的 secrets（值被隐藏）
```

### 步骤 8：部署后端

```bash
npm run deploy:server
```

或者：
```bash
npx wrangler deploy
```

成功示例：
```
✨ Deployed to https://health-tracker-api.bigmango911.workers.dev
```

**记录 Worker URL**，下一步需要。

### 步骤 9：更新前端 API URL

编辑 `app/.env.production`：

```env
VITE_API_URL=https://health-tracker-api.bigmango911.workers.dev
```

替换为您实际的 Worker URL。

### 步骤 10：部署前端

```bash
npm run deploy:app
```

或手动：
```bash
cd app
npm run build
npx wrangler pages deploy dist --project-name=health-tracker
```

成功示例：
```
✨ Deployment complete!
🎉 Your site is live at: https://health-tracker.pages.dev
```

---

## 验证部署

### 1. 检查后端健康状态

```bash
curl https://health-tracker-api.bigmango911.workers.dev/

# 应该返回：
# {
#   "service": "Personal Health Tracker API",
#   "status": "healthy",
#   "version": "1.0.0"
# }
```

### 2. 检查数据库连接

```bash
# 测试用户表
npx wrangler d1 execute health-tracker-db \
  --command "SELECT COUNT(*) as user_count FROM users;"
```

### 3. 访问前端应用

打开浏览器访问：
```
https://health-tracker.pages.dev
```

或您的自定义域名。

### 4. 测试功能

1. **注册用户**
   - 点击"注册"
   - 输入邮箱和强密码（12+ 字符，含大小写和数字）
   - 验证注册成功

2. **登录**
   - 使用刚注册的账户登录
   - 验证 Token 存储正确

3. **记录数据**
   - 点击"记录"
   - 填入今天的健康数据
   - 提交并验证保存成功

4. **查看报告**
   - 点击"报告"
   - 验证图表显示正确

---

## 故障排除

### 问题 1：`wrangler: command not found`

**解决方案**：使用 npx
```bash
npx wrangler --version  # 应该有效
```

### 问题 2：`Not authenticated`

**解决方案**：重新登录
```bash
npx wrangler logout
npx wrangler login
```

### 问题 3：`Database not found`

**解决方案**：检查 `database_id`
```bash
# 列出所有数据库
npx wrangler d1 list

# 更新 wrangler.toml 中的 database_id
```

### 问题 4：`Schema initialization failed`

**解决方案**：检查 SQL 语法和权限
```bash
# 查看具体错误
npx wrangler d1 execute health-tracker-db --file=./schema.sql

# 手动检查表是否存在
npx wrangler d1 execute health-tracker-db \
  --command "SELECT name FROM sqlite_master WHERE type='table';"
```

### 问题 5：`CORS 错误`

**解决方案**：更新后端 CORS 配置
编辑 `server/src/index.ts`：
```typescript
origin: (origin) => {
  if (
    origin.includes('localhost') ||
    origin.includes('your-pages-domain.pages.dev')
  ) {
    return origin;
  }
  return 'https://your-pages-domain.pages.dev';
}
```

重新部署：
```bash
npm run deploy:server
```

### 问题 6：`API 请求失败`

**检查列表**：
1. 检查浏览器控制台错误信息
2. 检查后端 Worker 日志
   ```bash
   npx wrangler tail health-tracker-api
   ```
3. 检查 API URL 是否正确（.env.production）
4. 检查速率限制（429 状态码）

---

## 后续配置

### 自定义域名

在 Cloudflare Pages 中：
1. 进入 Pages 项目
2. 点击"自定义域"
3. 输入您的域名并按照提示配置 DNS

### 启用 HTTPS

Cloudflare 会自动为所有 Pages 提供 HTTPS。生产环境中已强制使用。

### 配置电子邮件通知

如需发送注册确认邮件等，可配置：
- SendGrid
- Mailgun
- Resend

### 数据备份

定期备份数据库：
```bash
npx wrangler d1 backup create health-tracker-db
```

---

## 环境变量总结

### 本地开发 (.dev.vars)
```
JWT_SECRET
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
```

### 生产环境（wrangler secrets）
```
JWT_SECRET
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
```

### 前端环境
```
VITE_API_URL=https://your-backend.workers.dev
```

---

## 常用命令速查

```bash
# 开发
npm run dev              # 启动前后端开发服务器
npm run dev:app         # 仅启动前端
npm run dev:server      # 仅启动后端

# 构建
npm run build           # 构建前端
npm run build:check     # 构建 + 类型检查

# 部署
npm run deploy          # 部署前后端
npm run deploy:server   # 仅部署后端
npm run deploy:app      # 仅部署前端

# 数据库
npm run db:init         # 初始化生产数据库
npm run db:local        # 初始化本地数据库

# 查看日志
npx wrangler tail health-tracker-api
```

---

## 支持

如有问题：
1. 查看 `README.md`
2. 查看 `SECURITY.md` 了解安全配置
3. 检查 Cloudflare 控制台日志
4. 查看浏览器开发者工具（Console 和 Network 标签页）

---

**部署成功！🎉**

您现在可以访问您的个人健康监测系统了。
