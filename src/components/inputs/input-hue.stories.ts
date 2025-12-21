import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputHue from './input-hue.vue'

const meta: Meta<typeof InputHue> = {
  title: 'Inputs/InputHue',
  component: InputHue,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputHue służy do wybierania odcienia koloru (hue) za pomocą suwaka. Zakres wartości od 0 do 360 stopni.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nazwa pola'
    },
    value: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      description: 'Wartość odcienia (0-360)'
    },
    infoText: {
      control: 'text',
      description: 'Informacyjny tekst pomocniczy'
    }
  }
}

export default meta
type Story = StoryObj<typeof InputHue>

export const Default: Story = {
  args: {
    name: 'theme_hue',
    value: 0
  },
  parameters: {
    docs: {
      description: {
        story: 'Suwak odcienia ustawiony na wartość 0 (czerwony).'
      }
    }
  }
}

export const Blue: Story = {
  args: {
    name: 'theme_hue',
    value: 240
  },
  parameters: {
    docs: {
      description: {
        story: 'Suwak odcienia ustawiony na wartość 240 (niebieski).'
      }
    }
  }
}

export const Green: Story = {
  args: {
    name: 'theme_hue',
    value: 120
  },
  parameters: {
    docs: {
      description: {
        story: 'Suwak odcienia ustawiony na wartość 120 (zielony).'
      }
    }
  }
}

export const Purple: Story = {
  args: {
    name: 'theme_hue',
    value: 270
  },
  parameters: {
    docs: {
      description: {
        story: 'Suwak odcienia ustawiony na wartość 270 (fioletowy).'
      }
    }
  }
}

export const WithInfoText: Story = {
  args: {
    name: 'theme_hue',
    value: 180,
    infoText: 'Wybierz kolor przewodni aplikacji'
  },
  parameters: {
    docs: {
      description: {
        story: 'Suwak odcienia z tekstem informacyjnym.'
      }
    }
  }
}

export const Orange: Story = {
  args: {
    name: 'theme_hue',
    value: 30
  },
  parameters: {
    docs: {
      description: {
        story: 'Suwak odcienia ustawiony na wartość 30 (pomarańczowy).'
      }
    }
  }
}
