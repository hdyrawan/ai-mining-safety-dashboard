<script setup>
defineProps({
  status: { type: String, default: 'normal' },
  label:  { type: String, default: '' },
  pulse:  { type: Boolean, default: false },
  size:   { type: String, default: 'sm' },
})
const labelMap = { normal:'Normal', warning:'Warning', critical:'Critical', info:'Info', active:'Active', charging:'Charging', maintenance:'Maintenance', standby:'Standby', operating:'Operating', resolved:'Resolved', monitoring:'Monitoring' }
</script>

<template>
  <span :class="['status-badge', `status-${status}`, size, { pulse }]">
    <span class="status-dot" :class="{ pulse }"></span>
    {{ label || labelMap[status] || status }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 9px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
}
.status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-normal      { background: var(--status-ok-bg);   color: var(--status-ok);   border: 1px solid var(--status-ok-border); }
.status-normal      .status-dot { background: var(--status-ok); }
.status-warning     { background: var(--status-warn-bg);  color: var(--status-warn); border: 1px solid var(--status-warn-border); }
.status-warning     .status-dot { background: var(--status-warn); animation: blink 2s infinite; }
.status-critical    { background: var(--status-crit-bg);  color: var(--status-crit); border: 1px solid var(--status-crit-border); }
.status-critical    .status-dot { background: var(--status-crit); animation: blink 1s infinite; }
.status-info, .status-active { background: var(--status-info-bg); color: var(--status-info); border: 1px solid var(--status-info-border); }
.status-info        .status-dot, .status-active .status-dot { background: var(--status-info); animation: blink 2.5s infinite; }
.status-charging    { background: rgba(99,102,241,0.1); color: #818cf8; border: 1px solid rgba(99,102,241,0.2); }
.status-charging    .status-dot { background: #818cf8; }
.status-maintenance { background: rgba(245,158,11,0.1); color: var(--status-warn); border: 1px solid var(--status-warn-border); }
.status-maintenance .status-dot { background: var(--status-warn); }
.status-standby     { background: var(--bg-card); color: var(--text-muted); border: 1px solid var(--border-card); }
.status-standby     .status-dot { background: var(--text-muted); }
.status-operating   { background: var(--status-ok-bg); color: var(--status-ok); border: 1px solid var(--status-ok-border); }
.status-operating   .status-dot { background: var(--status-ok); animation: blink 3s infinite; }
.status-resolved    { background: rgba(30,40,60,0.5); color: var(--text-muted); border: 1px solid var(--border-base); }
.status-monitoring  { background: rgba(6,182,212,0.1); color: var(--accent-cyan); border: 1px solid rgba(6,182,212,0.25); }
.status-monitoring  .status-dot { background: var(--accent-cyan); animation: blink 2s infinite; }
.md { padding: 3px 10px; font-size: 0.75rem; }
.lg { padding: 4px 12px; font-size: 0.8rem; }
</style>
