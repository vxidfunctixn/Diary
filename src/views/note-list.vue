<script setup>
import OptionsBar from '@/components/options-bar.vue'
import InputDate from '@/components/inputs/input-date.vue'
import Button from '@/components/button.vue'
import { ref } from 'vue'

const selectedDate = ref(new Date(Date.now()).valueOf())
</script>

<template>
  <div class="note-list">
    <OptionsBar>
      <template #left>
        <InputDate :newValue="selectedDate" />
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

}
</style>