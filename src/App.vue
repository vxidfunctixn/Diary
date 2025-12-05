<script setup lang="ts">
import WindowTitleBar from '@/components/layout/window-title-bar.vue'
import AppThemeProvider from '@/components/layout/app-theme-provider.vue'
import { useAppStore } from './stores/appStore'
import { storeToRefs } from 'pinia'
import { VIEW } from '@/stores'

import Cockpit from '@/components/views/dashboard.vue'
import Lock from '@/components/views/lock.vue'
import Settings from '@/components/views/settings.vue'
import NoteList from '@/components/views/note-list.vue'
import EditNote from '@/components/views/edit-note.vue'

const appStore = useAppStore()
const { view } = storeToRefs(appStore)
</script>

<template>
  <AppThemeProvider>
    <WindowTitleBar />
    <div id="modal"></div>
    <div class="app-wrapper">
      <Cockpit v-if="view === VIEW.HOME" />
      <Lock v-if="view === VIEW.LOCK" />
      <Settings v-if="view === VIEW.SETTINGS" />
      <NoteList v-if="view === VIEW.NOTE_LIST" />
      <EditNote v-if="view === VIEW.EDIT_NOTE" />
    </div>
  </AppThemeProvider>
</template>
