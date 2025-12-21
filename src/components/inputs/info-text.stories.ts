import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InfoText from './info-text.vue'

const meta: Meta<typeof InfoText> = {
  title: 'Inputs/InfoText',
  component: InfoText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InfoText służy do wyświetlania tekstów informacyjnych i podpowiedzi. Zwykle używany pod polami formularzy.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof InfoText>

export const Default: Story = {
  render: () => ({
    components: { InfoText },
    template: '<InfoText>To jest informacja pomocnicza</InfoText>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy tekst informacyjny.'
      }
    }
  }
}

export const ValidationMessage: Story = {
  render: () => ({
    components: { InfoText },
    template: '<InfoText>Pole nie może być puste</InfoText>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tekst informacyjny jako komunikat walidacji.'
      }
    }
  }
}

export const HelpText: Story = {
  render: () => ({
    components: { InfoText },
    template: '<InfoText>Wprowadź adres email w formacie: nazwa@domena.pl</InfoText>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Tekst pomocniczy z instrukcją.'
      }
    }
  }
}

export const LongText: Story = {
  render: () => ({
    components: { InfoText },
    template:
      '<InfoText>To jest dłuższy tekst informacyjny, który może zawierać więcej szczegółów na temat wymagań lub ograniczeń dotyczących danego pola formularza.</InfoText>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dłuższy tekst informacyjny z dodatkowymi szczegółami.'
      }
    }
  }
}
