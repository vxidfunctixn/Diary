import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputText from './input-text.vue'

const meta: Meta<typeof InputText> = {
  title: 'Inputs/InputText',
  component: InputText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputText służy do wprowadzania tekstu lub haseł. Wspiera walidację, placeholder oraz dodatkowy tekst informacyjny.'
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
      description: 'Wartość pola'
    },
    placeholder: {
      control: 'text',
      description: 'Tekst zastępczy'
    },
    infoText: {
      control: 'text',
      description: 'Informacyjny tekst pomocniczy'
    },
    password: {
      control: 'boolean',
      description: 'Czy pole jest typu hasło'
    }
  }
}

export default meta
type Story = StoryObj<typeof InputText>

export const Default: Story = {
  args: {
    name: 'username',
    value: '',
    placeholder: 'Wpisz tekst...',
    password: false,
    infoText: ''
  },
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy wariant komponentu z pustym polem i placeholderem.'
      }
    }
  }
}

export const WithValue: Story = {
  args: {
    name: 'username',
    value: 'Jan Kowalski',
    placeholder: 'Wpisz imię i nazwisko'
  },
  parameters: {
    docs: {
      description: {
        story: 'Pole tekstowe z wcześniej wypełnioną wartością.'
      }
    }
  }
}

export const WithInfoText: Story = {
  args: {
    name: 'email',
    value: '',
    placeholder: 'Wpisz adres email',
    infoText: 'Adres email musi być poprawny'
  },
  parameters: {
    docs: {
      description: {
        story: 'Pole tekstowe z dodatkowym tekstem informacyjnym wyświetlanym pod polem.'
      }
    }
  }
}

export const Password: Story = {
  args: {
    name: 'password',
    value: 'sekretnehaslo123',
    placeholder: 'Wpisz hasło',
    password: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Pole hasła z ukrytymi znakami.'
      }
    }
  }
}
