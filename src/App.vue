<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import Navigation from './components/Navigation.vue'
import { store } from './store/scenarios.js'

const route = useRoute()
const router = useRouter()
const isFullscreen = computed(() => route.meta?.fullscreen === true)

// Close sidebar on route change (mobile nav)
router.afterEach(() => store.closeSidebar())
</script>

<template>
  <div class="app-shell">
    <template v-if="!isFullscreen">
      <AppHeader />
      <div class="app-body">
        <Navigation />
        <!-- Mobile backdrop -->
        <transition name="backdrop-fade">
          <div v-if="store.sidebarOpen" class="mobile-backdrop" @click="store.closeSidebar()"></div>
        </transition>
        <main class="page-content">
          <router-view />
        </main>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<style>
.mobile-backdrop {
  display: none;
}
@media (max-width: 900px) {
  .mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 89;
    backdrop-filter: blur(2px);
  }
}
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.25s ease; }
.backdrop-fade-enter-from, .backdrop-fade-leave-to { opacity: 0; }
</style>
