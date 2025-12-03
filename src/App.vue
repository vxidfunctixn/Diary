<script setup lang="ts">
import WindowTitleBar from '@/components/layout/window-title-bar.vue'
import AppThemeProvider from '@/components/layout/app-theme-provider.vue'
import { useDiaryStore, VIEW } from './diaryStore'
import { storeToRefs } from 'pinia'

import Cockpit from '@/components/views/dashboard.vue'
import Lock from '@/components/views/lock.vue'
import Settings from '@/components/views/settings.vue'
import NoteList from '@/components/views/note-list.vue'
import EditNote from '@/components/views/edit-note.vue'

const diaryStore = useDiaryStore()
const { app } = storeToRefs(diaryStore)
</script>

<template>
  <AppThemeProvider>
    <WindowTitleBar />
    <div id="modal"></div>
    <div class="app-wrapper">
      <Cockpit v-if="app.view === VIEW.HOME" />
      <Lock v-if="app.view === VIEW.LOCK" />
      <Settings v-if="app.view === VIEW.SETTINGS" />
      <NoteList v-if="app.view === VIEW.NOTE_LIST" />
      <EditNote v-if="app.view === VIEW.EDIT_NOTE" />
    </div>
  </AppThemeProvider>
</template>
