<script setup>
import StatusBadge from './StatusBadge.vue'

defineProps({ equipment: { type: Object, required: true } })

const typeIcons = {
  excavator: '🏗️', haul_truck: '🚛', dozer: '🚜', drill_rig: '⛏️',
  crane: '🏗️', lhd: '🚜'
}
function tempColor(t) {
  if (t >= 100) return 'var(--status-crit)'
  if (t >= 85) return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function fuelColor(f) {
  if (f <= 20) return 'var(--status-crit)'
  if (f <= 40) return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function maintColor(h) {
  if (h <= 20) return 'var(--status-crit)'
  if (h <= 100) return 'var(--status-warn)'
  return 'var(--status-ok)'
}
</script>

<template>
  <div :class="['eq-card card', `eq-${equipment.status}`, { 'eq-prox': equipment.proximityRisk }]">
    <div class="eq-header">
      <div class="eq-name-row">
        <span class="eq-type-icon">{{ typeIcons[equipment.type] || '⚙️' }}</span>
        <div>
          <div class="eq-name">{{ equipment.name }}</div>
          <div class="eq-meta">{{ equipment.id }} · Zone {{ equipment.zone }}</div>
        </div>
      </div>
      <StatusBadge :status="equipment.status" />
    </div>

    <div class="eq-metrics">
      <div class="eq-metric">
        <div class="em-label">Fuel</div>
        <div class="em-value" :style="{ color: fuelColor(equipment.fuel) }">{{ equipment.fuel }}%</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: equipment.fuel + '%', background: fuelColor(equipment.fuel) }"></div>
        </div>
      </div>
      <div class="eq-metric">
        <div class="em-label">Engine Temp</div>
        <div class="em-value" :style="{ color: tempColor(equipment.engineTemp) }">{{ equipment.engineTemp }}°C</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: Math.min(100, equipment.engineTemp/1.2) + '%', background: tempColor(equipment.engineTemp) }"></div>
        </div>
      </div>
      <div class="eq-metric">
        <div class="em-label">Maint. Due</div>
        <div class="em-value" :style="{ color: maintColor(equipment.maintenanceDue) }">{{ equipment.maintenanceDue }}h</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: Math.min(100, equipment.maintenanceDue / 6) + '%', background: maintColor(equipment.maintenanceDue) }"></div>
        </div>
      </div>
      <div class="eq-metric">
        <div class="em-label">Operator Fatigue</div>
        <div class="em-value" :style="{ color: equipment.operatorFatigue > 60 ? 'var(--status-crit)' : equipment.operatorFatigue > 40 ? 'var(--status-warn)' : 'var(--status-ok)' }">{{ equipment.operatorFatigue }}%</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: equipment.operatorFatigue + '%', background: equipment.operatorFatigue > 60 ? 'var(--status-crit)' : equipment.operatorFatigue > 40 ? 'var(--status-warn)' : 'var(--status-ok)' }"></div>
        </div>
      </div>
    </div>

    <div class="eq-flags">
      <span v-if="equipment.proximityRisk" class="tag tag-crit">⚠️ Proximity Alert</span>
      <span v-if="equipment.maintenanceDue <= 20" class="tag tag-crit">🔧 Maint. Critical</span>
      <span v-if="equipment.maintenanceDue <= 100 && equipment.maintenanceDue > 20" class="tag tag-warn">🔧 Maint. Due Soon</span>
      <span v-if="equipment.engineTemp >= 100" class="tag tag-crit">🌡️ Overheating</span>
      <span class="eq-runtime">⏱ {{ equipment.runtime }} hrs total</span>
    </div>
  </div>
</template>

<style scoped>
.eq-card { padding: 14px; transition: all var(--transition-base); }
.eq-card:hover { background: var(--bg-card-hover); }
.eq-critical { border-color: var(--status-crit-border); background: var(--status-crit-bg); }
.eq-maintenance { border-color: var(--status-warn-border); }
.eq-prox { border-color: var(--status-crit-border); }

.eq-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
.eq-name-row { display: flex; align-items: flex-start; gap: 8px; }
.eq-type-icon { font-size: 1.4rem; flex-shrink: 0; }
.eq-name { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
.eq-meta { font-size: 0.68rem; color: var(--text-muted); margin-top: 1px; }

.eq-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px; }
.eq-metric {}
.em-label { font-size: 0.62rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }
.em-value { font-size: 1rem; font-weight: 700; font-family: var(--font-mono); margin-bottom: 4px; }

.eq-flags { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
.eq-runtime { font-size: 0.65rem; color: var(--text-muted); margin-left: auto; }
</style>
