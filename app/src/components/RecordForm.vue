<template>
  <div class="space-y-4">
    <!-- 日期选择 -->
    <div class="ios-card p-4">
      <label class="block text-sm font-medium mb-2">日期</label>
      <input
        v-model="localRecord.date"
        type="date"
        class="ios-input"
        :max="today"
      />
    </div>

    <!-- 睡眠 -->
    <div class="ios-card p-4">
      <h3 class="font-semibold mb-3 text-ios-blue">睡眠</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm mb-2">睡眠时长（小时）</label>
          <input
            v-model.number="localRecord.sleep_hours"
            type="number"
            step="0.5"
            min="0"
            max="24"
            class="ios-input"
            placeholder="例如：8"
          />
        </div>
        <div>
          <label class="block text-sm mb-2">睡眠质量</label>
          <div class="flex gap-2">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              @click="localRecord.sleep_quality = i"
              :class="[
                'flex-1 py-2 rounded-ios transition-all',
                localRecord.sleep_quality === i
                  ? 'bg-ios-blue text-white'
                  : 'bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border',
              ]"
            >
              {{ i }}
            </button>
          </div>
          <p class="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
            1=很差，5=很好
          </p>
        </div>
      </div>
    </div>

    <!-- 运动 -->
    <div class="ios-card p-4">
      <h3 class="font-semibold mb-3 text-ios-green">运动</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm mb-2">运动时长（分钟）</label>
          <input
            v-model.number="localRecord.exercise_minutes"
            type="number"
            min="0"
            class="ios-input"
            placeholder="例如：30"
          />
        </div>
        <div>
          <label class="block text-sm mb-2">运动类型</label>
          <input
            v-model="localRecord.exercise_type"
            type="text"
            class="ios-input"
            placeholder="例如：瑜伽、跑步"
          />
        </div>
      </div>
    </div>

    <!-- 饮食 -->
    <div class="ios-card p-4">
      <h3 class="font-semibold mb-3 text-ios-orange">饮食</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm mb-2">早餐</label>
          <input
            v-model="localRecord.diet_breakfast"
            type="text"
            class="ios-input"
            placeholder="吃了什么？"
          />
        </div>
        <div>
          <label class="block text-sm mb-2">午餐</label>
          <input
            v-model="localRecord.diet_lunch"
            type="text"
            class="ios-input"
            placeholder="吃了什么？"
          />
        </div>
        <div>
          <label class="block text-sm mb-2">晚餐</label>
          <input
            v-model="localRecord.diet_dinner"
            type="text"
            class="ios-input"
            placeholder="吃了什么？"
          />
        </div>
        <div>
          <label class="block text-sm mb-2">零食/加餐</label>
          <input
            v-model="localRecord.diet_snacks"
            type="text"
            class="ios-input"
            placeholder="可选"
          />
        </div>
        <div>
          <label class="block text-sm mb-2">饮水量（毫升）</label>
          <input
            v-model.number="localRecord.water_intake"
            type="number"
            min="0"
            class="ios-input"
            placeholder="例如：2000"
          />
        </div>
      </div>
    </div>

    <!-- 心情与压力 -->
    <div class="ios-card p-4">
      <h3 class="font-semibold mb-3 text-ios-pink">心情与压力</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm mb-2">心情</label>
          <div class="flex gap-2">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              @click="localRecord.mood = i"
              :class="[
                'flex-1 py-2 rounded-ios transition-all',
                localRecord.mood === i
                  ? 'bg-ios-pink text-white'
                  : 'bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border',
              ]"
            >
              {{ ['😢', '😞', '😐', '😊', '😄'][i - 1] }}
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm mb-2">压力水平</label>
          <div class="flex gap-2">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              @click="localRecord.stress_level = i"
              :class="[
                'flex-1 py-2 rounded-ios transition-all',
                localRecord.stress_level === i
                  ? 'bg-ios-red text-white'
                  : 'bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border',
              ]"
            >
              {{ i }}
            </button>
          </div>
          <p class="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
            1=轻松，5=压力大
          </p>
        </div>
      </div>
    </div>

    <!-- 健康指标 -->
    <div class="ios-card p-4">
      <h3 class="font-semibold mb-3 text-ios-purple">健康指标</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm mb-2">基础体温（℃）</label>
          <input
            v-model.number="localRecord.body_temperature"
            type="number"
            step="0.1"
            min="35"
            max="42"
            class="ios-input"
            placeholder="例如：36.5"
          />
        </div>
        <div>
          <label class="block text-sm mb-2">体重（kg）</label>
          <input
            v-model.number="localRecord.weight"
            type="number"
            step="0.1"
            min="0"
            class="ios-input"
            placeholder="例如：55.5"
          />
        </div>
      </div>
    </div>

    <!-- 备注 -->
    <div class="ios-card p-4">
      <label class="block text-sm font-medium mb-2">备注</label>
      <textarea
        v-model="localRecord.notes"
        class="ios-input resize-none"
        rows="4"
        placeholder="今天有什么特别的吗？"
      />
    </div>

    <!-- 提交按钮 -->
    <div class="sticky bottom-0 safe-area-bottom pb-4">
      <button
        @click="handleSave"
        :disabled="recordsStore.loading"
        class="ios-button-primary w-full shadow-ios-lg"
      >
        <span v-if="recordsStore.loading">保存中...</span>
        <span v-else>保存记录</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRecordsStore } from '@/stores/records';
import type { DailyRecord } from '@/types';

const props = defineProps<{
  record?: DailyRecord | null;
  date?: string;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const recordsStore = useRecordsStore();

const today = new Date().toISOString().split('T')[0];

const localRecord = reactive<DailyRecord>({
  date: props.date || today,
  sleep_hours: undefined,
  sleep_quality: undefined,
  exercise_minutes: undefined,
  exercise_type: undefined,
  diet_breakfast: undefined,
  diet_lunch: undefined,
  diet_dinner: undefined,
  diet_snacks: undefined,
  water_intake: undefined,
  mood: undefined,
  stress_level: undefined,
  body_temperature: undefined,
  weight: undefined,
  notes: undefined,
});

// 如果传入了 record，填充表单
watch(
  () => props.record,
  (newRecord) => {
    if (newRecord) {
      Object.assign(localRecord, newRecord);
    }
  },
  { immediate: true }
);

async function handleSave() {
  const success = await recordsStore.saveRecord(localRecord);
  if (success) {
    emit('saved');
  }
}
</script>
