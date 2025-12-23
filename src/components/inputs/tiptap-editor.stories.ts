import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TiptapEditor from './tiptap-editor.vue'

const meta: Meta<typeof TiptapEditor> = {
  title: 'Inputs/TiptapEditor',
  component: TiptapEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Komponent TiptapEditor to zaawansowany edytor tekstu oparty na TipTap. Wspiera formatowanie tekstu (pogrubienie, kursywa, podkreślenie, przekreślenie), linki, oraz wyróżnienia. Obsługuje specjalną funkcję Alt+klik do otwierania linków.'
      },
      story: {
        inline: false,
        iframeHeight: 300
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Zawartość edytora w formacie HTML'
    }
  }
}

export default meta
type Story = StoryObj<typeof TiptapEditor>

export const Default: Story = {
  args: {
    modelValue: '<p>Wpisz swój tekst tutaj...</p>'
  },
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy edytor TipTap z pustą treścią.'
      }
    }
  }
}

export const WithFormattedText: Story = {
  args: {
    modelValue:
      '<p>To jest <strong>pogrubiony</strong> tekst, a to <em>kursywa</em>. Możesz też użyć <u>podkreślenia</u> lub <s>przekreślenia</s>.</p>'
  },
  parameters: {
    docs: {
      description: {
        story: 'Edytor z różnymi stylami formatowania tekstu.'
      }
    }
  }
}

export const WithLinks: Story = {
  args: {
    modelValue:
      '<p>Sprawdź ten <a target="_blank" rel="noopener noreferrer" href="https://github.com">link do GitHub</a>. Przytrzymaj Alt i kliknij, aby otworzyć.</p>'
  },
  parameters: {
    docs: {
      description: {
        story:
          'Edytor z linkami. Linki są domyślnie nieklikalne - przytrzymaj Alt i kliknij, aby otworzyć link w nowej karcie.'
      }
    }
  }
}

export const WithHighlight: Story = {
  args: {
    modelValue:
      '<p>Ten tekst zawiera <mark class="highlight-mark">wyróżniony fragment</mark> do zaznaczenia ważnych informacji.</p>'
  },
  parameters: {
    docs: {
      description: {
        story: 'Edytor z wyróżnionym tekstem (highlight).'
      }
    }
  }
}

export const ComplexExample: Story = {
  args: {
    modelValue: `
      <p>To jest przykład bardziej złożonego tekstu z wieloma formatowaniami.</p>
      <p><strong>Pogrubiony nagłówek</strong></p>
      <p>To jest <em>kursywa</em> z <u>podkreśleniem</u> i <s>przekreśleniem</s>.</p>
      <p>Link do dokumentacji: <a target="_blank" rel="noopener noreferrer" href="https://tiptap.dev">TipTap Documentation</a></p>
      <p>Ważna informacja: <mark class="highlight-mark">ta sekcja jest wyróżniona</mark> dla łatwego odnalezienia.</p>
      <p>Możesz łączyć formatowania: <strong><em><u>pogrubiona kursywa z podkreśleniem</u></em></strong>.</p>
    `
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompleksowy przykład pokazujący różne możliwości formatowania tekstu w edytorze.'
      }
    }
  }
}
