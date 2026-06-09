<script setup>
import { ref, computed } from 'vue'
import MiniTrend from './MiniTrend.vue'

const props = defineProps({
  id:           { type: String, default: '' },
  title:        { type: String, required: true },
  value:        { type: [String, Number], required: true },
  icon:         { type: String, default: '📊' },
  status:       { type: String, default: 'normal' },   // normal | warning | critical | info
  change:       { type: String, default: '' },
  unit:         { type: String, default: '' },
  compact:      { type: Boolean, default: false },
  hoverSummary: { type: Array,   default: () => [] },
  trendValues:  { type: Array,   default: () => [] },
  isActive:     { type: Boolean, default: false },
})
const emit = defineEmits(['card-click', 'card-hover', 'card-leave'])

// ── Hover tooltip state ───────────────────────────────────────────────────────
const isHovered = ref(false)
const tipX = ref(0)
const tipY = ref(0)

function onMouseEnter(e) {
  isHovered.value = true
  updateTip(e)
  if (props.id) emit('card-hover', props.id)
}
function onMouseMove(e) { if (isHovered.value) updateTip(e) }
function onMouseLeave()  {
  isHovered.value = false
  if (props.id) emit('card-leave')
}
function onClick() {
  if (props.id) emit('card-click', props.id)
}
function updateTip(e) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  let x = e.clientX + 16
  let y = e.clientY + 12
  if (x + 250 > vw) x = e.clientX - 266
  if (y + 220 > vh) y = e.clientY - 232
  tipX.value = x
  tipY.value = y
}

// ── Status colour helper ──────────────────────────────────────────────────────
const SC = { normal: '#22c55e', warning: '#f59e0b', critical: '#ef4444', info: '#3b82f6' }
const sc  = s => SC[s] || '#94a3b8'

// ── Show hover tooltip only when: hovered, has summary, not already selected ─
const showTip = computed(() =>
  isHovered.value &&
  props.hoverSummary.length > 0 &&
  !props.isActive
)
</script>

<template>
  <div
    :class="['kpi-card', `kpi-${status}`, { compact, 'kpi-active': isActive, 'kpi-interactive': !!id }]"
    :aria-label="`${title}: ${value}${unit}. Status: ${status}.`"
    :tabindex="id ? 0 : -1"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @click="onClick"
    @keydown.enter="onClick"
    @keydown.space.prevent="onClick"
  >
    <div class="kpi-header">
      <span class="kpi-icon">{{ icon }}</span>
      <span class="kpi-status-dot" :class="status"></span>
    </div>
    <div class="kpi-value">
      {{ value }}<span v-if="unit" class="kpi-unit">{{ unit }}</span>
    </div>
    <div class="kpi-title">{{ title }}</div>
    <div v-if="change" class="kpi-change">{{ change }}</div>

    <!-- Active indicator bar -->
    <div v-if="isActive" class="kpi-active-bar"></div>
  </div>

  <!-- ── Hover preview tooltip (teleported to avoid overflow clipping) ── -->
  <Teleport to="body">
    <div
      v-if="showTip"
      class="kpi-hover-tip"
      :style="{ left: tipX + 'px', top: tipY + 'px' }"
    >
      <!-- Tip header: icon + title -->
      <div class="kht-header">
        <span class="kht-icon">{{ icon }}</span>
        <div>
          <div class="kht-title">{{ title }}</div>
          <div class="kht-value-row">
            <span class="kht-value">{{ value }}{{ unit }}</span>
            <span class="kht-sdot" :style="{ background: sc(status) }"></span>
            <span class="kht-status" :style="{ color: sc(status) }">{{ status.toUpperCase() }}</span>
          </div>
        </div>
      </div>
      <!-- Summary lines -->
      <div class="kht-divider"></div>
      <div class="kht-summary">
        <div v-for="(line, i) in hoverSummary" :key="i" class="kht-line">
          <span class="kht-bullet" :style="{ color: sc(status) }">●</span>
          <span>{{ line }}</span>
        </div>
      </div>
      <!-- Mini sparkline -->
      <div v-if="trendValues.length >= 2" class="kht-trend">
        <MiniTrend :values="trendValues" :color="sc(status)" :width="204" :height="32" />
      </div>
      <!-- Click hint -->
      <div class="kht-hint">Click for full details →</div>
    </div>
  </Teleport>
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
  outline: none;
}

/* Interactive cards get pointer cursor */
.kpi-interactive { cursor: pointer; }

/* Top accent bar */
.kpi-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  transition: height var(--transition-fast);
}
.kpi-normal::before   { background: var(--status-ok); }
.kpi-warning::before  { background: var(--status-warn); }
.kpi-critical::before { background: var(--status-crit); }
.kpi-info::before     { background: var(--status-info); }

/* Hover: lift + status glow */
.kpi-interactive:hover { background: var(--bg-card-hover); transform: translateY(-2px); }
.kpi-interactive.kpi-normal:hover  { box-shadow: 0 4px 20px rgba(34,197,94,0.14), 0 0 0 1px rgba(34,197,94,0.28); }
.kpi-interactive.kpi-warning:hover { box-shadow: 0 4px 20px rgba(245,158,11,0.18), 0 0 0 1px rgba(245,158,11,0.32); }
.kpi-interactive.kpi-critical:hover{ box-shadow: 0 4px 20px rgba(239,68,68,0.22),  0 0 0 1px rgba(239,68,68,0.38); }
.kpi-interactive.kpi-info:hover    { box-shadow: 0 4px 20px rgba(59,130,246,0.18), 0 0 0 1px rgba(59,130,246,0.3); }

/* Active / selected state */
.kpi-active {
  transform: translateY(-2px) !important;
  border-color: rgba(59,130,246,0.55) !important;
  background: var(--bg-card-hover) !important;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.35), 0 8px 28px rgba(59,130,246,0.18) !important;
}
/* Critical active: use red glow instead */
.kpi-critical.kpi-active {
  border-color: rgba(239,68,68,0.55) !important;
  box-shadow: 0 0 0 2px rgba(239,68,68,0.4), 0 8px 28px rgba(239,68,68,0.22) !important;
  animation: pulse-crit 2s infinite;
}
@keyframes pulse-crit {
  0%, 100% { box-shadow: 0 0 0 2px rgba(239,68,68,0.4), 0 8px 28px rgba(239,68,68,0.22); }
  50%       { box-shadow: 0 0 0 4px rgba(239,68,68,0.25), 0 8px 32px rgba(239,68,68,0.3); }
}

/* Active bottom indicator bar */
.kpi-active-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--accent-blue);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}
.kpi-critical .kpi-active-bar { background: var(--status-crit); }

/* Focus ring for keyboard nav */
.kpi-interactive:focus-visible {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
}

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
.kpi-status-dot.warning  { background: var(--status-warn);  box-shadow: 0 0 6px var(--status-warn);  animation: blink 2s infinite; }
.kpi-status-dot.critical { background: var(--status-crit);  box-shadow: 0 0 6px var(--status-crit);  animation: blink 1s infinite; }
.kpi-status-dot.info     { background: var(--status-info);  box-shadow: 0 0 6px var(--status-info); }

.kpi-value {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  font-family: var(--font-mono);
  line-height: 1.1;
}
.kpi-unit { font-size: 0.85rem; font-weight: 400; color: var(--text-secondary); margin-left: 3px; }

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

/* Compact variant */
.compact { padding: 10px 12px; }
.compact .kpi-value { font-size: 1.3rem; }
.compact .kpi-icon  { font-size: 1.1rem; }
</style>

<!-- Global tooltip styles — teleported to <body> -->
<style>
.kpi-hover-tip {
  position: fixed;
  z-index: 9990;
  min-width: 220px;
  max-width: 260px;
  background: rgba(9, 14, 32, 0.97);
  border: 1px solid rgba(59, 130, 246, 0.28);
  border-radius: 12px;
  padding: 12px 14px 10px;
  box-shadow: 0 12px 44px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.08);
  pointer-events: none;
  backdrop-filter: blur(14px);
  font-family: system-ui, -apple-system, sans-serif;
}

.kht-header { display: flex; align-items: flex-start; gap: 9px; margin-bottom: 8px; }
.kht-icon   { font-size: 1.3rem; flex-shrink: 0; }
.kht-title  { font-size: 0.72rem; font-weight: 700; color: #e2e8f0; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 3px; }
.kht-value-row { display: flex; align-items: center; gap: 5px; }
.kht-value  { font-size: 1.1rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #e2e8f0; }
.kht-sdot   { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.kht-status { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.05em; }

.kht-divider { height: 1px; background: rgba(59,130,246,0.15); margin: 8px 0; }

.kht-summary { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
.kht-line    { display: flex; align-items: flex-start; gap: 6px; font-size: 0.71rem; color: #94a3b8; line-height: 1.45; }
.kht-bullet  { font-size: 0.42rem; flex-shrink: 0; margin-top: 4px; }

.kht-trend {
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
  padding: 4px 2px 2px;
  margin-bottom: 7px;
  overflow: hidden;
}

.kht-hint {
  font-size: 0.6rem;
  color: #3a5070;
  text-align: right;
  letter-spacing: 0.02em;
}
</style>
