<script setup>
import { storeToRefs } from 'pinia'
import { useDiaryStore } from '@/diaryStore'
import { ref, onMounted } from 'vue'
const diaryStore = useDiaryStore()
const { themeColor } = storeToRefs(diaryStore)



const variables = {}
for (const [ key, value ] of Object.entries(themeColor.value)) {
  const color = key.slice(-1) === 'T' ? value.hsla : value.hsl
  variables[ '--' + key ] = color
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