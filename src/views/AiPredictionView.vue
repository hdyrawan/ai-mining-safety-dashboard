<script setup>
import { ref } from 'vue'
import { aiPredictions, trendData } from '../data/mockData.js'
import PredictionCard from '../components/PredictionCard.vue'
import TrendChart from '../components/TrendChart.vue'
import RiskGauge from '../components/RiskGauge.vue'

const riskScores = {
  overall: 67, health: 55, gas: 72, equipment: 52, environmental: 38,
}

const confData = {
  labels: ['< 60%', '60–70%', '70–80%', '80–90%', '> 90%'],
  series: [{ name:'Predictions', color:'#3b82f6', values:[1, 2, 4, 6, 3] }]
}

const xaiExplanations = [
  { factor:'Gas Sensor Trend', weight:35, icon:'📡', desc:'Methane upward trend at 3 sensors over 4 hours' },
  { factor:'Weather Pattern', weight:22, icon:'🌤️', desc:'Westerly wind reducing natural ventilation by 40%' },
  { factor:'Shift Duration', weight:18, icon:'⏱️', desc:'Blast crew at 7h+ continuous shift — elevated risk' },
  { factor:'Historical Incidents', weight:15, icon:'📚', desc:'3 gas incidents in Zone B in past 90 days' },
  { factor:'Sensor Calibration', weight:10, icon:'🔧', desc:'GS-02 calibration overdue 3 days — reliability reduced' },
]
</script>

<template>
  <div>
    <div>
      <h1 class="page-title">🤖 AI Prediction Engine</h1>
      <p class="page-subtitle" style="margin-bottom:16px">24-hour risk forecast · Explainable AI · Confidence scoring</p>
    </div>

    <!-- Risk Gauges -->
    <div class="gauge-row" style="margin-bottom:16px">
      <RiskGauge title="Overall Risk" :value="riskScores.overall" :warnAt="40" :critAt="65" subtitle="AI composite score" />
      <RiskGauge title="Health Risk"  :value="riskScores.health"  :warnAt="40" :critAt="65" subtitle="Worker safety" />
      <RiskGauge title="Gas Risk"     :value="riskScores.gas"     :warnAt="40" :critAt="65" subtitle="Atmospheric hazard" />
      <RiskGauge title="Equipment"    :value="riskScores.equipment":warnAt="40" :critAt="65" subtitle="Mechanical failure" />
      <RiskGauge title="Environmental":value="riskScores.environmental" :warnAt="40" :critAt="65" subtitle="Environmental risk" />
    </div>

    <!-- Prediction Cards -->
    <div class="section-title" style="margin-bottom:10px">🔮 Active AI Predictions — 24-Hour Horizon</div>
    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px">
      <PredictionCard v-for="p in aiPredictions" :key="p.id" :prediction="p" />
    </div>

    <!-- Charts row -->
    <div class="grid-2" style="margin-bottom:16px">
      <TrendChart
        title="7-Day Risk Score Trend"
        :labels="trendData.riskScore.labels"
        :series="trendData.riskScore.series"
        :height="200"
        type="line"
        :fill="true"
      />
      <TrendChart
        title="Prediction Confidence Distribution"
        :labels="confData.labels"
        :series="confData.series"
        type="bar"
        :height="200"
        :legend="false"
      />
    </div>

    <!-- Explainable AI section -->
    <div class="card xai-section">
      <div class="card-header">
        <span class="card-title">🔍 Explainable AI — Gas Risk Model Feature Importance</span>
        <span class="tag tag-info">XAI Report</span>
      </div>
      <div class="card-body">
        <div class="xai-subtitle">Why is the AI predicting elevated gas risk in Zone B?</div>
        <div class="xai-factors">
          <div v-for="f in xaiExplanations" :key="f.factor" class="xai-factor">
            <div class="xai-factor-header">
              <span class="xai-icon">{{ f.icon }}</span>
              <span class="xai-label">{{ f.factor }}</span>
              <span class="xai-weight">{{ f.weight }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: f.weight + '%', background: f.weight > 25 ? 'var(--status-warn)' : 'var(--status-info)' }"></div>
            </div>
            <div class="xai-desc">{{ f.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Model info card -->
    <div class="card model-info" style="margin-top:16px">
      <div class="card-header"><span class="card-title">⚙️ AI Model Information</span></div>
      <div class="card-body model-grid">
        <div v-for="m in [
          { label:'Model Type', value:'Ensemble (LSTM + XGBoost + Random Forest)' },
          { label:'Training Data', value:'36 months historical sensor data (2.4M records)' },
          { label:'Prediction Window', value:'2h, 8h, 24h, 48h horizons' },
          { label:'Last Retrained', value:'2024-12-18 (weekly schedule)' },
          { label:'F1 Score (Gas Model)', value:'0.91 on hold-out test set' },
          { label:'False Positive Rate', value:'8.2% (industry best: 12%)' },
          { label:'Data Sources', value:'12 sensor types, 3 wearable metrics, 2 equipment feeds' },
          { label:'Model Version', value:'v3.2.1 — Production' },
        ]" :key="m.label" class="mi-row">
          <span class="mi-label">{{ m.label }}</span>
          <span class="mi-value">{{ m.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gauge-row { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }
.xai-subtitle { font-size:0.8rem; color:var(--text-secondary); margin-bottom:14px; font-style:italic; }
.xai-factors { display:flex; flex-direction:column; gap:12px; }
.xai-factor { background:var(--bg-secondary); border-radius:var(--radius-md); padding:10px 14px; }
.xai-factor-header { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.xai-icon { font-size:1rem; }
.xai-label { font-size:0.82rem; font-weight:600; color:var(--text-primary); flex:1; }
.xai-weight { font-size:0.9rem; font-weight:700; font-family:var(--font-mono); color:var(--accent-blue); }
.xai-desc { font-size:0.72rem; color:var(--text-muted); margin-top:5px; }

.model-grid { display:flex; flex-direction:column; gap:6px; }
.mi-row { display:flex; gap:12px; padding:5px 0; border-bottom:1px solid var(--border-base); font-size:0.78rem; }
.mi-row:last-child { border-bottom:none; }
.mi-label { color:var(--text-muted); min-width:180px; flex-shrink:0; }
.mi-value { color:var(--text-primary); font-family:var(--font-mono); }

@media(max-width:1200px){ .gauge-row { grid-template-columns:repeat(3,1fr); } }
@media(max-width:768px){ .gauge-row { grid-template-columns:repeat(2,1fr); } }
</style>
