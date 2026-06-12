<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { presentationSlides, presenters } from '../data/mockData.js'

const router = useRouter()
const current = ref(0)
const selectedPresenter = ref(null)
const imageError = ref({})
const videoErrors = ref({})
const activeVideoId = ref(null)
const videoReadyId = ref(null)
const fallbackWavingId = ref(null)
const videoClickCounts = ref({})
const videoRefs = ref({})
const waveTimers = {}

// Thank You video overlay state
const isThankYouVideoOpen = ref(false)
const thankYouVideoRef = ref(null)
const thankYouContainerRef = ref(null)
const thankYouVideoError = ref(false)
const thankYouWatched = ref(false)
let thankYouWatchedTimer = null

const activeSlides = computed(() => {
  if (!selectedPresenter.value) return presentationSlides
  return selectedPresenter.value.slideIndices.map(i => presentationSlides[i])
})

const total = computed(() => activeSlides.value.length)
const slide = computed(() => activeSlides.value[current.value] || {})

function next() { if (current.value < total.value - 1) current.value++ }
function prev() { if (current.value > 0) current.value-- }
function goTo(i) { current.value = i }
function exit() { router.push('/overview') }

function selectPresenter(p) {
  selectedPresenter.value = p
  current.value = 0
}

function backToTeam() {
  selectedPresenter.value = null
  current.value = 1
}

function getPresenter(memberId) {
  return presenters.find(p => p.id === memberId) || null
}

function onPhotoError(id) {
  imageError.value = { ...imageError.value, [id]: true }
}

function getInitials(id, name) {
  const p = getPresenter(id)
  return p ? p.initials : name.split(' ').map(w => w[0]).slice(0, 2).join('')
}

function setVideoRef(el, id) {
  if (el) videoRefs.value[id] = el
  else delete videoRefs.value[id]
}

function triggerFallback(id) {
  fallbackWavingId.value = id
  clearTimeout(waveTimers['fb_' + id])
  waveTimers['fb_' + id] = setTimeout(() => {
    if (fallbackWavingId.value === id) fallbackWavingId.value = null
  }, 1500)
}

function triggerWave(presenter) {
  if (!presenter) return
  // Stop any current video for this presenter
  clearTimeout(waveTimers[presenter.id])
  videoReadyId.value = null
  activeVideoId.value = null
  fallbackWavingId.value = null

  const hasVideo = !!(presenter.waveVideoSrc && !videoErrors.value[presenter.id])
  if (!hasVideo) { triggerFallback(presenter.id); return }

  // Increment key so Vue creates a fresh video element on re-click
  videoClickCounts.value = { ...videoClickCounts.value, [presenter.id]: (videoClickCounts.value[presenter.id] || 0) + 1 }
  activeVideoId.value = presenter.id

  console.warn('Trying to play video:', presenter.waveVideoSrc)

  nextTick(() => {
    const video = videoRefs.value[presenter.id]
    if (!video) { activeVideoId.value = null; triggerFallback(presenter.id); return }
    const id = presenter.id
    video.play().then(() => {
      if (activeVideoId.value === id) videoReadyId.value = id
    }).catch(err => {
      console.warn(`Autoplay blocked for ${presenter.name}:`, err)
      if (activeVideoId.value === id) { activeVideoId.value = null; triggerFallback(id) }
    })
  })
}

function onVideoEnded(id) {
  if (activeVideoId.value === id) {
    videoReadyId.value = null
    activeVideoId.value = null
  }
}

function onVideoError(id) {
  const p = presenters.find(pr => pr.id === id)
  console.warn(`Wave video failed for ${p?.name}: ${p?.waveVideoSrc}`)
  videoErrors.value = { ...videoErrors.value, [id]: true }
  videoReadyId.value = null
  activeVideoId.value = null
  triggerFallback(id)
}

function stopWave(id) {
  clearTimeout(waveTimers['fb_' + id])
  if (activeVideoId.value === id) { videoReadyId.value = null; activeVideoId.value = null }
  if (fallbackWavingId.value === id) fallbackWavingId.value = null
}

function openThankYouVideo() {
  isThankYouVideoOpen.value = true
  nextTick(() => {
    const video = thankYouVideoRef.value
    if (!video) return
    video.play().catch(() => {})
    const container = thankYouContainerRef.value
    if (container?.requestFullscreen) {
      container.requestFullscreen().catch(() => {})
    }
  })
}

function closeThankYouVideo() {
  const video = thankYouVideoRef.value
  if (video) { video.pause(); video.currentTime = 0 }
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
  isThankYouVideoOpen.value = false
  thankYouWatched.value = true
  clearTimeout(thankYouWatchedTimer)
  thankYouWatchedTimer = setTimeout(() => { thankYouWatched.value = false }, 3200)
}

function onThankYouVideoEnded() {
  closeThankYouVideo()
}

function particleStyle(i) {
  const positions = [
    { x:8,  y:15 }, { x:92, y:18 }, { x:5,  y:62 },
    { x:96, y:55 }, { x:22, y:87 }, { x:82, y:82 },
    { x:47, y:4  }, { x:54, y:93 }, { x:33, y:42 },
    { x:72, y:32 }, { x:14, y:48 }, { x:86, y:8  },
  ]
  const pos = positions[(i - 1) % positions.length]
  const size = 2 + ((i * 7) % 5)
  return {
    left: pos.x + '%',
    top: pos.y + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: ((i - 1) * 0.45) + 's',
    animationDuration: (3 + ((i * 3) % 4)) + 's',
  }
}

function onKey(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (!isThankYouVideoOpen.value) next()
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (!isThankYouVideoOpen.value) prev()
  } else if (e.key === 'Escape') {
    if (isThankYouVideoOpen.value) { closeThankYouVideo(); return }
    if (selectedPresenter.value) backToTeam()
    else exit()
  }
}

onMounted(() => { document.addEventListener('keydown', onKey) })
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  Object.values(waveTimers).forEach(t => clearTimeout(t))
  clearTimeout(thankYouWatchedTimer)
})

const accentColor = computed(() => {
  const s = slide.value
  if (!s) return '#3b82f6'
  if (s.type === 'thankyou' || s.type === 'takeaway') return '#10b981'
  if (s.type === 'videothankyou') return '#3b82f6'
  if (s.type === 'training') return '#10b981'
  if (s.icon === '🌿') return '#10b981'
  if (s.icon === '🚨') return '#ef4444'
  if (s.icon === '❤️') return '#ef4444'
  return '#3b82f6'
})

const stageBg = computed(() => {
  const s = slide.value
  if (!s) return '#3b82f608'
  if (s.type === 'title') return 'radial-gradient(ellipse at 60% 40%, #1e3a5f 0%, #0b0e1a 70%)'
  if (s.type === 'team') return 'linear-gradient(135deg, #0f1a2e 0%, #0b0e1a 100%)'
  if (s.type === 'agents') return 'linear-gradient(135deg, #0f1a2e 0%, #0b0e1a 100%)'
  if (s.type === 'thankyou' || s.type === 'takeaway') return 'radial-gradient(ellipse at 50% 50%, #0d2318 0%, #0b0e1a 70%)'
  if (s.type === 'videothankyou') return 'radial-gradient(ellipse at 50% 30%, #081828 0%, #0b0e1a 80%)'
  if (s.type === 'training') return 'radial-gradient(ellipse at 30% 60%, #091f13 0%, #0b0e1a 70%)'
  if (s.type === 'visits') return 'linear-gradient(135deg, #0e1624 0%, #0b0e1a 100%)'
  if (s.icon === '🌿') return '#10b98108'
  if (s.icon === '🚨') return '#ef444408'
  if (s.icon === '❤️') return '#ef444408'
  return '#3b82f608'
})

const statusColor = { critical: '#ef4444', warning: '#f59e0b', normal: '#22c55e' }

const isLastPresenterSlide = computed(() =>
  !!selectedPresenter.value && current.value === total.value - 1
)

const PRESENTER_ORDER = ['isabella', 'harta', 'sashi', 'shania']

const nextPresenter = computed(() => {
  if (!selectedPresenter.value) return null
  const idx = PRESENTER_ORDER.indexOf(selectedPresenter.value.id)
  if (idx === -1 || idx === PRESENTER_ORDER.length - 1) return null
  return presenters.find(p => p.id === PRESENTER_ORDER[idx + 1]) || null
})

function goToNextPresenter() {
  if (nextPresenter.value) selectPresenter(nextPresenter.value)
}
</script>

<template>
  <div class="pres-wrapper" :style="{ '--slide-accent': accentColor }">

    <!-- Top bar -->
    <div class="pres-topbar">
      <div class="pres-brand">⛏️ MineSafe AI System — HITSZ 2026</div>
      <div class="pres-progress-dots">
        <span
          v-for="(s, i) in activeSlides" :key="i"
          :class="['pres-dot', { active: i === current, done: i < current }]"
          @click="goTo(i)"
        ></span>
      </div>
      <div class="pres-topbar-right">
        <span class="pres-slide-count">{{ current + 1 }} / {{ total }}</span>
        <button class="pres-exit-btn" @click="exit">✕ Exit</button>
      </div>
    </div>

    <!-- Presenter bar — visible only when a presenter is selected -->
    <div v-if="selectedPresenter" class="presenter-bar">
      <div class="pb-left">
        <div class="pb-avatar">{{ selectedPresenter.initials }}</div>
        <div class="pb-info">
          <div class="pb-name">{{ selectedPresenter.name }} {{ selectedPresenter.flag }}</div>
          <div class="pb-role">{{ selectedPresenter.role }}</div>
        </div>
      </div>
      <div class="pb-center">
        <span class="pb-label">Presenting slide</span>
        <span class="pb-pos">{{ current + 1 }} of {{ total }}</span>
        <span v-if="slide.title" class="pb-slide-title">· {{ slide.title }}</span>
      </div>
      <button class="pb-back-btn" @click="backToTeam">← Back to Team</button>
    </div>

    <!-- Stage -->
    <div class="pres-stage" :style="{ background: stageBg }">
      <transition name="slide-fade" mode="out-in">
        <div :key="current + (selectedPresenter ? selectedPresenter.id : '')" class="pres-slide">

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
            <div v-if="slide.url" class="title-access">
              <div class="title-access-label">Scan or visit to access the live dashboard</div>
              <div class="title-access-row">
                <img class="title-qr" :src="`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${slide.url}&bgcolor=192030&color=e2e8f0`" :alt="slide.url" />
                <span class="title-url">{{ slide.url }}</span>
              </div>
            </div>
          </div>

          <!-- ── TEAM slide ──────────────────────────────────────── -->
          <div v-else-if="slide.type === 'team'" class="slide-full-wrap">
            <div class="team-header">
              <div class="pres-slide-number">{{ String(current + 1).padStart(2, '0') }}</div>
              <h1 class="pres-title">{{ slide.title }}</h1>
              <p class="pres-subtitle">{{ slide.subtitle }}</p>
            </div>
            <div class="team-grid">
              <div
                v-for="m in slide.members" :key="m.name"
                class="team-card team-card-clickable"
                :aria-label="`${m.name} — ${m.role}`"
                role="button"
                tabindex="0"
                @mouseenter="triggerWave(getPresenter(m.id))"
                @mouseleave="stopWave(m.id)"
                @keydown.enter="triggerWave(getPresenter(m.id))"
              >
                <div
                  class="avatar-wrap"
                  :class="{ 'avatar-waving': fallbackWavingId === m.id }"
                >
                  <div class="media-circle">
                    <!-- Photo: ALWAYS visible at z-index 1 — video overlays it when playing -->
                    <img
                      v-if="getPresenter(m.id)?.photoSrc && !imageError[m.id]"
                      :src="getPresenter(m.id).photoSrc"
                      :alt="m.name"
                      class="media-photo"
                      @error="onPhotoError(m.id)"
                    />
                    <div v-else class="media-initials">{{ getInitials(m.id, m.name) }}</div>
                    <!-- Video: z-index 2, starts transparent, fades in after play() resolves -->
                    <video
                      v-if="activeVideoId === m.id && !videoErrors[m.id]"
                      :key="'v-' + m.id + '-' + (videoClickCounts[m.id] || 0)"
                      :ref="el => setVideoRef(el, m.id)"
                      :src="getPresenter(m.id).waveVideoSrc"
                      class="media-video"
                      :class="{ 'media-video-ready': videoReadyId === m.id }"
                      muted
                      playsinline
                      @ended="onVideoEnded(m.id)"
                      @error="onVideoError(m.id)"
                    />
                    <!-- Wave badge for CSS fallback only -->
                    <div v-if="fallbackWavingId === m.id" class="wave-badge">👋</div>
                  </div>
                </div>
                <div class="team-name">{{ m.name }}</div>
                <div v-if="getPresenter(m.id)?.flag" class="team-origin">
                  <span class="team-flag">{{ getPresenter(m.id).flag }}</span>
                  <span class="team-country">{{ getPresenter(m.id).country }}</span>
                </div>
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
              <div v-if="slide.photo" class="slide-photo-panel" style="margin-top:10px">
                <img :src="slide.photo" :alt="slide.photoCaption || slide.title" class="slide-photo-img" style="height:130px" />
                <div v-if="slide.photoCaption" class="slide-photo-caption">{{ slide.photoCaption }}</div>
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
              <div v-if="slide.photo" class="slide-photo-panel" style="margin-top:10px">
                <img :src="slide.photo" :alt="slide.photoCaption || slide.title" class="slide-photo-img" style="height:130px" />
                <div v-if="slide.photoCaption" class="slide-photo-caption">{{ slide.photoCaption }}</div>
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

          <!-- ── VIDEO THANK YOU slide ──────────────────────────── -->
          <div v-else-if="slide.type === 'videothankyou'" class="ty-video-slide">
            <!-- Floating particles -->
            <div class="ty-particles" aria-hidden="true">
              <span v-for="i in 12" :key="i" class="ty-particle" :style="particleStyle(i)"></span>
            </div>

            <div class="ty-video-content">
              <!-- Header text -->
              <div class="ty-video-eyebrow">Closing Ceremony</div>
              <h1 class="ty-video-title">{{ slide.title }}</h1>
              <p class="ty-video-subtitle">{{ slide.subtitle }}</p>
              <p class="ty-video-closing">{{ slide.closing }}</p>

              <!-- Video preview card -->
              <div
                class="ty-video-card"
                role="button"
                tabindex="0"
                aria-label="Open thank you video in fullscreen"
                @click="openThankYouVideo"
                @keydown.enter="openThankYouVideo"
                @keydown.space.prevent="openThankYouVideo"
              >
                <!-- Muted preview video -->
                <video
                  v-if="!thankYouVideoError"
                  class="ty-preview-video"
                  :src="slide.videoSrc"
                  muted
                  playsinline
                  autoplay
                  loop
                  preload="metadata"
                  @error="thankYouVideoError = true"
                ></video>

                <!-- Error fallback -->
                <div v-if="thankYouVideoError" class="ty-video-fallback">
                  <div class="ty-fallback-icon">🎬</div>
                  <div class="ty-fallback-text">Thank-you video not found</div>
                  <div class="ty-fallback-hint">Add the video file to /public/images/mining</div>
                </div>

                <!-- Dark cinematic overlay -->
                <div class="ty-video-overlay" aria-hidden="true"></div>

                <!-- Animated light sweep -->
                <div class="ty-light-sweep" aria-hidden="true"></div>

                <!-- Play button (centered) -->
                <div class="ty-play-center" aria-hidden="true">
                  <div class="ty-play-ring"></div>
                  <div class="ty-play-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                <!-- Card labels -->
                <div class="ty-card-labels" aria-hidden="true">
                  <div class="ty-card-main-label">Watch Team Memory Video</div>
                  <div class="ty-card-hint">Click to open fullscreen &nbsp;·&nbsp; ♪ See You Again</div>
                </div>
              </div>

              <!-- Memory timeline dots -->
              <div class="ty-timeline-row" aria-hidden="true">
                <span
                  v-for="j in 9" :key="j"
                  class="ty-tl-dot"
                  :style="{ animationDelay: (j * 0.18) + 's' }"
                ></span>
              </div>

              <!-- Download full-quality button -->
              <a
                v-if="slide.downloadSrc"
                :href="slide.downloadSrc"
                download="Thank you video.MP4"
                class="ty-download-btn"
                aria-label="Download full quality thank you video"
                @click.stop
              >
                <svg class="ty-dl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Full Quality
                <span class="ty-dl-size">55 MB</span>
              </a>

              <!-- Post-watch message -->
              <transition name="watched-fade">
                <div v-if="thankYouWatched" class="ty-watched-msg">
                  Thank you for watching ✨
                </div>
              </transition>

              <!-- Footer -->
              <div class="ty-video-footer">{{ slide.footer }}</div>
            </div>
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

              <div class="pres-nav-hint">← → to navigate · Esc to {{ selectedPresenter ? 'return to team' : 'exit' }}</div>
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
      <template v-if="isLastPresenterSlide">
        <button class="pres-nav-btn" @click="backToTeam">↩ Back to Team</button>
        <button v-if="nextPresenter" class="pres-nav-btn primary" @click="goToNextPresenter">
          Next: {{ nextPresenter.name }} {{ nextPresenter.flag }} →
        </button>
      </template>
      <button
        v-else
        class="pres-nav-btn primary"
        @click="current === total - 1 ? exit() : next()"
      >
        {{ current === total - 1 ? 'Finish ✓' : 'Next →' }}
      </button>
    </div>
  </div>

  <!-- Fullscreen thank you video overlay -->
  <Teleport to="body">
    <div
      v-if="isThankYouVideoOpen"
      class="ty-fullscreen-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Thank you team memory video"
      @click.self="closeThankYouVideo"
    >
      <div class="ty-fullscreen-container" ref="thankYouContainerRef">
        <div class="ty-fullscreen-header">
          <div class="ty-fs-info">
            <div class="ty-fs-title">Thank You — Team Memory Video</div>
            <div class="ty-fs-caption">♪ See You Again</div>
          </div>
          <button
            class="ty-close-btn"
            aria-label="Close thank you video"
            @click="closeThankYouVideo"
          >✕</button>
        </div>
        <video
          ref="thankYouVideoRef"
          :src="slide.videoSrc"
          class="ty-fullscreen-video"
          controls
          playsinline
          @ended="onThankYouVideoEnded"
        ></video>
      </div>
    </div>
  </Teleport>
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

/* ── Presenter Bar ── */
.presenter-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 8px 28px;
  background: rgba(59, 130, 246, 0.06);
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  flex-shrink: 0;
}
.pb-left { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.pb-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-blue), #6366f1);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 800; color: white; letter-spacing: -0.3px;
  flex-shrink: 0;
}
.pb-info { display: flex; flex-direction: column; }
.pb-name { font-size: 0.8rem; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
.pb-role { font-size: 0.65rem; color: var(--text-muted); }
.pb-center { flex: 1; display: flex; align-items: center; gap: 6px; min-width: 0; }
.pb-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-dim); flex-shrink: 0; }
.pb-pos { font-size: 0.75rem; font-family: var(--font-mono); color: var(--accent-blue); font-weight: 700; flex-shrink: 0; }
.pb-slide-title {
  font-size: 0.72rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pb-back-btn {
  background: none;
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: var(--accent-blue);
  padding: 5px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--font-sans);
  white-space: nowrap;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}
.pb-back-btn:hover { background: rgba(59, 130, 246, 0.12); border-color: var(--accent-blue); }

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
.title-access {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.title-access-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-dim);
}
.title-access-row {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-sm);
  padding: 10px 16px;
}
.title-qr {
  width: 64px;
  height: 64px;
  border-radius: 4px;
  display: block;
}
.title-url {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent-blue);
  letter-spacing: 0.04em;
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
  justify-content: center;
}
.team-header { text-align: center; margin-bottom: 32px; }
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 300px));
  gap: 28px;
  justify-content: center;
  width: min(100%, 1400px);
  margin: 0 auto;
}
@media (max-width: 1400px) {
  .team-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 280px));
  }
}
.team-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-xl);
  padding: 32px 28px;
  min-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  border-top: 3px solid var(--accent-blue);
}
.team-card-clickable {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-top-color 0.2s ease, background 0.2s ease;
  outline: none;
}
.team-card-clickable:hover,
.team-card-clickable:focus-visible {
  border-top-color: var(--slide-accent, var(--accent-blue));
  background: rgba(59, 130, 246, 0.07);
  transform: translateY(-6px);
  box-shadow: 0 12px 36px rgba(59, 130, 246, 0.3);
}
.team-card-clickable:active { transform: translateY(-1px); }
.avatar-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.team-card-clickable:hover .avatar-wrap {
  transform: scale(1.04);
}
.avatar-wrap.avatar-waving {
  animation: avatarWave 0.45s ease 3;
}
@keyframes avatarWave {
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(-4deg) scale(1.04); }
  50%  { transform: rotate(4deg) scale(1.06); }
  75%  { transform: rotate(-2deg) scale(1.04); }
  100% { transform: rotate(0deg) scale(1); }
}
.wave-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 1.5rem;
  line-height: 1;
  pointer-events: none;
  animation: waveBadgePop 0.25s ease forwards;
}
@keyframes waveBadgePop {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
.media-circle {
  width: 150px;
  height: 150px;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  border: 3px solid rgba(59, 130, 246, 0.85);
  box-shadow: 0 0 32px rgba(59, 130, 246, 0.4);
  background: rgba(37, 99, 235, 0.2);
}
.media-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  z-index: 1;
}
.media-initials {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--accent-blue), #6366f1);
}
.media-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.media-video-ready {
  opacity: 1;
}
@media (max-width: 1200px) {
  .media-circle {
    width: 128px;
    height: 128px;
  }
}
.team-name { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
.team-role { font-size: 0.72rem; color: var(--text-muted); line-height: 1.4; flex: 1; }
.team-origin {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
}
.team-flag { font-size: 1.4rem; line-height: 1; }
.team-country {
  font-size: 0.8rem;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}
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
   PHOTO PANEL
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

/* ─────────────────────────────────────────────────────────────
   VIDEO THANK YOU slide
───────────────────────────────────────────────────────────── */
.ty-video-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* ── Floating particles ── */
.ty-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.ty-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.35);
  animation: ty-particle-float linear infinite;
}
@keyframes ty-particle-float {
  0%   { transform: translateY(0) scale(1); opacity: 0.7; }
  60%  { opacity: 0.25; }
  100% { transform: translateY(-55px) scale(0.5); opacity: 0; }
}

/* ── Content ── */
.ty-video-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: min(100%, 980px);
  text-align: center;
  padding: 0 20px;
}

.ty-video-eyebrow {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--accent-blue);
  font-weight: 700;
}
.ty-video-title {
  font-size: 3.6rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -2px;
  line-height: 1;
  margin: 0;
}
.ty-video-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
  font-style: italic;
}
.ty-video-closing {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 0;
  max-width: 540px;
}

/* ── Video preview card ── */
.ty-video-card {
  position: relative;
  width: min(100%, 820px);
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.55);
  box-shadow:
    0 0 40px rgba(59, 130, 246, 0.25),
    inset 0 0 28px rgba(59, 130, 246, 0.08);
  cursor: pointer;
  background: #04090f;
  outline: none;
  transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.35s ease, border-color 0.35s ease;
}
.ty-video-card:hover,
.ty-video-card:focus-visible {
  transform: translateY(-5px) scale(1.012);
  border-color: rgba(59, 130, 246, 0.85);
  box-shadow:
    0 0 64px rgba(59, 130, 246, 0.42),
    0 24px 48px rgba(0, 0, 0, 0.6),
    inset 0 0 32px rgba(59, 130, 246, 0.14);
}

.ty-preview-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.38;
  pointer-events: none;
}

/* Fallback when video file is missing */
.ty-video-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--bg-card);
  z-index: 1;
}
.ty-fallback-icon { font-size: 2.4rem; }
.ty-fallback-text { font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; }
.ty-fallback-hint { font-size: 0.65rem; color: var(--text-muted); }

/* Dark cinematic overlay */
.ty-video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(4, 10, 22, 0.72) 0%,
    rgba(4, 10, 22, 0.44) 45%,
    rgba(4, 10, 22, 0.72) 100%
  );
  z-index: 2;
  pointer-events: none;
}

/* Animated light sweep */
.ty-light-sweep {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
}
.ty-light-sweep::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(59, 130, 246, 0.07) 50%,
    transparent 70%
  );
  background-size: 250% 100%;
  animation: ty-sweep 3.8s ease-in-out infinite;
}
@keyframes ty-sweep {
  0%   { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

/* ── Play button ── */
.ty-play-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -52%);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.ty-play-ring {
  position: absolute;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  border: 1.5px solid rgba(59, 130, 246, 0.45);
  animation: ty-pulse-ring 2.2s ease-in-out infinite;
}
@keyframes ty-pulse-ring {
  0%, 100% { transform: scale(1);    opacity: 0.65; }
  50%       { transform: scale(1.18); opacity: 0.18; }
}
.ty-play-btn {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 30px rgba(59, 130, 246, 0.55),
    0 0 0 3px rgba(59, 130, 246, 0.22);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.ty-video-card:hover .ty-play-btn,
.ty-video-card:focus-visible .ty-play-btn {
  transform: scale(1.12);
  background: rgba(59, 130, 246, 1);
  box-shadow:
    0 0 48px rgba(59, 130, 246, 0.72),
    0 0 0 5px rgba(59, 130, 246, 0.28);
}
.ty-play-btn svg {
  width: 30px;
  height: 30px;
  color: white;
  margin-left: 4px;
}

/* ── Card bottom labels ── */
.ty-card-labels {
  position: absolute;
  bottom: 18px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 4;
  pointer-events: none;
}
.ty-card-main-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 4px;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.7);
}
.ty-card-hint {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

/* ── Memory timeline dots (below card) ── */
.ty-timeline-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
.ty-tl-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.4);
  animation: ty-dot-pulse 1.6s ease-in-out infinite;
}
@keyframes ty-dot-pulse {
  0%, 100% { opacity: 0.25; transform: scale(1);   background: rgba(59, 130, 246, 0.4); }
  50%       { opacity: 1;    transform: scale(1.45); background: rgba(59, 130, 246, 1); }
}

/* ── Post-watch message ── */
.ty-watched-msg {
  font-size: 0.88rem;
  color: var(--sustain-green);
  font-weight: 600;
  font-style: italic;
  min-height: 1.4em;
}
.watched-fade-enter-active { transition: opacity 0.5s ease; }
.watched-fade-leave-active { transition: opacity 0.4s ease; }
.watched-fade-enter-from,
.watched-fade-leave-to { opacity: 0; }

/* ── Download button ── */
.ty-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(59, 130, 246, 0.35);
  background: rgba(59, 130, 246, 0.07);
  color: var(--accent-blue);
  font-size: 0.78rem;
  font-weight: 600;
  font-family: var(--font-sans);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}
.ty-download-btn:hover {
  background: rgba(59, 130, 246, 0.16);
  border-color: rgba(59, 130, 246, 0.65);
  color: #93c5fd;
}
.ty-dl-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.ty-dl-size {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  opacity: 0.65;
  margin-left: 2px;
}

/* ── Footer ── */
.ty-video-footer {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--text-dim);
}

/* ─────────────────────────────────────────────────────────────
   FULLSCREEN VIDEO OVERLAY  (teleported to body)
───────────────────────────────────────────────────────────── */
.ty-fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(2, 5, 18, 0.96);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding:
    max(24px, env(safe-area-inset-top, 24px))
    24px
    max(24px, env(safe-area-inset-bottom, 24px));
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: ty-overlay-in 0.2s ease forwards;
}
@keyframes ty-overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.ty-fullscreen-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  width: min(100%, 1200px);
}

.ty-fullscreen-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px;
}
.ty-fs-info { flex: 1; min-width: 0; }
.ty-fs-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  font-family: var(--font-sans);
}
.ty-fs-caption {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-style: italic;
  margin-top: 1px;
}
.ty-close-btn {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--text-secondary);
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
  margin-right: max(0px, env(safe-area-inset-right, 0px));
}
.ty-close-btn:hover {
  background: rgba(239, 68, 68, 0.18);
  border-color: #ef4444;
  color: #ef4444;
}

.ty-fullscreen-video {
  width: 100%;
  max-height: 82dvh;
  border-radius: 14px;
  box-shadow:
    0 0 48px rgba(59, 130, 246, 0.28),
    0 20px 60px rgba(0, 0, 0, 0.8);
  background: #000;
  display: block;
}

/* ─────────────────────────────────────────────────────────────
   MOBILE (≤ 768px) — preserve desktop, fix iPhone Safari
───────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  /* Topbar: wrap progress dots onto a second row */
  .pres-topbar {
    padding: 10px 16px;
    padding-top: max(10px, env(safe-area-inset-top, 10px));
    flex-wrap: wrap;
    gap: 6px;
  }
  .pres-brand {
    font-size: 0.7rem;
    flex-shrink: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pres-progress-dots {
    order: 3;
    flex-basis: 100%;
    max-width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 4px;
    padding-bottom: 2px;
  }
  .pres-progress-dots::-webkit-scrollbar { display: none; }
  .pres-topbar-right { gap: 6px; flex-shrink: 0; }
  .pres-slide-count  { font-size: 0.65rem; }
  .pres-exit-btn     { padding: 4px 10px; font-size: 0.72rem; }

  /* Presenter bar: compact */
  .presenter-bar { padding: 8px 16px; gap: 8px; }
  .pb-center     { display: none; }
  .pb-role       { display: none; }
  .pb-back-btn   { padding: 4px 10px; font-size: 0.7rem; }

  /* Stage: allow vertical scroll instead of clipping */
  .pres-stage {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px;
    padding-bottom: 20px;
  }

  /* Slide: auto-height so content can exceed the stage height */
  .pres-slide { height: auto; align-items: flex-start; }

  /* All slide wrappers: remove fixed height + overflow clip */
  .slide-center-wrap,
  .slide-full-wrap,
  .slide-agents-wrap,
  .slide-dashboard-wrap,
  .slide-problem-wrap,
  .slide-comparison-wrap,
  .slide-solution-wrap,
  .slide-training-wrap,
  .slide-visits-wrap,
  .ty-video-slide {
    height: auto;
    min-height: 0;
    overflow: visible;
  }

  /* Title/takeaway/thankyou: top-align instead of vertical-center */
  .slide-center-wrap { justify-content: flex-start; padding-top: 8px; }

  /* Two-column → single column */
  .pres-slide-inner  { grid-template-columns: 1fr; height: auto; gap: 20px; align-items: flex-start; }
  .slide-agents-wrap { grid-template-columns: 1fr; gap: 20px; }
  .slide-dashboard-wrap { grid-template-columns: 1fr; gap: 20px; }
  .slide-problem-wrap   { grid-template-columns: 1fr; gap: 20px; }
  .slide-training-wrap  { grid-template-columns: 1fr; gap: 20px; }

  /* Comparison/Solution: drop the centre-divider column */
  .comp-body { grid-template-columns: 1fr 1fr; gap: 12px; overflow: visible; }
  .comp-divider { display: none; }
  .comp-col   { overflow: visible; }
  .sol-body   { grid-template-columns: 1fr; gap: 12px; overflow: visible; }
  .sol-col    { height: auto; overflow: visible; }
  .sol-arrow  { display: none; }

  /* Visits: 5-col → 2-col */
  .slide-visits-wrap { overflow: visible; }
  .visits-grid { grid-template-columns: repeat(2, 1fr); overflow: visible; }

  /* Fix remaining inner elements locked to height:100% */
  .agents-right { height: auto; overflow: visible; }
  .dash-right   { height: auto; }

  /* Small fact/why/data grids → single column */
  .pres-fact-grid,
  .pres-why-grid,
  .pres-data-sources,
  .train-principles { grid-template-columns: 1fr; }

  /* Typography scale-down */
  .pres-slide-number { font-size: 2rem; margin-bottom: 0; }
  .pres-title     { font-size: 1.35rem; line-height: 1.2; }
  .pres-subtitle  { font-size: 0.8rem; }
  .pres-stat-value { font-size: 2.4rem; }
  .title-main     { font-size: 1.8rem; letter-spacing: -0.5px; line-height: 1.1; }
  .title-icon     { font-size: 2.5rem; }
  .title-sub      { font-size: 0.9rem; margin-bottom: 12px; }

  /* Team slide: single column */
  .team-grid  { grid-template-columns: 1fr; max-width: 340px; }
  .team-card  { min-height: auto; padding: 24px 20px; }
  .team-header { margin-bottom: 16px; }

  /* Dashboard iframe: min-height so it is usable */
  .iframe-shell { min-height: 220px; }

  /* Photo panel: shorter on mobile */
  .slide-photo-img { height: 160px; }

  /* Bottom nav: compact + safe-area */
  .pres-bottombar {
    padding: 10px 16px;
    padding-bottom: max(10px, env(safe-area-inset-bottom, 10px));
    gap: 8px;
    flex-wrap: wrap;
  }
  .pres-nav-btn {
    padding: 7px 12px;
    font-size: 0.72rem;
    flex-shrink: 1;
    min-width: 0;
  }
  .pres-progress-bar { min-width: 40px; }

  /* Video thank you slide — mobile */
  .ty-video-slide { align-items: flex-start; padding-top: 12px; }
  .ty-video-content { gap: 10px; padding: 0 8px; }
  .ty-video-title  { font-size: 2.2rem; letter-spacing: -1px; }
  .ty-video-subtitle { font-size: 0.82rem; }
  .ty-video-closing { font-size: 0.72rem; }
  .ty-video-card { border-radius: 14px; }
  .ty-play-btn  { width: 56px; height: 56px; }
  .ty-play-btn svg { width: 24px; height: 24px; }
  .ty-play-ring { width: 76px; height: 76px; }
  .ty-card-main-label { font-size: 0.72rem; }

  /* Fullscreen overlay — mobile */
  .ty-fullscreen-video { max-height: 80dvh; border-radius: 8px; }
  .ty-fullscreen-header { flex-wrap: wrap; }
  .ty-fs-title { font-size: 0.78rem; }
}
</style>
