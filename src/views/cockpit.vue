<script setup>
import WidgetCalendar from '@/components/widget-calendar.vue'
import WidgetCompleteNotes from '@/components/widget-complete-notes.vue'
</script>

<template>
  <div class="cockpit">
    <WidgetCalendar/>
    <WidgetCompleteNotes/>
  </div>
</template>

<style lang="scss" scoped>
.cockpit {
  padding: 12px 24px;
  column-count: 2;
  column-gap: 24px;

  & > div {
    break-inside: avoid;
    margin-bottom: 24px;
    position: relative;
    top: 12px;
  }

  @media (max-width: 700px) {
    column-count: 1;
  }
}
</style>