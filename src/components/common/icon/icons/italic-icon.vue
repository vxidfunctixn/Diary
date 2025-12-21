<script setup lang="ts">
defineProps<{
  size?: number
  currentColor: string
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
    <path
      d="M10.6 3H19M5 21H13.4M14.8 3L9.2 21"
      :stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
