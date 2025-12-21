import type { Meta, StoryObj } from '@storybook/vue3-vite'
import InputModal from './input-modal.vue'
import Button from '../button.vue'

const meta: Meta<typeof InputModal> = {
  title: 'Inputs/InputModal',
  component: InputModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent InputModal to kontener modala wyświetlany jako overlay. Zawiera trzy sloty: header (opcjonalny nagłówek), content (główna zawartość) i buttons (przyciski akcji). Kliknięcie w overlay zamyka modal.'
      }
    }
  },
  argTypes: {
    width: {
      control: 'text',
      description: 'Szerokość modala (domyślnie "auto")'
    }
  }
}

export default meta
type Story = StoryObj<typeof InputModal>

export const Default: Story = {
  render: () => ({
    components: { InputModal, Button },
    template: `
      <InputModal>
        <template #content>
          <p>To jest treść modala</p>
        </template>
        <template #buttons>
          <Button accent>OK</Button>
          <Button>Anuluj</Button>
        </template>
      </InputModal>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy modal z treścią i przyciskami.'
      }
    }
  }
}

export const WithHeader: Story = {
  render: () => ({
    components: { InputModal, Button },
    template: `
      <InputModal>
        <template #header>
          Potwierdzenie
        </template>
        <template #content>
          <p>Czy na pewno chcesz wykonać tę akcję?</p>
        </template>
        <template #buttons>
          <Button accent icon="check">Tak</Button>
          <Button icon="cancel">Nie</Button>
        </template>
      </InputModal>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal z nagłówkiem, treścią i przyciskami.'
      }
    }
  }
}

export const CustomWidth: Story = {
  render: () => ({
    components: { InputModal, Button },
    template: `
      <InputModal width="600px">
        <template #header>
          Ustawienia
        </template>
        <template #content>
          <p>To jest modal o szerokości 600px</p>
          <p>Można tutaj umieścić więcej treści, formularzy lub innych elementów.</p>
        </template>
        <template #buttons>
          <Button accent>Zapisz</Button>
          <Button>Anuluj</Button>
        </template>
      </InputModal>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal z niestandardową szerokością 600px.'
      }
    }
  }
}

export const LongContent: Story = {
  render: () => ({
    components: { InputModal, Button },
    template: `
      <InputModal width="480px">
        <template #header>
          Regulamin
        </template>
        <template #content>
          <div style="max-height: 400px; overflow-y: auto;">
            <p>1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>2. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>3. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
            <p>4. Duis aute irure dolor in reprehenderit in voluptate velit.</p>
            <p>5. Excepteur sint occaecat cupidatat non proident.</p>
            <p>6. Sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </template>
        <template #buttons>
          <Button accent>Akceptuję</Button>
          <Button>Odrzuć</Button>
        </template>
      </InputModal>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal z dłuższą treścią.'
      }
    }
  }
}

export const SimpleMessage: Story = {
  render: () => ({
    components: { InputModal, Button },
    template: `
      <InputModal width="400px">
        <template #content>
          <p style="text-align: center; padding: 20px 0;">Operacja zakończona sukcesem!</p>
        </template>
        <template #buttons>
          <Button accent>OK</Button>
        </template>
      </InputModal>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Prosty modal z komunikatem i jednym przyciskiem.'
      }
    }
  }
}

export const FormModal: Story = {
  render: () => ({
    components: { InputModal, Button },
    template: `
      <InputModal width="500px">
        <template #header>
          Nowy wpis
        </template>
        <template #content>
          <div style="display: grid; gap: 12px;">
            <div>
              <label>Tytuł:</label>
              <input type="text" style="width: 100%; padding: 8px; margin-top: 4px;" />
            </div>
            <div>
              <label>Opis:</label>
              <textarea style="width: 100%; padding: 8px; margin-top: 4px; min-height: 100px;"></textarea>
            </div>
          </div>
        </template>
        <template #buttons>
          <Button accent icon="check">Zapisz</Button>
          <Button icon="cancel">Anuluj</Button>
        </template>
      </InputModal>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal z formularzem zawierającym pola input.'
      }
    }
  }
}
