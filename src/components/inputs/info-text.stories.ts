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
