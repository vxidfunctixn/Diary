<script setup lang="ts">
import Section from '@/components/layout/section.vue'
import Button from '@/components/button.vue'
import { useAppStore, VIEW } from '@/stores'
import { useI18n } from 'vue-i18n'

const appStore = useAppStore()
const { t } = useI18n()
</script>

<template>
  <Section :title="t('widgets.navigation.title')">
    <div class="navigation-grid">
      <Button icon="note-list" @click="appStore.setView(VIEW.NOTE_LIST)">{{
        t('widgets.navigation.noteList')
      }}</Button>
      <Button icon="add-note" @click="appStore.setView(VIEW.EDIT_NOTE)">{{
        t('widgets.navigation.addNote')
      }}</Button>
      <Button icon="date" @click="appStore.setView(VIEW.MONTH)">{{
        t('widgets.navigation.viewMonth')
      }}</Button>
      <Button icon="date" @click="appStore.setView(VIEW.YEAR)">{{
        t('widgets.navigation.viewYear')
      }}</Button>
      <Button icon="search" @click="appStore.setView(VIEW.SEARCH)">{{
        t('widgets.navigation.search')
      }}</Button>
      <Button icon="settings" @click="appStore.setView(VIEW.SETTINGS)">{{
        t('widgets.navigation.settings')
      }}</Button>
      <Button icon="lock" @click="appStore.setView(VIEW.LOCK)">{{
        t('widgets.navigation.lock')
      }}</Button>
      <Button icon="info" @click="appStore.setView(VIEW.ABOUT)">{{
        t('widgets.navigation.about')
      }}</Button>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.navigation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px;
  padding: 12px;
}
</style>
