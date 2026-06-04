<script setup>
import { ref, computed } from 'vue'
import { incidents, alerts } from '../data/mockData.js'
import { store } from '../store/scenarios.js'
import IncidentTimeline from '../components/IncidentTimeline.vue'
import AlertPanel from '../components/AlertPanel.vue'

const activeIncidents = computed(() => incidents.filter(i => i.status === 'active' || i.status === 'monitoring'))
const resolvedIncidents = computed(() => incidents.filter(i => i.status === 'resolved'))

const workflowSteps = [
  { step: 1, label:'Alert Triggered',    desc:'AI sensor anomaly detected — automatic classification',     status:'done' },
  { step: 2, label:'Alert Verified',     desc:'System cross-checks with 3 secondary indicators',          status:'done' },
  { step: 3, label:'Supervisor Notified',desc:'Zone Supervisor and Safety Officer notified via app & radio', status:'done' },
  { step: 4, label:'Zone Restricted',    desc:'Access control gates locked — GPS geofence activated',     status:'done' },
  { step: 5, label:'Rescue Dispatched',  desc:'Rescue team dispatched — 4 personnel + first aid kit',    status:'active' },
  { step: 6, label:'Evacuation Route',   desc:'Evacuation Route A activated — Zone 5 to Muster Point E',  status:'pending' },
  { step: 7, label:'Post-Incident Review',desc:'Documentation, root cause analysis, corrective actions',  status:'pending' },
]

const commLog = [
  { time:'14:28:44', from:'AI System',           msg:'Fall detected: W010 Joko Susilo · Zone 5 Tailings · No movement 90s' },
  { time:'14:29:10', from:'Safety Officer Rahman', msg:'Confirmed — deploying rescue team. ETA 4 minutes.' },
  { time:'14:29:25', from:'Zone 5 Supervisor',   msg:'Zone 5 access restricted. Workers evacuating to Assembly Point C.' },
  { time:'14:30:02', from:'Medical Station',      msg:'Paramedic on standby at Zone 7 Admin. Stretcher and O2 ready.' },
  { time:'14:30:45', from:'AI System',           msg:'Rescue team GPS tracked — 3.2km ETA 3 min 40 sec.' },
  { time:'14:31:00', from:'Rescue Team Lead',    msg:'En route to Zone 5 via Route B. Confirming target location.' },
]

const evacuationZones = [
  { from:'Zone 1 (Open Pit A)',  to:'Assembly Point E',  route:'Route A — Main Road', status:'clear',   time:'8 min' },
  { from:'Zone 2 (Blast Zone)',  to:'Assembly Point E',  route:'Route B — North Road', status:'clear',  time:'12 min' },
  { from:'Zone 3 (Underground)', to:'Assembly Point E',  route:'Route C — Emergency', status:'clear',   time:'6 min' },
  { from:'Zone 4 (Processing)',  to:'Assembly Point E',  route:'Route A — Main Road', status:'clear',   time:'10 min' },
  { from:'Zone 5 (Tailings)',    to:'Assembly Point E',  route:'Route D — South Road', status:'active', time:'15 min' },
]
</script>

<template>
  <div>
    <div class="page-header-row">
      <div>
        <h1 class="page-title">🚨 Incident Response</h1>
        <p class="page-subtitle">Active workflow · Alert verification · Rescue dispatch · Communication log</p>
      </div>
      <div class="inc-summary">
        <div class="is-item crit">{{ activeIncidents.length }} <span>Active</span></div>
        <div class="is-item ok">{{ resolvedIncidents.length }} <span>Resolved</span></div>
        <div class="is-item info">{{ store.alerts.filter(a=>!a.acknowledged).length }} <span>Unack. Alerts</span></div>
      </div>
    </div>

    <!-- Active Incident Workflow -->
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header"><span class="card-title">⚙️ Active Incident Workflow</span></div>
        <div class="card-body">
          <div class="workflow-steps">
            <div v-for="s in workflowSteps" :key="s.step" :class="['wf-step', `step-${s.status}`]">
              <div class="wf-step-num" :class="s.status">{{ s.status === 'done' ? '✓' : s.step }}</div>
              <div class="wf-step-content">
                <div class="wf-step-label">{{ s.label }}</div>
                <div class="wf-step-desc">{{ s.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Communication log -->
      <div class="card">
        <div class="card-header"><span class="card-title">📻 Communication Log — INC001</span></div>
        <div class="card-body comm-log">
          <div v-for="c in commLog" :key="c.time" class="comm-entry">
            <span class="comm-time">{{ c.time }}</span>
            <div class="comm-body">
              <span class="comm-from">{{ c.from }}</span>
              <span class="comm-msg">{{ c.msg }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Evacuation Routes -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">🚪 Evacuation Routes — All Zones</span></div>
      <div class="card-body">
        <div class="evac-grid">
          <div v-for="e in evacuationZones" :key="e.from" :class="['evac-card', { 'evac-active': e.status === 'active' }]">
            <div class="evac-from">{{ e.from }}</div>
            <div class="evac-arrow">↓</div>
            <div class="evac-to">{{ e.to }}</div>
            <div class="evac-route">{{ e.route }}</div>
            <div class="evac-meta">
              <span :class="['tag', e.status === 'active' ? 'tag-crit' : 'tag-ok']">{{ e.status === 'active' ? '🚨 ACTIVE' : '✓ CLEAR' }}</span>
              <span class="evac-time">{{ e.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active alerts panel + incident timeline -->
    <div class="grid-2" style="margin-bottom:16px">
      <div style="max-height:400px; overflow:hidden; display:flex; flex-direction:column;">
        <AlertPanel :maxItems="8" />
      </div>
      <div>
        <div class="section-title" style="margin-bottom:10px">Incident Timeline — All Incidents</div>
        <IncidentTimeline :incidents="incidents" />
      </div>
    </div>

    <!-- Post-incident review placeholder -->
    <div class="card post-incident">
      <div class="card-header"><span class="card-title">📋 Post-Incident Review — INC002 (CO Threshold Breach)</span></div>
      <div class="card-body">
        <div class="pir-grid">
          <div class="pir-section">
            <div class="pir-label">Root Cause</div>
            <div class="pir-text">GS-04 sensor detected CO accumulation due to inadequate ventilation during extended underground operations. Contributing factor: blast debris partially blocking ventilation shaft B2.</div>
          </div>
          <div class="pir-section">
            <div class="pir-label">Corrective Actions</div>
            <div class="pir-actions">
              <div class="pir-action done">✓ Emergency ventilation activated — shaft B2 cleared</div>
              <div class="pir-action done">✓ Zone C3 access restricted for 4 hours</div>
              <div class="pir-action pending">⏳ Ventilation shaft inspection protocol updated</div>
              <div class="pir-action pending">⏳ Additional CO sensor installed at Zone B2 entry</div>
            </div>
          </div>
          <div class="pir-section">
            <div class="pir-label">AI Recommendation Status</div>
            <div class="pir-text" style="color:var(--status-ok)">✓ AI predicted CO accumulation risk 3 hours before threshold breach. Prevention protocol followed correctly. Zero workers affected.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
.inc-summary { display:flex; gap:8px; }
.is-item { display:flex; flex-direction:column; align-items:center; gap:2px; background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:8px 12px; font-size:1.2rem; font-weight:700; font-family:var(--font-mono); }
.is-item span { font-size:0.62rem; color:var(--text-muted); font-family:var(--font-sans); font-weight:400; }
.is-item.crit { color:var(--status-crit); border-color:var(--status-crit-border); animation:blink 2s infinite; }
.is-item.ok   { color:var(--status-ok); }
.is-item.info { color:var(--status-info); }

.workflow-steps { display:flex; flex-direction:column; gap:8px; }
.wf-step { display:flex; align-items:flex-start; gap:10px; }
.wf-step-num {
  width:28px; height:28px; border-radius:50%; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:0.78rem; font-weight:700; border:2px solid var(--border-card);
}
.wf-step-num.done    { background:var(--status-ok-bg); border-color:var(--status-ok); color:var(--status-ok); }
.wf-step-num.active  { background:var(--status-warn-bg); border-color:var(--status-warn); color:var(--status-warn); animation:blink 1.5s infinite; }
.wf-step-num.pending { color:var(--text-dim); }
.wf-step-label { font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:2px; }
.wf-step-desc  { font-size:0.7rem; color:var(--text-muted); }
.step-pending .wf-step-label { color:var(--text-muted); }

.comm-log { display:flex; flex-direction:column; gap:8px; max-height:300px; overflow-y:auto; }
.comm-entry { display:flex; gap:10px; align-items:flex-start; }
.comm-time { font-family:var(--font-mono); font-size:0.68rem; color:var(--text-muted); flex-shrink:0; min-width:55px; }
.comm-body { display:flex; flex-direction:column; gap:2px; }
.comm-from { font-size:0.72rem; font-weight:700; color:var(--accent-blue); }
.comm-msg  { font-size:0.75rem; color:var(--text-secondary); }

.evac-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; }
.evac-card { background:var(--bg-secondary); border-radius:var(--radius-md); padding:12px; text-align:center; border:1px solid var(--border-base); }
.evac-card.evac-active { border-color:var(--status-crit-border); background:var(--status-crit-bg); animation:blink 2s infinite; }
.evac-from { font-size:0.72rem; font-weight:600; color:var(--text-primary); margin-bottom:4px; }
.evac-arrow { font-size:1rem; color:var(--text-muted); margin:3px 0; }
.evac-to { font-size:0.72rem; color:var(--accent-blue); font-weight:600; margin-bottom:3px; }
.evac-route { font-size:0.65rem; color:var(--text-muted); margin-bottom:6px; }
.evac-meta { display:flex; flex-direction:column; align-items:center; gap:4px; }
.evac-time { font-size:0.65rem; color:var(--text-muted); }

.pir-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.pir-label { font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px; }
.pir-text { font-size:0.75rem; color:var(--text-secondary); line-height:1.5; }
.pir-actions { display:flex; flex-direction:column; gap:5px; }
.pir-action { font-size:0.75rem; }
.pir-action.done    { color:var(--status-ok); }
.pir-action.pending { color:var(--text-muted); }

@media(max-width:1100px){ .evac-grid { grid-template-columns:repeat(3,1fr); } }
@media(max-width:768px) { .evac-grid { grid-template-columns:repeat(2,1fr); } .pir-grid { grid-template-columns:1fr; } }
</style>
