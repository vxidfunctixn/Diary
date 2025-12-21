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
    }
  }
}

export default meta
type Story = StoryObj<typeof InputSwitcher>

export const Default: Story = {
  args: {
    name: 'notifications',
    value: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Przełącznik w stanie wyłączonym.'
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

export const DarkMode: Story = {
  args: {
    name: 'darkMode',
    value: true,
    infoText: 'Włącz ciemny motyw'
  },
  parameters: {
    docs: {
      description: {
        story: 'Przełącznik do włączania trybu ciemnego.'
      }
    }
  }
}

export const MultipleSettings: Story = {
  render: () => ({
    components: { InputSwitcher },
    template: `
      <div style="display: grid; gap: 16px;">
        <InputSwitcher name="notifications" :value="true" infoText="Powiadomienia push" />
        <InputSwitcher name="sounds" :value="false" infoText="Dźwięki systemowe" />
        <InputSwitcher name="autoUpdate" :value="true" infoText="Automatyczne aktualizacje" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Wiele przełączników w grupie ustawień.'
      }
    }
  }
}
