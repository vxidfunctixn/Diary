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
          'Komponent InputContent to bogaty edytor tekstu z możliwością formatowania (pogrubienie, kursywa, podkreślenie, przekreślenie, linki, zaznaczenia). Wspiera również interakcję Alt+klik do otwierania linków.'
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
    modelValue: ''
  },
  parameters: {
    docs: {
      description: {
        story: 'Pusty edytor tekstu gotowy do wprowadzania treści.'
      }
    }
  }
}

export const WithPlainText: Story = {
  args: {
    modelValue: 'To jest zwykły tekst bez formatowania.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Edytor z prostym tekstem bez formatowania.'
      }
    }
  }
}

export const WithFormattedText: Story = {
  args: {
    modelValue:
      'To jest <b>pogrubiony</b> tekst, a to jest <i>kursywa</i>. Można też używać <u>podkreślenia</u> i <s>przekreślenia</s>.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Edytor z tekstem zawierającym różne formatowania.'
      }
    }
  }
}

export const WithLink: Story = {
  args: {
    modelValue:
      'Sprawdź naszą stronę: <a href="https://example.com">example.com</a>. Użyj Alt+klik aby otworzyć link.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Edytor z linkiem. Alt+klik otwiera link w nowej karcie.'
      }
    }
  }
}

export const WithHighlight: Story = {
  args: {
    modelValue: 'To jest <mark>zaznaczony tekst</mark> w edytorze.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Edytor z zaznaczonym (podświetlonym) tekstem.'
      }
    }
  }
}

export const ComplexContent: Story = {
  args: {
    modelValue:
      '<b>Ważne informacje:</b><br><br>1. Możesz używać <i>różnych</i> <u>stylów</u> formatowania<br>2. <mark>Podświetlaj</mark> ważne fragmenty<br>3. Dodawaj <a href="https://example.com">linki</a><br>4. <s>Przekreślaj</s> nieaktualne informacje'
  },
  parameters: {
    docs: {
      description: {
        story: 'Edytor z kompleksową zawartością wykorzystującą wszystkie dostępne formatowania.'
      }
    }
  }
}
