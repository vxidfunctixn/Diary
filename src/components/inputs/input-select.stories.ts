import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputSelect from './input-select.vue'

const meta: Meta<typeof InputSelect> = {
  title: 'Inputs/InputSelect',
  component: InputSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputSelect służy do wybierania jednej opcji z listy rozwijanej. Wspiera nawigację klawiaturą i wyświetla aktualnie wybraną wartość.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nazwa pola'
    },
    value: {
      control: 'text',
      description: 'Wartość wybranej opcji'
    },
    options: {
      control: 'object',
      description: 'Tablica obiektów z właściwościami value i title'
    },
    infoText: {
      control: 'text',
      description: 'Informacyjny tekst pomocniczy'
    }
  }
}

export default meta
type Story = StoryObj<typeof InputSelect>

export const Default: Story = {
  args: {
    name: 'language',
    value: 'pl',

    options: [
      { value: 'pl', title: 'Polski' },
      { value: 'en', title: 'English' },
      { value: 'de', title: 'Deutsch' }
    ],

    infoText: ''
  },
  parameters: {
    docs: {
      description: {
        story: 'Podstawowa lista rozwijana z wyborem języka.'
      }
    }
  }
}

export const WithInfoText: Story = {
  args: {
    name: 'theme',
    value: 'dark',
    options: [
      { value: 'light', title: 'Jasny' },
      { value: 'dark', title: 'Ciemny' },
      { value: 'auto', title: 'Automatyczny' }
    ],
    infoText: 'Wybierz preferowany motyw interfejsu'
  },
  parameters: {
    docs: {
      description: {
        story: 'Lista rozwijana z tekstem informacyjnym.'
      }
    }
  }
}
