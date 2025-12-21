<script setup lang="ts">
import OptionsBar from '@/components/layout/options-bar.vue'
import InputDate from '@/components/inputs/input-date.vue'
import Button from '@/components/common/button.vue'
import Note from '@/components/common/note.vue'
import { ref, onMounted } from 'vue'
import { useDiaryStore } from '@/stores/diaryStore'
import { useAppStore } from '@/stores'
import type { DBNote } from '@/interfaces/store-interface'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const router = useRouter()
const diaryStore = useDiaryStore()
const appStore = useAppStore()
const selectedDate = ref(new Date(Date.now()).valueOf())
const notes = ref<DBNote[]>([])

onMounted(async () => {
  notes.value = await diaryStore.getNotes()
})

function onDateUpdate(event: { name: string; value: number }) {
  if (event.name === 'selected_day') {
    selectedDate.value = event.value
    appStore.setSelectedDay(event.value)
  }
}

async function handleDeleteNote(uuid: string) {
  try {
    await diaryStore.deleteNote(uuid)
    notes.value = await diaryStore.getNotes()
  } catch (error) {
    console.error('Błąd podczas usuwania notatki:', error)
  }
}

function handleEditNote(uuid: string) {
  router.push({ name: 'edit_note', params: { uuid } })
}

function isSameDay(date1: number, date2: number): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function getStickPosition(index: number): 'top' | 'bottom' | 'both' | undefined {
  const currentNote = notes.value[index]
  if (!currentNote) return undefined

  const prevNote = index > 0 ? notes.value[index - 1] : null
  const nextNote = index < notes.value.length - 1 ? notes.value[index + 1] : null

  const hasSameDayBefore = prevNote && isSameDay(currentNote.created_at, prevNote.created_at)
  const hasSameDayAfter = nextNote && isSameDay(currentNote.created_at, nextNote.created_at)

  if (hasSameDayBefore && hasSameDayAfter) return 'both'
  if (hasSameDayBefore) return 'top'
  if (hasSameDayAfter) return 'bottom'
  return undefined
}

function getTitleFormat(index: number): { time: boolean; date: boolean } {
  const currentNote = notes.value[index]
  if (!currentNote) return { time: true, date: true }

  const prevNote = index > 0 ? notes.value[index - 1] : null
  const isFirstOfDay = !prevNote || !isSameDay(currentNote.created_at, prevNote.created_at)

  return {
    date: isFirstOfDay,
    time: true
  }
}
</script>

<template>
  <div class="note-list">
    <OptionsBar>
      <template #left>
        <InputDate
          name="selected_day"
          :newValue="selectedDate"
          controls
          @update="onDateUpdate($event)"
        />
        <Button icon="date">{{ t('common.calendar.month') }}</Button>
        <Button icon="date">{{ t('common.calendar.today') }}</Button>
      </template>
      <template #right>
        <Button icon="add-note" accent @click="router.push({ name: 'add_note' })">
          {{ t('notes.actions.addNote') }}
        </Button>
      </template>
    </OptionsBar>
    <Note
      v-for="(note, index) in notes"
      :key="note.uuid"
      :data="note"
      :stick="getStickPosition(index)"
      :titleFormat="getTitleFormat(index)"
      @delete="handleDeleteNote"
      @edit="handleEditNote"
    />
  </div>
</template>

<style lang="scss" scoped>
.note-list {
  padding: 60px 24px 2px 24px;
  max-width: var(--CW);
  margin: 0 auto;
}
</style>
