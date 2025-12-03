<script setup lang="ts">
import Icon from '@/components/icon.vue'
const props = defineProps({
  title: String,
  icon: String,
  stick: String,
  shadow: {
    type: Boolean,
    default: true,
  }
})
</script>

<template>
  <div class="section" :class="{
    stickTop: stick === 'top' || stick === 'both',
    stickBottom: stick === 'bottom' || stick === 'both',
    shadow
  }">
    <div class="title-bar" :class="{ hasIcon: icon }">
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

  &.shadow {
    box-shadow: 0 4px 16px -4px rgba(black, .25);
  }

  &.stickTop {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &.stickBottom {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .title-bar {
    background-color: var(--HL3);
    padding: 12px;
    position: relative;
    min-height: 44px;

    .title {
      line-height: 20px;
    }

    &.hasIcon {
      padding-left: 12px + 16px + 8px;

      .icon {
        position: absolute;
        left: 12px;
        top: 8px;
      }
    }
  }

  .content {
    min-height: 32px;
  }
}
</style>