<script setup>
import NavItem from '@/components/nav-item.vue'
import { storeToRefs } from 'pinia'
import { useDiaryStore, VIEW } from '@/diaryStore'
const diaryStore = useDiaryStore()
const { settings, app } = storeToRefs(diaryStore)


</script>

<template>
  <div class="navigation">
    <NavItem v-if="app.view === VIEW.LOCK" :level="1" icon="lock" :title="settings.diary_name"/>
    <NavItem v-if="app.view === VIEW.HOME" :level="1" icon="diary" :title="settings.diary_name"/>
    <NavItem v-if="app.view !== VIEW.HOME && app.view !== VIEW.LOCK" :level="1" icon="diary" :title="settings.diary_name" @click="diaryStore.setView(VIEW.HOME)"/>

    <NavItem v-if="app.view === VIEW.SETTINGS" :level="2" icon="settings" title="Ustawienia"/>
    <NavItem v-if="app.view === VIEW.ABOUT" :level="2" icon="info" title="O aplikacji"/>
    <NavItem v-if="app.view === VIEW.MONTH" :level="2" icon="date" title="06.2024"/>
    <NavItem v-if="app.view === VIEW.YEAR" :level="2" icon="date" title="2024"/>
    <NavItem v-if="app.view === VIEW.SEARCH" :level="2" icon="search" title="Szukaj"/>
    <NavItem v-if="app.view === VIEW.NOTE_LIST" :level="2" icon="note-list" title="21.06.2024"/>
    <NavItem v-if="app.view === VIEW.EDIT_NOTE" :level="2" icon="note-list" title="21.06.2024" @click="diaryStore.setView(VIEW.NOTE_LIST)"/>

    <NavItem v-if="app.view === VIEW.EDIT_NOTE" :level="3" icon="note" title="N2 21:35"/>
  </div>
</template>

<style lang="scss" scoped>
.navigation {
  display: flex;
  user-select: none;
  min-width: 0;
  margin-right: auto;
}
</style>