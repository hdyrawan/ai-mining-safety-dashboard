<script setup>
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  worker: { type: Object, default: null },
})
const emit = defineEmits(['close'])

function statusAccent(s) {
  if (s === 'critical') return 'var(--status-crit)'
  if (s === 'warning')  return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function dbaColor(v) {
  if (v >= 90) return 'var(--status-crit)'
  if (v >= 85) return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function doseColor(v) {
  if (v >= 80) return 'var(--status-crit)'
  if (v >= 50) return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function ppeColor(v) {
  return v === 'Verified' ? 'var(--status-ok)' : 'var(--status-crit)'
}
</script>

<template>
  <Transition name="drawer-slide">
    <div v-if="worker" class="drawer-backdrop" @click.self="emit('close')">
      <div class="drawer" :style="{ '--status-accent': statusAccent(worker.status) }">

        <!-- Header -->
        <div class="drawer-header">
          <div class="dh-left">
            <span class="dh-label">🎧 Noise Exposure Profile</span>
            <div class="dh-name-row">
              <span class="dh-name">{{ worker.name }}</span>
              <span class="dh-id">{{ worker.id }}</span>
              <StatusBadge :status="worker.status" />
            </div>
            <div class="dh-meta">{{ worker.zone }} · PPE: {{ worker.ppeStatus }}</div>
          </div>
          <button class="dh-close" @click="emit('close')">✕</button>
        </div>

        <div class="drawer-body">

          <!-- Exposure summary -->
          <div class="dsec">
            <div class="dsec-title">📊 Exposure Summary</div>
            <div class="d3col">
              <div class="metric-box">
                <div class="mb-label">8h TWA</div>
                <div class="mb-value" :style="{ color: dbaColor(worker.twa8h) }">{{ worker.twa8h }} <span class="mb-unit">dBA</span></div>
                <div class="mb-sub">Action level: 85 dBA</div>
              </div>
              <div class="metric-box">
                <div class="mb-label">Peak dB</div>
                <div class="mb-value" :style="{ color: dbaColor(worker.peakDb - 20) }">{{ worker.peakDb }} <span class="mb-unit">dB</span></div>
                <div class="mb-sub">Limit: 140 dB impulse</div>
              </div>
              <div class="metric-box">
                <div class="mb-label">Daily Dose</div>
                <div class="mb-value" :style="{ color: doseColor(worker.dailyDose) }">{{ worker.dailyDose }}<span class="mb-unit">%</span></div>
                <div class="mb-sub">Limit: 100%</div>
              </div>
            </div>
            <div class="dose-bar-wrap">
              <div class="dose-bar-track">
                <div
                  class="dose-bar-fill"
                  :style="{ width: Math.min(worker.dailyDose, 100) + '%', background: doseColor(worker.dailyDose) }"
                ></div>
                <div class="dose-bar-marker" style="left:50%">50%</div>
                <div class="dose-bar-marker" style="left:80%">80%</div>
              </div>
              <div class="dose-bar-label">Daily noise dose — {{ worker.dailyDose }}% of limit used</div>
            </div>
          </div>

          <!-- PPE Status -->
          <div class="dsec">
            <div class="dsec-title">🎧 Hearing Protection</div>
            <div class="ppe-row">
              <span class="ppe-label">PPE Status</span>
              <span class="ppe-value" :style="{ color: ppeColor(worker.ppeStatus) }">{{ worker.ppeStatus }}</span>
            </div>
            <div class="ppe-row">
              <span class="ppe-label">Recommendation</span>
              <span class="ppe-value warn">{{ worker.recommendation }}</span>
            </div>
          </div>

          <!-- Exposure timeline -->
          <div class="dsec">
            <div class="dsec-title">📈 Exposure Timeline</div>
            <div class="timeline-list">
              <div v-for="(t, i) in worker.timeline" :key="i" class="tl-row">
                <span class="tl-time">{{ t.time }}</span>
                <span class="tl-bar-wrap">
                  <span
                    class="tl-bar"
                    :style="{
                      width: Math.min(t.dba / 120 * 100, 100) + '%',
                      background: dbaColor(t.dba)
                    }"
                  ></span>
                </span>
                <span class="tl-dba" :style="{ color: dbaColor(t.dba) }">{{ t.dba }} dBA</span>
                <span class="tl-event">{{ t.event }}</span>
              </div>
            </div>
          </div>

          <!-- Peak impulse events -->
          <div class="dsec">
            <div class="dsec-title">⚡ Peak Impulse Events</div>
            <div v-if="worker.peakEvents.length === 0" class="no-events">No impulse events above 95 dB recorded</div>
            <div v-else class="peak-list">
              <div v-for="(p, i) in worker.peakEvents" :key="i" class="peak-row">
                <span class="peak-time">{{ p.time }}</span>
                <span class="peak-db" :style="{ color: dbaColor(p.db - 20) }">{{ p.db }} dB</span>
                <span class="peak-cause">{{ p.cause }}</span>
              </div>
            </div>
          </div>

          <!-- AI explanation -->
          <div class="dsec">
            <div class="dsec-title">🤖 AI Explanation</div>
            <div class="ai-box">
              <p class="ai-text">{{ worker.aiExplanation }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}
.drawer {
  width: 540px;
  max-width: 96vw;
  height: 100%;
  background: var(--bg-card);
  border-left: 2px solid var(--status-accent);
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px rgba(0,0,0,0.6);
  overflow: hidden;
}

/* Slide transition */
.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(100%); }

.drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--border-card);
  flex-shrink: 0;
}
.dh-left { display: flex; flex-direction: column; gap: 4px; }
.dh-label { font-size: 0.65rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; }
.dh-name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dh-name { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
.dh-id { font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); background: var(--bg-secondary); padding: 2px 7px; border-radius: 4px; }
.dh-meta { font-size: 0.72rem; color: var(--text-muted); }
.dh-close {
  background: none; border: 1px solid var(--border-card); color: var(--text-muted);
  width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all var(--transition-fast);
}
.dh-close:hover { background: var(--bg-secondary); color: var(--text-primary); }

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dsec { display: flex; flex-direction: column; gap: 8px; }
.dsec-title {
  font-size: 0.7rem; font-weight: 700; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.08em;
  padding-bottom: 4px; border-bottom: 1px solid var(--border-base);
}

.d3col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.metric-box {
  background: var(--bg-secondary); border-radius: var(--radius-md);
  padding: 12px; border: 1px solid var(--border-base); text-align: center;
}
.mb-label { font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.mb-value { font-size: 1.4rem; font-weight: 700; font-family: var(--font-mono); line-height: 1.1; }
.mb-unit { font-size: 0.7rem; font-weight: 400; color: var(--text-muted); }
.mb-sub { font-size: 0.62rem; color: var(--text-dim); margin-top: 3px; }

.dose-bar-wrap { margin-top: 4px; }
.dose-bar-track {
  position: relative; height: 8px; background: var(--bg-secondary);
  border-radius: 4px; overflow: visible; margin-bottom: 18px;
}
.dose-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s ease; }
.dose-bar-marker {
  position: absolute; top: 10px; transform: translateX(-50%);
  font-size: 0.58rem; color: var(--text-dim);
}
.dose-bar-marker::before {
  content: ''; position: absolute; left: 50%; top: -12px;
  height: 8px; width: 1px; background: var(--border-base); transform: translateX(-50%);
}
.dose-bar-label { font-size: 0.65rem; color: var(--text-muted); text-align: center; }

.ppe-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--bg-secondary); border-radius: var(--radius-sm); }
.ppe-label { font-size: 0.72rem; color: var(--text-secondary); }
.ppe-value { font-size: 0.8rem; font-weight: 700; }
.ppe-value.warn { color: var(--status-warn); }

.timeline-list { display: flex; flex-direction: column; gap: 6px; }
.tl-row { display: grid; grid-template-columns: 44px 1fr 60px auto; gap: 8px; align-items: center; }
.tl-time { font-size: 0.65rem; font-family: var(--font-mono); color: var(--text-dim); }
.tl-bar-wrap { background: var(--bg-secondary); border-radius: 3px; height: 6px; overflow: hidden; }
.tl-bar { display: block; height: 100%; border-radius: 3px; transition: width 0.3s; }
.tl-dba { font-size: 0.7rem; font-family: var(--font-mono); font-weight: 600; text-align: right; }
.tl-event { font-size: 0.65rem; color: var(--text-muted); grid-column: 1 / -1; padding-left: 52px; margin-top: -2px; }

.no-events { font-size: 0.75rem; color: var(--status-ok); text-align: center; padding: 12px; }
.peak-list { display: flex; flex-direction: column; gap: 6px; }
.peak-row { display: flex; align-items: center; gap: 10px; padding: 6px 10px; background: var(--bg-secondary); border-radius: var(--radius-sm); }
.peak-time { font-size: 0.65rem; font-family: var(--font-mono); color: var(--text-dim); flex-shrink: 0; }
.peak-db { font-size: 0.85rem; font-weight: 700; font-family: var(--font-mono); flex-shrink: 0; min-width: 56px; }
.peak-cause { font-size: 0.7rem; color: var(--text-secondary); }

.ai-box { background: var(--bg-secondary); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 12px 14px; }
.ai-text { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }
</style>
