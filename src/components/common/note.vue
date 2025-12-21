<script setup lang="ts">
import Icon from '@/components/common/icon/index.vue'
import Button from '@/components/common/button.vue'
import InputModal from '@/components/inputs/input-modal.vue'
import type { DBNote } from '@/interfaces/store-interface'
import { formatDate, markdownToHtml } from '@/utils'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  data?: DBNote
  stick?: 'top' | 'bottom' | 'both'
  titleFormat?: {
    time?: boolean
    date?: boolean
  }
}>()

const emit = defineEmits<{
  delete: [uuid: string]
  edit: [uuid: string]
}>()

const showDeleteModal = ref(false)

const htmlContent = computed(() => {
  return props.data ? markdownToHtml(props.data.content) : ''
})

const formattedTitle = computed(() => {
  if (!props.data) return ''

  const date = new Date(props.data.created_at)
  const parts: string[] = []

  if (props.titleFormat?.time) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    parts.push(`${hours}:${minutes}`)
  }

  if (props.titleFormat?.date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    parts.push(`${day}.${month}.${year}`)
  }

  console.log(props.titleFormat?.time)
  return parts.join(' ')
})

const handleDelete = () => {
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (props.data) {
    emit('delete', props.data.uuid)
  }
  showDeleteModal.value = false
}

const cancelDelete = () => {
  showDeleteModal.value = false
}

const handleEdit = () => {
  if (props.data) {
    emit('edit', props.data.uuid)
  }
}

const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.tagName === 'A') {
    event.preventDefault()

    const href = target.getAttribute('href')
    if (href) {
      const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']
      try {
        const url = new URL(href)
        if (allowedProtocols.includes(url.protocol)) {
          window.open(href, '_blank', 'noopener,noreferrer')
        }
      } catch {
        console.warn('Invalid URL:', href)
      }
    }
  }
}
</script>

<template>
  <div
    class="note-wrapper"
    :class="{
      stickTop: stick === 'top' || stick === 'both',
      stickBottom: stick === 'bottom' || stick === 'both'
    }"
    v-if="data"
  >
    <div class="note">
      <div class="note-title-bar">
        <div class="note-title">
          <div class="icon">
            <Icon name="note" :size="16" />
          </div>
          {{ formattedTitle }}
        </div>
        <div class="note-options">
          <Button icon="edit-note" small negative @click="handleEdit">{{
            t('notes.actions.edit')
          }}</Button>
          <Button icon="delete" small negative @click="handleDelete">{{
            t('notes.actions.delete')
          }}</Button>
        </div>
      </div>
      <div class="note-message" v-html="htmlContent" @click="handleClick"></div>
    </div>

    <InputModal v-if="showDeleteModal" width="460px" @close="cancelDelete">
      <template #header>
        {{ t('notes.delete.dialogTitle') }}
      </template>
      <template #content>
        {{ t('notes.delete.dialogInfo') }}
      </template>
      <template #buttons>
        <Button icon="delete" danger @click="confirmDelete">{{
          t('notes.delete.confirmButton')
        }}</Button>
        <Button icon="cancel" @click="cancelDelete">{{ t('common.actions.cancel') }}</Button>
      </template>
    </InputModal>
  </div>
</template>

<style lang="scss" scoped>
.note-wrapper {
  margin: 24px 0;
  box-shadow: 0 4px 16px -4px rgba(black, 0.25);
  border-radius: 8px;
  overflow: hidden;

  &.stickTop {
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    .note {
      &:nth-child(1) {
        .note-title-bar {
          .note-title {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          }
        }
      }
    }
  }

  &.stickBottom {
    margin-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .note {
    background-color: var(--BG1);

    .note-title-bar {
      position: relative;
      user-select: none;

      .note-title {
        background-color: var(--HL3);
        padding: 11px 11px;
        line-height: 20px;
        position: relative;
        border: 1px solid transparent;
        outline: none;
        min-height: 44px;
        padding-left: 12px + 16px + 8px;

        .icon {
          position: absolute;
          top: 13px;
          left: 12px;
          transform: tra;
        }
      }

      .note-options {
        position: absolute;
        top: 4px;
        right: 12px;
        opacity: 0;
        display: flex;
        gap: 4px;
      }

      &:active {
        border-color: var(--F3);
      }
    }

    .note-message {
      padding: 12px;

      :deep(a) {
        color: var(--A1);
        font-weight: 500;
        text-decoration: underline;
        cursor: pointer;
        border-radius: 4px;

        &:hover,
        &:focus-visible {
          outline: none;
          background-color: var(--HL2);
          outline: 1px solid var(--A4);
        }
        &:active {
          background-color: var(--HL1);
        }
      }

      :deep(mark) {
        background-color: var(--BG2);
        border: 1px solid var(--A4);
        padding: 2px 4px;
        border-radius: 8px;
        color: var(--F1);
      }
    }

    &:nth-child(1) {
      .note-title-bar {
        .note-title {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
      }
    }

    &:hover {
      .note-title-bar {
        .note-options {
          opacity: 1;
        }
      }
    }
  }
}
</style>
