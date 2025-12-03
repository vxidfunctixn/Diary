import { defineStore } from 'pinia'
import { Theme } from '@/theme/theme'
import type { ThemeColors } from '@/interfaces/theme'
import { isEqualDate } from './utils'
import type { KeyBinding, Note, AppState, Settings, DiaryState } from '@/interfaces/diary'

// Definiujemy typy
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
} as const

export type ViewType = typeof VIEW[keyof typeof VIEW]

export const REQUIRE_PASSWORD = {
  EVERY_LAUNCH: 'every_launch',
  EVERY_DAY: 'every_day',
  ON_STARTUP: 'on_startup',
  AFTER_LOCK: 'after_lock'
} as const

export type RequirePasswordType = typeof REQUIRE_PASSWORD[keyof typeof REQUIRE_PASSWORD]

export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const

export type ThemeType = typeof THEME[keyof typeof THEME]

const datenow = new Date(Date.now())
const today = new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate())

export const useDiaryStore = defineStore('diary', {
  state: (): DiaryState => ({
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
    notes: [
      {
        id: '1',
        modify: new Date("2024-02-17T15:24:00").valueOf(),
        created: new Date("2024-02-17T15:24:00").valueOf(),
        content: 'Lorem ipsum dolor sit amet',
      },
      {
        id: '2',
        modify: new Date("2024-02-19T08:12:00").valueOf(),
        created: new Date("2024-02-17T16:15:00").valueOf(),
        content: 'Lorem ipsum dolor sit amet',
      },
      {
        id: '3',
        modify: new Date("2024-02-17T19:44:15").valueOf(),
        created: new Date("2024-02-17T19:44:15").valueOf(),
        content: 'Lorem ipsum dolor sit amet',
      },
      {
        id: '4',
        modify: new Date("2024-02-22T01:23:58").valueOf(),
        created: new Date("2024-02-18T18:31:12").valueOf(),
        content: 'Lorem ipsum dolor sit amet',
      },
      {
        id: '5',
        modify: new Date("2024-02-18T23:01:19").valueOf(),
        created: new Date("2024-02-18T23:01:19").valueOf(),
        content: 'Lorem ipsum dolor sit amet',
      },
      {
        id: '6',
        modify: new Date("2024-02-19T23:44:10").valueOf(),
        created: new Date("2024-02-19T23:44:10").valueOf(),
        content: 'Lorem ipsum dolor sit amet',
      },
      {
        id: '7',
        modify: new Date("2024-02-21T20:01:33").valueOf(),
        created: new Date("2024-02-21T20:01:33").valueOf(),
        content: 'Lorem ipsum dolor sit amet',
      },
      {
        id: '8',
        modify: new Date("2024-02-22T21:02:01").valueOf(),
        created: new Date("2024-02-22T21:02:01").valueOf(),
        content: 'Lorem ipsum dolor sit amet',
      },
    ]
  }),
  getters: {
    theme(state): 'dark' | 'light' {
      if(state.settings.theme === THEME.SYSTEM) {
        return state.app.nativeTheme
      } else {
        return state.settings.theme === THEME.DARK ? 'dark' : 'light'
      }
    },
    themeColor(state): ThemeColors {
      // @ts-ignore - this.theme odnosi się do gettera powyżej
      const mode = this.theme
      const theme = new Theme(state.settings.theme_hue)

      if(mode === 'dark') {
        return theme.dark()
      } else {
        return theme.light()
      }
    },
    getNotes: (state) => {
      return (): Note[][] => {
        const notes = addNoteTitle(groupNotes([...state.notes]))
        return notes
      }
    }
  },
  actions: {
    setView(view: ViewType): void {
      this.app.view = view
    },
    saveSettings(form: Partial<Settings>): void {
      for (const [key, value] of Object.entries(form)) {
        if(this.settings[key as keyof Settings] !== undefined) {
          (this.settings as any)[key] = value
        }
      }
    },
    async setNativeTheme(theme: 'dark' | 'light'): Promise<void> {
      this.app.nativeTheme = theme
    },
    setSelectedDay(date: number): void {
      this.app.selected_day = date
    }
  },
})

// Funkcje pomocnicze
function groupNotes(notes: Note[]): Note[][] {
  const result: Note[][] = []
  const day: Note[] = []
  notes.map((note, index) => {
    if(day.length === 0) {
      day.push({ ...note })
    } else {
      if(isEqualDate(note.created, day[0].created)) {
        day.push({ ...note })
      } else {
        result.push([ ...day ])
        day.splice( 0, day.length )
        day.push({ ...note })
      }
    }

    if(index === notes.length - 1 && day.length) {
      result.push([ ...day ])
    }
  })

  return result
}

function addNoteTitle(notes: Note[][]): Note[][] {
  const result = [...notes]

  result.forEach(group => {
    group.forEach((note, index) => {
      const createdDate = new Date(note.created)
      const modifyDate = new Date(note.modify)
      const isModify = !isEqualDate(createdDate, modifyDate)
      let title = `N${index + 1}`
      if(isModify) title += 'M'
      title += ` ${formatDate(createdDate)}`
      if(isModify) title += ` U ${formatDate(modifyDate)}`

      note.title = title
    })
  })

  return result
}

function formatDate(date: Date): string {
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}.${month}.${year}`
}