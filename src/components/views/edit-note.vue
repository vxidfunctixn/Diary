<script setup lang="ts">
import OptionsBar from '@/components/layout/options-bar.vue'
import Button from '@/components/button.vue'
import { useAppStore, useDiaryStore } from '@/stores'
import InputContent from '@/components/inputs/input-content.vue'
import InputModal from '@/components/inputs/input-modal.vue'
import InputText from '@/components/inputs/input-text.vue'
import InputRow from '@/components/inputs/input-row.vue'
import { htmlToMarkdown } from '@/utils'
import { ref } from 'vue'
import type { InputUpdateEvent } from '@/interfaces'

const appStore = useAppStore()
const diaryStore = useDiaryStore()
const content = ref(appStore.draft)
const editorRef = ref<InstanceType<typeof InputContent>>()
const noteUuid = ref<string | null>(null)
const activeStyles = ref({
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false
})

const showLinkModal = ref(false)
const linkForm = ref({
  text: '',
  url: ''
})
const savedSelection = ref<Range | null>(null)

const updateActiveStyles = (styles: typeof activeStyles.value) => {
  activeStyles.value = styles
}

const applyFormat = (command: string, value?: string) => {
  editorRef.value?.execCommand(command, value)
}

const insertLink = () => {
  // Pobierz zaznaczony tekst
  const selection = window.getSelection()
  const selectedText = selection?.toString() || ''

  // Zapisz zaznaczenie przed otwarciem modala
  if (selection && selection.rangeCount > 0) {
    savedSelection.value = selection.getRangeAt(0).cloneRange()
  }

  linkForm.value = {
    text: selectedText,
    url: ''
  }

  showLinkModal.value = true
}

const handleLinkFormUpdate = (event: any) => {
  linkForm.value[event.name as 'text' | 'url'] = event.value as string
}

const confirmInsertLink = () => {
  if (!linkForm.value.url) {
    closeLinkModal()
    return
  }

  // Przywróć zapisane zaznaczenie
  if (savedSelection.value) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(savedSelection.value)
    }
  }

  if (linkForm.value.text) {
    // Jeśli jest tekst, wstaw go najpierw
    applyFormat('insertText', linkForm.value.text)

    // Zaznacz wstawiony tekst
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const textNode = range.startContainer

      if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
        const newRange = document.createRange()
        const endOffset = range.startOffset
        const startOffset = Math.max(0, endOffset - linkForm.value.text.length)

        try {
          newRange.setStart(textNode, startOffset)
          newRange.setEnd(textNode, endOffset)
          selection.removeAllRanges()
          selection.addRange(newRange)
        } catch (e) {
          console.error('Błąd podczas zaznaczania tekstu:', e)
        }
      }
    }
  }

  // Wstaw link
  applyFormat('createLink', linkForm.value.url)

  closeLinkModal()
}

const closeLinkModal = () => {
  showLinkModal.value = false
  linkForm.value = {
    text: '',
    url: ''
  }
}

const saveNote = async () => {
  const markdownContent = htmlToMarkdown(content.value)

  try {
    if (noteUuid.value) {
      // Aktualizuj istniejącą notatkę
      await diaryStore.updateNote(noteUuid.value, markdownContent)
      console.log('Notatka zaktualizowana:', noteUuid.value)
    } else {
      // Utwórz nową notatkę
      const uuid = await diaryStore.createNote(markdownContent)
      noteUuid.value = uuid
      console.log('Nowa notatka utworzona:', uuid)
    }

    // Wyczyść draft i przejdź do listy wpisów
    appStore.setDraft('')
    content.value = ''
    appStore.setView('note_list')
  } catch (error) {
    console.error('Błąd podczas zapisywania notatki:', error)
  }
}
</script>

<template>
  <div class="edit-note">
    <OptionsBar>
      <template #left>
        <div class="options-group">
          <Button
            icon="bold"
            stick="right"
            :active="activeStyles.bold"
            @click="applyFormat('bold')"
          />
          <Button
            icon="italic"
            stick="both"
            :active="activeStyles.italic"
            @click="applyFormat('italic')"
          />
          <Button
            icon="underline"
            stick="both"
            :active="activeStyles.underline"
            @click="applyFormat('underline')"
          />
          <Button
            icon="strikethrough"
            stick="both"
            :active="activeStyles.strikethrough"
            @click="applyFormat('strikethrough')"
          />
          <Button icon="link" stick="both" @click="insertLink" />
          <Button icon="mark" stick="left" disabled />
        </div>
      </template>
      <template #right>
        <Button icon="save" @click="saveNote">Zapisz</Button>
      </template>
    </OptionsBar>
    <InputContent
      ref="editorRef"
      v-model="content"
      @update:active-styles="updateActiveStyles"
      @update:model-value="appStore.setDraft($event)"
    />

    <InputModal v-if="showLinkModal" width="500px" @close="closeLinkModal">
      <template #content>
        <form @submit.prevent="confirmInsertLink">
          <InputRow title="Tekst linku">
            <InputText
              name="text"
              :value="linkForm.text"
              placeholder="Wpisz tekst linku"
              @update="handleLinkFormUpdate($event)"
            />
          </InputRow>
          <InputRow title="Adres URL">
            <InputText
              name="url"
              :value="linkForm.url"
              placeholder="https://example.com"
              @update="handleLinkFormUpdate($event)"
            />
          </InputRow>
        </form>
      </template>
      <template #buttons>
        <Button icon="check" accent @click="confirmInsertLink">Wstaw link</Button>
        <Button icon="cancel" @click="closeLinkModal">Anuluj</Button>
      </template>
    </InputModal>
  </div>
</template>

<style lang="scss" scoped>
.edit-note {
  padding: 60px 2px 2px 2px;
  width: 100%;
  height: 100%;
  background-color: var(--BG1);
}

.app-theme-provider.maximized .edit-note {
  padding: 60px 0px 0px 0px;
}
</style>
