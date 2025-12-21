import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Calendar from './calendar.vue'

const meta: Meta<typeof Calendar> = {
  title: 'Inputs/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent Calendar służy do wyświetlania kalendarza i wybierania daty. Wspiera nawigację po miesiącach, latach i przedziałach lat.'
      }
    }
  },
  argTypes: {
    date: {
      control: 'number',
      description: 'Timestamp wybranej daty'
    }
  }
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {
    date: Date.now()
  },
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy widok kalendarza z bieżącą datą.'
      }
    }
  }
}

export const SpecificDate: Story = {
  args: {
    date: new Date('2024-12-25').valueOf()
  },
  parameters: {
    docs: {
      description: {
        story: 'Kalendarz z konkretną datą (25 grudnia 2024).'
      }
    }
  }
}

export const NewYearsDay: Story = {
  args: {
    date: new Date('2025-01-01').valueOf()
  },
  parameters: {
    docs: {
      description: {
        story: 'Kalendarz ustawiony na Nowy Rok 2025.'
      }
    }
  }
}

export const SummerDate: Story = {
  args: {
    date: new Date('2025-07-15').valueOf()
  },
  parameters: {
    docs: {
      description: {
        story: 'Kalendarz z datą letnią (15 lipca 2025).'
      }
    }
  }
}
