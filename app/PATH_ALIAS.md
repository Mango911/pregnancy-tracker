# 路径别名使用指南

本项目已配置路径别名 `@` 指向 `src/` 目录，无需使用相对路径。

## ✅ 配置说明

### Vite 配置 (vite.config.ts)

```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### TypeScript 配置 (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📝 使用规则

### ✅ 正确：使用别名

```typescript
// 导入 stores
import { useAuthStore } from '@/stores/auth';
import { useRecordsStore } from '@/stores/records';
import { usePushStore } from '@/stores/push';

// 导入 API
import * as authApi from '@/api/auth';
import * as recordsApi from '@/api/records';
import { getWeekReport } from '@/api/reports';

// 导入类型
import type { User, DailyRecord } from '@/types';

// 导入组件
import AuthForm from '@/components/AuthForm.vue';
import RecordForm from '@/components/RecordForm.vue';

// 导入样式
import '@/styles/main.css';

// 导入路由
import router from '@/router';
```

### ❌ 错误：使用相对路径

```typescript
// ❌ 不要这样写
import { useAuthStore } from '../stores/auth';
import { useAuthStore } from '../../stores/auth';
import { useAuthStore } from './stores/auth';

// ❌ 不要这样写
import type { User } from '../types';
import type { User } from '../../types';

// ❌ 不要这样写
import AuthForm from '../components/AuthForm.vue';
import AuthForm from '../../components/AuthForm.vue';
```

## 📂 目录结构映射

| 别名路径 | 实际路径 | 说明 |
|---------|---------|------|
| `@/api/*` | `src/api/*` | API 调用封装 |
| `@/components/*` | `src/components/*` | Vue 组件 |
| `@/views/*` | `src/views/*` | 页面视图 |
| `@/stores/*` | `src/stores/*` | Pinia 状态管理 |
| `@/router` | `src/router` | 路由配置 |
| `@/types` | `src/types` | TypeScript 类型 |
| `@/styles/*` | `src/styles/*` | 全局样式 |
| `@/utils/*` | `src/utils/*` | 工具函数 |
| `@/assets/*` | `src/assets/*` | 静态资源 |

## 🎯 使用场景示例

### 1. 在组件中导入

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import type { User } from '@/types';

const authStore = useAuthStore();
const router = useRouter();
</script>
```

### 2. 在 Store 中导入

```typescript
// stores/auth.ts
import { defineStore } from 'pinia';
import * as authApi from '@/api/auth';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // ...
});
```

### 3. 在 API 层导入

```typescript
// api/auth.ts
import { apiRequest } from '@/api/config';
import type { AuthResponse } from '@/types';

export async function login(email: string, password: string) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
```

### 4. 在路由配置中导入

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/record',
      component: () => import('@/views/Record.vue'),
    },
  ],
});
```

## 💡 优势

1. **可读性更强**：`@/stores/auth` 比 `../../stores/auth` 更清晰
2. **易于维护**：移动文件时不需要修改导入路径
3. **避免错误**：不会因为相对路径层级错误导致导入失败
4. **IDE 支持**：现代 IDE 都支持路径别名的智能提示和跳转
5. **统一风格**：整个项目使用统一的导入方式

## 🔧 IDE 配置

### VSCode

安装推荐插件：
- **Path Intellisense** - 路径自动补全
- **TypeScript Vue Plugin (Volar)** - Vue 3 支持

配置已自动生效，无需额外设置。

### WebStorm

WebStorm 会自动识别 `tsconfig.json` 中的 `paths` 配置。

## 📖 命名约定

- 所有从 `src/` 目录导入的内容都使用 `@/` 前缀
- 第三方包使用正常导入：`import { ref } from 'vue'`
- 相对导入只在同一目录下使用（非常少见，尽量避免）

## 常见问题

### Q: 为什么不使用多个别名（如 `@api`, `@stores`）？

A: 单一的 `@/` 别名更简洁统一，避免记忆多个别名。所有路径都从 `src/` 开始，结构清晰。

### Q: 在测试文件中如何使用？

A: 测试文件也应该使用 `@/` 别名：

```typescript
import { mount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import { useAuthStore } from '@/stores/auth';
```

### Q: 构建后路径会正确吗？

A: 会的。Vite 在构建时会自动解析别名，转换为正确的相对路径。

---

**现在整个项目的导入路径都是统一、清晰、易维护的！** 🎉
