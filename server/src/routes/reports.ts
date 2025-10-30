import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { getRecordsByDateRange } from '../db/records';

const reports = new Hono();

reports.use('/*', authMiddleware);

// 获取周报
reports.get('/week', async (c) => {
  try {
    const userId = c.get('userId');
    const date = c.req.query('date') || new Date().toISOString().split('T')[0];

    // 计算本周的开始和结束日期
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();
    const startDate = new Date(targetDate);
    startDate.setDate(targetDate.getDate() - dayOfWeek);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const records = await getRecordsByDateRange(
      c.env.DB,
      userId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    // 计算统计数据
    const stats = calculateStats(records);

    return c.json({
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      },
      stats,
      records,
    });
  } catch (error) {
    console.error('Get week report error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// 获取月报
reports.get('/month', async (c) => {
  try {
    const userId = c.get('userId');
    const date = c.req.query('date') || new Date().toISOString().split('T')[0];

    // 计算本月的开始和结束日期
    const targetDate = new Date(date);
    const startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

    const records = await getRecordsByDateRange(
      c.env.DB,
      userId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    const stats = calculateStats(records);

    return c.json({
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      },
      stats,
      records,
    });
  } catch (error) {
    console.error('Get month report error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

function calculateStats(records: any[]) {
  if (records.length === 0) {
    return null;
  }

  const totalRecords = records.length;

  // 睡眠统计
  const sleepRecords = records.filter((r) => r.sleep_hours !== null);
  const avgSleepHours = sleepRecords.length
    ? sleepRecords.reduce((sum, r) => sum + r.sleep_hours, 0) / sleepRecords.length
    : 0;
  const avgSleepQuality = sleepRecords.length
    ? sleepRecords.reduce((sum, r) => sum + (r.sleep_quality || 0), 0) / sleepRecords.length
    : 0;

  // 运动统计
  const exerciseRecords = records.filter((r) => r.exercise_minutes !== null);
  const totalExerciseMinutes = exerciseRecords.reduce((sum, r) => sum + r.exercise_minutes, 0);
  const avgExerciseMinutes = exerciseRecords.length
    ? totalExerciseMinutes / exerciseRecords.length
    : 0;

  // 饮水统计
  const waterRecords = records.filter((r) => r.water_intake !== null);
  const avgWaterIntake = waterRecords.length
    ? waterRecords.reduce((sum, r) => sum + r.water_intake, 0) / waterRecords.length
    : 0;

  // 心情统计
  const moodRecords = records.filter((r) => r.mood !== null);
  const avgMood = moodRecords.length
    ? moodRecords.reduce((sum, r) => sum + r.mood, 0) / moodRecords.length
    : 0;

  // 压力统计
  const stressRecords = records.filter((r) => r.stress_level !== null);
  const avgStress = stressRecords.length
    ? stressRecords.reduce((sum, r) => sum + r.stress_level, 0) / stressRecords.length
    : 0;

  // 体温统计
  const tempRecords = records.filter((r) => r.body_temperature !== null);
  const avgBodyTemp = tempRecords.length
    ? tempRecords.reduce((sum, r) => sum + r.body_temperature, 0) / tempRecords.length
    : 0;

  // 体重统计
  const weightRecords = records.filter((r) => r.weight !== null);
  const avgWeight = weightRecords.length
    ? weightRecords.reduce((sum, r) => sum + r.weight, 0) / weightRecords.length
    : 0;

  return {
    totalRecords,
    sleep: {
      avgHours: parseFloat(avgSleepHours.toFixed(1)),
      avgQuality: parseFloat(avgSleepQuality.toFixed(1)),
    },
    exercise: {
      totalMinutes: totalExerciseMinutes,
      avgMinutes: parseFloat(avgExerciseMinutes.toFixed(1)),
      days: exerciseRecords.length,
    },
    water: {
      avgIntake: parseFloat(avgWaterIntake.toFixed(1)),
    },
    mood: {
      avgMood: parseFloat(avgMood.toFixed(1)),
    },
    stress: {
      avgLevel: parseFloat(avgStress.toFixed(1)),
    },
    bodyTemp: {
      avg: parseFloat(avgBodyTemp.toFixed(2)),
    },
    weight: {
      avg: parseFloat(avgWeight.toFixed(1)),
    },
  };
}

export default reports;
