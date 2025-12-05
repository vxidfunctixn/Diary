<script setup lang="ts">
import OptionsBar from '@/components/layout/options-bar.vue'
import Button from '@/components/button.vue'
import { useAppStore, useDiaryStore } from '@/stores'
import InputContent from '@/components/inputs/input-content.vue'
import { htmlToMarkdown } from '@/utils'
import { ref } from 'vue'

const appStore = useAppStore()
const diaryStore = useDiaryStore()
const content = ref('')
const editorRef = ref<InstanceType<typeof InputContent>>()
const noteUuid = ref<string | null>(null)
const activeStyles = ref({
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false
})

const updateActiveStyles = (styles: typeof activeStyles.value) => {
  activeStyles.value = styles
}

const applyFormat = (command: string, value?: string) => {
  editorRef.value?.execCommand(command, value)
}

const insertLink = () => {
  const url = prompt('Wklej URL:')
  if (url) {
    applyFormat('createLink', url)
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
    <InputContent ref="editorRef" v-model="content" @update:active-styles="updateActiveStyles" />
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
