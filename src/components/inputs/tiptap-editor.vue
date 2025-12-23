<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { watch, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:activeStyles'])

const isAltPressed = ref(false)

// Obsługa Alt key
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

const handleWindowBlur = () => {
  isAltPressed.value = false
}

const handleEditorClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  // Focus tylko jeśli kliknięto poza ProseMirror (np. w padding kontenera)
  if (!target.closest('.ProseMirror')) {
    focus()
  }
}

// Konfiguracja edytora TipTap
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      // Wyłącz domyślne formatowania, których nie potrzebujemy
      heading: false,
      codeBlock: false,
      blockquote: false,
      horizontalRule: false,
      listItem: false,
      orderedList: false,
      bulletList: false,
      // Wyłącz te, które dodajemy osobno z własną konfiguracją
      link: false,
      underline: false,
      // Pozostaw tylko podstawowe funkcje
      paragraph: {
        HTMLAttributes: {
          class: 'tiptap-paragraph'
        }
      }
    }),
    Underline,
    Highlight.configure({
      multicolor: false,
      HTMLAttributes: {
        class: 'highlight-mark'
      }
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    })
  ],
  editorProps: {
    attributes: {
      class: 'tiptap-editor-content',
      spellcheck: 'false'
    },
    handleClick: (view, pos, event) => {
      const { state } = view
      const { doc } = state
      const resolvedPos = doc.resolve(pos)

      const marks = resolvedPos.marks()
      const linkMark = marks.find(mark => mark.type.name === 'link')

      if (linkMark) {
        const href = linkMark.attrs.href

        if (isAltPressed.value && href) {
          event.preventDefault()
          event.stopPropagation()
          window.open(href, '_blank')
          isAltPressed.value = false
          return true
        } else {
          event.preventDefault()
          event.stopPropagation()
          return true
        }
      }

      return false
    }
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    updateActiveStyles()
  },
  onSelectionUpdate: () => {
    updateActiveStyles()
  },
  onCreate: () => {
    updateActiveStyles()
  }
})

// Funkcja sprawdzająca aktywne style
const updateActiveStyles = () => {
  if (!editor.value) return

  const activeStyles = {
    bold: editor.value.isActive('bold'),
    italic: editor.value.isActive('italic'),
    underline: editor.value.isActive('underline'),
    strikethrough: editor.value.isActive('strike'),
    link: editor.value.isActive('link'),
    mark: editor.value.isActive('highlight')
  }

  emit('update:activeStyles', activeStyles)
}

// Metody do formatowania (wywoływane z parent component)
const execCommand = (command: string, value?: string) => {
  if (!editor.value) return

  switch (command) {
    case 'bold':
      editor.value.chain().focus().toggleBold().run()
      break
    case 'italic':
      editor.value.chain().focus().toggleItalic().run()
      break
    case 'underline':
      editor.value.chain().focus().toggleUnderline().run()
      break
    case 'strikeThrough':
      editor.value.chain().focus().toggleStrike().run()
      break
    case 'createLink':
      if (value) {
        editor.value.chain().focus().extendMarkRange('link').setLink({ href: value }).run()
      }
      break
    case 'unlink':
      editor.value.chain().focus().unsetLink().run()
      break
    case 'insertText':
      if (value) {
        editor.value.chain().focus().insertContent(value).run()
      }
      break
    case 'removeFormat':
      editor.value.chain().focus().clearNodes().unsetAllMarks().run()
      break
    default:
      console.warn(`Nieobsługiwane polecenie: ${command}`)
  }

  updateActiveStyles()
}

// Funkcja do wstawiania/usuwania highlight (odpowiednik mark)
const toggleHighlight = () => {
  if (!editor.value) return
  editor.value.chain().focus().toggleHighlight().run()
  updateActiveStyles()
}

// Sprawdź czy link jest aktywny
const checkActiveStyles = () => {
  updateActiveStyles()
}

// Funkcja do pobrania zaznaczonego tekstu
const getSelectedText = (): string => {
  if (!editor.value) return ''
  const { from, to } = editor.value.state.selection
  return editor.value.state.doc.textBetween(from, to)
}

// Funkcja do rozszerzenia zaznaczenia na cały link (jeśli kursor jest w linku)
const selectLink = () => {
  if (!editor.value) return
  editor.value.chain().focus().extendMarkRange('link').run()
}

// Funkcja do usunięcia zaznaczenia i ustawienia kursora na końcu
const collapseToEnd = () => {
  if (!editor.value) return
  const { to } = editor.value.state.selection
  editor.value.chain().focus().setTextSelection(to).run()
}

// Funkcja do ustawienia focus
const focus = () => {
  editor.value?.commands.focus('end')
}

// Watch na zmiany modelValue z zewnątrz
watch(
  () => props.modelValue,
  newValue => {
    if (!editor.value) return

    // Aktualizuj tylko jeśli wartość się różni od obecnej
    const currentHTML = editor.value.getHTML()
    if (newValue !== currentHTML) {
      editor.value.commands.setContent(newValue || '', { emitUpdate: false })
    }
  }
)

// Wyeksponuj metody do użycia przez parent
defineExpose({
  execCommand,
  toggleHighlight,
  checkActiveStyles,
  getSelectedText,
  selectLink,
  collapseToEnd,
  focus,
  editor
})

onBeforeUnmount(() => {
  editor.value?.destroy()
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('blur', handleWindowBlur)
})

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('blur', handleWindowBlur)
}
</script>

<template>
  <div class="tiptap-editor" @click="handleEditorClick">
    <EditorContent :editor="editor" :class="{ 'alt-pressed': isAltPressed }" />
  </div>
</template>

<style lang="scss">
.tiptap-editor {
  width: 100%;
  min-height: calc(100vh - 106px);
  overflow: visible;
  background-color: transparent;

  .ProseMirror {
    outline: none;
    padding: 12px;
    padding-inline: max(12px, calc((100% - 800px) / 2));
    min-height: 100%;
    background-color: transparent;
    color: var(--text_100);
    font-family: var(--font-family);
    font-size: var(--font-size);
    line-height: 1.6;
    margin: 0 auto;

    &:focus {
      outline: none;
    }

    // Podstawowe formatowanie tekstu
    strong,
    b {
      font-weight: bold;
    }

    em,
    i {
      font-style: italic;
    }

    u {
      text-decoration: underline;
    }

    s,
    strike,
    del {
      text-decoration: line-through;
    }

    // Linki - domyślnie nieklikalne
    a {
      color: var(--accent_300);
      font-weight: 500;
      pointer-events: none;
      cursor: text;
      text-decoration: underline;
    }

    // Highlight (zamiennik <mark>)
    mark,
    .highlight-mark {
      background-color: var(--background_500);
      border: 1px solid var(--accent_600);
      padding: 2px 4px;
      border-radius: 8px;
      color: var(--foreground_200);
    }

    // Paragrafy
    p {
      margin: 16px 0;

      &:first-child {
        margin-top: 0px;
      }

      &:last-child {
        margin-bottom: 0px;
      }
    }

    // Placeholder (gdy edytor jest pusty)
    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: var(--text_400);
      pointer-events: none;
      height: 0;
    }
  }

  // Linki z Alt - klikalne
  &.alt-pressed .ProseMirror a {
    pointer-events: auto;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background-color: var(--background_200);
      outline: 1px solid var(--accent_600);
    }
  }
}

.app-theme-provider.maximized .tiptap-editor {
  .ProseMirror {
    padding: 24px;
  }
}
</style>
