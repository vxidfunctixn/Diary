<script setup lang="ts">
import OptionsBar from '@/components/options-bar.vue'
import InputDate from '@/components/inputs/input-date.vue'
import Button from '@/components/button.vue'
import Note from '@/components/note.vue'
import { ref } from 'vue'
import { useDiaryStore, VIEW } from '@/diaryStore'

const diaryStore = useDiaryStore()
const selectedDate = ref(new Date(Date.now()).valueOf())
const notes = ref(diaryStore.getNotes(Date.now()))

function onDateUpdate(event) {
  if(event.name === 'selected_day') {
    selectedDate.value = event.value
    diaryStore.setSelectedDay(event.value)
  }
}


</script>

<template>
  <div class="note-list">
    <OptionsBar>
      <template #left>
        <InputDate name="selected_day" :newValue="selectedDate" controls @update="onDateUpdate($event)"/>
        <Button icon="date">Miesiąc</Button>
        <Button icon="date">Dzisiaj</Button>
      </template>
      <template #right>
        <Button icon="add-note" @click="diaryStore.setView(VIEW.EDIT_NOTE)">Dodaj notatkę</Button>
      </template>
    </OptionsBar>
    <Note v-for="note in notes" :data="note"/>
  </div>
</template>

<style lang="scss" scoped>
.note-list {
  padding: 60px 24px 2px 24px;
  max-width: var(--CW);
  margin: 0 auto;
}
</style>