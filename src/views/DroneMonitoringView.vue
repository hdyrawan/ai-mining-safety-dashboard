<script setup>
import { ref, computed } from 'vue'
import { drones, hazardCameraDetections } from '../data/mockData.js'
import DroneCard from '../components/DroneCard.vue'
import DroneLiveFeedPanel from '../components/DroneLiveFeedPanel.vue'
import TrendChart from '../components/TrendChart.vue'
import StatusBadge from '../components/StatusBadge.vue'

const selectedDrone = ref(null)

function selectDrone(drone) {
  selectedDrone.value = selectedDrone.value?.id === drone.id ? null : drone
}

const active = computed(() => drones.filter(d => d.status === 'active'))
const charging = computed(() => drones.filter(d => d.status === 'charging'))
const standby = computed(() => drones.filter(d => d.status === 'standby'))
const maintenance = computed(() => drones.filter(d => d.status === 'maintenance'))
const allDetections = computed(() => drones.flatMap(d => (d.detections || []).map(det => ({ ...det, drone: d.name }))))

const batteryTrend = {
  labels: ['Eagle-1','Eagle-2','Falcon-1','Falcon-2','Hawk-1','Hawk-2'],
  series: [{ name:'Battery %', color:'#3b82f6', values:[87,63,24,91,100,35] }]
}

const cameraZones = [
  { id:'CAM-01', location:'Open Pit A — Main Access Gate',     type:'Fixed PTZ' },
  { id:'CAM-02', location:'Blast Zone B — Zone Entry',         type:'Fixed PTZ' },
  { id:'CAM-03', location:'Blast Zone B — Prep Area',          type:'Fixed PTZ' },
  { id:'CAM-05', location:'Processing Plant — Loading Bay',    type:'Fixed PTZ' },
  { id:'CAM-07', location:'Haul Road — Z1 Crossing',          type:'Fixed PTZ' },
  { id:'CAM-08', location:'Open Pit A — Equipment Pad',        type:'Fixed PTZ' },
  { id:'CAM-11', location:'Underground C — Conveyor Level 2',  type:'Fixed PTZ' },
  { id:'CAM-14', location:'Tailings Dam — South Berm',         type:'Mobile AI' },
]

const patrolData = {
  labels: ['06:00','08:00','10:00','12:00','14:00','16:00'],
  series: [
    { name:'Zone A Coverage %', color:'#22c55e', values:[78,84,91,88,93,90] },
    { name:'Zone B Coverage %', color:'#f59e0b', values:[65,70,75,80,78,82] },
    { name:'Zone C Coverage %', color:'#3b82f6', values:[55,60,68,72,70,75] },
  ]
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="page-header-row">
      <div>
        <h1 class="page-title">🚁 Drone Monitoring</h1>
        <p class="page-subtitle">Autonomous aerial fleet — surveillance, inspection & hazard detection</p>
      </div>
      <div class="fleet-summary">
        <div class="fleet-stat ok">{{ active.length }} <span>Active</span></div>
        <div class="fleet-stat info">{{ standby.length }} <span>Standby</span></div>
        <div class="fleet-stat warn">{{ charging.length }} <span>Charging</span></div>
        <div class="fleet-stat muted">{{ maintenance.length }} <span>Maint.</span></div>
      </div>
    </div>

    <!-- KPI row -->
    <div class="grid-4" style="margin-bottom:16px">
      <div class="card stat-mini">
        <div class="sm-val ok">{{ active.length }}/{{ drones.length }}</div>
        <div class="sm-label">Drones Active</div>
      </div>
      <div class="card stat-mini">
        <div class="sm-val">{{ drones.reduce((a,d)=>a+d.flightHours,0).toLocaleString() }}</div>
        <div class="sm-label">Total Flight Hours</div>
      </div>
      <div class="card stat-mini">
        <div class="sm-val warn">{{ allDetections.length }}</div>
        <div class="sm-label">Active Detections</div>
      </div>
      <div class="card stat-mini">
        <div class="sm-val ok">{{ drones.filter(d=>d.signalStrength>80).length }}</div>
        <div class="sm-label">Strong Signal</div>
      </div>
    </div>

    <!-- AI Detection Alerts -->
    <div v-if="allDetections.length" class="detection-banner card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">⚠️ AI Hazard Detections — Active</span>
      </div>
      <div class="card-body detection-list">
        <div v-for="det in allDetections" :key="det.type + det.drone" class="det-row">
          <StatusBadge :status="det.severity" />
          <span class="det-type">{{ det.type.replace(/_/g,' ').toUpperCase() }}</span>
          <span class="det-drone">{{ det.drone }}</span>
          <span class="det-desc">{{ det.description }}</span>
          <span class="det-conf">{{ det.confidence }}% confidence</span>
        </div>
      </div>
    </div>

    <!-- Live Drone Feed Panel (shown when a drone is selected) -->
    <Transition name="feed-slide">
      <DroneLiveFeedPanel
        v-if="selectedDrone"
        :drone="selectedDrone"
        @close="selectedDrone = null"
      />
    </Transition>

    <!-- Drone Fleet Grid -->
    <div class="section-title" style="margin-bottom:10px">
      Drone Fleet Status
      <span class="fleet-click-hint">— click a card to view live feed</span>
    </div>
    <div class="grid-3" style="margin-bottom:16px">
      <DroneCard
        v-for="drone in drones"
        :key="drone.id"
        :drone="drone"
        :isSelected="selectedDrone?.id === drone.id"
        @select="selectDrone(drone)"
      />
    </div>

    <!-- Charts -->
    <div class="grid-2">
      <TrendChart
        title="Drone Battery Levels"
        :labels="batteryTrend.labels"
        :series="batteryTrend.series"
        type="bar"
        :height="200"
        :legend="false"
        :yMin="0"
        :yMax="100"
      />
      <TrendChart
        title="Zone Coverage — Today (%)"
        :labels="patrolData.labels"
        :series="patrolData.series"
        :height="200"
        type="line"
      />
    </div>

    <!-- Mission Types Card -->
    <div class="card mission-types" style="margin-top:16px">
      <div class="card-header">
        <span class="card-title">📋 Patrol Mission Schedule</span>
      </div>
      <div class="card-body mission-grid">
        <div v-for="d in drones.filter(x=>x.status==='active')" :key="d.id" class="mission-row">
          <span class="mission-drone">{{ d.name }}</span>
          <span class="mission-task">{{ d.mission }}</span>
          <div class="mission-meta">
            <span class="mission-bat" :style="{ color: d.battery < 30 ? 'var(--status-crit)' : d.battery < 60 ? 'var(--status-warn)' : 'var(--status-ok)' }">
              🔋 {{ d.battery }}%
            </span>
            <span class="mission-alt">↑ {{ d.altitude }}m</span>
            <StatusBadge status="active" size="sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── AI Hazard Camera Network ──────────────────────────────────────── -->
    <div class="section-divider" style="margin-top:24px">
      <span class="section-label">📷 AI HAZARD CAMERA NETWORK</span>
    </div>

    <!-- Camera KPIs -->
    <div class="grid-4" style="margin-bottom:16px">
      <div class="card stat-mini">
        <div class="sm-val">14</div>
        <div class="sm-label">Cameras Online</div>
      </div>
      <div class="card stat-mini">
        <div class="sm-val warn">{{ hazardCameraDetections.filter(d => !d.resolved).length }}</div>
        <div class="sm-label">Active Detections</div>
      </div>
      <div class="card stat-mini">
        <div class="sm-val ok">{{ hazardCameraDetections.filter(d => d.resolved).length }}</div>
        <div class="sm-label">Resolved Today</div>
      </div>
      <div class="card stat-mini">
        <div class="sm-val">{{ Math.round(hazardCameraDetections.reduce((a,d)=>a+d.confidence,0)/hazardCameraDetections.length) }}%</div>
        <div class="sm-label">Avg Confidence</div>
      </div>
    </div>

    <!-- Camera Network Map + Recent Detections -->
    <div class="grid-2" style="margin-bottom:16px">
      <!-- Camera zone coverage -->
      <div class="card">
        <div class="card-header"><span class="card-title">🗺️ Camera Zone Coverage</span></div>
        <div class="card-body">
          <div class="cam-zone-list">
            <div v-for="(cam, i) in cameraZones" :key="i" class="cam-zone-row">
              <span class="cz-id">{{ cam.id }}</span>
              <span class="cz-location">{{ cam.location }}</span>
              <span class="cz-type">{{ cam.type }}</span>
              <StatusBadge status="normal" size="sm" />
            </div>
          </div>
        </div>
      </div>

      <!-- Recent hazard detections -->
      <div class="card">
        <div class="card-header"><span class="card-title">⚠️ Recent AI Hazard Detections</span></div>
        <div class="card-body">
          <div class="hcam-list">
            <div v-for="d in hazardCameraDetections" :key="d.id"
              :class="['hcam-row', d.resolved ? 'resolved' : d.severity]">
              <div class="hcam-top">
                <StatusBadge :status="d.resolved ? 'info' : d.severity" size="sm" />
                <span class="hcam-type">{{ d.type.replace(/_/g,' ').toUpperCase() }}</span>
                <span class="hcam-cam">{{ d.camera }}</span>
                <span class="hcam-zone">{{ d.zone }}</span>
                <span class="hcam-time">{{ d.time }}</span>
                <span class="hcam-conf">{{ d.confidence }}%</span>
              </div>
              <div class="hcam-desc">{{ d.description }}</div>
              <div v-if="d.resolved" class="hcam-resolved">✔ Resolved</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Capabilities info -->
    <div class="capabilities-panel card">
      <div class="card-header"><span class="card-title">🤖 AI Detection Capabilities — Drone &amp; Camera</span></div>
      <div class="card-body capabilities-grid">
        <div v-for="cap in [
          'Slope Crack Detection','Flooding / Landslide',
          'Restricted Area Intrusion','Environmental Boundary Breach',
          'Structural Anomaly','Water Runoff Monitoring',
          'Vegetation Disturbance','Vehicle Position Tracking',
          'PPE Compliance (Hard Hat, Glasses, Vest)','Unsafe Act Detection',
          'Vehicle–Pedestrian Proximity','Unguarded Machinery Access',
        ]" :key="cap" class="cap-item">
          <span class="cap-dot"></span>{{ cap }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
.fleet-summary { display:flex; gap:10px; }
.fleet-stat {
  display:flex; flex-direction:column; align-items:center; gap:2px;
  background:var(--bg-card); border:1px solid var(--border-card);
  border-radius:var(--radius-md); padding:8px 14px;
  font-size:1.2rem; font-weight:700; font-family:var(--font-mono);
}
.fleet-stat span { font-size:0.65rem; color:var(--text-muted); font-family:var(--font-sans); font-weight:400; }
.fleet-stat.ok   { color:var(--status-ok); }
.fleet-stat.warn { color:var(--status-warn); }
.fleet-stat.info { color:var(--status-info); }
.fleet-stat.muted{ color:var(--text-muted); }

.stat-mini { padding:14px; text-align:center; }
.sm-val { font-size:1.8rem; font-weight:700; font-family:var(--font-mono); color:var(--text-primary); }
.sm-val.ok { color:var(--status-ok); }
.sm-val.warn { color:var(--status-warn); }
.sm-label { font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-top:4px; }

.detection-list { display:flex; flex-direction:column; gap:8px; }
.det-row { display:flex; align-items:center; gap:10px; font-size:0.78rem; flex-wrap:wrap; }
.det-type { font-weight:700; color:var(--status-warn); }
.det-drone { color:var(--accent-cyan); font-family:var(--font-mono); font-size:0.72rem; }
.det-desc { color:var(--text-secondary); flex:1; }
.det-conf { color:var(--text-muted); font-size:0.7rem; }

.mission-grid { display:flex; flex-direction:column; gap:10px; }
.mission-row { display:flex; align-items:center; gap:12px; }
.mission-drone { font-family:var(--font-mono); font-size:0.78rem; font-weight:700; color:var(--accent-blue); min-width:70px; }
.mission-task { font-size:0.78rem; color:var(--text-secondary); flex:1; }
.mission-meta { display:flex; align-items:center; gap:8px; }
.mission-bat, .mission-alt { font-size:0.72rem; font-family:var(--font-mono); }
.mission-alt { color:var(--text-muted); }

.capabilities-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
.cap-item { display:flex; align-items:center; gap:6px; font-size:0.75rem; color:var(--text-secondary); }
.cap-dot { width:6px; height:6px; border-radius:50%; background:var(--status-ok); flex-shrink:0; }

.section-divider { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
.section-divider::before,.section-divider::after { content:''; flex:1; height:1px; background:var(--border-base); }
.section-label { font-size:0.68rem; font-weight:700; color:var(--text-dim); letter-spacing:0.1em; white-space:nowrap; }

.cam-zone-list { display:flex; flex-direction:column; gap:7px; }
.cam-zone-row { display:flex; align-items:center; gap:8px; font-size:0.75rem; }
.cz-id { font-family:var(--font-mono); color:var(--accent-cyan); min-width:60px; font-size:0.72rem; }
.cz-location { color:var(--text-secondary); flex:1; }
.cz-type { font-size:0.68rem; color:var(--text-dim); white-space:nowrap; }

.hcam-list { display:flex; flex-direction:column; gap:8px; max-height:340px; overflow-y:auto; }
.hcam-row { background:var(--bg-secondary); border-radius:var(--radius-sm); padding:8px 10px; border-left:3px solid var(--border-base); }
.hcam-row.critical { border-left-color:var(--status-crit); }
.hcam-row.warning  { border-left-color:var(--status-warn); }
.hcam-row.resolved { opacity:0.6; }
.hcam-top { display:flex; align-items:center; gap:7px; flex-wrap:wrap; margin-bottom:4px; }
.hcam-type { font-size:0.72rem; font-weight:700; color:var(--text-primary); }
.hcam-cam, .hcam-zone { font-family:var(--font-mono); font-size:0.68rem; color:var(--accent-cyan); background:rgba(6,182,212,0.08); padding:1px 5px; border-radius:3px; }
.hcam-time { font-family:var(--font-mono); font-size:0.68rem; color:var(--text-dim); margin-left:auto; }
.hcam-conf { font-size:0.68rem; color:var(--text-muted); }
.hcam-desc { font-size:0.73rem; color:var(--text-secondary); }
.hcam-resolved { font-size:0.68rem; color:var(--status-ok); margin-top:3px; }

@media(max-width:900px){ .capabilities-grid { grid-template-columns:repeat(2,1fr); } }

.fleet-click-hint {
  font-size: 0.65rem;
  color: var(--text-dim);
  font-weight: 400;
  letter-spacing: 0;
  font-family: var(--font-sans);
}

/* Live feed panel slide transition */
.feed-slide-enter-active { transition: all 0.25s ease; }
.feed-slide-leave-active { transition: all 0.20s ease; }
.feed-slide-enter-from { opacity: 0; transform: translateY(-8px); }
.feed-slide-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
