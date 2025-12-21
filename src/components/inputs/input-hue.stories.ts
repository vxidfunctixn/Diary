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
    name: 'hue',
    value: 172,
    infoText: ''
  },
  parameters: {
    docs: {
      description: {
        story: 'Suwak odcienia ustawiony na wartość 0 (czerwony).'
      }
    }
  }
}

export const WithInfoText: Story = {
  args: {
    name: 'hue',
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
