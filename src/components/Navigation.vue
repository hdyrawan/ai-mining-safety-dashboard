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
  { path:'/fleet-management',   icon:'🚛',  label:'Fleet Management',         sub:'Drivers & Compliance' },
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

      <!-- Active scenario status card -->
      <div v-if="store.scenarioConfig" class="scenario-active-card" :class="store.scenarioConfig.severity">
        <div class="sac-header">
          <span class="sac-dot"></span>
          <span class="sac-label">{{ store.scenarioConfig.label }}</span>
          <span class="sac-live">LIVE</span>
        </div>
        <div class="sac-zone">{{ store.scenarioConfig.zone }}</div>
        <div class="sac-steps">
          <div v-for="(step, i) in store.scenarioConfig.steps" :key="i" class="sac-step">
            <span class="step-dot"></span>{{ step }}
          </div>
        </div>
        <button class="scenario-btn reset" @click="store.resetScenario()">↩ Reset Scenario</button>
      </div>

      <div class="scenario-buttons">
        <button class="scenario-btn gas"      @click="store.triggerGasLeak()">💨 Gas Leak</button>
        <button class="scenario-btn heat"     @click="store.triggerHeatStress()">🌡️ Heat Stress</button>
        <button class="scenario-btn slope"    @click="store.triggerSlopeCrack()">⛰️ Slope Crack</button>
        <button class="scenario-btn vehicle"  @click="store.triggerVehicleProximity()">🚛 Vehicle Risk</button>
        <button class="scenario-btn sustain"  @click="store.triggerSustainabilityRisk()">🌍 Sustain. Risk</button>
        <button class="scenario-btn fire"     @click="store.triggerEquipmentFire()">🔥 Equip. Fire</button>
        <button class="scenario-btn flood"    @click="store.triggerFloodRisk()">🌊 Flood Risk</button>
        <button class="scenario-btn fatigue"  @click="store.triggerDriverFatigue()">😴 Driver Fatigue</button>
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
.scenario-btn.slope:hover,
.scenario-btn.fire:hover,
.scenario-btn.flood:hover { border-color: var(--status-crit-border); color: var(--status-crit); }
.scenario-btn.heat:hover,
.scenario-btn.vehicle:hover,
.scenario-btn.fatigue:hover { border-color: var(--status-warn-border); color: var(--status-warn); }
.scenario-btn.sustain:hover { border-color: var(--sustain-green); color: var(--sustain-green); }
.scenario-btn.reset { border-color: var(--border-accent); color: var(--accent-blue); margin-top: 6px; width: 100%; }

/* Active scenario status card */
.scenario-active-card {
  background: var(--bg-card);
  border: 1px solid var(--status-crit-border);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  margin: 0 2px 8px;
}
.scenario-active-card.warning { border-color: var(--status-warn-border); }

.sac-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}
.sac-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--status-crit);
  animation: blink 1s infinite;
  flex-shrink: 0;
}
.scenario-active-card.warning .sac-dot { background: var(--status-warn); }
.sac-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--status-crit);
  flex: 1;
}
.scenario-active-card.warning .sac-label { color: var(--status-warn); }
.sac-live {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--status-crit);
  background: var(--status-crit-bg);
  border: 1px solid var(--status-crit-border);
  padding: 1px 5px;
  border-radius: 3px;
  animation: blink 1.5s infinite;
}
.scenario-active-card.warning .sac-live { color: var(--status-warn); background: var(--status-warn-bg); border-color: var(--status-warn-border); }
.sac-zone {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.sac-steps {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 2px;
}
.sac-step {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.65rem;
  color: var(--text-secondary);
}
.step-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent-blue);
  flex-shrink: 0;
}

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
