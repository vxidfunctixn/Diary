<script setup lang="ts">
import WindowTitleBar from '@/components/window-title-bar.vue'
import AppThemeProvider from '@/components/app-theme-provider.vue'
import { useDiaryStore, VIEW } from './diaryStore'
import { storeToRefs } from 'pinia'

import Cockpit from '@/views/cockpit.vue'
import Lock from '@/views/lock.vue'
import Settings from '@/views/settings.vue'
import NoteList from '@/views/note-list.vue'
import EditNote from '@/views/edit-note.vue'

const diaryStore = useDiaryStore()
const { app } = storeToRefs(diaryStore)
</script>

<template>
  <AppThemeProvider>
    <WindowTitleBar/>
    <div id="modal"></div>
    <div class="app-wrapper">
      <Cockpit v-if="app.view === VIEW.HOME"/>
      <Lock v-if="app.view === VIEW.LOCK"/>
      <Settings v-if="app.view === VIEW.SETTINGS"/>
      <NoteList v-if="app.view === VIEW.NOTE_LIST"/>
      <EditNote v-if="app.view === VIEW.EDIT_NOTE"/>
    </div>
  </AppThemeProvider>
</template>

<style lang="scss">
:root {
  --FF1: Saira; //Font family
  --FF2: RedditMono;
  --FS1: 8px; // Font size
  --FS2: 12px;
  --FS3: 14px;
  --FS4: 16px;
  --CW: 830px; // Container width

  font-family: var(--FF1);
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
  font-family: var(--FF1);
}
</style>
