# MineSafe AI — Architecture & Developer Guide

## What this is

Enterprise dashboard demonstrating AI-driven safety and sustainability monitoring for a mining site. Designed for executive presentations. All data is simulated.

- **Live site:** auto-deploys from GitHub `main` via Cloudflare Workers
- **Repo:** https://github.com/hdyrawan/ai-mining-safety-dashboard
- **Dev:** `npm run dev` → http://localhost:5173

---

## Tech Stack

| Layer | Tool | Version | Why |
|---|---|---|---|
| UI framework | Vue 3 (`<script setup>`) | ^3.5 | Composition API, reactive, lightweight |
| Build | Vite 5 | ^5.4 | Fast HMR, ES module output |
| Routing | Vue Router 4 | ^4.6 | Hash history (required for Cloudflare SPA) |
| Charts | Chart.js 4 | ^4.4 | Via `TrendChart.vue` wrapper |
| Deploy | Cloudflare Workers | wrangler ^4.97 | Free tier static hosting with SPA support |
| Language | JavaScript only | — | No TypeScript by design |

**No backend. No API keys. No external paid services. All data lives in `mockData.js`.**

---

## Project Structure

```
ai-sustainable-dashboard/
├── public/
│   ├── images/mining/        ← video files (Drone_Eagle1.mp4, Drone_Eagle2.mp4, Drone_Falcon2.mp4)
│   └── _headers              ← Cloudflare cache + security headers
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── variables.css ← ALL CSS custom properties (colors, spacing, shadows)
│   │   │   └── base.css      ← reset, layout shell, utility classes, responsive rules
│   │   └── main.css          ← global shared component styles
│   ├── components/           ← 24 reusable components
│   ├── data/
│   │   └── mockData.js       ← single source of truth for ALL mock data
│   ├── router/
│   │   └── index.js          ← 10 routes, hash history
│   ├── store/
│   │   └── scenarios.js      ← reactive store: alerts, scenario simulation, sidebar toggle
│   ├── views/                ← 10 page views
│   ├── App.vue               ← root: sidebar + header + router-view layout
│   └── main.js               ← Vue app mount
├── .claude/
│   └── commands/
│       └── f.md              ← /f skill: build → commit → push
├── docs/
│   └── ARCHITECTURE.md       ← this file
├── wrangler.toml             ← Cloudflare Workers config
├── CLAUDE.md                 ← Claude Code instructions
└── package.json
```

---

## Routes

| Path | View | Description |
|---|---|---|
| `/overview` | OverviewView.vue | Command center: KPIs, mine map, live alerts, scenario sim |
| `/drone-monitoring` | DroneMonitoringView.vue | Drone fleet, live video feed panel, hazard cameras |
| `/ground-sensors` | GroundSensorsView.vue | Environmental and structural sensor network |
| `/worker-health` | WorkerHealthView.vue | Wearable health monitoring + worker detail drawer |
| `/equipment-safety` | EquipmentSafetyView.vue | Equipment health and maintenance tracking |
| `/fleet-management` | FleetManagementView.vue | Vehicle fleet, driver safety, route compliance |
| `/ai-prediction` | AiPredictionView.vue | AI risk predictions, scenario forecasts |
| `/incident-response` | IncidentResponseView.vue | Incident timeline, response playbooks |
| `/sustainability` | SustainabilityView.vue | ESG scores, SDG alignment, environmental risk map |
| `/presentation` | PresentationView.vue | Fullscreen exec presentation (no sidebar/header) |

All routes use **hash history** (`#/overview`) so Cloudflare Workers SPA routing works without a `_redirects` file.

---

## Data Flow

```
mockData.js
    │
    ├── exported as named consts: workers, drones, alerts, sensors, fleetVehicles, ...
    │
    └── imported only in views (never in leaf components)
            │
            └── passed down as props → components
                    │
                    └── components render via props, never import mockData directly
```

**Rule:** All mock data changes go in `mockData.js` only. Components are data-agnostic.

Exception: `MineMap.vue` and layout components may import zone data directly.

---

## Component Inventory

| Component | Purpose |
|---|---|
| `AppHeader` | Top bar: title, theme toggle, alert count, hamburger (mobile) |
| `Navigation` | Left sidebar: nav links + scenario simulation buttons |
| `KpiCard` | Metric card with value, icon, status color, optional trend |
| `StatusBadge` | Colored pill for status values — always use this, never inline spans |
| `AlertPanel` | Live alert feed with severity filters |
| `MineMap` | SVG zone map with interactive highlights and overlays |
| `TrendChart` | Chart.js wrapper — always use this, never instantiate Chart directly |
| `RiskGauge` | Arc gauge for risk scores |
| `MiniTrend` | Inline sparkline for KPI cards |
| `MetricDetailDrawer` | Right-side drawer for KPI card deep-dive |
| `DroneCard` | Drone fleet card (clickable → opens live feed panel) |
| `DroneLiveFeedPanel` | Video feed panel with HUD overlay and telemetry |
| `SensorGrid` | Ground sensor readings grid |
| `WorkerHealthTable` | Sortable/filterable worker table (clickable rows → opens drawer) |
| `WorkerHealthDrawer` | Worker detail drawer: profile, vitals, fatigue, PPE, AI explanation |
| `EquipmentCard` | Equipment health card |
| `PredictionCard` | AI prediction scenario card |
| `IncidentTimeline` | Chronological incident log |
| `SustainabilityScorecard` | ESG score breakdown |
| `SdgAlignmentPanel` | UN SDG alignment visualization |
| `EnvironmentalRiskMap` | Environmental zone risk map |
| `EsgReadinessPanel` | ESG readiness assessment panel |
| `PresentationMode` | Fullscreen slide deck wrapper |

---

## Design System

All colors are CSS custom properties in `variables.css`. **Never hardcode colors in components.**

### Color Tokens

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#0b0e1a` | Page background |
| `--bg-card` | `#192030` | Card background |
| `--bg-secondary` | `#141929` | Secondary bg, section backgrounds |
| `--accent-blue` | `#3b82f6` | Primary accent, active nav, links |
| `--accent-cyan` | `#06b6d4` | Zone chips, info accents |
| `--status-ok` | `#22c55e` | Normal / safe / detected |
| `--status-warn` | `#f59e0b` | Warning |
| `--status-crit` | `#ef4444` | Critical / danger |
| `--status-info` | `#3b82f6` | Informational |
| `--sustain-green` | `#10b981` | Sustainability positive |
| `--font-mono` | JetBrains Mono | All numeric values, IDs, codes |

### Status → Color mapping convention

```js
// In components, map status to token like this:
function statusColor(s) {
  if (s === 'critical') return 'var(--status-crit)'
  if (s === 'warning')  return 'var(--status-warn)'
  return 'var(--status-ok)'
}
```

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| > 900px | Fixed left sidebar (220px), full desktop layout |
| ≤ 900px | Sidebar hidden, hamburger slides it in as overlay with backdrop |
| ≤ 600px | Single-column grids, tighter padding, tables scroll horizontally |

Desktop layout is never affected by mobile changes.

---

## Worker Data Structure

Workers in `mockData.js` have flat fields (used by the health table) plus nested extended data (used by `WorkerHealthDrawer`):

```js
{
  // Flat fields — used by WorkerHealthTable
  id: 'W002',
  name: 'Budi Santoso',
  role: 'Haul Truck Operator',
  zone: 'Z1',
  shift: 'Day',
  heartRate: 95,
  temperature: 37.9,
  spo2: 97,
  fatigueScore: 61,
  fallDetected: false,
  immobile: false,
  panicButton: false,
  ppeCompliant: true,
  status: 'warning',       // 'normal' | 'warning' | 'critical'
  lastUpdate: '2 min ago',
  lat: 16, lng: 27,        // map position

  // Extended fields — used by WorkerHealthDrawer
  profile: {
    supervisor: 'Rina Mahendra',
    shiftStart: '06:00',
    timeOnShift: '5h 42m',
    lastCheckpoint: 'Gate Z1-B'
  },
  baseline: {
    bloodType: 'O+',
    restingHeartRate: 72,
    normalBloodPressure: '118/76',
    baselineTemp: '36.6°C',
    baselineSpo2: '98%',
    fitForDuty: 'Cleared',
    medicalRiskFlag: 'Heat sensitivity'   // 'None recorded' | 'Heat sensitivity' | 'Requires monitoring'
  },
  vitals: {
    bloodPressure: '132/84',
    glucose: '118 mg/dL',
    hydration: 'Good' | 'Moderate' | 'Low',
    heatStressIndex: 'Normal' | 'Moderate' | 'Elevated' | 'Critical',
    activity: 'Low' | 'Moderate' | 'High'
  },
  fatigueProfile: {
    sleepDuration: '5h 20m',
    sleepQuality: 'Good' | 'Fair' | 'Poor',
    lastBreak: '5h 30m ago',
    workload: 'Light' | 'Moderate' | 'High' | 'Very High',
    steps: 8420,
    recommendation: 'AI-generated text recommendation'
  },
  ppeDetail: {
    helmet: 'Detected' | 'NOT DETECTED',
    vest: 'Detected' | 'NOT DETECTED',
    respirator: 'Detected' | 'Not required' | 'NOT DETECTED',
    boots: 'Detected' | 'NOT DETECTED',
    fallDetection: 'No fall detected' | 'FALL DETECTED — ...' | 'Immobility alert — ...',
    restrictedZone: 'Clear' | 'BREACH',
    lastScan: '1 min ago',
    lastBeacon: 'Gate Z1-B'
  },
  aiExplanation: {
    confidence: 82,             // 0–100
    factors: ['string', ...],   // contributing risk factors
    recommendedActions: ['string', ...]
  }
}
```

---

## Scenario Simulation

Five scenario buttons in the sidebar inject simulated alerts into the reactive store.

| Scenario | Trigger method | Zone |
|---|---|---|
| Gas Leak | `store.triggerGasLeak()` | Z2 |
| Heat Stress | `store.triggerHeatStress()` | Z1 |
| Slope Crack | `store.triggerSlopeCrack()` | Z2 |
| Vehicle Proximity | `store.triggerVehicleProximity()` | Z1 |
| Sustainability Risk | `store.triggerSustainRisk()` | Z5 |

Simulated alerts have `simulated: true` and are shown with a `SIM` badge. `store.resetScenario()` clears them.

The store is reactive (`reactive()` from Vue) and imported directly in components that need alert state.

---

## Deployment Workflow

```
Edit code locally
    ↓
npm run dev          (Vite dev server, HMR)
    ↓
git push origin main
    ↓
Cloudflare auto-deploys from GitHub main branch
    ↓
Live at Cloudflare Workers URL
```

### Manual deploy (requires CLOUDFLARE_API_TOKEN)

```bash
export CLOUDFLARE_API_TOKEN=your_token
npm run deploy:build   # builds then deploys via wrangler
```

### Key Cloudflare config

- `wrangler.toml` — project name, compatibility date, assets directory
- `not_found_handling = "single-page-application"` — handles `#`-less direct URL access
- `public/_headers` — cache headers for hashed assets + security headers
- **Do NOT add `_redirects`** — causes infinite loop in Workers

### Local Tailscale access

```bash
node node_modules/.bin/vite --port 5173 --host
# → http://100.106.231.89:5173
```

---

## Key Conventions

| Rule | Reason |
|---|---|
| All mock data in `mockData.js` only | Single source of truth, easy to update |
| Components receive data via props | Keeps components reusable and testable |
| Use `StatusBadge` for all status indicators | Consistent styling, never inline colored spans |
| Use `TrendChart` for all charts | Avoids direct Chart.js instantiation, consistent config |
| Scoped `<style>` in every component | No global style leaks |
| All colors via CSS custom properties | Theme consistency, never hardcode hex values |
| No TypeScript | Project design decision — keep it plain Vue 3 |
| No Vuex / Pinia | Only one reactive store (`scenarios.js`) needed |
| Hash history routing | Required for Cloudflare Workers SPA deploy |

---

## Common Tasks

### Add a new worker field
1. Add field to each worker object in `mockData.js`
2. Use it in `WorkerHealthDrawer.vue` or `WorkerHealthTable.vue` as needed

### Add a new page
1. Create `src/views/NewView.vue`
2. Add route to `src/router/index.js`
3. Add nav item to `src/components/Navigation.vue` `navItems` array

### Add a new chart
Use `TrendChart`:
```vue
<TrendChart
  title="My Chart"
  :labels="['Jan','Feb','Mar']"
  :series="[{ name:'Value', color:'#3b82f6', values:[10,20,15] }]"
  type="line"
  :height="200"
/>
```

### Change the color theme
Edit `src/assets/styles/variables.css` — all CSS custom properties cascade everywhere.

### Quick ship with /f
The `/f` skill handles build → commit → push in one command.
