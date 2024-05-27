<script setup>
import WindowTitleBar from '@/components/window-title-bar.vue'
import AppThemeProvider from '@/components/app-theme-provider.vue'
import { useDiaryStore, VIEW } from './diaryStore'
import { storeToRefs } from 'pinia'

import Cockpit from '@/views/cockpit.vue'
import Lock from '@/views/lock.vue'
import Settings from '@/views/settings.vue'

const diaryStore = useDiaryStore()
const { app } = storeToRefs(diaryStore)
</script>

<template>
  <AppThemeProvider>
    <WindowTitleBar/>
    <div class="app-wrapper">
      <Cockpit v-if="app.view === VIEW.HOME"/>
      <Lock v-if="app.view === VIEW.LOCK"/>
      <Settings v-if="app.view === VIEW.SETTINGS"/>
    </div>
  </AppThemeProvider>
</template>

<style lang="scss">
:root {
  --FS1: 8px;
  --FS2: 12px;
  --FS3: 14px;
  --FS4: 16px;

  font-family: Saira;
  font-size: var(--FS4);
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  overflow: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-wrapper {
  height: calc(100vh - 41px - 2px);
  width: 100%;
  overflow: auto;
}

input, textarea, button {
  font-family: Saira;
}
</style>
