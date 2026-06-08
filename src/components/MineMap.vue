<script setup>
import { ref, computed } from 'vue'
import { mineZones, workers, drones } from '../data/mockData.js'
import { store } from '../store/scenarios.js'

// ── Image config ──────────────────────────────────────────────────────────────
const IMAGE_SRC     = '/images/mining/e8277fb6-5f8f-4b45-9f35-7d3461755316.png'
const USE_IMAGE_MAP = true

const imageLoaded = ref(false)
const imageFailed = ref(false)
const showImage   = computed(() => USE_IMAGE_MAP && imageLoaded.value && !imageFailed.value)

// ── Alert → zone highlight ────────────────────────────────────────────────────
const SCENARIO_ZONE = {
  gas_leak: 'Z8', heat_stress: 'Z3', slope_crack: 'Z2',
  vehicle_proximity: 'Z1', sustain_risk: 'Z5',
  equipment_fire: 'Z1', flood_risk: 'Z3', driver_fatigue: 'Z2',
}
const highlightedZone = computed(() => SCENARIO_ZONE[store.activeScenario] ?? null)

// ── Hover state ───────────────────────────────────────────────────────────────
const hoveredZone = ref(null)

// ── Derived data ──────────────────────────────────────────────────────────────
const workerClusters = computed(() => {
  const counts = {}
  workers.forEach(w => {
    if (!counts[w.zone]) counts[w.zone] = { normal:0, warning:0, critical:0 }
    counts[w.zone][w.status]++
  })
  return counts
})

const dronePositions = [
  { id:'D01', x:20, y:30, active:true,  name:'Eagle-1' },
  { id:'D02', x:45, y:18, active:true,  name:'Eagle-2' },
  { id:'D04', x:62, y:55, active:true,  name:'Falcon-2' },
  { id:'D05', x:10, y:65, active:false, name:'Hawk-1' },
]

const sensorDots = [
  { id:'GS01', x:18, y:28, status:'normal'   },
  { id:'GS02', x:42, y:20, status:'warning'  },
  { id:'GS03', x:35, y:60, status:'normal'   },
  { id:'GS04', x:40, y:62, status:'warning'  },
  { id:'GS08', x:62, y:52, status:'warning'  },
  { id:'GS09', x:64, y:54, status:'warning'  },
  { id:'GS11', x:60, y:23, status:'critical' },
  { id:'GS12', x:80, y:63, status:'normal'   },
  { id:'GS05', x:22, y:25, status:'normal'   },
]

// Live sensor/telemetry labels — manually positioned to avoid zone label overlap
const liveLabels = [
  { x:61.5, y:16,  label:'CH₄ 8.4ppm',   status:'critical', w:15 },
  { x:43,   y:48,  label:'PM₂.₅ High',   status:'warning',  w:14 },
  { x:22,   y:69,  label:'HR 128 bpm',   status:'critical', w:14 },
  { x:4,    y:38,  label:'Vib 7.6mm/s',  status:'warning',  w:16 },
  { x:47,   y:11,  label:'89% conf.',     status:'info',     w:12 },
  { x:37,   y:10,  label:'Slope+2.3cm',  status:'warning',  w:16 },
  { x:58,   y:57,  label:'Temp 34.2°C',  status:'warning',  w:15 },
]

const STATUS_COLOR = {
  normal:'#22c55e', warning:'#f59e0b', critical:'#ef4444', info:'#3b82f6',
}

function zoneColor(zone) {
  const base = zone.riskLevel === 'critical' ? '#ef4444'
             : zone.riskLevel === 'warning'  ? '#f59e0b'
             : '#22c55e'
  const alpha = showImage.value
    ? (zone.riskLevel === 'normal' ? '22' : '44')
    : (zone.riskLevel === 'normal' ? '0f' : '22')
  return base + alpha
}
function zoneBorder(zone) {
  if (zone.riskLevel === 'critical') return '#ef4444cc'
  if (zone.riskLevel === 'warning')  return '#f59e0baa'
  return '#22c55e44'
}
function zoneWorkerStatus(zoneId) {
  const c = workerClusters.value[zoneId]
  if (!c) return 'none'
  if (c.critical > 0) return 'critical'
  if (c.warning > 0)  return 'warning'
  return 'normal'
}
function zoneOpacity(zoneId) {
  if (!highlightedZone.value) return 1
  return zoneId === highlightedZone.value ? 1 : 0.35
}
</script>

<template>
  <div class="mine-map-container card">

    <!-- ── Header ── -->
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
        <span v-if="showImage" class="img-badge">📸 AI Image</span>
      </div>
    </div>

    <div class="map-body">

      <!-- Hidden preload img — detects load/error for fallback logic -->
      <img
        class="map-preload"
        :src="IMAGE_SRC"
        @load="imageLoaded = true"
        @error="imageFailed = true"
      />

      <!-- Image background layer (only when image loaded successfully) -->
      <div
        v-if="showImage"
        class="map-img-layer"
        :style="{ backgroundImage: `url(${IMAGE_SRC})` }"
      ></div>

      <!-- Dark gradient overlay for readability over image -->
      <div v-if="showImage" class="map-img-overlay"></div>

      <!-- ── SVG overlays (always on top) ── -->
      <svg
        viewBox="0 0 100 90"
        preserveAspectRatio="xMidYMid meet"
        :class="['mine-svg', { 'has-image': showImage }]"
      >

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- FALLBACK TERRAIN — only rendered when no image                  -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <template v-if="!showImage">
          <rect width="100" height="90" fill="#0b0e1a" />

          <!-- Ground elevation shading -->
          <polygon
            points="0,60 6,55 15,58 26,52 40,56 55,50 70,54 85,48 95,52 100,50 100,90 0,90"
            fill="#0d1525" />

          <!-- Open-pit contour rings centered on Z1 -->
          <ellipse cx="23" cy="31" rx="19" ry="15" fill="none" stroke="#162030" stroke-width="0.45" />
          <ellipse cx="23" cy="31" rx="14" ry="11" fill="none" stroke="#1a2840" stroke-width="0.40" />
          <ellipse cx="23" cy="31" rx="9"  ry="7"  fill="none" stroke="#1e2e48" stroke-width="0.35" />
          <ellipse cx="23" cy="31" rx="5"  ry="3.5" fill="#0e1428" stroke="#22344e" stroke-width="0.30" />

          <!-- Switchback haul road on pit wall -->
          <path d="M 36,24 L 30,28 L 33,31 L 24,36 L 20,33 L 14,38"
            fill="none" stroke="#1e2e48" stroke-width="1.3" stroke-linecap="round" />

          <!-- Conveyor belt: pit → processing plant -->
          <line x1="33" y1="37" x2="56" y2="50" stroke="#182036" stroke-width="1.0" stroke-dasharray="1.5,1.2" />
          <line x1="33.5" y1="38.2" x2="56.5" y2="51.2" stroke="#182036" stroke-width="0.4" stroke-dasharray="1.5,1.2" />

          <!-- Processing plant structures (Z4 area) -->
          <rect x="55" y="48" width="6" height="5"  fill="#101828" stroke="#1e3050" stroke-width="0.4" rx="0.3" />
          <rect x="62" y="47" width="5" height="7"  fill="#0f1525" stroke="#192038" stroke-width="0.4" rx="0.3" />
          <rect x="68" y="49" width="4" height="5"  fill="#101828" stroke="#1e2a40" stroke-width="0.4" rx="0.3" />
          <circle cx="57.5" cy="57" r="1.5" fill="#0a1020" stroke="#1e2a40" stroke-width="0.4" />
          <circle cx="60"   cy="57" r="1.5" fill="#0a1020" stroke="#1e2a40" stroke-width="0.4" />

          <!-- Underground portal (Z3 entrance) -->
          <path d="M 30,55 L 38,55 L 38,58.5 Q 34,57 30,58.5 Z"
            fill="#070b14" stroke="#253050" stroke-width="0.5" />

          <!-- Tailings settling pond (near Z5) -->
          <ellipse cx="83" cy="72" rx="5" ry="3.5" fill="#0a1528" stroke="#1a3060" stroke-width="0.5" />

          <!-- Main haul road (surface) -->
          <path d="M 8,76 Q 26,70 40,63 Q 56,56 70,60 Q 82,63 90,60"
            fill="none" stroke="#1a2a42" stroke-width="2.2" />
          <path d="M 8,76 Q 26,70 40,63 Q 56,56 70,60 Q 82,63 90,60"
            fill="none" stroke="#222e48" stroke-width="0.7" stroke-dasharray="3,2" />

          <!-- Secondary access roads -->
          <path d="M 55,62 L 58,55 L 64,51" fill="none" stroke="#182032" stroke-width="1.0" stroke-dasharray="2,1.5" />
          <path d="M 74,68 L 77,62 L 79,58" fill="none" stroke="#182032" stroke-width="1.0" stroke-dasharray="2,1.5" />

          <!-- Muster point at Z7 -->
          <polygon points="13,74 15,70 17,74" fill="#6366f133" stroke="#6366f1" stroke-width="0.6" />
        </template>
        <!-- ════════════════════ END FALLBACK TERRAIN ════════════════════ -->

        <!-- ── Drone patrol ellipses ── -->
        <ellipse cx="22" cy="28" rx="14" ry="10" fill="none" stroke="#3b82f677" stroke-width="0.7" stroke-dasharray="2,1.5" />
        <ellipse cx="46" cy="17" rx="10" ry="8"  fill="none" stroke="#06b6d477" stroke-width="0.7" stroke-dasharray="2,1.5" />
        <ellipse cx="62" cy="54" rx="12" ry="9"  fill="none" stroke="#3b82f655" stroke-width="0.7" stroke-dasharray="2,1.5" />

        <!-- ── Emergency evacuation route ── -->
        <path d="M 22,31 Q 18,50 14,62 Q 10,70 10,76"
          fill="none" stroke="#ef444488" stroke-width="1.3" stroke-dasharray="2.5,1.5" />
        <text x="5" y="55" font-size="1.9" fill="#ef444477" transform="rotate(-68,8,56)">EVAC</text>

        <!-- ── Fuel storage pulsing risk ring ── -->
        <rect x="55.5" y="18.5" width="13" height="13" rx="1.5"
          fill="#ef444411" stroke="#ef4444" stroke-width="0.8" stroke-dasharray="1.5,1"
          style="animation: blink 2s infinite" />

        <!-- ── Slope crack indicator on Z2 north edge ── -->
        <line x1="37" y1="13.5" x2="53" y2="13.5" stroke="#f59e0b" stroke-width="1.4" stroke-linecap="round" />
        <line x1="39" y1="13.5" x2="39" y2="15"   stroke="#f59e0b" stroke-width="0.7" />
        <line x1="43" y1="13.5" x2="43" y2="15"   stroke="#f59e0b" stroke-width="0.7" />
        <line x1="47" y1="13.5" x2="47" y2="15"   stroke="#f59e0b" stroke-width="0.7" />
        <line x1="51" y1="13.5" x2="51" y2="15"   stroke="#f59e0b" stroke-width="0.7" />

        <!-- ── Zone rectangles ── -->
        <template v-for="zone in mineZones" :key="zone.id">
          <rect
            :x="zone.x" :y="zone.y" :width="zone.w" :height="zone.h"
            rx="1.5"
            :fill="zoneColor(zone)"
            :stroke="zoneBorder(zone)"
            stroke-width="0.6"
            :opacity="zoneOpacity(zone.id)"
            @mouseenter="hoveredZone = zone.id"
            @mouseleave="hoveredZone = null"
            class="zone-rect"
          />
          <!-- Zone ID label with background for readability -->
          <rect
            :x="zone.x + zone.w/2 - 4" :y="zone.y + 0.8"
            width="8" height="4" rx="0.6"
            fill="rgba(11,14,26,0.7)"
            :opacity="zoneOpacity(zone.id)"
          />
          <text
            :x="zone.x + zone.w/2" :y="zone.y + 4"
            text-anchor="middle" font-size="2.2" font-weight="700"
            :fill="zone.riskLevel==='critical'?'#ef4444':zone.riskLevel==='warning'?'#f59e0b':'#94a3b8'"
            :opacity="zoneOpacity(zone.id)"
          >{{ zone.id }}</text>
          <text
            :x="zone.x + zone.w/2" :y="zone.y + zone.h - 2.5"
            text-anchor="middle" font-size="1.8" fill="#64748b"
            :opacity="zoneOpacity(zone.id)"
          >{{ zone.workers > 0 ? `${zone.workers}W` : '' }}</text>
        </template>

        <!-- ── Worker status dots ── -->
        <template v-for="zone in mineZones" :key="'ws_'+zone.id">
          <circle
            v-if="zone.workers > 0"
            :cx="zone.x + zone.w - 3" :cy="zone.y + 3"
            r="2.5"
            :fill="STATUS_COLOR[zoneWorkerStatus(zone.id)] || '#94a3b8'"
            opacity="0.9"
            :opacity="zoneOpacity(zone.id)"
            :style="zoneWorkerStatus(zone.id) !== 'normal' ? 'animation: blink 1.5s infinite' : ''"
          />
        </template>

        <!-- ── Gas sensor dots ── -->
        <template v-for="s in sensorDots" :key="s.id">
          <circle :cx="s.x" :cy="s.y" r="3"   :fill="STATUS_COLOR[s.status]" opacity="0.12" />
          <circle :cx="s.x" :cy="s.y" r="1.8" :fill="STATUS_COLOR[s.status]" opacity="0.9" />
        </template>

        <!-- ── Live data labels ── -->
        <template v-for="lb in liveLabels" :key="lb.label">
          <rect
            :x="lb.x" :y="lb.y - 3.2"
            :width="lb.w" height="4.2" rx="0.9"
            :fill="STATUS_COLOR[lb.status] + '22'"
            :stroke="STATUS_COLOR[lb.status] + '66'"
            stroke-width="0.35"
          />
          <text
            :x="lb.x + lb.w / 2" :y="lb.y"
            text-anchor="middle" font-size="1.85" font-weight="600"
            :fill="STATUS_COLOR[lb.status]"
          >{{ lb.label }}</text>
        </template>

        <!-- ── Drone markers ── -->
        <template v-for="d in dronePositions" :key="d.id">
          <circle :cx="d.x" :cy="d.y" r="2.5"
            :fill="d.active ? '#3b82f6' : '#334155'" opacity="0.9" />
          <circle :cx="d.x" :cy="d.y" r="4.2"
            fill="#3b82f6" opacity="0.18"
            :style="d.active ? 'animation: blink 2s infinite' : ''" />
          <text :x="d.x" :y="d.y - 4"
            text-anchor="middle" font-size="1.75" fill="#3b82f6" font-weight="500">{{ d.name }}</text>
        </template>

        <!-- ── Monitoring points ── -->
        <circle cx="84" cy="64" r="3"   fill="#f59e0b18" stroke="#f59e0b" stroke-width="0.7" />
        <text   x="84"  y="65.2" text-anchor="middle" font-size="2" fill="#f59e0b">T</text>
        <circle cx="92" cy="42" r="2.5" fill="#06b6d418" stroke="#06b6d4" stroke-width="0.7" />
        <text   x="92"  y="43.2" text-anchor="middle" font-size="2" fill="#06b6d4">W</text>

        <!-- ── Biodiversity / sustainability zone ── -->
        <rect x="78" y="6" width="16" height="16" rx="1"
          fill="#10b98115" stroke="#10b981" stroke-width="0.6" stroke-dasharray="2,1" />
        <text x="86" y="12" text-anchor="middle" font-size="2.2" fill="#10b981">🌿</text>
        <text x="86" y="15.5" text-anchor="middle" font-size="1.7" fill="#10b98188">BIO</text>

        <!-- ── Critical hazard marker (Z8 fuel storage) ── -->
        <text x="62" y="27" text-anchor="middle" font-size="3" fill="#ef4444">⚠</text>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- SCENARIO HIGHLIGHT — active alert zone focus effect             -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <template v-if="highlightedZone">
          <template v-for="zone in mineZones.filter(z => z.id === highlightedZone)" :key="'hl'+zone.id">
            <!-- outer glow -->
            <rect
              :x="zone.x - 4" :y="zone.y - 4"
              :width="zone.w + 8" :height="zone.h + 8"
              rx="3.5" fill="#ef444410" stroke="#ef444430" stroke-width="1"
            />
            <!-- pulsing border -->
            <rect
              :x="zone.x - 1.5" :y="zone.y - 1.5"
              :width="zone.w + 3" :height="zone.h + 3"
              rx="2.5" fill="none" stroke="#ef4444" stroke-width="1.4"
              style="animation: blink 0.7s infinite"
            />
          </template>
        </template>

        <!-- ── Tooltip on hover ── -->
        <template v-if="hoveredZone">
          <template v-for="zone in mineZones.filter(z => z.id === hoveredZone)" :key="'tt'+zone.id">
            <rect
              :x="Math.min(zone.x + zone.w/2 - 18, 62)"
              :y="zone.y + zone.h + 1"
              width="36" height="14" rx="2"
              fill="#1a2444" stroke="#253060" stroke-width="0.5"
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
        <text  x="7"  y="89"  text-anchor="middle" font-size="1.8" fill="#334155">500m</text>

      </svg><!-- end SVG -->

      <!-- ── Map stats overlay ── -->
      <div class="map-stats">
        <div class="map-stat">
          <span class="ms-value">{{ mineZones.filter(z=>z.riskLevel==='critical').length }}</span>
          <span class="ms-label crit">Critical</span>
        </div>
        <div class="map-stat">
          <span class="ms-value">{{ mineZones.filter(z=>z.riskLevel==='warning').length }}</span>
          <span class="ms-label warn">Warning</span>
        </div>
        <div class="map-stat">
          <span class="ms-value">{{ drones.filter(d=>d.status==='active').length }}</span>
          <span class="ms-label info">Drones</span>
        </div>
        <div class="map-stat">
          <span class="ms-value">{{ workers.filter(w=>w.status!=='normal').length }}</span>
          <span class="ms-label warn">At Risk</span>
        </div>
      </div>

    </div><!-- end map-body -->
  </div>
</template>

<style scoped>
.mine-map-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.map-header { flex-shrink: 0; }

.map-legend {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.68rem;
  color: var(--text-muted);
  flex-wrap: wrap;
}
.legend-item  { display: flex; align-items: center; gap: 3px; }
.legend-dot   { width: 7px; height: 7px; border-radius: 50%; }
.legend-dot.normal   { background: var(--status-ok); }
.legend-dot.warning  { background: var(--status-warn); }
.legend-dot.critical { background: var(--status-crit); }
.legend-icon  { font-size: 0.75rem; }
.legend-sep   { color: var(--border-card); }
.img-badge {
  font-size: 0.62rem;
  color: var(--accent-cyan);
  background: rgba(6,182,212,0.1);
  border: 1px solid rgba(6,182,212,0.25);
  padding: 1px 6px;
  border-radius: 10px;
}

/* ── Map body: stacking context for image + SVG layers ── */
.map-body {
  position: relative;
  flex: 1;
  padding: 8px;
  min-height: 320px;
}

/* Hidden preload image — just used for load/error detection */
.map-preload {
  display: none;
}

/* Image layer fills the inner padding box */
.map-img-layer {
  position: absolute;
  inset: 8px;
  background-size: cover;
  background-position: center top;
  border-radius: var(--radius-md);
}

/* Dark gradient overlay so labels/zones are readable */
.map-img-overlay {
  position: absolute;
  inset: 8px;
  border-radius: var(--radius-md);
  background: linear-gradient(
    160deg,
    rgba(11,14,26,0.30) 0%,
    rgba(11,14,26,0.45) 50%,
    rgba(11,14,26,0.62) 100%
  );
}

/* SVG on top of everything */
.mine-svg {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: block;
  border-radius: var(--radius-md);
  background: #0b0e1a;
}
/* Transparent background when image is active */
.mine-svg.has-image {
  background: transparent;
}

.zone-rect {
  cursor: pointer;
  transition: opacity 0.2s;
}
.zone-rect:hover { opacity: 1 !important; }

/* Stats overlay — bottom right */
.map-stats {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(11,14,26,0.88);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  display: flex;
  gap: 14px;
  backdrop-filter: blur(6px);
}
.map-stat   { text-align: center; }
.ms-value   { display:block; font-size:1.1rem; font-weight:700; font-family:var(--font-mono); color:var(--text-primary); }
.ms-label   { display:block; font-size:0.6rem; font-weight:600; text-transform:uppercase; }
.ms-label.crit { color: var(--status-crit); }
.ms-label.warn { color: var(--status-warn); }
.ms-label.info { color: var(--status-info); }
</style>
