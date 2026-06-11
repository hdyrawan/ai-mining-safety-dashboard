<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const notesOpen = ref(false)

const nodes = [
  {
    id: 'drones',
    icon: '🚁',
    color: '#06b6d4',
    colorBg: 'rgba(6,182,212,0.08)',
    colorBorder: 'rgba(6,182,212,0.3)',
    title: 'Drones',
    description: 'Collect aerial imagery, terrain data, stockpile measurements, and safety monitoring data across the mining site.',
    tags: ['Aerial imagery', 'Terrain scan', 'Stockpile volume', 'Safety observations', 'Drone telemetry'],
    link: '/drone-monitoring',
    linkLabel: 'View Drone Monitoring →',
  },
  {
    id: 'cloud',
    icon: '☁️',
    color: '#3b82f6',
    colorBg: 'rgba(59,130,246,0.08)',
    colorBorder: 'rgba(59,130,246,0.3)',
    title: 'Cloud Storage',
    description: 'Centralises large volumes of drone-generated data in a secure, scalable environment with redundant backup.',
    tags: ['Video files', 'Image datasets', 'Sensor logs', 'Survey outputs', 'Metadata'],
    link: null,
  },
  {
    id: 'pipeline',
    icon: '⚙️',
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.3)',
    title: 'Data Processing Pipeline',
    description: 'Transforms raw drone and sensor data into structured information ready for analysis and decision-making.',
    tags: ['Image preprocessing', 'Object detection', 'Terrain mapping', 'Risk scoring', 'Data validation'],
    link: null,
  },
  {
    id: 'warehouse',
    icon: '🗄️',
    color: '#6366f1',
    colorBg: 'rgba(99,102,241,0.08)',
    colorBorder: 'rgba(99,102,241,0.3)',
    title: 'Data Warehouse',
    description: 'Central repository for structured mining data, historical records, operational metrics, and analytical results.',
    tags: ['Zone history', 'Incident records', 'Worker safety metrics', 'Drone survey results', 'Environmental readings'],
    link: null,
  },
  {
    id: 'dashboard',
    icon: '🖥️',
    color: '#22c55e',
    colorBg: 'rgba(34,197,94,0.08)',
    colorBorder: 'rgba(34,197,94,0.3)',
    title: 'Web Dashboard',
    description: 'Displays KPIs, risk alerts, drone monitoring, worker health, and operational insights in real time.',
    tags: ['Risk scores', 'Active alerts', 'Drone detections', 'Safety KPIs', 'Sustainability metrics'],
    link: '/overview',
    linkLabel: 'View Command Center →',
  },
  {
    id: 'decisions',
    icon: '👔',
    color: '#14b8a6',
    colorBg: 'rgba(20,184,166,0.08)',
    colorBorder: 'rgba(20,184,166,0.3)',
    title: 'Decision Makers',
    description: 'Engineers, managers, safety teams, and stakeholders act faster and smarter with accessible, structured insights.',
    tags: ['Evacuation decision', 'Maintenance dispatch', 'Safety intervention', 'Production planning', 'ESG reporting'],
    link: null,
  },
]

const benefits = [
  {
    icon: '🔒',
    color: '#3b82f6',
    title: 'Secure Storage',
    desc: 'Centralised storage for large drone-generated datasets with access controls and audit logging.',
  },
  {
    icon: '⚡',
    color: '#06b6d4',
    title: 'Real-Time Access',
    desc: 'Engineers, managers, and stakeholders access operational information from anywhere, at any time.',
  },
  {
    icon: '📈',
    color: '#22c55e',
    title: 'Scalability',
    desc: 'The platform accommodates growing drone, sensor, and operational data volumes over time.',
  },
  {
    icon: '🤖',
    color: '#6366f1',
    title: 'Dashboard Integration',
    desc: 'Processed data feeds AI models, KPIs, live alerts, and decision-support dashboards.',
  },
]

const presenterScript = `To support mining operations, the proposed solution uses drones to collect field data from the mining site. These drones can capture aerial images, terrain information, stockpile measurements, drone telemetry, and safety monitoring data more efficiently and safely.

Once collected, the data is transmitted to a cloud-based platform for processing and analysis. Instead of storing information on local computers, cloud technology allows the operation to centralise project data in a secure and scalable environment.

The data processing pipeline transforms raw drone and sensor data into structured information. This may include image preprocessing, terrain mapping, object detection, safety risk scoring, and data validation.

A data warehouse then acts as the central repository for structured mining data. It stores historical records, operational metrics, incident data, environmental readings, and analytical results so that teams can access consistent information over time.

The web dashboard presents this information in a practical format, including KPIs, mining site statistics, drone survey results, risk alerts, and operational insights. Although the current prototype uses dummy data for demonstration purposes, the same architecture can later be connected to real drone data and production systems.

By combining drone technology, cloud computing, data warehousing, AI processing, and interactive dashboards, the solution creates a modern digital mining ecosystem that improves data accessibility, operational efficiency, safety monitoring, and strategic decision-making.`
</script>

<template>
  <div class="arch-view">

    <!-- Page header -->
    <div class="page-header-block">
      <h1 class="page-title">🗄️ Data Collection, Processing &amp; Storage</h1>
      <p class="page-subtitle">End-to-end data architecture — from drone field collection to decision-maker insight</p>
    </div>

    <!-- Architecture flow -->
    <div class="flow-scroll-wrap">
      <div class="arch-flow">
        <template v-for="(node, i) in nodes" :key="node.id">

          <!-- Node card -->
          <div
            class="arch-node"
            :style="{
              background: node.colorBg,
              borderColor: node.colorBorder,
            }"
          >
            <div class="node-icon-row">
              <span class="node-icon">{{ node.icon }}</span>
              <span class="node-step" :style="{ color: node.color }">0{{ i + 1 }}</span>
            </div>
            <div class="node-title" :style="{ color: node.color }">{{ node.title }}</div>
            <div class="node-desc">{{ node.description }}</div>
            <div class="node-tags">
              <span
                v-for="tag in node.tags"
                :key="tag"
                class="node-tag"
                :style="{ borderColor: node.colorBorder, color: node.color }"
              >{{ tag }}</span>
            </div>
            <button
              v-if="node.link"
              class="node-link-btn"
              :style="{ color: node.color, borderColor: node.colorBorder }"
              @click="router.push(node.link)"
            >{{ node.linkLabel }}</button>
          </div>

          <!-- Connector (between nodes) -->
          <div v-if="i < nodes.length - 1" class="flow-connector">
            <div class="fc-line"></div>
            <div class="fc-dots">
              <span class="fc-dot" :style="{ background: nodes[i + 1].color }"></span>
              <span class="fc-dot" :style="{ background: nodes[i + 1].color, animationDelay: '0.65s' }"></span>
              <span class="fc-dot" :style="{ background: nodes[i + 1].color, animationDelay: '1.3s' }"></span>
            </div>
            <div class="fc-arrow" :style="{ color: nodes[i + 1].color }">›</div>
          </div>

        </template>
      </div>
    </div>

    <!-- Flow label legend -->
    <div class="flow-legend">
      <span class="fl-item">
        <span class="fl-dot" style="background:#06b6d4"></span>Collection
      </span>
      <span class="fl-arrow">→</span>
      <span class="fl-item">
        <span class="fl-dot" style="background:#3b82f6"></span>Storage
      </span>
      <span class="fl-arrow">→</span>
      <span class="fl-item">
        <span class="fl-dot" style="background:#f59e0b"></span>Processing
      </span>
      <span class="fl-arrow">→</span>
      <span class="fl-item">
        <span class="fl-dot" style="background:#6366f1"></span>Warehouse
      </span>
      <span class="fl-arrow">→</span>
      <span class="fl-item">
        <span class="fl-dot" style="background:#22c55e"></span>Dashboard
      </span>
      <span class="fl-arrow">→</span>
      <span class="fl-item">
        <span class="fl-dot" style="background:#14b8a6"></span>Action
      </span>
    </div>

    <!-- Architecture benefits -->
    <div class="section-header" style="margin-bottom:12px">
      <span class="section-title-text">Architecture Benefits</span>
    </div>
    <div class="benefits-grid">
      <div
        v-for="b in benefits"
        :key="b.title"
        class="benefit-card"
        :style="{ borderColor: b.color + '44' }"
      >
        <div class="bc-icon" :style="{ color: b.color }">{{ b.icon }}</div>
        <div class="bc-title" :style="{ color: b.color }">{{ b.title }}</div>
        <div class="bc-desc">{{ b.desc }}</div>
      </div>
    </div>

    <!-- Closing message -->
    <div class="closing-card">
      <div class="cc-glow"></div>
      <div class="cc-icon">💡</div>
      <div class="cc-text">
        This architecture transforms raw drone data into actionable business intelligence, enabling
        <strong>safer</strong>, <strong>smarter</strong>, and more <strong>data-driven</strong> mining operations.
      </div>
    </div>

    <!-- Presenter notes toggle -->
    <div class="presenter-panel">
      <button class="notes-toggle" @click="notesOpen = !notesOpen">
        <span class="nt-icon">📋</span>
        <span class="nt-label">Presenter Notes</span>
        <span class="nt-chevron" :class="{ open: notesOpen }">▾</span>
      </button>
      <transition name="notes-expand">
        <div v-if="notesOpen" class="notes-body">
          <div class="notes-header">Suggested presenter script (1–2 minutes)</div>
          <div class="notes-text">{{ presenterScript }}</div>
        </div>
      </transition>
    </div>

    <!-- Prototype disclaimer -->
    <div class="disclaimer">
      <span class="disclaimer-icon">ℹ️</span>
      Prototype note: This demo currently uses simulated data. In a production environment, the same
      architecture can connect to real drone feeds, IoT sensors, cloud storage, data pipelines, and
      mining operational systems.
    </div>

  </div>
</template>

<style scoped>
.arch-view { padding-bottom: 32px; }

.page-header-block { margin-bottom: 20px; }

/* ── Flow scroll wrapper ── */
.flow-scroll-wrap {
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 12px;
  -webkit-overflow-scrolling: touch;
}

.arch-flow {
  display: flex;
  align-items: stretch;
  gap: 0;
  min-width: 900px;
}

/* ── Node card ── */
.arch-node {
  flex: 1;
  min-width: 150px;
  max-width: 220px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding: 16px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow var(--transition-base);
}
.arch-node:hover {
  box-shadow: 0 0 18px rgba(255,255,255,0.06);
}

.node-icon-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.node-icon { font-size: 1.5rem; }
.node-step {
  font-size: 0.65rem;
  font-weight: 800;
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
  opacity: 0.7;
}
.node-title {
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.2;
}
.node-desc {
  font-size: 0.68rem;
  color: var(--text-muted);
  line-height: 1.55;
  flex: 1;
}
.node-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}
.node-tag {
  font-size: 0.6rem;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: rgba(255,255,255,0.04);
  white-space: nowrap;
}
.node-link-btn {
  margin-top: 6px;
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 5px 8px;
  font-size: 0.65rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);
}
.node-link-btn:hover {
  background: rgba(255,255,255,0.05);
}

/* ── Flow connector ── */
.flow-connector {
  flex: 0 0 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 2px;
  margin-top: 32px;
}
.fc-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--border-base), var(--border-card));
  transform: translateY(-50%);
}
.fc-dots {
  position: relative;
  width: 100%;
  height: 8px;
}
.fc-dot {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  animation: flowDot 1.95s ease-in-out infinite;
}
.fc-arrow {
  position: absolute;
  right: -3px;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 1px;
  opacity: 0.6;
  line-height: 1;
}

@keyframes flowDot {
  0%   { left: 0%;   opacity: 0; }
  8%   { opacity: 1; }
  88%  { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

/* ── Flow legend ── */
.flow-legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  padding: 8px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm);
}
.fl-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
}
.fl-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.fl-arrow {
  font-size: 0.7rem;
  color: var(--text-dim);
}

/* ── Section header ── */
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.section-title-text {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ── Benefits grid ── */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.benefit-card {
  background: var(--bg-card);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  transition: box-shadow var(--transition-base);
}
.benefit-card:hover {
  box-shadow: 0 0 16px rgba(255,255,255,0.04);
}
.bc-icon { font-size: 1.3rem; }
.bc-title {
  font-size: 0.82rem;
  font-weight: 700;
}
.bc-desc {
  font-size: 0.7rem;
  color: var(--text-muted);
  line-height: 1.55;
}

/* ── Closing card ── */
.closing-card {
  position: relative;
  background: linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(16,185,129,0.08) 100%);
  border: 1px solid rgba(59,130,246,0.3);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  overflow: hidden;
}
.cc-glow {
  position: absolute;
  top: -40px;
  left: 60px;
  width: 200px;
  height: 120px;
  background: radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%);
  pointer-events: none;
}
.cc-icon { font-size: 1.6rem; flex-shrink: 0; }
.cc-text {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
.cc-text strong { color: var(--text-primary); }

/* ── Presenter notes ── */
.presenter-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  margin-bottom: 14px;
  overflow: hidden;
}
.notes-toggle {
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
  transition: background var(--transition-fast);
}
.notes-toggle:hover { background: var(--bg-card-hover); }
.nt-icon { font-size: 1rem; }
.nt-label { flex: 1; }
.nt-chevron {
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: transform var(--transition-base);
  display: inline-block;
}
.nt-chevron.open { transform: rotate(180deg); }

.notes-expand-enter-active,
.notes-expand-leave-active {
  transition: max-height 0.35s ease, opacity 0.25s ease;
  max-height: 600px;
  overflow: hidden;
}
.notes-expand-enter-from,
.notes-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.notes-body {
  padding: 0 16px 16px;
  border-top: 1px solid var(--border-base);
}
.notes-header {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 12px 0 10px;
}
.notes-text {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.75;
  white-space: pre-line;
}

/* ── Disclaimer ── */
.disclaimer {
  font-size: 0.68rem;
  color: var(--text-dim);
  padding: 10px 14px;
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  line-height: 1.55;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.disclaimer-icon { flex-shrink: 0; font-size: 0.85rem; margin-top: 1px; }

/* ── Responsive ── */
@media (max-width: 1400px) {
  .arch-node { max-width: 200px; }
}
@media (max-width: 1200px) {
  .benefits-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .arch-node { min-width: 140px; }
  .benefits-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .flow-scroll-wrap { margin-bottom: 8px; }
  .arch-flow { min-width: 820px; }
  .benefits-grid { grid-template-columns: 1fr; }
  .closing-card { flex-direction: column; text-align: center; gap: 10px; }
}
</style>
