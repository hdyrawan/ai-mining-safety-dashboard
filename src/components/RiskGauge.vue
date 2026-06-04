<script setup>
import { computed } from 'vue'

const props = defineProps({
  title:    { type: String, default: 'Risk Score' },
  value:    { type: Number, default: 0 },
  max:      { type: Number, default: 100 },
  warnAt:   { type: Number, default: 40 },
  critAt:   { type: Number, default: 70 },
  unit:     { type: String, default: '' },
  subtitle: { type: String, default: '' },
})

const pct    = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
const angle  = computed(() => -135 + (pct.value / 100) * 270)
const status = computed(() => {
  if (props.value >= props.critAt) return 'critical'
  if (props.value >= props.warnAt) return 'warning'
  return 'normal'
})
const color = computed(() => ({
  normal: 'var(--status-ok)',
  warning: 'var(--status-warn)',
  critical: 'var(--status-crit)',
})[status.value])

const arcPath = computed(() => {
  const cx = 60, cy = 60, r = 44
  const startAngle = -225
  const endAngle = startAngle + (pct.value / 100) * 270
  const toRad = (d) => (d * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startAngle))
  const y1 = cy + r * Math.sin(toRad(startAngle))
  const x2 = cx + r * Math.cos(toRad(endAngle))
  const y2 = cy + r * Math.sin(toRad(endAngle))
  const large = (endAngle - startAngle) > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
})
</script>

<template>
  <div class="gauge-card card">
    <div class="gauge-title">{{ title }}</div>
    <div class="gauge-wrap">
      <svg viewBox="0 0 120 100" class="gauge-svg">
        <!-- Track -->
        <path d="M 15 82 A 44 44 0 1 1 105 82" fill="none" stroke="var(--border-card)" stroke-width="8" stroke-linecap="round" />
        <!-- Fill -->
        <path :d="arcPath" fill="none" :stroke="color" stroke-width="8" stroke-linecap="round"
          :style="{ filter: `drop-shadow(0 0 4px ${color})` }" />
        <!-- Zone marks -->
        <circle cx="60" cy="60" r="2" :fill="color" />
      </svg>
      <div class="gauge-center">
        <div class="gauge-value" :style="{ color }">{{ value }}<span class="gauge-unit">{{ unit }}</span></div>
        <div :class="['gauge-status', `status-${status}`]">{{ status.toUpperCase() }}</div>
      </div>
    </div>
    <div v-if="subtitle" class="gauge-subtitle">{{ subtitle }}</div>
    <div class="gauge-scale">
      <span>0</span>
      <span :style="{ color: 'var(--status-warn)' }">{{ warnAt }}</span>
      <span :style="{ color: 'var(--status-crit)' }">{{ critAt }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<style scoped>
.gauge-card { padding: 14px; text-align: center; }
.gauge-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}
.gauge-wrap { position: relative; display: inline-block; }
.gauge-svg  { width: 120px; height: 100px; display: block; margin: 0 auto; }
.gauge-center {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
}
.gauge-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: -0.5px;
  line-height: 1;
}
.gauge-unit { font-size: 0.7rem; font-weight: 400; color: var(--text-muted); }
.gauge-status {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-top: 2px;
}
.status-normal   { color: var(--status-ok); }
.status-warning  { color: var(--status-warn); }
.status-critical { color: var(--status-crit); }
.gauge-subtitle { font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; }
.gauge-scale {
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;
  color: var(--text-dim);
  margin-top: 4px;
  padding: 0 4px;
}
</style>
