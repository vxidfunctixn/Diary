import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputPassword from './input-password.vue'

const meta: Meta<typeof InputPassword> = {
  title: 'Inputs/InputPassword',
  component: InputPassword,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputPassword służy do zmiany hasła. Otwiera modal z dwoma polami do wprowadzenia i potwierdzenia nowego hasła. Waliduje długość hasła (4-24 znaki) i zgodność obu pól.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nazwa pola'
    },
    oldValue: {
      control: 'text',
      description: 'Stara wartość hasła (hash)'
    },
    newValue: {
      control: 'text',
      description: 'Nowa wartość hasła (hash)'
    },
    infoText: {
      control: 'text',
      description: 'Informacyjny tekst pomocniczy'
    }
  }
}

export default meta
type Story = StoryObj<typeof InputPassword>

export const Default: Story = {
  args: {
    name: 'password',
    oldValue: '',
    newValue: ''
  },
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy komponent do zmiany hasła bez ustawionego hasła.'
      }
    }
  }
}

export const WithExistingPassword: Story = {
  args: {
    name: 'password',
    oldValue: 'abc123hash',
    newValue: 'abc123hash'
  },
  parameters: {
    docs: {
      description: {
        story: 'Komponent z już ustawionym hasłem (brak gwiazdki).'
      }
    }
  }
}

export const ModifiedPassword: Story = {
  args: {
    name: 'password',
    oldValue: 'abc123hash',
    newValue: 'xyz789hash'
  },
  parameters: {
    docs: {
      description: {
        story: 'Komponent ze zmienionym hasłem (oznaczone gwiazdką).'
      }
    }
  }
}

export const WithInfoText: Story = {
  args: {
    name: 'password',
    oldValue: '',
    newValue: '',
    infoText: 'Hasło chroni Twoje dane przed nieautoryzowanym dostępem'
  },
  parameters: {
    docs: {
      description: {
        story: 'Komponent do zmiany hasła z tekstem informacyjnym.'
      }
    }
  }
}

export const NewPasswordSet: Story = {
  args: {
    name: 'password',
    oldValue: '',
    newValue: 'newpasswordhash'
  },
  parameters: {
    docs: {
      description: {
        story: 'Komponent z nowo ustawionym hasłem (gwiazdka wskazuje zmianę).'
      }
    }
  }
}
