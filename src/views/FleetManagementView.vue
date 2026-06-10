<script setup>
import { computed, ref } from 'vue'
import { fleetVehicles, operatorLicences, trendData } from '../data/mockData.js'
import StatusBadge from '../components/StatusBadge.vue'
import TrendChart from '../components/TrendChart.vue'
import VehicleTrackingDrawer from '../components/VehicleTrackingDrawer.vue'

const selectedVehicle = ref(null)
function selectVehicle(v) {
  selectedVehicle.value = selectedVehicle.value?.id === v.id ? null : v
}

const operating     = computed(() => fleetVehicles.filter(v => v.status === 'operating').length)
const fatigueAlerts = computed(() => fleetVehicles.filter(v => v.fatigueScore > 50).length)
const proximityAlerts = computed(() => fleetVehicles.filter(v => v.proximityAlert).length)
const licenceIssues = computed(() => operatorLicences.filter(l => l.status !== 'valid' || !l.trainingCurrent).length)
const maintenanceDue = computed(() => fleetVehicles.filter(v => v.maintenanceDueDays <= 14).length)

const activeAlerts = computed(() => [
  ...fleetVehicles.filter(v => v.proximityAlert).map(v => ({ severity:'critical', vehicle:v.name, msg:`Proximity collision risk — ${v.driver} · ${v.zone}` })),
  ...fleetVehicles.filter(v => v.phoneUse).map(v => ({ severity:'warning', vehicle:v.name, msg:`Mobile phone use detected — ${v.driver} · ${v.zone}` })),
  ...fleetVehicles.filter(v => v.fatigueScore >= 70).map(v => ({ severity:'critical', vehicle:v.name, msg:`Extreme fatigue score ${v.fatigueScore} — ${v.driver} · ${v.zone}` })),
  ...fleetVehicles.filter(v => v.route === 'unapproved').map(v => ({ severity:'warning', vehicle:v.name, msg:`Operating on unapproved route — ${v.driver} · ${v.zone}` })),
  ...operatorLicences.filter(l => l.status === 'expired').map(l => ({ severity:'critical', vehicle:l.vehicle, msg:`Licence EXPIRED — ${l.name} · ${l.licenceType}` })),
])

function fatigueColor(score) {
  if (score >= 70) return 'var(--status-crit)'
  if (score >= 50) return 'var(--status-warn)'
  if (score > 0)   return 'var(--text-secondary)'
  return 'var(--text-dim)'
}
function vehicleStatusBadge(v) {
  if (v.status === 'operating') return 'normal'
  if (v.status === 'maintenance') return 'warning'
  return 'info'
}
function licenceStatusBadge(l) {
  if (l.status === 'expired') return 'critical'
  if (l.status === 'expiring') return 'warning'
  return 'normal'
}
function daysClass(days) {
  if (days < 0)  return 'crit'
  if (days <= 60) return 'warn'
  return 'ok'
}
function maintClass(days) {
  if (days <= 0)  return 'crit'
  if (days <= 14) return 'warn'
  return 'ok'
}
function engineTempColor(t) {
  if (t > 100) return 'var(--status-crit)'
  if (t > 88)  return 'var(--status-warn)'
  return 'var(--status-ok)'
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="page-header-row">
      <div>
        <h1 class="page-title">🚛 Fleet Management</h1>
        <p class="page-subtitle">{{ fleetVehicles.length }} vehicles · AI driver monitoring · Licence compliance · Predictive maintenance</p>
      </div>
      <div class="kpi-row">
        <div class="kpi ok">{{ operating }}<span>Active</span></div>
        <div class="kpi" :class="fatigueAlerts > 0 ? 'warn' : 'ok'">{{ fatigueAlerts }}<span>Fatigue Alert</span></div>
        <div class="kpi" :class="proximityAlerts > 0 ? 'crit' : 'ok'">{{ proximityAlerts }}<span>Proximity</span></div>
        <div class="kpi" :class="licenceIssues > 0 ? 'crit' : 'ok'">{{ licenceIssues }}<span>Licence Issues</span></div>
        <div class="kpi" :class="maintenanceDue > 0 ? 'warn' : 'ok'">{{ maintenanceDue }}<span>Maint. Due</span></div>
      </div>
    </div>

    <!-- Active Alerts Banner -->
    <div v-if="activeAlerts.length" class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">⚠️ Active Fleet Alerts</span>
        <span class="card-sub">{{ activeAlerts.length }} alert{{ activeAlerts.length > 1 ? 's' : '' }} requiring attention</span>
      </div>
      <div class="card-body alert-list">
        <div v-for="(a, i) in activeAlerts" :key="i" :class="['alert-row', a.severity]">
          <StatusBadge :status="a.severity" size="sm" />
          <span class="al-vehicle">{{ a.vehicle }}</span>
          <span class="al-msg">{{ a.msg }}</span>
        </div>
      </div>
    </div>

    <!-- Live Fleet Tracking Table -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">🗺️ Live Fleet Tracking</span>
        <span class="card-sub">Real-time positions · Route compliance · Operator risk</span>
      </div>
      <div class="card-body">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Driver</th>
                <th>Zone</th>
                <th>Speed</th>
                <th>Fuel</th>
                <th>Fatigue</th>
                <th>Route</th>
                <th>Eng. Temp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in fleetVehicles" :key="v.id"
                class="fleet-row"
                :class="{
                  'row-alert':  v.proximityAlert || v.phoneUse || v.fatigueScore >= 70 || v.route === 'unapproved',
                  'row-active': selectedVehicle?.id === v.id
                }"
                @click="selectVehicle(v)"
              >
                <td class="mono accent">{{ v.name }}</td>
                <td class="dim-text">{{ v.type }}</td>
                <td>{{ v.driver }}</td>
                <td class="mono">{{ v.zone }}</td>
                <td class="mono">{{ v.speed > 0 ? v.speed + ' km/h' : '—' }}</td>
                <td>
                  <div class="fuel-wrap">
                    <div class="fuel-track">
                      <div class="fuel-fill"
                        :style="{ width: v.fuelPct + '%', background: v.fuelPct < 25 ? 'var(--status-crit)' : v.fuelPct < 50 ? 'var(--status-warn)' : 'var(--status-ok)' }">
                      </div>
                    </div>
                    <span class="fuel-val">{{ v.fuelPct }}%</span>
                  </div>
                </td>
                <td>
                  <span class="mono fw" :style="{ color: fatigueColor(v.fatigueScore) }">
                    {{ v.fatigueScore > 0 ? v.fatigueScore : '—' }}
                  </span>
                  <span v-if="v.phoneUse" class="phone-flag">📱</span>
                  <span v-if="v.distractionAlert" class="distract-flag">👁️</span>
                </td>
                <td :class="v.route === 'unapproved' ? 'route-warn' : 'route-ok'">{{ v.route }}</td>
                <td class="mono" :style="{ color: engineTempColor(v.engineTemp) }">{{ v.engineTemp }}°C</td>
                <td><StatusBadge :status="vehicleStatusBadge(v)" size="sm" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-legend">
          <span>📱 Phone use detected</span>
          <span>👁️ Distraction alert</span>
          <span style="color:var(--status-warn)">yellow row = active risk</span>
          <span style="color:var(--accent-blue)">click any row → live tracking</span>
        </div>
      </div>
    </div>

    <!-- Charts row: Fatigue trend + Collision Avoidance -->
    <div class="grid-2" style="margin-bottom:16px">
      <TrendChart
        title="Driver Fatigue Score — Today"
        :labels="trendData.fleetFatigue.labels"
        :series="trendData.fleetFatigue.series"
        type="line"
        :height="200"
      />
      <div class="card">
        <div class="card-header"><span class="card-title">📡 Collision Avoidance — AI Radar</span></div>
        <div class="card-body">
          <div class="radar-list">
            <div v-for="v in fleetVehicles.filter(v => v.status === 'operating')" :key="v.id" class="radar-row">
              <span class="mono radar-name">{{ v.name }}</span>
              <div class="radar-track">
                <div :class="['radar-fill', v.proximityAlert ? 'radar-alert' : 'radar-clear']"></div>
              </div>
              <span :class="['radar-badge', v.proximityAlert ? 'crit' : 'ok']">
                {{ v.proximityAlert ? 'ALERT' : 'Clear' }}
              </span>
            </div>
          </div>
          <div class="radar-note">AI combines camera, radar &amp; telematics · 15m proximity threshold</div>
        </div>
      </div>
    </div>

    <!-- Licence & Compliance Tracker -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">📋 Operator Licence &amp; Compliance Tracker</span>
        <span class="card-sub">AI monitors expiry dates and sends renewal reminders automatically</span>
      </div>
      <div class="card-body">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Vehicle</th>
                <th>Licence Type</th>
                <th>Licence No.</th>
                <th>Expiry Date</th>
                <th>Days Remaining</th>
                <th>Training</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in operatorLicences" :key="l.id">
                <td>{{ l.name }}</td>
                <td class="mono">{{ l.vehicle }}</td>
                <td class="dim-text small">{{ l.licenceType }}</td>
                <td class="mono small">{{ l.licenceNo }}</td>
                <td class="mono small">{{ l.expiryDate }}</td>
                <td>
                  <span :class="['days-badge', daysClass(l.daysUntilExpiry)]">
                    {{ l.daysUntilExpiry < 0
                      ? 'EXPIRED ' + Math.abs(l.daysUntilExpiry) + 'd ago'
                      : l.daysUntilExpiry + ' days' }}
                  </span>
                </td>
                <td>
                  <StatusBadge :status="l.trainingCurrent ? 'normal' : 'warning'" size="sm" />
                </td>
                <td>
                  <StatusBadge :status="licenceStatusBadge(l)" size="sm" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Vehicle Tracking Drawer -->
    <VehicleTrackingDrawer :vehicle="selectedVehicle" @close="selectedVehicle = null" />

    <!-- Fleet Predictive Maintenance -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">🔧 Fleet Predictive Maintenance</span>
        <span class="card-sub">AI analyses brake, tyre, engine and sensor data to flag faults early</span>
      </div>
      <div class="card-body maint-grid">
        <div v-for="v in fleetVehicles" :key="v.id"
          :class="['maint-card', v.maintenanceDueDays <= 14 ? 'maint-urgent' : '']">
          <div class="maint-name">{{ v.name }}</div>
          <div class="maint-meta">{{ v.type }}</div>
          <div class="maint-meta">{{ v.driver !== '—' ? v.driver : 'Unassigned' }}</div>
          <div class="maint-temp">
            Eng.&nbsp;<span :style="{ color: engineTempColor(v.engineTemp) }">{{ v.engineTemp }}°C</span>
          </div>
          <div class="maint-fuel">
            Fuel&nbsp;<span :style="{ color: v.fuelPct < 25 ? 'var(--status-crit)' : v.fuelPct < 50 ? 'var(--status-warn)' : 'var(--text-secondary)' }">{{ v.fuelPct }}%</span>
          </div>
          <div class="maint-due-row">
            <span :class="['due-badge', maintClass(v.maintenanceDueDays)]">
              {{ v.maintenanceDueDays <= 0 ? 'OVERDUE' : v.maintenanceDueDays + 'd to service' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; flex-wrap:wrap; gap:12px; }
.kpi-row { display:flex; gap:8px; flex-wrap:wrap; }
.kpi { display:flex; flex-direction:column; align-items:center; gap:2px; background:var(--bg-card); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:8px 14px; font-size:1.3rem; font-weight:700; font-family:var(--font-mono); }
.kpi span { font-size:0.62rem; color:var(--text-muted); font-family:var(--font-sans); font-weight:400; }
.kpi.ok   { color:var(--status-ok); }
.kpi.warn { color:var(--status-warn); border-color:var(--status-warn-border); }
.kpi.crit { color:var(--status-crit); border-color:var(--status-crit-border); }

.alert-list { display:flex; flex-direction:column; gap:8px; }
.alert-row { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:var(--radius-sm); background:var(--bg-secondary); font-size:0.78rem; }
.alert-row.critical { border-left:3px solid var(--status-crit); }
.alert-row.warning  { border-left:3px solid var(--status-warn); }
.al-vehicle { font-family:var(--font-mono); font-weight:700; color:var(--accent-blue); min-width:80px; flex-shrink:0; }
.al-msg { color:var(--text-secondary); }

.table-wrap { overflow-x:auto; }
.fleet-row { cursor: pointer; transition: background var(--transition-fast); }
.fleet-row:hover { background: var(--bg-card-hover); }
.row-alert { background:rgba(239,68,68,0.04); }
.row-active { background: var(--status-info-bg) !important; outline: 1px solid var(--status-info-border); }
.mono  { font-family:var(--font-mono); }
.accent { color:var(--accent-blue); }
.dim-text { color:var(--text-muted); }
.fw { font-weight:700; }
.small { font-size:0.72rem; }

.fuel-wrap { display:flex; align-items:center; gap:6px; min-width:90px; }
.fuel-track { flex:1; height:4px; background:var(--bg-secondary); border-radius:2px; overflow:hidden; }
.fuel-fill { height:100%; border-radius:2px; }
.fuel-val { font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted); white-space:nowrap; }

.phone-flag, .distract-flag { font-size:0.75rem; margin-left:3px; }
.route-ok   { font-size:0.72rem; font-weight:600; color:var(--status-ok); }
.route-warn { font-size:0.72rem; font-weight:700; color:var(--status-warn); }

.table-legend { display:flex; gap:14px; margin-top:8px; font-size:0.68rem; color:var(--text-dim); }

.radar-list { display:flex; flex-direction:column; gap:8px; margin-bottom:12px; }
.radar-row  { display:flex; align-items:center; gap:10px; }
.radar-name { font-size:0.74rem; min-width:78px; }
.radar-track { flex:1; height:8px; background:var(--bg-secondary); border-radius:4px; overflow:hidden; }
.radar-fill { height:100%; border-radius:4px; animation:pulse-bar 2s infinite; }
.radar-clear { width:100%; background:linear-gradient(90deg, var(--status-ok), rgba(34,197,94,0.15)); }
.radar-alert { width:100%; background:linear-gradient(90deg, var(--status-crit), rgba(239,68,68,0.25)); }
@keyframes pulse-bar { 0%,100%{opacity:1} 50%{opacity:0.55} }
.radar-badge { font-size:0.68rem; font-weight:700; min-width:42px; text-align:right; }
.radar-badge.ok   { color:var(--status-ok); }
.radar-badge.crit { color:var(--status-crit); }
.radar-note { font-size:0.68rem; color:var(--text-dim); border-top:1px solid var(--border-base); padding-top:8px; }

.days-badge { font-size:0.72rem; font-weight:700; font-family:var(--font-mono); padding:2px 8px; border-radius:10px; }
.days-badge.ok   { color:var(--status-ok);   background:var(--status-ok-bg); }
.days-badge.warn { color:var(--status-warn); background:var(--status-warn-bg); }
.days-badge.crit { color:var(--status-crit); background:var(--status-crit-bg); }

.maint-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.maint-card { background:var(--bg-secondary); border:1px solid var(--border-base); border-radius:var(--radius-sm); padding:12px; display:flex; flex-direction:column; gap:3px; }
.maint-card.maint-urgent { border-color:var(--status-warn-border); background:rgba(245,158,11,0.04); }
.maint-name { font-family:var(--font-mono); font-weight:700; color:var(--accent-blue); font-size:0.85rem; }
.maint-meta { font-size:0.68rem; color:var(--text-muted); }
.maint-temp, .maint-fuel { font-size:0.72rem; color:var(--text-secondary); margin-top:2px; }
.maint-due-row { margin-top:6px; }
.due-badge { font-size:0.7rem; font-weight:700; font-family:var(--font-mono); padding:2px 8px; border-radius:10px; }
.due-badge.ok   { color:var(--status-ok);   background:var(--status-ok-bg); }
.due-badge.warn { color:var(--status-warn); background:var(--status-warn-bg); }
.due-badge.crit { color:var(--status-crit); background:var(--status-crit-bg); }

@media(max-width:900px) {
  .maint-grid { grid-template-columns:repeat(2,1fr); }
  .kpi-row    { display:none; }
}
</style>
