import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Clock from './clock.vue'

const meta: Meta<typeof Clock> = {
  title: 'Inputs/Clock',
  component: Clock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent Clock służy do wybierania godziny i minut. Wspiera interakcję za pomocą kółka myszy oraz wizualny zegar analogowy.'
      }
    }
  },
  argTypes: {
    time: {
      control: 'object',
      description: 'Obiekt z właściwościami hours i minutes'
    }
  }
}

export default meta
type Story = StoryObj<typeof Clock>

export const Default: Story = {
  args: {
    time: {
      hours: 12,
      minutes: 0
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Zegar ustawiony na godzinę 12:00.'
      }
    }
  }
}
