<script setup>
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  worker: { type: Object, default: null },
})
const emit = defineEmits(['close'])

function statusAccent(s) {
  if (s === 'critical') return 'var(--status-crit)'
  if (s === 'warning')  return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function fatigueColor(score) {
  if (score >= 70) return 'var(--status-crit)'
  if (score >= 50) return 'var(--status-warn)'
  return 'var(--status-ok)'
}
function ppeColor(val) {
  if (!val) return 'var(--text-muted)'
  if (val.includes('NOT DETECTED') || val.includes('FALL') || val.includes('Immobility')) return 'var(--status-crit)'
  if (val === 'Not required') return 'var(--text-muted)'
  return 'var(--status-ok)'
}
function hsiColor(val) {
  if (!val) return 'var(--text-muted)'
  if (val === 'Critical') return 'var(--status-crit)'
  if (val === 'Elevated' || val === 'Moderate') return 'var(--status-warn)'
  return 'var(--status-ok)'
}
</script>

<template>
  <Transition name="drawer-slide">
    <div v-if="worker" class="drawer-backdrop" @click.self="emit('close')">
      <div class="drawer" :style="{ '--status-accent': statusAccent(worker.status) }">

        <!-- Header -->
        <div class="drawer-header">
          <div class="dh-left">
            <span class="dh-label">👷 Worker Health Profile</span>
            <div class="dh-name-row">
              <span class="dh-name">{{ worker.name }}</span>
              <span class="dh-id">{{ worker.id }}</span>
              <StatusBadge :status="worker.status" />
            </div>
            <div class="dh-meta">{{ worker.role }} · {{ worker.zone }} · {{ worker.shift }} Shift</div>
          </div>
          <button class="dh-close" @click="emit('close')">✕</button>
        </div>

        <!-- Scrollable body -->
        <div class="drawer-body">

          <!-- Section: Profile -->
          <div class="dsec">
            <div class="dsec-title">👤 Worker Profile</div>
            <div class="d2col">
              <div class="dkv"><span class="dk">Worker ID</span><span class="dv mono">{{ worker.id }}</span></div>
              <div class="dkv"><span class="dk">Role</span><span class="dv">{{ worker.role }}</span></div>
              <div class="dkv"><span class="dk">Zone</span><span class="dv mono">{{ worker.zone }}</span></div>
              <div class="dkv"><span class="dk">Shift</span><span class="dv">{{ worker.shift }}</span></div>
              <div class="dkv"><span class="dk">Supervisor</span><span class="dv">{{ worker.profile?.supervisor }}</span></div>
              <div class="dkv"><span class="dk">Shift Start</span><span class="dv mono">{{ worker.profile?.shiftStart }}</span></div>
              <div class="dkv"><span class="dk">Time on Shift</span><span class="dv mono accent">{{ worker.profile?.timeOnShift }}</span></div>
              <div class="dkv"><span class="dk">Last Checkpoint</span><span class="dv">{{ worker.profile?.lastCheckpoint }}</span></div>
              <div class="dkv"><span class="dk">Last Updated</span><span class="dv mono">{{ worker.lastUpdate }}</span></div>
            </div>
          </div>

          <!-- Section: Baseline -->
          <div class="dsec">
            <div class="dsec-title">📋 Baseline Health <span class="demo-tag">Demo data</span></div>
            <div class="d2col">
              <div class="dkv"><span class="dk">Blood Type</span><span class="dv mono">{{ worker.baseline?.bloodType }}</span></div>
              <div class="dkv"><span class="dk">Resting HR</span><span class="dv mono">{{ worker.baseline?.restingHeartRate }} bpm</span></div>
              <div class="dkv"><span class="dk">Normal BP</span><span class="dv mono">{{ worker.baseline?.normalBloodPressure }} mmHg</span></div>
              <div class="dkv"><span class="dk">Baseline Temp</span><span class="dv mono">{{ worker.baseline?.baselineTemp }}</span></div>
              <div class="dkv"><span class="dk">Baseline SpO₂</span><span class="dv mono">{{ worker.baseline?.baselineSpo2 }}</span></div>
              <div class="dkv"><span class="dk">Fit for Duty</span>
                <span class="dv" :style="{ color: worker.baseline?.fitForDuty === 'Cleared' ? 'var(--status-ok)' : 'var(--status-warn)' }">
                  {{ worker.baseline?.fitForDuty }}
                </span>
              </div>
              <div class="dkv dkv-full"><span class="dk">Medical Risk Flag</span>
                <span class="dv" :style="{ color: worker.baseline?.medicalRiskFlag === 'None recorded' ? 'var(--text-muted)' : 'var(--status-warn)' }">
                  {{ worker.baseline?.medicalRiskFlag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Section: Real-time Vitals -->
          <div class="dsec">
            <div class="dsec-title">📡 Real-Time Vitals</div>
            <div class="vitals-grid">
              <div class="vital-chip" :style="{ borderColor: worker.heartRate > 100 ? 'var(--status-crit)' : worker.heartRate > 90 ? 'var(--status-warn)' : 'var(--border-card)' }">
                <div class="vc-label">Heart Rate</div>
                <div class="vc-val" :style="{ color: worker.heartRate > 100 ? 'var(--status-crit)' : worker.heartRate > 90 ? 'var(--status-warn)' : 'var(--text-primary)' }">{{ worker.heartRate }}</div>
                <div class="vc-unit">bpm</div>
              </div>
              <div class="vital-chip" :style="{ borderColor: worker.temperature > 38 ? 'var(--status-crit)' : worker.temperature > 37.5 ? 'var(--status-warn)' : 'var(--border-card)' }">
                <div class="vc-label">Temperature</div>
                <div class="vc-val" :style="{ color: worker.temperature > 38 ? 'var(--status-crit)' : worker.temperature > 37.5 ? 'var(--status-warn)' : 'var(--text-primary)' }">{{ worker.temperature }}</div>
                <div class="vc-unit">°C</div>
              </div>
              <div class="vital-chip" :style="{ borderColor: worker.spo2 < 95 ? 'var(--status-crit)' : worker.spo2 < 97 ? 'var(--status-warn)' : 'var(--border-card)' }">
                <div class="vc-label">SpO₂</div>
                <div class="vc-val" :style="{ color: worker.spo2 < 95 ? 'var(--status-crit)' : worker.spo2 < 97 ? 'var(--status-warn)' : 'var(--text-primary)' }">{{ worker.spo2 }}</div>
                <div class="vc-unit">%</div>
              </div>
              <div class="vital-chip">
                <div class="vc-label">Blood Pressure</div>
                <div class="vc-val small">{{ worker.vitals?.bloodPressure }}</div>
                <div class="vc-unit">mmHg</div>
              </div>
              <div class="vital-chip">
                <div class="vc-label">Glucose</div>
                <div class="vc-val small">{{ worker.vitals?.glucose }}</div>
              </div>
              <div class="vital-chip">
                <div class="vc-label">Hydration</div>
                <div class="vc-val small" :style="{ color: worker.vitals?.hydration === 'Low' ? 'var(--status-warn)' : 'var(--text-primary)' }">{{ worker.vitals?.hydration }}</div>
              </div>
              <div class="vital-chip" :style="{ borderColor: hsiColor(worker.vitals?.heatStressIndex) }">
                <div class="vc-label">Heat Stress</div>
                <div class="vc-val small" :style="{ color: hsiColor(worker.vitals?.heatStressIndex) }">{{ worker.vitals?.heatStressIndex }}</div>
              </div>
              <div class="vital-chip">
                <div class="vc-label">Activity</div>
                <div class="vc-val small">{{ worker.vitals?.activity }}</div>
              </div>
            </div>
          </div>

          <!-- Section: Fatigue -->
          <div class="dsec">
            <div class="dsec-title">😴 Fatigue &amp; Recovery</div>
            <div class="fatigue-score-row">
              <span class="fs-label">Fatigue Score</span>
              <span class="fs-val" :style="{ color: fatigueColor(worker.fatigueScore) }">{{ worker.fatigueScore }}<span class="fs-max">/100</span></span>
              <div class="fs-bar-wrap">
                <div class="fs-bar-fill" :style="{ width: worker.fatigueScore + '%', background: fatigueColor(worker.fatigueScore) }"></div>
              </div>
            </div>
            <div class="d2col" style="margin-top:10px">
              <div class="dkv"><span class="dk">Sleep Last Night</span><span class="dv mono">{{ worker.fatigueProfile?.sleepDuration }}</span></div>
              <div class="dkv"><span class="dk">Sleep Quality</span>
                <span class="dv" :style="{ color: worker.fatigueProfile?.sleepQuality === 'Poor' ? 'var(--status-warn)' : 'var(--text-primary)' }">{{ worker.fatigueProfile?.sleepQuality }}</span>
              </div>
              <div class="dkv"><span class="dk">Last Break</span>
                <span class="dv mono" :style="{ color: worker.fatigueProfile?.lastBreak?.includes('5h') || worker.fatigueProfile?.lastBreak?.includes('6h') || worker.fatigueProfile?.lastBreak?.includes('7h') ? 'var(--status-warn)' : 'var(--text-primary)' }">{{ worker.fatigueProfile?.lastBreak }}</span>
              </div>
              <div class="dkv"><span class="dk">Workload</span><span class="dv">{{ worker.fatigueProfile?.workload }}</span></div>
              <div class="dkv"><span class="dk">Steps / Movement</span><span class="dv mono">{{ worker.fatigueProfile?.steps?.toLocaleString() }}</span></div>
            </div>
            <div class="rec-box" :style="{ borderColor: statusAccent(worker.status) }">
              <span class="rec-icon">💡</span>
              <span class="rec-text">{{ worker.fatigueProfile?.recommendation }}</span>
            </div>
          </div>

          <!-- Section: PPE -->
          <div class="dsec">
            <div class="dsec-title">⛑️ PPE &amp; Safety</div>
            <div class="ppe-grid">
              <div class="ppe-item">
                <span class="ppe-icon" :style="{ color: ppeColor(worker.ppeDetail?.helmet) }">{{ worker.ppeDetail?.helmet?.includes('Detected') && !worker.ppeDetail?.helmet?.includes('NOT') ? '✓' : '✗' }}</span>
                <span class="ppe-label">Helmet</span>
                <span class="ppe-val" :style="{ color: ppeColor(worker.ppeDetail?.helmet) }">{{ worker.ppeDetail?.helmet }}</span>
              </div>
              <div class="ppe-item">
                <span class="ppe-icon" :style="{ color: ppeColor(worker.ppeDetail?.vest) }">{{ worker.ppeDetail?.vest?.includes('NOT') ? '✗' : '✓' }}</span>
                <span class="ppe-label">Safety Vest</span>
                <span class="ppe-val" :style="{ color: ppeColor(worker.ppeDetail?.vest) }">{{ worker.ppeDetail?.vest }}</span>
              </div>
              <div class="ppe-item">
                <span class="ppe-icon" :style="{ color: ppeColor(worker.ppeDetail?.respirator) }">{{ worker.ppeDetail?.respirator === 'Detected' ? '✓' : '—' }}</span>
                <span class="ppe-label">Respirator</span>
                <span class="ppe-val" :style="{ color: ppeColor(worker.ppeDetail?.respirator) }">{{ worker.ppeDetail?.respirator }}</span>
              </div>
              <div class="ppe-item">
                <span class="ppe-icon" :style="{ color: ppeColor(worker.ppeDetail?.boots) }">{{ worker.ppeDetail?.boots?.includes('Detected') ? '✓' : '✗' }}</span>
                <span class="ppe-label">Boots</span>
                <span class="ppe-val" :style="{ color: ppeColor(worker.ppeDetail?.boots) }">{{ worker.ppeDetail?.boots }}</span>
              </div>
            </div>
            <div class="d2col" style="margin-top:10px">
              <div class="dkv dkv-full">
                <span class="dk">Fall Detection</span>
                <span class="dv" :style="{ color: ppeColor(worker.ppeDetail?.fallDetection) }">{{ worker.ppeDetail?.fallDetection }}</span>
              </div>
              <div class="dkv"><span class="dk">Restricted Zone</span><span class="dv" :style="{ color: worker.ppeDetail?.restrictedZone === 'Clear' ? 'var(--status-ok)' : 'var(--status-warn)' }">{{ worker.ppeDetail?.restrictedZone }}</span></div>
              <div class="dkv"><span class="dk">Last PPE Scan</span><span class="dv mono">{{ worker.ppeDetail?.lastScan }}</span></div>
              <div class="dkv"><span class="dk">Last Beacon</span><span class="dv">{{ worker.ppeDetail?.lastBeacon }}</span></div>
            </div>
          </div>

          <!-- Section: AI Explanation -->
          <div class="dsec">
            <div class="dsec-title">🤖 AI Risk Assessment</div>
            <div class="ai-header">
              <div class="ai-status-badge" :style="{ background: statusAccent(worker.status) + '22', border: '1px solid ' + statusAccent(worker.status), color: statusAccent(worker.status) }">
                {{ worker.status.toUpperCase() }}
              </div>
              <div class="ai-conf">
                <span class="ai-conf-label">AI Confidence</span>
                <span class="ai-conf-val" :style="{ color: statusAccent(worker.status) }">{{ worker.aiExplanation?.confidence }}%</span>
              </div>
            </div>
            <div class="ai-factors">
              <div class="ai-factors-label">Contributing Factors</div>
              <ul class="ai-factor-list">
                <li v-for="f in worker.aiExplanation?.factors" :key="f">{{ f }}</li>
              </ul>
            </div>
            <div class="ai-actions">
              <div class="ai-actions-label">Recommended Actions</div>
              <ul class="ai-action-list">
                <li v-for="a in worker.aiExplanation?.recommendedActions" :key="a">{{ a }}</li>
              </ul>
            </div>
          </div>

          <!-- Section: Active Alerts -->
          <div v-if="worker.fallDetected || worker.immobile || worker.panicButton || !worker.ppeCompliant" class="dsec">
            <div class="dsec-title">🚨 Active Alerts</div>

            <div v-if="worker.fallDetected" class="alert-card alert-crit">
              <div class="ac-top">
                <span class="ac-type">Fall Detected</span>
                <span class="ac-sev sev-crit">CRITICAL</span>
                <span class="ac-time">{{ worker.lastUpdate }}</span>
              </div>
              <div class="ac-desc">No movement detected for 90+ seconds. Immediate rescue response required.</div>
              <div class="ac-btns">
                <button class="ac-btn btn-ack">Acknowledge</button>
                <button class="ac-btn btn-sup">Assign Supervisor</button>
                <button class="ac-btn btn-loc">View Location</button>
              </div>
            </div>

            <div v-if="worker.immobile" class="alert-card alert-warn">
              <div class="ac-top">
                <span class="ac-type">Immobility Alert</span>
                <span class="ac-sev sev-warn">WARNING</span>
                <span class="ac-time">{{ worker.lastUpdate }}</span>
              </div>
              <div class="ac-desc">Worker has not moved for 4+ minutes. Visual check-in required.</div>
              <div class="ac-btns">
                <button class="ac-btn btn-ack">Acknowledge</button>
                <button class="ac-btn btn-sup">Assign Supervisor</button>
                <button class="ac-btn btn-rest">Mark for Rest Break</button>
              </div>
            </div>

            <div v-if="!worker.ppeCompliant" class="alert-card alert-warn">
              <div class="ac-top">
                <span class="ac-type">PPE Non-Compliance</span>
                <span class="ac-sev sev-warn">WARNING</span>
                <span class="ac-time">{{ worker.lastUpdate }}</span>
              </div>
              <div class="ac-desc">Required PPE item not detected at last scan. Compliance check required.</div>
              <div class="ac-btns">
                <button class="ac-btn btn-ack">Acknowledge</button>
                <button class="ac-btn btn-sup">Assign Supervisor</button>
              </div>
            </div>

            <div v-if="worker.panicButton" class="alert-card alert-crit">
              <div class="ac-top">
                <span class="ac-type">Panic Button Activated</span>
                <span class="ac-sev sev-crit">CRITICAL</span>
                <span class="ac-time">{{ worker.lastUpdate }}</span>
              </div>
              <div class="ac-desc">Worker has activated the manual panic alert. Immediate response required.</div>
              <div class="ac-btns">
                <button class="ac-btn btn-ack">Acknowledge</button>
                <button class="ac-btn btn-sup">Assign Supervisor</button>
                <button class="ac-btn btn-loc">View Location</button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="drawer-footer">
            Demo safety monitoring data. Health indicators are simulated for operational risk assessment.
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  display: flex; justify-content: flex-end;
}

.drawer {
  width: 460px; max-width: 100vw;
  height: 100%;
  background: var(--bg-card);
  border-left: 1px solid var(--border-card);
  display: flex; flex-direction: column;
  box-shadow: -8px 0 40px rgba(0,0,0,0.5);
  overflow: hidden;
}

/* Transition */
.drawer-slide-enter-active { transition: transform 0.25s ease; }
.drawer-slide-leave-active { transition: transform 0.2s ease; }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(100%); }

/* Header */
.drawer-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 16px 18px 14px;
  border-bottom: 1px solid var(--border-card);
  background: var(--bg-secondary);
  flex-shrink: 0;
}
.dh-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); display: block; margin-bottom: 5px; }
.dh-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.dh-name { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); }
.dh-id { font-size: 0.65rem; font-family: var(--font-mono); background: var(--bg-base); color: var(--text-muted); padding: 2px 6px; border-radius: 4px; }
.dh-meta { font-size: 0.72rem; color: var(--text-muted); }
.dh-close {
  background: none; border: 1px solid var(--border-card); color: var(--text-muted);
  padding: 5px 9px; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem;
  transition: all 0.15s; flex-shrink: 0; margin-left: 10px;
}
.dh-close:hover { color: var(--text-primary); border-color: var(--text-muted); }

/* Scrollable body */
.drawer-body { flex: 1; overflow-y: auto; padding: 14px 18px; display: flex; flex-direction: column; gap: 14px; }
.drawer-body::-webkit-scrollbar { width: 5px; }
.drawer-body::-webkit-scrollbar-track { background: transparent; }
.drawer-body::-webkit-scrollbar-thumb { background: var(--border-card); border-radius: 3px; }

/* Sections */
.dsec { background: var(--bg-secondary); border-radius: var(--radius-md); padding: 12px 14px; border: 1px solid var(--border-card); }
.dsec-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
.demo-tag { font-size: 0.58rem; background: rgba(99,102,241,0.15); color: #a5b4fc; padding: 1px 6px; border-radius: 3px; text-transform: none; letter-spacing: 0; }

/* Key-value grid */
.d2col { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; }
.dkv { display: flex; flex-direction: column; gap: 2px; }
.dkv-full { grid-column: 1 / -1; }
.dk { font-size: 0.62rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
.dv { font-size: 0.78rem; color: var(--text-primary); }
.dv.mono { font-family: var(--font-mono); }
.dv.accent { color: var(--status-accent); }

/* Vitals grid */
.vitals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.vital-chip {
  background: var(--bg-base); border: 1px solid var(--border-card);
  border-radius: var(--radius-sm); padding: 8px 6px; text-align: center;
}
.vc-label { font-size: 0.58rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
.vc-val { font-size: 1.1rem; font-weight: 700; font-family: var(--font-mono); color: var(--text-primary); line-height: 1; }
.vc-val.small { font-size: 0.78rem; }
.vc-unit { font-size: 0.6rem; color: var(--text-muted); margin-top: 2px; }

/* Fatigue score bar */
.fatigue-score-row { display: flex; align-items: center; gap: 10px; }
.fs-label { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; }
.fs-val { font-size: 1.15rem; font-weight: 700; font-family: var(--font-mono); white-space: nowrap; }
.fs-max { font-size: 0.68rem; color: var(--text-muted); font-weight: 400; }
.fs-bar-wrap { flex: 1; height: 6px; background: var(--bg-base); border-radius: 3px; overflow: hidden; }
.fs-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }

/* Recommendation box */
.rec-box {
  margin-top: 10px; background: var(--bg-base);
  border-left: 3px solid var(--status-accent);
  border-radius: var(--radius-sm); padding: 8px 10px;
  display: flex; gap: 8px; align-items: flex-start;
}
.rec-icon { font-size: 0.9rem; flex-shrink: 0; margin-top: 1px; }
.rec-text { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.45; }

/* PPE grid */
.ppe-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.ppe-item { background: var(--bg-base); border-radius: var(--radius-sm); padding: 8px 10px; display: flex; align-items: center; gap: 7px; }
.ppe-icon { font-size: 0.85rem; font-weight: 700; width: 14px; text-align: center; }
.ppe-label { font-size: 0.68rem; color: var(--text-muted); flex: 1; }
.ppe-val { font-size: 0.7rem; font-weight: 600; }

/* AI section */
.ai-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.ai-status-badge { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 20px; }
.ai-conf { display: flex; align-items: center; gap: 6px; }
.ai-conf-label { font-size: 0.68rem; color: var(--text-muted); }
.ai-conf-val { font-size: 1rem; font-weight: 700; font-family: var(--font-mono); }
.ai-factors, .ai-actions { margin-bottom: 8px; }
.ai-factors-label, .ai-actions-label { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 5px; }
.ai-factor-list, .ai-action-list { margin: 0; padding-left: 16px; display: flex; flex-direction: column; gap: 3px; }
.ai-factor-list li { font-size: 0.75rem; color: var(--text-secondary); }
.ai-action-list li { font-size: 0.75rem; color: var(--text-secondary); }

/* Alert cards */
.alert-card { border-radius: var(--radius-sm); padding: 10px 12px; margin-top: 8px; }
.alert-crit { background: var(--status-crit-bg); border: 1px solid var(--status-crit-border); }
.alert-warn { background: var(--status-warn-bg); border: 1px solid var(--status-warn-border); }
.ac-top { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.ac-type { font-size: 0.78rem; font-weight: 700; color: var(--text-primary); }
.ac-sev { font-size: 0.6rem; font-weight: 700; padding: 2px 6px; border-radius: 3px; letter-spacing: 0.05em; }
.sev-crit { background: var(--status-crit); color: white; }
.sev-warn { background: var(--status-warn); color: white; }
.ac-time { font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-mono); margin-left: auto; }
.ac-desc { font-size: 0.73rem; color: var(--text-secondary); margin-bottom: 8px; }
.ac-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.ac-btn {
  font-size: 0.68rem; padding: 4px 10px; border-radius: var(--radius-sm);
  border: 1px solid var(--border-card); background: var(--bg-base);
  color: var(--text-secondary); cursor: pointer; transition: all 0.15s; font-family: var(--font-sans);
}
.ac-btn:hover { color: var(--text-primary); border-color: var(--text-muted); }
.btn-ack:hover { border-color: var(--status-ok); color: var(--status-ok); }
.btn-sup:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
.btn-rest:hover { border-color: var(--status-warn); color: var(--status-warn); }
.btn-loc:hover { border-color: var(--accent-cyan, #06b6d4); color: var(--accent-cyan, #06b6d4); }

/* Footer */
.drawer-footer {
  font-size: 0.62rem; color: var(--text-muted); text-align: center;
  padding: 10px 14px;
  border: 1px dashed rgba(255,255,255,0.06);
  border-radius: var(--radius-sm);
  line-height: 1.4;
}

@media (max-width: 600px) {
  .drawer { width: 100vw; }
  .vitals-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
