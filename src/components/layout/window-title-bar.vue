<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Icon from '@/components/common/icon/index.vue'
import Button from '@/components/common/button.vue'
import Navigation from '@/components/layout/breadcrumbs.vue'
import { useSettingsStore } from '@/stores'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const router = useRouter()
const settingsStore = useSettingsStore()
const { themeColor } = storeToRefs(settingsStore)
const view = computed(() => router.currentRoute.value.name)
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
    <div v-if="view !== 'lock'" class="app-options">
      <Button
        small
        icon="search"
        :title="t('common.actions.search')"
        :disabled="!isWindowActive"
        @click="router.push({ name: 'search' })"
      />
      <Button
        small
        icon="add-note"
        :title="t('notes.actions.addNote')"
        :disabled="!isWindowActive"
        @click="router.push({ name: 'add_note' })"
      />
      <Button
        small
        icon="settings"
        :title="t('views.settings.title')"
        :disabled="!isWindowActive"
        @click="router.push({ name: 'settings' })"
      />
      <Button
        small
        icon="lock"
        :title="t('common.actions.lock')"
        :disabled="!isWindowActive"
        @click="router.push({ name: 'lock' })"
      />
    </div>
    <div class="separator"></div>
    <div class="window-options">
      <!-- <button class="window-button" @click="minimize">
        <div class="icon">
          <Icon name="minimize" :size="16" :color="themeColor.foreground_200.value" />
        </div>
      </button>
      <button class="window-button" @click="maximize">
        <div class="icon">
          <Icon :name="maximizeIcon" :size="16" :color="themeColor.foreground_200.value" />
        </div>
      </button>
      <button class="window-button" @click="exit">
        <div class="icon">
          <Icon name="cancel" :size="16" :color="themeColor.foreground_200.value" />
        </div>
      </button> -->
      <div class="native-options-spacer"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.window-title-bar {
  height: 41px;
  background: var(--background_600);
  display: flex;
  min-width: 0;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  overflow: hidden;
  -webkit-app-region: drag;
  border-bottom: 1px solid var(--background_200);
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
    background-color: var(--background_200);
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
      background-color: var(--background_600);
      outline: none;

      &:hover,
      &:focus-visible {
        background: var(--background_400);
      }

      &:last-child:hover,
      &:last-child:focus-visible {
        background-color: var(--red);
      }
    }
  }

  .native-options-spacer {
    width: 135px;
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
    background: var(--background_500);
  }
}
</style>
