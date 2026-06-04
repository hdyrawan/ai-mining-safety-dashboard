<script setup>
import StatusBadge from './StatusBadge.vue'

defineProps({ incidents: { type: Array, required: true } })

const typeIcons = {
  'Fall Detected': '🏃',
  'Gas Threshold Breach': '💨',
  'Equipment Breakdown': '⚙️',
  'PPE Non-Compliance': '⛑️',
  'Slope Stability Warning': '⛰️',
}
</script>

<template>
  <div class="incident-timeline">
    <div v-for="(inc, i) in incidents" :key="inc.id" class="timeline-item">
      <div class="timeline-connector">
        <div :class="['timeline-dot', `dot-${inc.severity}`]">
          {{ typeIcons[inc.type] || '⚠️' }}
        </div>
        <div v-if="i < incidents.length - 1" class="timeline-line"></div>
      </div>
      <div :class="['timeline-card card', `inc-${inc.severity}`, `inc-status-${inc.status}`]">
        <div class="timeline-header">
          <div class="inc-title-row">
            <span class="inc-type">{{ inc.type }}</span>
            <span class="inc-id">{{ inc.id }}</span>
          </div>
          <div class="inc-badges">
            <StatusBadge :status="inc.status === 'active' ? 'critical' : inc.status === 'monitoring' ? 'monitoring' : 'resolved'" :label="inc.status.toUpperCase()" />
            <StatusBadge :status="inc.severity" />
          </div>
        </div>
        <div class="inc-time">🕐 {{ inc.time }} · {{ inc.zone }}</div>
        <div class="inc-desc">{{ inc.description }}</div>
        <div v-if="inc.assignedTo" class="inc-assigned">👤 Assigned: {{ inc.assignedTo }}</div>
        <div class="inc-steps">
          <span v-for="(step, si) in inc.steps" :key="si" :class="['step-chip', si < inc.steps.length - 1 || inc.status === 'resolved' ? 'done' : 'active']">
            {{ si < inc.steps.length - 1 || inc.status === 'resolved' ? '✓' : '●' }} {{ step }}
          </span>
          <span v-if="inc.status !== 'resolved'" class="step-chip pending">⏳ In Progress...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.incident-timeline { display: flex; flex-direction: column; gap: 0; }
.timeline-item { display: flex; gap: 12px; }
.timeline-connector { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.timeline-dot {
  width: 34px; height: 34px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
  border: 2px solid var(--border-card);
  background: var(--bg-card);
}
.dot-critical { border-color: var(--status-crit); background: var(--status-crit-bg); }
.dot-warning  { border-color: var(--status-warn); background: var(--status-warn-bg); }
.dot-info     { border-color: var(--status-info); background: var(--status-info-bg); }
.timeline-line { flex: 1; width: 2px; background: var(--border-base); margin: 4px 0; min-height: 20px; }

.timeline-card { flex: 1; padding: 12px 14px; margin-bottom: 16px; }
.inc-critical { border-color: var(--status-crit-border); }
.inc-warning  { border-color: var(--status-warn-border); }
.inc-status-resolved { opacity: 0.65; }

.timeline-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }
.inc-title-row { display: flex; align-items: center; gap: 8px; }
.inc-type { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
.inc-id { font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-mono); background: var(--bg-secondary); padding: 1px 6px; border-radius: 3px; }
.inc-badges { display: flex; gap: 5px; }

.inc-time { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 5px; }
.inc-desc { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 7px; }
.inc-assigned { font-size: 0.7rem; color: var(--text-muted); margin-bottom: 7px; }

.inc-steps { display: flex; flex-wrap: wrap; gap: 5px; }
.step-chip {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}
.step-chip.done    { background: var(--status-ok-bg); color: var(--status-ok); border: 1px solid var(--status-ok-border); }
.step-chip.active  { background: var(--status-warn-bg); color: var(--status-warn); border: 1px solid var(--status-warn-border); animation: blink 2s infinite; }
.step-chip.pending { background: var(--status-info-bg); color: var(--status-info); border: 1px solid var(--status-info-border); }
</style>
