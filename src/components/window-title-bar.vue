<script setup>
import { storeToRefs } from 'pinia'
import Icon from '@/components/icon.vue'
import Button from '@/components/button.vue'
import Navigation from '@/components/navigation.vue'
import { useDiaryStore } from '@/diaryStore'
import { ref, onMounted } from 'vue'

const diaryStore = useDiaryStore()
const { themeColor } = storeToRefs(diaryStore)
const maximizeIcon = ref('maximize')

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
})

</script>

<template>
  <div class="window-title-bar">
    <Navigation/>
    <div class="app-options">
      <Button small icon="search"/>
      <Button small icon="add-note"/>
      <Button small icon="settings"/>
      <Button small icon="lock"/>
    </div>
    <div class="separator"></div>
    <div class="window-options">
      <button class="window-button" @click="minimize">
        <Icon name="minimize" :size="24" :color="themeColor.F1.hsl" />
      </button>
      <button class="window-button" @click="maximize">
        <Icon :name="maximizeIcon" :size="24" :color="themeColor.F1.hsl" />
      </button>
      <button class="window-button" @click="exit">
        <Icon name="cancel" :size="24" :color="themeColor.F1.hsl" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.window-title-bar {
  height: 40px;
  background: var(--BG3);
  display: flex;
  min-width: 0;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  overflow: hidden;
  -webkit-app-region: drag;

  .app-options {
    display: flex;
    margin-left: auto;
    min-width: 0;
    -webkit-app-region: no-drag;
  }

  .separator {
    width: 1px;
    height: 100%;
    background-color: var(--BG1);
    margin: 0 4px;
    min-width: 0;
  }

  .window-options {
    display: flex;
    min-width: 0;
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
      min-width: 0;
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
</style>

