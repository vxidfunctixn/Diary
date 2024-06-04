<script setup>
import Icon from '@/components/icon.vue'
const props = defineProps({
  title: String,
  icon: String
})
</script>

<template>
  <div class="section">
    <div class="title-bar" :class="{ icon }">
      <div class="icon" v-if="icon">
        <Icon :name="icon" :size="16"/>
      </div>
      <div class="title">
        {{ title }}
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section {
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--BG1);
  box-shadow: 0 4px 16px -4px rgba(black, .25);

  .title-bar {
    background-color: var(--BG3);
    padding: 4px 12px;
    position: relative;
    min-height: 32px;

    .title {
      line-height: 24px;
    }

    &.icon {
      padding-left: 12px + 16px + 8px;

      .icon {
        position: absolute;
        left: 12px;
        top: 5px;
      }
    }
  }

  .content {
    min-height: 32px;
  }
}
</style>