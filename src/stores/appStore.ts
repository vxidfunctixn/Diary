import { defineStore } from 'pinia'

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
  ABOUT: 'about'
} as const

export type ViewType = (typeof VIEW)[keyof typeof VIEW]

export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system'
} as const

export type ThemeType = (typeof THEME)[keyof typeof THEME]

interface AppState {
  view: ViewType
  nativeTheme: ThemeType
  selected_day: number
}

const datenow = new Date(Date.now())
const today = new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate())

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    view: VIEW.HOME,
    nativeTheme: THEME.DARK,
    selected_day: today.valueOf()
  }),
  actions: {
    setView(view: ViewType): void {
      this.view = view
    },
    async setNativeTheme(theme: 'dark' | 'light'): Promise<void> {
      this.nativeTheme = theme
    },
    setSelectedDay(date: number): void {
      this.selected_day = date
    }
  }
})
