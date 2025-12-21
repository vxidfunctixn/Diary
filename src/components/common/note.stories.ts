import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Note from './note.vue'
import type { DBNote } from '@/interfaces/store-interface'

const meta: Meta<typeof Note> = {
  title: 'Common/Note',
  component: Note,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent Note służy do wyświetlania pojedynczej notatki. Wspiera formatowanie markdown, wyświetlanie daty utworzenia oraz akcje edycji i usuwania.'
      }
    }
  },
  argTypes: {
    data: {
      control: 'object',
      description:
        'Obiekt notatki typu DBNote zawierający: uuid (string), content (string - markdown), created_at (number - timestamp), modified_at (number - timestamp)',
      table: {
        type: {
          summary: 'DBNote | undefined'
        }
      }
    },
    stick: {
      control: 'select',
      options: ['top', 'bottom', 'both', undefined],
      description:
        'Określa, która krawędź notatki ma być "przyklejona" do sąsiedniej. Używane do tworzenia ciągłych grup notatek.',
      table: {
        type: { summary: "'top' | 'bottom' | 'both' | undefined" },
        defaultValue: { summary: 'undefined' }
      }
    },
    onDelete: {
      description: 'Event emitowany przy próbie usunięcia notatki. Zwraca uuid notatki.',
      table: {
        type: { summary: '(uuid: string) => void' }
      }
    },
    onEdit: {
      description: 'Event emitowany przy próbie edycji notatki. Zwraca uuid notatki.',
      table: {
        type: { summary: '(uuid: string) => void' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof Note>

const sampleNote: DBNote = {
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  content: 'To jest przykładowa notatka z **pogrubionym tekstem** i *kursywą*.',
  created_at: new Date('2025-12-21T10:30:00').valueOf(),
  modified_at: new Date('2025-12-21T10:30:00').valueOf()
}

const sampleNoteWithMarkdown: DBNote = {
  uuid: '123e4567-e89b-12d3-a456-426614174001',
  content: `# Spotkanie projektowe
## Agenda
- Omówienie postępu prac
- Przegląd backlogu
- Planowanie sprintu

**Ważne:** Wszystkie zadania muszą być zaktualizowane przed spotkaniem.`,
  created_at: new Date('2025-12-21T09:15:00').valueOf(),
  modified_at: new Date('2025-12-21T09:15:00').valueOf()
}

const sampleNoteWithLink: DBNote = {
  uuid: '123e4567-e89b-12d3-a456-426614174002',
  content:
    'Przeczytać dokumentację: [Vue 3 Docs](https://vuejs.org) oraz sprawdzić [Storybook](https://storybook.js.org)',
  created_at: new Date('2025-12-20T16:30:00').valueOf(),
  modified_at: new Date('2025-12-20T16:30:00').valueOf()
}

const sampleShortNote: DBNote = {
  uuid: '123e4567-e89b-12d3-a456-426614174003',
  content: 'Kupić mleko i chleb',
  created_at: new Date('2025-12-20T08:00:00').valueOf(),
  modified_at: new Date('2025-12-20T08:00:00').valueOf()
}

const sampleLongNote: DBNote = {
  uuid: '123e4567-e89b-12d3-a456-426614174004',
  content: `# Notatka z konferencji

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Kluczowe wnioski
1. **Pierwsza obserwacja** - bardzo istotna dla projektu
2. **Druga obserwacja** - wymaga dalszej analizy
3. **Trzecia obserwacja** - ==do natychmiastowego wdrożenia==

Więcej informacji: [dokumentacja](https://example.com)`,
  created_at: new Date('2025-12-19T14:20:00').valueOf(),
  modified_at: new Date('2025-12-19T14:20:00').valueOf()
}

export const Default: Story = {
  args: {
    data: sampleNote
  } as any,

  render: args => ({
    components: { Note },
    setup() {
      return { args }
    },
    template: '<div style="min-height: 200px;"><Note v-bind="args" /></div>'
  }),

  parameters: {
    docs: {
      description: {
        story: 'Podstawowa notatka z prostym tekstem i formatowaniem markdown.'
      },
      source: {
        code: `<Note :data="{
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  content: 'To jest przykładowa notatka z **pogrubionym tekstem** i *kursywą*.',
  created_at: Date.now(),
  modified_at: Date.now()
}" />`
      }
    }
  }
}

export const GroupedNotes: Story = {
  render: () => ({
    components: { Note },
    setup() {
      const group1 = [sampleNote, sampleNoteWithMarkdown, sampleNoteWithLink]
      const group2 = [sampleShortNote, sampleLongNote]
      const handleDelete = (uuid: string) => {
        console.log('Usuwanie notatki:', uuid)
      }
      const handleEdit = (uuid: string) => {
        console.log('Edycja notatki:', uuid)
      }
      return { group1, group2, handleDelete, handleEdit }
    },
    template: `
      <div style="max-width: 800px; margin: 0 auto;">
        <Note
          :data="group1[0]"
          @delete="handleDelete"
          @edit="handleEdit"
          stick="bottom"
        />
        <Note
          :data="group1[1]"
          stick="both"
          @delete="handleDelete"
          @edit="handleEdit"
        />
        <Note
          :data="group1[2]"
          stick="top"
          @delete="handleDelete"
          @edit="handleEdit"
        />

        <Note
          :data="group2[0]"
          @delete="handleDelete"
          @edit="handleEdit"
          stick="bottom"
        />
        <Note
          :data="group2[1]"
          stick="top"
          @delete="handleDelete"
          @edit="handleEdit"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Dwie grupy notatek połączonych za pomocą propsa stick. Notatki w grupie są "przyklejone" do siebie bez marginesów i zaokrągleń między nimi.'
      },
      source: {
        code: `
        <!-- Grupa 1 -->
        <Note :data="note1" stick="bottom" />
        <Note :data="note2" stick="both" />
        <Note :data="note3" stick="top" />

        <!-- Grupa 2 -->
        <Note :data="note4" stick="bottom" />
        <Note :data="note5" stick="top" />`
      }
    }
  }
}
