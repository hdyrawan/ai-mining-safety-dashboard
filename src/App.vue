<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import Navigation from './components/Navigation.vue'
import { store } from './store/scenarios.js'

const route = useRoute()
const router = useRouter()
const isFullscreen = computed(() => route.meta?.fullscreen === true)
// Hide chrome when rendered inside a presentation iframe
const isEmbedded = computed(() => { try { return window.self !== window.top } catch { return true } })

// Sync theme to <html> so CSS variables cascade correctly
watchEffect(() => {
  document.documentElement.setAttribute('data-theme', store.theme)
})

// Close sidebar on route change (mobile nav)
router.afterEach(() => store.closeSidebar())
</script>

<template>
  <div class="app-shell">
    <!-- Embedded in iframe: content only, no header/sidebar -->
    <template v-if="isEmbedded">
      <main class="embedded-shell">
        <router-view />
      </main>
    </template>
    <!-- Fullscreen (presentation view) -->
    <template v-else-if="isFullscreen">
      <router-view />
    </template>
    <!-- Normal desktop/mobile layout -->
    <template v-else>
      <AppHeader />
      <div class="app-body">
        <Navigation />
        <transition name="backdrop-fade">
          <div v-if="store.sidebarOpen" class="mobile-backdrop" @click="store.closeSidebar()"></div>
        </transition>
        <main class="page-content">
          <router-view />
        </main>
      </div>
    </template>
  </div>
</template>

<style>
/* Embedded iframe shell — full viewport, no offsets */
.embedded-shell {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background: var(--bg-base);
  padding: 20px 24px 32px;
  box-sizing: border-box;
}

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
