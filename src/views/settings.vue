<script setup>
import Button from '@/components/button.vue'
import { useDiaryStore, VIEW } from '@/diaryStore'
const diaryStore = useDiaryStore()
</script>

<template>
  <div class="settings">
    <Button icon="save" accent>Zapisz</Button>
  </div>
</template>

<style lang="scss" scoped>
.settings {
  padding: 24px;
}
</style>