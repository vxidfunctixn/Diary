<script setup lang="ts">
import type { useSettingsStore } from '../../../stores'

defineProps<{
  size?: number
  currentColor: string
  settingsStore: ReturnType<typeof useSettingsStore>
}>()
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="23"
      height="23"
      rx="3.5"
      :fill="settingsStore.themeColor.BG2.value"
    />
    <rect
      x="0.5"
      y="0.5"
      width="23"
      height="23"
      rx="3.5"
      :stroke="settingsStore.themeColor.A4.value"
    />
    <path
      d="M12.6911 4.70361C12.5209 4.27859 12.1146 4 11.6667 4C11.2187 4 10.8124 4.27859 10.6422 4.70361L6.47499 14.9899L5.08591 18.4187C4.84976 19.0009 5.11716 19.6688 5.68321 19.9116C6.24926 20.1545 6.89866 19.8795 7.1348 19.2973L8.23912 16.5722H15.0942L16.1985 19.2973C16.4347 19.8795 17.0841 20.1545 17.6501 19.9116C18.2162 19.6688 18.4836 19.0009 18.2474 18.4187L16.8583 14.9899L12.6911 4.70361ZM14.167 14.2863H9.16633L11.6667 8.11453L14.167 14.2863Z"
      :fill="currentColor"
    />
  </svg>
</template>
