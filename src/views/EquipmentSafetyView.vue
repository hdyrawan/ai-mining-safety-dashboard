<script setup>
import { computed } from 'vue'
import { equipment } from '../data/mockData.js'
import EquipmentCard from '../components/EquipmentCard.vue'
import TrendChart from '../components/TrendChart.vue'

const critEq = computed(() => equipment.filter(e => e.status === 'critical'))
const proxRisk = computed(() => equipment.filter(e => e.proximityRisk))
const maintDue = computed(() => equipment.filter(e => e.maintenanceDue <= 100))

const utilizationData = {
  labels: ['CAT 390F','Komatsu HD785','CAT D11','Atlas Drill','Liebherr','Volvo A60H','Sandvik LH517','Hitachi ZX870'],
  series: [
    { name:'Utilisation %', color:'#3b82f6', values:[88,95,0,72,65,0,80,60] },
    { name:'Fuel Level %',  color:'#22c55e', values:[78,62,91,55,84,20,71,45] },
  ]
}

const routeRecs = [
  { zone:'Z1→Z4', risk:'High', desc:'3 workers on main haul road — increase separation to 50m minimum', action:'Redirect haul truck EQ02 via alternate route' },
  { zone:'Z2',    risk:'Medium', desc:'Drill rig proximity alert — workers within 15m active drilling area', action:'Establish 25m exclusion zone around EQ04' },
  { zone:'Z1',    risk:'High', desc:'EQ08 engine overtemp 103°C — continued operation risks engine failure', action:'Remove EQ08 from service immediately' },
  { zone:'Z4→Z5', risk:'Low', desc:'Loading zone congestion during peak shift — 4 vehicles queuing', action:'Stagger loading times by 10-minute intervals' },
]
</script>

<template>
  <div>
    <div class="page-header-row">
      <div>
        <h1 class="page-title">🚜 Equipment Safety</h1>
        <p class="page-subtitle">Heavy equipment telemetry · Predictive maintenance · Proximity risk</p>
      </div>
      <div class="eq-summary">
        <div class="eqs-item crit">{{ critEq.length }} <span>Critical</span></div>
        <div class="eqs-item warn">{{ maintDue.length }} <span>Maint. Due</span></div>
        <div class="eqs-item alert">{{ proxRisk.length }} <span>Prox. Risk</span></div>
        <div class="eqs-item ok">{{ equipment.filter(e=>e.status==='operating').length }} <span>Operating</span></div>
      </div>
    </div>

    <!-- Critical equipment banner -->
    <div v-if="critEq.length" class="critical-eq-banner" style="margin-bottom:14px">
      <span>🚨 CRITICAL EQUIPMENT — Immediate Action Required</span>
      <div class="ceq-items">
        <span v-for="e in critEq" :key="e.id" class="ceq-item">{{ e.name }} · Zone {{ e.zone }}</span>
      </div>
    </div>

    <!-- Proximity alerts -->
    <div v-if="proxRisk.length" class="prox-alert-banner card" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">⚠️ Vehicle Proximity Alerts — Active</span></div>
      <div class="card-body">
        <div v-for="e in proxRisk" :key="e.id" class="prox-row">
          <span class="prox-eq">{{ e.name }}</span>
          <span class="prox-zone">{{ e.zone }}</span>
          <span class="tag tag-crit">Vehicle-Worker Proximity Alert</span>
          <span class="prox-action">Reduce speed. Check clearance before moving.</span>
        </div>
      </div>
    </div>

    <!-- Equipment cards -->
    <div class="section-title" style="margin-bottom:10px">Fleet Status — {{ equipment.length }} Units</div>
    <div class="grid-3" style="margin-bottom:16px">
      <EquipmentCard v-for="eq in equipment" :key="eq.id" :equipment="eq" />
    </div>

    <!-- Charts -->
    <div class="grid-2" style="margin-bottom:16px">
      <TrendChart
        title="Equipment Utilisation & Fuel Levels"
        :labels="utilizationData.labels"
        :series="utilizationData.series"
        type="bar"
        :height="200"
      />
      <div class="card">
        <div class="card-header"><span class="card-title">🔧 Predictive Maintenance Schedule</span></div>
        <div class="card-body">
          <table class="data-table" style="font-size:0.75rem">
            <thead>
              <tr><th>Equipment</th><th>Hours Left</th><th>Priority</th><th>Issue</th></tr>
            </thead>
            <tbody>
              <tr v-for="e in equipment.filter(x=>x.maintenanceDue<=260).sort((a,b)=>a.maintenanceDue-b.maintenanceDue)" :key="e.id">
                <td>{{ e.name.split(' ').slice(0,2).join(' ') }}</td>
                <td :style="{ color: e.maintenanceDue <= 20 ? 'var(--status-crit)' : e.maintenanceDue <= 100 ? 'var(--status-warn)' : 'var(--status-ok)' }">
                  {{ e.maintenanceDue }}h
                </td>
                <td>
                  <span :class="['tag', e.maintenanceDue <= 20 ? 'tag-crit' : e.maintenanceDue <= 100 ? 'tag-warn' : 'tag-ok']">
                    {{ e.maintenanceDue <= 20 ? 'Critical' : e.maintenanceDue <= 100 ? 'Soon' : 'Planned' }}
                  </span>
                </td>
                <td style="color:var(--text-muted); font-size:0.7rem">
                  {{ e.engineTemp >= 100 ? 'Overheating' : e.maintenanceDue <= 20 ? 'Service overdue' : 'Routine service' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Route Safety Recommendations -->
    <div class="card" style="margin-top:0">
      <div class="card-header"><span class="card-title">🗺️ Route & Loading Zone Safety Recommendations</span></div>
      <div class="card-body">
        <div class="route-recs">
          <div v-for="r in routeRecs" :key="r.zone" :class="['route-rec', `risk-${r.risk.toLowerCase()}`]">
            <div class="rr-header">
              <span class="rr-zone">{{ r.zone }}</span>
              <span :class="['tag', r.risk==='High' ? 'tag-crit' : r.risk==='Medium' ? 'tag-warn' : 'tag-ok']">{{ r.risk }} Risk</span>
            </div>
            <div class="rr-desc">{{ r.desc }}</div>
            <div class="rr-action">💡 {{ r.action }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
.eq-summary { display:flex; gap:8px; }
.eqs-item { display:flex; flex-direction:column; align-items:center; gap:2px; background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:8px 12px; font-size:1.2rem; font-weight:700; font-family:var(--font-mono); }
.eqs-item span { font-size:0.62rem; color:var(--text-muted); font-family:var(--font-sans); font-weight:400; }
.eqs-item.crit { color:var(--status-crit); border-color:var(--status-crit-border); }
.eqs-item.warn { color:var(--status-warn); border-color:var(--status-warn-border); }
.eqs-item.alert { color:var(--status-warn); }
.eqs-item.ok { color:var(--status-ok); }

.critical-eq-banner { background:var(--status-crit-bg); border:1px solid var(--status-crit-border); border-radius:var(--radius-md); padding:10px 14px; color:var(--status-crit); font-weight:700; font-size:0.82rem; animation:blink 2s infinite; }
.ceq-items { display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; }
.ceq-item { background:var(--status-crit-bg); border:1px solid var(--status-crit-border); padding:3px 10px; border-radius:4px; font-size:0.72rem; font-weight:400; color:var(--status-crit); }

.prox-row { display:flex; align-items:center; gap:10px; font-size:0.78rem; margin-bottom:8px; flex-wrap:wrap; }
.prox-eq { font-weight:700; color:var(--text-primary); }
.prox-zone { font-family:var(--font-mono); font-size:0.68rem; color:var(--accent-cyan); background:rgba(6,182,212,0.08); padding:1px 6px; border-radius:4px; }
.prox-action { color:var(--accent-blue); font-size:0.72rem; flex:1; }

.route-recs { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.route-rec { background:var(--bg-secondary); border-radius:var(--radius-md); padding:12px; border-left:3px solid var(--border-card); }
.risk-high   .route-rec { border-left-color:var(--status-crit); }
.route-rec.risk-high   { border-left-color:var(--status-crit); }
.route-rec.risk-medium { border-left-color:var(--status-warn); }
.route-rec.risk-low    { border-left-color:var(--status-ok); }
.rr-header { display:flex; align-items:center; gap:8px; margin-bottom:5px; }
.rr-zone { font-family:var(--font-mono); font-size:0.75rem; font-weight:700; color:var(--accent-cyan); }
.rr-desc { font-size:0.75rem; color:var(--text-secondary); margin-bottom:5px; }
.rr-action { font-size:0.72rem; color:var(--accent-blue); }
</style>
