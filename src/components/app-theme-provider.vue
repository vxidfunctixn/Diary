<script setup>
import { storeToRefs } from 'pinia'
import { useDiaryStore } from '@/diaryStore'
import { ref, onMounted } from 'vue'
const diaryStore = useDiaryStore()
const { settings, themeColor } = storeToRefs(diaryStore)

const variables = {
  "--hue":  settings.value.theme_hue,
  "--F1":   themeColor.value.F1.hsla,
  "--F1T":  themeColor.value.F1T.hsla,
  "--F2":   themeColor.value.F2.hsla,
  "--HL1":  themeColor.value.HL1.hsla,
  "--HL2":  themeColor.value.HL2.hsla,
  "--HL3":  themeColor.value.HL3.hsla,
  "--BG1":  themeColor.value.BG1.hsla,
  "--BG2":  themeColor.value.BG2.hsla,
  "--BG2T": themeColor.value.BG2T.hsla,
  "--BG3":  themeColor.value.BG3.hsla,
  "--BG4":  themeColor.value.BG4.hsla,
  "--A1":   themeColor.value.A1.hsla,
}

const classes = ref({
  "light": diaryStore.themeColorColor === 'light',
  "dark": diaryStore.themeColorColor === 'dark',
  "maximized": false,
  "active": true,
})

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
})
</script>

<template>
  <div class="app-theme-provider" :style="variables" :class="classes">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.app-theme-provider {
  --hue:  0;
  --F1:   hsl(var(--hue), 10%, 85%);
  --F1T:  hsla(var(--hue), 10%, 85%, 50%);
  --F2:   hsl(var(--hue), 8%, 30%);
  --HL1:  hsl(var(--hue), 25%, 19%);
  --HL2:  hsl(var(--hue), 26%, 14%);
  --HL3:  hsl(var(--hue), 35%, 11%);
  --BG1:  hsl(var(--hue), 36%, 11%);
  --BG2:  hsl(var(--hue), 42%, 9%);
  --BG2T: hsla(var(--hue), 42%, 9%, 80%);
  --BG3:  hsl(var(--hue), 24%, 8%);
  --BG4:  hsl(var(--hue), 42%, 5%);
  --A1:   hsl(var(--hue), 88%, 57%);

  background-color: var(--BG2);
  color: var(--F1);
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &:not(.maximized) {
    border: 2px solid var(--A1);
    border-radius: 8px;

    &:not(.active) {
      border-color: var(--HL2);
    }
  }

  ::selection {
    background-color: var(--A1);
    color: var(--BG2);
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--BG3);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--HL2);
    border: 2px solid var(--BG3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--HL1);
  }
}


</style>