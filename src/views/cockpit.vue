<script setup>
import WidgetNavigation from '@/components/widget-navigation.vue'
import WidgetCompleteNotes from '@/components/widget-complete-notes.vue'
</script>

<template>
  <div class="cockpit">
    <WidgetNavigation/>
    <WidgetCompleteNotes/>
  </div>
</template>

<style lang="scss" scoped>
.cockpit {
  padding: 24px;
  column-count: 2;
  column-gap: 24px;

  & > div {
    break-inside: avoid;
    margin-bottom: 24px;
  }

  @media (max-width: 700px) {
    column-count: 1;
  }
}
</style>