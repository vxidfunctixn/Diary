<script setup lang="ts">
import Button from '@/components/common/button.vue'
import InputText from '@/components/inputs/input-text.vue'
import InputTime from '@/components/inputs/input-time.vue'
import InputSwitcher from '@/components/inputs/input-switcher.vue'
import InputRow from '@/components/inputs/input-row.vue'
import InputPassword from '@/components/inputs/input-password.vue'
import InputSelect from '@/components/inputs/input-select.vue'
import InputHue from '@/components/inputs/input-hue.vue'
import InputKeybind from '@/components/inputs/input-keybind.vue'
import { ref, toRaw, computed } from 'vue'
import { useSettingsStore, REQUIRE_PASSWORD, THEME } from '@/stores'
import { isProxyDifferent } from '@/utils'
import type { InputUpdateEvent, Settings } from '@/interfaces'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const settingsStore = useSettingsStore()

const form = ref<Settings>({ ...settingsStore.$state })
const hasChangedData = ref(false)

function handleUpdate(event: { name: string; value: unknown }) {
  form.value = { ...form.value, [event.name]: event.value }
  hasChangedData.value = isProxyDifferent(form.value, settingsStore.$state)
}

function saveForm() {
  if (isProxyDifferent(form.value, settingsStore.$state)) {
    settingsStore.saveSettings(toRaw(form.value))
    hasChangedData.value = false
  }
}

function resetForm() {
  form.value = { ...settingsStore.$state }
  hasChangedData.value = false
}

const require_password_options = computed(() => [
  {
    title: t('settings.requirePassword.everyLaunch'),
    value: REQUIRE_PASSWORD.EVERY_LAUNCH
  },
  {
    title: t('settings.requirePassword.everyDay'),
    value: REQUIRE_PASSWORD.EVERY_DAY
  },
  {
    title: t('settings.requirePassword.onStartup'),
    value: REQUIRE_PASSWORD.ON_STARTUP
  },
  {
    title: t('settings.requirePassword.afterLock'),
    value: REQUIRE_PASSWORD.AFTER_LOCK
  }
])

const theme_options = computed(() => [
  {
    title: t('settings.theme.dark'),
    value: THEME.DARK
  },
  {
    title: t('settings.theme.light'),
    value: THEME.LIGHT
  },
  {
    title: t('settings.theme.system'),
    value: THEME.SYSTEM
  }
])
</script>

<template>
  <div class="settings">
    <form @submit.prevent="saveForm()">
      <InputRow :title="t('settings.fields.diaryName')">
        <InputText name="diary_name" :value="form.diary_name" @update="handleUpdate($event)" />
      </InputRow>
      <InputRow :title="t('settings.fields.reminder')">
        <InputSwitcher
          name="reminder"
          :value="form.reminder"
          @update="handleUpdate($event)"
          inputAlign="right"
        />
      </InputRow>
      <InputRow :title="t('settings.fields.remindTime')">
        <InputTime
          name="remind_time"
          :newValue="form.remind_time"
          :oldValue="settingsStore.remind_time"
          @update="handleUpdate($event)"
          inputAlign="right"
        />
      </InputRow>
      <InputRow :title="t('settings.fields.password')">
        <InputPassword
          name="password"
          :newValue="form.password"
          :oldValue="settingsStore.password"
          @update="handleUpdate($event)"
          inputAlign="right"
        />
      </InputRow>
      <InputRow :title="t('settings.fields.requirePassword')">
        <InputSelect
          name="require_password"
          :value="form.require_password"
          :options="require_password_options"
          @update="handleUpdate($event)"
        />
      </InputRow>
      <InputRow :title="t('settings.fields.theme')">
        <InputSelect
          name="theme"
          :value="form.theme"
          :options="theme_options"
          @update="handleUpdate($event)"
        />
      </InputRow>
      <InputRow :title="t('settings.fields.themeHue')">
        <InputHue name="theme_hue" :value="form.theme_hue" @update="handleUpdate($event)" />
      </InputRow>
      <InputRow :title="t('settings.fields.standby')">
        <InputSwitcher
          name="standby"
          :value="form.standby"
          @update="handleUpdate($event)"
          inputAlign="right"
        />
      </InputRow>
      <InputRow :title="t('settings.fields.quickNoteShortcut')">
        <InputKeybind
          name="quick_note_shortcut"
          :value="form.quick_note_shortcut"
          @update="handleUpdate($event)"
          inputAlign="right"
        />
      </InputRow>
    </form>
    <div class="options">
      <Button icon="save" accent :disabled="!hasChangedData" @click="saveForm()">{{
        t('common.actions.save')
      }}</Button>
      <Button v-if="hasChangedData" icon="cancel" @click="resetForm()">{{
        t('common.actions.cancelChanges')
      }}</Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings {
  padding: 24px;
  max-width: var(--CW);
  margin: 0 auto;

  .options {
    margin-top: 12px;
    display: inline-grid;
    grid-auto-flow: column;
    grid-column-gap: 12px;
  }
}
</style>
