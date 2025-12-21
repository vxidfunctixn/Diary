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
  return props.accent || props.danger || props.negative
    ? themeColor.value.HL3.value
    : themeColor.value.F1.value
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
  background: var(--HL3);
  border: 1px solid var(--HL2);
  border-radius: 8px;
  overflow: hidden;
  outline: none;
  color: var(--F1);
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
    background: var(--HL2);
    border-color: var(--HL1);
  }

  &:active {
    border-color: var(--F3);
  }

  &.active {
    border-color: var(--A1);

    &:hover,
    &:focus-visible {
      background: var(--HL2);
      border-color: var(--A2);
    }

    &:active {
      border-color: var(--A3);
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
    background-color: var(--A1);
    border-color: var(--A4);
    color: var(--HL3);

    @include theme-dark() {
      font-weight: 500;
    }

    &:hover,
    &:focus-visible {
      background-color: var(--A2);
      border-color: var(--A3);
    }

    &:active {
      border-color: var(--A1);
    }
  }

  &.danger {
    background-color: var(--D1);
    border-color: var(--D2);
    color: var(--HL4);
    position: relative;

    @include theme-dark() {
      font-weight: 500;
    }

    &:hover,
    &:focus-visible {
      background-color: var(--D2);
      border-color: var(--D3);
    }

    &:active {
      border-color: var(--D1);
    }

    &::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      border: 2px solid var(--HL4);
      border-radius: 6px;
    }
  }

  &.negative {
    background-color: var(--F1);
    border-color: var(--F3);
    color: var(--HL3);

    @include theme-dark() {
      font-weight: 500;
    }

    &:hover,
    &:focus-visible {
      background-color: var(--F2);
      border-color: var(--F3);
    }

    &:active {
      border-color: var(--F1);
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
    filter: grayscale(50%) contrast(0.9) brightness(0.8);

    .icon,
    .text {
      opacity: 0.7;
    }
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
