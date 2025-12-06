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
  strikethrough: false,
  link: false
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
  const selection = window.getSelection()
  let linkElement: HTMLAnchorElement | null = null
  let selectedText = selection?.toString() || ''

  // Sprawdź czy kursor jest wewnątrz linku
  if (selection && selection.anchorNode) {
    let node = selection.anchorNode as Node | null
    while (node && node !== editorRef.value?.$el) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'A') {
        linkElement = node as HTMLAnchorElement
        break
      }
      node = node.parentNode
    }
  }

  // Zapisz zaznaczenie przed otwarciem modala
  if (selection && selection.rangeCount > 0) {
    savedSelection.value = selection.getRangeAt(0).cloneRange()
  }

  // Jeśli jesteśmy w linku, pobierz jego dane do edycji
  if (linkElement) {
    linkForm.value = {
      text: linkElement.textContent || '',
      url: linkElement.href
    }
  } else {
    linkForm.value = {
      text: selectedText,
      url: ''
    }
  }

  showLinkModal.value = true
}

const handleLinkFormUpdate = (event: any) => {
  linkForm.value[event.name as 'text' | 'url'] = event.value as string
}

const confirmInsertLink = () => {
  // Przywróć zapisane zaznaczenie
  if (savedSelection.value) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(savedSelection.value)
    }
  }

  const selection = window.getSelection()
  let linkElement: HTMLAnchorElement | null = null

  // Sprawdź czy jesteśmy w linku
  if (selection && selection.anchorNode) {
    let node = selection.anchorNode as Node | null
    while (node && node !== editorRef.value?.$el) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'A') {
        linkElement = node as HTMLAnchorElement
        break
      }
      node = node.parentNode
    }
  }

  // Jeśli URL jest pusty, usuń link (zostaw tylko tekst)
  if (!linkForm.value.url) {
    if (linkElement) {
      // Zastąp element <a> jego tekstem
      const textNode = document.createTextNode(linkElement.textContent || '')
      linkElement.parentNode?.replaceChild(textNode, linkElement)
    }
    closeLinkModal()
    return
  }

  // Normalizuj URL - dodaj https:// jeśli brakuje protokołu
  let normalizedUrl = linkForm.value.url.trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl
  }

  // Jeśli edytujemy istniejący link
  if (linkElement) {
    linkElement.href = normalizedUrl
    linkElement.textContent = linkForm.value.text
    closeLinkModal()
    return
  }

  // Wstawianie nowego linku
  if (linkForm.value.text) {
    // Jeśli jest tekst, wstaw go najpierw
    applyFormat('insertText', linkForm.value.text)

    // Zaznacz wstawiony tekst
    const newSelection = window.getSelection()
    if (newSelection && newSelection.rangeCount > 0) {
      const range = newSelection.getRangeAt(0)
      const textNode = range.startContainer

      if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
        const newRange = document.createRange()
        const endOffset = range.startOffset
        const startOffset = Math.max(0, endOffset - linkForm.value.text.length)

        try {
          newRange.setStart(textNode, startOffset)
          newRange.setEnd(textNode, endOffset)
          newSelection.removeAllRanges()
          newSelection.addRange(newRange)
        } catch (e) {
          console.error('Błąd podczas zaznaczania tekstu:', e)
        }
      }
    }
  }

  // Wstaw link
  applyFormat('createLink', normalizedUrl)

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
          <Button icon="link" stick="both" :active="activeStyles.link" @click="insertLink" />
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
