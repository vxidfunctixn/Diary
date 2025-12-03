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
  view: import('@/stores/appStore').ViewType
  nativeTheme: 'dark' | 'light'
  selected_day: number
}

export interface Settings {
  diary_name: string
  reminder: boolean
  remind_time: number
  password: string
  require_password: import('@/stores/settingsStore').RequirePasswordType
  theme: import('@/stores/appStore').ThemeType
  theme_hue: number
  standby: boolean
  quick_note_shortcut: KeyBinding[]
}

export interface DiaryState {
  app: AppState
  settings: Settings
  notes: Note[]
}
