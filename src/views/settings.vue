<script setup>
import Button from '@/components/button.vue'
import InputText from '@/components/inputs/input-text.vue'
import InputTime from '@/components/inputs/input-time.vue'
import InputRow from '@/components/inputs/input-row.vue'
import { ref, toRaw } from 'vue'
import { useDiaryStore } from '@/diaryStore'
import { isProxyDifferent } from '@/utils'

const diaryStore = useDiaryStore()

const form = ref({ ...diaryStore.settings })
const hasChangedData = ref(false)

function handleUpdate(event) {
  form.value[event.name] = event.value
  hasChangedData.value = isProxyDifferent(form.value, diaryStore.settings)
}

function saveForm() {
  if(isProxyDifferent(form.value, diaryStore.settings)) {
    diaryStore.saveSettings(toRaw(form.value))
    hasChangedData.value = false
  }
}

function resetForm() {
  form.value = { ...diaryStore.settings }
  hasChangedData.value = false
}
</script>

<template>
  <div class="settings">
    <form @submit.prevent="saveForm()">
      <InputRow title="Nazwa dziennika">
        <InputText name="diary_name" :value="form.diary_name" @update="handleUpdate($event)"/>
      </InputRow>
      <InputRow title="Godzina przypomnienia">
        <InputTime name="remind_time" :value="form.remind_time" @update="handleUpdate($event)"/>
      </InputRow>
    </form>
    <div class="options">
      <Button icon="save" accent :disabled="!hasChangedData" @click="saveForm()">Zapisz</Button>
      <Button v-if="hasChangedData" icon="cancel" @click="resetForm()">Anuluj zmiany</Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings {
  padding: 24px;

  .options {
    margin-top: 12px;
    display: inline-grid;
    grid-auto-flow: column;
    grid-column-gap: 12px;
  }
}
</style>