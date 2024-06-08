import { defineStore } from 'pinia'
import { Theme } from '@/theme'

export const VIEW = {
  HOME: 'home',
  NOTE_LIST: 'note_list',
  SEARCH: 'search',
  MONTH: 'month',
  YEAR: 'year',
  SETTINGS: 'settings',
  LOCK: 'lock',
  EDIT_NOTE: 'edit_note',
  ABOUT: 'about',
}

export const REQUIRE_PASSWORD = {
  EVERY_LAUNCH: 'every_launch',
  EVERY_DAY: 'every_day',
  ON_STARTUP: 'on_startup',
  AFTER_LOCK: 'after_lock'
}

export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
}

const datenow = new Date(Date.now())
const today = new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate())

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    app: {
      view: VIEW.HOME,
      nativeTheme: 'dark',
      selected_day: today.valueOf()
    },
    settings: {
      diary_name: 'Nazwa dziennika',
      reminder: true,
      remind_time: new Date().setHours(8, 5, 0, 0),
      password: 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db',
      require_password: REQUIRE_PASSWORD.AFTER_LOCK,
      theme: THEME.DARK,
      theme_hue: 144,
      standby: true,
      quick_note_shortcut: [
        {code: 91, key: "Meta"},
        {code: 16, key: "Shift"},
        {code: 78, key: "N"}
      ]
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
    theme: state => {
      if(state.settings.theme === THEME.SYSTEM) {
        return state.app.nativeTheme
      } else {
        return state.settings.theme === THEME.DARK ? 'dark' : 'light'
      }
    },
    themeColor: state => {
      const mode = state.theme
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
    },
    async setNativeTheme(theme) {
      this.app.nativeTheme = theme
    },
    setSelectedDay(date) {
      this.app.selected_day = date
    }
  },
})