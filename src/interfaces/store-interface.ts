export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system'
} as const

export type ThemeType = (typeof THEME)[keyof typeof THEME]

export const REQUIRE_PASSWORD = {
  EVERY_LAUNCH: 'every_launch',
  EVERY_DAY: 'every_day',
  ON_STARTUP: 'on_startup',
  AFTER_LOCK: 'after_lock'
} as const

export type RequirePasswordType = (typeof REQUIRE_PASSWORD)[keyof typeof REQUIRE_PASSWORD]

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
  nativeTheme: ThemeType
  selected_day: number
  draft: string
  editedContent: string
  editing_note_uuid: string | null
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
  last_sync: number
}

export interface DBNote {
  uuid: string
  content: string
  created_at: number
  modified_at: number
}

export interface DBNoteVersion {
  uuid: string
  note_id: string
  content: string
  timestamp: number
}
