<script setup>
import { ref, computed } from 'vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  workers: { type: Array, required: true }
})

const sortKey = ref('status')
const sortDir = ref(-1)
const filterZone = ref('all')
const filterStatus = ref('all')

const sorted = computed(() => {
  let list = [...props.workers]
  if (filterZone.value !== 'all') list = list.filter(w => w.zone === filterZone.value)
  if (filterStatus.value !== 'all') list = list.filter(w => w.status === filterStatus.value)
  list.sort((a, b) => {
    const statusOrder = { critical: 0, warning: 1, normal: 2 }
    if (sortKey.value === 'status') return (statusOrder[a.status] - statusOrder[b.status]) * sortDir.value
    const va = a[sortKey.value], vb = b[sortKey.value]
    return (va < vb ? -1 : va > vb ? 1 : 0) * sortDir.value
  })
  return list
})

const zones = computed(() => ['all', ...new Set(props.workers.map(w => w.zone))])

function sort(key) {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = -1 }
}
function fatigueColor(score) {
  if (score >= 70) return 'var(--status-crit)'
  if (score >= 50) return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function vitalsColor(v, warnLow, warnHigh) {
  if (v >= warnHigh || v <= warnLow) return 'var(--status-crit)'
  return 'var(--text-primary)'
}
</script>

<template>
  <div class="worker-table-container card">
    <div class="wt-header card-header">
      <span class="card-title">👷 Worker Health Monitor — {{ sorted.length }} / {{ workers.length }} Workers</span>
      <div class="wt-filters">
        <select v-model="filterZone" class="filter-select">
          <option v-for="z in zones" :key="z" :value="z">{{ z === 'all' ? 'All Zones' : z }}</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="all">All Status</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="normal">Normal</option>
        </select>
      </div>
    </div>
    <div class="wt-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sort('name')"   style="cursor:pointer">Worker ↕</th>
            <th>Zone</th>
            <th @click="sort('status')" style="cursor:pointer">Status ↕</th>
            <th @click="sort('heartRate')" style="cursor:pointer">HR ↕</th>
            <th>Temp</th>
            <th>SpO₂</th>
            <th @click="sort('fatigueScore')" style="cursor:pointer">Fatigue ↕</th>
            <th>PPE</th>
            <th>Alerts</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="w in sorted" :key="w.id" :class="{ 'row-critical': w.status==='critical', 'row-warning': w.status==='warning' }">
            <td>
              <div class="worker-name">
                <span class="worker-id-badge">{{ w.id }}</span>
                {{ w.name }}
              </div>
            </td>
            <td><span class="zone-chip">{{ w.zone }}</span></td>
            <td><StatusBadge :status="w.status" /></td>
            <td>
              <span class="vital" :style="{ color: vitalsColor(w.heartRate, 50, 100) }">
                {{ w.heartRate }} <span class="vital-unit">bpm</span>
              </span>
            </td>
            <td>
              <span class="vital" :style="{ color: vitalsColor(w.temperature, 35.5, 37.8) }">
                {{ w.temperature }}°
              </span>
            </td>
            <td>
              <span class="vital" :style="{ color: vitalsColor(w.spo2, 95, 100) }">
                {{ w.spo2 }}<span class="vital-unit">%</span>
              </span>
            </td>
            <td>
              <div class="fatigue-cell">
                <span class="fatigue-val" :style="{ color: fatigueColor(w.fatigueScore) }">{{ w.fatigueScore }}</span>
                <div class="progress-bar" style="width:50px; display:inline-flex; margin-left:5px">
                  <div class="progress-fill" :style="{ width: w.fatigueScore+'%', background: fatigueColor(w.fatigueScore) }"></div>
                </div>
              </div>
            </td>
            <td>
              <span v-if="w.ppeCompliant" class="tag tag-ok">✓ OK</span>
              <span v-else class="tag tag-crit">✗ Missing</span>
            </td>
            <td>
              <div class="alert-chips">
                <span v-if="w.fallDetected" class="tag tag-crit">Fall</span>
                <span v-if="w.immobile"     class="tag tag-warn">Immobile</span>
                <span v-if="w.panicButton"  class="tag tag-crit">Panic</span>
                <span v-if="!w.fallDetected && !w.immobile && !w.panicButton" class="tag tag-muted">None</span>
              </div>
            </td>
            <td style="color:var(--text-muted); font-size:0.7rem; font-family:var(--font-mono)">{{ w.lastUpdate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.worker-table-container { overflow: hidden; }
.wt-header { flex-wrap: wrap; gap: 8px; }
.wt-filters { display: flex; gap: 8px; }
.filter-select {
  background: var(--bg-input);
  border: 1px solid var(--border-card);
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-family: var(--font-sans);
  outline: none;
}
.wt-scroll { overflow-x: auto; max-height: 440px; overflow-y: auto; }
.row-critical td { background: rgba(239,68,68,0.04); }
.row-warning  td { background: rgba(245,158,11,0.03); }

.worker-name { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; white-space: nowrap; }
.worker-id-badge {
  font-size: 0.6rem;
  font-family: var(--font-mono);
  background: var(--bg-secondary);
  color: var(--text-muted);
  padding: 1px 5px;
  border-radius: 3px;
}
.zone-chip {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  background: rgba(6,182,212,0.08);
  color: var(--accent-cyan);
  padding: 1px 6px;
  border-radius: 4px;
}
.vital { font-family: var(--font-mono); font-size: 0.82rem; font-weight: 600; }
.vital-unit { font-size: 0.65rem; color: var(--text-muted); font-weight: 400; }
.fatigue-cell { display: flex; align-items: center; }
.fatigue-val { font-family: var(--font-mono); font-size: 0.82rem; font-weight: 600; min-width: 24px; }
.alert-chips { display: flex; gap: 3px; flex-wrap: nowrap; }
</style>
