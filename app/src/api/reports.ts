import { apiRequest } from '@/api/config';
import type { Report } from '@/types';

export async function getWeekReport(date?: string): Promise<Report> {
  const query = date ? `?date=${date}` : '';
  return apiRequest(`/api/reports/week${query}`);
}

export async function getMonthReport(date?: string): Promise<Report> {
  const query = date ? `?date=${date}` : '';
  return apiRequest(`/api/reports/month${query}`);
}
