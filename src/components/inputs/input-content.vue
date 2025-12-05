<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'update:activeStyles'])

const editorElement = ref<HTMLDivElement | null>(null)

// Funkcja wykrywająca aktywne style
const checkActiveStyles = () => {
  const activeStyles = {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
    strikethrough: document.queryCommandState('strikeThrough')
  }
  emit('update:activeStyles', activeStyles)
}

// Obsługa zmian zaznaczenia
const handleSelectionChange = () => {
  // Sprawdź czy zaznaczenie jest wewnątrz naszego edytora
  const selection = window.getSelection()
  if (selection && editorElement.value?.contains(selection.anchorNode)) {
    checkActiveStyles()
  }
}

// Ustawienie początkowej zawartości
onMounted(() => {
  if (editorElement.value && props.modelValue) {
    editorElement.value.innerHTML = props.modelValue
  }
  // Nasłuchuj zmian zaznaczenia
  document.addEventListener('selectionchange', handleSelectionChange)
})

// Usuń listener przy odmontowaniu
onUnmounted(() => {
  document.removeEventListener('selectionchange', handleSelectionChange)
})

// Obsługa zmian w contenteditable
const handleInput = () => {
  if (editorElement.value) {
    emit('update:modelValue', editorElement.value.innerHTML)
    checkActiveStyles()
  }
}

// Aktualizacja zawartości, gdy prop się zmienia
watch(
  () => props.modelValue,
  newValue => {
    if (editorElement.value && editorElement.value.innerHTML !== newValue) {
      editorElement.value.innerHTML = newValue || ''
    }
  }
)

// Publiczna metoda do wykonywania komend edytora
const execCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value)
  editorElement.value?.focus()
  handleInput() // Aktualizacja modelu po wykonaniu komendy
  checkActiveStyles() // Aktualizacja stylów po wykonaniu komendy
}

// Expose do użycia przez parent component
defineExpose({
  execCommand
})
</script>

<template>
  <div
    ref="editorElement"
    class="wrapper"
    contenteditable
    @input="handleInput"
    @paste="handleInput"
  />
</template>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  padding: 12px;
  height: 100%;
  overflow: auto;
  outline: none;
}
</style>
