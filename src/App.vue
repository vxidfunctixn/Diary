<script setup lang="ts">
import WindowTitleBar from '@/components/layout/window-title-bar.vue'
import AppThemeProvider from '@/components/layout/app-theme-provider.vue'
</script>

<template>
  <AppThemeProvider>
    <WindowTitleBar />
    <div id="modal"></div>
    <!-- Kontener dla modalów teleportowanych -->
    <div class="app-wrapper">
      <router-view />
    </div>
  </AppThemeProvider>
</template>
