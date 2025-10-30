<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo / Title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-ios-blue mb-2">备孕记录</h1>
        <p class="text-light-text-secondary dark:text-dark-text-secondary">
          健康记录，科学备孕
        </p>
      </div>

      <!-- Form Card -->
      <div class="ios-card p-6">
        <div class="flex mb-6 border-b border-light-border dark:border-dark-border">
          <button
            @click="mode = 'login'"
            :class="[
              'flex-1 py-3 text-center font-medium transition-colors',
              mode === 'login'
                ? 'text-ios-blue border-b-2 border-ios-blue'
                : 'text-light-text-tertiary dark:text-dark-text-tertiary',
            ]"
          >
            登录
          </button>
          <button
            @click="mode = 'register'"
            :class="[
              'flex-1 py-3 text-center font-medium transition-colors',
              mode === 'register'
                ? 'text-ios-blue border-b-2 border-ios-blue'
                : 'text-light-text-tertiary dark:text-dark-text-tertiary',
            ]"
          >
            注册
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="mode === 'register'">
            <label class="block text-sm font-medium mb-2">姓名（可选）</label>
            <input
              v-model="form.name"
              type="text"
              class="ios-input"
              placeholder="请输入姓名"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">邮箱</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="ios-input"
              placeholder="请输入邮箱"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">密码</label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="ios-input"
              placeholder="请输入密码（至少 6 位）"
            />
          </div>

          <div v-if="authStore.error" class="text-ios-red text-sm">
            {{ authStore.error }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="ios-button-primary w-full"
          >
            <span v-if="authStore.loading">处理中...</span>
            <span v-else>{{ mode === 'login' ? '登录' : '注册' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const mode = ref<'login' | 'register'>('login');
const form = reactive({
  email: '',
  password: '',
  name: '',
});

async function handleSubmit() {
  let success = false;

  if (mode.value === 'login') {
    success = await authStore.login(form.email, form.password);
  } else {
    success = await authStore.register(form.email, form.password, form.name || undefined);
  }

  if (success) {
    router.push('/');
  }
}
</script>
