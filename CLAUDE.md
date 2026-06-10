# CLAUDE.md — AI Mining Safety & Sustainability Command Center

## Project overview
Enterprise dashboard demonstrating AI-driven safety and sustainability monitoring for a mining site. Built for executive presentations. Dark command center aesthetic.

- **GitHub:** https://github.com/hdyrawan/ai-mining-safety-dashboard (public)
- **Deployed:** Cloudflare Workers (auto-deploys from GitHub main branch)
- **Dev server:** `npm run dev` → http://localhost:5173
  - To expose via Tailscale: `node node_modules/.bin/vite --port 5173 --host`
  - Tailscale IP of this machine: 100.106.231.89 → http://100.106.231.89:5173

## Tech stack
- Vue 3 (`<script setup>` Composition API) — JavaScript only, no TypeScript
- Vite 5 — build tool
- Vue Router 4 — **hash history** (`createWebHashHistory`) — required for Cloudflare Workers static deploy
- Chart.js 4 — charts via `TrendChart.vue` wrapper
- No backend, no API keys, no external paid services
- All data in `src/data/mockData.js`
- Reactive scenario store in `src/store/scenarios.js`

## Project structure
```
src/
├── assets/styles/
│   ├── variables.css   ← all CSS custom properties (colours, spacing, shadows)
│   └── base.css        ← reset, layout shell, utility classes, responsive rules
├── assets/main.css     ← global component-level shared styles
├── components/         ← 26 reusable components (see list below)
├── data/mockData.js    ← single source of truth for ALL mock data
├── router/index.js     ← 11 routes
├── store/scenarios.js  ← reactive store: alerts, scenario sim, sidebar toggle
└── views/              ← 11 page views

.claude/
└── commands/
    └── f.md            ← /f skill: build → commit → push

docs/
└── ARCHITECTURE.md     ← full framework, data structure, deployment docs
```

## Routes
| Path | View file |
|------|-----------|
| /overview | OverviewView.vue |
| /drone-monitoring | DroneMonitoringView.vue |
| /ground-sensors | GroundSensorsView.vue |
| /worker-health | WorkerHealthView.vue |
| /equipment-safety | EquipmentSafetyView.vue |
| /fleet-management | FleetManagementView.vue |
| /ai-prediction | AiPredictionView.vue |
| /incident-response | IncidentResponseView.vue |
| /sustainability | SustainabilityView.vue |
| /noise-exposure | NoiseExposureView.vue |
| /presentation | PresentationView.vue (fullscreen, no sidebar/header) |

## Components
AppHeader, Navigation, KpiCard, StatusBadge, AlertPanel, MineMap, TrendChart, RiskGauge, MiniTrend, MetricDetailDrawer, DroneCard, DroneLiveFeedPanel, SensorGrid, WorkerHealthTable, WorkerHealthDrawer, EquipmentCard, PredictionCard, IncidentTimeline, SustainabilityScorecard, SdgAlignmentPanel, EnvironmentalRiskMap, EsgReadinessPanel, PresentationMode, NoiseExposureDrawer

## Design system
All colours are CSS custom properties in `variables.css`. Never hardcode colours in components.

| Token | Value | Use |
|-------|-------|-----|
| `--bg-base` | #0b0e1a | Page background |
| `--bg-card` | #192030 | Card background |
| `--bg-secondary` | #141929 | Secondary bg, section fills |
| `--accent-blue` | #3b82f6 | Primary accent, active nav |
| `--accent-cyan` | #06b6d4 | Zone chips, info accents |
| `--status-ok` | #22c55e | Normal / safe |
| `--status-warn` | #f59e0b | Warning |
| `--status-crit` | #ef4444 | Critical / danger |
| `--status-info` | #3b82f6 | Info |
| `--sustain-green` | #10b981 | Sustainability positive |
| `--font-mono` | JetBrains Mono | All numeric values |

## Responsive behaviour
- **> 900px** — fixed left sidebar (220px), full desktop layout
- **≤ 900px** — sidebar hidden, hamburger button in header slides it in as overlay with backdrop
- **≤ 600px** — single-column grids, tighter padding, tables scroll horizontally
- Desktop layout is never affected by mobile changes

## Worker data structure
Workers have flat fields (table display) plus extended nested objects (drawer detail). Always extend both when adding new worker data.

```js
{
  // Flat — WorkerHealthTable uses these
  id, name, role, zone, shift, heartRate, temperature, spo2, fatigueScore,
  fallDetected, immobile, panicButton, ppeCompliant, status, lastUpdate, lat, lng,

  // Extended — WorkerHealthDrawer uses these
  profile:       { supervisor, shiftStart, timeOnShift, lastCheckpoint },
  baseline:      { bloodType, restingHeartRate, normalBloodPressure, baselineTemp, baselineSpo2, fitForDuty, medicalRiskFlag },
  vitals:        { bloodPressure, glucose, hydration, heatStressIndex, activity },
  fatigueProfile:{ sleepDuration, sleepQuality, lastBreak, workload, steps, recommendation },
  ppeDetail:     { helmet, vest, respirator, boots, fallDetection, restrictedZone, lastScan, lastBeacon },
  aiExplanation: { confidence, factors: [], recommendedActions: [] }
}
```

## Noise Exposure module (added 2026-06-10)
Route `/noise-exposure` → `NoiseExposureView.vue`. Drawer: `NoiseExposureDrawer.vue`.

**mockData.js exports for this module:**
| Export | Purpose |
|--------|---------|
| `noiseKpis` | 4 KPI cards (avg exposure, above action level, peak events, PPE compliance) |
| `zoneNoiseLevels` | 5 zones with dBA, status, worker count, trend, note |
| `workerNoiseExposure` | 6 workers — flat fields + timeline[], peakEvents[], aiExplanation |
| `noiseAnomalies` | 3 AI-detected anomalies (asset, zoneId, confidence, recommendedAction) |
| `noiseRecommendedControls` | 4 hierarchy-of-controls levels (Engineering/Admin/PPE/Monitoring) |
| `noiseComplianceEvidence` | Counts for compliance card + standard label |

**Worker noise data shape:**
```js
{
  id, name, zone, zoneId,       // zoneId links to zoneNoiseLevels and noiseAnomalies
  twa8h, peakDb, dailyDose,     // core exposure numbers
  ppeStatus, status, recommendation,
  timeline: [{ time, dba, event }],
  peakEvents: [{ time, db, cause }],
  aiExplanation,                // plain text string shown in drawer XAI panel
}
```

**Interactions:**
- Clicking "Workers Above Action Level" or "Peak Events Today" KPI → filters worker table
- Clicking worker row → opens `NoiseExposureDrawer` with timeline bars, dose bar, peak events, AI explanation
- Clicking an anomaly card → highlights linked zone in heatmap (cyan border) via `zoneId` match

**Presentation slide:** slide 15 (between Sustainability and Business Value), `type:'dashboard'`, `route:'/noise-exposure'`

## Cloudflare Workers deployment
- `wrangler.toml` at project root
- Deploy command: `npx wrangler deploy` (requires `CLOUDFLARE_API_TOKEN` env var)
- Auto-deploys via Cloudflare git integration on push to `main`
- `public/_headers` — cache headers for hashed assets + security headers
- `not_found_handling = "single-page-application"` in wrangler.toml handles SPA routing
- **Do NOT add a `_redirects` file with `/* /index.html 200`** — causes infinite loop in Workers
- Node version: 22 (`.node-version` file)

## Scenario simulation
Five buttons in the sidebar inject simulated alerts:
- Gas Leak, Heat Stress, Slope Crack, Vehicle Proximity, Sustainability Risk
- State lives in `store/scenarios.js` → `store.triggerXxx()` / `store.resetScenario()`
- Simulated alerts have `simulated: true` flag and are shown with a "SIM" badge

## Key conventions
- All mock data changes go in `src/data/mockData.js` only — never inline data in components
- Components receive data via props, never import mockData directly (except layout/map components)
- Use `StatusBadge` for all status indicators — never inline coloured spans
- Use `TrendChart` for all Chart.js charts — never instantiate Chart directly in views
- Scoped `<style>` in every component — no global style leaks
- No TypeScript, no Vuex/Pinia — keep it plain Vue 3 reactive

## Git commit rules (enforced)
- **One short line only** — no body, no bullet points
- **No Co-Authored-By or Anthropic email** — ever
- **No sensitive information** — no tokens, keys, credentials
- Use `/f` skill to build + commit + push in one step

## Common tasks

### Quick ship
Use the `/f` skill — it builds, commits with an auto-generated short message, and pushes to GitHub.

### Add a new mock data field
Edit `src/data/mockData.js`, update the relevant component prop usage.

### Add a new page
1. Create `src/views/NewView.vue`
2. Add route to `src/router/index.js`
3. Add nav item to `src/components/Navigation.vue` `navItems` array

### Change the colour theme
Edit `src/assets/styles/variables.css` — all CSS custom properties cascade everywhere.

### Run build locally
```bash
npm run build        # outputs to dist/
npm run preview      # serve dist/ locally
```

### Deploy manually (needs Cloudflare API token)
```bash
export CLOUDFLARE_API_TOKEN=your_token_here
npm run deploy:build   # builds then deploys
```

### Full architecture reference
See `docs/ARCHITECTURE.md` for complete framework docs, data flow diagrams, component inventory, and deployment workflow.
