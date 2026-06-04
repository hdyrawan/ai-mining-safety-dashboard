<script setup>
import { ref } from 'vue'
import { mineZones, environmentalIncidents, sustainabilityMetrics } from '../data/mockData.js'

const hoveredZone = ref(null)

const envZones = [
  { id:'EZ1', label:'Air Quality', x:52, y:46, r:12, color:'#f59e0b', opacity:0.20, status:'warning' },
  { id:'EZ2', label:'Tailings Risk', x:84, y:62, r:8,  color:'#f59e0b', opacity:0.20, status:'warning' },
  { id:'EZ3', label:'Biodiversity', x:86, y:14, r:10, color:'#10b981', opacity:0.18, status:'protected' },
  { id:'EZ4', label:'Water Zone', x:92, y:42, r:6,  color:'#06b6d4', opacity:0.22, status:'normal' },
  { id:'EZ5', label:'Rehab Zone', x:45, y:78, r:9,  color:'#22c55e', opacity:0.18, status:'active' },
]

const waterPoints = [
  { x:92, y:38, label:'WP-1' }, { x:78, y:42, label:'WP-2' }, { x:30, y:72, label:'WP-3' },
]
const airPoints = [
  { x:62, y:54, label:'AQ-1', status:'warning' }, { x:20, y:28, label:'AQ-2', status:'normal' },
  { x:40, y:58, label:'AQ-3', status:'normal' },
]
</script>

<template>
  <div class="env-map-container card">
    <div class="card-header">
      <span class="card-title">🌍 Environmental Risk Map</span>
      <div class="env-legend">
        <span class="env-leg-item"><span class="env-dot" style="background:#f59e0b"></span>Risk Zone</span>
        <span class="env-leg-item"><span class="env-dot" style="background:#10b981"></span>Protected</span>
        <span class="env-leg-item"><span class="env-dot" style="background:#06b6d4"></span>Water</span>
        <span class="env-leg-item"><span class="env-dot" style="background:#22c55e"></span>Rehab</span>
      </div>
    </div>
    <div class="env-map-body card-body">
      <svg viewBox="0 0 100 90" preserveAspectRatio="xMidYMid meet" class="env-svg">
        <rect width="100" height="90" fill="#0b0e1a" />

        <!-- Mine zone outlines -->
        <template v-for="zone in mineZones" :key="zone.id">
          <rect :x="zone.x" :y="zone.y" :width="zone.w" :height="zone.h" rx="1"
            fill="none" stroke="#1e2740" stroke-width="0.5" />
          <text :x="zone.x + zone.w/2" :y="zone.y + zone.h/2 + 1"
            text-anchor="middle" font-size="2" fill="#334155">{{ zone.id }}</text>
        </template>

        <!-- Environmental zones (circles) -->
        <template v-for="ez in envZones" :key="ez.id">
          <circle :cx="ez.x" :cy="ez.y" :r="ez.r"
            :fill="ez.color" :fill-opacity="ez.opacity"
            :stroke="ez.color" stroke-width="0.7" stroke-dasharray="2,1"
            @mouseenter="hoveredZone = ez.id"
            @mouseleave="hoveredZone = null"
            style="cursor: pointer;"
          />
          <text :x="ez.x" :y="ez.y + ez.r + 3"
            text-anchor="middle" font-size="2.2"
            :fill="ez.color">{{ ez.label }}</text>
        </template>

        <!-- Water monitoring points -->
        <template v-for="wp in waterPoints" :key="wp.label">
          <circle :cx="wp.x" :cy="wp.y" r="2" fill="#06b6d4" opacity="0.9" />
          <text :x="wp.x" :y="wp.y - 2.5" text-anchor="middle" font-size="1.8" fill="#06b6d4">{{ wp.label }}</text>
        </template>

        <!-- Air quality monitoring points -->
        <template v-for="ap in airPoints" :key="ap.label">
          <circle :cx="ap.x" :cy="ap.y" r="2" :fill="ap.status === 'warning' ? '#f59e0b' : '#22c55e'" opacity="0.9" />
          <text :x="ap.x" :y="ap.y - 2.5" text-anchor="middle" font-size="1.8"
            :fill="ap.status === 'warning' ? '#f59e0b' : '#22c55e'">{{ ap.label }}</text>
        </template>

        <!-- Carbon emission cloud indicator -->
        <ellipse cx="62" cy="46" rx="16" ry="10" fill="#f59e0b" fill-opacity="0.06" stroke="#f59e0b" stroke-width="0.4" stroke-dasharray="3,2" />
        <text x="62" y="44" text-anchor="middle" font-size="2" fill="#f59e0b88">CO₂ zone</text>

        <!-- Tooltip -->
        <template v-if="hoveredZone">
          <template v-for="ez in envZones.filter(e=>e.id===hoveredZone)" :key="'tip_'+ez.id">
            <rect :x="Math.min(ez.x + ez.r + 2, 65)" :y="ez.y - 6" width="26" height="10" rx="2" fill="#1e2840" stroke="#253050" stroke-width="0.5" />
            <text :x="Math.min(ez.x + ez.r + 2, 65) + 13" :y="ez.y" text-anchor="middle" font-size="2.2" fill="#e2e8f0">{{ ez.label }}</text>
            <text :x="Math.min(ez.x + ez.r + 2, 65) + 13" :y="ez.y + 4" text-anchor="middle" font-size="1.8" :fill="ez.color">{{ ez.status.toUpperCase() }}</text>
          </template>
        </template>
      </svg>

      <!-- Environmental metrics sidebar -->
      <div class="env-metrics">
        <div class="env-metric-item">
          <span class="em-icon">💨</span>
          <div>
            <div class="em-label">Carbon Intensity</div>
            <div class="em-val warn">{{ sustainabilityMetrics.carbonIntensity.value }} kg CO₂e/t</div>
          </div>
        </div>
        <div class="env-metric-item">
          <span class="em-icon">💧</span>
          <div>
            <div class="em-label">Water Recycling</div>
            <div class="em-val warn">{{ sustainabilityMetrics.waterRecycling.value }}%</div>
          </div>
        </div>
        <div class="env-metric-item">
          <span class="em-icon">🌫️</span>
          <div>
            <div class="em-label">Dust Index</div>
            <div class="em-val warn">{{ sustainabilityMetrics.dustExposure.value }} μg/m³</div>
          </div>
        </div>
        <div class="env-metric-item">
          <span class="em-icon">🏔️</span>
          <div>
            <div class="em-label">Tailings Risk</div>
            <div class="em-val ok">{{ sustainabilityMetrics.tailingsRisk.value }}/100 (Low)</div>
          </div>
        </div>
        <div class="env-metric-item">
          <span class="em-icon">🌿</span>
          <div>
            <div class="em-label">Biodiversity Risk</div>
            <div class="em-val warn">{{ sustainabilityMetrics.biodiversityRisk.value }}/100 (Moderate)</div>
          </div>
        </div>
        <div class="env-metric-item">
          <span class="em-icon">🌱</span>
          <div>
            <div class="em-label">Rehab Progress</div>
            <div class="em-val ok">{{ sustainabilityMetrics.landRehabilitation.value }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.env-map-container { overflow: hidden; }
.env-legend { display: flex; gap: 10px; flex-wrap: wrap; }
.env-leg-item { display: flex; align-items: center; gap: 4px; font-size: 0.68rem; color: var(--text-muted); }
.env-dot { width: 8px; height: 8px; border-radius: 50%; }

.env-map-body { display: grid; grid-template-columns: 1fr 200px; gap: 12px; padding: 12px; }
.env-svg { width: 100%; border-radius: var(--radius-md); background: #0b0e1a; }

.env-metrics { display: flex; flex-direction: column; gap: 8px; }
.env-metric-item { display: flex; align-items: flex-start; gap: 8px; }
.em-icon { font-size: 1rem; flex-shrink: 0; }
.em-label { font-size: 0.68rem; color: var(--text-muted); }
.em-val { font-size: 0.78rem; font-weight: 600; font-family: var(--font-mono); }
.em-val.ok   { color: var(--status-ok); }
.em-val.warn { color: var(--status-warn); }
.em-val.crit { color: var(--status-crit); }

@media (max-width: 900px) {
  .env-map-body { grid-template-columns: 1fr; }
}
</style>
