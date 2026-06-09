<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  drone: { type: Object, required: true }
})

const emit = defineEmits(['close'])

const videoEl = ref(null)
const videoError = ref(false)

watch(() => props.drone.id, () => {
  videoError.value = false
  if (videoEl.value) videoEl.value.load()
})

const now = ref(new Date())
let timer = null
onMounted(() => { timer = setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => { clearInterval(timer) })

const timestamp = computed(() =>
  now.value.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
)

const showVideo = computed(() =>
  props.drone.status === 'active' && props.drone.videoSrc && !videoError.value
)

function batteryColor(pct) {
  if (pct >= 60) return 'var(--status-ok)'
  if (pct >= 25) return 'var(--status-warn)'
  return 'var(--status-crit)'
}

function severityColor(s) {
  if (s === 'critical') return 'var(--status-crit)'
  if (s === 'warning') return 'var(--status-warn)'
  return 'var(--status-info)'
}

function placeholderMessage(drone) {
  if (drone.status === 'charging')    return { title: 'Drone not currently streaming', detail: 'Status: Charging' }
  if (drone.status === 'standby')     return { title: 'Drone not currently streaming', detail: 'Status: Standby' }
  if (drone.status === 'maintenance') return { title: 'Drone not currently streaming', detail: 'Status: Maintenance' }
  return { title: 'Simulated feed unavailable', detail: 'Add or verify video file in /public/images' }
}
</script>

<template>
  <div class="drone-live-feed-panel">
    <!-- Panel header -->
    <div class="feed-header">
      <div class="feed-title-group">
        <span class="feed-title-label">📡 Live Drone Feed</span>
        <span class="feed-drone-name">{{ drone.name }}</span>
        <span class="feed-zone-tag">{{ drone.zone }}</span>
        <StatusBadge :status="drone.status === 'active' ? 'active' : drone.status" />
      </div>
      <button class="feed-close-btn" @click="emit('close')">✕ Close</button>
    </div>

    <!-- Panel body -->
    <div class="feed-body">
      <!-- Video column -->
      <div class="feed-video-col">
        <div class="drone-feed-video-wrap">
          <!-- Video player -->
          <video
            v-if="drone.status === 'active' && drone.videoSrc"
            ref="videoEl"
            class="drone-feed-video"
            :src="drone.videoSrc"
            autoplay
            muted
            loop
            playsinline
            @error="videoError = true"
          />

          <!-- Placeholder -->
          <div v-else class="feed-placeholder">
            <div class="ph-icon">🚁</div>
            <div class="ph-title">{{ placeholderMessage(drone).title }}</div>
            <div class="ph-detail">{{ placeholderMessage(drone).detail }}</div>
          </div>

          <!-- HUD overlay -->
          <div v-if="showVideo" class="drone-feed-hud">
            <div class="hud-scrim-top"></div>
            <div class="hud-scrim-bottom"></div>

            <div class="hud-tl">
              <div class="hud-sim-badge">◉ SIMULATED LIVE FEED</div>
              <div class="hud-drone-name">{{ drone.name }}</div>
              <div class="hud-zone-name">{{ drone.zone }}</div>
            </div>

            <div class="hud-tr">
              <div class="hud-time">{{ timestamp }}</div>
              <div class="hud-cam">{{ drone.cameraMode }}</div>
            </div>

            <div class="hud-bl">
              <span class="hud-chip">🔋 {{ drone.battery }}%</span>
              <span class="hud-chip">↑ {{ drone.altitude }}m</span>
            </div>

            <div class="hud-br">
              <span class="hud-chip hud-ai-chip">AI {{ drone.confidence }}%</span>
            </div>
          </div>
        </div>

        <div class="sim-notice">SIMULATED LIVE FEED — for demonstration purposes only</div>
      </div>

      <!-- Info column: telemetry + detections -->
      <div class="feed-info-col">
        <!-- Telemetry -->
        <div class="info-block">
          <div class="info-block-title">Telemetry</div>
          <div class="tel-rows">
            <div class="tel-row">
              <span class="tel-label">Battery</span>
              <span class="tel-val" :style="{ color: batteryColor(drone.battery) }">{{ drone.battery }}%</span>
            </div>
            <div class="tel-row">
              <span class="tel-label">Altitude</span>
              <span class="tel-val">{{ drone.altitude }} m</span>
            </div>
            <div class="tel-row">
              <span class="tel-label">Speed</span>
              <span class="tel-val">{{ drone.speed }} km/h</span>
            </div>
            <div class="tel-row">
              <span class="tel-label">Signal</span>
              <span class="tel-val">{{ drone.signalStrength }}%</span>
            </div>
            <div class="tel-row">
              <span class="tel-label">Camera Mode</span>
              <span class="tel-val">{{ drone.cameraMode }}</span>
            </div>
            <div class="tel-row">
              <span class="tel-label">AI Confidence</span>
              <span class="tel-val" style="color:var(--status-ok)">
                {{ drone.confidence > 0 ? drone.confidence + '%' : '—' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Detections -->
        <div class="info-block">
          <div class="info-block-title">AI Detections</div>
          <template v-if="drone.detections?.length">
            <div
              v-for="d in drone.detections"
              :key="d.type"
              class="det-item"
              :style="{ borderLeftColor: severityColor(d.severity) }"
            >
              <div class="det-header-row">
                <span class="det-sev-badge" :style="{ color: severityColor(d.severity), borderColor: severityColor(d.severity) }">
                  {{ d.severity.toUpperCase() }}
                </span>
                <span class="det-conf">{{ d.confidence }}% confidence</span>
              </div>
              <div class="det-title">{{ d.title || d.type.replace(/_/g, ' ') }}</div>
              <div class="det-desc">{{ d.description }}</div>
              <div class="det-action">→ {{ d.action }}</div>
            </div>
          </template>
          <div v-else class="no-det">No active detections</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drone-live-feed-panel {
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 0 24px rgba(59, 130, 246, 0.12), var(--shadow-lg);
}

/* ── Header ── */
.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.18);
  background: rgba(59, 130, 246, 0.06);
  gap: 12px;
  flex-wrap: wrap;
}
.feed-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.feed-title-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-blue);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.feed-drone-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
}
.feed-zone-tag {
  font-size: 0.68rem;
  color: var(--accent-cyan);
  background: rgba(6, 182, 212, 0.10);
  border: 1px solid rgba(6, 182, 212, 0.20);
  border-radius: 4px;
  padding: 2px 7px;
}
.feed-close-btn {
  background: rgba(239, 68, 68, 0.10);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: var(--status-crit);
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.72rem;
  cursor: pointer;
  transition: background var(--transition-fast);
  white-space: nowrap;
}
.feed-close-btn:hover { background: rgba(239, 68, 68, 0.20); }

/* ── Body layout ── */
.feed-body {
  display: flex;
  gap: 0;
}

/* ── Video column ── */
.feed-video-col {
  flex: 0 0 64%;
  border-right: 1px solid rgba(59, 130, 246, 0.15);
  display: flex;
  flex-direction: column;
}
.drone-feed-video-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #020617;
  overflow: hidden;
}
.drone-feed-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Placeholder */
.feed-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: repeating-linear-gradient(
    45deg,
    #0a0f1e,
    #0a0f1e 12px,
    #0d1326 12px,
    #0d1326 24px
  );
}
.ph-icon { font-size: 2.4rem; opacity: 0.4; }
.ph-title { font-size: 0.82rem; color: var(--text-muted); font-weight: 600; }
.ph-detail { font-size: 0.7rem; color: var(--text-dim); }

/* HUD overlay */
.drone-feed-hud {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}
.hud-scrim-top {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to bottom, rgba(2,6,23,0.75) 0%, transparent 100%);
}
.hud-scrim-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 60px;
  background: linear-gradient(to top, rgba(2,6,23,0.75) 0%, transparent 100%);
}
.hud-tl {
  position: absolute;
  top: 10px; left: 12px;
  display: flex; flex-direction: column; gap: 2px;
}
.hud-sim-badge {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #f59e0b;
  font-family: var(--font-mono);
  display: flex; align-items: center; gap: 4px;
}
.hud-drone-name {
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
  font-family: var(--font-mono);
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
}
.hud-zone-name {
  font-size: 0.62rem;
  color: rgba(255,255,255,0.7);
  font-family: var(--font-mono);
}
.hud-tr {
  position: absolute;
  top: 10px; right: 12px;
  display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
}
.hud-time {
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  font-family: var(--font-mono);
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
}
.hud-cam {
  font-size: 0.58rem;
  color: var(--accent-cyan);
  font-family: var(--font-mono);
  letter-spacing: 0.06em;
  background: rgba(6,182,212,0.15);
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid rgba(6,182,212,0.3);
}
.hud-bl {
  position: absolute;
  bottom: 10px; left: 12px;
  display: flex; gap: 6px;
}
.hud-br {
  position: absolute;
  bottom: 10px; right: 12px;
}
.hud-chip {
  font-size: 0.62rem;
  font-family: var(--font-mono);
  background: rgba(0,0,0,0.55);
  color: rgba(255,255,255,0.85);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  padding: 2px 7px;
}
.hud-ai-chip {
  color: var(--status-ok);
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.12);
}

/* Sim notice below video */
.sim-notice {
  font-size: 0.6rem;
  color: var(--text-dim);
  text-align: center;
  letter-spacing: 0.08em;
  padding: 6px 12px;
  background: rgba(245, 158, 11, 0.04);
  border-top: 1px solid rgba(245, 158, 11, 0.12);
}

/* ── Info column ── */
.feed-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 14px;
  gap: 14px;
  overflow-y: auto;
}
.info-block-title {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border-base);
}

/* Telemetry rows */
.tel-rows { display: flex; flex-direction: column; gap: 6px; }
.tel-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}
.tel-label { color: var(--text-muted); }
.tel-val { font-family: var(--font-mono); font-weight: 700; color: var(--text-primary); font-size: 0.8rem; }

/* Detection items */
.det-item {
  background: var(--bg-secondary);
  border-left: 3px solid var(--border-base);
  border-radius: 0 6px 6px 0;
  padding: 8px 10px;
  margin-bottom: 6px;
}
.det-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.det-sev-badge {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  border: 1px solid;
  border-radius: 3px;
  padding: 1px 5px;
}
.det-conf { font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-mono); }
.det-title { font-size: 0.75rem; font-weight: 600; color: var(--text-primary); margin-bottom: 3px; }
.det-desc { font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 4px; }
.det-action { font-size: 0.68rem; color: var(--accent-cyan); font-style: italic; }
.no-det { font-size: 0.72rem; color: var(--text-dim); text-align: center; padding: 12px 0; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .feed-body { flex-direction: column; }
  .feed-video-col { flex: none; border-right: none; border-bottom: 1px solid rgba(59,130,246,0.15); }
}
</style>
