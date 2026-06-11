import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/',                    redirect: '/overview' },
  { path: '/overview',            component: () => import('../views/OverviewView.vue'),           meta:{ title:'Command Center Overview' } },
  { path: '/drone-monitoring',    component: () => import('../views/DroneMonitoringView.vue'),    meta:{ title:'Drone Monitoring' } },
  { path: '/ground-sensors',      component: () => import('../views/GroundSensorsView.vue'),      meta:{ title:'Ground Sensors' } },
  { path: '/worker-health',       component: () => import('../views/WorkerHealthView.vue'),       meta:{ title:'Worker Health' } },
  { path: '/equipment-safety',    component: () => import('../views/EquipmentSafetyView.vue'),   meta:{ title:'Equipment Safety' } },
  { path: '/fleet-management',    component: () => import('../views/FleetManagementView.vue'),   meta:{ title:'Fleet Management' } },
  { path: '/ai-prediction',       component: () => import('../views/AiPredictionView.vue'),      meta:{ title:'AI Prediction Engine' } },
  { path: '/incident-response',   component: () => import('../views/IncidentResponseView.vue'),  meta:{ title:'Incident Response' } },
  { path: '/sustainability',      component: () => import('../views/SustainabilityView.vue'),    meta:{ title:'Sustainability Intelligence' } },
  { path: '/noise-exposure',      component: () => import('../views/NoiseExposureView.vue'),     meta:{ title:'Noise Exposure Intelligence' } },
  { path: '/data-architecture',   component: () => import('../views/DataArchitectureView.vue'),  meta:{ title:'Data Architecture' } },
  { path: '/presentation',        component: () => import('../views/PresentationView.vue'),      meta:{ title:'Presentation Mode', fullscreen: true } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — AI Mining Safety`
    : 'MineSafe AI System'
})

export default router
