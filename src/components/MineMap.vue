<script setup>
import { ref, computed } from 'vue'
import { mineZones, workers, drones } from '../data/mockData.js'
import { store } from '../store/scenarios.js'

const props = defineProps({
  highlightedTargets: { type: Array,  default: () => [] },
  highlightStrength:  { type: String, default: 'none' },  // 'none' | 'light' | 'strong'
})

const IMAGE_SRC   = '/images/mining/e8277fb6-5f8f-4b45-9f35-7d3461755316.png'
const imageLoaded = ref(false)
const imageFailed = ref(false)
const mapMode     = ref('image')   // 'image' | 'schematic'

const showImage = computed(
  () => mapMode.value === 'image' && imageLoaded.value && !imageFailed.value
)

// ── Tooltip ───────────────────────────────────────────────────────────────────
const hoveredObj = ref(null)
const tipX       = ref(0)
const tipY       = ref(0)

function onMapMove(e)  { tipX.value = e.clientX + 16; tipY.value = e.clientY + 14 }
function showTip(obj)  { hoveredObj.value = obj }
function hideTip()     { hoveredObj.value = null }

// ── Scenario → highlight ──────────────────────────────────────────────────────
const SCENARIO_MAP = {
  gas_leak:          'fuel-zone-8',
  heat_stress:       'worker-zone-c',
  slope_crack:       'north-slope',
  vehicle_proximity: 'excavator-area',
  sustain_risk:      'bio-rehab-zone',
}

// Map from image-mode IDs to schematic zone IDs (Z1–Z9)
const IMG_TO_SCHEMA = {
  'fuel-zone-8':    'Z8',
  'north-slope':    'Z2',
  'worker-zone-c':  'Z3',
  'processing-plant':'Z4',
  'bio-rehab-zone': 'Z6',
  'excavator-area': 'Z1',
  'muster-point':   'Z7',
}

const hlId = computed(() => SCENARIO_MAP[store.activeScenario] ?? null)

const isHl = id => hlId.value === id

function opOf(id) {
  // Scenario highlight takes priority
  if (hlId.value) return id === hlId.value ? 1 : 0.22

  // Metric card highlight
  if (props.highlightedTargets.length > 0) {
    // For schematic mode the id is a zone ID (Z1–Z9); map image targets to schema IDs
    const targets = props.highlightedTargets
    const schemaTargets = targets.map(t => IMG_TO_SCHEMA[t] || t)
    const allTargets = [...new Set([...targets, ...schemaTargets])]
    if (allTargets.includes(id)) return 1
    return props.highlightStrength === 'strong' ? 0.14 : 0.28
  }

  return 1
}

// ── Status colours ────────────────────────────────────────────────────────────
const SC = { normal:'#22c55e', warning:'#f59e0b', critical:'#ef4444', info:'#3b82f6' }
const sc  = s => SC[s] || '#94a3b8'

// ── Map objects — data-driven, percentage coords (viewBox 0 0 100 100) ────────
const mapObjects = [
  // ── Risk zones (rectangles) ──────────────────────────────────────────────
  {
    id: 'fuel-zone-8', type: 'zone',
    label: 'Fuel Z8', name: 'Fuel Storage Zone 8',
    x: 54, y: 17, w: 13, h: 11, status: 'critical',
    reading: 'CH₄ 8.4 ppm', confidence: 89,
    action: 'Evacuate and increase ventilation',
  },
  {
    id: 'north-slope', type: 'zone',
    label: 'North Slope', name: 'North Slope Face',
    x: 22, y: 12, w: 20, h: 14, status: 'warning',
    reading: 'Slope +2.3 cm', confidence: 84,
    action: 'Restrict access, deploy monitoring',
  },
  {
    id: 'worker-zone-c', type: 'zone',
    label: 'Worker Zone', name: 'Worker Zone C',
    x: 29, y: 51, w: 18, h: 12, status: 'warning',
    reading: 'HR 128 bpm', confidence: 82,
    action: 'Rotate shifts, provide hydration',
  },
  {
    id: 'processing-plant', type: 'zone',
    label: 'Processing', name: 'Processing Plant',
    x: 54, y: 46, w: 18, h: 14, status: 'normal',
    reading: 'PM₂.₅ 58 μg/m³', confidence: 95,
    action: 'Monitor dust levels',
  },
  {
    id: 'bio-rehab-zone', type: 'zone',
    label: 'Bio Rehab', name: 'Bio Rehab Zone',
    x: 76, y: 6, w: 15, h: 13, status: 'normal',
    reading: 'Veg. index 0.74', confidence: 91,
    action: 'Continue monitoring',
  },
  // ── Equipment marker ─────────────────────────────────────────────────────
  {
    id: 'excavator-area', type: 'equip',
    label: 'EQ08', name: 'Excavator EQ08',
    x: 19, y: 41, status: 'critical',
    reading: 'Eng. temp 103°C', confidence: 99,
    action: 'Halt operations, service immediately',
  },
  // ── Muster point ─────────────────────────────────────────────────────────
  {
    id: 'muster-point', type: 'muster',
    label: 'Muster', name: 'Muster Point',
    x: 10, y: 76, status: 'normal',
    reading: '15 workers checked in', confidence: 100,
    action: 'Evacuation assembly point — all clear',
  },
  // ── Drones ───────────────────────────────────────────────────────────────
  {
    id: 'drone-eagle1', type: 'drone',
    label: 'Eagle-1', name: 'Drone Eagle-1',
    x: 21, y: 28, status: 'normal',
    reading: 'Alt 120m · 14 km/h · Bat 87%', confidence: 92,
    action: 'Zone A perimeter patrol',
  },
  {
    id: 'drone-eagle2', type: 'drone',
    label: 'Eagle-2', name: 'Drone Eagle-2',
    x: 44, y: 17, status: 'warning',
    reading: 'Slope crack detected · Bat 63%', confidence: 84,
    action: 'Inspect north slope face',
  },
]

const zones   = computed(() => mapObjects.filter(o => o.type === 'zone'))
const markers = computed(() => mapObjects.filter(o => o.type !== 'zone'))

// ── Schematic fallback — scale mineZones from viewBox 0-0-100-90 → 0-0-100-100
const sZones = computed(() => mineZones.map(z => ({
  ...z, y: z.y * 100 / 90, h: z.h * 100 / 90,
})))
const SZF = { normal: '#22c55e1a', warning: '#f59e0b1a', critical: '#ef44441a' }
const SZB = { normal: '#22c55e55', warning: '#f59e0baa', critical: '#ef4444cc' }

// ── Stats ─────────────────────────────────────────────────────────────────────
const critCount  = computed(() => mapObjects.filter(o => o.status === 'critical').length)
const warnCount  = computed(() => mapObjects.filter(o => o.status === 'warning').length)
const droneCount = computed(() => drones.filter(d => d.status === 'active').length)
const riskCount  = computed(() => workers.filter(w => w.status !== 'normal').length)
</script>

<template>
  <div class="mine-map-container card">

    <!-- Header -->
    <div class="map-header card-header">
      <span class="card-title">⛏️ Mine Site — Real-Time View</span>
      <div class="header-controls">
        <div class="mode-toggle">
          <button :class="['mode-btn', { active: mapMode === 'image' }]" @click="mapMode = 'image'">
            📸 Image
          </button>
          <button :class="['mode-btn', { active: mapMode === 'schematic' }]" @click="mapMode = 'schematic'">
            🗺 Schematic
          </button>
        </div>
        <div class="map-legend">
          <span class="legend-item"><span class="legend-dot critical"></span>Critical</span>
          <span class="legend-item"><span class="legend-dot warning"></span>Warning</span>
          <span class="legend-item"><span class="legend-dot normal"></span>Normal</span>
        </div>
      </div>
    </div>

    <!-- Map body -->
    <div class="map-body" @mousemove="onMapMove" @mouseleave="hideTip">

      <!-- Image load detector (hidden) -->
      <img class="map-preload" :src="IMAGE_SRC"
           @load="imageLoaded = true" @error="imageFailed = true" />

      <!-- Layer 0: background image -->
      <img v-if="showImage"
           class="map-bg-img" :src="IMAGE_SRC" alt="Mine site aerial" />

      <!-- Layer 1: dark readability veil -->
      <div v-if="showImage" class="map-dark-veil"></div>

      <!-- Layer 2: schematic base (dark bg + terrain) only in schematic mode -->
      <!-- Handled inside SVG below -->

      <!-- Layer 3+: SVG overlay — viewBox 0 0 100 100, preserveAspectRatio none
           so x/y map exactly to % of container at any container size -->
      <svg class="mine-svg"
           viewBox="0 0 100 100"
           preserveAspectRatio="none"
           xmlns="http://www.w3.org/2000/svg">

        <!-- ══════════════════════════════════════════════════════════════════
             SCHEMATIC MODE — abstract mine map on dark background
             ══════════════════════════════════════════════════════════════════ -->
        <template v-if="!showImage">
          <!-- Dark base -->
          <rect width="100" height="100" fill="#0b0e1a"/>

          <!-- Open-pit contour rings (Z1 area) -->
          <ellipse cx="23" cy="28" rx="17" ry="13" fill="none" stroke="#162030" stroke-width="0.5"/>
          <ellipse cx="23" cy="28" rx="11" ry="8"  fill="none" stroke="#1a2840" stroke-width="0.45"/>
          <ellipse cx="23" cy="28" rx="6"  ry="4.5" fill="none" stroke="#1e2e48" stroke-width="0.4"/>
          <ellipse cx="23" cy="28" rx="3"  ry="2.2" fill="#0e1428" stroke="#22344e" stroke-width="0.35"/>

          <!-- Switchback haul road on pit wall -->
          <path d="M 36,22 L 30,27 L 33,30 L 24,35 L 20,32 L 14,37"
                fill="none" stroke="#1e2e48" stroke-width="1.2" stroke-linecap="round"/>

          <!-- Main haul road -->
          <path d="M 8,82 Q 28,75 42,68 Q 58,61 72,66 Q 83,70 92,66"
                fill="none" stroke="#1a2a42" stroke-width="2.2"/>
          <path d="M 8,82 Q 28,75 42,68 Q 58,61 72,66 Q 83,70 92,66"
                fill="none" stroke="#222e48" stroke-width="0.7" stroke-dasharray="3,2"/>

          <!-- Tailings pond near Z5 -->
          <ellipse cx="84" cy="70" rx="5" ry="3.5" fill="#0a1528" stroke="#1a3060" stroke-width="0.5"/>

          <!-- mineZones schematic boxes (y scaled 90→100 viewBox) -->
          <template v-for="zone in sZones" :key="'sz_'+zone.id">
            <rect
              :x="zone.x" :y="zone.y" :width="zone.w" :height="zone.h"
              rx="1.5"
              :fill="SZF[zone.riskLevel]" :stroke="SZB[zone.riskLevel]"
              stroke-width="0.6"
              :opacity="opOf(zone.id)"
              class="zone-rect"
              @mouseenter="showTip({ id: zone.id, name: zone.name, reading: zone.riskLevel + ' risk',
                status: zone.riskLevel, confidence: 'N/A', action: zone.workers + ' workers assigned' })"
              @mouseleave="hideTip()"
            />
            <!-- Zone ID label background -->
            <rect :x="zone.x + zone.w/2 - 4.5" :y="zone.y + 0.8"
                  width="9" height="4.2" rx="0.6" fill="rgba(11,14,26,0.75)"
                  :opacity="opOf(zone.id)"/>
            <text :x="zone.x + zone.w/2" :y="zone.y + 4.1"
                  text-anchor="middle" font-size="2.4" font-weight="700"
                  :fill="sc(zone.riskLevel)" :opacity="opOf(zone.id)">
              {{ zone.id }}
            </text>
            <!-- Worker count bottom -->
            <text v-if="zone.workers > 0"
                  :x="zone.x + zone.w/2" :y="zone.y + zone.h - 1.8"
                  text-anchor="middle" font-size="1.7" fill="#64748b"
                  :opacity="opOf(zone.id)">
              {{ zone.workers }}W
            </text>
            <!-- Critical/warning blink ring -->
            <rect v-if="zone.riskLevel !== 'normal'"
                  :x="zone.x - 1" :y="zone.y - 1"
                  :width="zone.w + 2" :height="zone.h + 2"
                  rx="2" fill="none"
                  :stroke="sc(zone.riskLevel) + '88'" stroke-width="0.7"
                  :style="zone.riskLevel === 'critical' ? 'animation: blink 1.2s infinite' : ''"/>
          </template>

          <!-- Schematic drones -->
          <circle cx="21" cy="28" r="2" fill="#3b82f6" opacity="0.9"/>
          <circle cx="21" cy="28" r="5" fill="none" stroke="#3b82f677" stroke-width="0.6" stroke-dasharray="2,1.5"/>
          <text x="21" y="23.5" text-anchor="middle" font-size="1.8" fill="#3b82f6">Eagle-1</text>

          <circle cx="43" cy="17" r="2" fill="#3b82f6" opacity="0.9"/>
          <circle cx="43" cy="17" r="5" fill="none" stroke="#3b82f677" stroke-width="0.6" stroke-dasharray="2,1.5"/>
          <text x="43" y="12.5" text-anchor="middle" font-size="1.8" fill="#3b82f6">Eagle-2</text>
        </template>
        <!-- ══════════════ END SCHEMATIC ══════════════ -->


        <!-- ══════════════════════════════════════════════════════════════════
             IMAGE MODE — clean overlays on the AI background photo
             ══════════════════════════════════════════════════════════════════ -->
        <template v-if="showImage">

          <!-- ── Risk zones (fill + border only; labels rendered in HTML layer) ── -->
          <template v-for="obj in zones" :key="obj.id">
            <rect
              :x="obj.x" :y="obj.y" :width="obj.w" :height="obj.h"
              rx="1.4"
              :fill="sc(obj.status) + (obj.status === 'critical' ? '28' : obj.status === 'warning' ? '20' : '14')"
              :stroke="sc(obj.status) + (obj.status === 'critical' ? 'dd' : obj.status === 'warning' ? 'bb' : '66')"
              :stroke-width="obj.status !== 'normal' ? 0.85 : 0.55"
              :stroke-dasharray="obj.status === 'normal' ? '2.5,1.5' : 'none'"
              :opacity="opOf(obj.id)"
              class="zone-rect"
              @mouseenter="showTip(obj)"
              @mouseleave="hideTip()"
            />
            <rect v-if="isHl(obj.id)"
              :x="obj.x - 2.5" :y="obj.y - 2.5"
              :width="obj.w + 5" :height="obj.h + 5"
              rx="2.5" fill="none"
              :stroke="sc(obj.status)" stroke-width="1.6"
              style="animation: blink 0.75s infinite"
            />
          </template>

          <!-- ── Equipment markers (labels in HTML layer) ── -->
          <template v-for="obj in markers.filter(o => o.type === 'equip')" :key="obj.id">
            <circle :cx="obj.x" :cy="obj.y" r="5.5"
              :fill="sc(obj.status) + '1a'" :stroke="sc(obj.status) + '55'"
              stroke-width="0.6" :opacity="opOf(obj.id)"
              :style="obj.status === 'critical' ? 'animation: blink 1.3s infinite' : ''"/>
            <circle :cx="obj.x" :cy="obj.y" r="2.5"
              :fill="sc(obj.status)" opacity="0.95" :opacity="opOf(obj.id)"
              class="zone-rect"
              @mouseenter="showTip(obj)" @mouseleave="hideTip()"/>
            <circle v-if="isHl(obj.id)" :cx="obj.x" :cy="obj.y" r="8.5"
              fill="none" :stroke="sc(obj.status)" stroke-width="1.4"
              style="animation: blink 0.75s infinite"/>
          </template>

          <!-- ── Muster point (label in HTML layer) ── -->
          <template v-for="obj in markers.filter(o => o.type === 'muster')" :key="obj.id">
            <polygon
              :points="`${obj.x},${obj.y-4.5} ${obj.x+4},${obj.y} ${obj.x},${obj.y+4.5} ${obj.x-4},${obj.y}`"
              :fill="sc(obj.status) + '2a'" :stroke="sc(obj.status)"
              stroke-width="0.75" :opacity="opOf(obj.id)"
              class="zone-rect"
              @mouseenter="showTip(obj)" @mouseleave="hideTip()"/>
          </template>

          <!-- ── Drone markers (labels in HTML layer) ── -->
          <template v-for="obj in markers.filter(o => o.type === 'drone')" :key="obj.id">
            <circle :cx="obj.x" :cy="obj.y" r="7"
              fill="none" stroke="#3b82f644" stroke-width="0.6"
              stroke-dasharray="2,1.8" :opacity="opOf(obj.id)"/>
            <circle :cx="obj.x" :cy="obj.y" r="2.2"
              fill="#3b82f6" opacity="0.92" :opacity="opOf(obj.id)"
              style="animation: blink 2.4s infinite"
              class="zone-rect"
              @mouseenter="showTip(obj)" @mouseleave="hideTip()"/>
            <circle v-if="obj.status === 'warning'"
              :cx="obj.x + 1.8" :cy="obj.y - 1.8" r="1.1"
              fill="#f59e0b" :opacity="opOf(obj.id)"
              style="animation: blink 1s infinite"/>
            <circle v-if="isHl(obj.id)" :cx="obj.x" :cy="obj.y" r="9.5"
              fill="none" :stroke="sc(obj.status)" stroke-width="1.2"
              style="animation: blink 0.75s infinite"/>
          </template>

          <!-- ── Slope crack indicator — always visible on north slope warning zone ── -->
          <line x1="26" y1="11.5" x2="40" y2="11.5"
                stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round"
                :opacity="store.activeScenario === 'slope_crack' ? 1 : 0.55"/>
          <line x1="28" y1="11.5" x2="28" y2="13.2"
                stroke="#f59e0b" stroke-width="0.7"
                :opacity="store.activeScenario === 'slope_crack' ? 1 : 0.55"/>
          <line x1="33" y1="11.5" x2="33" y2="13.2"
                stroke="#f59e0b" stroke-width="0.7"
                :opacity="store.activeScenario === 'slope_crack' ? 1 : 0.55"/>
          <line x1="38" y1="11.5" x2="38" y2="13.2"
                stroke="#f59e0b" stroke-width="0.7"
                :opacity="store.activeScenario === 'slope_crack' ? 1 : 0.55"/>

          <!-- ── Evacuation route (gas_leak scenario) ── -->
          <path v-if="store.activeScenario === 'gas_leak'"
                d="M 61,28 Q 52,40 40,54 Q 28,64 15,78"
                fill="none" stroke="#ef444488" stroke-width="1.3"
                stroke-dasharray="2.5,1.5"/>
          <text v-if="store.activeScenario === 'gas_leak'"
                x="36" y="47" font-size="1.9" fill="#ef444477"
                transform="rotate(40,36,47)">EVAC</text>

        </template>
        <!-- ══════════════ END IMAGE MODE ══════════════ -->

        <!-- Scale bar (always visible) -->
        <line x1="2" y1="97" x2="13" y2="97" stroke="#334155" stroke-width="0.8"/>
        <text x="7.5" y="99.5" text-anchor="middle" font-size="1.8" fill="#33415577">500m</text>

      </svg>

      <!-- ── HTML label layer (image mode only) ──────────────────────────────
           Sits above SVG (z-index 4). pointer-events:none — hover is on SVG.
           HTML handles text sizing that SVG <rect> cannot do automatically.
      ────────────────────────────────────────────────────────────────────── -->
      <div v-if="showImage" class="map-html-labels">

        <!-- Zone labels: name + status dot + reading pill -->
        <div v-for="obj in zones" :key="'hl_'+obj.id"
             class="zone-lbl"
             :style="{
               left:    obj.x + '%',
               top:     obj.y + '%',
               width:   obj.w + '%',
               height:  obj.h + '%',
               opacity: opOf(obj.id),
             }">
          <!-- Top row: name pill + status dot -->
          <div class="zone-lbl-top">
            <span class="zone-lbl-name" :style="{ color: sc(obj.status) }">{{ obj.label }}</span>
            <span class="zone-status-dot"
                  :class="{ 'dot-pulse': obj.status !== 'normal' }"
                  :style="{ background: sc(obj.status) }"></span>
          </div>
          <!-- Bottom: reading pill -->
          <div class="zone-lbl-reading"
               :style="{
                 color:       sc(obj.status),
                 borderColor: sc(obj.status) + '55',
                 background:  sc(obj.status) + '18',
               }">{{ obj.reading }}</div>
        </div>

        <!-- Marker labels: positioned and centered above/below marker point -->
        <template v-for="obj in markers" :key="'ml_'+obj.id">
          <div class="marker-lbl"
               :class="obj.type === 'muster' ? 'marker-lbl-below' : 'marker-lbl-above'"
               :style="{
                 left:    obj.x + '%',
                 top:     obj.y + '%',
                 opacity: opOf(obj.id),
               }">
            <span class="marker-lbl-text"
                  :style="{ color: obj.type === 'drone' ? '#3b82f6' : sc(obj.status) }">
              {{ obj.label }}
            </span>
          </div>
        </template>

      </div>

      <!-- Stats overlay — bottom right -->
      <div class="map-stats">
        <div class="map-stat">
          <span class="ms-value">{{ critCount }}</span>
          <span class="ms-label crit">Critical</span>
        </div>
        <div class="map-stat">
          <span class="ms-value">{{ warnCount }}</span>
          <span class="ms-label warn">Warning</span>
        </div>
        <div class="map-stat">
          <span class="ms-value">{{ droneCount }}</span>
          <span class="ms-label info">Drones</span>
        </div>
        <div class="map-stat">
          <span class="ms-value">{{ riskCount }}</span>
          <span class="ms-label warn">At Risk</span>
        </div>
      </div>

    </div><!-- /.map-body -->

    <!-- Tooltip — teleported to <body> to escape overflow clipping -->
    <Teleport to="body">
      <div
        v-if="hoveredObj"
        class="mine-map-tooltip"
        :style="{ left: tipX + 'px', top: tipY + 'px' }"
      >
        <div class="tip-name">{{ hoveredObj.name }}</div>
        <div class="tip-rows">
          <div class="tip-row">
            <span class="tip-lbl">Reading</span>
            <span class="tip-val mono">{{ hoveredObj.reading }}</span>
          </div>
          <div class="tip-row">
            <span class="tip-lbl">Status</span>
            <span class="tip-val" :style="{ color: sc(hoveredObj.status) }">
              {{ hoveredObj.status.toUpperCase() }}
            </span>
          </div>
          <div class="tip-row">
            <span class="tip-lbl">Confidence</span>
            <span class="tip-val mono">{{ hoveredObj.confidence }}%</span>
          </div>
        </div>
        <div class="tip-action">{{ hoveredObj.action }}</div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
.mine-map-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.map-header { flex-shrink: 0; }

/* ── Header controls ── */
.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.mode-toggle {
  display: flex;
  gap: 2px;
  background: rgba(11,14,26,0.65);
  border: 1px solid var(--border-card);
  border-radius: 6px;
  padding: 2px;
}
.mode-btn {
  font-size: 0.62rem;
  padding: 2px 9px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.mode-btn.active {
  background: var(--accent-blue);
  color: #fff;
  font-weight: 600;
}
.mode-btn:hover:not(.active) { background: rgba(59,130,246,0.12); }

.map-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.68rem;
  color: var(--text-muted);
}
.legend-item  { display: flex; align-items: center; gap: 3px; }
.legend-dot   { width: 7px; height: 7px; border-radius: 50%; }
.legend-dot.normal   { background: var(--status-ok); }
.legend-dot.warning  { background: var(--status-warn); }
.legend-dot.critical { background: var(--status-crit); }

/* ── Map body: stacking context ── */
.map-body {
  position: relative;
  flex: 1;
  min-height: 520px;
  background: #0b0e1a;
}

.map-preload { display: none; }

/* z-index 0 — background image */
.map-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  z-index: 0;
}

/* z-index 1 — dark readability veil */
.map-dark-veil {
  position: absolute;
  inset: 0;
  background: rgba(3, 8, 20, 0.45);
  z-index: 1;
}

/* z-index 3 — SVG overlay layer (zones z3, markers z4, labels z5 — handled by SVG paint order) */
.mine-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  overflow: visible;
}

.zone-rect {
  cursor: pointer;
  transition: opacity 0.2s;
}
.zone-rect:hover { filter: brightness(1.15); }

/* ── HTML label layer (z-index 4, above SVG) ── */
.map-html-labels {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

/* Zone labels */
.zone-lbl {
  position: absolute;
  box-sizing: border-box;
  padding: 4px 5px 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.zone-lbl-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3px;
}
.zone-lbl-name {
  background: rgba(5, 10, 25, 0.84);
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
  line-height: 1.45;
}
.zone-status-dot {
  width: 7px;
  height: 7px;
  min-width: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-pulse { animation: blink 1.4s infinite; }
.zone-lbl-reading {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 2px 5px;
  font-size: 0.62rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-mono, monospace);
}

/* Marker labels (equip / muster / drone) */
.marker-lbl {
  position: absolute;
  pointer-events: none;
}
.marker-lbl-above { transform: translate(-50%, -200%); }
.marker-lbl-below { transform: translate(-50%, 80%); }
.marker-lbl-text {
  display: block;
  background: rgba(5, 10, 25, 0.84);
  border-radius: 3px;
  padding: 2px 7px;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* z-index 10 — stats panel */
.map-stats {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(11,14,26,0.90);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 7px 12px;
  display: flex;
  gap: 14px;
  backdrop-filter: blur(8px);
  z-index: 10;
}
.map-stat   { text-align: center; }
.ms-value   { display: block; font-size: 1.1rem; font-weight: 700; font-family: var(--font-mono); color: var(--text-primary); }
.ms-label   { display: block; font-size: 0.6rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.ms-label.crit { color: var(--status-crit); }
.ms-label.warn { color: var(--status-warn); }
.ms-label.info { color: var(--status-info); }
</style>

<!-- Global tooltip styles — not scoped, element is teleported to <body> -->
<style>
.mine-map-tooltip {
  position: fixed;
  z-index: 9999;
  min-width: 210px;
  max-width: 270px;
  background: rgba(10, 16, 36, 0.97);
  border: 1px solid rgba(59, 130, 246, 0.28);
  border-radius: 10px;
  padding: 11px 14px 10px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(59,130,246,0.1);
  pointer-events: none;
  backdrop-filter: blur(10px);
  font-family: system-ui, -apple-system, sans-serif;
}
.mine-map-tooltip .tip-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.18);
  white-space: nowrap;
}
.mine-map-tooltip .tip-rows { display: flex; flex-direction: column; gap: 3px; margin-bottom: 8px; }
.mine-map-tooltip .tip-row  { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.mine-map-tooltip .tip-lbl  { font-size: 0.65rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }
.mine-map-tooltip .tip-val  { font-size: 0.72rem; color: #94a3b8; text-align: right; }
.mine-map-tooltip .tip-val.mono { font-family: 'JetBrains Mono', monospace; }
.mine-map-tooltip .tip-action {
  padding-top: 7px;
  border-top: 1px solid rgba(59, 130, 246, 0.14);
  font-size: 0.68rem;
  color: #60a5fa;
  font-style: italic;
  line-height: 1.4;
}
</style>
