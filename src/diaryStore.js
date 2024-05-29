import { defineStore } from 'pinia'
import { Theme } from '@/theme'
import { toRaw } from 'vue'

export const VIEW = {
  HOME: 'home',
  NOTE_LIST: 'note_list',
  SEARCH: 'search',
  MONTH: 'month',
  YEAR: 'year',
  SETTINGS: 'settings',
  LOCK: 'lock',
  EDIT_NOTE: 'edit_note'
}

export const REQUIRE_PASSWORD = {
  EVERY_LAUNCH: 'Przy każdym uruchomieniu',
  EVERY_DAY: 'Raz dziennie',
  ON_STARTUP: 'Po starcie systemu',
  AFTER_LOCK: 'Tylko po zablokowaniu'
}

export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
}

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    app: {
      view: VIEW.HOME
    },
    settings: {
      diary_name: 'Nazwa dziennika',
      reminder: true,
      remind_time: new Date().setHours(8, 5, 0, 0),
      password: 'Testowe123',
      require_password: REQUIRE_PASSWORD.AFTER_LOCK,
      theme: THEME.DARK,
      theme_hue: 144,
      standby: true,
      quick_note_shortcut: 'Windows+Shift+N'
    },
    tags: [
      {
        id: '1',
        name: 'Test',
      }
    ],
    notes: [
      {
        id: '1',
        time: new Date("2019-12-17T03:24:00"),
        created: new Date("2019-12-17T03:24:00"),
        last_modify: null,
        content: '<p>Lorem ipsum <tag id="1">Test</tag></p>',
        tags: ["1"]
      }
    ]
  }),
  getters: {
    themeColorColor: state => {
      if(state.settings.theme === THEME.SYSTEM) {
        return 'dark'
      }
      return state.settings.theme === THEME.DARK ? 'dark' : 'light'
    },
    themeColor: state => {
      const mode = state.themeColorColor
      const theme = new Theme(state.settings.theme_hue)

      if(mode === 'dark') {
        return theme.dark()
      } else {
        return theme.light()
      }
    }
  },
  actions: {
    setView(view) {
      this.app.view = view
    },
    saveSettings(form) {
      for (const [key, value] of Object.entries(form)) {
        if(this.settings[key] !== undefined) this.settings[key] = value
      }
    }
  },
})