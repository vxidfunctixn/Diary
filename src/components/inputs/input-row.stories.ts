import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputRow from './input-row.vue'
import InputText from './input-text.vue'

const meta: Meta<typeof InputRow> = {
  title: 'Inputs/InputRow',
  component: InputRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputRow służy jako kontener do wyświetlania pól formularza w układzie dwukolumnowym. Lewa kolumna zawiera tytuł, prawa kolumna zawiera pole input (slot).'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Tytuł wyświetlany w lewej kolumnie'
    }
  }
}

export default meta
type Story = StoryObj<typeof InputRow>

export const Default: Story = {
  args: {
    title: 'Nazwa użytkownika'
  },
  render: args => ({
    components: { InputRow, InputText },
    setup() {
      return { args }
    },
    template: `
      <InputRow :title="args.title">
        <InputText name="username" placeholder="Wpisz nazwę użytkownika" />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy wiersz formularza z tytułem i polem tekstowym.'
      }
    }
  }
}

export const MultipleRows: Story = {
  render: () => ({
    components: { InputRow, InputText },
    template: `
      <div>
        <InputRow title="Imię">
          <InputText name="firstName" placeholder="Jan" />
        </InputRow>
        <InputRow title="Nazwisko">
          <InputText name="lastName" placeholder="Kowalski" />
        </InputRow>
        <InputRow title="Email">
          <InputText name="email" placeholder="jan.kowalski@example.com" />
        </InputRow>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Wiele wierszy formularza ułożonych jeden pod drugim.'
      }
    }
  }
}

export const LongTitle: Story = {
  args: {
    title: 'Adres email do powiadomień'
  },
  render: args => ({
    components: { InputRow, InputText },
    setup() {
      return { args }
    },
    template: `
      <InputRow :title="args.title">
        <InputText name="email" placeholder="email@example.com" />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Wiersz formularza z dłuższym tytułem.'
      }
    }
  }
}

export const ShortTitle: Story = {
  args: {
    title: 'PIN'
  },
  render: args => ({
    components: { InputRow, InputText },
    setup() {
      return { args }
    },
    template: `
      <InputRow :title="args.title">
        <InputText name="pin" placeholder="0000" />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Wiersz formularza z krótkim tytułem.'
      }
    }
  }
}
