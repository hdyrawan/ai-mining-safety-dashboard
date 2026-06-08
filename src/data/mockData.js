// ─────────────────────────────────────────────────────────────────────────────
// AI Mining Safety & Sustainability Command Center — Static Mock Data
// ─────────────────────────────────────────────────────────────────────────────

export const mineZones = [
  { id: 'Z1', name: 'Open Pit A', type: 'open_pit',    riskLevel: 'normal',   workers: 45, x:12, y:22, w:22, h:18, color:'#22c55e' },
  { id: 'Z2', name: 'Blast Zone B',type:'blast',       riskLevel: 'warning',  workers: 18, x:37, y:14, w:16, h:14, color:'#f59e0b' },
  { id: 'Z3', name: 'Underground C',type:'underground', riskLevel: 'normal',  workers: 32, x:30, y:55, w:14, h:12, color:'#22c55e' },
  { id: 'Z4', name: 'Processing',   type:'processing',  riskLevel: 'normal',  workers: 28, x:55, y:48, w:18, h:14, color:'#3b82f6' },
  { id: 'Z5', name: 'Tailings Dam', type:'tailings',    riskLevel: 'warning',  workers:  4, x:76, y:58, w:16, h:12, color:'#f59e0b' },
  { id: 'Z6', name: 'Biodiversity', type:'biodiversity',riskLevel: 'normal',  workers:  0, x:78, y:6,  w:16, h:16, color:'#10b981' },
  { id: 'Z7', name: 'Admin / Muster',type:'admin',      riskLevel: 'normal',  workers: 15, x:5,  y:72, w:16, h:10, color:'#6366f1' },
  { id: 'Z8', name: 'Fuel Storage', type:'storage',     riskLevel: 'critical', workers:  3, x:57, y:20, w:10, h:10, color:'#ef4444' },
  { id: 'Z9', name: 'Water Station',type:'water',       riskLevel: 'normal',  workers:  2, x:88, y:38, w:8,  h:8,  color:'#06b6d4' },
]

export const workers = [
  { id:'W001', name:'Ahmad Salleh',    zone:'Z1', shift:'Day',   heartRate:78,  temperature:36.8, spo2:98, fatigueScore:22, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'normal',   lastUpdate:'1 min ago', lat:15, lng:25 },
  { id:'W002', name:'Budi Santoso',    zone:'Z1', shift:'Day',   heartRate:95,  temperature:37.9, spo2:97, fatigueScore:61, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'warning',  lastUpdate:'2 min ago', lat:16, lng:27 },
  { id:'W003', name:'Chen Wei',        zone:'Z2', shift:'Day',   heartRate:82,  temperature:36.6, spo2:98, fatigueScore:18, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'normal',   lastUpdate:'1 min ago', lat:40, lng:18 },
  { id:'W004', name:'Diana Putri',     zone:'Z3', shift:'Day',   heartRate:110, temperature:38.4, spo2:94, fatigueScore:78, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:false, status:'critical', lastUpdate:'30 sec ago',lat:34, lng:58 },
  { id:'W005', name:'Eko Prasetyo',    zone:'Z3', shift:'Day',   heartRate:76,  temperature:36.5, spo2:99, fatigueScore:15, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'normal',   lastUpdate:'2 min ago', lat:33, lng:60 },
  { id:'W006', name:'Fatimah Zahra',   zone:'Z4', shift:'Day',   heartRate:88,  temperature:37.1, spo2:97, fatigueScore:42, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'normal',   lastUpdate:'1 min ago', lat:58, lng:52 },
  { id:'W007', name:'Gunawan Hadi',    zone:'Z1', shift:'Night', heartRate:91,  temperature:37.2, spo2:96, fatigueScore:55, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'warning',  lastUpdate:'3 min ago', lat:18, lng:30 },
  { id:'W008', name:'Hendra Wijaya',   zone:'Z2', shift:'Day',   heartRate:79,  temperature:36.9, spo2:98, fatigueScore:29, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'normal',   lastUpdate:'1 min ago', lat:42, lng:19 },
  { id:'W009', name:'Intan Sari',      zone:'Z4', shift:'Night', heartRate:84,  temperature:37.0, spo2:98, fatigueScore:38, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'normal',   lastUpdate:'2 min ago', lat:60, lng:50 },
  { id:'W010', name:'Joko Susilo',     zone:'Z5', shift:'Day',   heartRate:102, temperature:38.1, spo2:95, fatigueScore:69, fallDetected:true,  immobile:false, panicButton:false, ppeCompliant:true,  status:'critical', lastUpdate:'15 sec ago',lat:80, lng:62 },
  { id:'W011', name:'Kartini Dewi',    zone:'Z3', shift:'Day',   heartRate:80,  temperature:36.7, spo2:99, fatigueScore:21, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'normal',   lastUpdate:'1 min ago', lat:32, lng:57 },
  { id:'W012', name:'Lukman Hakim',    zone:'Z4', shift:'Day',   heartRate:75,  temperature:36.4, spo2:99, fatigueScore:12, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'normal',   lastUpdate:'2 min ago', lat:57, lng:54 },
  { id:'W013', name:'Maria Gonzalez',  zone:'Z1', shift:'Day',   heartRate:87,  temperature:37.3, spo2:97, fatigueScore:47, fallDetected:false, immobile:false, panicButton:false, ppeCompliant:false, status:'warning',  lastUpdate:'4 min ago', lat:14, lng:29 },
  { id:'W014', name:'Nanda Kurnia',    zone:'Z2', shift:'Night', heartRate:93,  temperature:37.8, spo2:96, fatigueScore:63, fallDetected:false, immobile:true,  panicButton:false, ppeCompliant:true,  status:'warning',  lastUpdate:'5 min ago', lat:41, lng:20 },
  { id:'W015', name:'Omar Abdullah',   zone:'Z7', shift:'Day',   heartRate:72,  temperature:36.3, spo2:99, fatigueScore:8,  fallDetected:false, immobile:false, panicButton:false, ppeCompliant:true,  status:'normal',   lastUpdate:'2 min ago', lat:10, lng:76 },
]

export const drones = [
  { id:'D01', name:'Eagle-1',   status:'active',    battery:87, altitude:120, speed:14, mission:'Zone A Perimeter Patrol',       signalStrength:92, flightHours:1240, detections:[] },
  { id:'D02', name:'Eagle-2',   status:'active',    battery:63, altitude:95,  speed:12, mission:'Blast Zone B Inspection',       signalStrength:88, flightHours:980,  detections:[{ type:'slope_crack', severity:'warning', description:'Minor slope crack detected, 15m segment', confidence:84 }] },
  { id:'D03', name:'Falcon-1',  status:'charging',  battery:24, altitude:0,   speed:0,  mission:'Charging — next: Night Survey', signalStrength:100,flightHours:765,  detections:[] },
  { id:'D04', name:'Falcon-2',  status:'active',    battery:91, altitude:145, speed:16, mission:'Environmental Monitoring',      signalStrength:95, flightHours:432,  detections:[{ type:'water_discharge', severity:'info', description:'Water runoff detected near Zone D boundary', confidence:77 }] },
  { id:'D05', name:'Hawk-1',    status:'standby',   battery:100,altitude:0,   speed:0,  mission:'Standby — rapid response',      signalStrength:100,flightHours:156,  detections:[] },
  { id:'D06', name:'Hawk-2',    status:'maintenance',battery:35, altitude:0,  speed:0,  mission:'Maintenance — sensor calibration',signalStrength:0,  flightHours:2100, detections:[] },
]

export const gasSensors = [
  { id:'GS01', name:'GS-01',  zone:'Z1', type:'methane',  label:'CH₄',  value:0.4,  unit:'ppm',  thresholdWarn:5,   thresholdCrit:10,  status:'normal',  trend:'stable', lastCalibrated:'2024-12-20' },
  { id:'GS02', name:'GS-02',  zone:'Z2', type:'methane',  label:'CH₄',  value:4.8,  unit:'ppm',  thresholdWarn:5,   thresholdCrit:10,  status:'warning', trend:'up',    lastCalibrated:'2024-12-18' },
  { id:'GS03', name:'GS-03',  zone:'Z3', type:'co',       label:'CO',   value:18.2, unit:'ppm',  thresholdWarn:25,  thresholdCrit:50,  status:'normal',  trend:'stable', lastCalibrated:'2024-12-19' },
  { id:'GS04', name:'GS-04',  zone:'Z3', type:'co',       label:'CO',   value:31.5, unit:'ppm',  thresholdWarn:25,  thresholdCrit:50,  status:'warning', trend:'up',    lastCalibrated:'2024-12-19' },
  { id:'GS05', name:'GS-05',  zone:'Z1', type:'co2',      label:'CO₂',  value:0.08, unit:'%',    thresholdWarn:0.5, thresholdCrit:1.5, status:'normal',  trend:'stable', lastCalibrated:'2024-12-21' },
  { id:'GS06', name:'GS-06',  zone:'Z3', type:'h2s',      label:'H₂S',  value:2.1,  unit:'ppm',  thresholdWarn:5,   thresholdCrit:10,  status:'normal',  trend:'stable', lastCalibrated:'2024-12-17' },
  { id:'GS07', name:'GS-07',  zone:'Z2', type:'o2',       label:'O₂',   value:20.4, unit:'%',    thresholdWarn:19.5,thresholdCrit:18,  status:'normal',  trend:'stable', lastCalibrated:'2024-12-20' },
  { id:'GS08', name:'GS-08',  zone:'Z4', type:'dust',     label:'PM₂.₅',value:58.4, unit:'μg/m³',thresholdWarn:50,  thresholdCrit:100, status:'warning', trend:'up',    lastCalibrated:'2024-12-15' },
  { id:'GS09', name:'GS-09',  zone:'Z4', type:'temp',     label:'Temp', value:34.2, unit:'°C',   thresholdWarn:32,  thresholdCrit:38,  status:'warning', trend:'stable', lastCalibrated:'2024-12-21' },
  { id:'GS10', name:'GS-10',  zone:'Z1', type:'humidity', label:'RH',   value:62,   unit:'%',    thresholdWarn:80,  thresholdCrit:90,  status:'normal',  trend:'stable', lastCalibrated:'2024-12-21' },
  { id:'GS11', name:'GS-11',  zone:'Z8', type:'methane',  label:'CH₄',  value:8.4,  unit:'ppm',  thresholdWarn:5,   thresholdCrit:10,  status:'critical',trend:'up',    lastCalibrated:'2024-12-10' },
  { id:'GS12', name:'GS-12',  zone:'Z5', type:'dust',     label:'PM₁₀', value:42.1, unit:'μg/m³',thresholdWarn:50,  thresholdCrit:100, status:'normal',  trend:'stable', lastCalibrated:'2024-12-19' },
]

export const equipment = [
  { id:'EQ01', name:'CAT 390F Excavator',     type:'excavator',   status:'operating', fuel:78, engineTemp:85,  runtime:1240, maintenanceDue:260, operatorFatigue:22, proximityRisk:false, zone:'Z1', load:88 },
  { id:'EQ02', name:'Komatsu HD785 Haul Truck',type:'haul_truck',  status:'operating', fuel:62, engineTemp:90,  runtime:2180, maintenanceDue:120, operatorFatigue:48, proximityRisk:false, zone:'Z1', load:95 },
  { id:'EQ03', name:'CAT D11 Dozer',          type:'dozer',       status:'standby',   fuel:91, engineTemp:45,  runtime:890,  maintenanceDue:510, operatorFatigue:0,  proximityRisk:false, zone:'Z2', load:0  },
  { id:'EQ04', name:'Atlas Copco Drill Rig',  type:'drill_rig',   status:'operating', fuel:55, engineTemp:78,  runtime:440,  maintenanceDue:60,  operatorFatigue:55, proximityRisk:true,  zone:'Z2', load:72 },
  { id:'EQ05', name:'Liebherr Crane LTM 1160',type:'crane',       status:'operating', fuel:84, engineTemp:68,  runtime:320,  maintenanceDue:380, operatorFatigue:31, proximityRisk:false, zone:'Z4', load:65 },
  { id:'EQ06', name:'Volvo A60H Articulated', type:'haul_truck',  status:'maintenance',fuel:20, engineTemp:22, runtime:3100, maintenanceDue:0,   operatorFatigue:0,  proximityRisk:false, zone:'Z4', load:0  },
  { id:'EQ07', name:'Sandvik LH517i LHD',     type:'lhd',         status:'operating', fuel:71, engineTemp:82,  runtime:680,  maintenanceDue:220, operatorFatigue:38, proximityRisk:false, zone:'Z3', load:80 },
  { id:'EQ08', name:'Hitachi ZX870H Excavator',type:'excavator',  status:'critical',  fuel:45, engineTemp:103, runtime:1890, maintenanceDue:10,  operatorFatigue:71, proximityRisk:true,  zone:'Z1', load:60 },
]

export const alerts = [
  { id:'A001', level:'critical', type:'gas',       message:'Methane spike 8.4 ppm in Zone 8 (Fuel Storage) — threshold 10 ppm',    zone:'Z8', time:'14:32:18', acknowledged:false },
  { id:'A002', level:'critical', type:'health',    message:'Worker W010 (Joko Susilo) fall detected in Tailings Zone — no movement 90s', zone:'Z5', time:'14:28:44', acknowledged:false },
  { id:'A003', level:'critical', type:'equipment', message:'EQ08 engine over-temperature 103°C — maintenance critical',              zone:'Z1', time:'14:15:30', acknowledged:false },
  { id:'A004', level:'warning',  type:'gas',       message:'CO reading elevated at GS-04 in Zone 3 — 31.5 ppm (warn: 25 ppm)',      zone:'Z3', time:'14:19:05', acknowledged:false },
  { id:'A005', level:'warning',  type:'health',    message:'Worker W004 (Diana Putri) high fatigue score 78 — heat stress risk',      zone:'Z3', time:'14:05:22', acknowledged:false },
  { id:'A006', level:'warning',  type:'equipment', message:'EQ04 proximity alert — drill rig within 15m of workers in Zone B',       zone:'Z2', time:'13:58:11', acknowledged:true  },
  { id:'A007', level:'warning',  type:'environment','message':'Dust PM₂.₅ elevated at GS-08 in Processing Zone — 58.4 μg/m³',       zone:'Z4', time:'13:45:00', acknowledged:true  },
  { id:'A008', level:'info',     type:'drone',     message:'Eagle-2 detected minor slope crack in Zone B2 — confidence 84%',         zone:'Z2', time:'13:30:55', acknowledged:true  },
]

export const incidents = [
  { id:'INC001', time:'2024-12-21 14:28', type:'Fall Detected',          severity:'critical', status:'active',   zone:'Z5', description:'Worker Joko Susilo fall detected via wearable sensor. Last GPS position: Tailings Dam Section 3.', assignedTo:'Safety Officer Rahman', steps:['Alert triggered', 'Supervisor notified', 'Rescue team dispatched'] },
  { id:'INC002', time:'2024-12-21 13:45', type:'Gas Threshold Breach',   severity:'warning',  status:'monitoring',zone:'Z3', description:'CO concentration exceeded warning threshold at GS-04. Zone B2 access restricted.', assignedTo:'Safety Officer Siti', steps:['Alert triggered', 'Zone restricted', 'Ventilation increased'] },
  { id:'INC003', time:'2024-12-20 09:15', type:'Equipment Breakdown',    severity:'warning',  status:'resolved', zone:'Z4', description:'Hydraulic failure on Volvo A60H haul truck. Repaired and returned to service 11:45.', assignedTo:'Maintenance Team A', steps:['Alert triggered', 'Equipment isolated', 'Repair completed', 'Cleared'] },
  { id:'INC004', time:'2024-12-19 16:30', type:'PPE Non-Compliance',     severity:'info',     status:'resolved', zone:'Z2', description:'3 workers detected without hard hats in blast zone. Workers corrected immediately.', assignedTo:'Zone Supervisor Budi', steps:['AI detected via CCTV', 'Supervisor alerted', 'Compliance restored'] },
  { id:'INC005', time:'2024-12-18 11:00', type:'Slope Stability Warning',severity:'warning',  status:'resolved', zone:'Z2', description:'Drone Eagle-2 detected 8m crack on north face slope. Geotechnical team dispatched.', assignedTo:'Geotech Team', steps:['Drone alert', 'Zone secured', 'Inspection done', 'Monitoring installed'] },
]

export const aiPredictions = [
  {
    id:'P001', type:'gas_risk', severity:'critical', confidence:89, timeframe:'2 hours', affectedZone:'Z8',
    title:'Methane Escalation Risk — Zone 8',
    description:'Current methane trend in Fuel Storage Zone (8.4 ppm) is accelerating. Model predicts critical threshold breach (10 ppm) within 2 hours under current ventilation conditions.',
    rootCauses:['Upward sensor trend (+0.4 ppm/hr)', 'Wind direction change reducing natural ventilation', 'Recent fuel delivery activity'],
    recommendation:'Evacuate non-essential personnel from Zone 8 immediately. Activate emergency ventilation. Suspend fuel transfers until levels stabilize.',
    preventiveActions:['Activate Zone 8 emergency ventilation', 'Restrict access to authorized personnel only', 'Deploy portable methane monitors', 'Brief rescue team on standby'],
    affectedWorkers:3
  },
  {
    id:'P002', type:'heat_stress', severity:'warning', confidence:82, timeframe:'30 minutes', affectedZone:'Z3',
    title:'Heat Stress Risk — Underground Zone C',
    description:'4 workers in Zone C show combined indicators of heat stress: elevated heart rate, body temperature trend, and high fatigue scores. Risk of heat exhaustion within 30 minutes.',
    rootCauses:['Ambient temperature 34.2°C (above 32°C threshold)', 'Humidity 68% limiting cooling', 'Workers approaching 6-hour continuous shift'],
    recommendation:'Rotate affected workers to cool rest area immediately. Increase water provision. Reduce shift length in Zone C to 4-hour maximum.',
    preventiveActions:['Schedule mandatory break for W004, W010', 'Increase cooling ventilation in Zone C', 'Provide electrolyte drinks at entry points'],
    affectedWorkers:4
  },
  {
    id:'P003', type:'equipment_failure', severity:'warning', confidence:76, timeframe:'48 hours', affectedZone:'Z1',
    title:'Hydraulic Failure Risk — CAT 390F EQ01',
    description:'Vibration pattern analysis on CAT 390F Excavator shows early-stage hydraulic pump degradation signature. 76% probability of partial hydraulic failure within 48 hours.',
    rootCauses:['Vibration anomaly in hydraulic pump (300 Hz signature)', 'Oil pressure variance +/- 8 bar (normal < 4)', 'Runtime 1,240 hours — approaching service interval'],
    recommendation:'Schedule preventive maintenance within 24 hours. Reduce load operations to 70% capacity until serviced.',
    preventiveActions:['Book EQ01 for hydraulic service', 'Reduce dig cycle intensity', 'Assign backup excavator from standby pool'],
    affectedWorkers:0
  },
  {
    id:'P004', type:'slope_risk', severity:'warning', confidence:71, timeframe:'72 hours', affectedZone:'Z2',
    title:'Slope Instability Risk — Open Pit B North Face',
    description:'Combined drone imagery and vibration sensor data indicate possible slope movement. North face displacement of 2.3 cm over 48 hours detected.',
    rootCauses:['Recent rainfall (48mm in 72 hours)', 'North face blast activity last 5 days', 'Drone-detected crack propagation (+15% in 24h)'],
    recommendation:'Increase monitoring frequency to 2-hour drone surveys. Consider temporary halt of blasting operations on north face.',
    preventiveActions:['Deploy additional slope monitors', 'Suspend blasting in Zone B2', 'Evacuate a 50m exclusion zone on north face'],
    affectedWorkers:18
  },
]

export const sustainabilityMetrics = {
  carbonIntensity:     { value:18.4, unit:'kg CO₂e/t',  target:15.0, previousMonth:19.2, trend:-0.8, status:'warning',  progress:68 },
  energyEfficiency:    { value:92,   unit:'%',           target:95,   previousMonth:90.8, trend:+1.2, status:'normal',   progress:92 },
  waterRecycling:      { value:76,   unit:'%',           target:85,   previousMonth:73.2, trend:+2.8, status:'warning',  progress:76 },
  waterConsumption:    { value:4200, unit:'m³/day',      target:3800, previousMonth:4450, trend:-250, status:'warning',  progress:62 },
  dustExposure:        { value:52.4, unit:'μg/m³',       target:45,   previousMonth:56.1, trend:-3.7, status:'warning',  progress:55 },
  tailingsRisk:        { value:23,   unit:'score/100',   target:20,   previousMonth:26,   trend:-3,   status:'normal',   progress:77 },
  biodiversityRisk:    { value:42,   unit:'score/100',   target:35,   previousMonth:44,   trend:-2,   status:'warning',  progress:60 },
  landRehabilitation:  { value:64,   unit:'%',           target:80,   previousMonth:62,   trend:+2,   status:'normal',   progress:64 },
  esgReadiness:        { value:87,   unit:'%',           target:90,   previousMonth:85,   trend:+2,   status:'normal',   progress:87 },
  safetyRecordScore:   { value:94,   unit:'%',           target:98,   previousMonth:92,   trend:+2,   status:'normal',   progress:94 },
  ppeCompliance:       { value:94.2, unit:'%',           target:98,   previousMonth:93.1, trend:+1.1, status:'normal',   progress:94 },
  incidentFreedays:    { value:47,   unit:'days',        target:180,  previousMonth:16,   trend:+31,  status:'normal',   progress:26 },
}

export const sdgAlignment = [
  { sdg:3,  name:'Good Health & Well-being',           color:'#4c9f38', icon:'❤️', score:87, coverage:'High',
    indicators:['247 workers under continuous health AI monitoring','Zero fatality target maintained (47 IFDs)','Heat stress and fatigue prevention active'],
    aiContribution:'Wearable AI monitors heart rate, temperature, SpO₂ and fatigue in real-time for every worker on site.' },
  { sdg:8,  name:'Decent Work & Economic Growth',      color:'#a21942', icon:'📈', score:82, coverage:'High',
    indicators:['AI-driven incident reduction: -34% YoY','Upskilling 120 workers on AI safety tools','Supplier ESG compliance tracking active'],
    aiContribution:'AI safety systems reduce incidents, protect livelihoods, and enable safer economic participation in mining.' },
  { sdg:9,  name:'Industry, Innovation & Infrastructure',color:'#fd6925',icon:'🏭', score:78, coverage:'Medium',
    indicators:['6 active AI systems deployed','Drone fleet upgraded: 6 units operational','Smart sensor network: 89 sensors online'],
    aiContribution:'AI-powered predictive maintenance reduces equipment downtime by 28%, improving mine infrastructure reliability.' },
  { sdg:12, name:'Responsible Consumption & Production',color:'#bf8b2e',icon:'♻️', score:74, coverage:'Medium',
    indicators:['Water recycling: 76% (target 85%)','Energy efficiency: 92% (target 95%)','Carbon intensity: 18.4 kg CO₂e/t (improving)'],
    aiContribution:'AI optimises truck routing, ventilation schedules, and processing to reduce energy and water per tonne produced.' },
  { sdg:13, name:'Climate Action',                     color:'#3f7e44', icon:'🌍', score:71, coverage:'Medium',
    indicators:['Carbon intensity reduced 4.2% YoY','Renewable energy pilot: 8% of site power','Methane monitoring prevents fugitive emissions'],
    aiContribution:'AI gas monitoring prevents methane venting. AI route optimisation reduces fleet fuel consumption by 12%.' },
  { sdg:15, name:'Life on Land',                       color:'#56c02b', icon:'🌿', score:68, coverage:'Medium',
    indicators:['64% land rehabilitation progress','Biodiversity-sensitive zone active protection','AI detects boundary intrusions near Z6'],
    aiContribution:'Drone AI monitors biodiversity zone boundaries and flags any vehicle or activity intrusion within 200m buffer.' },
  { sdg:16, name:'Peace, Justice & Strong Institutions',color:'#00689d',icon:'⚖️', score:91, coverage:'High',
    indicators:['ESG compliance readiness: 87%','AI incident logs provide full audit trail','Real-time regulatory reporting available'],
    aiContribution:'AI-generated incident timelines and compliance dashboards provide transparent, auditable records for regulators.' },
]

export const esgComponents = {
  environmental: {
    score:82, trend:+3,
    items:[
      { label:'Carbon Intensity Reduction', value:82, target:90, unit:'score' },
      { label:'Water Recycling Rate',        value:76, target:85, unit:'%' },
      { label:'Dust & Air Quality Control',  value:71, target:85, unit:'score' },
      { label:'Tailings Risk Management',    value:88, target:90, unit:'score' },
      { label:'Land Rehabilitation Progress',value:80, target:90, unit:'score' },
    ]
  },
  social: {
    score:91, trend:+2,
    items:[
      { label:'Worker Safety Record',        value:94, target:98, unit:'score' },
      { label:'Health Monitoring Coverage',  value:100,target:100,unit:'%' },
      { label:'PPE Compliance Rate',         value:94, target:98, unit:'%' },
      { label:'Community Engagement Score',  value:82, target:85, unit:'score' },
      { label:'Worker Training Hours',       value:88, target:90, unit:'score' },
    ]
  },
  governance: {
    score:88, trend:+4,
    items:[
      { label:'Incident Reporting Timeliness',value:96, target:98, unit:'score' },
      { label:'Regulatory Compliance',       value:91, target:95, unit:'%' },
      { label:'Audit Trail Completeness',    value:88, target:95, unit:'score' },
      { label:'Third-Party ESG Audit Score', value:85, target:88, unit:'score' },
      { label:'Contractor Safety Compliance',value:87, target:90, unit:'%' },
    ]
  }
}

export const environmentalIncidents = [
  { id:'EI001', date:'2024-12-21', type:'Air Quality',   severity:'warning', description:'Dust PM₂.₅ elevated in Processing Zone — AI recommended dust suppression activated', status:'active',   zone:'Z4' },
  { id:'EI002', date:'2024-12-20', type:'Water',         severity:'info',    description:'Minor surface water runoff detected near Zone D perimeter — drainage checked', status:'resolved', zone:'Z5' },
  { id:'EI003', date:'2024-12-18', type:'Land',          severity:'info',    description:'Rehabilitation Zone C1 progress survey complete — 2.3 ha newly revegetated',  status:'resolved', zone:'Z6' },
  { id:'EI004', date:'2024-12-15', type:'Air Quality',   severity:'warning', description:'PM₁₀ elevated during blast event. Blast timing adjusted to low-wind periods',  status:'resolved', zone:'Z2' },
  { id:'EI005', date:'2024-12-10', type:'Tailings',      severity:'warning', description:'Seepage sensor anomaly detected in Dam Section 3. Geotechnical inspection completed.', status:'resolved', zone:'Z5' },
]

export const sustainabilityRecommendations = [
  { id:'SR001', priority:'high',   icon:'🚛', title:'Reduce Truck Idle Time in Zone A2', description:'AI analysis shows haul trucks idle 23% of time in Zone A2 staging area. Optimising dispatch timing could reduce fuel consumption by ~180 L/day and cut CO₂ by 0.48 tCO₂/day.' },
  { id:'SR002', priority:'high',   icon:'💧', title:'Increase Water Recycling Rate', description:'Processing area recycling rate is 76% vs 85% target. Upgrading two clarifier units could add ~400 m³/day recycled water and close the gap within 60 days.' },
  { id:'SR003', priority:'medium', icon:'🌿', title:'Restrict Vehicle Access Near Biodiversity Zone', description:'Drone monitoring shows 4 unauthorized vehicle incursions within 200m of biodiversity buffer (Zone 6) in past 7 days. Install smart geofencing barriers.' },
  { id:'SR004', priority:'high',   icon:'⚠️', title:'Inspect Tailings Sensor Anomaly', description:'Seepage pressure sensor SP-03 in Dam Section 3 shows intermittent spikes. Risk model predicts 14% probability of minor seepage event within 30 days. Immediate inspection recommended.' },
  { id:'SR005', priority:'medium', icon:'💨', title:'Increase Dust Suppression Near Conveyor', description:'PM₂.₅ readings from GS-08 consistently above 50 μg/m³ during peak conveyor operations. Automated water spray activation could reduce dust index by 35%.' },
  { id:'SR006', priority:'medium', icon:'⚡', title:'Optimise Ventilation to Reduce Energy', description:'Night-shift ventilation in Underground Zone C runs at 100% capacity when gas levels are nominal. Smart ventilation control could save 280 kWh/night without compromising safety thresholds.' },
]

// ── Fleet Management ─────────────────────────────────────────────────────────
export const fleetVehicles = [
  { id:'FV01', name:'HD785-01',  type:'Haul Truck',    driver:'Ahmad Salleh',  driverId:'W001', status:'operating',  zone:'Z1', speed:28, fuelPct:74, engineTemp:88, fatigueScore:22, distractionAlert:false, phoneUse:false, route:'approved',   licenceValid:true,  proximityAlert:false, maintenanceDueDays:45  },
  { id:'FV02', name:'HD785-02',  type:'Haul Truck',    driver:'Budi Santoso',  driverId:'W002', status:'operating',  zone:'Z2', speed:34, fuelPct:58, engineTemp:92, fatigueScore:61, distractionAlert:true,  phoneUse:false, route:'approved',   licenceValid:true,  proximityAlert:false, maintenanceDueDays:12  },
  { id:'FV03', name:'A60H-01',   type:'Articulated',   driver:'—',             driverId:null,   status:'maintenance',zone:'Z4', speed:0,  fuelPct:20, engineTemp:24, fatigueScore:0,  distractionAlert:false, phoneUse:false, route:'approved',   licenceValid:true,  proximityAlert:false, maintenanceDueDays:0   },
  { id:'FV04', name:'CAT-D11',   type:'Dozer',         driver:'—',             driverId:null,   status:'standby',    zone:'Z2', speed:0,  fuelPct:91, engineTemp:45, fatigueScore:0,  distractionAlert:false, phoneUse:false, route:'approved',   licenceValid:true,  proximityAlert:false, maintenanceDueDays:120 },
  { id:'FV05', name:'LV-07',     type:'Light Vehicle', driver:'Diana Putri',   driverId:'W004', status:'operating',  zone:'Z3', speed:42, fuelPct:65, engineTemp:72, fatigueScore:78, distractionAlert:false, phoneUse:true,  route:'approved',   licenceValid:true,  proximityAlert:false, maintenanceDueDays:30  },
  { id:'FV06', name:'LV-12',     type:'Light Vehicle', driver:'Eko Prasetyo',  driverId:'W005', status:'operating',  zone:'Z1', speed:18, fuelPct:88, engineTemp:68, fatigueScore:15, distractionAlert:false, phoneUse:false, route:'unapproved', licenceValid:true,  proximityAlert:false, maintenanceDueDays:60  },
  { id:'FV07', name:'ZX870-01',  type:'Excavator',     driver:'Gunawan Hadi',  driverId:'W007', status:'operating',  zone:'Z1', speed:0,  fuelPct:62, engineTemp:95, fatigueScore:55, distractionAlert:true,  phoneUse:false, route:'approved',   licenceValid:false, proximityAlert:true,  maintenanceDueDays:5   },
  { id:'FV08', name:'LHD-01',    type:'LHD Loader',    driver:'Hendra Wijaya', driverId:'W008', status:'operating',  zone:'Z3', speed:8,  fuelPct:71, engineTemp:84, fatigueScore:29, distractionAlert:false, phoneUse:false, route:'approved',   licenceValid:true,  proximityAlert:false, maintenanceDueDays:80  },
]

export const operatorLicences = [
  { id:'OL001', name:'Ahmad Salleh',   vehicle:'HD785-01', licenceType:'HC — Heavy Combination', licenceNo:'KAL-HC-441', expiryDate:'2026-08-20', daysUntilExpiry:255, status:'valid',    trainingCurrent:true  },
  { id:'OL002', name:'Budi Santoso',   vehicle:'HD785-02', licenceType:'HC — Heavy Combination', licenceNo:'KAL-HC-219', expiryDate:'2025-03-15', daysUntilExpiry:84,  status:'expiring', trainingCurrent:true  },
  { id:'OL003', name:'Chen Wei',       vehicle:'A60H-01',  licenceType:'HR — Heavy Rigid',        licenceNo:'KAL-HR-088', expiryDate:'2025-02-10', daysUntilExpiry:51,  status:'expiring', trainingCurrent:false },
  { id:'OL004', name:'Diana Putri',    vehicle:'LV-07',    licenceType:'C — Car / Light Vehicle', licenceNo:'KAL-C-772',  expiryDate:'2025-01-20', daysUntilExpiry:30,  status:'expiring', trainingCurrent:true  },
  { id:'OL005', name:'Eko Prasetyo',   vehicle:'LV-12',    licenceType:'C — Car / Light Vehicle', licenceNo:'KAL-C-503',  expiryDate:'2024-12-10', daysUntilExpiry:-11, status:'expired',  trainingCurrent:true  },
  { id:'OL006', name:'Gunawan Hadi',   vehicle:'ZX870-01', licenceType:'HR — Heavy Rigid',        licenceNo:'KAL-HR-331', expiryDate:'2025-04-30', daysUntilExpiry:130, status:'valid',    trainingCurrent:false },
  { id:'OL007', name:'Hendra Wijaya',  vehicle:'LHD-01',   licenceType:'LF — Loader / Forklift',  licenceNo:'KAL-LF-114', expiryDate:'2026-01-15', daysUntilExpiry:390, status:'valid',    trainingCurrent:true  },
  { id:'OL008', name:'Intan Sari',     vehicle:'HD785-03', licenceType:'HC — Heavy Combination', licenceNo:'KAL-HC-667', expiryDate:'2025-06-20', daysUntilExpiry:181, status:'valid',    trainingCurrent:true  },
]

export const hazardCameraDetections = [
  { id:'HC001', camera:'CAM-02', zone:'Z2', time:'14:22:10', type:'ppe_violation',     description:'Worker missing hard hat near blast zone entrance',              severity:'warning',  confidence:91, resolved:false },
  { id:'HC002', camera:'CAM-05', zone:'Z4', time:'14:18:44', type:'restricted_zone',   description:'Unauthorized entry detected in active loading bay',              severity:'critical', confidence:88, resolved:false },
  { id:'HC003', camera:'CAM-08', zone:'Z1', time:'13:55:30', type:'vehicle_proximity', description:'Light vehicle within 10m of operating excavator ZX870-01',       severity:'warning',  confidence:85, resolved:true  },
  { id:'HC004', camera:'CAM-03', zone:'Z2', time:'13:40:05', type:'ppe_violation',     description:'Two workers without safety glasses in blast preparation area',    severity:'warning',  confidence:79, resolved:true  },
  { id:'HC005', camera:'CAM-11', zone:'Z3', time:'13:25:18', type:'unsafe_act',        description:'Worker bypassing safety barrier on conveyor level 2',             severity:'critical', confidence:94, resolved:true  },
  { id:'HC006', camera:'CAM-07', zone:'Z1', time:'12:48:33', type:'vehicle_proximity', description:'Pedestrian–vehicle conflict at haul road crossing — Z1 access',   severity:'warning',  confidence:82, resolved:true  },
]

export const dustAirSensors = [
  { id:'DA01', location:'Open Pit A — Primary Haul Road',   pm25:38.2, pm10:72.4,  no2:18.2, voc:0.12, temp:32.1, humidity:58, windSpeed:12, windDir:'NE', status:'normal',   trend:'stable' },
  { id:'DA02', location:'Blast Zone B — Active Face',       pm25:82.6, pm10:145.2, no2:24.8, voc:0.31, temp:35.4, humidity:52, windSpeed:8,  windDir:'SW', status:'critical',  trend:'up'     },
  { id:'DA03', location:'Processing Plant — Crusher Area',  pm25:58.4, pm10:96.7,  no2:15.4, voc:0.22, temp:34.2, humidity:61, windSpeed:5,  windDir:'E',  status:'warning',   trend:'up'     },
  { id:'DA04', location:'Underground Zone C — Entry Point', pm25:28.1, pm10:48.6,  no2:12.8, voc:0.08, temp:28.8, humidity:72, windSpeed:15, windDir:'—',  status:'normal',   trend:'stable' },
  { id:'DA05', location:'Tailings Dam — South Berm',        pm25:42.1, pm10:78.3,  no2:10.2, voc:0.09, temp:33.6, humidity:64, windSpeed:18, windDir:'NW', status:'normal',   trend:'down'   },
  { id:'DA06', location:'Workshop & Maintenance Bay',       pm25:22.4, pm10:38.8,  no2:31.6, voc:0.48, temp:30.2, humidity:55, windSpeed:4,  windDir:'N',  status:'warning',   trend:'up'     },
]

export const trendData = {
  gasLevels: {
    labels:['08:00','09:00','10:00','11:00','12:00','13:00','14:00'],
    series:[
      { name:'CH₄ Zone B (ppm)', color:'#f59e0b', values:[1.2,1.8,2.4,3.1,3.8,4.2,4.8] },
      { name:'CO Zone C (ppm/10)', color:'#ef4444', values:[1.8,2.0,2.2,2.4,2.6,2.9,3.15] },
      { name:'CH₄ Zone 8 (ppm)', color:'#dc2626', values:[4.5,5.0,5.8,6.4,7.1,7.8,8.4] },
    ]
  },
  riskScore: {
    labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    series:[
      { name:'Overall Risk', color:'#ef4444', values:[42,38,51,35,44,29,67] },
      { name:'Health Risk',  color:'#f59e0b', values:[35,28,40,31,38,22,55] },
      { name:'Equipment Risk',color:'#3b82f6', values:[30,32,28,25,34,20,40] },
    ]
  },
  sustainability: {
    labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    series:[
      { name:'Carbon Intensity', color:'#ef4444', values:[22.1,21.8,21.2,20.8,20.1,19.7,19.3,18.9,18.7,18.5,18.4,18.2] },
      { name:'Water Recycling %',color:'#06b6d4',  values:[68,69,70,71,72,73,73,74,74,75,76,76] },
      { name:'Energy Efficiency %',color:'#22c55e',values:[88,88,89,89,90,90,91,91,91,92,92,92] },
    ]
  },
  workerHealth: {
    labels:['06:00','08:00','10:00','12:00','14:00','16:00','18:00'],
    series:[
      { name:'Avg Fatigue Score',  color:'#f59e0b', values:[12,18,28,35,42,38,44] },
      { name:'Workers at Risk',    color:'#ef4444', values:[0,1,1,2,3,2,4] },
      { name:'PPE Compliance %',   color:'#22c55e', values:[98,97,96,95,94,95,93] },
    ]
  },
  fleetFatigue: {
    labels:['06:00','08:00','10:00','12:00','14:00','16:00','18:00'],
    series:[
      { name:'Avg Driver Fatigue Score',     color:'#f59e0b', values:[8,14,22,31,42,38,51] },
      { name:'Drivers at Risk (score >50)',  color:'#ef4444', values:[0,0,1,1,2,2,3] },
    ]
  },
  dustAirTrend: {
    labels:['06:00','08:00','10:00','12:00','14:00','16:00'],
    series:[
      { name:'PM₂.₅ Processing (μg/m³)', color:'#f59e0b', values:[44,48,52,58,62,58] },
      { name:'PM₁₀ Blast Zone (μg/m³)',  color:'#ef4444', values:[88,95,120,145,138,112] },
      { name:'PM₂.₅ Haul Road (μg/m³)', color:'#3b82f6', values:[28,32,36,38,40,38] },
    ]
  },
}

export const kpiOverview = {
  activeWorkers:      { value:247,    label:'Active Workers',    icon:'👷', status:'normal',   change:'+3 vs shift start' },
  activeDrones:       { value:3,      label:'Active Drones',     icon:'🚁', status:'normal',   change:'3 patrolling, 1 charging' },
  sensorsOnline:      { value:89,     label:'Sensors Online',    icon:'📡', status:'warning',  change:'2 offline in Zone 8' },
  criticalAlerts:     { value:3,      label:'Critical Alerts',   icon:'🚨', status:'critical', change:'Up 2 in last 30 min' },
  aiRiskScore:        { value:67,     label:'AI Risk Score',     icon:'🤖', status:'critical', change:'High — intervention needed' },
  fatigueRisk:        { value:'28%',  label:'Fatigue Risk',      icon:'⚡', status:'warning',  change:'7 workers >50% fatigue' },
  ppeCompliance:      { value:'94.2%',label:'PPE Compliance',    icon:'⛑️',  status:'normal',   change:'15 workers non-compliant' },
  evacuationReady:    { value:'98%',  label:'Evacuation Ready',  icon:'🚪', status:'normal',   change:'Route A & B clear' },
}


export const presentationSlides = [

  // ── 01 · Title ─────────────────────────────────────────────────────────
  {
    id:0, type:'title',
    title:'MineSafe AI System',
    subtitle:'AI-Driven Mining Safety & Sustainability Command Center',
    institution:'Harbin Institute of Technology, Shenzhen (HITSZ)',
    course:'AI for Sustainable Development',
    year:'2026',
    icon:'⛏️',
    members:['Harta Deddy Irawan','Sashi Kumar','Isabella Gbefa','Shania Clauren','Ahmed'],
  },

  // ── 02 · Team ──────────────────────────────────────────────────────────
  {
    id:1, type:'team',
    title:'Meet the Team',
    subtitle:'AI for Sustainable Development — HITSZ 2026',
    icon:'👥',
    members:[
      { name:'Harta Deddy Irawan', role:'Lead Developer & System Architecture' },
      { name:'Sashi Kumar',        role:'Worker Health & Medical Safety' },
      { name:'Isabella Gbefa',     role:'Sustainability & ESG Framework' },
      { name:'Shania Clauren',     role:'Finance & Business Value' },
      { name:'Ahmed',              role:'Data Analytics & AI/ML' },
    ],
  },

  // ── 03 · Mining Challenge (real sources) ──────────────────────────────
  {
    id:2, type:'content',
    title:'Mining Safety & Sustainability Challenge',
    subtitle:'Why AI is now essential — not optional',
    content:[
      'Mining employs <1% of the global workforce yet contributes a disproportionate share of fatal work accidents (ILO, 2023)',
      'ICMM member companies recorded 36 fatalities in 2023 — mobile equipment and structural failures are leading causes',
      'Globally an estimated 5,000+ miners die each year; small-scale mines are up to 90× more fatal than industrial operations',
      'Environmental incidents cost the sector $6B+ annually in fines, remediation, and reputational damage',
      'Deloitte ranks digital transformation as the #1 mining trend for 2024; ESG disclosure mandatory in 60+ jurisdictions',
    ],
    stat:{ value:'5,000+', label:'Estimated mining fatalities / year (ILO)' },
    icon:'⛏️',
    sources:[
      { label:'ILO — Safety and Health at Work Statistics (ilostat.ilo.org)', url:'https://ilostat.ilo.org/topics/safety-and-health-at-work/', year:'2023' },
      { label:'ICMM — Safety Performance: Benchmarking 2023 Data (icmm.com)', url:'https://www.icmm.com/en-gb/research/health-safety/benchmarking-2023-safety-data', year:'2024' },
      { label:'Deloitte — Tracking the Trends 2024: Mining & Metals (deloitte.com)', url:'https://www.deloitte.com/global/en/industries/mining-metals/perspectives/tracking-the-trends.html', year:'2024' },
    ],
  },

  // ── 04 · Data Collection ───────────────────────────────────────────────
  {
    id:3, type:'content',
    title:'The Data Collection Layer',
    subtitle:'Eyes, ears, and sensors across every square metre of the mine',
    content:[
      '6 autonomous drones: aerial surveillance, slope crack detection, environmental patrol',
      '89 ground sensors: CH₄, CO, H₂S, dust (PM₂.₅/PM₁₀), temperature, humidity, vibration',
      '247 worker wearables: continuous heart rate, SpO₂, body temperature, fatigue score, fall detection',
      'CCTV + computer vision: PPE compliance, unauthorised access, congestion monitoring',
      '8 heavy machines broadcasting GPS, engine telemetry, fuel levels, and proximity alerts in real time',
    ],
    stat:{ value:'347+', label:'Connected safety data points across the site' },
    icon:'📡',
  },

  // ── 05 · AI Agents ────────────────────────────────────────────────────
  {
    id:4, type:'agents',
    title:'AI Agents in the Analytics Layer',
    subtitle:'Five autonomous agents — one unified safety intelligence',
    content:[
      'Yes — this system uses AI Agents: goal-driven programs that perceive, reason, and act without continuous human input',
      'Each agent monitors its domain, generates predictions with confidence scores, and triggers action workflows',
      'Agents collaborate: a gas spike from Agent 1 automatically informs Agent 5 to pre-calculate evacuation routes',
      'Every decision is explainable — the dashboard shows reading, status, confidence %, and recommended action',
      'All 5 agents are live in the dashboard — trigger any simulation scenario to see them respond',
    ],
    stat:{ value:'5', label:'Autonomous AI Agents operating across the mine' },
    icon:'🤖',
    agents:[
      { icon:'🔬', name:'Gas Safety Agent',
        case:'Watches GS-11 CH₄ 8.4 ppm at Zone 8 · Predicts threshold breach within 2 hours · Recommends evacuation + ventilation',
        status:'critical' },
      { icon:'💗', name:'Worker Welfare Agent',
        case:'Flags W004 heat stress (fatigue 78) and W010 fall detected (no movement 90 s) · Dispatches rescue team with GPS routing',
        status:'critical' },
      { icon:'⚙️', name:'Equipment Maintenance Agent',
        case:'EQ08 engine temp 103 °C — 10 h before maintenance due · Predicts failure · Schedules emergency service stop',
        status:'warning' },
      { icon:'🚁', name:'Drone Commander Agent',
        case:'Eagle-2 detects slope crack on Zone B north face (conf. 84 %) · Redirects Eagle-1 for confirmation pass',
        status:'warning' },
      { icon:'🌿', name:'Environmental Compliance Agent',
        case:'Monitors GS-08 PM₂.₅ 58.4 µg/m³ and tailings seepage risk · Auto-notifies regulator on threshold breach',
        status:'normal' },
    ],
    sources:[
      { label:'AI Agent App — Transforming Mining with AI Agents (aiagent.app)', url:'https://aiagent.app/usecases/ai-agents-for-mining', year:'2024' },
      { label:'GlobalData via MINE Magazine — 2,080 Autonomous Trucks; 80 % fewer accidents (mine.nridigital.com)', url:'https://mine.nridigital.com/mine_oct24/impact-ai-mining-sector', year:'2024' },
    ],
  },

  // ── 06 · Command Center Overview (live dashboard) ─────────────────────
  {
    id:5, type:'dashboard',
    title:'Command Center Overview',
    subtitle:'Every alert. Every worker. Every risk. One screen.',
    content:[
      'AI-generated aerial mine map with live overlays — drones, workers, risk zones, sensor readings',
      'Triaged alert panel: AI assigns severity, zone, and recommended action in < 1 second',
      '8 real-time KPIs: workers, drones, sensors, critical alerts, risk score, fatigue, PPE, evacuation',
      'Scenario simulation: trigger Gas Leak, Heat Stress, Slope Crack, Vehicle Proximity, or Sustainability Risk',
    ],
    stat:{ value:'< 30s', label:'Alert-to-response latency' },
    icon:'🖥️',
    route:'/overview', routeLabel:'Open Command Center',
  },

  // ── 07 · Drone Monitoring (live dashboard) ────────────────────────────
  {
    id:6, type:'dashboard',
    title:'Drone Monitoring',
    subtitle:'Aerial surveillance and slope crack detection in real time',
    content:[
      '6 autonomous drones (Eagle-1 to Eagle-6) with live telemetry: battery, altitude, speed, zone',
      'Eagle-2 currently monitoring north slope crack — confidence 84%, second drone dispatched for confirmation',
      'Thermal imaging for hotspot and gas cloud detection across all pit faces',
      'AI path planning optimises coverage across all 9 operational zones simultaneously',
    ],
    stat:{ value:'6', label:'Drones active in flight' },
    icon:'🚁',
    route:'/drone-monitoring', routeLabel:'Open Drone Monitoring',
  },

  // ── 08 · Ground Sensors (live dashboard) ──────────────────────────────
  {
    id:7, type:'dashboard',
    title:'Ground Sensor Network',
    subtitle:'89 sensors — gas, dust, temperature, vibration across 9 zones',
    content:[
      '89 sensors monitoring CH₄, CO, H₂S, SO₂, PM₂.₅, PM₁₀, temperature, humidity, and vibration',
      'GS-11: CH₄ 8.4 ppm at Fuel Zone 8 — AI predicts threshold breach within 2 hours',
      'GS-08: PM₂.₅ 58.4 µg/m³ — approaching environmental regulatory limit',
      'Zone-level heatmap with live readings; configurable alert thresholds per sensor type',
    ],
    stat:{ value:'89', label:'Ground sensors online' },
    icon:'📡',
    route:'/ground-sensors', routeLabel:'Open Ground Sensors',
  },

  // ── 09 · Worker Health (live dashboard) ───────────────────────────────
  {
    id:8, type:'dashboard',
    title:'Worker Health & Safety',
    subtitle:'247 wearables · every worker monitored continuously',
    content:[
      '247 workers monitored across 9 zones: heart rate, SpO₂, body temp, fatigue score, fall detection',
      'W004: heat stress risk — fatigue 78, HR 128 bpm; intervention recommended within 15 minutes',
      'W010: fall detected — no movement for 90 seconds; rescue team dispatched with live GPS routing',
      '47 consecutive incident-free days — best performance in this site\'s recorded history',
    ],
    stat:{ value:'247', label:'Workers monitored in real time' },
    icon:'❤️',
    route:'/worker-health', routeLabel:'Open Worker Health',
  },

  // ── 10 · Equipment Safety (live dashboard) ────────────────────────────
  {
    id:9, type:'dashboard',
    title:'Equipment Safety',
    subtitle:'8 heavy machines — predictive maintenance active',
    content:[
      '8 machines: ZX870 excavators, HD785 haul trucks, A60H articulated dumpers tracked 24/7',
      'EQ08: engine temp 103 °C — critical alert; failure predicted within 10 hours without intervention',
      'Predictive maintenance ML models forecast failures 24–72 hours ahead using engine and vibration data',
      'Proximity alerts warn operators when vehicles approach worker exclusion zones',
    ],
    stat:{ value:'8', label:'Heavy machines monitored' },
    icon:'⚙️',
    route:'/equipment-safety', routeLabel:'Open Equipment Safety',
  },

  // ── 11 · Fleet Management (live dashboard) ────────────────────────────
  {
    id:10, type:'dashboard',
    title:'Fleet Management',
    subtitle:'Real-time vehicle tracking and route optimisation',
    content:[
      'Live GPS tracking of all vehicles: position, speed, heading, and zone assignment',
      'Operator licence and safety training compliance — expiry alerts sent 90 days in advance',
      'AI-optimised haul routes reduce fuel consumption by 12% and cut idle time by 18%',
      'Proximity alert system: vehicle-to-vehicle and vehicle-to-worker collision prevention',
    ],
    stat:{ value:'12%', label:'Fuel savings via AI route optimisation' },
    icon:'🚛',
    route:'/fleet-management', routeLabel:'Open Fleet Management',
  },

  // ── 12 · AI Prediction Engine (live dashboard) ────────────────────────
  {
    id:11, type:'dashboard',
    title:'AI Prediction Engine',
    subtitle:'Detect risk before it becomes an incident',
    content:[
      'ML models for gas accumulation, equipment failure, worker fatigue, and slope stability',
      'Each prediction shows confidence score, time-to-event, and top contributing sensor factors',
      'Explainable AI: every recommendation includes the reasoning chain — no black box decisions',
      'Models retrain continuously from live data; accuracy tracked per model over time',
    ],
    stat:{ value:'89%', label:'Maximum prediction confidence (Gas Safety Model)' },
    icon:'🧠',
    route:'/ai-prediction', routeLabel:'Open AI Prediction Engine',
  },

  // ── 13 · Incident Response (live dashboard) ───────────────────────────
  {
    id:12, type:'dashboard',
    title:'Incident & Environmental Response',
    subtitle:'From detection to resolution in minutes',
    content:[
      'Automated incident workflow: Alert → Verify → Assign → Escalate → Resolve → Review',
      'AI evacuation route planner: calculates safest path in real time based on active hazards',
      'Rescue team dispatch: GPS-tracked responders reach any zone within 8 minutes',
      'Full audit trail — every AI decision logged with timestamp for post-incident compliance review',
    ],
    stat:{ value:'< 8 min', label:'Rescue team response time' },
    icon:'🚨',
    route:'/incident-response', routeLabel:'Open Incident Response',
  },

  // ── 14 · Sustainability (live dashboard) ──────────────────────────────
  {
    id:13, type:'dashboard',
    title:'Sustainability Intelligence',
    subtitle:'AI safety systems are sustainability systems',
    content:[
      'Carbon intensity 18.4 kg CO₂e/t — down 4.2% YoY via AI route and process optimisation',
      'Water recycling 76% — AI identifies processing bottlenecks pushing toward 85% target',
      'Land rehabilitation 64% complete — drone monitoring tracks revegetation progress weekly',
      'SDG 3, 8, 9, 12, 13, 15 and 16 actively tracked; ESG readiness score 87%',
    ],
    stat:{ value:'87%', label:'ESG Compliance Readiness Score' },
    icon:'🌿',
    route:'/sustainability', routeLabel:'Open Sustainability Dashboard',
  },

  // ── 15 · Business Value ────────────────────────────────────────────────
  {
    id:14, type:'content',
    title:'Business Value Summary',
    subtitle:'Safer workers. Lower impact. Better governance.',
    content:[
      '34% reduction in safety incidents year-on-year across all monitored zones',
      '12% reduction in fleet fuel consumption via AI-optimised haul routes',
      '280 kWh saved per night via smart ventilation scheduling in underground zones',
      '$2.4M estimated annual savings from predictive maintenance alone',
      'ESG readiness score of 87% — enabling investor-grade sustainability disclosure',
    ],
    stat:{ value:'$2.4M', label:'Estimated annual savings — predictive maintenance' },
    icon:'📊',
  },

  // ── 16 · Thank You ─────────────────────────────────────────────────────
  {
    id:15, type:'thankyou',
    title:'Thank You',
    subtitle:'Harbin Institute of Technology, Shenzhen',
    institution:'HITSZ — AI for Sustainable Development · 2026',
    icon:'🎓',
    members:['Harta Deddy Irawan','Sashi Kumar','Isabella Gbefa','Shania Clauren','Ahmed'],
  },
]
