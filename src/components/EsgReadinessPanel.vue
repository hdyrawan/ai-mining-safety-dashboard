<script setup>
import { esgComponents } from '../data/mockData.js'

const categories = [
  { key: 'environmental', label: 'Environmental', icon: '🌿', color: '#10b981' },
  { key: 'social',        label: 'Social',        icon: '👷', color: '#3b82f6' },
  { key: 'governance',    label: 'Governance',    icon: '⚖️', color: '#8b5cf6' },
]

function barColor(val, target) {
  if (val >= target * 0.95) return 'var(--status-ok)'
  if (val >= target * 0.80) return 'var(--status-warn)'
  return 'var(--status-crit)'
}
</script>

<template>
  <div class="esg-panel">
    <!-- Overall ESG Summary Row -->
    <div class="esg-summary">
      <div v-for="cat in categories" :key="cat.key" class="esg-summary-card card">
        <div class="esg-cat-header">
          <span class="esg-cat-icon">{{ cat.icon }}</span>
          <span class="esg-cat-label">{{ cat.label }}</span>
          <span class="esg-trend" :style="{ color: 'var(--status-ok)' }">+{{ esgComponents[cat.key].trend }}</span>
        </div>
        <div class="esg-score" :style="{ color: cat.color }">{{ esgComponents[cat.key].score }}</div>
        <div class="esg-score-label">/ 100</div>
        <svg viewBox="0 0 100 8" class="esg-arc-bar">
          <rect width="100" height="8" rx="4" fill="var(--border-base)" />
          <rect :width="esgComponents[cat.key].score" height="8" rx="4" :fill="cat.color" />
        </svg>
      </div>
    </div>

    <!-- Detailed breakdown per category -->
    <div class="esg-breakdown-grid">
      <div v-for="cat in categories" :key="'detail_'+cat.key" class="esg-detail-card card">
        <div class="card-header">
          <span class="card-title">{{ cat.icon }} {{ cat.label }} Details</span>
          <span class="esg-detail-score" :style="{ color: cat.color }">{{ esgComponents[cat.key].score }}/100</span>
        </div>
        <div class="card-body" style="padding-top: 10px;">
          <div v-for="item in esgComponents[cat.key].items" :key="item.label" class="esg-item">
            <div class="esg-item-header">
              <span class="esg-item-label">{{ item.label }}</span>
              <span class="esg-item-value" :style="{ color: barColor(item.value, item.target) }">
                {{ item.value }}<span style="color:var(--text-dim)">/{{ item.target }} {{ item.unit }}</span>
              </span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: (item.value / item.target * 100) + '%', background: barColor(item.value, item.target) }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.esg-panel { display: flex; flex-direction: column; gap: 16px; }
.esg-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.esg-summary-card { padding: 16px; text-align: center; }
.esg-cat-header { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 8px; }
.esg-cat-icon { font-size: 1.1rem; }
.esg-cat-label { font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); }
.esg-trend { font-size: 0.7rem; font-weight: 700; }
.esg-score { font-size: 2.4rem; font-weight: 800; font-family: var(--font-mono); letter-spacing: -1px; line-height: 1; }
.esg-score-label { font-size: 0.7rem; color: var(--text-muted); margin-top: 2px; margin-bottom: 10px; }
.esg-arc-bar { width: 100%; height: 8px; }

.esg-breakdown-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.esg-detail-card { overflow: hidden; }
.esg-detail-score { font-size: 0.9rem; font-weight: 700; font-family: var(--font-mono); }
.esg-item { margin-bottom: 10px; }
.esg-item:last-child { margin-bottom: 0; }
.esg-item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.esg-item-label { font-size: 0.72rem; color: var(--text-secondary); }
.esg-item-value { font-size: 0.72rem; font-family: var(--font-mono); font-weight: 600; }

@media (max-width: 1200px) {
  .esg-summary, .esg-breakdown-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .esg-summary, .esg-breakdown-grid { grid-template-columns: 1fr; }
}
</style>
