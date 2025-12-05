<script setup lang="ts">
import NavItem from '@/components/layout/nav-item.vue'
import { storeToRefs } from 'pinia'
import { useAppStore, useSettingsStore, VIEW } from '@/stores'
import { computed } from 'vue'
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const { view, selected_day } = storeToRefs(appStore)

const noteListDate = computed(() => {
  const date = new Date(selected_day.value)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()
  return `${day}.${month}.${year}`
})
</script>

<template>
  <div class="breadcrumbs">
    <NavItem v-if="view === VIEW.LOCK" :level="1" icon="lock" :title="settingsStore.diary_name" />
    <NavItem v-if="view === VIEW.HOME" :level="1" icon="diary" :title="settingsStore.diary_name" />
    <NavItem
      v-if="view !== VIEW.HOME && view !== VIEW.LOCK"
      :level="1"
      icon="diary"
      :title="settingsStore.diary_name"
      @click="appStore.setView(VIEW.HOME)"
    />

    <NavItem v-if="view === VIEW.SETTINGS" :level="2" icon="settings" title="Ustawienia" />
    <NavItem v-if="view === VIEW.ABOUT" :level="2" icon="info" title="O aplikacji" />
    <NavItem v-if="view === VIEW.MONTH" :level="2" icon="date" title="06.2024" />
    <NavItem v-if="view === VIEW.YEAR" :level="2" icon="date" title="2024" />
    <NavItem v-if="view === VIEW.SEARCH" :level="2" icon="search" title="Szukaj" />
    <NavItem v-if="view === VIEW.NOTE_LIST" :level="2" icon="note-list" :title="noteListDate" />
    <NavItem
      v-if="view === VIEW.EDIT_NOTE"
      :level="2"
      icon="note-list"
      title="21.06.2024"
      @click="appStore.setView(VIEW.NOTE_LIST)"
    />

    <NavItem v-if="view === VIEW.EDIT_NOTE" :level="3" icon="note" title="N2 21:35" />
  </div>
</template>

<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  user-select: none;
  min-width: 0;
  margin-right: auto;
}
</style>
