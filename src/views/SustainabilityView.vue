<script setup>
import { sustainabilityMetrics, sustainabilityRecommendations, environmentalIncidents, trendData } from '../data/mockData.js'
import SustainabilityScorecard from '../components/SustainabilityScorecard.vue'
import SdgAlignmentPanel from '../components/SdgAlignmentPanel.vue'
import EnvironmentalRiskMap from '../components/EnvironmentalRiskMap.vue'
import EsgReadinessPanel from '../components/EsgReadinessPanel.vue'
import TrendChart from '../components/TrendChart.vue'
import StatusBadge from '../components/StatusBadge.vue'

const priorities = {
  high: sustainabilityRecommendations.filter(r => r.priority === 'high'),
  medium: sustainabilityRecommendations.filter(r => r.priority === 'medium'),
}
</script>

<template>
  <div>
    <div class="sustain-header">
      <div>
        <h1 class="page-title">🌿 Sustainability Intelligence</h1>
        <p class="page-subtitle">AI connects safety excellence with sustainable development · SDG Alignment · ESG Readiness</p>
      </div>
      <div class="esg-badge card">
        <div class="esg-badge-inner">
          <div class="esg-score-big">87%</div>
          <div class="esg-label-big">ESG Readiness</div>
          <div class="esg-sublabel">Investor-grade</div>
        </div>
      </div>
    </div>

    <!-- Key message banner -->
    <div class="message-banner card" style="margin-bottom:16px">
      <div class="mb-content">
        <div class="mb-icon">💡</div>
        <div>
          <div class="mb-title">AI Safety Systems Are Sustainability Systems</div>
          <div class="mb-text">Every worker health alert prevented reduces lost-time injuries (SDG 3 & 8). Every gas hazard detected early reduces fugitive emissions (SDG 13). Every predictive maintenance action reduces energy waste (SDG 12). This dashboard shows how AI-driven safety creates measurable sustainability co-benefits.</div>
        </div>
      </div>
    </div>

    <!-- Sustainability Scorecard -->
    <div class="section-title" style="margin-bottom:10px">📊 Key Sustainability Metrics</div>
    <div style="margin-bottom:20px">
      <SustainabilityScorecard />
    </div>

    <!-- Sustainability trend chart -->
    <div style="margin-bottom:16px">
      <TrendChart
        title="Sustainability Trends — 12 Months"
        :labels="trendData.sustainability.labels"
        :series="trendData.sustainability.series"
        :height="200"
        type="line"
      />
    </div>

    <!-- Environmental Risk Map -->
    <div style="margin-bottom:16px">
      <EnvironmentalRiskMap />
    </div>

    <!-- AI Sustainability Recommendations -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">🤖 AI Sustainability Recommendations</span>
        <span class="tag tag-info">{{ sustainabilityRecommendations.length }} Actions</span>
      </div>
      <div class="card-body">
        <div class="recs-grid">
          <div v-for="r in sustainabilityRecommendations" :key="r.id" :class="['rec-card', `rec-${r.priority}`]">
            <div class="rec-top">
              <span class="rec-emoji">{{ r.icon }}</span>
              <span :class="['tag', r.priority === 'high' ? 'tag-crit' : 'tag-warn']">{{ r.priority.toUpperCase() }}</span>
            </div>
            <div class="rec-title">{{ r.title }}</div>
            <div class="rec-desc">{{ r.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Environmental Incidents -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">🌍 Environmental Incident Log</span></div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr><th>Date</th><th>Type</th><th>Severity</th><th>Zone</th><th>Description</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for="ei in environmentalIncidents" :key="ei.id">
              <td class="mono" style="font-size:0.72rem">{{ ei.date }}</td>
              <td>{{ ei.type }}</td>
              <td><StatusBadge :status="ei.severity" /></td>
              <td><span class="zone-chip">{{ ei.zone }}</span></td>
              <td style="font-size:0.75rem; color:var(--text-secondary)">{{ ei.description }}</td>
              <td><StatusBadge :status="ei.status === 'active' ? 'warning' : 'resolved'" :label="ei.status.toUpperCase()" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SDG Alignment Panel -->
    <div class="section-title" style="margin-bottom:10px">🌐 UN SDG Alignment — Click any SDG for details</div>
    <div style="margin-bottom:16px">
      <SdgAlignmentPanel />
    </div>

    <!-- ESG Readiness Panel -->
    <div class="section-title" style="margin-bottom:10px">📋 ESG Readiness Breakdown</div>
    <EsgReadinessPanel />
  </div>
</template>

<style scoped>
.sustain-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
.esg-badge { padding:14px 20px; text-align:center; border-color:var(--sustain-green); }
.esg-badge-inner {}
.esg-score-big { font-size:2rem; font-weight:800; color:var(--sustain-green); font-family:var(--font-mono); line-height:1; }
.esg-label-big { font-size:0.75rem; font-weight:600; color:var(--text-secondary); margin-top:3px; }
.esg-sublabel { font-size:0.65rem; color:var(--text-muted); }

.message-banner { border-color:rgba(59,130,246,0.3); background:rgba(59,130,246,0.05); }
.mb-content { display:flex; gap:14px; align-items:flex-start; }
.mb-icon { font-size:1.6rem; flex-shrink:0; }
.mb-title { font-size:0.92rem; font-weight:700; color:var(--text-primary); margin-bottom:5px; }
.mb-text  { font-size:0.78rem; color:var(--text-secondary); line-height:1.5; }

.recs-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.rec-card { background:var(--bg-secondary); border-radius:var(--radius-md); padding:12px; border-left:3px solid var(--border-card); }
.rec-card.rec-high   { border-left-color:var(--status-crit); }
.rec-card.rec-medium { border-left-color:var(--status-warn); }
.rec-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
.rec-emoji { font-size:1.2rem; }
.rec-title { font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:5px; }
.rec-desc  { font-size:0.72rem; color:var(--text-secondary); line-height:1.4; }

.zone-chip { font-family:var(--font-mono); font-size:0.68rem; background:rgba(6,182,212,0.08); color:var(--accent-cyan); padding:1px 6px; border-radius:4px; }

@media(max-width:1100px){ .recs-grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:768px) { .recs-grid { grid-template-columns:1fr; } .sustain-header { flex-direction:column; } }
</style>
