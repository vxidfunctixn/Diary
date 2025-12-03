<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDiaryStore } from '@/diaryStore'
import { ref, onMounted, watch } from 'vue'

const diaryStore = useDiaryStore()
const { themeColor } = storeToRefs(diaryStore)

watch(themeColor, newValue => {
  updateTheme()
})

const variables = ref<Record<string, string>>({})

const classes = ref({
  light: diaryStore.theme === 'light',
  dark: diaryStore.theme === 'dark',
  maximized: false,
  active: true
})

updateTheme()

function updateTheme() {
  for (const [key, color] of Object.entries(themeColor.value)) {
    variables.value['--' + key] = color.value
  }
  classes.value.light = diaryStore.theme === 'light'
  classes.value.dark = diaryStore.theme === 'dark'
}

onMounted(() => {
  window.electron.receive('window-maximized', () => {
    classes.value.maximized = true
  })

  window.electron.receive('window-unmaximized', () => {
    classes.value.maximized = false
  })

  window.electron.receive('window-focus', () => {
    classes.value.active = true
  })

  window.electron.receive('window-blur', () => {
    classes.value.active = false
  })

  window.electron.receive('native-theme-dark', () => {
    diaryStore.setNativeTheme('dark')
  })
  window.electron.receive('native-theme-light', () => {
    diaryStore.setNativeTheme('light')
  })
})
</script>

<template>
  <div class="app-theme-provider" :style="variables" :class="classes">
    <slot></slot>
  </div>
</template>
