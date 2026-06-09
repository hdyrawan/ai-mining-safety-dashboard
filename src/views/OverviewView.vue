<script setup>
import { ref, computed } from 'vue'
import { store } from '../store/scenarios.js'
import { trendData, aiPredictions, mineZones } from '../data/mockData.js'
import KpiCard from '../components/KpiCard.vue'
import MineMap from '../components/MineMap.vue'
import AlertPanel from '../components/AlertPanel.vue'
import TrendChart from '../components/TrendChart.vue'
import PredictionCard from '../components/PredictionCard.vue'
import MetricDetailDrawer from '../components/MetricDetailDrawer.vue'

// ── Interaction state ─────────────────────────────────────────────────────────
const hoveredMetricId  = ref(null)
const selectedMetricId = ref(null)

function onCardHover(id)  { hoveredMetricId.value  = id }
function onCardLeave()    { hoveredMetricId.value  = null }
function onCardClick(id)  {
  selectedMetricId.value = selectedMetricId.value === id ? null : id
}
function closeDrawer()    { selectedMetricId.value = null }

// ── Map highlight targets derived from hovered/selected metric ────────────────
const highlightedTargets = computed(() => {
  const id = selectedMetricId.value || hoveredMetricId.value
  if (!id) return []
  const card = metricCards.value.find(m => m.id === id)
  return card?.highlightTargets || []
})
const highlightStrength = computed(() =>
  selectedMetricId.value ? 'strong' : 'light'
)

// ── Active drawer metric ──────────────────────────────────────────────────────
const activeDrawerMetric = computed(() => {
  if (!selectedMetricId.value) return null
  return metricCards.value.find(m => m.id === selectedMetricId.value) ?? null
})

// ── Metric cards config — fully data-driven ───────────────────────────────────
const metricCards = computed(() => {
  const critCount  = store.alerts.filter(a => a.level === 'critical' && !a.acknowledged).length
  const warnCount  = store.alerts.filter(a => a.level === 'warning'  && !a.acknowledged).length
  const latestAlert = store.alerts[0]

  return [
    // ── 1 Active Workers ──────────────────────────────────────────────────────
    {
      id: 'active-workers',
      title: 'Active Workers',
      value: 247,
      icon: '👷',
      status: 'normal',
      change: '+3 vs shift start',
      hoverSummary: [
        '238 workers in normal zones',
        '7 monitored for health risk',
        '2 workers near restricted areas',
      ],
      trendValues: [238, 241, 244, 247, 249, 247, 247],
      detail: {
        description: 'Real-time worker presence tracked via wearable tags, GPS beacons, and zone access control across all 9 mine zones.',
        trendLabel: 'Worker count — current shift (06:00–now)',
        rows: [
          { label: 'Open Pit A (Z1)',        value: '45 workers' },
          { label: 'Blast Zone B (Z2)',       value: '18 workers' },
          { label: 'Underground C (Z3)',      value: '32 workers',  color: '#f59e0b' },
          { label: 'Processing Plant (Z4)',   value: '28 workers' },
          { label: 'Admin / Muster (Z7)',     value: '15 workers' },
          { label: 'Other zones',             value: '109 workers' },
          { label: 'Workers at risk',         value: '7 flagged',   color: '#f59e0b' },
          { label: 'Near restricted zones',   value: '2 workers',   color: '#ef4444' },
        ],
        relatedZones: ['Worker Zone C', 'Open Pit A', 'Muster Point'],
        relatedAlerts: [
          { text: 'W010 Joko Susilo — fall detected, no movement 90s',        level: 'critical' },
          { text: 'W004 Diana Putri — fatigue score 78, heat stress risk',     level: 'warning'  },
        ],
        dataSource: 'Wearable tags · GPS beacons · Zone access control',
        lastUpdated: '12 seconds ago',
        recommendedActions: [
          'Monitor 2 workers near restricted zones in real time',
          'Initiate shift handover count before 18:00',
          'Check all flagged workers for fatigue and vital signs',
        ],
      },
      highlightTargets: ['worker-zone-c', 'muster-point', 'processing-plant'],
    },

    // ── 2 Active Drones ───────────────────────────────────────────────────────
    {
      id: 'active-drones',
      title: 'Active Drones',
      value: 3,
      icon: '🚁',
      status: 'normal',
      change: '3 patrolling, 1 charging',
      hoverSummary: [
        'Eagle-1: Zone A perimeter patrol (87% batt)',
        'Eagle-2: Slope inspection — crack detected (63%)',
        'Falcon-1 charging — next: night survey (24%)',
      ],
      trendValues: [4, 4, 3, 3, 4, 3, 3],
      detail: {
        description: '6 autonomous drones monitor mine zones for slope stability, gas hazards, PPE compliance, and environmental boundaries.',
        trendLabel: 'Active drone count — past 7 hours',
        rows: [
          { label: 'Eagle-1 (Zone A patrol)',     value: 'Batt 87%',  color: '#22c55e' },
          { label: 'Eagle-2 (Slope inspection)',  value: 'Batt 63%',  color: '#f59e0b' },
          { label: 'Falcon-1 (Charging)',         value: 'Batt 24%',  color: '#ef4444' },
          { label: 'Falcon-2 (Env. monitoring)',  value: 'Batt 91%',  color: '#22c55e' },
          { label: 'Hawk-1 (Standby)',            value: 'Batt 100%', color: '#22c55e' },
          { label: 'Hawk-2 (Maintenance)',        value: 'Batt 35%',  color: '#f59e0b' },
          { label: 'Total flight hours today',    value: '14.2 hrs' },
        ],
        relatedZones: ['North Slope', 'Bio Rehab Zone', 'Blast Zone B'],
        relatedAlerts: [
          { text: 'Eagle-2 detected slope crack on north face — confidence 84%', level: 'warning' },
        ],
        dataSource: 'Drone telemetry · AI vision system · Route planner',
        lastUpdated: '8 seconds ago',
        recommendedActions: [
          'Review Eagle-2 slope crack imagery in drone dashboard',
          'Schedule Eagle-1 battery rotation within 2 hours',
          'Deploy Hawk-1 for Zone 8 surveillance if gas escalates',
        ],
      },
      highlightTargets: ['drone-eagle1', 'drone-eagle2', 'north-slope'],
    },

    // ── 3 Sensors Online ──────────────────────────────────────────────────────
    {
      id: 'sensors-online',
      title: 'Sensors Online',
      value: 89,
      icon: '📡',
      status: 'warning',
      change: '2 offline in Zone 8',
      hoverSummary: [
        '87 sensors reporting normally',
        '2 offline: GS-11 (Fuel Zone 8)',
        'Last network sync: 8 seconds ago',
      ],
      trendValues: [91, 90, 89, 91, 90, 89, 89],
      detail: {
        description: '89 fixed ground sensors monitoring gas, dust, temperature, humidity, and vibration across all 9 mine zones via IoT mesh.',
        trendLabel: 'Sensors online — past 7 hours',
        rows: [
          { label: 'Gas (CH₄, CO, H₂S, SO₂)',   value: '12 online' },
          { label: 'Dust (PM₂.₅ / PM₁₀)',        value: '6 online' },
          { label: 'Temperature / Humidity',      value: '18 online' },
          { label: 'Vibration / Slope',           value: '22 online' },
          { label: 'Weather station',             value: '8 online' },
          { label: 'Water / Seepage',             value: '11 online' },
          { label: 'Offline sensors (Fuel Z8)',   value: '2 offline', color: '#f59e0b' },
          { label: 'Calibration overdue (GS-11)', value: '1 sensor',  color: '#ef4444' },
        ],
        relatedZones: ['Fuel Zone 8', 'Processing Plant', 'Underground C'],
        relatedAlerts: [
          { text: 'GS-11 CH₄ 8.4 ppm — approaching critical threshold (10 ppm)', level: 'critical' },
          { text: 'GS-08 PM₂.₅ 58.4 μg/m³ — above warning threshold in Z4',     level: 'warning'  },
        ],
        dataSource: 'IoT sensor mesh · Edge computing nodes · SCADA',
        lastUpdated: '8 seconds ago',
        recommendedActions: [
          'Investigate 2 offline sensors in Fuel Zone 8 immediately',
          'Schedule calibration for GS-11 (overdue since Dec 10)',
          'Increase poll frequency for gas sensors in Zone 8',
        ],
      },
      highlightTargets: ['fuel-zone-8', 'processing-plant', 'worker-zone-c'],
    },

    // ── 4 Critical Alerts ─────────────────────────────────────────────────────
    {
      id: 'critical-alerts',
      title: 'Critical Alerts',
      value: critCount,
      icon: '🚨',
      status: critCount > 0 ? 'critical' : 'normal',
      change: critCount > 0 ? `${critCount} require immediate action` : 'All clear',
      hoverSummary: [
        `${critCount} unacknowledged critical alert${critCount !== 1 ? 's' : ''}`,
        `${warnCount} active warning alert${warnCount !== 1 ? 's' : ''}`,
        latestAlert
          ? `Latest: ${latestAlert.time} — Zone ${latestAlert.zone}`
          : 'No recent alerts',
      ],
      trendValues: [1, 1, 2, 2, 3, 3, critCount || 3],
      detail: {
        description: 'AI-triaged safety alerts ranked by severity. Unacknowledged critical alerts require immediate supervisor response.',
        trendLabel: 'Critical alert count — current shift',
        rows: store.alerts.slice(0, 6).map(a => ({
          label: `${a.zone} · ${a.time}`,
          value: a.level.toUpperCase(),
          color: a.level === 'critical' ? '#ef4444' : a.level === 'warning' ? '#f59e0b' : '#3b82f6',
        })),
        relatedZones: ['Fuel Zone 8', 'Tailings Dam (Z5)', 'Open Pit A (Z1)'],
        relatedAlerts: store.alerts
          .filter(a => !a.acknowledged)
          .slice(0, 4)
          .map(a => ({ text: a.message.slice(0, 72), level: a.level })),
        dataSource: 'AI safety agent · Sensor feeds · Wearable events',
        lastUpdated: '15 seconds ago',
        recommendedActions: [
          'A001: Evacuate non-essential personnel from Zone 8 (gas)',
          'A002: Dispatch medical team to W010 (fall detected)',
          'A003: Halt EQ08 operations — engine over-temperature',
        ],
      },
      highlightTargets: ['fuel-zone-8', 'worker-zone-c', 'excavator-area'],
    },

    // ── 5 AI Risk Score ───────────────────────────────────────────────────────
    {
      id: 'ai-risk-score',
      title: 'AI Risk Score',
      value: 67,
      icon: '🤖',
      status: 'critical',
      change: 'High — intervention needed',
      hoverSummary: [
        'Score 67/100 — HIGH RISK',
        'Top drivers: methane (42%), fatigue (28%)',
        'Model confidence: 87%',
      ],
      trendValues: [42, 38, 51, 35, 44, 29, 67],
      detail: {
        description: 'Composite AI risk index (0–100) fusing gas sensor trends, worker fatigue, slope stability, and equipment health. Scores >60 require immediate action.',
        trendLabel: 'AI Risk Score — this week (Mon–Sun)',
        rows: [
          { label: 'Methane risk contribution',    value: '42%', color: '#ef4444' },
          { label: 'Worker fatigue contribution',  value: '28%', color: '#f59e0b' },
          { label: 'Slope stability contribution', value: '15%', color: '#f59e0b' },
          { label: 'Equipment health contribution',value: '15%', color: '#3b82f6' },
          { label: 'Model confidence',             value: '87%', color: '#22c55e' },
          { label: 'Predicted threshold breach',   value: '< 2 hours', color: '#ef4444' },
          { label: 'Historical 30-day average',    value: '38 (normal)' },
        ],
        relatedZones: ['Fuel Zone 8', 'North Slope', 'Worker Zone C', 'Open Pit A'],
        relatedAlerts: [
          { text: 'Methane escalation risk Z8 — breach predicted within 2 hours', level: 'critical' },
          { text: 'Combined heat stress + fatigue risk above intervention threshold', level: 'warning' },
        ],
        dataSource: 'AI fusion model: gas, wearables, vibration, equipment telemetry',
        lastUpdated: '30 seconds ago',
        recommendedActions: [
          'Evacuate Zone 8 non-essential personnel immediately',
          'Rotate Zone C fatigued workers to cool rest area',
          'Inspect and halt EQ08 excavation operations',
          'Increase sensor poll rate to 30-second intervals',
        ],
      },
      highlightTargets: ['fuel-zone-8', 'north-slope', 'worker-zone-c', 'excavator-area'],
    },

    // ── 6 Fatigue Risk ────────────────────────────────────────────────────────
    {
      id: 'fatigue-risk',
      title: 'Fatigue Risk',
      value: '28%',
      icon: '⚡',
      status: 'warning',
      change: '7 workers >50% fatigue',
      hoverSummary: [
        '7 workers above 50% fatigue threshold',
        'Highest: W004 Diana Putri — score 78%',
        'Zone C most affected, ambient 34.2°C',
      ],
      trendValues: [12, 18, 28, 35, 42, 38, 42],
      detail: {
        description: 'Worker fatigue index derived from wearable biometrics: heart rate variability, movement patterns, shift duration, and ambient thermal stress.',
        trendLabel: 'Average fatigue score — current shift (06:00–now)',
        rows: [
          { label: 'Workers >50% fatigue',       value: '7 flagged',           color: '#f59e0b' },
          { label: 'Workers >70% (critical)',     value: '2 workers',           color: '#ef4444' },
          { label: 'Highest: W004 Diana Putri',   value: 'Score 78%',           color: '#ef4444' },
          { label: 'Second: W010 Joko Susilo',    value: 'Score 69%',           color: '#ef4444' },
          { label: 'Workers on shift >6 hours',   value: '12 workers',          color: '#f59e0b' },
          { label: 'Zone C ambient temperature',  value: '34.2°C (> 32°C)',     color: '#f59e0b' },
          { label: 'Average shift duration',      value: '5h 42 min' },
        ],
        relatedZones: ['Worker Zone C', 'Tailings Dam (Z5)'],
        relatedAlerts: [
          { text: 'W004 Diana Putri — HR 110 bpm, fatigue 78, heat stress risk', level: 'critical' },
          { text: 'W010 Joko Susilo — fatigue 69, fall detected in Z5',          level: 'critical' },
        ],
        dataSource: 'Wearable biosensors (HR, temperature, SpO₂) · AI fatigue model',
        lastUpdated: '15 seconds ago',
        recommendedActions: [
          'Mandatory rest break for W004 and W010 immediately',
          'Rotate all Zone C workers with shift duration >6 hours',
          'Deploy electrolyte stations at Zone C entry points',
          'Reduce shift maximum to 4 hours when ambient >32°C',
        ],
      },
      highlightTargets: ['worker-zone-c'],
    },

    // ── 7 PPE Compliance ──────────────────────────────────────────────────────
    {
      id: 'ppe-compliance',
      title: 'PPE Compliance',
      value: '94.2%',
      icon: '⛑️',
      status: 'normal',
      change: '15 workers non-compliant',
      hoverSummary: [
        '15 workers detected without full PPE',
        'Main violations: helmet (8), vest (5)',
        'Blast Zone B has highest non-compliance',
      ],
      trendValues: [98, 97, 96, 95, 94, 95, 94],
      detail: {
        description: 'Real-time PPE compliance via CCTV AI vision and wearable NFC tags across 11 cameras and all 247 workers.',
        trendLabel: 'PPE compliance % — current shift (06:00–now)',
        rows: [
          { label: 'Non-compliant workers',        value: '15 detected', color: '#f59e0b' },
          { label: 'Missing hard hat',             value: '8 workers',   color: '#ef4444' },
          { label: 'Missing safety vest',          value: '5 workers',   color: '#f59e0b' },
          { label: 'Missing safety gloves',        value: '2 workers',   color: '#f59e0b' },
          { label: 'Highest non-compliance zone',  value: 'Blast Zone B (Z2)' },
          { label: 'Camera detection confidence',  value: '91%',         color: '#22c55e' },
          { label: 'Wearable NFC compliance',      value: '97.8%',       color: '#22c55e' },
        ],
        relatedZones: ['Blast Zone B', 'Worker Zone C', 'Processing Plant'],
        relatedAlerts: [
          { text: 'CAM-02 Z2: Worker missing hard hat near blast zone entrance',  level: 'warning' },
          { text: 'CAM-03 Z2: Two workers without safety glasses in blast area',  level: 'warning' },
        ],
        dataSource: 'CCTV AI vision (11 cameras) · Wearable NFC tags · Access control',
        lastUpdated: '22 seconds ago',
        recommendedActions: [
          'Supervisor to check Blast Zone B for non-compliant workers',
          'Broadcast PPE reminder via PA system in Zones B and C',
          'Review CAM-02 footage for worker identification',
        ],
      },
      highlightTargets: ['north-slope', 'worker-zone-c', 'processing-plant'],
    },

    // ── 8 Evacuation Ready ────────────────────────────────────────────────────
    {
      id: 'evacuation-ready',
      title: 'Evacuation Ready',
      value: '98%',
      icon: '🚪',
      status: 'normal',
      change: 'Route A & B clear',
      hoverSummary: [
        'Routes A and B fully clear',
        'Route C: 1 minor obstruction (clearing)',
        'Muster point capacity 300 — ready',
      ],
      trendValues: [100, 100, 98, 98, 98, 100, 98],
      detail: {
        description: 'Evacuation route clearance, muster point readiness, and emergency response team status. Updated in real time from zone sensors and vehicle tracking.',
        trendLabel: 'Evacuation readiness % — current shift',
        rows: [
          { label: 'Route A (2.1 km, primary)',  value: 'CLEAR',               color: '#22c55e' },
          { label: 'Route B (1.8 km, alternate)',value: 'CLEAR',               color: '#22c55e' },
          { label: 'Route C (3.2 km, secondary)',value: '1 obstruction',        color: '#f59e0b' },
          { label: 'Muster Point capacity',      value: '300 workers',          color: '#22c55e' },
          { label: 'Response team readiness',    value: 'On duty — 5 min ETA', color: '#22c55e' },
          { label: 'Emergency vehicles staged',  value: '2 ambulance, 1 fire', color: '#22c55e' },
          { label: 'Est. evacuation time',       value: '< 8 minutes',         color: '#22c55e' },
        ],
        relatedZones: ['Admin / Muster (Z7)', 'Fuel Zone 8', 'Worker Zone C'],
        relatedAlerts: [],
        dataSource: 'Zone sensors · Vehicle GPS · Emergency communications',
        lastUpdated: '45 seconds ago',
        recommendedActions: [
          'Clear Route C obstruction — assign maintenance crew',
          'Confirm muster headcount procedure with supervisors',
          'Pre-brief response team for potential Zone 8 gas event',
          'Test emergency PA system before next shift change',
        ],
      },
      highlightTargets: ['muster-point', 'fuel-zone-8'],
    },

    // ── 9 Incident-Free Days ──────────────────────────────────────────────────
    {
      id: 'incident-free',
      title: 'Incident-Free Days',
      value: 47,
      icon: '✅',
      status: 'normal',
      change: 'Best streak in site history',
      hoverSummary: [
        '47 consecutive incident-free days',
        'Last incident: Dec 4 — near-miss, Zone B',
        'Safety trend: ↑ improving year-on-year',
      ],
      trendValues: [16, 20, 25, 31, 37, 42, 47],
      detail: {
        description: 'Consecutive days without a recordable safety incident. Current streak of 47 days is the highest in this site\'s recorded history.',
        trendLabel: 'Incident-free day streak — past 7 months',
        rows: [
          { label: 'Current streak',           value: '47 days',        color: '#22c55e' },
          { label: 'Previous best',            value: '31 days (Oct 2024)' },
          { label: 'Last recordable incident', value: 'Dec 4 — near-miss, Z2' },
          { label: 'Near-misses (last 30 days)',value: '2 logged' },
          { label: 'Incidents YoY reduction',  value: '−34%',           color: '#22c55e' },
          { label: 'Safety score vs target',   value: '94 / 98 target', color: '#22c55e' },
          { label: 'AI predictions resolved',  value: '12 of 14 (85%)', color: '#22c55e' },
        ],
        relatedZones: ['All mine zones', 'Worker Zone C', 'North Slope'],
        relatedAlerts: [],
        dataSource: 'Incident management system · AI safety logs · ISO 45001 tracking',
        lastUpdated: '47 days ago (last incident)',
        recommendedActions: [
          'Share 47-day milestone in daily safety briefing',
          'Review near-miss trends to prevent first recordable incident',
          'Continue mandatory PPE monitoring in Blast Zone B',
          'Maintain Zone 8 gas monitoring at high frequency',
        ],
      },
      highlightTargets: ['worker-zone-c', 'north-slope', 'muster-point'],
    },
  ]
})

const topPredictions = aiPredictions.slice(0, 2)
</script>

<template>
  <div :class="['overview-page', { 'drawer-open': !!selectedMetricId }]">
    <!-- Scenario Banner -->
    <div v-if="store.activeScenario" class="scenario-banner">
      <span>🔴</span>
      <span>SIMULATION ACTIVE: {{ store.activeScenario.replace('_',' ').toUpperCase() }}</span>
      <button class="btn btn-secondary btn-sm" style="margin-left:auto"
              @click="store.resetScenario()">Reset Simulation</button>
    </div>

    <!-- Page header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Command Center Overview</h1>
        <p class="page-subtitle">Real-time AI monitoring across all mine zones · Kalimantan Gold Mine</p>
      </div>
    </div>

    <!-- KPI Grid — 3×3 (9 metric cards, all interactive) -->
    <div class="kpi-grid">
      <KpiCard
        v-for="card in metricCards"
        :key="card.id"
        :id="card.id"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :status="card.status"
        :change="card.change"
        :hoverSummary="card.hoverSummary"
        :trendValues="card.trendValues"
        :isActive="selectedMetricId === card.id"
        @card-hover="onCardHover"
        @card-leave="onCardLeave"
        @card-click="onCardClick"
      />
    </div>

    <!-- Main body: Map + Alerts -->
    <div class="main-grid">
      <div class="map-col">
        <MineMap
          :highlightedTargets="highlightedTargets"
          :highlightStrength="highlightStrength"
        />
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
        <div v-for="z in mineZones" :key="z.id"
             :class="['zone-chip-card card', `zone-chip-${z.riskLevel}`]">
          <div class="zc-id">{{ z.id }}</div>
          <div class="zc-name">{{ z.name }}</div>
          <div class="zc-workers">👷 {{ z.workers }}</div>
          <div :class="['zc-risk', `level-${z.riskLevel}`]">{{ z.riskLevel.toUpperCase() }}</div>
        </div>
      </div>
    </div>

    <!-- Metric detail drawer (teleported to body) -->
    <MetricDetailDrawer
      :metric="activeDrawerMetric"
      :visible="!!selectedMetricId"
      @close="closeDrawer"
    />
  </div>
</template>

<style scoped>
.overview-page {
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: padding-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.overview-page.drawer-open { padding-right: 348px; }
.page-header   { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }

/* 3×3 KPI grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; align-items: start; }
.map-col {
  height: calc(100vh - 290px);
  min-height: 560px;
  display: flex;
  flex-direction: column;
}
.alerts-col {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 290px);
  min-height: 560px;
}

@media (max-width: 1200px) {
  .kpi-grid { grid-template-columns: repeat(3, 1fr); }
  .main-grid { grid-template-columns: 1fr; }
  .map-col    { height: auto; min-height: 520px; }
  .alerts-col { height: auto; min-height: 340px; max-height: 400px; }
}
@media (max-width: 900px) {
  .kpi-grid   { grid-template-columns: repeat(3, 1fr); }
  .main-grid  { grid-template-columns: 1fr; }
  .map-col    { height: auto; min-height: 480px; }
  .alerts-col { height: auto; min-height: 340px; max-height: 400px; }
  .page-header { flex-direction: column; gap: 8px; }
}
@media (max-width: 700px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
}
@media (max-width: 420px) {
  .kpi-grid { grid-template-columns: 1fr; }
}

.zone-chips { display: flex; flex-wrap: wrap; gap: 10px; }
.zone-chip-card {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: default;
}
.zone-chip-warning  { border-color: var(--status-warn-border); }
.zone-chip-critical { border-color: var(--status-crit-border); }
.zc-id      { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--accent-cyan); min-width: 24px; }
.zc-name    { font-size: 0.78rem; color: var(--text-secondary); }
.zc-workers { font-size: 0.72rem; color: var(--text-muted); }
.zc-risk    { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.05em; }
</style>
