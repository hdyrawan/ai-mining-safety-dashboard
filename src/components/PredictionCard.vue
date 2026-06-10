<script setup>
import { ref } from 'vue'
import StatusBadge from './StatusBadge.vue'

defineProps({
  prediction: { type: Object, required: true },
  isActive:   { type: Boolean, default: false },
})
const emit = defineEmits(['select'])

const expanded = ref(false)

const typeIcons = { gas_risk:'💨', heat_stress:'🌡️', equipment_failure:'⚙️', slope_risk:'⛰️', noise_risk:'🎧', route_risk:'🗺️', default:'🤖' }
</script>

<template>
  <div :class="['pred-card card', `pred-${prediction.severity}`, { 'pred-active': isActive }]">
    <div class="pred-header" @click="expanded = !expanded; emit('select', prediction)">
      <div class="pred-icon-title">
        <span class="pred-type-icon">{{ typeIcons[prediction.type] || typeIcons.default }}</span>
        <div>
          <div class="pred-title">{{ prediction.title }}</div>
          <div class="pred-meta">
            <span class="pred-zone">{{ prediction.affectedZone }}</span>
            <span class="pred-timeframe">⏱ {{ prediction.timeframe }}</span>
            <span v-if="prediction.affectedWorkers > 0" class="pred-workers">👷 {{ prediction.affectedWorkers }} at risk</span>
          </div>
        </div>
      </div>
      <div class="pred-right">
        <div class="confidence-badge" :class="`conf-${prediction.confidence >= 80 ? 'high' : prediction.confidence >= 60 ? 'med' : 'low'}`">
          <span class="conf-value">{{ prediction.confidence }}%</span>
          <span class="conf-label">confidence</span>
        </div>
        <StatusBadge :status="prediction.severity" />
        <span class="expand-toggle">{{ expanded ? '▲' : '▼' }}</span>
      </div>
    </div>

    <p class="pred-desc">{{ prediction.description }}</p>

    <div v-if="expanded" class="pred-details animate-fade-in">
      <div class="pred-section">
        <div class="pred-section-title">🔍 Root Cause Indicators</div>
        <ul class="pred-list">
          <li v-for="rc in prediction.rootCauses" :key="rc">{{ rc }}</li>
        </ul>
      </div>
      <div class="pred-section">
        <div class="pred-section-title">💡 AI Recommendation</div>
        <div class="pred-recommendation">{{ prediction.recommendation }}</div>
      </div>
      <div class="pred-section">
        <div class="pred-section-title">✅ Preventive Actions</div>
        <ul class="pred-actions">
          <li v-for="(a, i) in prediction.preventiveActions" :key="i">
            <span class="action-num">{{ i+1 }}</span>{{ a }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pred-card { overflow: hidden; transition: all var(--transition-base); cursor: pointer; }
.pred-card:hover { background: var(--bg-card-hover); }
.pred-active { box-shadow: 0 0 0 2px var(--accent-blue), 0 4px 20px rgba(59,130,246,0.15) !important; }
.pred-critical { border-left: 3px solid var(--status-crit); }
.pred-warning  { border-left: 3px solid var(--status-warn); }
.pred-normal   { border-left: 3px solid var(--status-ok); }

.pred-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 14px 16px 8px; cursor: pointer; gap: 10px; }
.pred-icon-title { display: flex; align-items: flex-start; gap: 10px; flex: 1; }
.pred-type-icon { font-size: 1.4rem; flex-shrink: 0; }
.pred-title { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.pred-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pred-zone { font-family: var(--font-mono); font-size: 0.68rem; color: var(--accent-cyan); background: rgba(6,182,212,0.08); padding: 1px 6px; border-radius: 4px; }
.pred-timeframe, .pred-workers { font-size: 0.68rem; color: var(--text-muted); }

.pred-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.confidence-badge { text-align: center; background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 4px 8px; border: 1px solid var(--border-base); }
.conf-value { display: block; font-size: 1rem; font-weight: 700; font-family: var(--font-mono); color: var(--text-primary); }
.conf-label { display: block; font-size: 0.58rem; color: var(--text-muted); text-transform: uppercase; }
.conf-high .conf-value { color: var(--status-ok); }
.conf-med  .conf-value { color: var(--status-warn); }
.conf-low  .conf-value { color: var(--status-crit); }
.expand-toggle { color: var(--text-muted); font-size: 0.8rem; cursor: pointer; }

.pred-desc { padding: 0 16px 12px; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; }

.pred-details { padding: 0 16px 14px; border-top: 1px solid var(--border-base); padding-top: 12px; }
.pred-section { margin-bottom: 12px; }
.pred-section-title { font-size: 0.72rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.pred-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.pred-list li { font-size: 0.75rem; color: var(--text-secondary); padding-left: 14px; position: relative; }
.pred-list li::before { content: '◈'; position: absolute; left: 0; color: var(--accent-cyan); font-size: 0.6rem; }
.pred-recommendation {
  font-size: 0.78rem;
  color: var(--text-primary);
  background: var(--status-info-bg);
  border: 1px solid var(--status-info-border);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  line-height: 1.5;
}
.pred-actions { list-style: none; display: flex; flex-direction: column; gap: 5px; }
.pred-actions li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.75rem; color: var(--text-secondary); }
.action-num {
  background: var(--accent-blue);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  width: 16px; height: 16px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
</style>
