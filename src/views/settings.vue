<script setup lang="ts">
import Button from '@/components/button.vue'
import InputText from '@/components/inputs/input-text.vue'
import InputTime from '@/components/inputs/input-time.vue'
import InputSwitcher from '@/components/inputs/input-switcher.vue'
import InputRow from '@/components/inputs/input-row.vue'
import InputPassword from '@/components/inputs/input-password.vue'
import InputSelect from '@/components/inputs/input-select.vue'
import InputHue from '@/components/inputs/input-hue.vue'
import InputKeybind from '@/components/inputs/input-keybind.vue'
import { ref, toRaw } from 'vue'
import { useDiaryStore, REQUIRE_PASSWORD, THEME } from '@/diaryStore'
import { isProxyDifferent } from '@/utils'

const diaryStore = useDiaryStore()

const form = ref({ ...diaryStore.settings })
const hasChangedData = ref(false)

function handleUpdate(event) {
  form.value[event.name] = event.value
  hasChangedData.value = isProxyDifferent(form.value, diaryStore.settings)
}

function saveForm() {
  if(isProxyDifferent(form.value, diaryStore.settings)) {
    diaryStore.saveSettings(toRaw(form.value))
    hasChangedData.value = false
  }
}

function resetForm() {
  form.value = { ...diaryStore.settings }
  hasChangedData.value = false
}

const require_password_options = [
  {
    title: 'Przy każdym otwarciu',
    value: REQUIRE_PASSWORD.EVERY_LAUNCH
  },
  {
    title: 'Każdego dnia',
    value: REQUIRE_PASSWORD.EVERY_DAY
  },
  {
    title: 'Przy uruchomieniu systemu',
    value: REQUIRE_PASSWORD.ON_STARTUP
  },
  {
    title: 'Tylko po zablokowaniu',
    value: REQUIRE_PASSWORD.AFTER_LOCK
  }
]

const theme_options = [
  {
    title: 'Ciemny',
    value: THEME.DARK,
  },
  {
    title: 'Jasny',
    value: THEME.LIGHT,
  },
  {
    title: 'Jak w systemie',
    value: THEME.SYSTEM,
  }
]
</script>

<template>
  <div class="settings">
    <form @submit.prevent="saveForm()">
      <InputRow title="Nazwa dziennika">
        <InputText name="diary_name" :value="form.diary_name" @update="handleUpdate($event)"/>
      </InputRow>
      <InputRow title="Przypominaj jeśli zapomnę o napisaniu notatki">
        <InputSwitcher name="reminder" :value="form.reminder" @update="handleUpdate($event)"/>
      </InputRow>
      <InputRow title="Godzina przypomnienia">
        <InputTime name="remind_time" :newValue="form.remind_time" :oldValue="diaryStore.settings.remind_time" @update="handleUpdate($event)"/>
      </InputRow>
      <InputRow title="Hasło do dziennika">
        <InputPassword name="password" :newValue="form.password" :oldValue="diaryStore.settings.password" @update="handleUpdate($event)"/>
      </InputRow>
      <InputRow title="Wymagaj hasła gdy">
        <InputSelect name="require_password" :value="form.require_password" :options="require_password_options" @update="handleUpdate($event)"/>
      </InputRow>
      <InputRow title="Motyw">
        <InputSelect name="theme" :value="form.theme" :options="theme_options" @update="handleUpdate($event)"/>
      </InputRow>
      <InputRow title="Barwa motywu">
        <InputHue name="theme_hue" :value="form.theme_hue" @update="handleUpdate($event)"/>
      </InputRow>
      <InputRow title="Czuwaj od startu systemu">
        <InputSwitcher name="standby" :value="form.standby" @update="handleUpdate($event)"/>
      </InputRow>
      <InputRow title="Skrót szybkiej notatki">
        <InputKeybind name="quick_note_shortcut" :value="form.quick_note_shortcut" @update="handleUpdate($event)"/>
      </InputRow>
    </form>
    <div class="options">
      <Button icon="save" accent :disabled="!hasChangedData" @click="saveForm()">Zapisz</Button>
      <Button v-if="hasChangedData" icon="cancel" @click="resetForm()">Anuluj zmiany</Button>
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