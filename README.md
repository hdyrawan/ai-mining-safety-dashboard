# AI Mining Safety & Sustainability Command Center

A professional enterprise command center dashboard demonstrating how AI integrates multiple data sources to improve mining safety and sustainability outcomes.

Built with **Vue 3 + Vite** — fully static, no backend required.

---

## Features

- **Real-time mine site overview** with interactive SVG map showing zones, drones, sensors, workers
- **9 dashboard pages** with comprehensive mock data
- **AI prediction engine** with confidence scores and explainable AI
- **Sustainability Intelligence** — SDG alignment, ESG readiness, carbon/water/dust tracking
- **Presentation Mode** — 8-slide full-screen executive presentation
- **Scenario simulation** — trigger gas leak, heat stress, slope crack, vehicle proximity, sustainability risk
- **Dark enterprise command center theme** optimised for 1366×768 and 1920×1080

## Pages / Routes

| Route | Description |
|-------|-------------|
| `/overview` | Main command center — KPIs, mine map, alerts, AI predictions |
| `/drone-monitoring` | Drone fleet status, patrol routes, AI hazard detections |
| `/ground-sensors` | Gas, dust, temperature, humidity sensor network |
| `/worker-health` | Wearable health monitoring — HR, Temp, SpO₂, Fatigue |
| `/equipment-safety` | Heavy equipment telemetry, predictive maintenance |
| `/ai-prediction` | 24h risk forecast, explainable AI, prediction confidence |
| `/incident-response` | Incident workflow, evacuation routes, communication log |
| `/sustainability` | Sustainability scorecard, SDGs, ESG, environmental risk map |
| `/presentation` | Full-screen executive presentation mode |

---

## Local Development

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+

### Run locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for production

```bash
npm run build
# Output in: dist/
```

### Preview production build

```bash
npm run preview
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Build tool | Vite 5 |
| Routing | Vue Router 4 (hash history — Cloudflare Pages compatible) |
| Charts | Chart.js 4 |
| Language | JavaScript (no TypeScript) |
| Data | Static mock data (`src/data/mockData.js`) |
| State | Vue Reactive store (`src/store/scenarios.js`) |
| Styling | CSS custom properties + scoped component styles |
| Deployment | Static site (no backend, no API keys) |

---

## Cloudflare Pages Deployment

| Setting | Value |
|---------|-------|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node.js version | 20 (or latest LTS) |

> **Note:** Vue Router uses **hash history** (`createWebHashHistory`), which requires no server-side configuration. All routes work on Cloudflare Pages out of the box.

### Deploy steps

1. Push to GitHub (instructions below)
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → Create application → Connect to Git
3. Select your repository
4. Set build settings as above
5. Deploy

---

## GitHub Setup

```bash
# Initialize git (if not already done)
git init

# Stage all files
git add .

# Initial commit
git commit -m "Initial AI mining safety and sustainability dashboard"

# Rename to main branch
git branch -M main

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-mining-safety-dashboard.git

# Push
git push -u origin main
```

---

## Project Structure

```
src/
├── assets/
│   ├── styles/
│   │   ├── variables.css     # CSS custom properties (colors, spacing)
│   │   └── base.css          # Reset, layout, utility classes
│   └── main.css              # Global component styles
├── components/
│   ├── AppHeader.vue          # Fixed top header with live stats
│   ├── Navigation.vue         # Fixed left sidebar + scenario buttons
│   ├── KpiCard.vue            # KPI metric card
│   ├── StatusBadge.vue        # Status indicator badge
│   ├── AlertPanel.vue         # Alert list with acknowledge
│   ├── MineMap.vue            # SVG mine site map
│   ├── TrendChart.vue         # Chart.js line/bar chart wrapper
│   ├── RiskGauge.vue          # SVG arc gauge
│   ├── DroneCard.vue          # Drone fleet status card
│   ├── SensorGrid.vue         # Gas sensor grid
│   ├── WorkerHealthTable.vue  # Worker health data table
│   ├── EquipmentCard.vue      # Equipment telemetry card
│   ├── PredictionCard.vue     # AI prediction with XAI expand
│   ├── IncidentTimeline.vue   # Incident workflow timeline
│   ├── SustainabilityScorecard.vue
│   ├── SdgAlignmentPanel.vue  # SDG cards with detail expand
│   ├── EnvironmentalRiskMap.vue # SVG environmental risk map
│   ├── EsgReadinessPanel.vue  # ESG E/S/G breakdown
│   └── PresentationMode.vue   # Full-screen slide presentation
├── data/
│   └── mockData.js            # All static mock data
├── router/
│   └── index.js               # Vue Router configuration
├── store/
│   └── scenarios.js           # Reactive scenario simulation store
├── views/
│   ├── OverviewView.vue
│   ├── DroneMonitoringView.vue
│   ├── GroundSensorsView.vue
│   ├── WorkerHealthView.vue
│   ├── EquipmentSafetyView.vue
│   ├── AiPredictionView.vue
│   ├── IncidentResponseView.vue
│   ├── SustainabilityView.vue
│   └── PresentationView.vue
├── App.vue
└── main.js
```

---

## Scenario Simulation

The sidebar includes 5 scenario simulation buttons that inject new critical alerts into the system:

| Scenario | Effect |
|----------|--------|
| Gas Leak | Critical methane alert for Zone B |
| Heat Stress | Critical worker health alert |
| Slope Crack | Critical drone detection alert |
| Vehicle Risk | Critical proximity collision alert |
| Sustainability Risk | Tailings seepage environmental alert |

Click **↩ Reset** to clear all simulated alerts.

---

*AI Mining Safety & Sustainability Command Center — Built with Vue 3 + Vite · Static deployment · No backend required*
