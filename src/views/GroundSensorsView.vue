<script setup>
import { computed, ref } from 'vue'
import { gasSensors, trendData } from '../data/mockData.js'
import SensorGrid from '../components/SensorGrid.vue'
import TrendChart from '../components/TrendChart.vue'
import StatusBadge from '../components/StatusBadge.vue'

const filterType = ref('all')
const types = computed(() => ['all', ...new Set(gasSensors.map(s => s.type))])
const filtered = computed(() => filterType.value === 'all' ? gasSensors : gasSensors.filter(s => s.type === filterType.value))

const critCount = computed(() => gasSensors.filter(s=>s.status==='critical').length)
const warnCount = computed(() => gasSensors.filter(s=>s.status==='warning').length)

const aiWarnings = [
  { type:'Methane Escalation', zone:'Z8', confidence:89, prediction:'CH₄ threshold breach within 2h', action:'Activate emergency ventilation immediately' },
  { type:'CO Accumulation',    zone:'Z3', confidence:74, prediction:'CO levels above warning threshold trending up', action:'Increase Zone C ventilation by 30%' },
  { type:'Dust Spike Risk',    zone:'Z4', confidence:68, prediction:'PM₂.₅ will exceed 70 μg/m³ during peak conveyor hours', action:'Activate automated dust suppression' },
]
</script>

<template>
  <div>
    <div class="page-header-row">
      <div>
        <h1 class="page-title">📡 Ground Sensors</h1>
        <p class="page-subtitle">89 environmental sensors · Gas, Dust, Temperature, Humidity</p>
      </div>
      <div class="sensor-summary">
        <div class="ss-item crit">{{ critCount }} <span>Critical</span></div>
        <div class="ss-item warn">{{ warnCount }} <span>Warning</span></div>
        <div class="ss-item ok">{{ gasSensors.filter(s=>s.status==='normal').length }} <span>Normal</span></div>
      </div>
    </div>

    <!-- AI Predictive Warnings -->
    <div class="ai-warnings card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">🤖 AI Predictive Gas Warnings</span>
      </div>
      <div class="card-body warn-list">
        <div v-for="w in aiWarnings" :key="w.type" :class="['warn-item', w.confidence >= 80 ? 'high' : 'med']">
          <div class="warn-header">
            <span class="warn-type">⚠️ {{ w.type }}</span>
            <span class="warn-zone">{{ w.zone }}</span>
            <span class="warn-conf">{{ w.confidence }}% confidence</span>
          </div>
          <div class="warn-pred">📈 Predicted: {{ w.prediction }}</div>
          <div class="warn-action">💡 Action: {{ w.action }}</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-bar" style="margin-bottom:12px">
      <button v-for="t in types" :key="t"
        :class="['filter-btn', { active: filterType === t }]"
        @click="filterType = t">
        {{ t === 'all' ? 'All Sensors' : t.replace('_', ' ').toUpperCase() }}
      </button>
    </div>

    <!-- Sensor Grid -->
    <SensorGrid :sensors="filtered" />

    <!-- Gas trend charts -->
    <div class="grid-2" style="margin-top:16px">
      <TrendChart
        title="Methane & CO Trend — Today"
        :labels="trendData.gasLevels.labels"
        :series="trendData.gasLevels.series"
        :height="200"
        type="line"
      />
      <div class="card">
        <div class="card-header"><span class="card-title">🌡️ Sensor Health Overview</span></div>
        <div class="card-body">
          <div class="sensor-health-grid">
            <div v-for="s in gasSensors" :key="s.id" class="sh-row">
              <span class="sh-id">{{ s.name }}</span>
              <span class="sh-label">{{ s.label }}</span>
              <StatusBadge :status="s.status" size="sm" />
              <span class="sh-cal">{{ s.lastCalibrated }}</span>
              <span :class="['sh-trend', s.trend === 'up' ? 'trend-up' : s.trend === 'down' ? 'trend-down' : 'trend-stable']">
                {{ s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Threshold reference card -->
    <div class="card threshold-ref" style="margin-top:16px">
      <div class="card-header"><span class="card-title">📊 Gas Safety Thresholds Reference</span></div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr><th>Gas</th><th>Symbol</th><th>Warning</th><th>Critical</th><th>Health Effect</th></tr>
          </thead>
          <tbody>
            <tr><td>Methane</td><td class="mono">CH₄</td><td style="color:var(--status-warn)">5 ppm</td><td style="color:var(--status-crit)">10 ppm</td><td>Explosion risk above LEL</td></tr>
            <tr><td>Carbon Monoxide</td><td class="mono">CO</td><td style="color:var(--status-warn)">25 ppm</td><td style="color:var(--status-crit)">50 ppm</td><td>Headache, unconsciousness</td></tr>
            <tr><td>Carbon Dioxide</td><td class="mono">CO₂</td><td style="color:var(--status-warn)">0.5%</td><td style="color:var(--status-crit)">1.5%</td><td>Breathing difficulty</td></tr>
            <tr><td>Hydrogen Sulfide</td><td class="mono">H₂S</td><td style="color:var(--status-warn)">5 ppm</td><td style="color:var(--status-crit)">10 ppm</td><td>Toxic, fatal at high levels</td></tr>
            <tr><td>Oxygen</td><td class="mono">O₂</td><td style="color:var(--status-warn)">&lt; 19.5%</td><td style="color:var(--status-crit)">&lt; 18%</td><td>Oxygen deficiency</td></tr>
            <tr><td>Fine Dust</td><td class="mono">PM₂.₅</td><td style="color:var(--status-warn)">50 μg/m³</td><td style="color:var(--status-crit)">100 μg/m³</td><td>Respiratory disease</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
.sensor-summary { display:flex; gap:8px; }
.ss-item { display:flex; flex-direction:column; align-items:center; gap:2px; background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:8px 14px; font-size:1.3rem; font-weight:700; font-family:var(--font-mono); }
.ss-item span { font-size:0.65rem; color:var(--text-muted); font-family:var(--font-sans); font-weight:400; }
.ss-item.crit { color:var(--status-crit); border-color:var(--status-crit-border); }
.ss-item.warn { color:var(--status-warn); border-color:var(--status-warn-border); }
.ss-item.ok   { color:var(--status-ok); }

.warn-list { display:flex; flex-direction:column; gap:10px; }
.warn-item { background:var(--bg-secondary); border-radius:var(--radius-sm); padding:10px 12px; border-left:3px solid var(--status-warn); }
.warn-item.high { border-left-color:var(--status-crit); }
.warn-header { display:flex; align-items:center; gap:10px; margin-bottom:4px; }
.warn-type { font-size:0.8rem; font-weight:700; color:var(--text-primary); }
.warn-zone { font-size:0.68rem; font-family:var(--font-mono); color:var(--accent-cyan); background:rgba(6,182,212,0.08); padding:1px 6px; border-radius:4px; }
.warn-conf { font-size:0.7rem; color:var(--text-muted); margin-left:auto; }
.warn-pred { font-size:0.75rem; color:var(--text-secondary); margin-bottom:3px; }
.warn-action { font-size:0.75rem; color:var(--accent-blue); }

.filter-bar { display:flex; flex-wrap:wrap; gap:6px; }
.filter-btn { background:var(--bg-card); border:1px solid var(--border-card); color:var(--text-muted); padding:5px 12px; border-radius:20px; font-size:0.72rem; font-weight:600; cursor:pointer; font-family:var(--font-sans); transition:all var(--transition-fast); }
.filter-btn:hover, .filter-btn.active { background:var(--status-info-bg); border-color:var(--status-info-border); color:var(--accent-blue); }

.sensor-health-grid { display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto; }
.sh-row { display:flex; align-items:center; gap:8px; font-size:0.72rem; }
.sh-id { font-family:var(--font-mono); color:var(--accent-cyan); min-width:45px; }
.sh-label { color:var(--text-muted); min-width:40px; }
.sh-cal { color:var(--text-dim); font-size:0.65rem; margin-left:auto; }
.sh-trend { font-weight:700; font-size:0.8rem; min-width:12px; }
</style>
