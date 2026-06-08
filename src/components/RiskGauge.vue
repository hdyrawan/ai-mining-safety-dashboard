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

// cx=90, cy=60, r=52 — same center for both track and fill arc
const CX = 90, CY = 60, R = 52

const pct    = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
const status = computed(() => {
  if (props.value >= props.critAt)  return 'critical'
  if (props.value >= props.warnAt)  return 'warning'
  return 'normal'
})
const color = computed(() => ({
  normal:   'var(--status-ok)',
  warning:  'var(--status-warn)',
  critical: 'var(--status-crit)',
})[status.value])

const arcPath = computed(() => {
  const startAngle = -225
  const endAngle   = startAngle + (pct.value / 100) * 270
  const toRad = d => (d * Math.PI) / 180
  const x1 = CX + R * Math.cos(toRad(startAngle))
  const y1 = CY + R * Math.sin(toRad(startAngle))
  const x2 = CX + R * Math.cos(toRad(endAngle))
  const y2 = CY + R * Math.sin(toRad(endAngle))
  const large = (endAngle - startAngle) > 180 ? 1 : 0
  if (pct.value <= 0) return ''
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
})
</script>

<template>
  <div class="gauge-card card">
    <div class="gauge-title">{{ title }}</div>

    <div class="gauge-wrapper">
      <div class="gauge">
        <!-- viewBox matches rendered 180×110; cx=90 cy=60 r=52 for both arcs -->
        <svg viewBox="0 0 180 110" class="gauge-svg">
          <!-- Track: computed from same center/radius as fill arc -->
          <!-- Start: cx+r·cos(-225°)=53.2, cy+r·sin(-225°)=96.8  End: 126.8, 96.8 -->
          <path
            d="M 53.22 96.78 A 52 52 0 1 1 126.78 96.78"
            fill="none"
            stroke="var(--border-card)"
            stroke-width="8"
            stroke-linecap="round"
          />
          <!-- Fill arc -->
          <path
            v-if="arcPath"
            :d="arcPath"
            fill="none"
            :stroke="color"
            stroke-width="8"
            stroke-linecap="round"
            :style="{ filter: `drop-shadow(0 0 5px ${color})` }"
          />
        </svg>

        <div class="gauge-value" :style="{ color }">
          {{ value }}<span class="gauge-unit">{{ unit }}</span>
        </div>
        <div :class="['gauge-status', `status-${status}`]">
          {{ status.toUpperCase() }}
        </div>
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
.gauge-card {
  padding: 14px;
  text-align: center;
}

.gauge-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0;
}

/* Fixed-height wrapper — centers the gauge horizontally in any card width */
.gauge-wrapper {
  width: 100%;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0 4px;
}

/* Fixed-size gauge container — all absolute positioning is relative to this */
.gauge {
  position: relative;
  width: 180px;
  height: 110px;
  flex-shrink: 0;
}

.gauge-svg {
  width: 180px;
  height: 110px;
  display: block;
}

/* Score: horizontally centered, vertically in the arc bowl */
.gauge-value {
  position: absolute;
  left: 50%;
  top: 58%;
  transform: translate(-50%, -50%);
  font-size: 1.6rem;
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: -0.5px;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
}

.gauge-unit {
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--text-muted);
}

/* Status label: below the score */
.gauge-status {
  position: absolute;
  left: 50%;
  top: 80%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
}

.status-normal   { color: var(--status-ok); }
.status-warning  { color: var(--status-warn); }
.status-critical { color: var(--status-crit); }

.gauge-subtitle {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.gauge-scale {
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;
  color: var(--text-dim);
  padding: 0 4px;
}
</style>
