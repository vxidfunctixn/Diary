import { defineStore } from 'pinia'
import { THEME, type AppState } from '@/interfaces/store-interface'

const datenow = new Date(Date.now())
const today = new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate())

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    nativeTheme: THEME.DARK,
    selected_day: today.valueOf(),
    draft: '',
    editedContent: '',
    editing_note_uuid: null
  }),
  actions: {
    async setNativeTheme(theme: 'dark' | 'light'): Promise<void> {
      this.nativeTheme = theme
    },
    setSelectedDay(date: number): void {
      this.selected_day = date
    },
    setDraft(content: string): void {
      this.draft = content
    },
    setEditedContent(content: string): void {
      this.editedContent = content
    },
    setEditingNoteUuid(uuid: string | null): void {
      this.editing_note_uuid = uuid
    }
  },
  persist: true
})
