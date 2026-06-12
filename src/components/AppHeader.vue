<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store/scenarios.js'
import { drones } from '../data/mockData.js'

const router = useRouter()
const critCount = computed(() => store.criticalCount)
const activeDroneCount = computed(() => drones.filter(d => d.status === 'active').length)

function goPresentation()    { router.push('/presentation') }
function toggleSidebar()     { store.toggleSidebar() }
function toggleTheme()       { store.toggleTheme() }
function goIncidentResponse(){ router.push('/incident-response') }
function goWorkerHealth()    { router.push('/worker-health') }
function goDroneMonitoring() { router.push('/drone-monitoring') }
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button class="hamburger-btn" @click="toggleSidebar" :class="{ open: store.sidebarOpen }" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
      <div class="header-icon">⛏️</div>
      <div class="header-info">
        <div class="header-title">MineSafe AI System</div>
        <div class="header-sub">Kalimantan Gold Mine · Real-Time AI Operations · Shift Day 06:00–18:00</div>
      </div>
    </div>
    <div class="header-center">
      <div class="live-indicator">
        <span class="live-dot"></span>
        <span class="live-label">LIVE</span>
        <span class="live-time">{{ new Date().toLocaleTimeString('en-GB') }}</span>
      </div>
    </div>
    <div class="header-right">
      <button
        v-if="critCount > 0"
        class="alert-count-badge chip-nav"
        data-tooltip="View active critical alerts"
        aria-label="Open critical alerts"
        @click="goIncidentResponse"
      >
        <span class="live-dot crit"></span>
        {{ critCount }} Critical
      </button>
      <button
        class="worker-count chip-nav"
        data-tooltip="View active worker health and location"
        aria-label="Open worker health monitor"
        @click="goWorkerHealth"
      >
        <span class="count-icon">👷</span>
        <span>247 Active</span>
      </button>
      <button
        class="drone-count chip-nav"
        data-tooltip="View drone fleet and live feed"
        aria-label="Open drone monitoring"
        @click="goDroneMonitoring"
      >
        <span class="count-icon">🚁</span>
        <span>{{ activeDroneCount }} Drones</span>
      </button>
      <button class="btn-theme-toggle" @click="toggleTheme" :title="store.theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'">
        {{ store.theme === 'dark' ? '☀️' : '🌙' }}
      </button>
      <button class="btn-presentation" @click="goPresentation">
        ▶ Presentation
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: var(--header-h);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.4);
}

.header-left { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.header-icon { font-size: 1.6rem; }
.header-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.2px;
  white-space: nowrap;
}
.header-sub { font-size: 0.7rem; color: var(--text-muted); margin-top: 1px; }

.header-center { flex: 1; display: flex; justify-content: center; }
.live-indicator {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--status-ok-bg);
  border: 1px solid var(--status-ok-border);
  padding: 4px 12px;
  border-radius: 20px;
}
.live-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--status-ok);
  letter-spacing: 0.08em;
}
.live-time {
  font-size: 0.78rem;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.header-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
/* ── Shared chip-nav base ── */
.chip-nav {
  position: relative;
  cursor: pointer;
  font-family: var(--font-sans);
  transition:
    box-shadow var(--transition-fast),
    border-color var(--transition-fast),
    background var(--transition-fast),
    transform var(--transition-fast);
}
.chip-nav:active { transform: scale(0.96); }

/* CSS tooltip — rendered below the chip so it stays inside the viewport */
.chip-nav::after {
  content: attr(data-tooltip);
  position: absolute;
  top: calc(100% + 8px);
  bottom: auto;
  left: 50%;
  transform: translateX(-50%);
  background: #1e2a3a;
  color: var(--text-primary);
  font-size: 0.68rem;
  font-weight: 500;
  white-space: nowrap;
  padding: 4px 9px;
  border-radius: 5px;
  border: 1px solid var(--border-card);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 9999;
}
.chip-nav:hover::after { opacity: 1; }

/* Drone chip is rightmost — anchor tooltip to right edge to avoid horizontal overflow */
.drone-count::after {
  left: auto;
  right: 0;
  transform: none;
}

/* ── Critical chip ── */
.alert-count-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--status-crit-bg);
  border: 1px solid var(--status-crit-border);
  color: var(--status-crit);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  animation: blink 2s infinite;
}
.alert-count-badge:hover {
  box-shadow: 0 0 10px rgba(239,68,68,0.45);
  border-color: var(--status-crit);
  background: rgba(239,68,68,0.18);
  animation: none;
}

/* ── Worker / Drone chips ── */
.worker-count, .drone-count {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border-base);
  padding: 4px 10px;
  border-radius: 20px;
}
.worker-count:hover,
.drone-count:hover {
  color: var(--text-primary);
  border-color: var(--accent-blue);
  box-shadow: 0 0 10px rgba(59,130,246,0.35);
  background: rgba(59,130,246,0.08);
}

.count-icon { font-size: 0.9rem; }
.btn-theme-toggle {
  background: var(--bg-card);
  border: 1px solid var(--border-base);
  color: var(--text-secondary);
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}
.btn-theme-toggle:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-accent);
}
.btn-presentation {
  background: var(--accent-blue);
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: background var(--transition-fast);
}
.btn-presentation:hover { background: #2563eb; }

/* ── Hamburger — mobile only ── */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.hamburger-btn span {
  display: block;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: all 0.25s ease;
  transform-origin: center;
}
.hamburger-btn.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger-btn.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger-btn.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 900px) {
  .hamburger-btn { display: flex; }
  .header-icon   { display: none; }
  .header-title  { font-size: 0.82rem; }
  .header-sub    { display: none; }
  .worker-count,
  .drone-count   { display: none; }
  .live-time     { display: none; }
}

@media (max-width: 600px) {
  .app-header    { padding: 0 12px; gap: 8px; }
  .header-center { display: none; }
  .btn-theme-toggle { display: none; }
  .header-title  { font-size: 0.76rem; }
  .alert-count-badge { font-size: 0.68rem; padding: 3px 7px; gap: 4px; }
  .btn-presentation { padding: 5px 10px; font-size: 0.74rem; }
}
</style>
