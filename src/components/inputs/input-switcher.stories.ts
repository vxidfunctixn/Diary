import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputSwitcher from './input-switcher.vue'

const meta: Meta<typeof InputSwitcher> = {
  title: 'Inputs/InputSwitcher',
  component: InputSwitcher,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputSwitcher to przełącznik typu checkbox z animowanym przejściem. Służy do włączania/wyłączania opcji binarnych.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nazwa pola'
    },
    value: {
      control: 'boolean',
      description: 'Stan przełącznika (włączony/wyłączony)'
    },
    infoText: {
      control: 'text',
      description: 'Informacyjny tekst pomocniczy'
    },
    inputAlign: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Wyrównanie przełącznika'
    }
  }
}

export default meta
type Story = StoryObj<typeof InputSwitcher>

export const Default: Story = {
  args: {
    name: 'notifications',
    value: false,
    infoText: ''
  },
  parameters: {
    docs: {
      description: {
        story: 'Przełącznik w stanie wyłączonym.'
      }
    }
  }
}

export const AlignedRight: Story = {
  args: {
    name: 'feature',
    value: false,
    inputAlign: 'right'
  },
  parameters: {
    docs: {
      description: {
        story: 'Przełącznik wyrównany do prawej.'
      }
    }
  }
}

export const Enabled: Story = {
  args: {
    name: 'notifications',
    value: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Przełącznik w stanie włączonym.'
      }
    }
  }
}

export const WithInfoText: Story = {
  args: {
    name: 'autoSave',
    value: true,
    infoText: 'Automatycznie zapisuj zmiany podczas pisania'
  },
  parameters: {
    docs: {
      description: {
        story: 'Przełącznik z tekstem informacyjnym.'
      }
    }
  }
}
