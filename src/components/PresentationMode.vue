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

const accentColor = computed(() => {
  const s = slide.value
  if (s.type === 'thankyou' || s.type === 'takeaway') return '#10b981'
  if (s.type === 'training') return '#10b981'
  if (s.icon === '🌿') return '#10b981'
  if (s.icon === '🚨') return '#ef4444'
  if (s.icon === '❤️') return '#ef4444'
  return '#3b82f6'
})

const stageBg = computed(() => {
  const s = slide.value
  if (s.type === 'title') return 'radial-gradient(ellipse at 60% 40%, #1e3a5f 0%, #0b0e1a 70%)'
  if (s.type === 'team') return 'linear-gradient(135deg, #0f1a2e 0%, #0b0e1a 100%)'
  if (s.type === 'agents') return 'linear-gradient(135deg, #0f1a2e 0%, #0b0e1a 100%)'
  if (s.type === 'thankyou' || s.type === 'takeaway') return 'radial-gradient(ellipse at 50% 50%, #0d2318 0%, #0b0e1a 70%)'
  if (s.type === 'training') return 'radial-gradient(ellipse at 30% 60%, #091f13 0%, #0b0e1a 70%)'
  if (s.type === 'visits') return 'linear-gradient(135deg, #0e1624 0%, #0b0e1a 100%)'
  if (s.icon === '🌿') return '#10b98108'
  if (s.icon === '🚨') return '#ef444408'
  if (s.icon === '❤️') return '#ef444408'
  return '#3b82f608'
})

const statusColor = { critical: '#ef4444', warning: '#f59e0b', normal: '#22c55e' }
</script>

<template>
  <div class="pres-wrapper" :style="{ '--slide-accent': accentColor }">

    <!-- Top bar -->
    <div class="pres-topbar">
      <div class="pres-brand">⛏️ MineSafe AI System — HITSZ 2026</div>
      <div class="pres-progress-dots">
        <span
          v-for="(s, i) in presentationSlides" :key="i"
          :class="['pres-dot', { active: i === current, done: i < current }]"
          @click="goTo(i)"
        ></span>
      </div>
      <div class="pres-topbar-right">
        <span class="pres-slide-count">{{ current + 1 }} / {{ total }}</span>
        <button class="pres-exit-btn" @click="exit">✕ Exit</button>
      </div>
    </div>

    <!-- Stage -->
    <div class="pres-stage" :style="{ background: stageBg }">
      <transition name="slide-fade" mode="out-in">
        <div :key="current" class="pres-slide">

          <!-- ── TITLE slide ─────────────────────────────────────── -->
          <div v-if="slide.type === 'title'" class="slide-center-wrap">
            <div class="title-eyebrow">AI for Sustainable Development</div>
            <div class="title-icon">{{ slide.icon }}</div>
            <h1 class="title-main">{{ slide.title }}</h1>
            <p class="title-sub">{{ slide.subtitle }}</p>
            <div class="title-divider"></div>
            <p class="title-institution">{{ slide.institution }}</p>
            <div class="title-team-row">
              <span v-for="m in slide.members" :key="m" class="title-member">{{ m }}</span>
            </div>
            <div class="title-year">{{ slide.year }}</div>
          </div>

          <!-- ── TEAM slide ──────────────────────────────────────── -->
          <div v-else-if="slide.type === 'team'" class="slide-full-wrap">
            <div class="team-header">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>
            </div>
            <div class="team-grid">
              <div v-for="m in slide.members" :key="m.name" class="team-card">
                <div class="team-avatar">{{ m.name.split(' ').map(w => w[0]).slice(0,2).join('') }}</div>
                <div class="team-name">{{ m.name }}</div>
                <div class="team-role">{{ m.role }}</div>
              </div>
            </div>
            <div class="team-footer">HITSZ — Harbin Institute of Technology, Shenzhen</div>
          </div>

          <!-- ── AGENTS slide ────────────────────────────────────── -->
          <div v-else-if="slide.type === 'agents'" class="slide-agents-wrap">
            <div class="agents-left">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <div class="pres-slide-icon">{{ slide.icon }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>
              <ul class="pres-content-list">
                <li v-for="(item, i) in slide.content" :key="i" :style="{ animationDelay: (i * 0.07) + 's' }">{{ item }}</li>
              </ul>
              <div class="pres-stat-card" style="margin-top:16px">
                <div class="pres-stat-value">{{ slide.stat.value }}</div>
                <div class="pres-stat-label">{{ slide.stat.label }}</div>
              </div>
              <div v-if="slide.sources" class="sources-block">
                <div class="sources-label">Sources</div>
                <div v-for="src in slide.sources" :key="src.label" class="source-item">
                  ↗ {{ src.label }} ({{ src.year }})
                </div>
              </div>
            </div>
            <div class="agents-right">
              <div class="agents-title-label">Live Agent Activations in Dashboard</div>
              <div
                v-for="ag in slide.agents" :key="ag.name"
                class="agent-card"
                :style="{ borderLeftColor: statusColor[ag.status] }"
              >
                <div class="agent-icon">{{ ag.icon }}</div>
                <div class="agent-body">
                  <div class="agent-name" :style="{ color: statusColor[ag.status] }">{{ ag.name }}</div>
                  <div class="agent-case">{{ ag.case }}</div>
                </div>
                <div class="agent-status-dot" :style="{ background: statusColor[ag.status] }"></div>
              </div>
            </div>
          </div>

          <!-- ── DASHBOARD slide ───────────────────────────────────── -->
          <div v-else-if="slide.type === 'dashboard'" class="slide-dashboard-wrap">
            <div class="dash-left">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <div class="pres-slide-icon">{{ slide.icon }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>
              <ul class="pres-content-list">
                <li v-for="(item, i) in slide.content" :key="i" :style="{ animationDelay: (i * 0.08) + 's' }">{{ item }}</li>
              </ul>
              <div class="pres-stat-card" style="margin-top:16px">
                <div class="pres-stat-value">{{ slide.stat.value }}</div>
                <div class="pres-stat-label">{{ slide.stat.label }}</div>
              </div>
            </div>
            <div class="dash-right">
              <div class="dash-right-header">
                <span class="dash-live-dot"></span>
                <span class="dash-live-label">Live Dashboard Preview</span>
                <a :href="'/#' + slide.route" target="_blank" class="dash-open-btn">
                  Open Full Screen ↗
                </a>
              </div>
              <div class="iframe-shell">
                <iframe :src="'/#' + slide.route" class="iframe-inner" scrolling="no"></iframe>
              </div>
            </div>
          </div>

          <!-- ── PROBLEM slide ─────────────────────────────────────── -->
          <div v-else-if="slide.type === 'problem'" class="slide-problem-wrap">
            <div class="prob-left">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <div class="pres-slide-icon">{{ slide.icon }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>
              <blockquote class="prob-question">{{ slide.question }}</blockquote>
              <ul class="pres-content-list">
                <li v-for="(p, i) in slide.points" :key="i" :style="{ animationDelay: (i * 0.08) + 's' }">{{ p }}</li>
              </ul>
            </div>
            <div class="prob-right">
              <template v-if="slide.photo">
                <div class="slide-photo-panel">
                  <img :src="slide.photo" :alt="slide.photoCaption || slide.title" class="slide-photo-img" />
                  <div v-if="slide.photoCaption" class="slide-photo-caption">{{ slide.photoCaption }}</div>
                </div>
                <div class="pres-stat-card">
                  <div class="pres-stat-value">{{ slide.stat.value }}</div>
                  <div class="pres-stat-label">{{ slide.stat.label }}</div>
                </div>
              </template>
              <template v-else>
                <div class="pres-stat-card">
                  <div class="pres-stat-value">{{ slide.stat.value }}</div>
                  <div class="pres-stat-label">{{ slide.stat.label }}</div>
                </div>
                <div class="prob-goal-card">
                  <div class="prob-goal-icon">🎯</div>
                  <div class="prob-goal-label">The Goal</div>
                  <div class="prob-goal-text">Prevention, not only incident response</div>
                </div>
                <div class="prob-flow">
                  <div v-for="step in ['Detect risk early', 'Explain the cause', 'Recommend action', 'Prevent the incident']"
                    :key="step" class="prob-flow-step">
                    <span class="prob-flow-dot"></span>{{ step }}
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- ── COMPARISON slide ──────────────────────────────────── -->
          <div v-else-if="slide.type === 'comparison'" class="slide-comparison-wrap">
            <div class="comp-header">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>
            </div>
            <div class="comp-body">
              <div class="comp-col comp-old">
                <div class="comp-col-header comp-old-header">Old Way</div>
                <ul class="comp-list comp-list-old">
                  <li v-for="item in slide.old" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div class="comp-divider">→</div>
              <div class="comp-col comp-new">
                <div class="comp-col-header comp-new-header">MineSafe Way</div>
                <ul class="comp-list comp-list-new">
                  <li v-for="item in slide.new" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
            <div class="comp-stat-row">
              <div class="pres-stat-card" style="max-width:340px">
                <div class="pres-stat-value">{{ slide.stat.value }}</div>
                <div class="pres-stat-label">{{ slide.stat.label }}</div>
              </div>
            </div>
          </div>

          <!-- ── SOLUTION slide ────────────────────────────────────── -->
          <div v-else-if="slide.type === 'solution'" class="slide-solution-wrap">
            <div class="sol-header">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <div class="pres-slide-icon">{{ slide.icon }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>
            </div>
            <div class="sol-body">
              <div class="sol-col">
                <div class="sol-col-title">MineSafe Connects</div>
                <div class="sol-chips">
                  <span v-for="inp in slide.inputs" :key="inp" class="sol-chip sol-chip-in">{{ inp }}</span>
                </div>
              </div>
              <div class="sol-arrow">→</div>
              <div class="sol-col">
                <div class="sol-col-title">Outputs</div>
                <div class="sol-chips">
                  <span v-for="out in slide.outputs" :key="out" class="sol-chip sol-chip-out">{{ out }}</span>
                </div>
              </div>
            </div>
            <div class="sol-stat-row">
              <div class="pres-stat-card" style="max-width:340px">
                <div class="pres-stat-value">{{ slide.stat.value }}</div>
                <div class="pres-stat-label">{{ slide.stat.label }}</div>
              </div>
            </div>
          </div>

          <!-- ── TRAINING slide ────────────────────────────────────── -->
          <div v-else-if="slide.type === 'training'" class="slide-training-wrap">
            <div class="train-left">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <div class="pres-slide-icon">{{ slide.icon }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>
              <p class="train-intro">{{ slide.intro }}</p>
              <div class="pres-stat-card" style="margin-top:16px">
                <div class="pres-stat-value">{{ slide.stat.value }}</div>
                <div class="pres-stat-label">{{ slide.stat.label }}</div>
              </div>
            </div>
            <div class="train-right">
              <div class="train-section-label">AIESD Principles Applied in MineSafe</div>
              <div class="train-principles">
                <div v-for="p in slide.principles" :key="p.title" class="train-card">
                  <div class="tc-icon">{{ p.icon }}</div>
                  <div class="tc-title">{{ p.title }}</div>
                  <div class="tc-desc">{{ p.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── VISITS slide ──────────────────────────────────────── -->
          <div v-else-if="slide.type === 'visits'" class="slide-visits-wrap">
            <div class="visits-header">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>
            </div>
            <div class="visits-grid">
              <div v-for="v in slide.visits" :key="v.company" class="visit-card" :style="{ borderTopColor: v.color || 'var(--accent-blue)' }">
                <div v-if="v.photo" class="vc-photo-wrap">
                  <img :src="v.photo" :alt="v.company" class="vc-photo" />
                </div>
                <div class="vc-top">
                  <span class="vc-icon">{{ v.icon }}</span>
                  <div>
                    <div class="vc-company" :style="{ color: v.color || 'var(--text-primary)' }">{{ v.company }}</div>
                    <div class="vc-tagline">{{ v.tagline }}</div>
                  </div>
                </div>
                <div class="vc-section">
                  <div class="vc-label">Lesson</div>
                  <div class="vc-text">{{ v.lesson }}</div>
                </div>
                <div class="vc-section">
                  <div class="vc-label vc-label-cyan">MineSafe →</div>
                  <div class="vc-text vc-text-cyan">{{ v.connection }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── TAKEAWAY slide ────────────────────────────────────── -->
          <div v-else-if="slide.type === 'takeaway'" class="slide-center-wrap takeaway-wrap">
            <div class="ta-icon">{{ slide.icon }}</div>
            <h1 class="ta-title">{{ slide.title }}</h1>
            <div class="ta-statement">{{ slide.statement }}</div>
            <div class="title-divider" style="border-color:#10b981; max-width:120px; margin:12px auto"></div>
            <div class="ta-closing">{{ slide.closing }}</div>
          </div>

          <!-- ── THANK YOU slide ─────────────────────────────────── -->
          <div v-else-if="slide.type === 'thankyou'" class="slide-center-wrap ty-wrap">
            <div class="ty-icon">{{ slide.icon }}</div>
            <h1 class="ty-title">{{ slide.title }}</h1>
            <div class="ty-institution">{{ slide.institution }}</div>
            <div class="title-divider" style="border-color:#10b981; max-width:200px"></div>
            <div class="ty-subtitle">{{ slide.subtitle }}</div>
            <div class="ty-team">
              <span v-for="m in slide.members" :key="m" class="ty-member">{{ m }}</span>
            </div>
            <div class="ty-project">MineSafe AI System · AI-Driven Mining Safety &amp; Sustainability</div>
          </div>

          <!-- ── CONTENT slide (default) ────────────────────────── -->
          <div v-else class="pres-slide-inner">
            <div class="pres-slide-left">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <div class="pres-slide-icon">{{ slide.icon }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>
              <ul class="pres-content-list">
                <li v-for="(item, i) in slide.content" :key="i" :style="{ animationDelay: (i * 0.08) + 's' }">{{ item }}</li>
              </ul>
              <div v-if="slide.sources" class="sources-block">
                <div class="sources-label">Sources</div>
                <div v-for="src in slide.sources" :key="src.label" class="source-item">
                  ↗ {{ src.label }} ({{ src.year }})
                </div>
              </div>
            </div>

            <div class="pres-slide-right">
              <template v-if="slide.photo">
                <div class="slide-photo-panel">
                  <img :src="slide.photo" :alt="slide.photoCaption || slide.title" class="slide-photo-img" />
                  <div v-if="slide.photoCaption" class="slide-photo-caption">{{ slide.photoCaption }}</div>
                </div>
                <div class="pres-stat-card">
                  <div class="pres-stat-value">{{ slide.stat.value }}</div>
                  <div class="pres-stat-label">{{ slide.stat.label }}</div>
                </div>
              </template>
              <template v-else>
                <div class="pres-stat-card">
                  <div class="pres-stat-value">{{ slide.stat.value }}</div>
                  <div class="pres-stat-label">{{ slide.stat.label }}</div>
                </div>

                <!-- Per-icon visual -->
                <div class="pres-visual">
                  <template v-if="slide.icon === '⛏️'">
                    <div class="pres-fact-grid">
                      <div class="pres-fact"><span>⛏️</span><span>5,000+</span><span>Mining fatalities / year (ILO)</span></div>
                      <div class="pres-fact"><span>📋</span><span>36</span><span>ICMM member fatalities 2023</span></div>
                      <div class="pres-fact"><span>💰</span><span>$6B+</span><span>Annual environmental fines</span></div>
                      <div class="pres-fact"><span>🌍</span><span>60+</span><span>Jurisdictions require ESG reporting</span></div>
                    </div>
                  </template>
                  <template v-else-if="slide.icon === '⚒️'">
                    <div class="pres-why-grid">
                      <div v-for="r in slide.reasons" :key="r.label" class="pwm-item">
                        <span class="pwm-icon">{{ r.icon }}</span>
                        <span class="pwm-text">{{ r.label }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="slide.icon === '📡'">
                    <div class="pres-data-sources">
                      <div v-for="s in ['🚁 6 Drones', '📡 89 Sensors', '⌚ 247 Wearables', '📷 CCTV + CV', '🚛 8 Machines', '🛰️ GPS Tracking']" :key="s" class="pres-ds-item">{{ s }}</div>
                    </div>
                  </template>
                  <template v-else-if="slide.icon === '🌿'">
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
              </template>

              <div class="pres-nav-hint">← → to navigate · Esc to exit</div>
            </div>
          </div>

        </div>
      </transition>
    </div>

    <!-- Bottom bar -->
    <div class="pres-bottombar">
      <button class="pres-nav-btn" :disabled="current === 0" @click="prev">← Previous</button>
      <div class="pres-progress-bar">
        <div class="pres-progress-fill" :style="{ width: ((current + 1) / total * 100) + '%' }"></div>
      </div>
      <button class="pres-nav-btn primary" :disabled="current === total - 1" @click="next">Next →</button>
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
.pres-progress-dots { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; max-width: 480px; }
.pres-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--border-card);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.pres-dot.done   { background: var(--accent-blue); opacity: 0.5; }
.pres-dot.active { background: var(--slide-accent, var(--accent-blue)); transform: scale(1.5); }
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
  padding: 20px 32px;
  transition: background 0.4s ease;
}
.pres-slide { height: 100%; display: flex; align-items: stretch; }

/* ── Shared typography ── */
.pres-slide-number {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--border-card);
  font-family: var(--font-mono);
  line-height: 1;
  margin-bottom: -4px;
}
.pres-slide-icon { font-size: 2.2rem; margin-bottom: 8px; }
.pres-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.4px;
  line-height: 1.15;
  margin-bottom: 6px;
}
.pres-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 18px;
  font-style: italic;
}
.pres-content-list { list-style: none; display: flex; flex-direction: column; gap: 7px; padding: 0; margin: 0; }
.pres-content-list li {
  font-size: 0.85rem;
  color: var(--text-secondary);
  padding-left: 16px;
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

/* ── Stat card ── */
.pres-stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  padding: 20px 28px;
  text-align: center;
  width: 100%;
  border-top: 4px solid var(--slide-accent, var(--accent-blue));
}
.pres-stat-value {
  font-size: 3rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--slide-accent, var(--accent-blue));
  letter-spacing: -2px;
  line-height: 1;
}
.pres-stat-label { font-size: 0.82rem; color: var(--text-secondary); margin-top: 6px; }

/* ── Sources block ── */
.sources-block { margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--border-base); }
.sources-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-dim); margin-bottom: 4px; }
.source-item { font-size: 0.68rem; color: var(--text-dim); line-height: 1.4; margin-bottom: 2px; }

/* ─────────────────────────────────────────────────────────────
   TITLE slide
───────────────────────────────────────────────────────────── */
.slide-center-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0;
}
.title-eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--accent-blue);
  margin-bottom: 12px;
  font-weight: 600;
}
.title-icon { font-size: 4rem; margin-bottom: 10px; }
.title-main {
  font-size: 3.5rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -1.5px;
  line-height: 1.05;
  margin-bottom: 10px;
}
.title-sub {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  line-height: 1.4;
  margin-bottom: 20px;
}
.title-divider {
  border: none;
  border-top: 2px solid var(--accent-blue);
  width: 80px;
  margin: 4px auto 18px;
}
.title-institution {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 18px;
}
.title-team-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
}
.title-member {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-sm);
  padding: 5px 12px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}
.title-year {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-dim);
  letter-spacing: 0.2em;
}

/* ─────────────────────────────────────────────────────────────
   TEAM slide
───────────────────────────────────────────────────────────── */
.slide-full-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.team-header { text-align: center; margin-bottom: 24px; }
.team-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 1100px;
}
.team-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  border-top: 3px solid var(--accent-blue);
}
.team-card:hover { border-top-color: var(--slide-accent, var(--accent-blue)); }
.team-avatar {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-blue), #6366f1);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 800; color: white; letter-spacing: -0.5px;
}
.team-name { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
.team-role { font-size: 0.72rem; color: var(--text-muted); line-height: 1.4; }
.team-footer { margin-top: 20px; font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; }

/* ─────────────────────────────────────────────────────────────
   AGENTS slide
───────────────────────────────────────────────────────────── */
.slide-agents-wrap {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 40px;
  align-items: start;
  overflow: auto;
}
.agents-left { display: flex; flex-direction: column; gap: 0; }
.agents-right { display: flex; flex-direction: column; gap: 10px; height: 100%; overflow: auto; }
.agents-title-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  margin-bottom: 4px;
}
.agent-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-left: 4px solid var(--status-ok);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.agent-icon { font-size: 1.5rem; flex-shrink: 0; margin-top: 1px; }
.agent-body { flex: 1; min-width: 0; }
.agent-name { font-size: 0.85rem; font-weight: 700; margin-bottom: 3px; }
.agent-case { font-size: 0.73rem; color: var(--text-muted); line-height: 1.4; }
.agent-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }

/* ─────────────────────────────────────────────────────────────
   DASHBOARD slide
───────────────────────────────────────────────────────────── */
.slide-dashboard-wrap {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 32px;
  align-items: start;
}
.dash-left { display: flex; flex-direction: column; gap: 0; }
.dash-right { display: flex; flex-direction: column; gap: 8px; height: 100%; }
.dash-right-header { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.dash-live-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--status-ok);
  box-shadow: 0 0 6px var(--status-ok);
  animation: pulse-dot 1.5s ease-in-out infinite;
}
@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.dash-live-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--status-ok);
  font-weight: 600;
  flex: 1;
}
.dash-open-btn {
  font-size: 0.72rem;
  color: var(--accent-blue);
  text-decoration: none;
  border: 1px solid var(--accent-blue);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  white-space: nowrap;
}
.dash-open-btn:hover { background: var(--accent-blue); color: white; }
.iframe-shell {
  flex: 1;
  overflow: hidden;
  position: relative;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-card);
  background: #0b0e1a;
  min-height: 200px;
}
.iframe-inner {
  position: absolute; top: 0; left: 0;
  width: 200%; height: 200%;
  border: none;
  transform: scale(0.5);
  transform-origin: top left;
}

/* ─────────────────────────────────────────────────────────────
   PROBLEM slide
───────────────────────────────────────────────────────────── */
.slide-problem-wrap {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  overflow: auto;
}
.prob-left { display: flex; flex-direction: column; }
.prob-right { display: flex; flex-direction: column; gap: 16px; }
.prob-question {
  font-size: 1rem;
  font-weight: 700;
  font-style: italic;
  color: var(--slide-accent, var(--accent-blue));
  border-left: 4px solid var(--slide-accent, var(--accent-blue));
  padding: 12px 16px;
  background: rgba(59,130,246,0.06);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  line-height: 1.6;
  margin: 12px 0 16px;
}
.prob-goal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  padding: 20px 24px;
  text-align: center;
  border-top: 4px solid var(--slide-accent, var(--accent-blue));
}
.prob-goal-icon { font-size: 2rem; margin-bottom: 6px; }
.prob-goal-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  margin-bottom: 6px;
}
.prob-goal-text { font-size: 0.88rem; color: var(--text-primary); font-weight: 600; }
.prob-flow { display: flex; flex-direction: column; gap: 6px; }
.prob-flow-step {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
}
.prob-flow-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--slide-accent, var(--accent-blue));
  flex-shrink: 0;
}

/* ─────────────────────────────────────────────────────────────
   COMPARISON slide
───────────────────────────────────────────────────────────── */
.slide-comparison-wrap {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 14px;
  overflow: hidden;
}
.comp-header { flex-shrink: 0; }
.comp-header .pres-title { margin-bottom: 2px; }
.comp-header .pres-subtitle { margin-bottom: 0; }
.comp-body {
  display: grid;
  grid-template-columns: 1fr 44px 1fr;
  gap: 0;
  align-items: stretch;
  overflow: hidden;
}
.comp-col {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
}
.comp-old { border-top: 3px solid rgba(239,68,68,0.6); }
.comp-new { border-top: 3px solid var(--accent-blue); }
.comp-col-header {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}
.comp-old-header { color: #ef4444; }
.comp-new-header { color: var(--accent-blue); }
.comp-list { list-style: none; display: flex; flex-direction: column; gap: 7px; padding: 0; margin: 0; }
.comp-list li {
  font-size: 0.82rem;
  color: var(--text-secondary);
  padding-left: 20px;
  position: relative;
  line-height: 1.45;
}
.comp-list-old li::before { content: '✗'; position: absolute; left: 0; color: rgba(239,68,68,0.7); font-weight: 700; }
.comp-list-new li::before { content: '✓'; position: absolute; left: 0; color: var(--accent-blue); font-weight: 700; }
.comp-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: var(--text-dim);
}
.comp-stat-row { display: flex; justify-content: center; flex-shrink: 0; }

/* ─────────────────────────────────────────────────────────────
   SOLUTION slide
───────────────────────────────────────────────────────────── */
.slide-solution-wrap {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 14px;
  overflow: hidden;
}
.sol-header { display: flex; flex-direction: column; flex-shrink: 0; }
.sol-body {
  display: grid;
  grid-template-columns: 1fr 50px 1fr;
  gap: 0;
  align-items: center;
  overflow: hidden;
}
.sol-col { display: flex; flex-direction: column; gap: 10px; height: 100%; padding: 16px; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-xl); overflow: hidden; }
.sol-col-title { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); font-weight: 700; }
.sol-chips { display: flex; flex-wrap: wrap; gap: 6px; overflow: auto; }
.sol-chip {
  font-size: 0.76rem;
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  border: 1px solid;
  font-weight: 500;
}
.sol-chip-in { background: rgba(59,130,246,0.08); border-color: rgba(59,130,246,0.2); color: var(--accent-blue); }
.sol-chip-out { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.2); color: var(--sustain-green); }
.sol-arrow { font-size: 2rem; color: var(--text-dim); text-align: center; }
.sol-stat-row { display: flex; justify-content: center; flex-shrink: 0; }

/* ─────────────────────────────────────────────────────────────
   TRAINING slide
───────────────────────────────────────────────────────────── */
.slide-training-wrap {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 40px;
  align-items: start;
  overflow: auto;
}
.train-left { display: flex; flex-direction: column; }
.train-right { display: flex; flex-direction: column; gap: 10px; }
.train-intro {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
  font-style: italic;
}
.train-section-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  margin-bottom: 8px;
}
.train-principles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.train-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 3px solid var(--slide-accent, var(--accent-blue));
}
.tc-icon { font-size: 1.2rem; }
.tc-title { font-size: 0.82rem; font-weight: 700; color: var(--text-primary); }
.tc-desc { font-size: 0.7rem; color: var(--text-muted); line-height: 1.4; }

/* ─────────────────────────────────────────────────────────────
   VISITS slide
───────────────────────────────────────────────────────────── */
.slide-visits-wrap {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  overflow: hidden;
}
.visits-header { flex-shrink: 0; }
.visits-header .pres-title { margin-bottom: 2px; }
.visits-header .pres-subtitle { margin-bottom: 0; }
.visits-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  overflow: auto;
}
.visit-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 3px solid var(--accent-blue);
  overflow: hidden;
}
.vc-photo-wrap {
  width: 100%;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: -2px;
}
.vc-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.vc-top { display: flex; align-items: flex-start; gap: 8px; }
.vc-icon { font-size: 1.6rem; flex-shrink: 0; }
.vc-company { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
.vc-tagline { font-size: 0.65rem; color: var(--text-muted); margin-top: 1px; }
.vc-section { display: flex; flex-direction: column; gap: 3px; }
.vc-label { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-dim); font-weight: 700; }
.vc-label-cyan { color: var(--accent-cyan); }
.vc-text { font-size: 0.72rem; color: var(--text-secondary); line-height: 1.45; }
.vc-text-cyan { color: var(--accent-cyan); }

/* ─────────────────────────────────────────────────────────────
   TAKEAWAY slide
───────────────────────────────────────────────────────────── */
.takeaway-wrap { gap: 10px; }
.ta-icon { font-size: 3rem; margin-bottom: 4px; }
.ta-title {
  font-size: 3.5rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -2px;
  margin-bottom: 8px;
}
.ta-statement {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 660px;
  line-height: 1.7;
  text-align: center;
}
.ta-closing {
  font-size: 0.95rem;
  font-style: italic;
  color: #10b981;
  max-width: 580px;
  text-align: center;
  font-weight: 600;
  line-height: 1.5;
}

/* ─────────────────────────────────────────────────────────────
   THANK YOU slide
───────────────────────────────────────────────────────────── */
.ty-wrap { gap: 6px; }
.ty-icon { font-size: 4.5rem; margin-bottom: 4px; }
.ty-title {
  font-size: 4rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -2px;
  margin-bottom: 6px;
}
.ty-institution { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; font-weight: 700; margin-bottom: 12px; }
.ty-subtitle { font-size: 1.2rem; color: var(--text-secondary); font-weight: 600; margin-bottom: 18px; }
.ty-team { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 14px; }
.ty-member {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-sm);
  padding: 5px 14px;
  font-size: 0.82rem;
  color: var(--text-secondary);
}
.ty-project { font-size: 0.72rem; color: var(--text-dim); letter-spacing: 0.04em; }

/* ─────────────────────────────────────────────────────────────
   CONTENT slide two-column layout
───────────────────────────────────────────────────────────── */
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
.pres-slide-left { display: flex; flex-direction: column; }
.pres-slide-right { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
.pres-visual { width: 100%; }

.pres-fact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.pres-fact {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.78rem;
}
.pres-fact span:nth-child(1) { font-size: 1.2rem; }
.pres-fact span:nth-child(2) { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-mono); }
.pres-fact span:nth-child(3) { color: var(--text-muted); text-align: center; font-size: 0.68rem; }

/* Why Mining? visual */
.pres-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.pwm-item {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  display: flex; align-items: center; gap: 8px;
  font-size: 0.78rem;
}
.pwm-icon { font-size: 1.1rem; flex-shrink: 0; }
.pwm-text { font-weight: 500; color: var(--text-primary); }

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
.pres-nav-hint { font-size: 0.68rem; color: var(--text-dim); text-align: center; width: 100%; }

/* ─────────────────────────────────────────────────────────────
   PHOTO PANEL (used in content, problem, visits slides)
───────────────────────────────────────────────────────────── */
.slide-photo-panel {
  width: 100%;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-card);
  background: var(--bg-card);
  flex-shrink: 0;
}
.slide-photo-img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
}
.slide-photo-caption {
  padding: 8px 14px;
  font-size: 0.7rem;
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-base);
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
.pres-progress-fill { height: 100%; background: var(--slide-accent, var(--accent-blue)); border-radius: 2px; transition: width 0.4s ease; }

/* ── Transition ── */
.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(30px); }
.slide-fade-leave-to  { opacity: 0; transform: translateX(-20px); }

/* ── Fade-in animation for list items ── */
@keyframes fade-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
</style>
