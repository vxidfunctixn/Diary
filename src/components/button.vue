<script setup>
import Icon from '@/components/icon.vue'
import { storeToRefs } from 'pinia'
import { useDiaryStore } from '@/diaryStore'
import { useSlots } from 'vue'
const diaryStore = useDiaryStore()
const { themeColor } = storeToRefs(diaryStore)
const slots = useSlots()

const props = defineProps({
  icon: String,
  small: Boolean,
  disabled: Boolean,
  accent: Boolean
})
</script>

<template>
  <button class="button" :class="{ small, accent }" :disabled="disabled">
    <div class="icon">
      <Icon :name="icon" :size="16" :color="accent ? themeColor.HL3.hsl : themeColor.F1.hsl"/>
    </div>
    <div v-if="slots.default" class="title">
      <slot></slot>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.button {
  height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 9px;
  background: var(--HL3);
  border: 1px solid var(--HL2);
  border-radius: 8px;
  overflow: hidden;
  outline: none;
  color: var(--F1);
  cursor: pointer;
  font-size: var(--FS4);
  -webkit-app-region: no-drag;

  .icon {
    width: 16px;
    height: 16px;
  }

  .title {
    margin-left: 8px;
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
    height: 36px;
    margin: 2px;

    .title {
      line-height: 20px;
    }
  }

  &.accent {
    background-color: var(--A1);
    border-color: var(--A4);
    color: var(--HL3);
    font-weight: 500;

    &:hover {
      background-color: var(--A2);
      border-color: var(--A3);
    }

    &:active {
      border-color: var(--A1);
    }
  }

  &:disabled {
    .icon, .title {
      opacity: 0.7;
    }
  }
}
</style>