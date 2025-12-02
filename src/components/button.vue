<script setup lang="ts">
import Icon from '@/components/icon.vue'
import { storeToRefs } from 'pinia'
import { useDiaryStore } from '@/diaryStore'
import { useSlots } from 'vue'

interface Props {
  icon?: string
  title?: string
  small?: boolean
  disabled?: boolean
  accent?: boolean
  submit?: boolean
  width?: string
  center?: boolean
  stick?: 'left' | 'right' | 'both'
  monospace?: boolean
}

withDefaults(defineProps<Props>(), {
  width: 'auto'
})

const diaryStore = useDiaryStore()
const { themeColor } = storeToRefs(diaryStore)
const slots = useSlots()
</script>

<template>
  <button
    :type="submit ? 'submit' : 'button'"
    class="button"
    :class="{
      small,
      accent,
      center,
      monospace,
      stickLeft: stick === 'left' || stick === 'both',
      stickRight: stick === 'right' || stick === 'both'
    }"
    :disabled="disabled"
    :title="title"
    :style="{ width }"
  >
    <div class="icon" v-if="icon">
      <Icon :name="icon" :size="16" :color="accent ? themeColor.HL3.value : themeColor.F1.value"/>
    </div>
    <div v-if="slots.default" class="text" :class="{ hasIcon: icon }">
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

  .icon {
    width: 16px;
    height: 16px;
  }

  .text {
    text-align: left;
    line-height: 21px;

    &.hasIcon {
      margin-left: 8px;
    }
  }

  &:hover,
  &:focus-visible {
    background: var(--HL2);
    border-color: var(--HL1);
  }

  &:active {
    border-color: var(--F2);
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

    .icon, .title {
      opacity: 0.7;
    }
  }
}
</style>