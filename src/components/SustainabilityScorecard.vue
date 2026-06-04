<script setup>
import { computed } from 'vue'
import { sustainabilityMetrics } from '../data/mockData.js'

const metrics = sustainabilityMetrics

function statusColor(s) {
  if (s === 'critical') return 'var(--status-crit)'
  if (s === 'warning') return 'var(--status-warn)'
  return 'var(--status-ok)'
}

const items = computed(() => [
  { key:'carbonIntensity',   label:'Carbon Intensity',     icon:'💨', ...metrics.carbonIntensity   },
  { key:'energyEfficiency',  label:'Energy Efficiency',    icon:'⚡', ...metrics.energyEfficiency  },
  { key:'waterRecycling',    label:'Water Recycling',      icon:'💧', ...metrics.waterRecycling    },
  { key:'waterConsumption',  label:'Water Consumption',    icon:'🌊', ...metrics.waterConsumption  },
  { key:'dustExposure',      label:'Dust Exposure',        icon:'🌫️', ...metrics.dustExposure      },
  { key:'tailingsRisk',      label:'Tailings Risk Score',  icon:'🏔️', ...metrics.tailingsRisk      },
  { key:'biodiversityRisk',  label:'Biodiversity Risk',    icon:'🌿', ...metrics.biodiversityRisk  },
  { key:'landRehabilitation',label:'Land Rehabilitation',  icon:'🌱', ...metrics.landRehabilitation},
  { key:'esgReadiness',      label:'ESG Readiness',        icon:'📋', ...metrics.esgReadiness      },
  { key:'safetyRecordScore', label:'Safety Record Score',  icon:'⛑️', ...metrics.safetyRecordScore },
  { key:'ppeCompliance',     label:'PPE Compliance',       icon:'🦺', ...metrics.ppeCompliance     },
  { key:'incidentFreedays',  label:'Incident-Free Days',   icon:'✅', ...metrics.incidentFreedays  },
])

function trendText(t) {
  if (!t) return ''
  return t > 0 ? `+${t}` : `${t}`
}
</script>

<template>
  <div class="scorecard-grid">
    <div v-for="m in items" :key="m.key" :class="['sc-card card', `sc-${m.status}`]">
      <div class="sc-top">
        <span class="sc-icon">{{ m.icon }}</span>
        <div class="sc-trend" :class="m.trend > 0 ? (m.key === 'carbonIntensity' || m.key === 'dustExposure' || m.key === 'tailingsRisk' || m.key === 'biodiversityRisk' || m.key === 'waterConsumption' ? 'trend-bad' : 'trend-good') : 'trend-good'">
          {{ trendText(m.trend) }} {{ m.unit }}/mo
        </div>
      </div>
      <div class="sc-value" :style="{ color: statusColor(m.status) }">
        {{ m.value }}<span class="sc-unit">{{ m.unit }}</span>
      </div>
      <div class="sc-label">{{ m.label }}</div>
      <div class="progress-bar" style="margin-top: 6px;">
        <div class="progress-fill" :style="{ width: m.progress + '%', background: statusColor(m.status) }"></div>
      </div>
      <div class="sc-targets">
        <span class="sc-target">Target: {{ m.target }} {{ m.unit }}</span>
        <span class="sc-progress">{{ m.progress }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scorecard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.sc-card { padding: 14px; transition: all var(--transition-base); }
.sc-card:hover { background: var(--bg-card-hover); transform: translateY(-1px); }
.sc-warning { border-color: var(--status-warn-border); }
.sc-critical { border-color: var(--status-crit-border); }

.sc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
.sc-icon { font-size: 1.3rem; }
.sc-trend { font-size: 0.68rem; font-weight: 600; }
.trend-good { color: var(--status-ok); }
.trend-bad  { color: var(--status-crit); }

.sc-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: -0.5px;
  line-height: 1;
}
.sc-unit { font-size: 0.65rem; color: var(--text-muted); font-weight: 400; margin-left: 2px; }
.sc-label { font-size: 0.7rem; color: var(--text-secondary); margin-top: 4px; margin-bottom: 2px; }
.sc-targets { display: flex; justify-content: space-between; font-size: 0.62rem; color: var(--text-dim); margin-top: 2px; }
.sc-progress { color: var(--text-muted); }
</style>
