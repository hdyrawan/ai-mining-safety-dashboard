import { reactive } from 'vue'
import { alerts as initialAlerts } from '../data/mockData.js'

export const store = reactive({
  alerts: [...initialAlerts],
  activeScenario: null,

  triggerGasLeak() {
    this.activeScenario = 'gas_leak'
    const newAlert = {
      id: 'SIM001',
      level: 'critical',
      type: 'gas',
      message: '[SIMULATION] Critical methane spike 12.8 ppm in Zone 2 — evacuate immediately',
      zone: 'Z2',
      time: new Date().toLocaleTimeString(),
      acknowledged: false,
      simulated: true,
    }
    this.alerts = [newAlert, ...this.alerts.filter(a => a.id !== 'SIM001')]
  },

  triggerHeatStress() {
    this.activeScenario = 'heat_stress'
    const newAlert = {
      id: 'SIM002',
      level: 'critical',
      type: 'health',
      message: '[SIMULATION] Worker W002 critical heat stress — HR 128 bpm, Temp 39.2°C — urgent rescue',
      zone: 'Z1',
      time: new Date().toLocaleTimeString(),
      acknowledged: false,
      simulated: true,
    }
    this.alerts = [newAlert, ...this.alerts.filter(a => a.id !== 'SIM002')]
  },

  triggerSlopeCrack() {
    this.activeScenario = 'slope_crack'
    const newAlert = {
      id: 'SIM003',
      level: 'critical',
      type: 'drone',
      message: '[SIMULATION] Eagle-1 detected 22m slope crack on Zone B south face — zone closure required',
      zone: 'Z2',
      time: new Date().toLocaleTimeString(),
      acknowledged: false,
      simulated: true,
    }
    this.alerts = [newAlert, ...this.alerts.filter(a => a.id !== 'SIM003')]
  },

  triggerVehicleProximity() {
    this.activeScenario = 'vehicle_proximity'
    const newAlert = {
      id: 'SIM004',
      level: 'critical',
      type: 'equipment',
      message: '[SIMULATION] Haul truck EQ02 within 8m of 3 workers in Zone A — collision risk HIGH',
      zone: 'Z1',
      time: new Date().toLocaleTimeString(),
      acknowledged: false,
      simulated: true,
    }
    this.alerts = [newAlert, ...this.alerts.filter(a => a.id !== 'SIM004')]
  },

  triggerSustainabilityRisk() {
    this.activeScenario = 'sustain_risk'
    const newAlert = {
      id: 'SIM005',
      level: 'warning',
      type: 'environment',
      message: '[SIMULATION] Tailings seepage sensor SP-03 breach detected — environmental incident protocol',
      zone: 'Z5',
      time: new Date().toLocaleTimeString(),
      acknowledged: false,
      simulated: true,
    }
    this.alerts = [newAlert, ...this.alerts.filter(a => a.id !== 'SIM005')]
  },

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
