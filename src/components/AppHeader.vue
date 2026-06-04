<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store/scenarios.js'

const router = useRouter()
const critCount = computed(() => store.criticalCount)

function goPresentation() { router.push('/presentation') }
function toggleSidebar() { store.toggleSidebar() }
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button class="hamburger-btn" @click="toggleSidebar" :class="{ open: store.sidebarOpen }" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
      <div class="header-icon">⛏️</div>
      <div class="header-info">
        <div class="header-title">AI Mining Safety &amp; Sustainability Command Center</div>
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
      <div v-if="critCount > 0" class="alert-count-badge">
        <span class="live-dot crit"></span>
        {{ critCount }} Critical
      </div>
      <div class="worker-count">
        <span class="count-icon">👷</span>
        <span>247 Active</span>
      </div>
      <div class="drone-count">
        <span class="count-icon">🚁</span>
        <span>3 Drones</span>
      </div>
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
.count-icon { font-size: 0.9rem; }
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
</style>
