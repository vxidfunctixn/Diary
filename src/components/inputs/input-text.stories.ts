import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputText from './input-text.vue'

const meta: Meta<typeof InputText> = {
  title: 'Inputs/InputText',
  component: InputText,
  tags: ['autodocs'],
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
    placeholder: 'Wpisz tekst...'
  }
}

export const WithValue: Story = {
  args: {
    name: 'username',
    value: 'Jan Kowalski',
    placeholder: 'Wpisz imię i nazwisko'
  }
}

export const WithInfoText: Story = {
  args: {
    name: 'email',
    value: '',
    placeholder: 'Wpisz adres email',
    infoText: 'Adres email musi być poprawny'
  }
}

export const Password: Story = {
  args: {
    name: 'password',
    value: 'sekretnehaslo123',
    placeholder: 'Wpisz hasło',
    password: true
  }
}

export const PasswordWithInfo: Story = {
  args: {
    name: 'password',
    value: '',
    placeholder: 'Wpisz hasło',
    password: true,
    infoText: 'Hasło musi mieć co najmniej 8 znaków'
  }
}
