<script setup>
import OptionsBar from '@/components/options-bar.vue'
import Button from '@/components/button.vue'
</script>

<template>
  <div class="note-list">
    <OptionsBar>
      <template #left>
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
.note-list {
  padding-top: 60px;
}
</style>