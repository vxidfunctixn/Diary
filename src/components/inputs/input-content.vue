<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'update:activeStyles'])

const editorElement = ref<HTMLDivElement | null>(null)
const isAltPressed = ref(false)

// Funkcja sprawdzająca czy węzeł lub jego rodzice zawierają dany tag
const hasParentTag = (node: Node | null, tagName: string): boolean => {
  while (node && node !== editorElement.value) {
    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === tagName) {
      return true
    }
    node = node.parentNode
  }
  return false
}

// Funkcja wykrywająca aktywne style
const checkActiveStyles = () => {
  const selection = window.getSelection()
  let isLink = false
  let isMark = false
  let isBold = false
  let isItalic = false
  let isUnderline = false
  let isStrikethrough = false

  // Sprawdź czy kursor jest wewnątrz różnych elementów
  if (selection && selection.anchorNode) {
    let node = selection.anchorNode as Node | null
    while (node && node !== editorElement.value) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        const tagName = element.tagName

        if (tagName === 'A') isLink = true
        if (tagName === 'MARK') isMark = true
        if (tagName === 'B' || tagName === 'STRONG') isBold = true
        if (tagName === 'I' || tagName === 'EM') isItalic = true
        if (tagName === 'U') isUnderline = true
        if (tagName === 'S' || tagName === 'STRIKE') isStrikethrough = true
      }
      node = node.parentNode
    }
  }

  const activeStyles = {
    bold: isBold,
    italic: isItalic,
    underline: !isLink && isUnderline, // Ignoruj underline jeśli to link
    strikethrough: isStrikethrough,
    link: isLink,
    mark: isMark
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
        isAltPressed.value = false
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

// Filtrowanie wklejanego HTML
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()

  const clipboardData = event.clipboardData
  if (!clipboardData) return

  // Pobierz dane z schowka
  const htmlData = clipboardData.getData('text/html')
  const textData = clipboardData.getData('text/plain')

  // Jeśli jest HTML, przefiltruj go
  if (htmlData) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlData

    // Funkcja rekurencyjna do czyszczenia węzłów
    const cleanNode = (node: Node): Node | null => {
      // Jeśli to węzeł tekstowy, zwróć go bez zmian
      if (node.nodeType === Node.TEXT_NODE) {
        return node.cloneNode(false)
      }

      // Jeśli to element HTML
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        const tagName = element.tagName.toLowerCase()

        // Dozwolone tagi
        const allowedTags: Record<string, string> = {
          b: 'b',
          strong: 'b',
          i: 'i',
          em: 'i',
          u: 'u',
          s: 's',
          strike: 's',
          del: 's',
          a: 'a'
        }

        // Jeśli tag jest dozwolony
        if (allowedTags[tagName]) {
          const newElement = document.createElement(allowedTags[tagName])

          // Dla linków zachowaj TYLKO atrybut href, usuń wszystkie inne
          if (tagName === 'a' && element.hasAttribute('href')) {
            const href = element.getAttribute('href') || ''
            newElement.setAttribute('href', href)
          }

          // Rekurencyjnie przetwórz dzieci
          for (const child of Array.from(element.childNodes)) {
            const cleanedChild = cleanNode(child)
            if (cleanedChild) {
              newElement.appendChild(cleanedChild)
            }
          }

          return newElement
        } else {
          // Dla niedozwolonych tagów, przetwórz tylko dzieci
          const fragment = document.createDocumentFragment()
          for (const child of Array.from(node.childNodes)) {
            const cleanedChild = cleanNode(child)
            if (cleanedChild) {
              fragment.appendChild(cleanedChild)
            }
          }
          return fragment
        }
      }

      return null
    }

    // Wyczyść całą zawartość
    const fragment = document.createDocumentFragment()
    for (const child of Array.from(tempDiv.childNodes)) {
      const cleanedChild = cleanNode(child)
      if (cleanedChild) {
        fragment.appendChild(cleanedChild)
      }
    }

    // Wstaw oczyszczoną zawartość
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(fragment)

      // Przesuń kursor na koniec wstawionej zawartości
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  } else if (textData) {
    // Jeśli nie ma HTML, wklej czysty tekst
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      const textNode = document.createTextNode(textData)
      range.insertNode(textNode)
      range.setStartAfter(textNode)
      range.setEndAfter(textNode)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  // Aktualizuj model
  handleInput()
}

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
  // Użyj natywnych komend przeglądarki, które prawidłowo obsługują zagnieżdżone tagi
  switch (command) {
    case 'bold':
      document.execCommand('bold', false)
      break
    case 'italic':
      document.execCommand('italic', false)
      break
    case 'underline':
      document.execCommand('underline', false)
      break
    case 'strikeThrough':
      document.execCommand('strikeThrough', false)
      break
    case 'createLink':
      if (value) {
        document.execCommand('createLink', false, value)
      }
      break
    case 'insertText':
      if (value) {
        document.execCommand('insertText', false, value)
      }
      break
  }

  editorElement.value?.focus()
  handleInput()

  // Opóźnij sprawdzenie stylów, aby dać przeglądarce czas na aktualizację DOM
  setTimeout(() => {
    checkActiveStyles()
  }, 0)
}

// Expose do użycia przez parent component
defineExpose({
  execCommand,
  checkActiveStyles
})
</script>

<template>
  <div
    ref="editorElement"
    class="wrapper"
    :class="{ 'alt-pressed': isAltPressed }"
    contenteditable
    spellcheck="false"
    @input="handleInput"
    @paste="handlePaste"
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

  :deep(mark) {
    background-color: var(--BG2);
    border: 1px solid var(--A4);
    padding: 2px 4px;
    border-radius: 8px;
    color: var(--F1);
  }

  &.alt-pressed :deep(a) {
    pointer-events: auto;
    cursor: pointer;
  }
}
</style>
