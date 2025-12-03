<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Icon from '@/components/icon.vue'
import Button from '@/components/button.vue'
import Navigation from '@/components/layout/breadcrumbs.vue'
import { useAppStore, VIEW } from '@/stores/appStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { ref, onMounted } from 'vue'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const { themeColor } = storeToRefs(settingsStore)
const { view } = storeToRefs(appStore)
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
    <Navigation />
    <div v-if="view !== VIEW.LOCK" class="app-options">
      <Button
        small
        icon="search"
        title="Szukaj"
        :disabled="!isWindowActive"
        @click="appStore.setView(VIEW.SEARCH)"
      />
      <Button
        small
        icon="add-note"
        title="Dodaj notatkę"
        :disabled="!isWindowActive"
        @click="appStore.setView(VIEW.EDIT_NOTE)"
      />
      <Button
        small
        icon="settings"
        title="Ustawienia"
        :disabled="!isWindowActive"
        @click="appStore.setView(VIEW.SETTINGS)"
      />
      <Button
        small
        icon="lock"
        title="Zablokuj"
        :disabled="!isWindowActive"
        @click="appStore.setView(VIEW.LOCK)"
      />
    </div>
    <div class="separator"></div>
    <div class="window-options">
      <button class="window-button" @click="minimize">
        <div class="icon">
          <Icon name="minimize" :size="16" :color="themeColor.F1.value" />
        </div>
      </button>
      <button class="window-button" @click="maximize">
        <div class="icon">
          <Icon :name="maximizeIcon" :size="16" :color="themeColor.F1.value" />
        </div>
      </button>
      <button class="window-button" @click="exit">
        <div class="icon">
          <Icon name="cancel" :size="16" :color="themeColor.F1.value" />
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
  position: relative;
  z-index: 9999;

  .app-options {
    display: flex;
    align-items: center;
    gap: 4px;
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
        background-color: var(--red);
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
    opacity: 0.7;
  }

  .window-title-bar,
  .window-options .window-button:not(:hover) {
    background: var(--BG2);
  }
}
</style>
