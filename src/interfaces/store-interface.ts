// View types
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

// Theme types
export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system'
} as const

export type ThemeType = (typeof THEME)[keyof typeof THEME]

// Password requirement types
export const REQUIRE_PASSWORD = {
  EVERY_LAUNCH: 'every_launch',
  EVERY_DAY: 'every_day',
  ON_STARTUP: 'on_startup',
  AFTER_LOCK: 'after_lock'
} as const

export type RequirePasswordType = (typeof REQUIRE_PASSWORD)[keyof typeof REQUIRE_PASSWORD]

// Interfaces
export interface KeyBinding {
  code: number
  key: string
}

export interface Note {
  id: string
  modify: number
  created: number
  content: string
  title?: string
}

export interface AppState {
  view: ViewType
  nativeTheme: ThemeType
  selected_day: number
}

export interface Settings {
  diary_name: string
  reminder: boolean
  remind_time: number
  password: string
  require_password: RequirePasswordType
  theme: ThemeType
  theme_hue: number
  standby: boolean
  quick_note_shortcut: KeyBinding[]
}

export interface DiaryState {
  notes: Note[]
}
