<script setup>
import { ref, computed } from 'vue'
import KpiCard from '../components/KpiCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import NoiseExposureDrawer from '../components/NoiseExposureDrawer.vue'
import {
  noiseKpis,
  zoneNoiseLevels,
  workerNoiseExposure,
  noiseAnomalies,
  noiseRecommendedControls,
  noiseComplianceEvidence,
} from '../data/mockData.js'

// ── KPI filter state ─────────────────────────────────────────────────────────
const activeKpiFilter = ref(null)

function onKpiClick(id) {
  activeKpiFilter.value = activeKpiFilter.value === id ? null : id
}

const filteredWorkers = computed(() => {
  if (activeKpiFilter.value === 'above-action') {
    return workerNoiseExposure.filter(w => w.status === 'warning' || w.status === 'critical')
  }
  if (activeKpiFilter.value === 'peak-events') {
    return workerNoiseExposure.filter(w => w.peakDb >= 100)
  }
  return workerNoiseExposure
})

// ── Worker drawer ────────────────────────────────────────────────────────────
const selectedWorker = ref(null)
function openWorker(w) {
  selectedWorker.value = selectedWorker.value?.id === w.id ? null : w
}

// ── Anomaly → heatmap highlight ──────────────────────────────────────────────
const highlightedZone = ref(null)
function onAnomalyClick(anomaly) {
  highlightedZone.value = highlightedZone.value === anomaly.zoneId ? null : anomaly.zoneId
}

// ── Zone noise level helpers ─────────────────────────────────────────────────
function zoneStatusColor(status) {
  if (status === 'critical') return 'var(--status-crit)'
  if (status === 'warning')  return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function zoneBg(status) {
  if (status === 'critical') return 'var(--status-crit-bg)'
  if (status === 'warning')  return 'var(--status-warn-bg)'
  return 'var(--status-ok-bg)'
}
function zoneBorder(status, zoneId) {
  if (zoneId === highlightedZone.value) return 'var(--accent-cyan)'
  if (status === 'critical') return 'var(--status-crit-border)'
  if (status === 'warning')  return 'var(--status-warn-border)'
  return 'var(--status-ok-border)'
}
function dbaBarWidth(dba) {
  return Math.min((dba / 120) * 100, 100) + '%'
}

// ── Table helpers ────────────────────────────────────────────────────────────
function dbaColor(v) {
  if (v >= 90) return 'var(--status-crit)'
  if (v >= 85) return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function doseColor(v) {
  if (v >= 80) return 'var(--status-crit)'
  if (v >= 50) return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function ppeColor(v) {
  return v === 'Verified' ? 'var(--status-ok)' : 'var(--status-crit)'
}
</script>

<template>
  <div class="noise-view">

    <!-- Page header -->
    <div class="page-header-block">
      <h1 class="page-title">🔊 Noise Exposure Intelligence</h1>
      <p class="page-subtitle">Continuous hearing conservation using sensors, wearables, and AI</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid" style="margin-bottom:16px">
      <KpiCard
        v-for="k in noiseKpis"
        :key="k.id"
        :id="k.id"
        :title="k.title"
        :value="k.value"
        :unit="k.unit"
        :icon="k.icon"
        :status="k.status"
        :change="k.change"
        :hoverSummary="k.hoverSummary"
        :isActive="activeKpiFilter === k.id"
        @card-click="onKpiClick"
      />
    </div>

    <!-- Active filter banner -->
    <div v-if="activeKpiFilter" class="filter-banner" style="margin-bottom:12px">
      <span>🔍 Showing filtered workers — <strong>{{ filteredWorkers.length }}</strong> records</span>
      <button class="filter-clear" @click="activeKpiFilter = null">Clear filter ✕</button>
    </div>

    <!-- Main content: heatmap + table -->
    <div class="main-row" style="margin-bottom:16px">

      <!-- Noise Heatmap -->
      <div class="card heatmap-card">
        <div class="card-header">
          <span class="card-title">🗺️ Noise Heatmap by Zone</span>
          <span v-if="highlightedZone" class="hm-clear-link" @click="highlightedZone = null">Clear highlight</span>
        </div>
        <div class="card-body">
          <div class="heatmap-grid">
            <div
              v-for="z in zoneNoiseLevels"
              :key="z.id"
              class="hm-zone"
              :class="{ 'hm-highlighted': highlightedZone === z.id }"
              :style="{
                background: zoneBg(z.status),
                borderColor: zoneBorder(z.status, z.id),
              }"
            >
              <div class="hmz-top">
                <span class="hmz-name">{{ z.name }}</span>
                <StatusBadge :status="z.status" />
              </div>
              <div class="hmz-dba" :style="{ color: zoneStatusColor(z.status) }">
                {{ z.dba }} <span class="hmz-unit">dBA</span>
              </div>
              <div class="hmz-bar-track">
                <div
                  class="hmz-bar-fill"
                  :style="{ width: dbaBarWidth(z.dba), background: zoneStatusColor(z.status) }"
                ></div>
                <div class="hmz-bar-marker" style="left:70.8%">85</div>
              </div>
              <div class="hmz-meta">
                <span>{{ z.workers }} workers</span>
                <span class="hmz-trend">{{ z.trend }}</span>
              </div>
              <div class="hmz-note">{{ z.note }}</div>
            </div>
          </div>
          <div class="heatmap-legend">
            <span class="hl-item crit">■ Critical ≥90 dBA</span>
            <span class="hl-item warn">■ Warning 85–89 dBA</span>
            <span class="hl-item norm">■ Normal &lt;85 dBA</span>
            <span class="hl-item cyan">■ Anomaly Linked</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Worker Exposure Table -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">👷 Worker Noise Exposure</span>
        <span class="table-count">{{ filteredWorkers.length }} workers</span>
      </div>
      <div class="card-body table-wrap">
        <table class="noise-table">
          <thead>
            <tr>
              <th>Worker</th>
              <th>Zone</th>
              <th>8h TWA</th>
              <th>Peak dB</th>
              <th>Daily Dose</th>
              <th>PPE</th>
              <th>Status</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="w in filteredWorkers"
              :key="w.id"
              class="noise-row"
              :class="{ 'row-active': selectedWorker?.id === w.id }"
              @click="openWorker(w)"
            >
              <td>
                <div class="worker-cell">
                  <span class="worker-name">{{ w.name }}</span>
                  <span class="worker-id">{{ w.id }}</span>
                </div>
              </td>
              <td><span class="zone-chip">{{ w.zone }}</span></td>
              <td><span class="mono-val" :style="{ color: dbaColor(w.twa8h) }">{{ w.twa8h }} dBA</span></td>
              <td><span class="mono-val" :style="{ color: dbaColor(w.peakDb - 20) }">{{ w.peakDb }} dB</span></td>
              <td>
                <div class="dose-cell">
                  <span class="mono-val" :style="{ color: doseColor(w.dailyDose) }">{{ w.dailyDose }}%</span>
                  <div class="dose-mini-track">
                    <div class="dose-mini-fill" :style="{ width: Math.min(w.dailyDose, 100) + '%', background: doseColor(w.dailyDose) }"></div>
                  </div>
                </div>
              </td>
              <td><span class="ppe-chip" :style="{ color: ppeColor(w.ppeStatus) }">{{ w.ppeStatus }}</span></td>
              <td><StatusBadge :status="w.status" /></td>
              <td><span class="rec-text">{{ w.recommendation }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bottom row: AI Anomalies + XAI + Controls -->
    <div class="bottom-row" style="margin-bottom:16px">

      <!-- AI Anomaly Detection -->
      <div class="card">
        <div class="card-header"><span class="card-title">🤖 AI Noise Anomaly Detection</span></div>
        <div class="card-body anomaly-list">
          <div
            v-for="a in noiseAnomalies"
            :key="a.id"
            class="anomaly-card"
            :class="{ 'anomaly-active': highlightedZone === a.zoneId }"
            @click="onAnomalyClick(a)"
          >
            <div class="ac-top">
              <div class="ac-left">
                <span class="ac-asset">{{ a.asset }}</span>
                <StatusBadge :status="a.status" />
              </div>
              <div class="ac-conf" :class="a.status">{{ a.confidence }}% <span class="ac-conf-label">conf.</span></div>
            </div>
            <div class="ac-anomaly">{{ a.anomaly }}</div>
            <div class="ac-detail">{{ a.detail }}</div>
            <div class="ac-action">
              <span class="ac-action-label">Action:</span> {{ a.recommendedAction.split('.')[0] }}
            </div>
            <div class="ac-time">Detected {{ a.detectedAt }}</div>
          </div>
        </div>
      </div>

      <!-- XAI + Controls column -->
      <div class="xai-controls-col">

        <!-- Explainable AI -->
        <div class="card" style="margin-bottom:12px">
          <div class="card-header"><span class="card-title">💡 Why AI Flagged This</span></div>
          <div class="card-body">
            <div class="xai-box">
              <p class="xai-text">{{ workerNoiseExposure[0].aiExplanation }}</p>
            </div>
          </div>
        </div>

        <!-- Compliance Evidence -->
        <div class="card">
          <div class="card-header"><span class="card-title">📄 Compliance Evidence</span></div>
          <div class="card-body">
            <div class="compliance-grid">
              <div class="ce-item">
                <div class="ce-val">{{ noiseComplianceEvidence.exposureLogs }}</div>
                <div class="ce-label">Exposure Logs</div>
              </div>
              <div class="ce-item">
                <div class="ce-val">{{ noiseComplianceEvidence.workersMonitored }}</div>
                <div class="ce-label">Workers Monitored</div>
              </div>
              <div class="ce-item crit">
                <div class="ce-val">{{ noiseComplianceEvidence.thresholdBreaches }}</div>
                <div class="ce-label">Threshold Breaches</div>
              </div>
              <div class="ce-item">
                <div class="ce-val">{{ noiseComplianceEvidence.ppeRecords }}</div>
                <div class="ce-label">PPE Records</div>
              </div>
            </div>
            <div class="ce-meta">
              <span>{{ noiseComplianceEvidence.reportPeriod }}</span>
              <span class="ce-std">{{ noiseComplianceEvidence.standard }}</span>
            </div>
            <button class="export-btn" disabled>⬇ Export Compliance Report (Demo)</button>
          </div>
        </div>

      </div>
    </div>

    <!-- Recommended Controls -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">🛡️ Recommended Controls — Hierarchy</span></div>
      <div class="card-body controls-grid">
        <div v-for="ctrl in noiseRecommendedControls" :key="ctrl.level" class="ctrl-panel" :style="{ borderColor: ctrl.color + '44' }">
          <div class="ctrl-header" :style="{ color: ctrl.color }">
            <span class="ctrl-icon">{{ ctrl.icon }}</span>
            <span class="ctrl-level">{{ ctrl.level }}</span>
          </div>
          <ul class="ctrl-list">
            <li v-for="(item, i) in ctrl.items" :key="i" class="ctrl-item">
              <span class="ctrl-dot" :style="{ background: ctrl.color }"></span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Demo disclaimer -->
    <div class="demo-footer">
      ℹ️ Demo data for safety monitoring concept. Thresholds and reporting rules should be aligned with applicable local occupational health regulations.
    </div>

  </div>

  <!-- Worker detail drawer -->
  <NoiseExposureDrawer :worker="selectedWorker" @close="selectedWorker = null" />

</template>

<style scoped>
.noise-view { padding-bottom: 32px; }

.page-header-block { margin-bottom: 16px; }

.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

.filter-banner {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--status-info-bg); border: 1px solid var(--status-info-border);
  border-radius: var(--radius-md); padding: 8px 14px; font-size: 0.78rem; color: var(--text-secondary);
}
.filter-clear {
  background: none; border: 1px solid var(--status-info-border); color: var(--accent-blue);
  padding: 3px 10px; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.72rem;
  transition: all var(--transition-fast);
}
.filter-clear:hover { background: var(--status-info-bg); }

.main-row { display: grid; grid-template-columns: 1fr; gap: 14px; }
.heatmap-card { flex: 1; }
.hm-clear-link {
  font-size: 0.68rem; color: var(--accent-cyan); cursor: pointer;
  padding: 2px 8px; border: 1px solid rgba(6,182,212,0.3); border-radius: 4px;
}
.hm-clear-link:hover { background: rgba(6,182,212,0.1); }

.heatmap-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 10px; }
.hm-zone {
  border: 1px solid transparent; border-radius: var(--radius-md); padding: 12px;
  transition: all var(--transition-base); cursor: default;
}
.hm-highlighted {
  border-color: var(--accent-cyan) !important;
  box-shadow: 0 0 12px rgba(6,182,212,0.3);
}
.hmz-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; gap: 4px; flex-wrap: wrap; }
.hmz-name { font-size: 0.7rem; font-weight: 700; color: var(--text-primary); }
.hmz-dba { font-size: 1.5rem; font-weight: 700; font-family: var(--font-mono); line-height: 1.1; margin-bottom: 6px; }
.hmz-unit { font-size: 0.7rem; font-weight: 400; color: var(--text-muted); }
.hmz-bar-track { position: relative; height: 5px; background: rgba(255,255,255,0.08); border-radius: 3px; margin-bottom: 14px; }
.hmz-bar-fill { height: 100%; border-radius: 3px; }
.hmz-bar-marker {
  position: absolute; bottom: -14px; transform: translateX(-50%);
  font-size: 0.55rem; color: var(--text-dim);
}
.hmz-bar-marker::before {
  content: ''; position: absolute; left: 50%; bottom: 14px; height: 5px;
  width: 1px; background: var(--text-dim); transform: translateX(-50%);
}
.hmz-meta { display: flex; justify-content: space-between; font-size: 0.62rem; color: var(--text-muted); margin-bottom: 3px; }
.hmz-trend { font-style: italic; }
.hmz-note { font-size: 0.6rem; color: var(--text-dim); }

.heatmap-legend {
  display: flex; gap: 16px; flex-wrap: wrap;
  font-size: 0.62rem; color: var(--text-muted); padding-top: 8px;
  border-top: 1px solid var(--border-base);
}
.hl-item.crit { color: var(--status-crit); }
.hl-item.warn { color: var(--status-warn); }
.hl-item.norm { color: var(--status-ok); }
.hl-item.cyan { color: var(--accent-cyan); }

.table-count { font-size: 0.68rem; color: var(--text-muted); background: var(--bg-secondary); padding: 2px 8px; border-radius: 10px; }
.table-wrap { overflow-x: auto; }
.noise-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
.noise-table th {
  text-align: left; padding: 8px 10px; font-size: 0.65rem; font-weight: 700;
  color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.06em;
  border-bottom: 1px solid var(--border-base); white-space: nowrap;
}
.noise-row {
  border-bottom: 1px solid var(--border-base); cursor: pointer;
  transition: background var(--transition-fast);
}
.noise-row:hover { background: var(--bg-card-hover); }
.noise-row.row-active { background: var(--status-info-bg); }
.noise-row td { padding: 9px 10px; vertical-align: middle; }

.worker-cell { display: flex; flex-direction: column; gap: 2px; }
.worker-name { font-weight: 600; color: var(--text-primary); }
.worker-id { font-size: 0.65rem; font-family: var(--font-mono); color: var(--text-muted); }

.zone-chip {
  font-size: 0.68rem; padding: 2px 8px; border-radius: 10px;
  background: rgba(6,182,212,0.1); color: var(--accent-cyan);
  border: 1px solid rgba(6,182,212,0.25); white-space: nowrap;
}
.mono-val { font-family: var(--font-mono); font-weight: 600; font-size: 0.8rem; }

.dose-cell { display: flex; flex-direction: column; gap: 3px; min-width: 64px; }
.dose-mini-track { height: 3px; background: var(--bg-secondary); border-radius: 2px; }
.dose-mini-fill { height: 100%; border-radius: 2px; }

.ppe-chip { font-size: 0.72rem; font-weight: 600; }
.rec-text { font-size: 0.7rem; color: var(--text-secondary); }

/* Bottom row */
.bottom-row { display: grid; grid-template-columns: 1fr 380px; gap: 14px; align-items: start; }

.anomaly-list { display: flex; flex-direction: column; gap: 10px; }
.anomaly-card {
  background: var(--bg-secondary); border-radius: var(--radius-md);
  padding: 12px 14px; border: 1px solid var(--border-base);
  cursor: pointer; transition: all var(--transition-fast);
}
.anomaly-card:hover { border-color: var(--border-accent); background: var(--bg-card-hover); }
.anomaly-card.anomaly-active { border-color: var(--accent-cyan); box-shadow: 0 0 10px rgba(6,182,212,0.2); }
.ac-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
.ac-left { display: flex; align-items: center; gap: 8px; }
.ac-asset { font-size: 0.82rem; font-weight: 700; color: var(--text-primary); }
.ac-conf { font-size: 0.85rem; font-weight: 700; font-family: var(--font-mono); }
.ac-conf.warning { color: var(--status-warn); }
.ac-conf.critical { color: var(--status-crit); }
.ac-conf-label { font-size: 0.6rem; font-weight: 400; color: var(--text-muted); }
.ac-anomaly { font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 3px; }
.ac-detail { font-size: 0.68rem; color: var(--text-muted); margin-bottom: 5px; line-height: 1.45; }
.ac-action { font-size: 0.68rem; color: var(--accent-blue); }
.ac-action-label { color: var(--text-dim); }
.ac-time { font-size: 0.6rem; color: var(--text-dim); margin-top: 3px; }

.xai-controls-col { display: flex; flex-direction: column; }
.xai-box { background: var(--bg-secondary); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 12px 14px; }
.xai-text { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }

.compliance-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 10px; }
.ce-item { background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 10px; text-align: center; }
.ce-item.crit .ce-val { color: var(--status-crit); }
.ce-val { font-size: 1.3rem; font-weight: 700; font-family: var(--font-mono); color: var(--text-primary); }
.ce-label { font-size: 0.62rem; color: var(--text-muted); margin-top: 2px; }
.ce-meta {
  display: flex; justify-content: space-between; font-size: 0.62rem; color: var(--text-dim);
  margin-bottom: 10px; padding: 4px 0; border-top: 1px solid var(--border-base);
}
.ce-std { font-family: var(--font-mono); }
.export-btn {
  width: 100%; background: var(--bg-secondary); border: 1px solid var(--border-card);
  color: var(--text-muted); padding: 7px; border-radius: var(--radius-sm);
  font-size: 0.75rem; cursor: not-allowed; font-family: var(--font-sans);
  opacity: 0.7;
}

/* Controls hierarchy */
.controls-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.ctrl-panel {
  border: 1px solid transparent; border-radius: var(--radius-md);
  padding: 14px; background: var(--bg-secondary);
}
.ctrl-header { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.ctrl-icon { font-size: 1rem; }
.ctrl-level { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.ctrl-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 7px; }
.ctrl-item {
  display: flex; align-items: flex-start; gap: 6px;
  font-size: 0.7rem; color: var(--text-secondary); line-height: 1.45;
}
.ctrl-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }

.demo-footer {
  font-size: 0.68rem; color: var(--text-dim); padding: 10px 14px;
  border: 1px solid var(--border-base); border-radius: var(--radius-sm);
  background: var(--bg-secondary); line-height: 1.5;
}

/* Responsive */
@media (max-width: 1200px) {
  .heatmap-grid { grid-template-columns: repeat(3, 1fr); }
  .bottom-row { grid-template-columns: 1fr; }
  .xai-controls-col { flex-direction: row; gap: 12px; }
  .xai-controls-col .card { flex: 1; }
}
@media (max-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .heatmap-grid { grid-template-columns: repeat(2, 1fr); }
  .controls-grid { grid-template-columns: repeat(2, 1fr); }
  .xai-controls-col { flex-direction: column; }
}
@media (max-width: 600px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .heatmap-grid { grid-template-columns: 1fr; }
  .controls-grid { grid-template-columns: 1fr; }
  .bottom-row { grid-template-columns: 1fr; }
}
</style>
