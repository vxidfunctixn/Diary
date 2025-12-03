<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settingsStore'
import { useAppStore } from '@/stores/appStore'
import { ref, onMounted, watch } from 'vue'

const settingsStore = useSettingsStore()
const appStore = useAppStore()
const { themeColor } = storeToRefs(settingsStore)

watch(themeColor, newValue => {
  updateTheme()
})

const variables = ref<Record<string, string>>({})

const classes = ref({
  light: settingsStore.theme === 'light',
  dark: settingsStore.theme === 'dark',
  maximized: false,
  active: true
})

updateTheme()

function updateTheme() {
  for (const [key, color] of Object.entries(themeColor.value)) {
    variables.value['--' + key] = color.value
  }
  classes.value.light = settingsStore.theme === 'light'
  classes.value.dark = settingsStore.theme === 'dark'
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
    appStore.setNativeTheme('dark')
  })
  window.electron.receive('native-theme-light', () => {
    appStore.setNativeTheme('light')
  })
})
</script>

<template>
  <div class="app-theme-provider" :style="variables" :class="classes">
    <slot></slot>
  </div>
</template>
