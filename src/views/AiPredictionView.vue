<script setup>
import { ref, computed } from 'vue'
import { aiPredictions, trendData } from '../data/mockData.js'
import PredictionCard from '../components/PredictionCard.vue'
import TrendChart from '../components/TrendChart.vue'
import RiskGauge from '../components/RiskGauge.vue'

const riskScores = { overall:67, health:55, gas:72, equipment:52, environmental:38 }

const confData = {
  labels:['< 60%','60–70%','70–80%','80–90%','> 90%'],
  series:[{ name:'Predictions', color:'#3b82f6', values:[1,2,4,6,3] }]
}

// ── Selection ──────────────────────────────────────────────────────────────
const selectedId   = ref(null)
const selectedPrediction = computed(() => aiPredictions.find(p => p.id === selectedId.value) || null)

function selectPrediction(p) {
  if (selectedId.value === p.id) { selectedId.value = null; return }
  selectedId.value = p.id
  selectedAction.value = null
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
const LIFECYCLE = ['Predicted','Acknowledged','Mitigating','Risk Reduced','Closed']
const lifecycleOverrides = ref({})

function getLifecycle(id) {
  return lifecycleOverrides.value[id] || (aiPredictions.find(p => p.id === id)?.status ?? 'Predicted')
}
function advanceLifecycle(id) {
  const idx = LIFECYCLE.indexOf(getLifecycle(id))
  if (idx < LIFECYCLE.length - 1)
    lifecycleOverrides.value = { ...lifecycleOverrides.value, [id]: LIFECYCLE[idx + 1] }
}
function lifecycleNext(id) {
  const idx = LIFECYCLE.indexOf(getLifecycle(id))
  return idx < LIFECYCLE.length - 1 ? LIFECYCLE[idx + 1] : null
}

// ── What-if Simulation ─────────────────────────────────────────────────────
const selectedAction = ref(null)

function selectAction(id) {
  selectedAction.value = selectedAction.value === id ? null : id
}

const activeAction = computed(() => {
  if (!selectedPrediction.value || !selectedAction.value) return null
  return selectedPrediction.value.whatIfActions.find(a => a.id === selectedAction.value) || null
})

const simulatedScore = computed(() => {
  if (activeAction.value) return activeAction.value.simulatedScore
  return selectedPrediction.value?.score ?? null
})

// ── Color helpers ──────────────────────────────────────────────────────────
function sevColor(s) {
  if (s === 'critical') return 'var(--status-crit)'
  if (s === 'warning')  return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function scoreColor(v) {
  if (v >= 65) return 'var(--status-crit)'
  if (v >= 40) return 'var(--status-warn)'
  return 'var(--status-ok)'
}

// ── Static bottom XAI (gas model) ─────────────────────────────────────────
const xaiExplanations = [
  { factor:'Gas Sensor Trend',     weight:35, icon:'📡', desc:'Methane upward trend at 3 sensors over 4 hours' },
  { factor:'Weather Pattern',      weight:22, icon:'🌤️',  desc:'Westerly wind reducing natural ventilation by 40%' },
  { factor:'Shift Duration',       weight:18, icon:'⏱️',  desc:'Blast crew at 7h+ continuous shift — elevated risk' },
  { factor:'Historical Incidents', weight:15, icon:'📚', desc:'3 gas incidents in Zone B in past 90 days' },
  { factor:'Sensor Calibration',   weight:10, icon:'🔧', desc:'GS-02 calibration overdue 3 days — reliability reduced' },
]
</script>

<template>
  <div class="aip-view">
    <div>
      <h1 class="page-title">🤖 AI Prediction Engine</h1>
      <p class="page-subtitle" style="margin-bottom:16px">24-hour risk forecast · Explainable AI · Decision support · Confidence scoring</p>
    </div>

    <!-- Risk Gauges -->
    <div class="gauge-row" style="margin-bottom:16px">
      <RiskGauge title="Overall Risk"   :value="riskScores.overall"       :warnAt="40" :critAt="65" subtitle="AI composite score" />
      <RiskGauge title="Health Risk"    :value="riskScores.health"        :warnAt="40" :critAt="65" subtitle="Worker safety" />
      <RiskGauge title="Gas Risk"       :value="riskScores.gas"           :warnAt="40" :critAt="65" subtitle="Atmospheric hazard" />
      <RiskGauge title="Equipment"      :value="riskScores.equipment"     :warnAt="40" :critAt="65" subtitle="Mechanical failure" />
      <RiskGauge title="Environmental"  :value="riskScores.environmental" :warnAt="40" :critAt="65" subtitle="Environmental risk" />
    </div>

    <!-- ── Two-column: prediction cards + detail panel ───────────────────── -->
    <div class="pred-layout">

      <!-- LEFT: prediction list -->
      <div class="pred-list-col">
        <div class="section-title" style="margin-bottom:10px">🔮 Active AI Predictions — 24-Hour Horizon</div>
        <div class="pred-cards-list">
          <PredictionCard
            v-for="p in aiPredictions"
            :key="p.id"
            :prediction="p"
            :isActive="selectedId === p.id"
            @select="selectPrediction"
          />
        </div>
      </div>

      <!-- RIGHT: detail panel -->
      <div class="pred-detail-col">

        <!-- Empty state -->
        <div v-if="!selectedPrediction" class="detail-empty card">
          <div class="de-icon">🔮</div>
          <div class="de-title">AI Decision Support</div>
          <div class="de-sub">Select a prediction to see full explainable AI analysis, 24-hour forecast, what-if simulation, and ranked recommended actions.</div>
          <div class="de-hint">
            <span v-for="p in aiPredictions" :key="p.id" class="de-pill" @click="selectPrediction(p)">{{ p.title }}</span>
          </div>
        </div>

        <!-- Detail panels -->
        <template v-else>

          <!-- Header + lifecycle -->
          <div class="card detail-header-card" style="margin-bottom:10px">
            <div class="dh-top">
              <div class="dh-title">{{ selectedPrediction.title }}</div>
              <button class="close-btn" @click="selectedId = null">✕</button>
            </div>
            <div class="dh-target">📍 {{ selectedPrediction.target }}</div>
            <div class="dh-meta-row">
              <span class="dh-chip">⏱ {{ selectedPrediction.timeToRisk }}</span>
              <span class="dh-chip" :style="{ color: scoreColor(selectedPrediction.score) }">
                Risk Score: <strong>{{ selectedPrediction.score }}</strong>
              </span>
              <span class="dh-chip">{{ selectedPrediction.confidence }}% confidence</span>
              <span class="dh-chip" v-if="selectedPrediction.affectedWorkers > 0">
                👷 {{ selectedPrediction.affectedWorkers }} at risk
              </span>
            </div>

            <!-- Lifecycle progression -->
            <div class="lifecycle-strip">
              <div class="lc-steps">
                <template v-for="(step, i) in LIFECYCLE" :key="step">
                  <div class="lc-step" :class="{
                    'lc-done':   LIFECYCLE.indexOf(getLifecycle(selectedPrediction.id)) > i,
                    'lc-active': getLifecycle(selectedPrediction.id) === step,
                  }">
                    <div class="lc-dot"></div>
                    <div class="lc-label">{{ step }}</div>
                  </div>
                  <div v-if="i < LIFECYCLE.length - 1" class="lc-connector"
                    :class="{ 'lc-connector-done': LIFECYCLE.indexOf(getLifecycle(selectedPrediction.id)) > i }"
                  ></div>
                </template>
              </div>
              <button
                v-if="lifecycleNext(selectedPrediction.id)"
                class="lc-advance-btn"
                @click="advanceLifecycle(selectedPrediction.id)"
              >
                Mark: {{ lifecycleNext(selectedPrediction.id) }}
              </button>
            </div>
          </div>

          <!-- XAI Panel -->
          <div class="card" style="margin-bottom:10px">
            <div class="card-header">
              <span class="card-title">🔍 Why AI Flagged This</span>
              <div style="display:flex; gap:6px; flex-wrap:wrap">
                <span class="xai-badge" :class="selectedPrediction.dataQuality === 'High' ? 'badge-ok' : 'badge-warn'">
                  {{ selectedPrediction.dataQuality }} data quality
                </span>
                <span class="xai-badge badge-info">{{ selectedPrediction.sensorAgreement }}</span>
              </div>
            </div>
            <div class="card-body">
              <div class="xai-summary">{{ selectedPrediction.summary }}</div>
              <div class="xai-factors-dyn">
                <div v-for="(f, i) in selectedPrediction.factors" :key="i" class="xfi-row">
                  <span class="xfi-num">{{ i+1 }}</span>
                  <span class="xfi-text">{{ f }}</span>
                </div>
              </div>
              <div class="xai-sources">
                <span class="xs-label">Sources:</span>
                <span v-for="s in selectedPrediction.dataSources" :key="s" class="xs-chip">{{ s }}</span>
              </div>
              <div class="xai-refresh">Last refreshed: {{ selectedPrediction.lastRefresh }}</div>
            </div>
          </div>

          <!-- 24h Forecast Timeline -->
          <div class="card" style="margin-bottom:10px">
            <div class="card-header">
              <span class="card-title">📈 24-Hour Risk Forecast</span>
            </div>
            <div class="card-body">
              <div class="forecast-bars">
                <div v-for="f in selectedPrediction.forecast" :key="f.label" class="fb-col">
                  <div class="fb-score" :style="{ color: sevColor(f.severity) }">{{ f.score }}</div>
                  <div class="fb-bar-wrap">
                    <div class="fb-bar" :style="{ height: (f.score/100*60)+'px', background: sevColor(f.severity) }"></div>
                  </div>
                  <div class="fb-label">{{ f.label }}</div>
                  <div class="fb-sev" :style="{ color: sevColor(f.severity) }">{{ f.severity }}</div>
                </div>
              </div>
              <div class="forecast-legend">
                <span style="color:var(--status-crit)">■ Critical ≥65</span>
                <span style="color:var(--status-warn)">■ Warning ≥40</span>
                <span style="color:var(--status-ok)">■ Normal &lt;40</span>
              </div>
            </div>
          </div>

          <!-- What-if Simulation -->
          <div class="card" style="margin-bottom:10px">
            <div class="card-header">
              <span class="card-title">🧪 What-if Simulation</span>
              <span class="tag tag-info">AI Simulation</span>
            </div>
            <div class="card-body">
              <div class="whatif-score-row">
                <div class="ws-block">
                  <div class="ws-value" :style="{ color: scoreColor(selectedPrediction.score) }">{{ selectedPrediction.score }}</div>
                  <div class="ws-label">Current Score</div>
                </div>
                <div class="ws-arrow">→</div>
                <div class="ws-block">
                  <div class="ws-value" :style="{ color: activeAction ? scoreColor(simulatedScore) : 'var(--text-dim)' }">
                    {{ activeAction ? simulatedScore : '—' }}
                  </div>
                  <div class="ws-label">Simulated</div>
                </div>
                <div v-if="activeAction" class="ws-effect">{{ activeAction.effect }}</div>
              </div>
              <div class="whatif-actions">
                <button
                  v-for="a in selectedPrediction.whatIfActions"
                  :key="a.id"
                  class="wi-btn"
                  :class="{ 'wi-btn-active': selectedAction === a.id }"
                  @click="selectAction(a.id)"
                >
                  <span class="wi-icon">{{ a.icon }}</span>
                  <span>{{ a.label }}</span>
                </button>
              </div>
              <div v-if="activeAction" class="wi-explanation">💡 {{ activeAction.explanation }}</div>
              <div v-else class="wi-hint">Select an action above to simulate risk reduction.</div>
            </div>
          </div>

          <!-- Ranked Recommended Actions -->
          <div class="card" style="margin-bottom:10px">
            <div class="card-header">
              <span class="card-title">✅ Ranked Recommended Actions</span>
            </div>
            <div class="card-body">
              <div class="ra-list">
                <div v-for="a in selectedPrediction.recommendedActions" :key="a.rank" class="ra-row">
                  <div class="ra-rank">{{ a.rank }}</div>
                  <div class="ra-action">{{ a.action }}</div>
                  <div class="ra-reduction">{{ a.riskReduction }}</div>
                  <div class="ra-eta">⏱ {{ a.eta }}</div>
                  <div class="ra-owner">{{ a.owner }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk Chain -->
          <div class="card" style="margin-bottom:10px">
            <div class="card-header">
              <span class="card-title">🔗 Risk Chain Analysis</span>
            </div>
            <div class="card-body">
              <div class="risk-chain">
                <div v-for="(step, i) in selectedPrediction.riskChain" :key="i" class="rc-item">
                  <div class="rc-left">
                    <div class="rc-dot" :class="{ 'rc-dot-crit': i === selectedPrediction.riskChain.length - 1 }"></div>
                    <div v-if="i < selectedPrediction.riskChain.length - 1" class="rc-connector"></div>
                  </div>
                  <div class="rc-text" :class="{ 'rc-text-crit': i === selectedPrediction.riskChain.length - 1 }">{{ step }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Related modules -->
          <div class="related-modules">
            <span class="rm-label">Related modules:</span>
            <span v-for="m in selectedPrediction.relatedModules" :key="m" class="rm-chip">{{ m }}</span>
          </div>

        </template>
      </div>
    </div>

    <!-- ── Charts row ──────────────────────────────────────────────────────── -->
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

    <!-- ── Gas model XAI (static reference) ───────────────────────────────── -->
    <div class="card xai-section" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">🔍 Model Feature Importance — Gas Risk Model</span>
        <span class="tag tag-info">XAI Report</span>
      </div>
      <div class="card-body">
        <div class="xai-subtitle">Why does the AI weight gas risk highest on the current shift?</div>
        <div class="xai-factors">
          <div v-for="f in xaiExplanations" :key="f.factor" class="xai-factor">
            <div class="xai-factor-header">
              <span class="xai-icon">{{ f.icon }}</span>
              <span class="xai-label">{{ f.factor }}</span>
              <span class="xai-weight">{{ f.weight }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: f.weight+'%', background: f.weight > 25 ? 'var(--status-warn)' : 'var(--status-info)' }"></div>
            </div>
            <div class="xai-desc">{{ f.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Model info ─────────────────────────────────────────────────────── -->
    <div class="card model-info" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">⚙️ AI Model Information</span></div>
      <div class="card-body model-grid">
        <div v-for="m in [
          { label:'Model Type',           value:'Ensemble (LSTM + XGBoost + Random Forest)' },
          { label:'Training Data',         value:'36 months historical sensor data (2.4M records)' },
          { label:'Prediction Window',     value:'2h, 8h, 24h, 48h horizons' },
          { label:'Last Retrained',        value:'2024-12-18 (weekly schedule)' },
          { label:'F1 Score (Gas Model)', value:'0.91 on hold-out test set' },
          { label:'False Positive Rate',  value:'8.2% (industry best: 12%)' },
          { label:'Data Sources',         value:'12 sensor types, 3 wearable metrics, 2 equipment feeds' },
          { label:'Model Version',        value:'v3.2.1 — Production' },
        ]" :key="m.label" class="mi-row">
          <span class="mi-label">{{ m.label }}</span>
          <span class="mi-value">{{ m.value }}</span>
        </div>
      </div>
    </div>

    <div class="demo-note">
      ⚠️ AI predictions are simulated for demonstration of operational decision support. Real-world deployment requires validated sensor data, calibrated models, and qualified safety personnel.
    </div>
  </div>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────── */
.gauge-row { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }

.pred-layout { display:grid; grid-template-columns:420px 1fr; gap:14px; align-items:start; margin-bottom:16px; }
.pred-list-col { display:flex; flex-direction:column; }
.pred-cards-list { display:flex; flex-direction:column; gap:8px; }

.pred-detail-col { position:sticky; top:16px; max-height:calc(100vh - 90px); overflow-y:auto; scrollbar-width:thin; }

/* ── Empty state ─────────────────────────────────────────────── */
.detail-empty {
  display:flex; flex-direction:column; align-items:center; text-align:center;
  padding:40px 24px; gap:12px;
}
.de-icon { font-size:2.5rem; }
.de-title { font-size:1rem; font-weight:700; color:var(--text-primary); }
.de-sub { font-size:0.8rem; color:var(--text-muted); max-width:300px; line-height:1.6; }
.de-hint { display:flex; flex-wrap:wrap; gap:6px; justify-content:center; margin-top:8px; }
.de-pill {
  font-size:0.65rem; color:var(--accent-blue);
  background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.2);
  border-radius:20px; padding:3px 10px; cursor:pointer; transition:all var(--transition-base);
}
.de-pill:hover { background:rgba(59,130,246,0.15); }

/* ── Detail header card ──────────────────────────────────────── */
.detail-header-card { padding:14px 16px; }
.dh-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
.dh-title { font-size:0.92rem; font-weight:700; color:var(--text-primary); line-height:1.3; }
.close-btn {
  background:none; border:1px solid var(--border-base); color:var(--text-muted);
  border-radius:4px; width:22px; height:22px; cursor:pointer; font-size:0.7rem;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.close-btn:hover { background:var(--bg-secondary); color:var(--text-primary); }
.dh-target { font-size:0.72rem; color:var(--accent-cyan); margin-bottom:8px; }
.dh-meta-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
.dh-chip {
  font-size:0.67rem; color:var(--text-secondary);
  background:var(--bg-secondary); border:1px solid var(--border-base);
  border-radius:4px; padding:2px 7px;
}

/* ── Lifecycle ───────────────────────────────────────────────── */
.lifecycle-strip { border-top:1px solid var(--border-base); padding-top:10px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.lc-steps { display:flex; align-items:flex-start; flex:1; overflow:hidden; }
.lc-step { display:flex; flex-direction:column; align-items:center; flex-shrink:0; }
.lc-dot { width:10px; height:10px; border-radius:50%; background:var(--bg-secondary); border:2px solid var(--border-base); }
.lc-active .lc-dot { background:var(--accent-blue); border-color:var(--accent-blue); box-shadow:0 0 6px rgba(59,130,246,0.5); }
.lc-done .lc-dot { background:var(--status-ok); border-color:var(--status-ok); }
.lc-label { font-size:0.52rem; color:var(--text-dim); margin-top:3px; white-space:nowrap; }
.lc-active .lc-label { color:var(--accent-blue); font-weight:700; }
.lc-done .lc-label { color:var(--status-ok); }
.lc-connector { flex:1; height:2px; background:var(--border-base); margin-top:5px; }
.lc-connector-done { background:var(--status-ok); }
.lc-advance-btn {
  font-size:0.68rem; background:var(--accent-blue); color:white;
  border:none; border-radius:var(--radius-sm); padding:4px 10px; cursor:pointer; white-space:nowrap;
}
.lc-advance-btn:hover { opacity:0.85; }

/* ── Per-prediction XAI ──────────────────────────────────────── */
.xai-badge { font-size:0.6rem; padding:2px 7px; border-radius:10px; font-weight:600; }
.badge-ok   { background:rgba(34,197,94,0.1);  color:var(--status-ok);   border:1px solid rgba(34,197,94,0.2);  }
.badge-warn { background:rgba(245,158,11,0.1); color:var(--status-warn); border:1px solid rgba(245,158,11,0.2); }
.badge-info { background:rgba(59,130,246,0.08);color:var(--accent-blue); border:1px solid rgba(59,130,246,0.2); }

.xai-summary { font-size:0.78rem; color:var(--text-secondary); line-height:1.5; margin-bottom:10px; font-style:italic; }
.xai-factors-dyn { display:flex; flex-direction:column; gap:5px; margin-bottom:10px; }
.xfi-row { display:flex; align-items:flex-start; gap:8px; font-size:0.74rem; color:var(--text-secondary); }
.xfi-num {
  background:var(--accent-blue); color:white; font-size:0.6rem; font-weight:700;
  width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px;
}
.xfi-text { line-height:1.45; }
.xai-sources { display:flex; gap:5px; flex-wrap:wrap; align-items:center; margin-bottom:4px; }
.xs-label { font-size:0.62rem; color:var(--text-dim); }
.xs-chip {
  font-size:0.6rem; color:var(--text-muted); background:var(--bg-secondary);
  border:1px solid var(--border-base); border-radius:4px; padding:1px 6px;
}
.xai-refresh { font-size:0.6rem; color:var(--text-dim); }

/* ── Forecast timeline ───────────────────────────────────────── */
.forecast-bars { display:flex; gap:6px; margin-bottom:8px; }
.fb-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; }
.fb-score { font-size:0.65rem; font-family:var(--font-mono); font-weight:700; height:14px; }
.fb-bar-wrap { height:60px; display:flex; align-items:flex-end; width:100%; }
.fb-bar { width:100%; border-radius:3px 3px 0 0; min-height:3px; transition:height 0.4s; }
.fb-label { font-size:0.6rem; color:var(--text-muted); white-space:nowrap; }
.fb-sev { font-size:0.54rem; text-transform:capitalize; }
.forecast-legend { display:flex; gap:12px; font-size:0.62rem; margin-top:6px; }

/* ── What-if ─────────────────────────────────────────────────── */
.whatif-score-row {
  display:flex; align-items:center; gap:14px; padding:10px 14px;
  background:var(--bg-secondary); border-radius:var(--radius-md); margin-bottom:12px;
}
.ws-block { text-align:center; }
.ws-value { font-size:1.6rem; font-weight:700; font-family:var(--font-mono); }
.ws-label { font-size:0.6rem; color:var(--text-dim); text-transform:uppercase; margin-top:2px; }
.ws-arrow { font-size:1.2rem; color:var(--text-dim); }
.ws-effect {
  font-size:0.72rem; font-family:var(--font-mono); color:var(--status-ok);
  background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2);
  border-radius:4px; padding:3px 9px; margin-left:auto;
}
.whatif-actions { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
.wi-btn {
  display:flex; align-items:center; gap:6px;
  background:var(--bg-secondary); border:1px solid var(--border-base);
  color:var(--text-secondary); border-radius:var(--radius-sm); padding:6px 10px;
  cursor:pointer; font-size:0.72rem; transition:all var(--transition-base);
}
.wi-btn:hover { background:var(--bg-card-hover); border-color:var(--accent-blue); }
.wi-btn-active { background:rgba(59,130,246,0.1); border-color:var(--accent-blue); color:var(--text-primary); }
.wi-icon { font-size:0.9rem; }
.wi-explanation {
  font-size:0.75rem; color:var(--text-secondary); line-height:1.5;
  background:rgba(59,130,246,0.06); border:1px solid rgba(59,130,246,0.15);
  border-radius:var(--radius-sm); padding:8px 12px;
}
.wi-hint { font-size:0.72rem; color:var(--text-dim); text-align:center; padding:6px 0; }

/* ── Ranked actions ──────────────────────────────────────────── */
.ra-list { display:flex; flex-direction:column; gap:5px; }
.ra-row {
  display:grid; grid-template-columns:20px 1fr 72px 58px auto;
  gap:8px; align-items:center; font-size:0.72rem;
  padding:6px 8px; background:var(--bg-secondary); border-radius:var(--radius-sm);
}
.ra-rank {
  width:20px; height:20px; background:var(--accent-blue); color:white;
  border-radius:50%; display:flex; align-items:center; justify-content:center;
  font-size:0.6rem; font-weight:700; flex-shrink:0;
}
.ra-action { color:var(--text-primary); font-weight:500; line-height:1.3; }
.ra-reduction { font-family:var(--font-mono); color:var(--status-ok); font-weight:700; font-size:0.68rem; }
.ra-eta { color:var(--text-muted); font-size:0.67rem; white-space:nowrap; }
.ra-owner { color:var(--text-dim); font-size:0.63rem; }

/* ── Risk chain ──────────────────────────────────────────────── */
.risk-chain { display:flex; flex-direction:column; }
.rc-item { display:flex; gap:10px; }
.rc-left { display:flex; flex-direction:column; align-items:center; flex-shrink:0; width:12px; }
.rc-dot { width:10px; height:10px; border-radius:50%; background:var(--status-warn); flex-shrink:0; }
.rc-dot-crit { background:var(--status-crit); }
.rc-connector { flex:1; width:2px; background:var(--border-base); min-height:14px; }
.rc-text { font-size:0.74rem; color:var(--text-secondary); padding:1px 0 16px; line-height:1.4; }
.rc-text-crit { color:var(--status-crit); font-weight:600; }

/* ── Related modules ─────────────────────────────────────────── */
.related-modules { display:flex; align-items:center; gap:6px; flex-wrap:wrap; padding:4px 0 10px; }
.rm-label { font-size:0.62rem; color:var(--text-dim); }
.rm-chip {
  font-size:0.63rem; color:var(--accent-cyan);
  background:rgba(6,182,212,0.08); border:1px solid rgba(6,182,212,0.2);
  border-radius:10px; padding:2px 8px;
}

/* ── Bottom static XAI ───────────────────────────────────────── */
.xai-subtitle { font-size:0.8rem; color:var(--text-secondary); margin-bottom:14px; font-style:italic; }
.xai-factors { display:flex; flex-direction:column; gap:12px; }
.xai-factor { background:var(--bg-secondary); border-radius:var(--radius-md); padding:10px 14px; }
.xai-factor-header { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.xai-icon { font-size:1rem; }
.xai-label { font-size:0.82rem; font-weight:600; color:var(--text-primary); flex:1; }
.xai-weight { font-size:0.9rem; font-weight:700; font-family:var(--font-mono); color:var(--accent-blue); }
.xai-desc { font-size:0.72rem; color:var(--text-muted); margin-top:5px; }

/* ── Model info ──────────────────────────────────────────────── */
.model-grid { display:flex; flex-direction:column; gap:6px; }
.mi-row { display:flex; gap:12px; padding:5px 0; border-bottom:1px solid var(--border-base); font-size:0.78rem; }
.mi-row:last-child { border-bottom:none; }
.mi-label { color:var(--text-muted); min-width:180px; flex-shrink:0; }
.mi-value { color:var(--text-primary); font-family:var(--font-mono); }

/* ── Responsive ──────────────────────────────────────────────── */
@media(max-width:1200px) {
  .gauge-row { grid-template-columns:repeat(3,1fr); }
  .pred-layout { grid-template-columns:1fr; }
  .pred-detail-col { position:static; max-height:none; }
}
@media(max-width:768px) {
  .gauge-row { grid-template-columns:repeat(2,1fr); }
  .ra-row { grid-template-columns:20px 1fr auto; }
  .ra-eta, .ra-owner { display:none; }
}
</style>
