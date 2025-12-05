import { defineStore } from 'pinia'
import { Theme } from '@/theme/theme'
import type { ThemeColors } from '@/interfaces/theme'
import { REQUIRE_PASSWORD, THEME, type Settings } from '@/interfaces/store'
import { useAppStore } from './appStore'

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    diary_name: 'Nazwa dziennika',
    reminder: true,
    remind_time: new Date().setHours(8, 5, 0, 0),
    password:
      'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db',
    require_password: REQUIRE_PASSWORD.AFTER_LOCK,
    theme: THEME.DARK,
    theme_hue: 144,
    standby: true,
    quick_note_shortcut: [
      { code: 91, key: 'Meta' },
      { code: 16, key: 'Shift' },
      { code: 78, key: 'N' }
    ]
  }),
  getters: {
    currentTheme(state): 'dark' | 'light' {
      const appStore = useAppStore()
      if (state.theme === THEME.SYSTEM) {
        return appStore.nativeTheme === THEME.DARK ? 'dark' : 'light'
      } else {
        return state.theme === THEME.DARK ? 'dark' : 'light'
      }
    },
    themeColor(state): ThemeColors {
      // @ts-ignore - this.resolvedTheme odnosi się do gettera powyżej
      const mode = this.currentTheme
      const theme = new Theme(state.theme_hue)

      if (mode === 'dark') {
        return theme.dark()
      } else {
        return theme.light()
      }
    }
  },
  actions: {
    saveSettings(form: Partial<Settings>): void {
      for (const [key, value] of Object.entries(form)) {
        if (this[key as keyof Settings] !== undefined) {
          ;(this as any)[key] = value
        }
      }
    }
  },
  persist: true
})
