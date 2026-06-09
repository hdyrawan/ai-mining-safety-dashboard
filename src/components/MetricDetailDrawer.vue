<script setup>
import { watch, ref } from 'vue'
import MiniTrend from './MiniTrend.vue'

const props = defineProps({
  metric:  { type: Object, default: null },
  visible: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const SC = { normal: '#22c55e', warning: '#f59e0b', critical: '#ef4444', info: '#3b82f6' }
const sc  = s => SC[s] || '#94a3b8'

// ── Click-outside to close (non-blocking — no backdrop overlay) ───────────────
function onDocClick(e) {
  const panel = document.querySelector('.mdd-panel')
  if (panel && !panel.contains(e.target) && !e.target.closest('.kpi-interactive')) {
    emit('close')
  }
}

watch(() => props.visible, (v) => {
  if (v) {
    // Delay to avoid the same click that opened the drawer immediately closing it
    setTimeout(() => document.addEventListener('click', onDocClick), 50)
  } else {
    document.removeEventListener('click', onDocClick)
  }
}, { immediate: false })
</script>

<template>
  <Teleport to="body">
    <!-- Side panel (no blocking backdrop — click-outside handled via JS) -->
    <Transition name="mdd-slide">
      <div v-if="visible && metric"
           class="mdd-panel"
           role="dialog"
           aria-modal="true"
           :aria-label="`${metric.title} detail panel`">

        <!-- Header -->
        <div class="mdd-header" :style="{ borderBottomColor: sc(metric.status) + '44' }">
          <div class="mdd-header-inner">
            <span class="mdd-hd-icon">{{ metric.icon }}</span>
            <div class="mdd-hd-text">
              <div class="mdd-metric-label">{{ metric.title }}</div>
              <div class="mdd-value-row">
                <span class="mdd-big-val">{{ metric.value }}</span>
                <span class="mdd-sdot" :style="{ background: sc(metric.status) }"></span>
                <span class="mdd-sstatus" :style="{ color: sc(metric.status) }">
                  {{ (metric.status || 'normal').toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
          <button class="mdd-close-btn" @click="emit('close')" aria-label="Close">✕</button>
        </div>

        <!-- Scrollable body -->
        <div class="mdd-body">

          <!-- Description -->
          <p v-if="metric.detail?.description" class="mdd-desc">
            {{ metric.detail.description }}
          </p>

          <!-- Sparkline trend -->
          <div v-if="metric.trendValues?.length >= 2" class="mdd-section">
            <div class="mdd-section-hd">{{ metric.detail?.trendLabel || 'Trend' }}</div>
            <div class="mdd-trend-box">
              <MiniTrend :values="metric.trendValues" :color="sc(metric.status)"
                         :width="280" :height="52" />
            </div>
          </div>

          <!-- Key / value rows -->
          <div v-if="metric.detail?.rows?.length" class="mdd-section">
            <div class="mdd-kv-grid">
              <template v-for="row in metric.detail.rows" :key="row.label">
                <span class="mdd-kv-label">{{ row.label }}</span>
                <span class="mdd-kv-val" :style="row.color ? { color: row.color } : {}">
                  {{ row.value }}
                </span>
              </template>
            </div>
          </div>

          <!-- Bullet items -->
          <div v-if="metric.detail?.items?.length" class="mdd-section">
            <div v-for="item in metric.detail.items" :key="item.text" class="mdd-bullet">
              <span class="mdd-bullet-dot" :style="item.color ? { color: item.color } : {}">▸</span>
              <span :style="item.color ? { color: item.color } : {}">{{ item.text }}</span>
            </div>
          </div>

          <!-- Related zones -->
          <div v-if="metric.detail?.relatedZones?.length" class="mdd-section">
            <div class="mdd-section-hd">Related Zones</div>
            <div class="mdd-chips">
              <span v-for="z in metric.detail.relatedZones" :key="z" class="mdd-chip">{{ z }}</span>
            </div>
          </div>

          <!-- Related alerts -->
          <div v-if="metric.detail?.relatedAlerts?.length" class="mdd-section">
            <div class="mdd-section-hd">Active Alerts</div>
            <div class="mdd-alert-list">
              <div v-for="a in metric.detail.relatedAlerts" :key="a.text || a"
                   class="mdd-alert-row">
                <span class="mdd-alert-tri" :style="{ color: sc(a.level || 'warning') }">▲</span>
                <span class="mdd-alert-msg">{{ a.text || a }}</span>
              </div>
            </div>
          </div>

          <!-- Recommended actions -->
          <div v-if="metric.detail?.recommendedActions?.length" class="mdd-section">
            <div class="mdd-section-hd">Recommended Actions</div>
            <ul class="mdd-actions">
              <li v-for="a in metric.detail.recommendedActions" :key="a">{{ a }}</li>
            </ul>
          </div>

          <!-- Meta footer -->
          <div class="mdd-meta">
            <div v-if="metric.detail?.dataSource" class="mdd-meta-row">
              <span class="mdd-meta-lbl">Source</span>
              <span class="mdd-meta-val">{{ metric.detail.dataSource }}</span>
            </div>
            <div v-if="metric.detail?.lastUpdated" class="mdd-meta-row">
              <span class="mdd-meta-lbl">Updated</span>
              <span class="mdd-meta-val mono">{{ metric.detail.lastUpdated }}</span>
            </div>
          </div>

        </div><!-- /mdd-body -->
      </div>
    </Transition>
  </Teleport>
</template>

<!-- Global styles — panel is teleported outside component DOM tree -->
<style>
.mdd-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 340px;
  height: 100vh;
  z-index: 1201;
  background: #111826;
  border-left: 1px solid #253050;
  box-shadow: -12px 0 48px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mdd-slide-enter-active,
.mdd-slide-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.mdd-slide-enter-from,
.mdd-slide-leave-to     { transform: translateX(100%); }

/* Header */
.mdd-header {
  flex-shrink: 0;
  padding: 16px;
  border-bottom: 1px solid transparent;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  background: rgba(11, 14, 26, 0.55);
}
.mdd-header-inner { display: flex; align-items: flex-start; gap: 10px; flex: 1; min-width: 0; }
.mdd-hd-icon { font-size: 1.5rem; flex-shrink: 0; margin-top: 3px; }
.mdd-hd-text { flex: 1; min-width: 0; }
.mdd-metric-label {
  font-size: 0.64rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #5a7090;
  margin-bottom: 5px;
}
.mdd-value-row { display: flex; align-items: center; gap: 7px; }
.mdd-big-val {
  font-size: 1.75rem;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  color: #e2e8f0;
  line-height: 1;
}
.mdd-sdot   { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.mdd-sstatus{ font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em; }

.mdd-close-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.mdd-close-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

/* Scrollable body */
.mdd-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: thin;
  scrollbar-color: #1e2740 transparent;
}
.mdd-body::-webkit-scrollbar       { width: 4px; }
.mdd-body::-webkit-scrollbar-track { background: transparent; }
.mdd-body::-webkit-scrollbar-thumb { background: #1e2740; border-radius: 4px; }

.mdd-desc {
  font-size: 0.74rem;
  color: #94a3b8;
  line-height: 1.65;
  margin: 0;
}

.mdd-section { display: flex; flex-direction: column; gap: 8px; }
.mdd-section-hd {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #3a4f6a;
}

.mdd-trend-box {
  background: rgba(11, 14, 26, 0.5);
  border: 1px solid #1a2740;
  border-radius: 8px;
  padding: 10px 12px 6px;
  overflow: hidden;
}

.mdd-kv-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 5px 12px;
  font-size: 0.72rem;
}
.mdd-kv-label { color: #5a7090; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mdd-kv-val   { color: #94a3b8; font-weight: 600; font-family: 'JetBrains Mono', monospace;
                 text-align: right; white-space: nowrap; }

.mdd-bullet   { display: flex; align-items: flex-start; gap: 7px; font-size: 0.72rem; color: #94a3b8; line-height: 1.5; }
.mdd-bullet-dot { flex-shrink: 0; color: #3a4f6a; font-size: 0.6rem; margin-top: 3px; }

.mdd-chips    { display: flex; flex-wrap: wrap; gap: 5px; }
.mdd-chip {
  font-size: 0.63rem;
  padding: 3px 9px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.22);
  color: #60a5fa;
  font-weight: 600;
}

.mdd-alert-list { display: flex; flex-direction: column; gap: 6px; }
.mdd-alert-row  { display: flex; align-items: flex-start; gap: 7px; }
.mdd-alert-tri  { flex-shrink: 0; font-size: 0.6rem; margin-top: 3px; }
.mdd-alert-msg  { font-size: 0.71rem; color: #94a3b8; line-height: 1.45; }

.mdd-actions {
  margin: 0;
  padding: 0 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.mdd-actions li { font-size: 0.71rem; color: #94a3b8; line-height: 1.5; }

.mdd-meta {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #1a2740;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.mdd-meta-row  { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.mdd-meta-lbl  { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #2e3f5a; white-space: nowrap; flex-shrink: 0; }
.mdd-meta-val  { font-size: 0.64rem; color: #4a6080; text-align: right; }
.mdd-meta-val.mono { font-family: 'JetBrains Mono', monospace; }

@media (max-width: 600px) {
  .mdd-panel { width: 100vw; }
}
</style>
