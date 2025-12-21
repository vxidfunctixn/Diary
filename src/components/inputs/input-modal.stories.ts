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
  }
}

export default meta
type Story = StoryObj<typeof InputModal>

export const Default: Story = {
  render: () => ({
    components: { InputModal, Button },
    data() {
      return {
        showModal: false
      }
    },
    mounted() {
      setTimeout(() => {
        this.showModal = true
      }, 100)
    },
    template: `
      <div style="min-height: 300px;">
        <Button @click="showModal = true">Pokaż modal</Button>
        <InputModal v-if="showModal" @close="showModal = false" :disableTeleport="true">
          <template #header>
            Podstawowy Modal
          </template>
          <template #content>
            To jest podstawowy modal z dowolną treścią
          </template>
          <template #buttons>
            <Button icon="check" accent @click="showModal = false">OK</Button>
            <Button icon="cancel" @click="showModal = false">Anuluj</Button>
          </template>
        </InputModal>
      </div>
    `
  }),

  parameters: {
    docs: {
      description: {
        story: 'Podstawowy modal z treścią i przyciskami.'
      },
      source: {
        language: 'html',
        code: `
          <script lang="ts" setup>
            import { ref } from 'vue'
            import InputModal from '@/components/inputs/input-modal.vue'
            import Button from '@/components/common/button.vue'

            const showModal = ref(false)
          </script>
          <template>
            <div>
              <Button @click="showModal = true">Pokaż modal</Button>
              <InputModal v-if="showModal" @close="showModal = false" :disableTeleport="true">
                <template #header>
                  Podstawowy Modal
                </template>
                <template #content>
                  To jest podstawowy modal z dowolną treścią
                </template>
                <template #buttons>
                  <Button icon="check" accent @click="showModal = false">OK</Button>
                  <Button icon="cancel" @click="showModal = false">Anuluj</Button>
                </template>
              </InputModal>
            </div>
          </template>`
      }
    }
  }
}

export const WithoutHeader: Story = {
  render: () => ({
    components: { InputModal, Button },
    data() {
      return {
        showModal: false
      }
    },
    mounted() {
      setTimeout(() => {
        this.showModal = true
      }, 100)
    },
    template: `
      <div style="min-height: 300px;">
        <Button @click="showModal = true">Pokaż modal</Button>
        <InputModal v-if="showModal" @close="showModal = false" :disableTeleport="true">
          <template #content>
            Modal bez nagłówka - tylko z treścią i przyciskami
          </template>
          <template #buttons>
            <Button icon="check" accent @click="showModal = false">OK</Button>
            <Button icon="cancel" @click="showModal = false">Anuluj</Button>
          </template>
        </InputModal>
      </div>
    `
  }),

  parameters: {
    docs: {
      description: {
        story: 'Modal bez nagłówka - pokazuje tylko zawartość i przyciski.'
      },
      source: {
        language: 'html',
        code: `
<script lang="ts" setup>
  import { ref } from 'vue'
  import InputModal from '@/components/inputs/input-modal.vue'
  import Button from '@/components/common/button.vue'

  const showModal = ref(false)
</script>
<template>
  <div>
    <Button @click="showModal = true">Pokaż modal</Button>
    <InputModal v-if="showModal" @close="showModal = false" :disableTeleport="true">
      <template #content>
        Modal bez nagłówka - tylko z treścią i przyciskami
      </template>
      <template #buttons>
        <Button icon="check" accent @click="showModal = false">OK</Button>
        <Button icon="cancel" @click="showModal = false">Anuluj</Button>
      </template>
    </InputModal>
  </div>
</template>
    `
      }
    }
  }
}
