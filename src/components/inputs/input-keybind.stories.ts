import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputKeybind from './input-keybind.vue'

const meta: Meta<typeof InputKeybind> = {
  title: 'Inputs/InputKeybind',
  component: InputKeybind,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputKeybind służy do przechwytywania i wyświetlania kombinacji klawiszy. Kliknij pole i naciśnij kombinację klawiszy, aby ją zapisać. ESC anuluje wybór.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nazwa pola'
    },
    value: {
      control: 'object',
      description: 'Tablica obiektów KeyBinding z właściwościami code i key'
    },
    infoText: {
      control: 'text',
      description: 'Informacyjny tekst pomocniczy'
    },
    inputAlign: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Wyrównanie przycisku'
    }
  }
}

export default meta
type Story = StoryObj<typeof InputKeybind>

export const Default: Story = {
  args: {
    name: 'keybind',
    value: [],
    infoText: ''
  },
  parameters: {
    docs: {
      description: {
        story: 'Puste pole do przechwytywania kombinacji klawiszy.'
      }
    }
  }
}

export const AlignedRight: Story = {
  args: {
    name: 'keybind',
    value: [
      { code: 17, key: 'Control' },
      { code: 83, key: 's' }
    ],
    inputAlign: 'right'
  },
  parameters: {
    docs: {
      description: {
        story: 'Pole do przechwytywania kombinacji klawiszy wyrównane do prawej.'
      }
    }
  }
}

export const SingleKey: Story = {
  args: {
    name: 'keybind',
    value: [{ code: 70, key: 'f' }]
  },
  parameters: {
    docs: {
      description: {
        story: 'Pojedynczy klawisz F.'
      }
    }
  }
}

export const CtrlShiftN: Story = {
  args: {
    name: 'keybind',
    value: [
      { code: 17, key: 'Control' },
      { code: 16, key: 'Shift' },
      { code: 78, key: 'n' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Kombinacja Ctrl+Shift+N.'
      }
    }
  }
}

export const WithInfoText: Story = {
  args: {
    name: 'keybind',
    value: [
      { code: 18, key: 'Alt' },
      { code: 80, key: 'p' }
    ],
    infoText: 'Kliknij pole i naciśnij kombinację klawiszy'
  },
  parameters: {
    docs: {
      description: {
        story: 'Pole do przechwytywania kombinacji klawiszy z tekstem informacyjnym.'
      }
    }
  }
}
