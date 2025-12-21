import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputDate from './input-date.vue'

const meta: Meta<typeof InputDate> = {
  title: 'Inputs/InputDate',
  component: InputDate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputDate służy do wybierania daty. Otwiera modal z kalendarzem i opcjonalnie wyświetla przyciski nawigacji do przechodzenia między dniami.'
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
    controls: {
      control: 'boolean',
      description: 'Czy wyświetlać przyciski nawigacji'
    },
    inputAlign: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Wyrównanie przycisku'
    }
  }
}

export default meta
type Story = StoryObj<typeof InputDate>

export const Default: Story = {
  args: {
    name: 'date',
    newValue: Date.now(),
    controls: false,
    infoText: '',
    oldValue: 1766312922475
  },
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy selektor daty bez przycisków nawigacji.'
      }
    }
  }
}

export const AlignedRight: Story = {
  args: {
    name: 'date',
    newValue: Date.now(),
    controls: false,
    inputAlign: 'right'
  },
  parameters: {
    docs: {
      description: {
        story: 'Selektor daty wyrównany do prawej.'
      }
    }
  }
}

export const ModifiedDate: Story = {
  args: {
    name: 'date',
    newValue: new Date('2025-12-25').valueOf(),
    oldValue: new Date('2025-12-24').valueOf(),
    controls: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Selektor daty ze zmodyfikowaną wartością (oznaczone gwiazdką).'
      }
    }
  }
}

export const WithControls: Story = {
  args: {
    name: 'date',
    newValue: Date.now(),
    controls: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Selektor daty z przyciskami nawigacji do przechodzenia między dniami.'
      }
    }
  }
}

export const WithInfoText: Story = {
  args: {
    name: 'date',
    newValue: Date.now(),
    controls: false,
    infoText: 'Wybierz datę dla swojej notatki.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Selektor daty z tekstem informacyjnym.'
      }
    }
  }
}
