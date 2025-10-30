# 🚀 部署指南

完整的从零到部署的详细步骤。

## 前置要求

- Node.js 18+
- npm 或 pnpm
- Cloudflare 账号
- Git（可选，用于 Pages 自动部署）

## 第一步：创建 Cloudflare D1 数据库

### 1.1 登录 Cloudflare

```bash
cd server
npx wrangler login
```

### 1.2 创建数据库

```bash
npx wrangler d1 create pregnancy-tracker-db
```

你会看到类似输出：

```
✅ Successfully created DB 'pregnancy-tracker-db'!

[[d1_databases]]
binding = "DB"
database_name = "pregnancy-tracker-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 1.3 复制 database_id

将 `database_id` 复制到 `server/wrangler.toml` 的对应位置。

### 1.4 初始化数据库表

```bash
# 生产环境
npx wrangler d1 execute pregnancy-tracker-db --file=./schema.sql

# 本地开发环境（可选）
npx wrangler d1 execute pregnancy-tracker-db --local --file=./schema.sql
```

验证表是否创建成功：

```bash
npx wrangler d1 execute pregnancy-tracker-db --command "SELECT name FROM sqlite_master WHERE type='table'"
```

## 第二步：配置 Web Push (VAPID)

### 2.1 生成 VAPID 密钥对

```bash
npx web-push generate-vapid-keys
```

输出示例：

```
=======================================
Public Key:
BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U

Private Key:
UUxI4O8-FbRouAevSmBQ6o8X5ltN0VyZpXxoS4q3LNQ
=======================================
```

### 2.2 配置到 wrangler.toml

编辑 `server/wrangler.toml`：

```toml
[vars]
JWT_SECRET = "your-super-secret-jwt-key-min-32-chars-long"
VAPID_PUBLIC_KEY = "你的-Public-Key"
VAPID_PRIVATE_KEY = "你的-Private-Key"
VAPID_EMAIL = "mailto:your-email@example.com"
```

**重要**：
- `JWT_SECRET` 至少 32 个字符，使用随机生成的强密码
- `VAPID_EMAIL` 必须是有效的邮箱地址

生成随机 JWT_SECRET：

```bash
# macOS/Linux
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 第三步：部署后端 (Workers)

### 3.1 安装依赖

```bash
cd server
npm install
```

### 3.2 本地测试（可选）

```bash
npm run dev
```

访问 `http://localhost:8787` 应该能看到：

```json
{
  "service": "Pregnancy Tracker API",
  "status": "healthy",
  "version": "1.0.0"
}
```

### 3.3 部署到 Cloudflare Workers

```bash
npm run deploy
```

部署成功后，记录你的 Worker URL：

```
Published pregnancy-tracker-api (0.xx sec)
  https://pregnancy-tracker-api.your-account.workers.dev
```

### 3.4 测试 API

```bash
# 测试健康检查
curl https://your-worker-url.workers.dev

# 测试注册接口
curl -X POST https://your-worker-url.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"测试用户"}'
```

## 第四步：部署前端 (Pages)

### 4.1 配置环境变量

```bash
cd app
cp .env.example .env
```

编辑 `.env`：

```env
VITE_API_URL=https://your-worker-url.workers.dev
```

### 4.2 安装依赖

```bash
npm install
```

### 4.3 本地测试

```bash
npm run dev
```

访问 `http://localhost:3000`，测试：
- 注册新账号
- 登录
- 记录数据
- 查看报告

### 4.4 构建生产版本

```bash
npm run build
```

检查 `dist/` 目录是否生成。

### 4.5 部署到 Cloudflare Pages

#### 方式 A：使用 Git 自动部署（推荐）

1. 将代码推送到 GitHub/GitLab：

```bash
cd ..  # 回到项目根目录
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/pregnancy-tracker.git
git push -u origin main
```

2. 在 Cloudflare Dashboard 中：

   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 **Pages** > **Create a project**
   - 选择 **Connect to Git**
   - 授权并选择你的仓库
   - 配置构建设置：
     ```
     Framework preset: Vue
     Build command: cd app && npm install && npm run build
     Build output directory: app/dist
     Root directory: /
     ```
   - 添加环境变量：
     ```
     VITE_API_URL = https://your-worker-url.workers.dev
     ```
   - 点击 **Save and Deploy**

3. 等待构建完成（约 2-3 分钟）

4. 你的应用将部署到：`https://pregnancy-tracker.pages.dev`

#### 方式 B：直接上传（适合快速测试）

```bash
cd app
npx wrangler pages deploy dist --project-name=pregnancy-tracker
```

## 第五步：配置自定义域名（可选）

### 5.1 添加域名到 Pages

1. 在 Pages 项目中，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名（例如：`app.yourdomain.com`）
4. 按照提示添加 DNS 记录

### 5.2 更新 CORS 配置

编辑 `server/src/index.ts`，更新 CORS 配置：

```typescript
origin: (origin) => {
  if (
    origin.includes('localhost') ||
    origin.includes('pregnancy-tracker.pages.dev') ||
    origin.includes('yourdomain.com')  // 添加你的域名
  ) {
    return origin;
  }
  return 'https://yourdomain.com';
}
```

重新部署后端：

```bash
cd server
npm run deploy
```

## 第六步：配置定时任务

定时推送通知已在 `wrangler.toml` 中配置：

```toml
[triggers]
crons = ["0 1 * * *"]  # 每天 UTC 01:00 (北京时间 09:00)
```

修改时间：

- `0 1 * * *` = 每天 UTC 01:00（北京时间 09:00）
- `0 9 * * *` = 每天 UTC 09:00（北京时间 17:00）
- `0 0 * * *` = 每天 UTC 00:00（北京时间 08:00）

Cron 格式：`分钟 小时 日 月 星期`

修改后重新部署：

```bash
cd server
npm run deploy
```

## 第七步：验证部署

### 7.1 测试前端

访问你的 Pages URL，测试：

- ✅ 页面正常加载
- ✅ 注册新账号
- ✅ 登录
- ✅ 记录今天的数据
- ✅ 查看统计报告
- ✅ 切换深色模式

### 7.2 测试 PWA 安装（iOS）

在 iOS 设备上：

1. 使用 Safari 访问应用
2. 点击分享按钮
3. 选择"添加到主屏幕"
4. 从主屏幕打开应用

### 7.3 测试推送通知

1. 在应用首页，开启"每日提醒"
2. 允许通知权限
3. 测试立即推送：
   ```bash
   curl -X POST https://your-worker-url.workers.dev/api/push/test \
     -H "Authorization: Bearer your-jwt-token"
   ```

4. 等待定时推送（根据 cron 设置的时间）

## 常见问题排查

### ❌ 数据库连接失败

**错误**：`D1_ERROR: no such table: users`

**解决**：
```bash
cd server
npx wrangler d1 execute pregnancy-tracker-db --file=./schema.sql
```

### ❌ CORS 错误

**错误**：`Access to fetch has been blocked by CORS policy`

**解决**：
1. 检查 `server/src/index.ts` 的 CORS 配置
2. 确认前端 URL 在允许列表中
3. 重新部署后端

### ❌ 推送通知不工作

**可能原因**：
- iOS 版本 < 16.4
- 未从主屏幕图标启动
- VAPID 密钥配置错误
- 通知权限未授予

**排查**：
1. 检查 iOS 版本：设置 > 通用 > 关于本机
2. 确认从主屏幕图标打开应用
3. 验证 VAPID 密钥正确配置
4. 查看浏览器控制台错误

### ❌ 构建失败

**错误**：`Module not found` 或 `Cannot find module`

**解决**：
```bash
# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json
# 重新安装
npm install
# 重新构建
npm run build
```

## 监控和维护

### 查看 Workers 日志

```bash
npx wrangler tail pregnancy-tracker-api
```

### 查看 Pages 构建日志

在 Cloudflare Dashboard > Pages > 你的项目 > Deployments

### 数据库备份

```bash
# 导出所有数据
npx wrangler d1 execute pregnancy-tracker-db \
  --command "SELECT * FROM records" \
  --json > backup-records-$(date +%Y%m%d).json

npx wrangler d1 execute pregnancy-tracker-db \
  --command "SELECT * FROM users" \
  --json > backup-users-$(date +%Y%m%d).json
```

### 更新应用

前端更新（自动）：
- 推送代码到 Git
- Pages 自动构建部署

后端更新：
```bash
cd server
npm run deploy
```

## 成本估算

基于 Cloudflare 免费计划：

- **Workers**: 100,000 请求/天（免费）
- **Pages**: 无限请求（免费）
- **D1**: 5GB 存储 + 500 万行读取/天（免费）
- **定时任务**: 3 个定时任务（免费）

**结论**：对于个人使用，完全免费！

---

🎉 恭喜！你的应用已成功部署！

如有问题，请查看 [README.md](./README.md) 或提交 Issue。
