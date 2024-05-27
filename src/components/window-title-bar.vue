<script setup>
import { storeToRefs } from 'pinia'
import Icon from '@/components/icon.vue'
import Button from '@/components/button.vue'
import Navigation from '@/components/navigation.vue'
import { useDiaryStore, VIEW } from '@/diaryStore'
import { ref, onMounted } from 'vue'

const diaryStore = useDiaryStore()
const { themeColor, app } = storeToRefs(diaryStore)
const maximizeIcon = ref('maximize')
const isWindowActive = ref(true)

function minimize() {
  window.electron.send('app-control', 'minimize')
}
function maximize() {
  window.electron.send('app-control', 'maximize')
}
function exit() {
  window.electron.send('app-control', 'exit')
}

onMounted(() => {
  window.electron.receive('window-maximized', () => {
    maximizeIcon.value = 'unmaximize'
  })

  window.electron.receive('window-unmaximized', () => {
    maximizeIcon.value = 'maximize'
  })

  window.electron.receive('window-focus', () => {
    isWindowActive.value = true
  })

  window.electron.receive('window-blur', () => {
    isWindowActive.value = false
  })
})

</script>

<template>
  <div class="window-title-bar">
    <Navigation/>
    <div v-if="app.view !== VIEW.LOCK" class="app-options">
      <Button small icon="search" :disabled="!isWindowActive" @click="diaryStore.setView(VIEW.SEARCH)"/>
      <Button small icon="add-note" :disabled="!isWindowActive" @click="diaryStore.setView(VIEW.EDIT_NOTE)"/>
      <Button small icon="settings" :disabled="!isWindowActive" @click="diaryStore.setView(VIEW.SETTINGS)"/>
      <Button small icon="lock" :disabled="!isWindowActive" @click="diaryStore.setView(VIEW.LOCK)"/>
    </div>
    <div class="separator"></div>
    <div class="window-options">
      <button class="window-button" @click="minimize">
        <div class="icon">
          <Icon name="minimize" :size="16" :color="themeColor.F1.hsl" />
        </div>
      </button>
      <button class="window-button" @click="maximize">
        <div class="icon">
          <Icon :name="maximizeIcon" :size="16" :color="themeColor.F1.hsl" />
        </div>
      </button>
      <button class="window-button" @click="exit">
        <div class="icon">
          <Icon name="cancel" :size="16" :color="themeColor.F1.hsl" />
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.window-title-bar {
  height: 41px;
  background: var(--BG3);
  display: flex;
  min-width: 0;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  overflow: hidden;
  -webkit-app-region: drag;
  border-bottom: 1px solid var(--HL2);

  .app-options {
    display: flex;
  }

  .separator {
    width: 1px;
    height: 100%;
    background-color: var(--HL2);
    margin: 0 4px;
    min-width: 0;
  }

  .window-options {
    display: flex;
    -webkit-app-region: no-drag;

    .window-button {
      background: transparent;
      height: 40px;
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      background-color: var(--BG3);
      outline: none;

      &:hover,
      &:focus-visible {
        background: var(--BG1);
      }

      &:last-child:hover,
      &:last-child:focus-visible {
        background-color: hsl(0, 95%, 40%);
      }
    }
  }
}

.app-theme-provider.maximized {
  .window-title-bar {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
  }
}

.app-theme-provider:not(.active) {
  .window-options .window-button .icon {
    opacity: .7;
  }

  .window-title-bar,
  .window-options .window-button:not(:hover) {
    background: var(--BG2);
  }
}
</style>

