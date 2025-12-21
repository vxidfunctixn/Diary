import type { Meta, StoryObj } from '@storybook/vue3'
import InputTime from './input-time.vue'

const meta: Meta<typeof InputTime> = {
  title: 'Inputs/InputTime',
  component: InputTime,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputTime służy do wybierania czasu. Otwiera modal z zegarem analogowym do precyzyjnego ustawiania godziny i minut.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nazwa pola'
    },
    newValue: {
      control: 'number',
      description: 'Nowa wartość timestamp'
    },
    oldValue: {
      control: 'number',
      description: 'Stara wartość timestamp'
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
type Story = StoryObj<typeof InputTime>

const now = new Date()
const currentTime = new Date().setHours(now.getHours(), now.getMinutes(), 0, 0)

export const Default: Story = {
  args: {
    name: 'time',
    newValue: currentTime,
    infoText: '',
    oldValue: 1766318220000
  },
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy selektor czasu z bieżącą godziną.'
      }
    }
  }
}

export const AlignedRight: Story = {
  args: {
    name: 'time',
    newValue: new Date().setHours(16, 15, 0, 0),
    inputAlign: 'right'
  },
  parameters: {
    docs: {
      description: {
        story: 'Selektor czasu wyrównany do prawej.'
      }
    }
  }
}

export const ModifiedValue: Story = {
  args: {
    name: 'time',
    newValue: new Date().setHours(18, 45, 0, 0),
    oldValue: new Date().setHours(12, 0, 0, 0)
  },
  parameters: {
    docs: {
      description: {
        story: 'Selektor czasu ze zmodyfikowaną wartością (oznaczone gwiazdką).'
      }
    }
  }
}

export const WithInfoText: Story = {
  args: {
    name: 'time',
    newValue: new Date().setHours(14, 0, 0, 0),
    infoText: 'Wybierz preferowaną godzinę'
  },
  parameters: {
    docs: {
      description: {
        story: 'Selektor czasu z tekstem informacyjnym.'
      }
    }
  }
}
