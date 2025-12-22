<script setup lang="ts">
import Icon from '@/components/common/icon/index.vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores'
import { useSlots, computed } from 'vue'
import type { ButtonProps } from '@/interfaces/components-interface'

const props = withDefaults(defineProps<ButtonProps>(), {
  width: 'auto',
  iconButton: false,
  iconPosition: 'left'
})

const settingsStore = useSettingsStore()
const { themeColor } = storeToRefs(settingsStore)
const slots = useSlots()

const iconColor = computed(() => {
  if (props.danger) return themeColor.value.black.value
  else if (props.accent || props.negative) return themeColor.value.background_300.value
  else return themeColor.value.foreground_200.value
})
</script>

<template>
  <button
    :type="submit ? 'submit' : 'button'"
    class="button"
    :class="{
      small,
      accent,
      danger,
      negative,
      center,
      monospace,
      active,
      iconButton,
      stickLeft: stick === 'left' || stick === 'both',
      stickRight: stick === 'right' || stick === 'both'
    }"
    :disabled="disabled"
    :title="title"
    :style="{ width }"
  >
    <div class="icon" v-if="icon" :class="iconPosition">
      <Icon :name="icon" :size="iconButton && !small ? 24 : 16" :color="iconColor" />
    </div>
    <div v-if="slots.default && !iconButton" class="text">
      <slot></slot>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 9px 12px;
  background: var(--background_300);
  border: 1px solid var(--background_200);
  border-radius: 8px;
  overflow: hidden;
  outline: none;
  color: var(--foreground_200);
  cursor: pointer;
  font-size: var(--FS4);
  -webkit-app-region: no-drag;
  min-width: 44px;
  gap: 8px;

  .icon {
    width: 16px;
    height: 16px;

    &.left {
      order: 1;
    }

    &.right {
      order: 3;
    }
  }

  .text {
    text-align: left;
    line-height: 21px;
    order: 2;
  }

  &:hover,
  &:focus-visible {
    background: var(--background_200);
    border-color: var(--background_100);
  }

  &:active {
    border-color: var(--foreground_700);
  }

  &.active {
    border-color: var(--accent_300);

    &:hover,
    &:focus-visible {
      background: var(--background_200);
      border-color: var(--accent_400);
    }

    &:active {
      border-color: var(--accent_500);
    }
  }

  &.small {
    min-height: 36px;
    padding: 2px 9px;
    min-width: 36px;

    .title {
      line-height: 20px;
    }
  }

  &.accent {
    background-color: var(--accent_300);
    border-color: var(--accent_600);
    color: var(--background_300);

    @include theme-dark() {
      font-weight: 500;
    }

    &:hover,
    &:focus-visible {
      background-color: var(--accent_400);
      border-color: var(--accent_500);
    }

    &:active {
      border-color: var(--accent_300);
    }
  }

  &.danger {
    background-color: var(--danger_200);
    border-color: var(--danger_300);
    color: var(--black);
    position: relative;
    font-weight: 500;

    &:hover,
    &:focus-visible {
      background-color: var(--danger_300);
      border-color: var(--danger_300);
    }

    &:active {
      border-color: var(--danger_100);
    }

    &::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      border: 2px solid var(--black);
      border-radius: 6px;
    }
  }

  &.negative {
    background-color: var(--foreground_200);
    border-color: var(--foreground_700);
    color: var(--background_300);

    @include theme-dark() {
      font-weight: 500;
    }

    &:hover,
    &:focus-visible {
      background-color: var(--foreground_300);
      border-color: var(--foreground_700);
    }

    &:active {
      border-color: var(--foreground_100);
    }
  }

  &.center {
    justify-content: center;
  }

  &.stickLeft {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &.stickRight {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  &.monospace {
    font-family: var(--FF2);
  }

  &:disabled {
    pointer-events: none;
    filter: saturate(0.65) contrast(0.65) brightness(0.75);
  }

  &.iconButton {
    padding: 9px;
    .icon {
      width: 24px;
      height: 24px;
    }
  }

  &.iconButton.small {
    padding: 9px;
    .icon {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
