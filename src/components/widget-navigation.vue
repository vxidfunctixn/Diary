<script setup>
import Section from '@/components/section.vue'
import Button from '@/components/button.vue'
import { useDiaryStore, VIEW } from '@/diaryStore'
const diaryStore = useDiaryStore()
</script>

<template>
  <Section title="Nawigacja">
    <div class="navigation-grid">
      <Button icon="note-list" @click="diaryStore.setView(VIEW.NOTE_LIST)">Lista wpisów</Button>
      <Button icon="add-note" @click="diaryStore.setView(VIEW.EDIT_NOTE)">Dodaj notatkę</Button>
      <Button icon="date" @click="diaryStore.setView(VIEW.MONTH)">Zobacz miesiąc</Button>
      <Button icon="date" @click="diaryStore.setView(VIEW.YEAR)">Zobacz rok</Button>
      <Button icon="search" @click="diaryStore.setView(VIEW.SEARCH)">Wyszukiwarka</Button>
      <Button icon="settings" @click="diaryStore.setView(VIEW.SETTINGS)">Ustawienia</Button>
      <Button icon="lock" @click="diaryStore.setView(VIEW.LOCK)">Zablokuj</Button>
      <Button icon="info" @click="diaryStore.setView(VIEW.ABOUT)">O aplikacji</Button>
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