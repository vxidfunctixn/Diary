<script setup>
import Icon from '@/components/icon.vue'
import { storeToRefs } from 'pinia'
import { useDiaryStore } from '@/diaryStore'
const diaryStore = useDiaryStore()
const { themeColor } = storeToRefs(diaryStore)

const props = defineProps({
  icon: String,
  small: Boolean,
  disabled: Boolean,
})
</script>

<template>
  <button class="button" :class="{ small }" :disabled="disabled">
    <div class="icon">
      <Icon :name="icon" :size="small ? 16 : 24" :color="themeColor.F1.hsl"/>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.button {
  border: none;
  height: 44px;
  display: inline-flex;
  padding: 9px;
  background: var(--HL3);
  border: 1px solid var(--HL2);
  border-radius: 8px;
  overflow: hidden;
  outline: none;
  cursor: pointer;

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
  }

  &:disabled {
    .icon {
      opacity: 0.7;
    }
  }
}
</style>