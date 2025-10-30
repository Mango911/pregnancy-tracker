import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as recordsApi from '@/api/records';
import type { DailyRecord } from '@/types';

export const useRecordsStore = defineStore('records', () => {
  const currentRecord = ref<DailyRecord | null>(null);
  const records = ref<DailyRecord[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function saveRecord(record: DailyRecord) {
    loading.value = true;
    error.value = null;

    try {
      const response = await recordsApi.createOrUpdateRecord(record);
      currentRecord.value = response.record;

      // 更新本地缓存
      const index = records.value.findIndex((r) => r.date === record.date);
      if (index >= 0) {
        records.value[index] = response.record;
      } else {
        records.value.unshift(response.record);
      }

      return true;
    } catch (e: any) {
      error.value = e.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function loadRecordByDate(date: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await recordsApi.getRecordByDate(date);
      currentRecord.value = response.record;
      return response.record;
    } catch (e: any) {
      error.value = e.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function loadRecentRecords(limit: number = 30) {
    loading.value = true;
    error.value = null;

    try {
      const response = await recordsApi.getRecentRecords(limit);
      records.value = response.records;
      return response.records;
    } catch (e: any) {
      error.value = e.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function loadRecordsByDateRange(startDate: string, endDate: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await recordsApi.getRecordsByDateRange(startDate, endDate);
      return response.records;
    } catch (e: any) {
      error.value = e.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  return {
    currentRecord,
    records,
    loading,
    error,
    saveRecord,
    loadRecordByDate,
    loadRecentRecords,
    loadRecordsByDateRange,
  };
});
