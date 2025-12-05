<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'update:activeStyles'])

const editorElement = ref<HTMLDivElement | null>(null)
const isAltPressed = ref(false)

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

// Obsługa klawiszy Alt
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.altKey) {
    isAltPressed.value = true
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (!event.altKey) {
    isAltPressed.value = false
  }
}

// Obsługa kliknięć w linki
const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.tagName === 'A') {
    event.preventDefault()

    if (isAltPressed.value) {
      // Otwórz link w przeglądarce
      const href = target.getAttribute('href')
      if (href) {
        window.open(href, '_blank')
      }
    }
  }
}

// Ustawienie początkowej zawartości
onMounted(() => {
  if (editorElement.value && props.modelValue) {
    editorElement.value.innerHTML = props.modelValue
  }
  // Nasłuchuj zmian zaznaczenia
  document.addEventListener('selectionchange', handleSelectionChange)
  // Nasłuchuj klawiszy Alt
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

// Usuń listener przy odmontowaniu
onUnmounted(() => {
  document.removeEventListener('selectionchange', handleSelectionChange)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
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
    :class="{ 'alt-pressed': isAltPressed }"
    contenteditable
    @input="handleInput"
    @paste="handleInput"
    @click="handleClick"
  />
</template>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  padding: 12px;
  height: 100%;
  overflow: auto;
  outline: none;

  :deep(a) {
    color: var(--A1);
    font-weight: 500;
    pointer-events: none;
    cursor: text;
  }

  &.alt-pressed :deep(a) {
    pointer-events: auto;
    cursor: pointer;
  }
}
</style>
