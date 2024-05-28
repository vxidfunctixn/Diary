<script setup>
import Button from '@/components/button.vue'
import InputText from '@/components/inputs/input-text.vue'
import InputRow from '@/components/inputs/input-row.vue'
import { useDiaryStore, VIEW } from '@/diaryStore'
const diaryStore = useDiaryStore()
</script>

<template>
  <div class="settings">
    <InputRow title="Nazwa dziennika">
      <InputText name="diary_name"/>
    </InputRow>
    <InputRow title="Nazwa dziennika">
      <InputText name="diary_name"/>
    </InputRow>
    <InputRow title="Nazwa dziennika">
      <InputText name="diary_name"/>
    </InputRow>
    <InputRow title="Nazwa dziennika">
      <InputText name="diary_name"/>
    </InputRow>
    <div class="options">
      <Button icon="save" accent>Zapisz</Button>
      <Button icon="cancel">Anuluj zmiany</Button>
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