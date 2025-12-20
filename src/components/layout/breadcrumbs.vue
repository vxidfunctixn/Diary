<script setup lang="ts">
import NavItem from '@/components/layout/nav-item.vue'
import { storeToRefs } from 'pinia'
import { useAppStore, useSettingsStore } from '@/stores'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const { selected_day } = storeToRefs(appStore)
const view = computed(() => router.currentRoute.value.name)

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
    <NavItem v-if="view === 'lock'" :level="1" icon="lock" :title="settingsStore.diary_name" />
    <NavItem v-if="view === 'home'" :level="1" icon="diary" :title="settingsStore.diary_name" />
    <NavItem
      v-if="view !== 'home' && view !== 'lock'"
      :level="1"
      icon="diary"
      :title="settingsStore.diary_name"
      @click="router.push({ name: 'home' })"
    />

    <NavItem
      v-if="view === 'settings'"
      :level="2"
      icon="settings"
      :title="t('views.settings.title')"
    />
    <NavItem v-if="view === 'about'" :level="2" icon="info" :title="t('views.about.title')" />
    <NavItem v-if="view === 'month'" :level="2" icon="date" title="06.2024" />
    <NavItem v-if="view === 'year'" :level="2" icon="date" title="2024" />
    <NavItem v-if="view === 'search'" :level="2" icon="search" :title="t('views.search.title')" />
    <NavItem v-if="view === 'note_list'" :level="2" icon="note-list" :title="noteListDate" />
    <NavItem
      v-if="view === 'edit_note'"
      :level="2"
      icon="note-list"
      title="21.06.2024"
      @click="router.push({ name: 'note_list' })"
    />

    <NavItem v-if="view === 'edit_note'" :level="3" icon="note" title="N2 21:35" />
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
