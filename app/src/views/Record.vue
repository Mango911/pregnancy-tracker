<template>
  <div class="min-h-screen pb-20">
    <!-- 顶部导航 -->
    <div class="ios-navbar">
      <div class="px-4 py-3 flex items-center safe-area-top">
        <button
          @click="$router.back()"
          class="mr-3 p-2 -ml-2 rounded-full hover:bg-light-border dark:hover:bg-dark-border transition-colors"
        >
          ←
        </button>
        <h1 class="text-xl font-bold">{{ pageTitle }}</h1>
      </div>
    </div>

    <div class="p-4">
      <RecordForm
        :record="currentRecord"
        :date="selectedDate"
        @saved="handleSaved"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRecordsStore } from '@/stores/records';
import RecordForm from '@/components/RecordForm.vue';

const router = useRouter();
const route = useRoute();
const recordsStore = useRecordsStore();

const selectedDate = ref<string>(
  (route.query.date as string) || new Date().toISOString().split('T')[0]
);
const currentRecord = ref(recordsStore.currentRecord);

const pageTitle = computed(() => {
  const date = new Date(selectedDate.value);
  const today = new Date().toISOString().split('T')[0];

  if (selectedDate.value === today) {
    return '记录今天';
  }

  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
  });
});

onMounted(async () => {
  if (selectedDate.value) {
    currentRecord.value = await recordsStore.loadRecordByDate(selectedDate.value);
  }
});

function handleSaved() {
  // 显示成功提示
  setTimeout(() => {
    router.push('/');
  }, 500);
}
</script>
