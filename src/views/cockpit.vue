<script setup>
import WidgetNavigation from '@/components/widget-navigation.vue'
import WidgetCompleteNotes from '@/components/widget-complete-notes.vue'
</script>

<template>
  <div class="cockpit">
    <div class="widget">
      <WidgetNavigation/>
    </div>
    <div class="widget">
      <WidgetCompleteNotes/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cockpit {
  padding: 12px 24px;
  column-count: 3;
  column-gap: 24px;
  max-width: 1488px;
  margin: 0 auto;

  & > .widget {
    break-inside: avoid;
    padding: 12px 0;
  }

  @media (max-width: 1200px) {
    column-count: 2;
    max-width: 1144px;
  }

  @media (max-width: 820px) {
    column-count: 1;
    max-width: 560px;
  }
}
</style>