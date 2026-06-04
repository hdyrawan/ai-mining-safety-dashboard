<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  title:   { type: String, default: '' },
  labels:  { type: Array,  required: true },
  series:  { type: Array,  required: true },
  type:    { type: String, default: 'line' },
  height:  { type: Number, default: 180 },
  legend:  { type: Boolean, default: true },
  fill:    { type: Boolean, default: false },
  yMin:    { type: Number, default: undefined },
  yMax:    { type: Number, default: undefined },
})

const canvas = ref(null)
let chart = null

function buildConfig() {
  const datasets = props.series.map(s => ({
    label: s.name,
    data: s.values,
    borderColor: s.color,
    backgroundColor: props.type === 'bar'
      ? s.color + '99'
      : props.fill ? s.color + '22' : 'transparent',
    borderWidth: props.type === 'bar' ? 0 : 2,
    fill: props.fill,
    tension: 0.4,
    pointRadius: 3,
    pointHoverRadius: 5,
    pointBackgroundColor: s.color,
  }))

  return {
    type: props.type,
    data: { labels: props.labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: props.legend,
          position: 'top',
          labels: {
            color: 'rgba(148,163,184,0.8)',
            font: { size: 10, family: 'Inter' },
            boxWidth: 10,
            padding: 10,
          }
        },
        tooltip: {
          backgroundColor: '#1e2840',
          borderColor: '#253050',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8',
          padding: 8,
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(37,48,80,0.5)', drawBorder: false },
          ticks: { color: '#5a7090', font: { size: 10 } },
        },
        y: {
          min: props.yMin,
          max: props.yMax,
          grid: { color: 'rgba(37,48,80,0.5)', drawBorder: false },
          ticks: { color: '#5a7090', font: { size: 10 } },
        }
      }
    }
  }
}

onMounted(() => {
  if (canvas.value) chart = new Chart(canvas.value, buildConfig())
})

watch(() => [props.labels, props.series], () => {
  if (chart) { chart.destroy(); chart = new Chart(canvas.value, buildConfig()) }
}, { deep: true })

onUnmounted(() => { chart?.destroy() })
</script>

<template>
  <div class="trend-chart card">
    <div v-if="title" class="chart-title card-header">
      <span class="card-title">{{ title }}</span>
    </div>
    <div class="chart-body card-body" :style="{ height: height + 'px' }">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<style scoped>
.trend-chart { overflow: hidden; }
.chart-body  { position: relative; }
</style>
