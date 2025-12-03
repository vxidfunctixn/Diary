<script setup lang="ts">
import Section from '@/components/section.vue'
import Button from '@/components/button.vue'
import { useDiaryStore, VIEW } from '@/diaryStore'
import { useI18n } from 'vue-i18n'

const diaryStore = useDiaryStore()
const { t } = useI18n()
</script>

<template>
  <Section :title="t('widgets.navigation.title')">
    <div class="navigation-grid">
      <Button icon="note-list" @click="diaryStore.setView(VIEW.NOTE_LIST)">{{
        t('widgets.navigation.noteList')
      }}</Button>
      <Button icon="add-note" @click="diaryStore.setView(VIEW.EDIT_NOTE)">{{
        t('widgets.navigation.addNote')
      }}</Button>
      <Button icon="date" @click="diaryStore.setView(VIEW.MONTH)">{{
        t('widgets.navigation.viewMonth')
      }}</Button>
      <Button icon="date" @click="diaryStore.setView(VIEW.YEAR)">{{
        t('widgets.navigation.viewYear')
      }}</Button>
      <Button icon="search" @click="diaryStore.setView(VIEW.SEARCH)">{{
        t('widgets.navigation.search')
      }}</Button>
      <Button icon="settings" @click="diaryStore.setView(VIEW.SETTINGS)">{{
        t('widgets.navigation.settings')
      }}</Button>
      <Button icon="lock" @click="diaryStore.setView(VIEW.LOCK)">{{
        t('widgets.navigation.lock')
      }}</Button>
      <Button icon="info" @click="diaryStore.setView(VIEW.ABOUT)">{{
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
