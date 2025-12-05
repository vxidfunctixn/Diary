import { defineStore } from 'pinia'
import { VIEW, THEME, type ViewType, type AppState } from '@/interfaces/store-interface'

const datenow = new Date(Date.now())
const today = new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate())

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    view: VIEW.HOME,
    nativeTheme: THEME.DARK,
    selected_day: today.valueOf(),
    draft: ''
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
    },
    setDraft(content: string): void {
      this.draft = content
    }
  },
  persist: true
})
