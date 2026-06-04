<script setup>
import { computed } from 'vue'
import { store } from '../store/scenarios.js'
import { kpiOverview, trendData, aiPredictions, mineZones } from '../data/mockData.js'
import KpiCard from '../components/KpiCard.vue'
import MineMap from '../components/MineMap.vue'
import AlertPanel from '../components/AlertPanel.vue'
import TrendChart from '../components/TrendChart.vue'
import PredictionCard from '../components/PredictionCard.vue'

const kpis = [
  { title: kpiOverview.activeWorkers.label,   value: kpiOverview.activeWorkers.value,   icon: kpiOverview.activeWorkers.icon,   status: kpiOverview.activeWorkers.status,   change: kpiOverview.activeWorkers.change },
  { title: kpiOverview.activeDrones.label,    value: kpiOverview.activeDrones.value,    icon: kpiOverview.activeDrones.icon,    status: kpiOverview.activeDrones.status,    change: kpiOverview.activeDrones.change },
  { title: kpiOverview.sensorsOnline.label,   value: kpiOverview.sensorsOnline.value,   icon: kpiOverview.sensorsOnline.icon,   status: kpiOverview.sensorsOnline.status,   change: kpiOverview.sensorsOnline.change },
  { title: kpiOverview.criticalAlerts.label,  value: computed(() => store.alerts.filter(a=>a.level==='critical'&&!a.acknowledged).length), icon: kpiOverview.criticalAlerts.icon, status: computed(() => store.criticalCount > 0 ? 'critical' : 'normal'), change: kpiOverview.criticalAlerts.change },
  { title: kpiOverview.aiRiskScore.label,     value: kpiOverview.aiRiskScore.value,     icon: kpiOverview.aiRiskScore.icon,     status: kpiOverview.aiRiskScore.status,     change: kpiOverview.aiRiskScore.change },
  { title: kpiOverview.fatigueRisk.label,     value: kpiOverview.fatigueRisk.value,     icon: kpiOverview.fatigueRisk.icon,     status: kpiOverview.fatigueRisk.status,     change: kpiOverview.fatigueRisk.change },
  { title: kpiOverview.ppeCompliance.label,   value: kpiOverview.ppeCompliance.value,   icon: kpiOverview.ppeCompliance.icon,   status: kpiOverview.ppeCompliance.status,   change: kpiOverview.ppeCompliance.change },
  { title: kpiOverview.evacuationReady.label, value: kpiOverview.evacuationReady.value, icon: kpiOverview.evacuationReady.icon, status: kpiOverview.evacuationReady.status, change: kpiOverview.evacuationReady.change },
]

const topPredictions = aiPredictions.slice(0, 2)
</script>

<template>
  <div class="overview-page">
    <!-- Scenario Banner -->
    <div v-if="store.activeScenario" class="scenario-banner">
      <span>🔴</span>
      <span>SIMULATION ACTIVE: {{ store.activeScenario.replace('_',' ').toUpperCase() }}</span>
      <button class="btn btn-secondary btn-sm" style="margin-left:auto" @click="store.resetScenario()">Reset Simulation</button>
    </div>

    <!-- Page header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Command Center Overview</h1>
        <p class="page-subtitle">Real-time AI monitoring across all mine zones · Kalimantan Gold Mine</p>
      </div>
      <div class="page-header-right">
        <div class="ifdays-badge">
          <span class="ifd-icon">✅</span>
          <div>
            <div class="ifd-value">47</div>
            <div class="ifd-label">Incident-Free Days</div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="kpi-grid">
      <KpiCard
        v-for="(k, i) in kpis" :key="i"
        :title="k.title"
        :value="typeof k.value === 'object' ? k.value.value : k.value"
        :icon="k.icon"
        :status="typeof k.status === 'object' ? k.status.value : k.status"
        :change="k.change"
      />
    </div>

    <!-- Main body: Map + Alerts -->
    <div class="main-grid">
      <div class="map-col">
        <MineMap />
      </div>
      <div class="alerts-col">
        <AlertPanel :maxItems="12" />
      </div>
    </div>

    <!-- Charts row -->
    <div class="charts-row grid-2" style="margin-top:16px">
      <TrendChart
        title="Gas Sensor Trend — Today"
        :labels="trendData.gasLevels.labels"
        :series="trendData.gasLevels.series"
        :height="180"
        type="line"
      />
      <TrendChart
        title="AI Risk Score — This Week"
        :labels="trendData.riskScore.labels"
        :series="trendData.riskScore.series"
        :height="180"
        type="line"
      />
    </div>

    <!-- AI Predictions -->
    <div class="ai-section" style="margin-top:16px">
      <div class="section-title">🤖 Top AI Predictions — Immediate Attention Required</div>
      <div class="grid-2" style="margin-top:8px">
        <PredictionCard v-for="p in topPredictions" :key="p.id" :prediction="p" />
      </div>
    </div>

    <!-- Zone summary -->
    <div class="zone-summary" style="margin-top:16px">
      <div class="section-title">Mine Zone Risk Summary</div>
      <div class="zone-chips" style="margin-top:8px">
        <div v-for="z in mineZones" :key="z.id" :class="['zone-chip-card card', `zone-chip-${z.riskLevel}`]">
          <div class="zc-id">{{ z.id }}</div>
          <div class="zc-name">{{ z.name }}</div>
          <div class="zc-workers">👷 {{ z.workers }}</div>
          <div :class="['zc-risk', `level-${z.riskLevel}`]">{{ z.riskLevel.toUpperCase() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview-page { display: flex; flex-direction: column; gap: 0; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-header-right {}
.ifdays-badge {
  display: flex; align-items: center; gap: 8px;
  background: var(--status-ok-bg);
  border: 1px solid var(--status-ok-border);
  border-radius: var(--radius-lg);
  padding: 8px 14px;
}
.ifd-icon { font-size: 1.3rem; }
.ifd-value { font-size: 1.3rem; font-weight: 800; color: var(--status-ok); font-family: var(--font-mono); }
.ifd-label { font-size: 0.65rem; color: var(--status-ok); text-transform: uppercase; letter-spacing: 0.05em; }

.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }

.main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
.map-col { min-height: 360px; }
.alerts-col { display: flex; flex-direction: column; overflow: hidden; max-height: 480px; }

@media (max-width: 900px) {
  .kpi-grid   { grid-template-columns: repeat(2, 1fr); }
  .main-grid  { grid-template-columns: 1fr; }
  .alerts-col { max-height: 320px; }
  .page-header { flex-direction: column; gap: 8px; }
}
@media (max-width: 600px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .zone-chips { gap: 6px; }
}

.zone-chips { display: flex; flex-wrap: wrap; gap: 10px; }
.zone-chip-card {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: default;
}
.zone-chip-warning { border-color: var(--status-warn-border); }
.zone-chip-critical { border-color: var(--status-crit-border); }
.zc-id { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--accent-cyan); min-width: 24px; }
.zc-name { font-size: 0.78rem; color: var(--text-secondary); }
.zc-workers { font-size: 0.72rem; color: var(--text-muted); }
.zc-risk { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.05em; }

@media (max-width: 1200px) {
  .kpi-grid { grid-template-columns: repeat(4, 1fr); }
  .main-grid { grid-template-columns: 1fr; }
  .alerts-col { max-height: 300px; }
}
@media (max-width: 800px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
