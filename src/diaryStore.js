import { defineStore } from 'pinia'

export const VIEW = {
  COCKPIT: 'cockpit',
}

export const REQUIRE_PASSWORD = {
  EVERY_LAUNCH: 'Przy każdym uruchomieniu',
  EVERY_DAY: 'Raz dziennie',
  ON_STARTUP: 'Po starcie systemu',
  AFTER_LOCK: 'Tylko po zablokowaniu'
}

export const THEME = {
  DARK: 'Ciemny',
  LIGHT: 'Jasny',
  SYSTEM: 'Tak jak system',
}

export class Color {
  constructor(h, s, l, a = '100%') {
    this.h = h
    this.s = s
    this.l = l
    this.hsl = `hsl(${h}, ${s}, ${l})`
    this.hsla = `hsla(${h}, ${s}, ${l}, ${a})`
  }
}

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    app: {
      view: VIEW.COCKPIT
    },
    settings: {
      diary_name: 'Nazwa dziennika',
      reminder: true,
      remind_time: new Date().setHours(21, 30, 0, 0),
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
      const hue = state.settings.theme_hue
      if(mode === 'dark') {
        return {
          F1:   new Color(hue, '10%', '85%'),
          F1T:  new Color(hue, '10%', '85%', '50%'),
          F2:   new Color(hue, '8%', '30%'),
          HL1:  new Color(hue, '25%', '19%'),
          HL2:  new Color(hue, '26%', '14%'),
          HL3:  new Color(hue, '35%', '11%'),
          BG1:  new Color(hue, '36%', '11%'),
          BG2:  new Color(hue, '42%', '9%'),
          BG2T: new Color(hue, '42%', '9%', '80%'),
          BG3:  new Color(hue, '24%', '8%'),
          BG4:  new Color(hue, '42%', '5%'),
          A1:   new Color(hue, '88%', '57%'),
        }
      } else {
        return {
          F1:   new Color(hue, '10%', '85%'),
          F2:   new Color(hue, '8%', '30%'),
          HL1:  new Color(hue, '25%', '19%'),
          HL2:  new Color(hue, '26%', '14%'),
          HL3:  new Color(hue, '35%', '11%'),
          BG1:  new Color(hue, '36%', '11%'),
          BG2:  new Color(hue, '42%', '9%'),
          BG2T: new Color(hue, '42%', '9%', '80%'),
          BG3:  new Color(hue, '24%', '8%'),
          BG4:  new Color(hue, '42%', '5%'),
          A1:   new Color(hue, '88%', '57%'),
        }
      }
    }
  },
  actions: {
    setView(view) {
      this.app.view = view
    }
  },
})