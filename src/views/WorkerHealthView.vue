<script setup>
import { computed } from 'vue'
import { workers, trendData } from '../data/mockData.js'
import WorkerHealthTable from '../components/WorkerHealthTable.vue'
import TrendChart from '../components/TrendChart.vue'
import KpiCard from '../components/KpiCard.vue'

const critWorkers = computed(() => workers.filter(w => w.status === 'critical'))
const warnWorkers = computed(() => workers.filter(w => w.status === 'warning'))
const totalWorkers = workers.length
const highFatigue  = computed(() => workers.filter(w => w.fatigueScore >= 60).length)
const notCompliant = computed(() => workers.filter(w => !w.ppeCompliant).length)
const fallAlerts   = computed(() => workers.filter(w => w.fallDetected).length)

const kpis = computed(() => [
  { title:'Total Monitored',  value:totalWorkers,          icon:'👷', status:'normal',   change:'All shifts combined' },
  { title:'Critical Status',  value:critWorkers.value.length, icon:'🚨', status: critWorkers.value.length > 0 ? 'critical' : 'normal', change:'Immediate attention' },
  { title:'Warning Status',   value:warnWorkers.value.length, icon:'⚠️', status: warnWorkers.value.length > 0 ? 'warning' : 'normal', change:'Monitor closely' },
  { title:'High Fatigue',     value:highFatigue.value,     icon:'⚡', status: highFatigue.value > 3 ? 'warning' : 'normal', change:'Score ≥ 60/100' },
  { title:'PPE Non-Compliant',value:notCompliant.value,    icon:'⛑️', status: notCompliant.value > 0 ? 'warning' : 'normal', change:'Missing PPE detected' },
  { title:'Fall Alerts',      value:fallAlerts.value,      icon:'🏃', status: fallAlerts.value > 0 ? 'critical' : 'normal', change:'Active fall events' },
  { title:'Avg Heart Rate',   value:Math.round(workers.reduce((a,w)=>a+w.heartRate,0)/workers.length), icon:'❤️', status:'normal', unit:'bpm', change:'All active workers' },
  { title:'Avg Fatigue Score',value:Math.round(workers.reduce((a,w)=>a+w.fatigueScore,0)/workers.length), icon:'😴', status: Math.round(workers.reduce((a,w)=>a+w.fatigueScore,0)/workers.length) > 45 ? 'warning' : 'normal', change:'Shift average' },
])

const heatStressRecs = [
  '4 workers in Zone C show combined heat stress indicators — rotate to cool rest zone immediately',
  'Ambient temperature 34.2°C in Processing Zone — mandatory hydration breaks every 45 minutes',
  'Adjust shift rotation in Underground Zone C to max 4-hour continuous work',
  'Deploy heat stress monitors at Zone B2 entry checkpoint — current PPE does not include cooling vests',
]
</script>

<template>
  <div>
    <div>
      <h1 class="page-title">❤️ Worker Health Monitor</h1>
      <p class="page-subtitle" style="margin-bottom:16px">{{ totalWorkers }} workers monitored · Wearable health tracking · AI fatigue prediction</p>
    </div>

    <!-- Critical workers banner -->
    <div v-if="critWorkers.length" class="critical-workers-banner" style="margin-bottom:14px">
      <span class="cw-title">🚨 CRITICAL HEALTH ALERTS</span>
      <div class="cw-list">
        <div v-for="w in critWorkers" :key="w.id" class="cw-item">
          <strong>{{ w.name }}</strong>
          <span>({{ w.zone }})</span>
          <span v-if="w.fallDetected" class="tag tag-crit">FALL DETECTED</span>
          <span v-if="w.fatigueScore >= 70" class="tag tag-crit">HIGH FATIGUE {{ w.fatigueScore }}/100</span>
          <span v-if="w.temperature > 38" class="tag tag-crit">FEVER {{ w.temperature }}°C</span>
          <span v-if="w.spo2 < 95" class="tag tag-crit">LOW SpO₂ {{ w.spo2 }}%</span>
        </div>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="kpi-grid-8" style="margin-bottom:16px">
      <KpiCard v-for="(k,i) in kpis" :key="i" :title="k.title" :value="k.value" :icon="k.icon" :status="k.status" :change="k.change" :unit="k.unit" compact />
    </div>

    <!-- Worker Health Table -->
    <div style="margin-bottom:16px">
      <WorkerHealthTable :workers="workers" />
    </div>

    <!-- Charts row -->
    <div class="grid-2" style="margin-bottom:16px">
      <TrendChart
        title="Worker Health Trends — Today"
        :labels="trendData.workerHealth.labels"
        :series="trendData.workerHealth.series"
        :height="200"
        type="line"
      />
      <div class="card">
        <div class="card-header"><span class="card-title">🌡️ Heat Stress Risk — AI Recommendations</span></div>
        <div class="card-body rec-list">
          <div v-for="(r, i) in heatStressRecs" :key="i" class="rec-item">
            <span class="rec-num">{{ i+1 }}</span>
            <span>{{ r }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Rescue recommendation panel -->
    <div class="card rescue-panel">
      <div class="card-header"><span class="card-title">🚑 Rescue & Emergency Response</span></div>
      <div class="card-body">
        <div class="rescue-grid">
          <div class="rescue-item active">
            <div class="ri-icon">🏃</div>
            <div class="ri-label">Fall / Immobility Alert</div>
            <div class="ri-val">W010 — Zone 5</div>
            <div class="ri-action">Rescue dispatched · ETA 4 min</div>
          </div>
          <div class="rescue-item">
            <div class="ri-icon">💗</div>
            <div class="ri-label">Panic Button Protocol</div>
            <div class="ri-val">None active</div>
            <div class="ri-action">All teams standby</div>
          </div>
          <div class="rescue-item">
            <div class="ri-icon">🌡️</div>
            <div class="ri-label">Heat Stress Protocol</div>
            <div class="ri-val">W004 — High Risk</div>
            <div class="ri-action">Supervisor notified · Cool zone ready</div>
          </div>
          <div class="rescue-item">
            <div class="ri-icon">🏥</div>
            <div class="ri-label">Medical Station</div>
            <div class="ri-val">Zone 7 Admin · Staffed</div>
            <div class="ri-action">Paramedic on standby</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-grid-8 { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }

.critical-workers-banner {
  background: var(--status-crit-bg);
  border: 1px solid var(--status-crit-border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  animation: blink 3s infinite;
}
.cw-title { font-size:0.8rem; font-weight:700; color:var(--status-crit); letter-spacing:0.05em; display:block; margin-bottom:6px; }
.cw-list { display:flex; flex-direction:column; gap:5px; }
.cw-item { display:flex; align-items:center; gap:8px; font-size:0.78rem; color:var(--text-primary); }

.rec-list { display:flex; flex-direction:column; gap:8px; }
.rec-item { display:flex; align-items:flex-start; gap:8px; font-size:0.75rem; color:var(--text-secondary); }
.rec-num {
  background:var(--status-warn); color:white; font-size:0.62rem; font-weight:700;
  width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center;
  flex-shrink:0; margin-top:1px;
}

.rescue-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.rescue-item { background:var(--bg-secondary); border-radius:var(--radius-md); padding:14px; border-left:3px solid var(--border-card); }
.rescue-item.active { border-left-color:var(--status-crit); animation:blink 2s infinite; }
.ri-icon { font-size:1.4rem; margin-bottom:4px; }
.ri-label { font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em; }
.ri-val { font-size:0.85rem; font-weight:700; color:var(--text-primary); margin:3px 0; }
.ri-action { font-size:0.72rem; color:var(--accent-blue); }

@media(max-width:900px){ .kpi-grid-8 { grid-template-columns:repeat(2,1fr); } }
@media(max-width:600px){
  .kpi-grid-8 { grid-template-columns:repeat(2,1fr); gap:8px; }
  .rescue-grid { grid-template-columns:1fr; }
  .critical-workers-banner .cw-item { flex-wrap:wrap; }
}
</style>
