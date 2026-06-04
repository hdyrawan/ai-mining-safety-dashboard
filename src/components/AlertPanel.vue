<script setup>
import { computed } from 'vue'
import { store } from '../store/scenarios.js'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({ maxItems: { type: Number, default: 20 } })

const alerts = computed(() => store.alerts.slice(0, props.maxItems))

const iconMap = { gas:'💨', health:'❤️', equipment:'🚜', environment:'🌿', drone:'🚁' }

function ackAlert(id) { store.acknowledgeAlert(id) }
</script>

<template>
  <div class="alert-panel">
    <div class="alert-panel-header">
      <div class="alert-panel-title">
        <span>🚨</span>
        <span>Active Alerts</span>
      </div>
      <div class="alert-counts">
        <span class="count-pill crit">{{ alerts.filter(a=>a.level==='critical'&&!a.acknowledged).length }} Critical</span>
        <span class="count-pill warn">{{ alerts.filter(a=>a.level==='warning'&&!a.acknowledged).length }} Warning</span>
      </div>
    </div>
    <div class="alert-list">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        :class="['alert-item', `alert-${alert.level}`, { acknowledged: alert.acknowledged, simulated: alert.simulated }]"
      >
        <div class="alert-icon">{{ iconMap[alert.type] || '⚠️' }}</div>
        <div class="alert-content">
          <div class="alert-message">{{ alert.message }}</div>
          <div class="alert-meta">
            <StatusBadge :status="alert.level === 'info' ? 'info' : alert.level === 'warning' ? 'warning' : 'critical'" :label="alert.level.toUpperCase()" />
            <span class="alert-zone">{{ alert.zone }}</span>
            <span class="alert-time">{{ alert.time }}</span>
            <span v-if="alert.simulated" class="tag tag-warn">SIM</span>
          </div>
        </div>
        <button v-if="!alert.acknowledged" class="ack-btn" @click="ackAlert(alert.id)">ACK</button>
        <span v-else class="ack-label">✓ ACK</span>
      </div>
      <div v-if="alerts.length === 0" class="empty-state">
        <div class="empty-state-icon">✅</div>
        <span>No active alerts</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.alert-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-base);
  background: var(--bg-secondary);
  flex-shrink: 0;
}
.alert-panel-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.alert-counts { display: flex; gap: 6px; }
.count-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
}
.count-pill.crit { background: var(--status-crit-bg); color: var(--status-crit); border: 1px solid var(--status-crit-border); }
.count-pill.warn { background: var(--status-warn-bg); color: var(--status-warn); border: 1px solid var(--status-warn-border); }

.alert-list {
  flex: 1;
  overflow-y: auto;
}
.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-base);
  transition: background var(--transition-fast);
  animation: slide-in-right 0.2s ease;
}
.alert-item:hover { background: var(--bg-card-hover); }
.alert-critical { border-left: 3px solid var(--status-crit); }
.alert-warning  { border-left: 3px solid var(--status-warn); }
.alert-info     { border-left: 3px solid var(--status-info); }
.alert-item.acknowledged { opacity: 0.45; }
.alert-item.simulated { background: rgba(239,68,68,0.04); }

.alert-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
.alert-content { flex: 1; min-width: 0; }
.alert-message {
  font-size: 0.78rem;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 5px;
}
.alert-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}
.alert-zone {
  font-size: 0.68rem;
  color: var(--accent-cyan);
  font-family: var(--font-mono);
  background: rgba(6,182,212,0.08);
  padding: 1px 6px;
  border-radius: 4px;
}
.alert-time { font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono); }

.ack-btn {
  flex-shrink: 0;
  background: var(--bg-card-hover);
  border: 1px solid var(--border-accent);
  color: var(--accent-blue);
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-sans);
  letter-spacing: 0.05em;
}
.ack-btn:hover { background: var(--accent-blue); color: white; }
.ack-label { font-size: 0.65rem; color: var(--status-ok); font-weight: 600; flex-shrink: 0; }
</style>
