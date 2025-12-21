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

export const Morning: Story = {
  args: {
    time: {
      hours: 8,
      minutes: 30
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Zegar ustawiony na poranną godzinę 8:30.'
      }
    }
  }
}

export const Evening: Story = {
  args: {
    time: {
      hours: 18,
      minutes: 45
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Zegar ustawiony na wieczorną godzinę 18:45.'
      }
    }
  }
}

export const Midnight: Story = {
  args: {
    time: {
      hours: 0,
      minutes: 0
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Zegar ustawiony na północ 00:00.'
      }
    }
  }
}

export const Noon: Story = {
  args: {
    time: {
      hours: 12,
      minutes: 0
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Zegar ustawiony na południe 12:00.'
      }
    }
  }
}
