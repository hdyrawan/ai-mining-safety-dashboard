<script setup>
defineProps({
  title:   { type: String, required: true },
  value:   { type: [String, Number], required: true },
  icon:    { type: String, default: '📊' },
  status:  { type: String, default: 'normal' },   // normal | warning | critical | info
  change:  { type: String, default: '' },
  unit:    { type: String, default: '' },
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <div :class="['kpi-card', `kpi-${status}`, { compact }]">
    <div class="kpi-header">
      <span class="kpi-icon">{{ icon }}</span>
      <span class="kpi-status-dot" :class="status"></span>
    </div>
    <div class="kpi-value">
      {{ value }}<span v-if="unit" class="kpi-unit">{{ unit }}</span>
    </div>
    <div class="kpi-title">{{ title }}</div>
    <div v-if="change" class="kpi-change">{{ change }}</div>
  </div>
</template>

<style scoped>
.kpi-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  box-shadow: var(--shadow-card);
  transition: all var(--transition-base);
  cursor: default;
  position: relative;
  overflow: hidden;
}
.kpi-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
}
.kpi-normal::before   { background: var(--status-ok); }
.kpi-warning::before  { background: var(--status-warn); }
.kpi-critical::before { background: var(--status-crit); }
.kpi-info::before     { background: var(--status-info); }

.kpi-card:hover { background: var(--bg-card-hover); transform: translateY(-1px); }

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.kpi-icon { font-size: 1.4rem; }
.kpi-status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  margin-top: 4px;
}
.kpi-status-dot.normal   { background: var(--status-ok);   box-shadow: 0 0 6px var(--status-ok); }
.kpi-status-dot.warning  { background: var(--status-warn);  box-shadow: 0 0 6px var(--status-warn); animation: blink 2s infinite; }
.kpi-status-dot.critical { background: var(--status-crit);  box-shadow: 0 0 6px var(--status-crit); animation: blink 1s infinite; }
.kpi-status-dot.info     { background: var(--status-info);  box-shadow: 0 0 6px var(--status-info); }

.kpi-value {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  font-family: var(--font-mono);
  line-height: 1.1;
}
.kpi-unit {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--text-secondary);
  margin-left: 3px;
}
.kpi-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.kpi-change {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 3px;
}

/* Compact variant for tight grids */
.compact { padding: 10px 12px; }
.compact .kpi-value { font-size: 1.3rem; }
.compact .kpi-icon  { font-size: 1.1rem; }
</style>
