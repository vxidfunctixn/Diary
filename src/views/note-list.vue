<script setup>
import OptionsBar from '@/components/options-bar.vue'
import InputDate from '@/components/inputs/input-date.vue'
import Button from '@/components/button.vue'
import Note from '@/components/note.vue'
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

const data1 = [
  {
    title: 'N1 20:32 22.05.2024',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a nunc vulputate, porttitor arcu ac, imperdiet odio. Vivamus sagittis sapien quis lacus dignissim pulvinar. Mauris tristique egestas lorem eu fermentum. Mauris tempus purus sit amet tincidunt finibus. Ut sagittis dapibus gravida. Suspendisse posuere purus molestie, pulvinar nisl non, fermentum tortor.'
  }
]

const data2 = [
  {
    title: 'N1 20:32 22.05.2024',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a nunc vulputate, porttitor arcu ac, imperdiet odio. Vivamus sagittis sapien quis lacus dignissim pulvinar. Mauris tristique egestas lorem eu fermentum. Mauris tempus purus sit amet tincidunt finibus. Ut sagittis dapibus gravida. Suspendisse posuere purus molestie, pulvinar nisl non, fermentum tortor.'
  },
  {
    title: 'N2 20:33 22.05.2024',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a nunc vulputate, porttitor arcu ac, imperdiet odio. Vivamus sagittis sapien quis lacus dignissim pulvinar. Mauris tristique egestas lorem eu fermentum. Mauris tempus purus sit amet tincidunt finibus. Ut sagittis dapibus gravida. Suspendisse posuere purus molestie, pulvinar nisl non, fermentum tortor.'
  },
  {
    title: 'N3 20:35 22.05.2024',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a nunc vulputate, porttitor arcu ac, imperdiet odio. Vivamus sagittis sapien quis lacus dignissim pulvinar. Mauris tristique egestas lorem eu fermentum. Mauris tempus purus sit amet tincidunt finibus. Ut sagittis dapibus gravida. Suspendisse posuere purus molestie, pulvinar nisl non, fermentum tortor.'
  },
]

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
    <Note :data="data1"/>
    <Note :data="data2"/>
    <Note :data="data1"/>
  </div>
</template>

<style lang="scss" scoped>
.note-list {
  padding: 60px 24px 2px 24px;
  max-width: var(--CW);
  margin: 0 auto;
}
</style>