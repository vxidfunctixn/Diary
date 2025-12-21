import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Icon from './index.vue'

const meta: Meta<typeof Icon> = {
  title: 'Common/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent Icon służy do renderowania ikon SVG. Dynamicznie ładuje odpowiedni komponent ikony na podstawie przekazanej nazwy. Wspiera różne rozmiary i kolory.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'select',
      options: [
        'add-note',
        'arrow-down',
        'arrow-left',
        'arrow-right',
        'arrow-up',
        'bold',
        'button',
        'cancel',
        'check',
        'clear-format',
        'clock',
        'date',
        'date-range',
        'date-sort-down',
        'date-sort-up',
        'delete',
        'diary',
        'edit-note',
        'hide',
        'info',
        'italic',
        'letter-size',
        'link',
        'lock',
        'mark',
        'maximize',
        'minimize',
        'note',
        'note-list',
        'number-scroll',
        'regex',
        'save',
        'search',
        'settings',
        'show',
        'strikethrough',
        'underline',
        'unlock',
        'unmaximize',
        'whole-word'
      ],
      description: 'Nazwa ikony do załadowania (bez sufixu -icon)'
    },
    size: {
      control: 'number',
      description: 'Rozmiar ikony w pikselach',
      table: {
        defaultValue: { summary: '24' }
      }
    },
    color: {
      control: 'color',
      description: 'Kolor ikony (null = domyślny kolor z motywu)'
    }
  }
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    name: 'note',
    size: 24,
    color: '#d5ddd8'
  },
  parameters: {
    docs: {
      description: {
        story: 'Podstawowa ikona z domyślnym rozmiarem i kolorem z motywu.'
      },
      source: {
        code: '<Icon name="note" />'
      }
    }
  }
}

export const CustomSize: Story = {
  args: {
    name: 'settings',
    size: 48
  },
  parameters: {
    docs: {
      description: {
        story: 'Ikona z niestandardowym rozmiarem 48px.'
      },
      source: {
        code: '<Icon name="settings" :size="48" />'
      }
    }
  }
}

export const CustomColor: Story = {
  args: {
    name: 'save',
    size: 32,
    color: '#4CAF50'
  },
  parameters: {
    docs: {
      description: {
        story: 'Ikona z niestandardowym kolorem zielonym.'
      },
      source: {
        code: '<Icon name="save" :size="32" color="#4CAF50" />'
      }
    }
  }
}

export const AllIcons: Story = {
  render: () => ({
    components: { Icon },
    setup() {
      const icons = [
        'add-note',
        'arrow-down',
        'arrow-left',
        'arrow-right',
        'arrow-up',
        'bold',
        'button',
        'cancel',
        'check',
        'clear-format',
        'clock',
        'date',
        'date-range',
        'date-sort-down',
        'date-sort-up',
        'delete',
        'diary',
        'edit-note',
        'hide',
        'info',
        'italic',
        'letter-size',
        'link',
        'lock',
        'mark',
        'maximize',
        'minimize',
        'note',
        'note-list',
        'number-scroll',
        'regex',
        'save',
        'search',
        'settings',
        'show',
        'strikethrough',
        'underline',
        'unlock',
        'unmaximize',
        'whole-word'
      ]
      return { icons }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 16px;">
        <div v-for="iconName in icons" :key="iconName" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px;">
          <Icon :name="iconName" :size="32" />
          <span style="font-size: 12px; text-align: center;">{{ iconName }}</span>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Galeria wszystkich dostępnych ikon w systemie.'
      },
      source: {
        code: `
          <Icon name="note" />
          <Icon name="add-note" />
          <Icon name="arrow-down" />
          <Icon name="arrow-left" />
          <Icon name="arrow-right" />
          <Icon name="arrow-up" />
          <Icon name="bold" />
          <Icon name="button" />
          <Icon name="cancel" />
          <Icon name="check" />
          <Icon name="clear-format" />
          <Icon name="clock" />
          <Icon name="date" />
          <Icon name="date-range" />
          <Icon name="date-sort-down" />
          <Icon name="date-sort-up" />
          <Icon name="delete" />
          <Icon name="diary" />
          <Icon name="edit-note" />
          <Icon name="hide" />
          <Icon name="info" />
          <Icon name="italic" />
          <Icon name="letter-size" />
          <Icon name="link" />
          <Icon name="lock" />
          <Icon name="mark" />
          <Icon name="maximize" />
          <Icon name="minimize" />
          <Icon name="note-list" />
          <Icon name="number-scroll" />
          <Icon name="regex" />
          <Icon name="save" />
          <Icon name="search" />
          <Icon name="settings" />
          <Icon name="show" />
          <Icon name="strikethrough" />
          <Icon name="underline" />
          <Icon name="unlock" />
          <Icon name="unmaximize" />
          <Icon name="whole-word" />`
      }
    }
  }
}

export const SizesComparison: Story = {
  render: () => ({
    components: { Icon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="text-align: center;">
          <Icon name="settings" :size="16" />
          <div style="margin-top: 8px; font-size: 12px;">16px</div>
        </div>
        <div style="text-align: center;">
          <Icon name="settings" :size="24" />
          <div style="margin-top: 8px; font-size: 12px;">24px</div>
        </div>
        <div style="text-align: center;">
          <Icon name="settings" :size="32" />
          <div style="margin-top: 8px; font-size: 12px;">32px</div>
        </div>
        <div style="text-align: center;">
          <Icon name="settings" :size="48" />
          <div style="margin-top: 8px; font-size: 12px;">48px</div>
        </div>
        <div style="text-align: center;">
          <Icon name="settings" :size="64" />
          <div style="margin-top: 8px; font-size: 12px;">64px</div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Porównanie różnych rozmiarów tej samej ikony.'
      },
      source: {
        code: `
          <Icon name="settings" :size="16" />
          <Icon name="settings" :size="24" />
          <Icon name="settings" :size="32" />
          <Icon name="settings" :size="48" />
          <Icon name="settings" :size="64" />`
      }
    }
  }
}
