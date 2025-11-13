#!/bin/bash

# 个人健康监测系统部署脚本
# Personal Health Tracker Deployment Script

set -e

echo "================================================"
echo "🚀 个人健康监测系统部署"
echo "Personal Health Tracker Deployment"
echo "================================================"
echo ""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 第 1 步：检查前置条件
echo -e "${BLUE}[1/8]${NC} 检查前置条件..."
echo "Checking prerequisites..."

if ! command -v npx &> /dev/null; then
    echo -e "${RED}错误: npm/npx 未安装${NC}"
    echo "Error: npm/npx not found"
    exit 1
fi

if ! npx wrangler --version &> /dev/null; then
    echo -e "${YELLOW}Wrangler CLI 将通过 npx 自动安装${NC}"
    echo "Wrangler CLI will be auto-installed via npx"
fi

echo -e "${GREEN}✓ 前置条件检查完成${NC}"
echo ""

# 第 2 步：检查认证
echo -e "${BLUE}[2/8]${NC} 检查 Cloudflare 认证..."
echo "Checking Cloudflare authentication..."

if ! npx wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  需要进行 Cloudflare 认证${NC}"
    echo "Need Cloudflare authentication"
    echo ""
    echo "请运行以下命令登录:"
    echo "Please run the following command to login:"
    echo -e "${BLUE}npx wrangler login${NC}"
    echo ""
    read -p "已登录? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ Cloudflare 认证检查完成${NC}"
echo ""

# 第 3 步：检查本地开发环境变量
echo -e "${BLUE}[3/8]${NC} 检查本地开发环境..."
echo "Checking local development environment..."

if [ ! -f "server/.dev.vars" ]; then
    echo -e "${YELLOW}复制 .dev.vars.example 到 .dev.vars${NC}"
    echo "Copying .dev.vars.example to .dev.vars"
    cp server/.dev.vars.example server/.dev.vars

    echo -e "${YELLOW}⚠️  请编辑 server/.dev.vars 并填入以下内容:${NC}"
    echo "Please edit server/.dev.vars with:"
    echo "  - JWT_SECRET (32+ 字符随机密钥)"
    echo "  - VAPID_PUBLIC_KEY (从 web-push generate-vapid-keys 获得)"
    echo "  - VAPID_PRIVATE_KEY (从 web-push generate-vapid-keys 获得)"
    echo ""
    read -p "已配置 .dev.vars? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ 本地开发环境检查完成${NC}"
echo ""

# 第 4 步：创建/验证 D1 数据库
echo -e "${BLUE}[4/8]${NC} 创建/验证 D1 数据库..."
echo "Creating/verifying D1 database..."

read -p "是否已创建 D1 数据库？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "运行: npx wrangler d1 create health-tracker-db"
    echo "Run: npx wrangler d1 create health-tracker-db"
    echo ""
    echo -e "${YELLOW}请记录返回的 database_id，更新到 server/wrangler.toml${NC}"
    echo "Please record the returned database_id and update server/wrangler.toml"
    echo ""
    read -p "数据库创建完成? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ D1 数据库验证完成${NC}"
echo ""

# 第 5 步：初始化数据库 Schema
echo -e "${BLUE}[5/8]${NC} 初始化数据库 Schema..."
echo "Initializing database schema..."

cd server

echo "本地初始化: npm run db:local"
echo "Local initialization: npm run db:local"
npm run db:local

echo -e "${GREEN}✓ Schema 初始化完成${NC}"
cd ..
echo ""

# 第 6 步：设置生产环境 Secrets
echo -e "${BLUE}[6/8]${NC} 设置生产环境 Secrets..."
echo "Setting production secrets..."

echo -e "${YELLOW}将交互式提示输入以下 secrets:${NC}"
echo "Interactive prompts for the following secrets:"
echo "  1. JWT_SECRET"
echo "  2. VAPID_PUBLIC_KEY"
echo "  3. VAPID_PRIVATE_KEY"
echo ""

cd server

npx wrangler secret put JWT_SECRET
npx wrangler secret put VAPID_PUBLIC_KEY
npx wrangler secret put VAPID_PRIVATE_KEY

echo -e "${GREEN}✓ Secrets 设置完成${NC}"
echo ""

# 第 7 步：部署后端
echo -e "${BLUE}[7/8]${NC} 部署后端..."
echo "Deploying backend..."

npm run deploy
WORKER_URL=$(npx wrangler deployments list | head -5 | tail -1 | awk '{print $NF}')

echo -e "${GREEN}✓ 后端部署完成${NC}"
echo -e "${BLUE}Worker URL: ${WORKER_URL}${NC}"
echo ""

# 第 8 步：部署前端
echo -e "${BLUE}[8/8]${NC} 部署前端..."
echo "Deploying frontend..."

cd ..

# 更新前端 API URL
read -p "输入后端 Worker URL (或按 Enter 使用默认): " WORKER_URL
if [ -z "$WORKER_URL" ]; then
    WORKER_URL="https://health-tracker-api.your-account.workers.dev"
fi

echo "VITE_API_URL=$WORKER_URL" > app/.env.production

npm run deploy:app

echo -e "${GREEN}✓ 前端部署完成${NC}"
echo ""

echo "================================================"
echo -e "${GREEN}✨ 部署完成!${NC}"
echo "================================================"
echo ""
echo "下一步:"
echo "1. 访问前端应用 URL"
echo "2. 创建用户账户"
echo "3. 测试各项功能"
echo ""
echo "文档: 查看 README.md 了解更多信息"
echo ""
