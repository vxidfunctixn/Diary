<script setup>
import OptionsBar from '@/components/options-bar.vue'
import Button from '@/components/button.vue'
import { useDiaryStore, VIEW } from '@/diaryStore'

const diaryStore = useDiaryStore()

</script>

<template>
  <div class="edit-note">
    <OptionsBar>
      <template #left>
        <div class="options-group">
          <Button icon="bold" stick="right"/>
          <Button icon="italic" stick="both"/>
          <Button icon="underline" stick="both"/>
          <Button icon="strikethrough" stick="both"/>
          <Button icon="link" stick="both"/>
          <Button icon="mark" stick="left"/>
        </div>
      </template>
      <template #right>
        <Button icon="save">Zapisz</Button>
      </template>
    </OptionsBar>
  </div>
</template>

<style lang="scss" scoped>
.edit-note {
  padding: 60px 24px 2px 24px;
  width: 100%;
  height: 100%;
  background-color: var(--BG1);
}
</style>