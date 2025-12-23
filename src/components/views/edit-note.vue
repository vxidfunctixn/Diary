<script setup lang="ts">
import OptionsBar from '@/components/layout/options-bar.vue'
import Button from '@/components/common/button.vue'
import { useAppStore, useDiaryStore } from '@/stores'
import TiptapEditor from '@/components/inputs/tiptap-editor.vue'
import InputModal from '@/components/inputs/input-modal.vue'
import InputText from '@/components/inputs/input-text.vue'
import InputRow from '@/components/inputs/input-row.vue'
import { htmlToMarkdown, markdownToHtml } from '@/utils'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const router = useRouter()
const route = router.currentRoute
const appStore = useAppStore()
const diaryStore = useDiaryStore()
const content = ref('')
const editorRef = ref<InstanceType<typeof TiptapEditor>>()
const noteUuid = ref<string | null>(null)
const isEditingExisting = ref(false)

onMounted(async () => {
  const uuid = route.value.params.uuid as string | undefined

  if (uuid) {
    isEditingExisting.value = true
    noteUuid.value = uuid
    try {
      const note = await diaryStore.getNote(uuid)
      if (note) {
        content.value = markdownToHtml(note.content)
        appStore.setEditedContent(content.value)
      }
    } catch (error) {
      console.error('Błąd podczas ładowania notatki:', error)
    }
  } else {
    isEditingExisting.value = false
    content.value = appStore.draft
  }

  // Ustaw focus na edytor po załadowaniu
  setTimeout(() => {
    editorRef.value?.focus()
  }, 100)
})
const activeStyles = ref({
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  link: false,
  mark: false
})

const showLinkModal = ref(false)
const linkForm = ref({
  text: '',
  url: ''
})

const updateActiveStyles = (styles: typeof activeStyles.value) => {
  activeStyles.value = styles
}

const applyFormat = (command: string, value?: string) => {
  editorRef.value?.execCommand(command, value)
}

const insertMark = () => {
  editorRef.value?.toggleHighlight()
}

const insertLink = () => {
  // Jeśli kursor jest w linku, rozszerz zaznaczenie na cały link
  if (activeStyles.value.link) {
    editorRef.value?.selectLink()
  }

  const selectedText = editorRef.value?.getSelectedText() || ''

  // Sprawdź czy zaznaczenie to już link
  if (activeStyles.value.link && editorRef.value?.editor) {
    const attrs = editorRef.value.editor.getAttributes('link')
    linkForm.value = {
      text: selectedText,
      url: attrs.href || ''
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

const removeLink = () => {
  applyFormat('unlink')
  closeLinkModal()
}

const confirmInsertLink = () => {
  if (!linkForm.value.url) {
    // Jeśli nie ma URL, usuń link
    if (activeStyles.value.link) {
      applyFormat('unlink')
    }
    closeLinkModal()
    return
  }

  let normalizedUrl = linkForm.value.url.trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl
  }

  const selectedText = editorRef.value?.getSelectedText() || ''

  // Jeśli edytujemy istniejący link (jest zaznaczenie)
  if (selectedText) {
    // Jeśli tekst został zmieniony, najpierw zastąp go
    if (linkForm.value.text && linkForm.value.text !== selectedText) {
      applyFormat('insertText', linkForm.value.text)
    }
    // Ustaw link
    applyFormat('createLink', normalizedUrl)
  } else {
    // Tworzenie nowego linku - najpierw wstaw tekst
    if (linkForm.value.text) {
      applyFormat('insertText', linkForm.value.text)
      // Zaznacz wstawiony tekst (przesuń kursor wstecz o długość tekstu)
      if (editorRef.value?.editor) {
        const textLength = linkForm.value.text.length
        editorRef.value.editor
          .chain()
          .focus()
          .setTextSelection({
            from: editorRef.value.editor.state.selection.from - textLength,
            to: editorRef.value.editor.state.selection.from
          })
          .run()
      }
    }
    // Ustaw link
    applyFormat('createLink', normalizedUrl)
  }

  // Usuń zaznaczenie i ustaw kursor na końcu
  setTimeout(() => {
    editorRef.value?.collapseToEnd()
  }, 0)

  closeLinkModal()
}

const closeLinkModal = () => {
  showLinkModal.value = false
  linkForm.value = {
    text: '',
    url: ''
  }
}

const clearFormat = () => {
  applyFormat('removeFormat')
}

const saveNote = async () => {
  const markdownContent = htmlToMarkdown(content.value)
  if (!markdownContent.trim()) return

  try {
    if (noteUuid.value) {
      await diaryStore.updateNote(noteUuid.value, markdownContent)
      console.log('Notatka zaktualizowana:', noteUuid.value)
      appStore.setEditedContent('')
    } else {
      const uuid = await diaryStore.createNote(markdownContent)
      noteUuid.value = uuid
      console.log('Nowa notatka utworzona:', uuid)
      appStore.setDraft('')
    }

    content.value = ''
    noteUuid.value = null
    router.push({ name: 'note_list' })
  } catch (error) {
    console.error('Błąd podczas zapisywania notatki:', error)
  }
}
</script>

<template>
  <OptionsBar>
    <template #left>
      <div class="options-group">
        <Button
          icon="bold"
          stick="right"
          :iconButton="true"
          :active="activeStyles.bold"
          @click="applyFormat('bold')"
        />
        <Button
          icon="italic"
          stick="both"
          :iconButton="true"
          :active="activeStyles.italic"
          @click="applyFormat('italic')"
        />
        <Button
          icon="underline"
          stick="both"
          :iconButton="true"
          :active="activeStyles.underline"
          @click="applyFormat('underline')"
        />
        <Button
          icon="strikethrough"
          stick="both"
          :iconButton="true"
          :active="activeStyles.strikethrough"
          @click="applyFormat('strikeThrough')"
        />
        <Button
          icon="link"
          stick="both"
          :active="activeStyles.link"
          :iconButton="true"
          @click="insertLink"
        />
        <Button
          icon="mark"
          stick="both"
          :active="activeStyles.mark"
          :iconButton="true"
          @click="insertMark"
        />
        <Button icon="clear-format" stick="left" :iconButton="true" @click="clearFormat" />
      </div>
    </template>
    <template #right>
      <Button icon="save" accent @click="saveNote">{{ t('common.actions.save') }}</Button>
    </template>
  </OptionsBar>
  <div class="edit-note">
    <TiptapEditor
      ref="editorRef"
      v-model="content"
      @update:active-styles="updateActiveStyles"
      @update:model-value="
        value => {
          content = value
          isEditingExisting ? appStore.setEditedContent(value) : appStore.setDraft(value)
        }
      "
    />

    <InputModal v-if="showLinkModal" width="500px" @close="closeLinkModal">
      <template #content>
        <form @submit.prevent="confirmInsertLink">
          <InputRow :title="t('editor.link.text')">
            <InputText
              name="text"
              :value="linkForm.text"
              :placeholder="t('editor.link.textPlaceholder')"
              @update="handleLinkFormUpdate($event)"
            />
          </InputRow>
          <InputRow :title="t('editor.link.url')">
            <InputText
              name="url"
              :value="linkForm.url"
              :placeholder="t('editor.link.urlPlaceholder')"
              @update="handleLinkFormUpdate($event)"
            />
          </InputRow>
        </form>
      </template>
      <template #buttons>
        <Button icon="check" accent @click="confirmInsertLink">{{
          t('editor.link.insert')
        }}</Button>
        <Button icon="delete" danger :disabled="!linkForm.url" @click="removeLink">
          {{ t('editor.link.delete') }}
        </Button>
        <Button icon="cancel" @click="closeLinkModal">{{ t('common.actions.cancel') }}</Button>
      </template>
    </InputModal>
  </div>
</template>

<style lang="scss" scoped>
.edit-note {
  padding: 60px 2px 2px 2px;
  width: 100%;
  height: auto;
  background-color: var(--background_400);
  overflow: visible;
  margin-top: -60px;
}

.app-theme-provider.maximized .edit-note {
  padding: 60px 0px 0px 0px;
}
</style>
