<script setup>
import OptionsBar from '@/components/options-bar.vue'
import InputDate from '@/components/inputs/input-date.vue'
import Button from '@/components/button.vue'
import { ref } from 'vue'
import { useDiaryStore } from '@/diaryStore'

const diaryStore = useDiaryStore()
const selectedDate = ref(new Date(Date.now()).valueOf())

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
        <Button icon="add-note">Dodaj notatkę</Button>
      </template>
    </OptionsBar>
  </div>
</template>

<style lang="scss" scoped>
// .note-list {

// }
</style>