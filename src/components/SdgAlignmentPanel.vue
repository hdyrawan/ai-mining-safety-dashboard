<script setup>
import { ref } from 'vue'
import { sdgAlignment } from '../data/mockData.js'

const selectedSdg = ref(null)

function scoreColor(s) {
  if (s >= 85) return 'var(--status-ok)'
  if (s >= 70) return 'var(--status-warn)'
  return 'var(--status-crit)'
}
function coverageClass(c) {
  if (c === 'High') return 'tag-ok'
  if (c === 'Medium') return 'tag-warn'
  return 'tag-muted'
}
</script>

<template>
  <div class="sdg-panel">
    <div class="sdg-grid">
      <div
        v-for="sdg in sdgAlignment"
        :key="sdg.sdg"
        :class="['sdg-card', { selected: selectedSdg?.sdg === sdg.sdg }]"
        :style="{ '--sdg-color': sdg.color }"
        @click="selectedSdg = selectedSdg?.sdg === sdg.sdg ? null : sdg"
      >
        <div class="sdg-header">
          <div class="sdg-number" :style="{ background: sdg.color }">SDG {{ sdg.sdg }}</div>
          <span class="sdg-icon">{{ sdg.icon }}</span>
        </div>
        <div class="sdg-name">{{ sdg.name }}</div>
        <div class="sdg-score-row">
          <div class="sdg-score" :style="{ color: scoreColor(sdg.score) }">{{ sdg.score }}%</div>
          <span :class="['tag', coverageClass(sdg.coverage)]">{{ sdg.coverage }}</span>
        </div>
        <div class="progress-bar" style="margin-top: 6px;">
          <div class="progress-fill" :style="{ width: sdg.score + '%', background: sdg.color }"></div>
        </div>
      </div>
    </div>

    <div v-if="selectedSdg" class="sdg-detail animate-fade-in card">
      <div class="sdg-detail-header" :style="{ borderLeftColor: selectedSdg.color }">
        <div class="sdg-detail-badge" :style="{ background: selectedSdg.color }">SDG {{ selectedSdg.sdg }}</div>
        <div>
          <div class="sdg-detail-name">{{ selectedSdg.name }}</div>
          <div class="sdg-detail-score" :style="{ color: scoreColor(selectedSdg.score) }">
            Alignment Score: {{ selectedSdg.score }}% — {{ selectedSdg.coverage }} Coverage
          </div>
        </div>
        <button class="btn btn-secondary btn-xs" @click="selectedSdg = null">✕</button>
      </div>

      <div class="sdg-detail-body">
        <div class="sdg-detail-section">
          <div class="sdg-section-label">Key Indicators</div>
          <ul class="sdg-indicators">
            <li v-for="ind in selectedSdg.indicators" :key="ind">{{ ind }}</li>
          </ul>
        </div>
        <div class="sdg-detail-section">
          <div class="sdg-section-label">🤖 AI Contribution</div>
          <div class="sdg-ai-text">{{ selectedSdg.aiContribution }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sdg-panel { display: flex; flex-direction: column; gap: 16px; }
.sdg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.sdg-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  cursor: pointer;
  transition: all var(--transition-base);
  border-top: 3px solid var(--sdg-color, var(--border-card));
}
.sdg-card:hover, .sdg-card.selected {
  background: var(--bg-card-hover);
  border-color: var(--sdg-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.sdg-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
.sdg-number {
  font-size: 0.65rem;
  font-weight: 800;
  color: white;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}
.sdg-icon { font-size: 1.1rem; }
.sdg-name { font-size: 0.75rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; line-height: 1.3; }
.sdg-score-row { display: flex; align-items: center; justify-content: space-between; }
.sdg-score { font-size: 1.2rem; font-weight: 700; font-family: var(--font-mono); }

.sdg-detail {
  border-left: 4px solid var(--border-card);
  padding: 14px 16px;
}
.sdg-detail-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 4px solid currentColor;
  padding-left: 10px;
  margin-bottom: 14px;
}
.sdg-detail-badge {
  font-size: 0.7rem;
  font-weight: 800;
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}
.sdg-detail-name { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
.sdg-detail-score { font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px; }

.sdg-detail-body { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.sdg-section-label { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.sdg-indicators { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.sdg-indicators li { font-size: 0.75rem; color: var(--text-secondary); padding-left: 12px; position: relative; }
.sdg-indicators li::before { content: '◈'; position: absolute; left: 0; color: var(--accent-cyan); font-size: 0.55rem; top: 2px; }
.sdg-ai-text {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
  background: var(--status-info-bg);
  border: 1px solid var(--status-info-border);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
}
</style>
