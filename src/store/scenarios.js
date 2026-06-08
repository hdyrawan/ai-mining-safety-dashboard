import { reactive } from 'vue'
import { alerts as initialAlerts } from '../data/mockData.js'

const SCENARIOS = {
  gas_leak: {
    label: 'Gas Leak',
    zone: 'Z2 — Blast Zone B',
    severity: 'critical',
    steps: ['CH₄ threshold breached', 'Zone evacuation ordered', 'Rescue team dispatched', 'Ventilation activated'],
    alerts: [
      { id:'SIM001A', level:'critical', type:'gas',    message:'[SIM] Methane 12.8 ppm in Zone 2 (Blast Zone B) — CRITICAL threshold exceeded',    zone:'Z2' },
      { id:'SIM001B', level:'critical', type:'health', message:'[SIM] 18 workers in Zone 2 — evacuation order issued via PA and wearable alert',    zone:'Z2' },
      { id:'SIM001C', level:'warning',  type:'gas',    message:'[SIM] Methane trace detected at Zone 1 perimeter (0.8 ppm) — monitoring elevated',  zone:'Z1' },
    ],
  },
  heat_stress: {
    label: 'Heat Stress',
    zone: 'Z1 — Open Pit A',
    severity: 'critical',
    steps: ['Heat stress biometrics flagged', 'Medical team alerted', 'Zone rotation ordered', 'Hydration stations deployed'],
    alerts: [
      { id:'SIM002A', level:'critical', type:'health', message:'[SIM] W002 Budi Santoso — HR 128 bpm, Temp 39.2°C — critical heat stress, collapse risk',  zone:'Z1' },
      { id:'SIM002B', level:'warning',  type:'health', message:'[SIM] 4 workers in Zone 1 showing fatigue >65 — rotate to cool rest area immediately',        zone:'Z1' },
      { id:'SIM002C', level:'warning',  type:'environment','message':'[SIM] Zone 1 ambient temperature 38.4°C — exceeds 38°C work-suspension threshold',       zone:'Z1' },
    ],
  },
  slope_crack: {
    label: 'Slope Crack',
    zone: 'Z2 — North Face',
    severity: 'critical',
    steps: ['Slope anomaly detected by Eagle-1', 'Exclusion zone established 50m', 'Geotechnical team dispatched', 'Blast ops suspended'],
    alerts: [
      { id:'SIM003A', level:'critical', type:'drone',  message:'[SIM] Eagle-1 detected 22m slope crack on Zone B south face — confidence 96%',             zone:'Z2' },
      { id:'SIM003B', level:'critical', type:'gas',    message:'[SIM] Slope displacement sensor SD-04 reports 8.4 cm movement in 30 min — evacuate Z2',     zone:'Z2' },
      { id:'SIM003C', level:'warning',  type:'drone',  message:'[SIM] Eagle-2 secondary survey confirms crack propagation — 50m exclusion zone active',     zone:'Z2' },
    ],
  },
  vehicle_proximity: {
    label: 'Vehicle Risk',
    zone: 'Z1 — Haul Road',
    severity: 'critical',
    steps: ['Proximity breach detected', 'Vehicle alert broadcast', 'Zone traffic halted', 'Incident review initiated'],
    alerts: [
      { id:'SIM004A', level:'critical', type:'equipment', message:'[SIM] HD785-01 within 6m of 3 workers at Z1 haul road crossing — collision risk HIGH',   zone:'Z1' },
      { id:'SIM004B', level:'critical', type:'equipment', message:'[SIM] Driver Ahmad Salleh non-responsive to proximity alert — supervisor dispatched',     zone:'Z1' },
      { id:'SIM004C', level:'warning',  type:'equipment', message:'[SIM] LV-07 also in proximity conflict zone — all haul traffic suspended Z1',             zone:'Z1' },
    ],
  },
  sustain_risk: {
    label: 'Sustain. Risk',
    zone: 'Z5 — Tailings Dam',
    severity: 'warning',
    steps: ['Seepage sensor breach', 'Environmental protocol activated', 'Regulator notification sent', 'Containment team deployed'],
    alerts: [
      { id:'SIM005A', level:'critical', type:'environment','message':'[SIM] SP-03 seepage pressure 4.2 bar — CRITICAL threshold 4.0 bar, tailings breach risk',  zone:'Z5' },
      { id:'SIM005B', level:'warning',  type:'environment','message':'[SIM] Downstream water monitoring W-07 detects turbidity spike — possible leachate',        zone:'Z5' },
      { id:'SIM005C', level:'warning',  type:'drone',      message:'[SIM] Falcon-2 dispatched for tailings dam aerial survey — ETA 4 min',                        zone:'Z5' },
    ],
  },
  equipment_fire: {
    label: 'Equip. Fire',
    zone: 'Z1 — Excavator Pad',
    severity: 'critical',
    steps: ['Engine thermal runaway detected', 'Fire suppression triggered', 'Operator evacuated', 'Fire crew dispatched'],
    alerts: [
      { id:'SIM006A', level:'critical', type:'equipment', message:'[SIM] ZX870-01 engine compartment temperature 218°C — thermal runaway, fire risk CRITICAL', zone:'Z1' },
      { id:'SIM006B', level:'critical', type:'equipment', message:'[SIM] Onboard fire suppression activated on ZX870-01 — operator Gunawan Hadi evacuating',   zone:'Z1' },
      { id:'SIM006C', level:'warning',  type:'gas',       message:'[SIM] Smoke detected at Z1 equipment pad — 200m downwind evacuation precaution active',     zone:'Z1' },
    ],
  },
  flood_risk: {
    label: 'Flood Risk',
    zone: 'Z3 — Underground C',
    severity: 'critical',
    steps: ['Water ingress detected', 'Underground evacuation ordered', 'Pumping system activated', 'Rescue team on standby'],
    alerts: [
      { id:'SIM007A', level:'critical', type:'environment','message':'[SIM] Water ingress sensor WI-03 in Underground Zone C — 180 L/min inflow, EVACUATE',      zone:'Z3' },
      { id:'SIM007B', level:'critical', type:'health',     message:'[SIM] 32 workers underground Zone C — emergency evacuation via Route C2 initiated',          zone:'Z3' },
      { id:'SIM007C', level:'warning',  type:'environment','message':'[SIM] Surface drainage overwhelmed — surface water routed toward Zone C access portal',     zone:'Z3' },
    ],
  },
  driver_fatigue: {
    label: 'Driver Fatigue',
    zone: 'Z2 — Haul Road',
    severity: 'warning',
    steps: ['Fatigue AI flags operator', 'Supervisor alerted', 'Relief driver dispatched', 'Vehicle safely parked'],
    alerts: [
      { id:'SIM008A', level:'critical', type:'health',    message:'[SIM] HD785-02 driver Budi Santoso fatigue score 94 — eye closure detected, pulling over',   zone:'Z2' },
      { id:'SIM008B', level:'warning',  type:'equipment', message:'[SIM] HD785-02 speed variance anomaly — swerving pattern confirmed by AI camera CAM-02',      zone:'Z2' },
      { id:'SIM008C', level:'warning',  type:'health',    message:'[SIM] 2 additional night-shift drivers showing fatigue >70 — mandatory rest enforced',        zone:'Z2' },
    ],
  },
}

export const store = reactive({
  alerts: [...initialAlerts],
  activeScenario: null,
  sidebarOpen: false,

  get scenarioConfig() {
    return this.activeScenario ? SCENARIOS[this.activeScenario] : null
  },

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
  closeSidebar()  { this.sidebarOpen = false },

  _trigger(key) {
    this.activeScenario = key
    const cfg = SCENARIOS[key]
    const simIds = cfg.alerts.map(a => a.id)
    const withTime = cfg.alerts.map(a => ({
      ...a,
      time: new Date().toLocaleTimeString(),
      acknowledged: false,
      simulated: true,
    }))
    this.alerts = [
      ...withTime,
      ...this.alerts.filter(a => !simIds.includes(a.id)),
    ]
  },

  triggerGasLeak()          { this._trigger('gas_leak') },
  triggerHeatStress()       { this._trigger('heat_stress') },
  triggerSlopeCrack()       { this._trigger('slope_crack') },
  triggerVehicleProximity() { this._trigger('vehicle_proximity') },
  triggerSustainabilityRisk(){ this._trigger('sustain_risk') },
  triggerEquipmentFire()    { this._trigger('equipment_fire') },
  triggerFloodRisk()        { this._trigger('flood_risk') },
  triggerDriverFatigue()    { this._trigger('driver_fatigue') },

  resetScenario() {
    this.activeScenario = null
    this.alerts = this.alerts.filter(a => !a.simulated)
  },

  acknowledgeAlert(id) {
    const alert = this.alerts.find(a => a.id === id)
    if (alert) alert.acknowledged = true
  },

  get criticalCount() {
    return this.alerts.filter(a => a.level === 'critical' && !a.acknowledged).length
  },
})
