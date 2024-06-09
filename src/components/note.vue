<script setup>
import Icon from '@/components/icon.vue'
import Button from '@/components/button.vue'
import { storeToRefs } from 'pinia'
import { useDiaryStore } from '@/diaryStore'
const diaryStore = useDiaryStore()
const { themeColor } = storeToRefs(diaryStore)


const props = defineProps({
  data: Array
})
</script>

<template>
<div class="note-group">
  <div v-for="(note) in data" class="note">
    <div class="note-title-bar">
      <div class="note-title" tabindex="0">
        <div class="icon">
          <Icon name="note" :size="16"/>
        </div>
        {{ note.title }}
      </div>
      <div class="note-options">
        <Button icon="edit-note" small>Edytuj</Button>
        <Button icon="delete" small>Usuń</Button>
      </div>
    </div>
    <div class="note-message">{{ note.message }}</div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.note-group {
  margin: 24px 0;
  box-shadow: 0 4px 16px -4px rgba(black, .25);
  border-radius: 8px;
  overflow: hidden;

  .note {
    background-color: var(--BG1);

    .note-title-bar {
      position: relative;
      user-select: none;

      .note-title {
        background-color: var(--BG3);
        padding: 11px 11px;
        line-height: 20px;
        position: relative;
        cursor: pointer;
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

        &:hover,
        &:focus-visible {
          background-color: var(--BG2);
          border-color: var(--HL1);
        }

        &:active {
          border-color: var(--F2);
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
        border-color: var(--F2);
      }
    }

    .note-message {
      padding: 12px;
    }

    &:nth-child(1) {
      .note-title-bar {
        .note-title {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
      }
    }

    &:hover,
    &:focus-within {
      .note-title-bar {
        .note-options {
          opacity: 1;
        }
      }
    }
  }
}
</style>