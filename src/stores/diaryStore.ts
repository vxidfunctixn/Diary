import { defineStore } from 'pinia'
import Dexie from 'dexie'
import { v7 as uuidv7 } from 'uuid'
import type { DBNote, DBNoteVersion } from '@/interfaces/store-interface'

export class DiaryDB extends Dexie {
  notes!: Dexie.Table<DBNote, string>
  notes_versions!: Dexie.Table<DBNoteVersion, string>

  constructor(dbName: string) {
    super(dbName)
    this.version(1).stores({
      notes: 'uuid, created_at, modified_at',
      notes_versions: 'uuid, note_id, timestamp'
    })
  }
}

const db = new DiaryDB('diary_db')

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    last_sync: 0
  }),
  getters: {
    lastSyncDate: state => {
      return state.last_sync > 0 ? new Date(state.last_sync) : null
    }
  },
  actions: {
    async getNotes(): Promise<DBNote[]> {
      return await db.notes.orderBy('created_at').reverse().toArray()
    },

    async getNote(uuid: string): Promise<DBNote | undefined> {
      return await db.notes.get(uuid)
    },

    async createNote(content: string): Promise<string> {
      const now = Date.now()
      const uuid = uuidv7()

      await db.notes.add({
        uuid,
        content,
        created_at: now,
        modified_at: now
      })

      return uuid
    },

    async updateNote(uuid: string, content: string): Promise<void> {
      const note = await db.notes.get(uuid)
      if (!note) {
        throw new Error(`Note with uuid ${uuid} not found`)
      }

      await db.notes_versions.add({
        uuid: uuidv7(),
        note_id: uuid,
        content: note.content,
        timestamp: note.modified_at
      })

      const now = Date.now()
      await db.notes.update(uuid, {
        content,
        modified_at: now
      })
    },

    async deleteNote(uuid: string): Promise<void> {
      await db.notes.delete(uuid)
    },

    async getNoteVersions(note_id: string): Promise<DBNoteVersion[]> {
      return await db.notes_versions.where('note_id').equals(note_id).sortBy('timestamp')
    }
  },
  persist: {
    paths: ['last_sync']
  }
})
