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
        <h1 class="text-xl font-bold">统计报告</h1>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <!-- 周期选择 -->
      <div class="ios-card p-4">
        <div class="flex gap-2">
          <button
            @click="period = 'week'"
            :class="[
              'flex-1 py-2 rounded-ios transition-all',
              period === 'week'
                ? 'bg-ios-blue text-white'
                : 'bg-light-bg dark:bg-dark-bg',
            ]"
          >
            本周
          </button>
          <button
            @click="period = 'month'"
            :class="[
              'flex-1 py-2 rounded-ios transition-all',
              period === 'month'
                ? 'bg-ios-blue text-white'
                : 'bg-light-bg dark:bg-dark-bg',
            ]"
          >
            本月
          </button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div v-if="stats" class="space-y-4">
        <!-- 睡眠统计 -->
        <div class="ios-card p-5">
          <h3 class="font-semibold text-ios-blue mb-3">😴 睡眠</h3>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                平均时长
              </div>
              <div class="text-2xl font-bold">{{ stats.sleep.avgHours }}h</div>
            </div>
            <div>
              <div class="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                平均质量
              </div>
              <div class="text-2xl font-bold">{{ stats.sleep.avgQuality }}/5</div>
            </div>
          </div>
          <canvas ref="sleepChart" class="mt-4" />
        </div>

        <!-- 运动统计 -->
        <div class="ios-card p-5">
          <h3 class="font-semibold text-ios-green mb-3">🏃 运动</h3>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                运动天数
              </div>
              <div class="text-2xl font-bold">{{ stats.exercise.days }}天</div>
            </div>
            <div>
              <div class="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                总时长
              </div>
              <div class="text-2xl font-bold">{{ stats.exercise.totalMinutes }}分</div>
            </div>
          </div>
          <canvas ref="exerciseChart" class="mt-4" />
        </div>

        <!-- 饮水统计 -->
        <div class="ios-card p-5">
          <h3 class="font-semibold text-ios-teal mb-3">💧 饮水</h3>
          <div>
            <div class="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              平均饮水量
            </div>
            <div class="text-2xl font-bold">{{ stats.water.avgIntake }}ml</div>
          </div>
          <canvas ref="waterChart" class="mt-4" />
        </div>

        <!-- 心情统计 -->
        <div class="ios-card p-5">
          <h3 class="font-semibold text-ios-pink mb-3">😊 心情</h3>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                平均心情
              </div>
              <div class="text-2xl font-bold">{{ stats.mood.avgMood }}/5</div>
            </div>
            <div>
              <div class="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                平均压力
              </div>
              <div class="text-2xl font-bold">{{ stats.stress.avgLevel }}/5</div>
            </div>
          </div>
          <canvas ref="moodChart" class="mt-4" />
        </div>

        <!-- 体温体重 -->
        <div class="ios-card p-5">
          <h3 class="font-semibold text-ios-purple mb-3">📊 健康指标</h3>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div class="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                平均体温
              </div>
              <div class="text-2xl font-bold">{{ stats.bodyTemp.avg }}℃</div>
            </div>
            <div>
              <div class="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                平均体重
              </div>
              <div class="text-2xl font-bold">{{ stats.weight.avg }}kg</div>
            </div>
          </div>
          <canvas ref="healthChart" class="mt-4" />
        </div>
      </div>

      <div v-else class="ios-card p-8 text-center text-light-text-tertiary dark:text-dark-text-tertiary">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { getWeekReport, getMonthReport } from '@/api/reports';
import type { ReportStats, DailyRecord } from '@/types';

Chart.register(...registerables);

const period = ref<'week' | 'month'>('week');
const stats = ref<ReportStats | null>(null);
const records = ref<DailyRecord[]>([]);

const sleepChart = ref<HTMLCanvasElement>();
const exerciseChart = ref<HTMLCanvasElement>();
const waterChart = ref<HTMLCanvasElement>();
const moodChart = ref<HTMLCanvasElement>();
const healthChart = ref<HTMLCanvasElement>();

let chartInstances: Chart[] = [];

onMounted(() => {
  loadData();
});

watch(period, () => {
  loadData();
});

async function loadData() {
  try {
    const report = period.value === 'week' ? await getWeekReport() : await getMonthReport();
    stats.value = report.stats;
    records.value = report.records;

    await nextTick();
    renderCharts();
  } catch (error) {
    console.error('Failed to load report:', error);
  }
}

function renderCharts() {
  // 清除旧图表
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances = [];

  if (!records.value.length) return;

  const labels = records.value.map((r) => {
    const date = new Date(r.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }).reverse();

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#EBEBF5' : '#3C3C43';
  const gridColor = isDark ? '#38383A' : '#E5E5EA';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  // 睡眠图表
  if (sleepChart.value) {
    chartInstances.push(
      new Chart(sleepChart.value, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: '睡眠时长',
              data: records.value.map((r) => r.sleep_hours || 0).reverse(),
              borderColor: '#007AFF',
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
              tension: 0.4,
            },
          ],
        },
        options: commonOptions,
      })
    );
  }

  // 运动图表
  if (exerciseChart.value) {
    chartInstances.push(
      new Chart(exerciseChart.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: '运动时长',
              data: records.value.map((r) => r.exercise_minutes || 0).reverse(),
              backgroundColor: '#34C759',
            },
          ],
        },
        options: commonOptions,
      })
    );
  }

  // 饮水图表
  if (waterChart.value) {
    chartInstances.push(
      new Chart(waterChart.value, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: '饮水量',
              data: records.value.map((r) => r.water_intake || 0).reverse(),
              borderColor: '#5AC8FA',
              backgroundColor: 'rgba(90, 200, 250, 0.1)',
              tension: 0.4,
            },
          ],
        },
        options: commonOptions,
      })
    );
  }

  // 心情图表
  if (moodChart.value) {
    chartInstances.push(
      new Chart(moodChart.value, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: '心情',
              data: records.value.map((r) => r.mood || 0).reverse(),
              borderColor: '#FF2D55',
              backgroundColor: 'rgba(255, 45, 85, 0.1)',
              tension: 0.4,
            },
            {
              label: '压力',
              data: records.value.map((r) => r.stress_level || 0).reverse(),
              borderColor: '#FF9500',
              backgroundColor: 'rgba(255, 149, 0, 0.1)',
              tension: 0.4,
            },
          ],
        },
        options: {
          ...commonOptions,
          plugins: {
            legend: { display: true, labels: { color: textColor } },
          },
        },
      })
    );
  }

  // 健康指标图表
  if (healthChart.value) {
    const tempData = records.value.map((r) => r.body_temperature || null).reverse();
    const weightData = records.value.map((r) => r.weight || null).reverse();

    chartInstances.push(
      new Chart(healthChart.value, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: '体温 (℃)',
              data: tempData,
              borderColor: '#AF52DE',
              backgroundColor: 'rgba(175, 82, 222, 0.1)',
              yAxisID: 'y',
              tension: 0.4,
            },
            {
              label: '体重 (kg)',
              data: weightData,
              borderColor: '#5856D6',
              backgroundColor: 'rgba(88, 86, 214, 0.1)',
              yAxisID: 'y1',
              tension: 0.4,
            },
          ],
        },
        options: {
          ...commonOptions,
          plugins: {
            legend: { display: true, labels: { color: textColor } },
          },
          scales: {
            x: {
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
            y: {
              type: 'linear',
              position: 'left',
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
            y1: {
              type: 'linear',
              position: 'right',
              ticks: { color: textColor },
              grid: { display: false },
            },
          },
        },
      })
    );
  }
}
</script>
