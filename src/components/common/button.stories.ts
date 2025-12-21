import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from '@/components/common/button.vue'

const meta: Meta<typeof Button> = {
  title: 'Common/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent Button służy do renderowania przycisków. Wspiera różne warianty wizualne (accent, danger, negative), rozmiary oraz ikony.'
      }
    }
  },
  argTypes: {
    icon: {
      control: 'select',
      options: [
        '',
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
      description: 'Nazwa ikony do wyświetlenia w przycisku (bez sufixu -icon)'
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Pozycja ikony względem tekstu',
      table: {
        defaultValue: { summary: "'left'" }
      }
    },
    title: {
      control: 'text',
      description: 'Tekst podpowiedzi (tooltip) wyświetlany przy najechaniu'
    },
    small: {
      control: 'boolean',
      description: 'Określa czy przycisk ma mniejszy rozmiar',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Określa czy przycisk jest nieaktywny',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    accent: {
      control: 'boolean',
      description: 'Wariant z podkreśleniem kolorem głównym motywu',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    danger: {
      control: 'boolean',
      description: 'Wariant dla akcji niebezpiecznych (np. usuwanie)',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    negative: {
      control: 'boolean',
      description: 'Wariant z odwróconymi kolorami',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    submit: {
      control: 'boolean',
      description: 'Określa czy przycisk ma typ "submit"',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    width: {
      control: 'text',
      description: 'Szerokość przycisku (CSS width)',
      table: {
        defaultValue: { summary: "'auto'" }
      }
    },
    center: {
      control: 'boolean',
      description: 'Wyśrodkowanie zawartości przycisku',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    stick: {
      control: 'select',
      options: ['left', 'right', 'both', undefined],
      description: 'Przyklejenie przycisku do lewej/prawej strony (usuwa zaokrąglenia)'
    },
    monospace: {
      control: 'boolean',
      description: 'Użycie czcionki monospace',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    active: {
      control: 'boolean',
      description: 'Stan aktywny przycisku',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    iconButton: {
      control: 'boolean',
      description: 'Przycisk zawierający tylko ikonę (bez tekstu)',
      table: {
        defaultValue: { summary: 'false' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    icon: '',
    title: 'Przycisk',
    monospace: false,
    active: false,
    iconButton: false,
    small: false,
    disabled: false,
    accent: false,
    danger: false,
    negative: false,
    submit: false,
    width: '',
    center: false,
    iconPosition: 'left'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Przycisk</Button>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy przycisk z tekstem.'
      },
      source: {
        code: '<Button>Przycisk</Button>'
      }
    }
  }
}

export const WithIcon: Story = {
  args: {
    icon: 'save'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Zapisz</Button>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Przycisk z ikoną i tekstem.'
      },
      source: {
        code: '<Button icon="save">Zapisz</Button>'
      }
    }
  }
}

export const WithIconRight: Story = {
  args: {
    icon: 'arrow-right',
    iconPosition: 'right'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Dalej</Button>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Przycisk z ikoną po prawej stronie tekstu.'
      },
      source: {
        code: '<Button icon="arrow-right" iconPosition="right">Dalej</Button>'
      }
    }
  }
}

export const IconOnly: Story = {
  args: {
    icon: 'settings',
    iconButton: true,
    title: 'Ustawienia',
    small: false
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Przycisk zawierający tylko ikonę z tooltipem.'
      },
      source: {
        code: '<Button icon="settings" iconButton title="Ustawienia" />'
      }
    }
  }
}

export const Small: Story = {
  args: {
    small: true,
    icon: 'edit-note'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Edytuj</Button>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Mniejszy wariant przycisku.'
      },
      source: {
        code: '<Button small icon="edit-note">Edytuj</Button>'
      }
    }
  }
}

export const IconSmall: Story = {
  args: {
    small: true,
    icon: 'add-note',
    iconButton: true,
    title: 'Dodaj notatkę'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Mały przycisk zawierający tylko ikonę.'
      },
      source: {
        code: '<Button small icon="add-note" iconButton title="Dodaj notatkę" />'
      }
    }
  }
}

export const Accent: Story = {
  args: {
    accent: true,
    icon: 'check'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Potwierdź</Button>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Przycisk z podkreśleniem kolorem głównym motywu.'
      },
      source: {
        code: '<Button accent icon="check">Potwierdź</Button>'
      }
    }
  }
}

export const Danger: Story = {
  args: {
    danger: true,
    icon: 'delete'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Usuń</Button>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Wariant dla akcji niebezpiecznych, takich jak usuwanie.'
      },
      source: {
        code: '<Button danger icon="delete">Usuń</Button>'
      }
    }
  }
}

export const Negative: Story = {
  args: {
    negative: true,
    icon: 'cancel'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Anuluj</Button>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Wariant z odwróconymi kolorami.'
      },
      source: {
        code: '<Button negative icon="cancel">Anuluj</Button>'
      }
    }
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    icon: 'save'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Zapisz</Button>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Przycisk w stanie nieaktywnym.'
      },
      source: {
        code: '<Button disabled icon="save">Zapisz</Button>'
      }
    }
  }
}

export const CustomWidth: Story = {
  args: {
    width: '300px',
    center: false,
    icon: 'add-note'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Dodaj notatkę</Button>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Przycisk z niestandardową szerokością i wyśrodkowaną zawartością.'
      },
      source: {
        code: '<Button width="200px" center icon="add-note">Dodaj notatkę</Button>'
      }
    }
  }
}

export const CenteredContent: Story = {
  args: {
    center: true,
    icon: 'note-list',
    width: '100%'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Lista notatek</Button>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Przycisk z wyśrodkowaną zawartością.'
      },
      source: {
        code: '<Button center icon="note-list" width="100%">Lista notatek</Button>'
      }
    }
  }
}

export const ButtonGroup: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex;">
        <Button stick="right" icon="arrow-left">Wstecz</Button>
        <Button stick="both" active center>1</Button>
        <Button stick="both" center>2</Button>
        <Button stick="both" center>3</Button>
        <Button stick="left" icon="arrow-right" iconPosition="right">Dalej</Button>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grupa przycisków z usuniętymi zaokrągleniami między nimi.'
      },
      source: {
        code: `<Button stick="right" icon="arrow-left">Wstecz</Button>
        <Button stick="both" active center>1</Button>
        <Button stick="both" center>2</Button>
        <Button stick="both" center>3</Button>
        <Button stick="left" icon="arrow-right" iconPosition="right">Dalej</Button>`
      }
    }
  }
}
