<script setup>
import { computed } from 'vue'

const props = defineProps({
  values: { type: Array, default: () => [] },
  color:  { type: String, default: '#3b82f6' },
  width:  { type: Number, default: 80 },
  height: { type: Number, default: 28 },
})

const pad = 2

const linePts = computed(() => {
  const vs = props.values
  if (vs.length < 2) return ''
  const min = Math.min(...vs)
  const max = Math.max(...vs)
  const range = max - min || 1
  const iw = props.width - pad * 2
  const ih = props.height - pad * 2
  return vs.map((v, i) => {
    const x = pad + iw * i / (vs.length - 1)
    const y = pad + ih * (1 - (v - min) / range)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
})

const fillPts = computed(() => {
  if (!linePts.value) return ''
  const pts = linePts.value.split(' ')
  const firstX = pts[0].split(',')[0]
  const lastX  = pts[pts.length - 1].split(',')[0]
  const bot    = (props.height - pad).toFixed(1)
  return `${linePts.value} ${lastX},${bot} ${firstX},${bot}`
})
</script>

<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" class="mini-trend">
    <polygon v-if="fillPts" :points="fillPts" :fill="color" fill-opacity="0.1" />
    <polyline v-if="linePts" :points="linePts" fill="none" :stroke="color"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<style scoped>
.mini-trend { display: block; overflow: visible; }
</style>
