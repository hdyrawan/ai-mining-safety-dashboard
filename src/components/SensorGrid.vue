<script setup>
import StatusBadge from './StatusBadge.vue'

defineProps({
  sensors: { type: Array, required: true }
})

function pct(v, warn, crit) {
  const max = crit * 1.2
  return Math.min(100, (v / max) * 100)
}

function barColor(status) {
  if (status === 'critical') return 'var(--status-crit)'
  if (status === 'warning') return 'var(--status-warn)'
  return 'var(--status-ok)'
}

function trendIcon(t) {
  if (t === 'up') return '↑'
  if (t === 'down') return '↓'
  return '→'
}
function trendClass(t) {
  if (t === 'up') return 'trend-up'
  if (t === 'down') return 'trend-down'
  return 'trend-stable'
}
</script>

<template>
  <div class="sensor-grid">
    <div
      v-for="s in sensors"
      :key="s.id"
      :class="['sensor-card card', `sensor-${s.status}`]"
    >
      <div class="sensor-header">
        <div class="sensor-name-row">
          <span class="sensor-label-badge">{{ s.label }}</span>
          <span class="sensor-id">{{ s.name }}</span>
        </div>
        <StatusBadge :status="s.status" size="sm" />
      </div>

      <div class="sensor-reading">
        <span class="sensor-value">{{ s.value }}</span>
        <span class="sensor-unit">{{ s.unit }}</span>
        <span :class="['sensor-trend', trendClass(s.trend)]">{{ trendIcon(s.trend) }}</span>
      </div>

      <div class="sensor-bar">
        <div class="progress-bar">
          <div class="progress-fill"
            :style="{ width: pct(s.value, s.thresholdWarn, s.thresholdCrit) + '%', background: barColor(s.status) }">
          </div>
        </div>
        <div class="sensor-thresholds">
          <span>0</span>
          <span :style="{ color:'var(--status-warn)' }">{{ s.thresholdWarn }}</span>
          <span :style="{ color:'var(--status-crit)' }">{{ s.thresholdCrit }}</span>
        </div>
      </div>

      <div class="sensor-footer">
        <span class="sensor-zone">{{ s.zone }}</span>
        <span class="sensor-cal">Cal: {{ s.lastCalibrated }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sensor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }

.sensor-card { padding: 12px; transition: all var(--transition-fast); }
.sensor-card:hover { background: var(--bg-card-hover); }
.sensor-warning { border-color: var(--status-warn-border); }
.sensor-critical { border-color: var(--status-crit-border); background: var(--status-crit-bg); }

.sensor-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.sensor-name-row { display: flex; align-items: center; gap: 5px; }
.sensor-label-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent-cyan);
  font-family: var(--font-mono);
  background: rgba(6,182,212,0.1);
  padding: 1px 6px;
  border-radius: 4px;
}
.sensor-id { font-size: 0.68rem; color: var(--text-muted); }

.sensor-reading { display: flex; align-items: baseline; gap: 4px; margin-bottom: 8px; }
.sensor-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  letter-spacing: -0.5px;
}
.sensor-unit { font-size: 0.7rem; color: var(--text-muted); }
.sensor-trend { font-size: 0.85rem; font-weight: 700; margin-left: 2px; }

.sensor-bar { margin-bottom: 6px; }
.sensor-thresholds {
  display: flex;
  justify-content: space-between;
  font-size: 0.58rem;
  color: var(--text-dim);
  margin-top: 2px;
}

.sensor-footer { display: flex; justify-content: space-between; font-size: 0.62rem; }
.sensor-zone {
  color: var(--accent-cyan);
  font-family: var(--font-mono);
  background: rgba(6,182,212,0.08);
  padding: 1px 5px;
  border-radius: 3px;
}
.sensor-cal { color: var(--text-dim); }
</style>
