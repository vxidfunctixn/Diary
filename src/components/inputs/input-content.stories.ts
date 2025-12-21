import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputContent from './input-content.vue'

const meta: Meta<typeof InputContent> = {
  title: 'Inputs/InputContent',
  component: InputContent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputContent to bogaty edytor tekstu używany w widoku edytora notatek. Wspiera formatowanie: pogrubienie, kursywa, podkreślenie, przekreślenie, linki, zaznaczenia. Dane są przechowywane w formacie Markdown i przekształcane na HTML podczas edycji. Funkcje konwersji (htmlToMarkdown, markdownToHtml) znajdują się w utils.ts. Obsługuje również Alt+klik do otwierania linków.'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Zawartość HTML edytora'
    }
  }
}

export default meta
type Story = StoryObj<typeof InputContent>

export const Default: Story = {
  args: {
    modelValue: `
      1. Edytor z wszystkimi opcjami formatowania:<br>
      2. <b>pogrubiony</b><br>
      3. <i>kursywa</i><br>
      4. <u>podkreślenie</u><br>
      5. <s>przekreślenie</s><br>
      6. <a href="https://example.com">link</a><br>
      7. <mark>zaznaczenie</mark>`
  },
  parameters: {
    docs: {
      description: {
        story: 'Edytor prezentujący wszystkie dostępne opcje formatowania tekstu.'
      }
    }
  }
}

export const Bold: Story = {
  args: {
    modelValue: 'Ten tekst jest <b>pogrubiony</b> aby podkreślić wagę.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Przykład użycia pogrubienia tekstu.'
      }
    }
  }
}

export const Italic: Story = {
  args: {
    modelValue: 'Ten tekst jest napisany <i>kursywą</i> dla wyróżnienia.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Przykład użycia kursywy.'
      }
    }
  }
}

export const Underline: Story = {
  args: {
    modelValue: 'Ten fragment tekstu jest <u>podkreślony</u> dla uwydatnienia.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Przykład użycia podkreślenia.'
      }
    }
  }
}

export const Strikethrough: Story = {
  args: {
    modelValue: 'Ten tekst został <s>przekreślony</s> jako nieaktualny.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Przykład użycia przekreślenia.'
      }
    }
  }
}

export const Link: Story = {
  args: {
    modelValue: 'Odwiedź <a href="https://example.com">naszą stronę</a> aby dowiedzieć się więcej.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Przykład dodania linku. Alt+klik otwiera link w nowej karcie.'
      }
    }
  }
}

export const Mark: Story = {
  args: {
    modelValue: 'To jest <mark>zaznaczony tekst</mark> wymagający uwagi.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Przykład użycia zaznaczenia (podświetlenia) tekstu.'
      }
    }
  }
}
