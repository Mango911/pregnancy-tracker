<template>
  <div class="min-h-screen pb-20">
    <!-- 顶部导航 -->
    <div class="ios-navbar">
      <div class="px-4 py-3 flex items-center justify-between safe-area-top">
        <h1 class="text-xl font-bold">备孕记录</h1>
        <div class="flex items-center gap-3">
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-full hover:bg-light-border dark:hover:bg-dark-border transition-colors"
          >
            <span v-if="isDark">🌙</span>
            <span v-else>☀️</span>
          </button>
          <button
            @click="showSettings = true"
            class="p-2 rounded-full hover:bg-light-border dark:hover:bg-dark-border transition-colors"
          >
            ⚙️
          </button>
        </div>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <!-- 今日卡片 -->
      <div class="ios-card p-5">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold">今日记录</h2>
          <span class="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {{ todayDate }}
          </span>
        </div>

        <div v-if="todayRecord" class="space-y-2">
          <div class="flex items-center gap-2 text-sm">
            <span>😴 睡眠：{{ todayRecord.sleep_hours || '--' }} 小时</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span>🏃 运动：{{ todayRecord.exercise_minutes || '--' }} 分钟</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span>💧 饮水：{{ todayRecord.water_intake || '--' }} ml</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span>😊 心情：{{ getMoodEmoji(todayRecord.mood) }}</span>
          </div>
        </div>

        <div v-else class="text-center py-4 text-light-text-tertiary dark:text-dark-text-tertiary">
          今天还没有记录哦
        </div>

        <button
          @click="$router.push('/record')"
          class="ios-button-primary w-full mt-4"
        >
          {{ todayRecord ? '编辑今日记录' : '记录今天' }}
        </button>
      </div>

      <!-- 本周概览 -->
      <div class="ios-card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">本周概览</h2>
          <button
            @click="$router.push('/reports')"
            class="text-ios-blue text-sm"
          >
            查看详情 →
          </button>
        </div>

        <div v-if="weekStats" class="grid grid-cols-2 gap-3">
          <div class="bg-light-bg dark:bg-dark-bg rounded-ios p-3">
            <div class="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              平均睡眠
            </div>
            <div class="text-2xl font-bold text-ios-blue">
              {{ weekStats.sleep.avgHours }}h
            </div>
          </div>
          <div class="bg-light-bg dark:bg-dark-bg rounded-ios p-3">
            <div class="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              运动天数
            </div>
            <div class="text-2xl font-bold text-ios-green">
              {{ weekStats.exercise.days }}
            </div>
          </div>
          <div class="bg-light-bg dark:bg-dark-bg rounded-ios p-3">
            <div class="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              平均心情
            </div>
            <div class="text-2xl font-bold text-ios-pink">
              {{ weekStats.mood.avgMood }}/5
            </div>
          </div>
          <div class="bg-light-bg dark:bg-dark-bg rounded-ios p-3">
            <div class="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              记录天数
            </div>
            <div class="text-2xl font-bold text-ios-purple">
              {{ weekStats.totalRecords }}
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4 text-light-text-tertiary dark:text-dark-text-tertiary">
          暂无数据
        </div>
      </div>

      <!-- 最近记录 -->
      <div class="ios-card p-5">
        <h2 class="text-lg font-semibold mb-4">最近记录</h2>

        <div v-if="recentRecords.length" class="space-y-3">
          <div
            v-for="record in recentRecords.slice(0, 5)"
            :key="record.id"
            @click="viewRecord(record)"
            class="flex items-center justify-between p-3 bg-light-bg dark:bg-dark-bg rounded-ios cursor-pointer hover:scale-[0.98] transition-transform"
          >
            <div>
              <div class="font-medium">{{ formatDate(record.date) }}</div>
              <div class="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                {{ getRecordSummary(record) }}
              </div>
            </div>
            <div class="text-light-text-tertiary dark:text-dark-text-tertiary">
              →
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4 text-light-text-tertiary dark:text-dark-text-tertiary">
          暂无记录
        </div>
      </div>

      <!-- 提醒设置 -->
      <div class="ios-card p-5">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">每日提醒</h3>
            <p class="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
              {{ pushStore.isSubscribed ? '已开启推送通知' : '开启后每天提醒记录' }}
            </p>
          </div>
          <button
            @click="togglePushNotifications"
            :disabled="pushStore.loading"
            :class="[
              'w-12 h-7 rounded-full transition-colors relative',
              pushStore.isSubscribed ? 'bg-ios-green' : 'bg-light-border dark:bg-dark-border',
            ]"
          >
            <div
              :class="[
                'w-5 h-5 bg-white rounded-full absolute top-1 transition-transform',
                pushStore.isSubscribed ? 'translate-x-6' : 'translate-x-1',
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <Teleport to="body">
      <div
        v-if="showSettings"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50"
        @click.self="showSettings = false"
      >
        <div class="ios-card w-full sm:max-w-md mx-4 mb-4 p-5 animate-slide-up">
          <h2 class="text-xl font-bold mb-4">设置</h2>

          <div class="space-y-3">
            <div class="flex items-center justify-between py-3 border-b border-light-border dark:border-dark-border">
              <span>用户：{{ authStore.user?.email }}</span>
            </div>

            <button
              @click="handleLogout"
              class="ios-button-secondary w-full text-ios-red"
            >
              退出登录
            </button>

            <button
              @click="showSettings = false"
              class="ios-button-secondary w-full"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useRecordsStore } from '@/stores/records';
import { usePushStore } from '@/stores/push';
import { getWeekReport } from '@/api/reports';
import type { DailyRecord, ReportStats } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const recordsStore = useRecordsStore();
const pushStore = usePushStore();

const showSettings = ref(false);
const isDark = ref(document.documentElement.classList.contains('dark'));
const todayRecord = ref<DailyRecord | null>(null);
const recentRecords = ref<DailyRecord[]>([]);
const weekStats = ref<ReportStats | null>(null);

const todayDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

onMounted(async () => {
  await loadData();
  pushStore.checkSubscription();
});

async function loadData() {
  const today = new Date().toISOString().split('T')[0];

  // 加载今日记录
  todayRecord.value = await recordsStore.loadRecordByDate(today);

  // 加载最近记录
  recentRecords.value = await recordsStore.loadRecentRecords(10);

  // 加载本周统计
  try {
    const report = await getWeekReport();
    weekStats.value = report.stats;
  } catch (error) {
    console.error('Failed to load week stats:', error);
  }
}

function toggleDarkMode() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
}

async function togglePushNotifications() {
  if (pushStore.isSubscribed) {
    await pushStore.unsubscribe();
  } else {
    const success = await pushStore.subscribe();
    if (!success && pushStore.error) {
      alert(pushStore.error);
    }
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}

function viewRecord(record: DailyRecord) {
  router.push(`/record?date=${record.date}`);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split('T')[0]) {
    return '今天';
  } else if (dateStr === yesterday.toISOString().split('T')[0]) {
    return '昨天';
  }

  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
}

function getMoodEmoji(mood?: number) {
  if (!mood) return '--';
  return ['😢', '😞', '😐', '😊', '😄'][mood - 1] || '--';
}

function getRecordSummary(record: DailyRecord) {
  const parts = [];
  if (record.sleep_hours) parts.push(`睡${record.sleep_hours}h`);
  if (record.exercise_minutes) parts.push(`运动${record.exercise_minutes}分`);
  if (record.mood) parts.push(getMoodEmoji(record.mood));
  return parts.join(' · ') || '无详情';
}
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
