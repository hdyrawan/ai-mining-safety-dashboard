<script setup>
import { ref, computed } from 'vue'
import { mineZones, workers, drones, gasSensors } from '../data/mockData.js'

const hoveredZone = ref(null)
const activeFilter = ref('all')

const filteredZones = computed(() => mineZones)

// Worker clusters per zone
const workerClusters = computed(() => {
  const counts = {}
  workers.forEach(w => {
    if (!counts[w.zone]) counts[w.zone] = { normal:0, warning:0, critical:0 }
    counts[w.zone][w.status]++
  })
  return counts
})

// Drone positions (simplified)
const dronePositions = [
  { id:'D01', x:20, y:30, active:true,  name:'Eagle-1' },
  { id:'D02', x:45, y:18, active:true,  name:'Eagle-2' },
  { id:'D04', x:62, y:55, active:true,  name:'Falcon-2' },
  { id:'D05', x:10, y:65, active:false, name:'Hawk-1' },
]

// Sensor dot positions
const sensorDots = [
  { id:'GS01', x:18, y:28, status:'normal' },
  { id:'GS02', x:42, y:20, status:'warning' },
  { id:'GS03', x:35, y:60, status:'normal' },
  { id:'GS04', x:40, y:62, status:'warning' },
  { id:'GS08', x:62, y:52, status:'warning' },
  { id:'GS09', x:64, y:54, status:'warning' },
  { id:'GS11', x:60, y:23, status:'critical' },
  { id:'GS12', x:80, y:63, status:'normal' },
  { id:'GS07', x:44, y:22, status:'normal' },
  { id:'GS05', x:22, y:25, status:'normal' },
]

const statusColor = { normal:'#22c55e', warning:'#f59e0b', critical:'#ef4444' }

function zoneColor(zone) {
  if (zone.riskLevel === 'critical') return '#ef444433'
  if (zone.riskLevel === 'warning') return '#f59e0b22'
  return '#22c55e11'
}
function zoneBorder(zone) {
  if (zone.riskLevel === 'critical') return '#ef4444'
  if (zone.riskLevel === 'warning') return '#f59e0b'
  return '#22c55e44'
}
function zoneWorkerStatus(zoneId) {
  const c = workerClusters.value[zoneId]
  if (!c) return 'none'
  if (c.critical > 0) return 'critical'
  if (c.warning > 0) return 'warning'
  return 'normal'
}
</script>

<template>
  <div class="mine-map-container card">
    <div class="map-header card-header">
      <span class="card-title">⛏️ Mine Site — Real-Time View</span>
      <div class="map-legend">
        <span class="legend-item"><span class="legend-dot normal"></span>Normal</span>
        <span class="legend-item"><span class="legend-dot warning"></span>Warning</span>
        <span class="legend-item"><span class="legend-dot critical"></span>Critical</span>
        <span class="legend-sep">|</span>
        <span class="legend-item"><span class="legend-icon">🚁</span>Drone</span>
        <span class="legend-item"><span class="legend-icon">📡</span>Sensor</span>
        <span class="legend-item"><span class="legend-icon">👷</span>Workers</span>
      </div>
    </div>

    <div class="map-body">
      <svg viewBox="0 0 100 90" preserveAspectRatio="xMidYMid meet" class="mine-svg">

        <!-- ── Terrain Background ── -->
        <rect width="100" height="90" fill="#0f1322" />
        <polygon points="0,60 5,55 15,58 25,52 40,56 55,50 70,54 85,48 95,52 100,50 100,90 0,90" fill="#0d1525" opacity="0.6" />

        <!-- ── Road / Routes ── -->
        <!-- Main haul road -->
        <path d="M 10,76 Q 30,68 45,62 Q 60,55 75,62 Q 85,65 90,62" fill="none" stroke="#1e3050" stroke-width="2.5" stroke-dasharray="4,2" opacity="0.7" />
        <!-- Emergency evacuation route -->
        <path d="M 22,31 Q 18,50 14,62 Q 10,70 10,76" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.8" />
        <text x="4" y="54" font-size="2" fill="#ef444488" transform="rotate(-70,9,56)">EVAC</text>

        <!-- ── Drone patrol routes ── -->
        <ellipse cx="22" cy="28" rx="14" ry="10" fill="none" stroke="#3b82f688" stroke-width="0.8" stroke-dasharray="2,1.5" />
        <ellipse cx="46" cy="17" rx="10" ry="8" fill="none" stroke="#06b6d488" stroke-width="0.8" stroke-dasharray="2,1.5" />
        <ellipse cx="62" cy="52" rx="12" ry="9" fill="none" stroke="#3b82f655" stroke-width="0.8" stroke-dasharray="2,1.5" />

        <!-- ── Zones ── -->
        <template v-for="zone in filteredZones" :key="zone.id">
          <rect
            :x="zone.x" :y="zone.y" :width="zone.w" :height="zone.h"
            rx="1.5"
            :fill="zoneColor(zone)"
            :stroke="zoneBorder(zone)"
            stroke-width="0.6"
            @mouseenter="hoveredZone = zone.id"
            @mouseleave="hoveredZone = null"
            class="zone-rect"
          />
          <!-- Zone label -->
          <text
            :x="zone.x + zone.w/2" :y="zone.y + 4"
            text-anchor="middle"
            font-size="2.2"
            font-weight="600"
            :fill="zone.riskLevel === 'critical' ? '#ef4444' : zone.riskLevel === 'warning' ? '#f59e0b' : '#94a3b8'"
          >{{ zone.id }}</text>
          <text
            :x="zone.x + zone.w/2" :y="zone.y + zone.h - 2.5"
            text-anchor="middle"
            font-size="1.8"
            fill="#64748b"
          >{{ zone.workers > 0 ? `${zone.workers}W` : '' }}</text>
        </template>

        <!-- ── Worker status indicators ── -->
        <template v-for="zone in filteredZones" :key="'w_'+zone.id">
          <circle
            v-if="zone.workers > 0"
            :cx="zone.x + zone.w - 3" :cy="zone.y + 3"
            r="2.5"
            :fill="statusColor[zoneWorkerStatus(zone.id)] || '#94a3b8'"
            opacity="0.9"
            :style="zoneWorkerStatus(zone.id) !== 'normal' ? 'animation: blink 1.5s infinite' : ''"
          />
        </template>

        <!-- ── Gas Sensor dots ── -->
        <template v-for="s in sensorDots" :key="s.id">
          <circle :cx="s.x" :cy="s.y" r="1.8" :fill="statusColor[s.status]" opacity="0.85" />
          <circle :cx="s.x" :cy="s.y" r="3" :fill="statusColor[s.status]" opacity="0.15" />
        </template>

        <!-- ── Drones ── -->
        <template v-for="d in dronePositions" :key="d.id">
          <circle :cx="d.x" :cy="d.y" r="2.5" :fill="d.active ? '#3b82f6' : '#334155'" opacity="0.9" />
          <circle :cx="d.x" :cy="d.y" r="4" fill="#3b82f6" opacity="0.2"
            :style="d.active ? 'animation: blink 2s infinite' : ''" />
          <text :x="d.x" :y="d.y - 3.5" text-anchor="middle" font-size="1.8" fill="#3b82f6">{{ d.name }}</text>
        </template>

        <!-- ── Critical hazard highlight ── -->
        <rect x="57" y="19" width="11" height="11" rx="1" fill="#ef444422" stroke="#ef4444" stroke-width="0.8"
          stroke-dasharray="2,1" style="animation: blink 1.5s infinite" />
        <text x="62.5" y="27" text-anchor="middle" font-size="2.8" fill="#ef4444">⚠</text>

        <!-- ── Tailings monitoring point ── -->
        <circle cx="84" cy="64" r="3" fill="#f59e0b22" stroke="#f59e0b" stroke-width="0.7" />
        <text x="84" y="65" text-anchor="middle" font-size="2" fill="#f59e0b">T</text>

        <!-- ── Water monitoring point ── -->
        <circle cx="92" cy="42" r="2.5" fill="#06b6d422" stroke="#06b6d4" stroke-width="0.7" />
        <text x="92" y="43" text-anchor="middle" font-size="2" fill="#06b6d4">W</text>

        <!-- ── Biodiversity zone shading ── -->
        <rect x="78" y="6" width="16" height="16" rx="1" fill="#10b98122" stroke="#10b981" stroke-width="0.6" stroke-dasharray="2,1" />
        <text x="86" y="14" text-anchor="middle" font-size="2.2" fill="#10b981">🌿</text>

        <!-- ── Zone tooltip ── -->
        <template v-if="hoveredZone">
          <template v-for="zone in filteredZones.filter(z=>z.id===hoveredZone)" :key="'t'+zone.id">
            <rect
              :x="Math.min(zone.x + zone.w/2 - 18, 62)"
              :y="zone.y + zone.h + 1"
              width="36" height="14" rx="2"
              fill="#1e2840" stroke="#253050" stroke-width="0.5"
            />
            <text
              :x="Math.min(zone.x + zone.w/2, 80)"
              :y="zone.y + zone.h + 7.5"
              text-anchor="middle" font-size="2.2" fill="#e2e8f0"
            >{{ zone.name }}</text>
            <text
              :x="Math.min(zone.x + zone.w/2, 80)"
              :y="zone.y + zone.h + 12"
              text-anchor="middle" font-size="1.8"
              :fill="zone.riskLevel==='critical'?'#ef4444':zone.riskLevel==='warning'?'#f59e0b':'#22c55e'"
            >{{ zone.workers }}W · {{ zone.riskLevel.toUpperCase() }}</text>
          </template>
        </template>

        <!-- ── Scale indicator ── -->
        <line x1="2" y1="86" x2="12" y2="86" stroke="#334155" stroke-width="0.8" />
        <text x="7" y="89" text-anchor="middle" font-size="1.8" fill="#334155">500m</text>
      </svg>

      <!-- ── Map stats overlay ── -->
      <div class="map-stats">
        <div class="map-stat">
          <span class="ms-value">{{ mineZones.filter(z=>z.riskLevel==='critical').length }}</span>
          <span class="ms-label crit">Critical Zones</span>
        </div>
        <div class="map-stat">
          <span class="ms-value">{{ mineZones.filter(z=>z.riskLevel==='warning').length }}</span>
          <span class="ms-label warn">Warning Zones</span>
        </div>
        <div class="map-stat">
          <span class="ms-value">{{ drones.filter(d=>d.status==='active').length }}</span>
          <span class="ms-label info">Drones Active</span>
        </div>
        <div class="map-stat">
          <span class="ms-value">{{ workers.filter(w=>w.status!=='normal').length }}</span>
          <span class="ms-label warn">Workers At Risk</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mine-map-container { overflow: hidden; display: flex; flex-direction: column; }
.map-header { flex-shrink: 0; }
.map-legend {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.68rem;
  color: var(--text-muted);
}
.legend-item { display: flex; align-items: center; gap: 3px; }
.legend-dot {
  width: 7px; height: 7px; border-radius: 50%;
}
.legend-dot.normal   { background: var(--status-ok); }
.legend-dot.warning  { background: var(--status-warn); }
.legend-dot.critical { background: var(--status-crit); }
.legend-icon { font-size: 0.75rem; }
.legend-sep  { color: var(--border-card); }

.map-body { position: relative; flex: 1; padding: 8px; }
.mine-svg { width: 100%; height: 100%; min-height: 280px; border-radius: var(--radius-md); background: #0b0e1a; }
.zone-rect { cursor: pointer; transition: opacity 0.15s; }
.zone-rect:hover { opacity: 0.85; }

.map-stats {
  position: absolute;
  bottom: 16px; right: 16px;
  background: rgba(15,19,34,0.9);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  display: flex;
  gap: 14px;
  backdrop-filter: blur(4px);
}
.map-stat { text-align: center; }
.ms-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text-primary);
}
.ms-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 600;
  text-transform: uppercase;
}
.ms-label.crit { color: var(--status-crit); }
.ms-label.warn { color: var(--status-warn); }
.ms-label.info { color: var(--status-info); }
</style>
