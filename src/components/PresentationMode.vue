<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { presentationSlides } from '../data/mockData.js'

const router = useRouter()
const current = ref(0)
const total = presentationSlides.length

const slide = computed(() => presentationSlides[current.value])

function next() { if (current.value < total - 1) current.value++ }
function prev() { if (current.value > 0) current.value-- }
function goTo(i) { current.value = i }
function exit() { router.push('/overview') }

function onKey(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
  else if (e.key === 'Escape') exit()
}

onMounted(() => { document.addEventListener('keydown', onKey) })
onUnmounted(() => { document.removeEventListener('keydown', onKey) })

const severityBgMap = [
  '#ef444410', '#3b82f610', '#06b6d410', '#14b8a610',
  '#f59e0b10', '#10b98110', '#ef444410', '#6366f110',
]
</script>

<template>
  <div class="pres-wrapper" :style="{ '--slide-accent': slide.icon === '🌿' ? '#10b981' : slide.icon === '🚨' ? '#ef4444' : '#3b82f6' }">
    <!-- Header bar -->
    <div class="pres-topbar">
      <div class="pres-brand">⛏️ AI Mining Safety &amp; Sustainability</div>
      <div class="pres-progress-dots">
        <span
          v-for="(s, i) in presentationSlides"
          :key="i"
          :class="['pres-dot', { active: i === current, done: i < current }]"
          @click="goTo(i)"
        ></span>
      </div>
      <div class="pres-topbar-right">
        <span class="pres-slide-count">{{ current + 1 }} / {{ total }}</span>
        <button class="pres-exit-btn" @click="exit">✕ Exit</button>
      </div>
    </div>

    <!-- Main slide -->
    <div class="pres-stage" :style="{ background: severityBgMap[current] }">
      <transition name="slide-fade" mode="out-in">
        <div :key="current" class="pres-slide animate-fade-in">
          <div class="pres-slide-inner">
            <div class="pres-slide-left">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <div class="pres-slide-icon">{{ slide.icon }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>

              <ul class="pres-content-list">
                <li v-for="(item, i) in slide.content" :key="i" :style="{ animationDelay: (i * 0.08) + 's' }">
                  {{ item }}
                </li>
              </ul>
            </div>

            <div class="pres-slide-right">
              <div class="pres-stat-card">
                <div class="pres-stat-value">{{ slide.stat.value }}</div>
                <div class="pres-stat-label">{{ slide.stat.label }}</div>
              </div>

              <!-- Slide-specific visual -->
              <div class="pres-visual">
                <template v-if="slide.id === 1">
                  <div class="pres-fact-grid">
                    <div class="pres-fact"><span>⛏️</span><span>5,000+</span><span>Mining fatalities / year</span></div>
                    <div class="pres-fact"><span>💰</span><span>$6B+</span><span>Annual environmental fines</span></div>
                    <div class="pres-fact"><span>📋</span><span>60+</span><span>Jurisdictions require ESG reporting</span></div>
                    <div class="pres-fact"><span>🌍</span><span>85%</span><span>Accidents are preventable</span></div>
                  </div>
                </template>
                <template v-else-if="slide.id === 2">
                  <div class="pres-data-sources">
                    <div v-for="s in ['🚁 6 Drones', '📡 89 Sensors', '⌚ 247 Wearables', '📷 CCTV + CV', '🚛 Equipment Telemetry', '🛰️ GPS Tracking']" :key="s" class="pres-ds-item">{{ s }}</div>
                  </div>
                </template>
                <template v-else-if="slide.id === 3">
                  <div class="pres-ai-layers">
                    <div class="pres-ai-layer detect">🔍 DETECT<span>Real-time anomaly detection &lt;1s</span></div>
                    <div class="pres-ai-arrow">↓</div>
                    <div class="pres-ai-layer predict">🧠 PREDICT<span>ML forecast 2-48h ahead</span></div>
                    <div class="pres-ai-arrow">↓</div>
                    <div class="pres-ai-layer recommend">💡 RECOMMEND<span>Explainable, actionable AI</span></div>
                  </div>
                </template>
                <template v-else-if="slide.id === 6">
                  <div class="pres-sdg-mini">
                    <div v-for="n in [3,8,9,12,13,15,16]" :key="n" class="sdg-mini-badge">SDG {{ n }}</div>
                  </div>
                </template>
                <template v-else>
                  <div class="pres-generic-visual">
                    <div class="pres-gv-icon">{{ slide.icon }}</div>
                    <div class="pres-gv-label">{{ slide.subtitle }}</div>
                  </div>
                </template>
              </div>

              <div class="pres-nav-hint">← → to navigate · Esc to exit</div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Bottom nav -->
    <div class="pres-bottombar">
      <button class="pres-nav-btn" :disabled="current === 0" @click="prev">
        ← Previous
      </button>
      <div class="pres-progress-bar">
        <div class="pres-progress-fill" :style="{ width: ((current + 1) / total * 100) + '%' }"></div>
      </div>
      <button class="pres-nav-btn primary" :disabled="current === total - 1" @click="next">
        Next →
      </button>
    </div>
  </div>
</template>

<style scoped>
.pres-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-base);
  z-index: 1000;
  font-family: var(--font-sans);
}

/* ── Top Bar ── */
.pres-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 28px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-base);
  flex-shrink: 0;
}
.pres-brand { font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); }
.pres-progress-dots { display: flex; gap: 8px; align-items: center; }
.pres-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--border-card);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.pres-dot.done   { background: var(--accent-blue); opacity: 0.5; }
.pres-dot.active { background: var(--accent-blue); transform: scale(1.4); }
.pres-topbar-right { display: flex; align-items: center; gap: 12px; }
.pres-slide-count { font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono); }
.pres-exit-btn {
  background: none;
  border: 1px solid var(--border-card);
  color: var(--text-secondary);
  padding: 5px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.78rem;
  font-family: var(--font-sans);
}
.pres-exit-btn:hover { border-color: var(--status-crit); color: var(--status-crit); }

/* ── Stage ── */
.pres-stage {
  flex: 1;
  overflow: hidden;
  padding: 24px 32px;
  transition: background 0.4s ease;
}
.pres-slide { height: 100%; display: flex; align-items: center; }
.pres-slide-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  align-items: center;
}

/* ── Left column ── */
.pres-slide-left {}
.pres-slide-number {
  font-size: 4rem;
  font-weight: 800;
  color: var(--border-card);
  font-family: var(--font-mono);
  line-height: 1;
  margin-bottom: -8px;
}
.pres-slide-icon { font-size: 2.5rem; margin-bottom: 10px; }
.pres-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin-bottom: 8px;
}
.pres-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-style: italic;
}
.pres-content-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.pres-content-list li {
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding-left: 18px;
  position: relative;
  line-height: 1.5;
  animation: fade-in 0.4s ease forwards;
  opacity: 0;
}
.pres-content-list li::before {
  content: '▸';
  position: absolute; left: 0;
  color: var(--slide-accent, var(--accent-blue));
}

/* ── Right column ── */
.pres-slide-right { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
.pres-stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  padding: 24px 32px;
  text-align: center;
  width: 100%;
  border-top: 4px solid var(--slide-accent, var(--accent-blue));
}
.pres-stat-value {
  font-size: 3.5rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--slide-accent, var(--accent-blue));
  letter-spacing: -2px;
  line-height: 1;
}
.pres-stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 6px;
}

.pres-visual { width: 100%; }
.pres-fact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.pres-fact {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
}
.pres-fact span:nth-child(1) { font-size: 1.2rem; }
.pres-fact span:nth-child(2) { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-mono); }
.pres-fact span:nth-child(3) { color: var(--text-muted); text-align: center; font-size: 0.7rem; }

.pres-data-sources { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.pres-ds-item {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

.pres-ai-layers { display: flex; flex-direction: column; align-items: center; gap: 0; }
.pres-ai-layer {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 12px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}
.pres-ai-layer span { font-weight: 400; color: var(--text-muted); font-size: 0.75rem; }
.pres-ai-layer.detect   { border-color: var(--status-crit-border); }
.pres-ai-layer.predict  { border-color: var(--status-warn-border); }
.pres-ai-layer.recommend{ border-color: var(--status-ok-border); }
.pres-ai-arrow { font-size: 1.2rem; color: var(--text-dim); }

.pres-sdg-mini { display: flex; flex-wrap: wrap; gap: 8px; }
.sdg-mini-badge {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  color: var(--accent-blue);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  font-weight: 700;
}

.pres-generic-visual {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  padding: 32px;
  text-align: center;
}
.pres-gv-icon { font-size: 3rem; margin-bottom: 10px; }
.pres-gv-label { font-size: 0.85rem; color: var(--text-secondary); }

.pres-nav-hint {
  font-size: 0.68rem;
  color: var(--text-dim);
  text-align: center;
  width: 100%;
}

/* ── Bottom bar ── */
.pres-bottombar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 28px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-base);
  flex-shrink: 0;
}
.pres-nav-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  color: var(--text-secondary);
  padding: 8px 20px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: var(--font-sans);
  transition: all var(--transition-fast);
  white-space: nowrap;
  flex-shrink: 0;
}
.pres-nav-btn:hover:not(:disabled) { background: var(--bg-card-hover); color: var(--text-primary); }
.pres-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.pres-nav-btn.primary { background: var(--accent-blue); color: white; border-color: var(--accent-blue); }
.pres-nav-btn.primary:hover:not(:disabled) { background: #2563eb; }
.pres-progress-bar { flex: 1; height: 4px; background: var(--border-base); border-radius: 2px; overflow: hidden; }
.pres-progress-fill { height: 100%; background: var(--accent-blue); border-radius: 2px; transition: width 0.4s ease; }

/* ── Transition ── */
.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(30px); }
.slide-fade-leave-to  { opacity: 0; transform: translateX(-20px); }
</style>
