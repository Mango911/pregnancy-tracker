# 快速部署 (Quick Deploy)

## 5 分钟快速部署

### 前提条件
- [ ] Cloudflare 账户
- [ ] Node.js 已安装
- [ ] 项目已克隆

---

## 🚀 自动化部署（推荐）

```bash
chmod +x DEPLOY.sh
./DEPLOY.sh
```

脚本会自动完成所有步骤。

---

## 🔧 手动部署（快速版）

### 1️⃣ 认证登录
```bash
npx wrangler login
```

### 2️⃣ 生成密钥
```bash
cd server
npx web-push generate-vapid-keys
# 记录输出的 Public Key 和 Private Key
```

### 3️⃣ 配置密钥
```bash
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars，填入：
# - JWT_SECRET (随意 32+ 字符密钥)
# - VAPID_PUBLIC_KEY
# - VAPID_PRIVATE_KEY
```

### 4️⃣ 创建数据库
```bash
npx wrangler d1 create health-tracker-db
# 记录输出的 database_id
```

### 5️⃣ 更新配置
编辑 `server/wrangler.toml`，替换 database_id：
```toml
database_id = "你的-database-id-在这里"
```

### 6️⃣ 初始化 Schema
```bash
npm run db:init
```

### 7️⃣ 设置生产密钥
```bash
npx wrangler secret put JWT_SECRET
# 粘贴密钥，按 Ctrl+D

npx wrangler secret put VAPID_PUBLIC_KEY
# 粘贴密钥，按 Ctrl+D

npx wrangler secret put VAPID_PRIVATE_KEY
# 粘贴密钥，按 Ctrl+D
```

### 8️⃣ 部署
```bash
npm run deploy
```

### 9️⃣ 配置前端 API URL
编辑 `app/.env.production`：
```env
VITE_API_URL=https://health-tracker-api.你的账户.workers.dev
```

### 🔟 完成
```bash
npm run deploy:app
```

---

## ✅ 验证

```bash
# 检查后端
curl https://health-tracker-api.你的账户.workers.dev/

# 应该返回：
# {"service":"Personal Health Tracker API","status":"healthy","version":"1.0.0"}
```

然后访问前端 URL，应该看到登录页面。

---

## 📚 详细文档

- 遇到问题？查看 `DEPLOYMENT_GUIDE.md`
- 安全问题？查看 `SECURITY.md`
- 完整说明？查看 `README.md`

---

## 常见错误

| 错误 | 解决方案 |
|------|--------|
| `Not authenticated` | 运行 `npx wrangler login` |
| `Database not found` | 检查 wrangler.toml 中的 database_id |
| `CORS error` | 检查 app/.env.production 中的 VITE_API_URL |
| `Secret not found` | 运行 `npx wrangler secret list` 验证 |

---

**现在就开始部署吧！** 🚀
