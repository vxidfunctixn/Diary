<script setup>
import Button from '@/components/button.vue'
import { useDiaryStore, VIEW } from '@/diaryStore'
const diaryStore = useDiaryStore()
</script>

<template>
  <div class="lock">
   <Button icon="arrow-right" @click="diaryStore.setView(VIEW.HOME)">Login</Button>
  </div>
</template>

<style lang="scss" scoped>
.lock {
  padding: 24px;
}
</style>