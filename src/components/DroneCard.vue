<script setup>
import StatusBadge from './StatusBadge.vue'

defineProps({
  drone: { type: Object, required: true },
  isSelected: { type: Boolean, default: false }
})

defineEmits(['select'])

function batteryColor(pct) {
  if (pct >= 60) return 'var(--status-ok)'
  if (pct >= 25) return 'var(--status-warn)'
  return 'var(--status-crit)'
}
</script>

<template>
  <div
    :class="['drone-card card', { 'has-detection': drone.detections?.length, 'is-selected': isSelected }]"
    @click="$emit('select')"
  >
    <div class="drone-header">
      <div class="drone-name-row">
        <span class="drone-icon">🚁</span>
        <span class="drone-name">{{ drone.name }}</span>
        <span class="drone-id">{{ drone.id }}</span>
      </div>
      <StatusBadge :status="drone.status === 'active' ? 'active' : drone.status === 'charging' ? 'charging' : drone.status === 'maintenance' ? 'maintenance' : 'standby'" />
    </div>

    <div class="drone-metrics">
      <!-- Battery -->
      <div class="metric">
        <div class="metric-label">Battery</div>
        <div class="metric-value" :style="{ color: batteryColor(drone.battery) }">
          {{ drone.battery }}%
        </div>
        <div class="progress-bar" style="margin-top:3px">
          <div class="progress-fill" :style="{ width: drone.battery + '%', background: batteryColor(drone.battery) }"></div>
        </div>
      </div>
      <!-- Altitude -->
      <div class="metric">
        <div class="metric-label">Altitude</div>
        <div class="metric-value">{{ drone.altitude }}<span class="metric-unit">m</span></div>
      </div>
      <!-- Speed -->
      <div class="metric">
        <div class="metric-label">Speed</div>
        <div class="metric-value">{{ drone.speed }}<span class="metric-unit">km/h</span></div>
      </div>
      <!-- Signal -->
      <div class="metric">
        <div class="metric-label">Signal</div>
        <div class="metric-value">{{ drone.signalStrength }}<span class="metric-unit">%</span></div>
      </div>
    </div>

    <div class="drone-mission">
      <span class="mission-icon">📍</span>
      <span class="mission-text">{{ drone.mission }}</span>
    </div>

    <template v-if="drone.detections?.length">
      <div class="detection-section">
        <div v-for="d in drone.detections" :key="d.type" :class="['detection-item', `detection-${d.severity}`]">
          <div class="detection-header">
            <span class="detection-icon">{{ d.severity === 'warning' ? '⚠️' : 'ℹ️' }}</span>
            <span class="detection-type">{{ d.type.replace(/_/g,' ').toUpperCase() }}</span>
            <span class="detection-conf">{{ d.confidence }}% confidence</span>
          </div>
          <div class="detection-desc">{{ d.description }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.drone-card { padding: 14px; transition: all var(--transition-base); cursor: pointer; }
.drone-card:hover { background: var(--bg-card-hover); transform: translateY(-1px); }
.has-detection { border-color: var(--status-warn-border); }
.is-selected {
  border-color: var(--accent-blue) !important;
  box-shadow: 0 0 0 1px var(--accent-blue), var(--shadow-glow-blue);
  background: var(--bg-card-hover);
}

.drone-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.drone-name-row { display: flex; align-items: center; gap: 6px; }
.drone-icon { font-size: 1rem; }
.drone-name { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
.drone-id { font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono); background: var(--bg-secondary); padding: 1px 6px; border-radius: 4px; }

.drone-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; }
.metric { text-align: center; }
.metric-label { font-size: 0.62rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
.metric-value { font-size: 1rem; font-weight: 700; color: var(--text-primary); font-family: var(--font-mono); }
.metric-unit { font-size: 0.65rem; color: var(--text-muted); font-weight: 400; }

.drone-mission {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  padding: 6px 10px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.mission-icon { font-size: 0.85rem; }

.detection-section { margin-top: 10px; }
.detection-item {
  background: var(--status-warn-bg);
  border: 1px solid var(--status-warn-border);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  margin-top: 6px;
}
.detection-item.detection-info {
  background: var(--status-info-bg);
  border-color: var(--status-info-border);
}
.detection-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.detection-type { font-size: 0.68rem; font-weight: 700; color: var(--status-warn); letter-spacing: 0.05em; }
.detection-item.detection-info .detection-type { color: var(--status-info); }
.detection-conf { font-size: 0.65rem; color: var(--text-muted); margin-left: auto; }
.detection-desc { font-size: 0.72rem; color: var(--text-secondary); }
</style>
