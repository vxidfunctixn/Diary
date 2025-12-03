<script setup lang="ts">
import OptionsBar from '@/components/layout/options-bar.vue'
import Button from '@/components/button.vue'
import { useAppStore, VIEW } from '@/stores/appStore'
import InputContent from '@/components/inputs/input-content.vue'

const appStore = useAppStore()
</script>

<template>
  <div class="edit-note">
    <OptionsBar>
      <template #left>
        <div class="options-group">
          <Button icon="bold" stick="right" />
          <Button icon="italic" stick="both" />
          <Button icon="underline" stick="both" />
          <Button icon="strikethrough" stick="both" />
          <Button icon="link" stick="both" />
          <Button icon="mark" stick="left" />
        </div>
      </template>
      <template #right>
        <Button icon="save">Zapisz</Button>
      </template>
    </OptionsBar>
    <InputContent value="test" />
  </div>
</template>

<style lang="scss" scoped>
.edit-note {
  padding: 60px 2px 2px 2px;
  width: 100%;
  height: 100%;
  background-color: var(--BG1);
}

.app-theme-provider.maximized .edit-note {
  padding: 60px 0px 0px 0px;
}
</style>
