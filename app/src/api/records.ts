import { apiRequest } from '@/api/config';
import type { DailyRecord } from '@/types';

export async function createOrUpdateRecord(
  record: DailyRecord
): Promise<{ record: DailyRecord }> {
  return apiRequest('/api/records', {
    method: 'POST',
    body: JSON.stringify(record),
  });
}

export async function getRecordByDate(date: string): Promise<{ record: DailyRecord | null }> {
  return apiRequest(`/api/records/${date}`);
}

export async function getRecordsByDateRange(
  startDate: string,
  endDate: string
): Promise<{ records: DailyRecord[] }> {
  return apiRequest(`/api/records?start=${startDate}&end=${endDate}`);
}

export async function getRecentRecords(limit: number = 30): Promise<{ records: DailyRecord[] }> {
  return apiRequest(`/api/records?limit=${limit}`);
}
