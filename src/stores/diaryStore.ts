import { defineStore } from 'pinia'
import { isEqualDate } from '@/utils'
import type { Note } from '@/interfaces/diary'

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    notes: [
      {
        id: '1',
        modify: new Date('2024-02-17T15:24:00').valueOf(),
        created: new Date('2024-02-17T15:24:00').valueOf(),
        content: 'Lorem ipsum dolor sit amet'
      },
      {
        id: '2',
        modify: new Date('2024-02-19T08:12:00').valueOf(),
        created: new Date('2024-02-17T16:15:00').valueOf(),
        content: 'Lorem ipsum dolor sit amet'
      },
      {
        id: '3',
        modify: new Date('2024-02-17T19:44:15').valueOf(),
        created: new Date('2024-02-17T19:44:15').valueOf(),
        content: 'Lorem ipsum dolor sit amet'
      },
      {
        id: '4',
        modify: new Date('2024-02-22T01:23:58').valueOf(),
        created: new Date('2024-02-18T18:31:12').valueOf(),
        content: 'Lorem ipsum dolor sit amet'
      },
      {
        id: '5',
        modify: new Date('2024-02-18T23:01:19').valueOf(),
        created: new Date('2024-02-18T23:01:19').valueOf(),
        content: 'Lorem ipsum dolor sit amet'
      },
      {
        id: '6',
        modify: new Date('2024-02-19T23:44:10').valueOf(),
        created: new Date('2024-02-19T23:44:10').valueOf(),
        content: 'Lorem ipsum dolor sit amet'
      },
      {
        id: '7',
        modify: new Date('2024-02-21T20:01:33').valueOf(),
        created: new Date('2024-02-21T20:01:33').valueOf(),
        content: 'Lorem ipsum dolor sit amet'
      },
      {
        id: '8',
        modify: new Date('2024-02-22T21:02:01').valueOf(),
        created: new Date('2024-02-22T21:02:01').valueOf(),
        content: 'Lorem ipsum dolor sit amet'
      }
    ] as Note[]
  }),
  getters: {
    getNotes: state => {
      return (): Note[][] => {
        const notes = addNoteTitle(groupNotes([...state.notes]))
        return notes
      }
    }
  },
  actions: {}
})

// TODO: Do usunięcia, dexie zastąpi tą funkcjonalność
function groupNotes(notes: Note[]): Note[][] {
  const result: Note[][] = []
  const day: Note[] = []
  notes.map((note, index) => {
    if (day.length === 0) {
      day.push({ ...note })
    } else {
      if (isEqualDate(note.created, day[0].created)) {
        day.push({ ...note })
      } else {
        result.push([...day])
        day.splice(0, day.length)
        day.push({ ...note })
      }
    }

    if (index === notes.length - 1 && day.length) {
      result.push([...day])
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
      if (isModify) title += 'M'
      title += ` ${formatDate(createdDate)}`
      if (isModify) title += ` U ${formatDate(modifyDate)}`

      note.title = title
    })
  })

  return result
}

// TODO: przenieść do utils
function formatDate(date: Date): string {
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}.${month}.${year}`
}
