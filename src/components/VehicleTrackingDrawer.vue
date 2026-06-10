<script setup>
import { computed, ref } from 'vue'
import { mineZones } from '../data/mockData.js'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({ vehicle: { type: Object, default: null } })
const emit = defineEmits(['close'])

const showRoute = ref(false)

// ── Colour helpers ────────────────────────────────────────────────────────────
function vColor(v) {
  if (!v) return '#22c55e'
  if (v.proximityAlert || v.fatigueScore >= 70) return '#ef4444'
  if (v.status === 'maintenance') return '#f59e0b'
  if (v.status === 'standby')     return '#3b82f6'
  if (v.fatigueScore >= 50 || v.route === 'unapproved' || v.phoneUse || v.distractionAlert) return '#f59e0b'
  return '#22c55e'
}
function vBadge(v) {
  if (!v) return 'normal'
  if (v.proximityAlert || v.fatigueScore >= 70) return 'critical'
  if (v.status === 'maintenance') return 'warning'
  if (v.status === 'standby')     return 'info'
  if (v.fatigueScore >= 50 || v.route === 'unapproved' || v.phoneUse || v.distractionAlert) return 'warning'
  return 'normal'
}
function tempColor(t) {
  if (t > 100) return 'var(--status-crit)'
  if (t > 88)  return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function fuelColor(f) {
  if (f < 25) return 'var(--status-crit)'
  if (f < 50) return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function fatigueColor(s) {
  if (s >= 70) return 'var(--status-crit)'
  if (s >= 50) return 'var(--status-warn)'
  if (s > 0)   return 'var(--status-ok)'
  return 'var(--text-dim)'
}
function gcColor(g) {
  if (g === 'Clear') return 'var(--status-ok)'
  if (g?.startsWith('Warning')) return 'var(--status-warn)'
  return 'var(--text-muted)'
}

// ── SVG map ───────────────────────────────────────────────────────────────────
const ZONE_COLORS = {
  normal:   { fill:'rgba(34,197,94,0.10)',  stroke:'rgba(34,197,94,0.40)' },
  warning:  { fill:'rgba(245,158,11,0.12)', stroke:'rgba(245,158,11,0.45)' },
  critical: { fill:'rgba(239,68,68,0.12)',  stroke:'rgba(239,68,68,0.45)' },
}
function zc(level) { return ZONE_COLORS[level] || ZONE_COLORS.normal }

function polyPts(arr) { return arr?.map(p => p.join(',')).join(' ') || '' }

const markerColor = computed(() => vColor(props.vehicle))
const isDeviated  = computed(() => props.vehicle?.route === 'unapproved')

// Telemetry items built from vehicle data
const telemetry = computed(() => {
  const v = props.vehicle
  if (!v) return []
  return [
    { label:'Speed',       value: v.speed > 0 ? v.speed + ' km/h' : '0 km/h',   color: 'var(--text-primary)' },
    { label:'Fuel',        value: v.fuelPct + '%',                                color: fuelColor(v.fuelPct) },
    { label:'Engine Temp', value: v.engineTemp + '°C',                            color: tempColor(v.engineTemp) },
    { label:'Brake Temp',  value: v.telemetry?.brakeTemp ?? 'N/A',               color: 'var(--text-secondary)' },
    { label:'Load',        value: v.telemetry?.load ?? 'N/A',                    color: 'var(--text-secondary)' },
    { label:'Vibration',   value: v.telemetry?.vibration ?? 'N/A',               color: v.telemetry?.vibration === 'Elevated' ? 'var(--status-warn)' : 'var(--text-secondary)' },
    { label:'Idle Time',   value: v.telemetry?.idleTime ?? 'N/A',                color: 'var(--text-secondary)' },
    { label:'GPS Lock',    value: v.gps?.gpsLock ?? 'Unknown',                   color: v.gps?.gpsLock === 'Strong' ? 'var(--status-ok)' : v.gps?.gpsLock === 'Moderate' ? 'var(--status-warn)' : 'var(--text-muted)' },
  ]
})

const aiStatus = computed(() => {
  const v = props.vehicle
  if (!v) return 'normal'
  if (v.proximityAlert || v.fatigueScore >= 70) return 'critical'
  if (v.fatigueScore >= 50 || v.route === 'unapproved' || v.phoneUse || v.distractionAlert) return 'warning'
  return 'normal'
})
const aiColor = computed(() => {
  if (aiStatus.value === 'critical') return 'var(--status-crit)'
  if (aiStatus.value === 'warning')  return 'var(--status-warn)'
  return 'var(--status-ok)'
})

const hasDriver = computed(() => props.vehicle?.driver && props.vehicle.driver !== '—')
</script>

<template>
  <Transition name="drawer-slide">
    <div v-if="vehicle" class="vt-backdrop" @click.self="emit('close')">
      <div class="vt-drawer" :style="{ '--vt-accent': markerColor }">

        <!-- ── Header ─────────────────────────────────────────────────────── -->
        <div class="vt-header">
          <div class="vth-left">
            <span class="vth-eyebrow">🗺️ Vehicle Live Tracking</span>
            <div class="vth-name-row">
              <span class="vth-name">{{ vehicle.name }}</span>
              <span class="vth-type">{{ vehicle.type }}</span>
              <StatusBadge :status="vBadge(vehicle)" />
            </div>
            <div class="vth-meta">
              <span v-if="hasDriver">{{ vehicle.driver }}</span>
              <span v-else class="dim">No driver assigned</span>
              <span class="sep">·</span>
              <span class="mono">{{ vehicle.zone }}</span>
              <span class="sep">·</span>
              <span>{{ vehicle.status }}</span>
            </div>
          </div>
          <button class="vt-close" @click="emit('close')">✕</button>
        </div>

        <!-- ── Scrollable body ────────────────────────────────────────────── -->
        <div class="vt-body">

          <!-- ── GPS Map Panel ──────────────────────────────────────────── -->
          <div class="vt-section">
            <div class="vts-label">
              <span>📍 Simulated GPS Position</span>
              <span class="gps-coords mono" v-if="vehicle.gps">
                {{ vehicle.gps.x.toFixed(1) }}°N {{ vehicle.gps.y.toFixed(1) }}°E
              </span>
            </div>
            <div class="map-shell">
              <svg viewBox="0 0 100 100" class="mine-svg" preserveAspectRatio="xMidYMid meet">
                <!-- Background -->
                <rect x="0" y="0" width="100" height="100" fill="#0b0e1a"/>

                <!-- Grid lines (subtle) -->
                <line v-for="i in [20,40,60,80]" :key="'hg'+i" :x1="0" :y1="i" :x2="100" :y2="i" stroke="#1e2740" stroke-width="0.3"/>
                <line v-for="i in [20,40,60,80]" :key="'vg'+i" :x1="i" :y1="0" :x2="i" :y2="100" stroke="#1e2740" stroke-width="0.3"/>

                <!-- Mine zones -->
                <g v-for="z in mineZones" :key="z.id">
                  <rect
                    :x="z.x" :y="z.y" :width="z.w" :height="z.h"
                    :fill="zc(z.riskLevel).fill"
                    :stroke="zc(z.riskLevel).stroke"
                    stroke-width="0.5"
                    rx="1"
                  />
                  <text
                    :x="z.x + z.w / 2" :y="z.y + z.h / 2 + 1.5"
                    text-anchor="middle" font-size="2.8"
                    fill="rgba(148,163,184,0.6)"
                  >{{ z.id }}</text>
                </g>

                <!-- Approved route (dashed green or amber if deviated) -->
                <polyline
                  v-if="vehicle.routeCompliance?.routePath?.length"
                  :points="polyPts(vehicle.routeCompliance.routePath)"
                  fill="none"
                  :stroke="isDeviated ? '#f59e0b' : '#22c55e'"
                  stroke-width="0.8"
                  stroke-dasharray="2,1.5"
                  opacity="0.7"
                />

                <!-- Current path (solid, shows deviation if unapproved) -->
                <polyline
                  v-if="isDeviated && vehicle.routeCompliance?.currentPath?.length"
                  :points="polyPts(vehicle.routeCompliance.currentPath)"
                  fill="none"
                  stroke="#ef4444"
                  stroke-width="1.2"
                  opacity="0.85"
                />

                <!-- Worker proximity ring (if proximity alert) -->
                <circle
                  v-if="vehicle.proximityAlert && vehicle.gps"
                  :cx="vehicle.gps.x" :cy="vehicle.gps.y" r="8"
                  fill="none"
                  stroke="#ef4444"
                  stroke-width="0.6"
                  stroke-dasharray="1.5,1"
                  opacity="0.6"
                />

                <!-- Geofence warning ring (if geofence warning) -->
                <circle
                  v-if="vehicle.routeCompliance?.geofence?.startsWith('Warning') && vehicle.gps"
                  :cx="vehicle.gps.x" :cy="vehicle.gps.y" r="12"
                  fill="none"
                  stroke="#f59e0b"
                  stroke-width="0.5"
                  stroke-dasharray="2,2"
                  opacity="0.5"
                />

                <!-- Vehicle marker -->
                <g v-if="vehicle.gps" :transform="`translate(${vehicle.gps.x},${vehicle.gps.y})`">
                  <!-- Glow -->
                  <circle r="4.5" :fill="markerColor" opacity="0.15"/>
                  <!-- Body -->
                  <circle r="2.8" :fill="markerColor" opacity="0.9"/>
                  <!-- Direction arrow (pointing up, rotated by heading) -->
                  <g :transform="`rotate(${vehicle.gps.heading},0,0)`">
                    <polygon points="0,-5 -1.2,-2.5 1.2,-2.5" :fill="markerColor" opacity="0.85"/>
                  </g>
                  <!-- Risk indicator dot -->
                  <circle
                    v-if="vehicle.phoneUse || vehicle.fatigueScore >= 70 || vehicle.proximityAlert"
                    cx="2.5" cy="-2.5" r="1.2" fill="#ef4444"
                  />
                  <!-- Vehicle ID label -->
                  <text y="6" text-anchor="middle" font-size="2.5" :fill="markerColor" font-weight="bold">
                    {{ vehicle.name }}
                  </text>
                </g>

                <!-- Compass rose -->
                <g transform="translate(94,6)">
                  <text text-anchor="middle" y="-1" font-size="2.2" fill="rgba(148,163,184,0.5)">N</text>
                  <line x1="0" y1="0" x2="0" y2="2.5" stroke="rgba(148,163,184,0.4)" stroke-width="0.5"/>
                </g>

                <!-- Map legend -->
                <g transform="translate(1,96)">
                  <circle cx="0" cy="0" r="1" fill="#22c55e"/>
                  <text x="2.5" y="0.8" font-size="2" fill="rgba(148,163,184,0.5)">Approved</text>
                  <circle cx="18" cy="0" r="1" fill="#ef4444"/>
                  <text x="20.5" y="0.8" font-size="2" fill="rgba(148,163,184,0.5)">Deviated</text>
                  <circle cx="36" cy="0" r="1" fill="#ef4444" opacity="0.5"/>
                  <text x="38.5" y="0.8" font-size="2" fill="rgba(148,163,184,0.5)">Proximity</text>
                </g>
              </svg>
              <div class="map-badge">SIMULATED GPS</div>
            </div>
          </div>

          <!-- ── Telemetry Grid ──────────────────────────────────────────── -->
          <div class="vt-section">
            <div class="vts-label">📊 Live Telemetry</div>
            <div class="tele-grid">
              <div v-for="t in telemetry" :key="t.label" class="tele-card">
                <div class="tc-label">{{ t.label }}</div>
                <div class="tc-value mono" :style="{ color: t.color }">{{ t.value }}</div>
              </div>
            </div>
          </div>

          <!-- ── Driver Risk ─────────────────────────────────────────────── -->
          <div class="vt-section">
            <div class="vts-label">👤 Driver &amp; Operator Risk</div>
            <div v-if="!hasDriver" class="no-driver-note">No driver assigned to this vehicle.</div>
            <div v-else class="driver-grid">
              <div class="dkv">
                <span class="dk">Driver</span>
                <span class="dv">{{ vehicle.driver }}</span>
              </div>
              <div class="dkv">
                <span class="dk">Fatigue Score</span>
                <span class="dv mono" :style="{ color: fatigueColor(vehicle.fatigueScore) }">
                  {{ vehicle.fatigueScore > 0 ? vehicle.fatigueScore + ' / 100' : 'N/A' }}
                </span>
              </div>
              <div class="dkv">
                <span class="dk">Phone Use</span>
                <span class="dv" :style="{ color: vehicle.phoneUse ? 'var(--status-warn)' : 'var(--status-ok)' }">
                  {{ vehicle.phoneUse ? '⚠ Detected' : 'None detected' }}
                </span>
              </div>
              <div class="dkv">
                <span class="dk">Distraction</span>
                <span class="dv" :style="{ color: vehicle.distractionAlert ? 'var(--status-warn)' : 'var(--status-ok)' }">
                  {{ vehicle.distractionAlert ? '⚠ Active' : 'Clear' }}
                </span>
              </div>
              <div class="dkv">
                <span class="dk">Seatbelt</span>
                <span class="dv" :style="{ color: vehicle.driverRisk?.seatbelt === 'OK' ? 'var(--status-ok)' : 'var(--status-crit)' }">
                  {{ vehicle.driverRisk?.seatbelt ?? 'N/A' }}
                </span>
              </div>
              <div class="dkv">
                <span class="dk">Shift Duration</span>
                <span class="dv mono">{{ vehicle.driverRisk?.shiftDuration ?? '—' }}</span>
              </div>
              <div class="dkv">
                <span class="dk">Last Break</span>
                <span class="dv mono">{{ vehicle.driverRisk?.lastBreak ?? '—' }}</span>
              </div>
              <div class="dkv">
                <span class="dk">Licence Valid</span>
                <span class="dv" :style="{ color: vehicle.licenceValid ? 'var(--status-ok)' : 'var(--status-crit)' }">
                  {{ vehicle.licenceValid ? 'Valid' : '✕ Not validated' }}
                </span>
              </div>
            </div>
          </div>

          <!-- ── Route Compliance ────────────────────────────────────────── -->
          <div class="vt-section">
            <div class="vts-label">🛣️ Route Compliance</div>
            <div class="route-grid">
              <div class="dkv">
                <span class="dk">Approved Route</span>
                <span class="dv mono">{{ vehicle.routeCompliance?.approvedRoute ?? '—' }}</span>
              </div>
              <div class="dkv">
                <span class="dk">Route Status</span>
                <span class="dv" :style="{ color: vehicle.route === 'approved' ? 'var(--status-ok)' : 'var(--status-warn)' }">
                  {{ vehicle.route === 'approved' ? 'Approved ✓' : 'Unapproved ⚠' }}
                </span>
              </div>
              <div class="dkv">
                <span class="dk">Deviation</span>
                <span class="dv mono" :style="{ color: vehicle.routeCompliance?.deviation === '0 m' ? 'var(--status-ok)' : 'var(--status-warn)' }">
                  {{ vehicle.routeCompliance?.deviation ?? '—' }}
                </span>
              </div>
              <div class="dkv">
                <span class="dk">Geofence</span>
                <span class="dv" :style="{ color: gcColor(vehicle.routeCompliance?.geofence) }">
                  {{ vehicle.routeCompliance?.geofence ?? '—' }}
                </span>
              </div>
              <div class="dkv">
                <span class="dk">ETA</span>
                <span class="dv mono">{{ vehicle.routeCompliance?.eta ?? '—' }}</span>
              </div>
              <div class="dkv">
                <span class="dk">Next Checkpoint</span>
                <span class="dv mono">{{ vehicle.routeCompliance?.nextCheckpoint ?? '—' }}</span>
              </div>
            </div>
            <div v-if="isDeviated" class="deviation-banner">
              ⚠ Vehicle is 380 m from approved haul road. Reroute to {{ vehicle.routeCompliance?.approvedRoute }} immediately.
            </div>
          </div>

          <!-- ── AI Risk Explanation ──────────────────────────────────────── -->
          <div class="vt-section">
            <div class="vts-label">
              <span>🤖 AI Risk Explanation</span>
              <span class="ai-conf-badge" :style="{ color: aiColor }">
                {{ vehicle.aiExplanation?.confidence }}% confidence
              </span>
            </div>
            <div class="ai-box" :style="{ borderColor: aiColor + '55' }">
              <div class="ai-status-row">
                <StatusBadge :status="aiStatus" />
                <span class="ai-status-label">{{ vehicle.name }} — AI assessment</span>
              </div>
              <div class="ai-factors">
                <div v-for="(f, i) in vehicle.aiExplanation?.factors" :key="i" class="ai-factor">
                  <span class="ai-bullet" :style="{ color: aiColor }">▸</span>
                  <span>{{ f }}</span>
                </div>
              </div>
              <div class="ai-divider"></div>
              <div class="ai-actions-label">Recommended actions:</div>
              <div class="ai-actions">
                <div v-for="(a, i) in vehicle.aiExplanation?.recommendedActions" :key="i" class="ai-action">
                  {{ i + 1 }}. {{ a }}
                </div>
              </div>
            </div>
          </div>

          <!-- ── Action Buttons ──────────────────────────────────────────── -->
          <div class="vt-section">
            <div class="vts-label">⚡ Actions</div>
            <div class="action-grid">
              <button class="act-btn blue">📞 Contact Driver</button>
              <button class="act-btn amber">🔔 Notify Supervisor</button>
              <button class="act-btn green" @click="showRoute = !showRoute">🗺️ Show Route</button>
              <button class="act-btn purple">🔧 Create Maintenance Ticket</button>
              <button class="act-btn grey">✓ Mark Reviewed</button>
            </div>
          </div>

          <!-- ── Demo disclaimer ────────────────────────────────────────── -->
          <div class="demo-note">
            ℹ️ Demo GPS and telemetry data for operational safety monitoring.
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.vt-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}
.vt-drawer {
  width: 620px;
  max-width: 96vw;
  height: 100%;
  background: var(--bg-card);
  border-left: 2px solid var(--vt-accent, var(--accent-blue));
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px rgba(0,0,0,0.6);
  overflow: hidden;
}

.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(100%); }

/* ── Header ── */
.vt-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--border-card);
  flex-shrink: 0;
  background: var(--bg-secondary);
}
.vth-left { display: flex; flex-direction: column; gap: 4px; }
.vth-eyebrow { font-size: 0.62rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; }
.vth-name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.vth-name { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); font-family: var(--font-mono); }
.vth-type { font-size: 0.72rem; color: var(--text-muted); background: var(--bg-card); padding: 2px 8px; border-radius: 10px; border: 1px solid var(--border-card); }
.vth-meta { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; color: var(--text-muted); }
.vth-meta .sep { color: var(--text-dim); }
.vth-meta .mono { font-family: var(--font-mono); }
.vth-meta .dim { color: var(--text-dim); }
.vt-close {
  background: none; border: 1px solid var(--border-card); color: var(--text-muted);
  width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all var(--transition-fast);
}
.vt-close:hover { background: var(--bg-card); color: var(--text-primary); }

/* ── Body ── */
.vt-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.vt-section {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-base);
}
.vts-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}
.gps-coords { font-size: 0.65rem; color: var(--text-dim); font-style: normal; text-transform: none; letter-spacing: 0; }

/* ── SVG Map ── */
.map-shell {
  position: relative;
  background: #0b0e1a;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-card);
  overflow: hidden;
  aspect-ratio: 5/3;
}
.mine-svg { width: 100%; height: 100%; display: block; }
.map-badge {
  position: absolute;
  top: 7px; right: 9px;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(148,163,184,0.4);
  background: rgba(11,14,26,0.7);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid rgba(148,163,184,0.12);
}

/* ── Telemetry ── */
.tele-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.tele-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  padding: 9px 10px;
  border: 1px solid var(--border-base);
  text-align: center;
}
.tc-label { font-size: 0.6rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
.tc-value { font-size: 0.9rem; font-weight: 700; }

/* ── Driver risk ── */
.no-driver-note { font-size: 0.75rem; color: var(--text-dim); padding: 6px 0; }
.driver-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
.dkv { display: flex; flex-direction: column; background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 7px 10px; gap: 2px; }
.dk { font-size: 0.6rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
.dv { font-size: 0.8rem; font-weight: 600; color: var(--text-primary); }
.dv.mono { font-family: var(--font-mono); }

/* ── Route ── */
.route-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 8px; }
.deviation-banner {
  background: var(--status-warn-bg);
  border: 1px solid var(--status-warn-border);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  font-size: 0.74rem;
  color: var(--status-warn);
  line-height: 1.4;
}

/* ── AI box ── */
.ai-conf-badge { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; letter-spacing: 0; text-transform: none; }
.ai-box {
  background: var(--bg-secondary);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-md);
  padding: 12px 14px;
}
.ai-status-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.ai-status-label { font-size: 0.72rem; color: var(--text-muted); }
.ai-factors { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
.ai-factor { display: flex; align-items: flex-start; gap: 6px; font-size: 0.74rem; color: var(--text-secondary); line-height: 1.4; }
.ai-bullet { font-size: 0.55rem; margin-top: 4px; flex-shrink: 0; }
.ai-divider { height: 1px; background: var(--border-base); margin-bottom: 8px; }
.ai-actions-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-dim); margin-bottom: 5px; }
.ai-actions { display: flex; flex-direction: column; gap: 4px; }
.ai-action { font-size: 0.74rem; color: var(--text-secondary); padding-left: 4px; }

/* ── Action buttons ── */
.action-grid { display: flex; gap: 7px; flex-wrap: wrap; }
.act-btn {
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-sans);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
  white-space: nowrap;
}
.act-btn.blue   { background: var(--status-info-bg);  color: var(--accent-blue); border-color: var(--status-info-border); }
.act-btn.amber  { background: var(--status-warn-bg);  color: var(--status-warn); border-color: var(--status-warn-border); }
.act-btn.green  { background: var(--status-ok-bg);    color: var(--status-ok);   border-color: var(--status-ok-border); }
.act-btn.purple { background: rgba(99,102,241,0.1);   color: #818cf8;            border-color: rgba(99,102,241,0.25); }
.act-btn.grey   { background: var(--bg-secondary);    color: var(--text-muted);  border-color: var(--border-card); }
.act-btn:hover  { filter: brightness(1.15); transform: translateY(-1px); }

/* ── Demo note ── */
.demo-note {
  margin: 12px 20px 20px;
  font-size: 0.65rem;
  color: var(--text-dim);
  padding: 7px 10px;
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
}

@media (max-width: 600px) {
  .tele-grid { grid-template-columns: repeat(2, 1fr); }
  .driver-grid, .route-grid { grid-template-columns: 1fr; }
  .action-grid .act-btn { flex: 1; }
}
</style>
