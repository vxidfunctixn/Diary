import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputRow from './input-row.vue'
import InputText from './input-text.vue'
import InputPassword from './input-password.vue'
import InputDate from './input-date.vue'
import InputTime from './input-time.vue'
import InputHue from './input-hue.vue'
import InputSwitcher from './input-switcher.vue'
import InputKeybind from './input-keybind.vue'
import InputSelect from './input-select.vue'

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

export const WithInfoText: Story = {
  render: () => ({
    components: { InputRow, InputText },
    template: `
      <InputRow title="Email">
        <InputText
          name="email"
          placeholder="email@example.com"
          infoText="Podaj adres email do kontaktu"
        />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'InputRow z polem tekstowym zawierającym tekst informacyjny.'
      }
    }
  }
}

export const WithPasswordInput: Story = {
  render: () => ({
    components: { InputRow, InputPassword },
    template: `
      <InputRow title="Hasło">
        <InputPassword name="password" placeholder="Wprowadź hasło" inputAlign="right" />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'InputRow z polem hasła.'
      }
    }
  }
}

export const WithDateInput: Story = {
  render: () => ({
    components: { InputRow, InputDate },
    data() {
      return {
        selectedDate: '2025-12-21'
      }
    },
    template: `
      <InputRow title="Data urodzenia">
        <InputDate name="birthdate" :value="selectedDate" inputAlign="right" />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'InputRow z polem wyboru daty.'
      }
    }
  }
}

export const WithTimeInput: Story = {
  render: () => ({
    components: { InputRow, InputTime },
    data() {
      return {
        selectedTime: { hours: 14, minutes: 30 }
      }
    },
    template: `
      <InputRow title="Godzina przypomnienia">
        <InputTime name="reminderTime" :value="selectedTime" inputAlign="right" />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'InputRow z polem wyboru czasu.'
      }
    }
  }
}

export const WithHueInput: Story = {
  render: () => ({
    components: { InputRow, InputHue },
    data() {
      return {
        hueValue: 180
      }
    },
    template: `
      <InputRow title="Kolor motywu">
        <InputHue name="themeColor" :value="hueValue" />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'InputRow z suwakiem wyboru koloru (hue).'
      }
    }
  }
}

export const WithSwitcherInput: Story = {
  render: () => ({
    components: { InputRow, InputSwitcher },
    data() {
      return {
        isEnabled: true
      }
    },
    template: `
      <InputRow title="Powiadomienia">
        <InputSwitcher name="notifications" :value="isEnabled" inputAlign="right" />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'InputRow z przełącznikiem (switch).'
      }
    }
  }
}

export const WithKeybindInput: Story = {
  render: () => ({
    components: { InputRow, InputKeybind },
    data() {
      return {
        keybind: [
          {
            code: 17,
            key: 'Control'
          },
          {
            code: 16,
            key: 'Shift'
          },
          {
            code: 78,
            key: 'n'
          }
        ]
      }
    },
    template: `
      <InputRow title="Skrót klawiszowy">
        <InputKeybind name="shortcut" :value="keybind" inputAlign="right" />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'InputRow z polem do przypisania skrótu klawiszowego.'
      }
    }
  }
}

export const WithSelectInput: Story = {
  render: () => ({
    components: { InputRow, InputSelect },
    data() {
      return {
        selectedValue: 'option2',
        options: [
          { value: 'option1', title: 'Opcja 1' },
          { value: 'option2', title: 'Opcja 2' },
          { value: 'option3', title: 'Opcja 3' }
        ]
      }
    },
    template: `
      <InputRow title="Wybierz opcję">
        <InputSelect
          name="choice"
          :value="selectedValue"
          :options="options"
        />
      </InputRow>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'InputRow z polem wyboru (select).'
      }
    }
  }
}

export const CompleteForm: Story = {
  render: () => ({
    components: { InputRow, InputText, InputDate, InputSwitcher },
    data() {
      return {
        birthdate: '1990-01-15',
        darkMode: false
      }
    },
    template: `
      <div>
        <InputRow title="Imię i nazwisko">
          <InputText name="fullName" placeholder="Jan Kowalski" />
        </InputRow>
        <InputRow title="Data urodzenia">
          <InputDate name="birthdate" :value="birthdate" inputAlign="right" />
        </InputRow>
        <InputRow title="Tryb ciemny">
          <InputSwitcher name="darkMode" :value="darkMode" inputAlign="right" />
        </InputRow>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Kompletny formularz z trzema różnymi typami inputów.'
      }
    }
  }
}
