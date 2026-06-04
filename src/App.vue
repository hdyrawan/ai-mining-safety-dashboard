<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import Navigation from './components/Navigation.vue'

const route = useRoute()
const isFullscreen = computed(() => route.meta?.fullscreen === true)
</script>

<template>
  <div class="app-shell">
    <template v-if="!isFullscreen">
      <AppHeader />
      <div class="app-body">
        <Navigation />
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
