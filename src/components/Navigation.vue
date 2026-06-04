<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { store } from '../store/scenarios.js'


const route = useRoute()
const critCount = computed(() => store.criticalCount)

const navItems = [
  { path:'/overview',           icon:'🖥️',  label:'Overview',                sub:'Command Center' },
  { path:'/drone-monitoring',   icon:'🚁',  label:'Drone Monitoring',        sub:'Fleet & Detection' },
  { path:'/ground-sensors',     icon:'📡',  label:'Ground Sensors',          sub:'Gas & Environment' },
  { path:'/worker-health',      icon:'❤️',  label:'Worker Health',           sub:'Wearables & Safety' },
  { path:'/equipment-safety',   icon:'🚜',  label:'Equipment Safety',        sub:'Telemetry & Risk' },
  { path:'/ai-prediction',      icon:'🤖',  label:'AI Prediction',           sub:'Forecast & Insight' },
  { path:'/incident-response',  icon:'🚨',  label:'Incident Response',       sub:'Workflow & Dispatch' },
  { path:'/sustainability',     icon:'🌿',  label:'Sustainability Intel.',    sub:'SDG & ESG' },
]

function isActive(path) { return route.path === path || (path !== '/' && route.path.startsWith(path)) }
</script>

<template>
  <nav class="sidebar" :class="{ 'sidebar-open': store.sidebarOpen }">
    <div class="sidebar-inner">
      <div class="nav-section-label">OPERATIONS</div>
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="['nav-item', { active: isActive(item.path) }]"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <div class="nav-text">
          <span class="nav-label">{{ item.label }}</span>
          <span class="nav-sub">{{ item.sub }}</span>
        </div>
        <span v-if="item.path === '/incident-response' && critCount > 0" class="nav-badge">{{ critCount }}</span>
      </router-link>

      <div class="divider" style="margin: 12px 12px;"></div>
      <div class="nav-section-label">SCENARIO SIM</div>
      <div class="scenario-buttons">
        <button class="scenario-btn gas"      @click="store.triggerGasLeak()">💨 Gas Leak</button>
        <button class="scenario-btn heat"     @click="store.triggerHeatStress()">🌡️ Heat Stress</button>
        <button class="scenario-btn slope"    @click="store.triggerSlopeCrack()">⛰️ Slope Crack</button>
        <button class="scenario-btn vehicle"  @click="store.triggerVehicleProximity()">🚛 Vehicle Risk</button>
        <button class="scenario-btn sustain"  @click="store.triggerSustainabilityRisk()">🌍 Sustain. Risk</button>
        <button v-if="store.activeScenario" class="scenario-btn reset" @click="store.resetScenario()">↩ Reset</button>
      </div>

      <div class="sidebar-footer">
        <div class="footer-version">v2.4.1 · AI Engine Online</div>
        <div class="footer-pulse">
          <span class="live-dot"></span>
          <span>All systems nominal</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: var(--header-h);
  bottom: 0;
  width: var(--sidebar-w);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-base);
  z-index: 90;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sidebar-inner {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px 16px;
  display: flex;
  flex-direction: column;
}
.nav-section-label {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  padding: 6px 10px 4px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
  margin-bottom: 2px;
}
.nav-item:hover {
  background: var(--bg-card);
  color: var(--text-primary);
}
.nav-item.active {
  background: var(--status-info-bg);
  border: 1px solid var(--status-info-border);
}
.nav-item.active .nav-label { color: var(--accent-blue); }
.nav-icon { font-size: 1rem; flex-shrink: 0; }
.nav-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.nav-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nav-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
  white-space: nowrap;
}
.nav-badge {
  background: var(--status-crit);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  flex-shrink: 0;
  animation: blink 1.5s infinite;
}

.scenario-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 2px;
}
.scenario-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  color: var(--text-secondary);
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-sans);
  text-align: left;
  transition: all var(--transition-fast);
}
.scenario-btn:hover { color: var(--text-primary); background: var(--bg-card-hover); }
.scenario-btn.gas:hover,
.scenario-btn.slope:hover { border-color: var(--status-crit-border); color: var(--status-crit); }
.scenario-btn.heat:hover { border-color: var(--status-warn-border); color: var(--status-warn); }
.scenario-btn.vehicle:hover { border-color: var(--status-warn-border); color: var(--status-warn); }
.scenario-btn.sustain:hover { border-color: var(--sustain-green); color: var(--sustain-green); }
.scenario-btn.reset { border-color: var(--border-accent); color: var(--accent-blue); }

.sidebar-footer {
  margin-top: auto;
  padding: 12px 10px 4px;
  border-top: 1px solid var(--border-base);
}
.footer-version {
  font-size: 0.65rem;
  color: var(--text-dim);
  margin-bottom: 4px;
}
.footer-pulse {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  color: var(--status-ok);
}

/* ── Mobile overlay mode ── */
@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: none;
    z-index: 90;
  }
  .sidebar.sidebar-open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
  }
}
</style>
