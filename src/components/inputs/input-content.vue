<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'update:activeStyles'])

const editorElement = ref<HTMLDivElement | null>(null)
const isAltPressed = ref(false)

const checkActiveStyles = () => {
  const selection = window.getSelection()
  let isLink = false
  let isMark = false
  let isBold = false
  let isItalic = false
  let isUnderline = false
  let isStrikethrough = false

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
    underline: !isLink && isUnderline,
    strikethrough: isStrikethrough,
    link: isLink,
    mark: isMark
  }
  emit('update:activeStyles', activeStyles)
}

const handleSelectionChange = () => {
  const selection = window.getSelection()
  if (selection && editorElement.value?.contains(selection.anchorNode)) {
    checkActiveStyles()
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.altKey) {
    isAltPressed.value = true
  }

  if (event.key === 'Enter') {
    event.preventDefault()

    document.execCommand('insertHTML', false, '<br><br>')

    handleInput()
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (!event.altKey) {
    isAltPressed.value = false
  }
}

const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.tagName === 'A') {
    event.preventDefault()

    if (isAltPressed.value) {
      const href = target.getAttribute('href')
      if (href) {
        isAltPressed.value = false
        window.open(href, '_blank')
      }
    }
  }
}

onMounted(() => {
  if (editorElement.value && props.modelValue) {
    editorElement.value.innerHTML = props.modelValue
  }
  document.addEventListener('selectionchange', handleSelectionChange)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  document.removeEventListener('selectionchange', handleSelectionChange)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()

  const clipboardData = event.clipboardData
  if (!clipboardData) return

  const htmlData = clipboardData.getData('text/html')
  const textData = clipboardData.getData('text/plain')

  if (htmlData) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlData

    const cleanNode = (node: Node): Node | null => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.cloneNode(false)
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        const tagName = element.tagName.toLowerCase()

        const allowedTags: Record<string, string> = {
          b: 'b',
          strong: 'b',
          i: 'i',
          em: 'i',
          u: 'u',
          s: 's',
          strike: 's',
          del: 's',
          a: 'a',
          mark: 'mark'
        }

        const blockTags = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote']

        if (allowedTags[tagName]) {
          const newElement = document.createElement(allowedTags[tagName])

          if (tagName === 'a' && element.hasAttribute('href')) {
            const href = element.getAttribute('href') || ''
            newElement.setAttribute('href', href)
          }

          for (const child of Array.from(element.childNodes)) {
            const cleanedChild = cleanNode(child)
            if (cleanedChild) {
              newElement.appendChild(cleanedChild)
            }
          }

          if (tagName === 'a') {
            while (
              newElement.firstChild &&
              newElement.firstChild.nodeType === Node.ELEMENT_NODE &&
              (newElement.firstChild as HTMLElement).tagName === 'BR'
            ) {
              newElement.removeChild(newElement.firstChild)
            }
            while (
              newElement.lastChild &&
              newElement.lastChild.nodeType === Node.ELEMENT_NODE &&
              (newElement.lastChild as HTMLElement).tagName === 'BR'
            ) {
              newElement.removeChild(newElement.lastChild)
            }

            if (newElement.textContent?.trim() === '') {
              const href = newElement.getAttribute('href') || ''
              newElement.textContent = href
            }

            const wrapper = document.createDocumentFragment()
            wrapper.appendChild(newElement)
            wrapper.appendChild(document.createTextNode(' '))
            return wrapper
          }

          return newElement
        } else if (tagName === 'li') {
          const fragment = document.createDocumentFragment()
          for (const child of Array.from(node.childNodes)) {
            const cleanedChild = cleanNode(child)
            if (cleanedChild) {
              fragment.appendChild(cleanedChild)
            }
          }

          fragment.appendChild(document.createElement('br'))

          return fragment
        } else if (blockTags.includes(tagName)) {
          const fragment = document.createDocumentFragment()
          for (const child of Array.from(node.childNodes)) {
            const cleanedChild = cleanNode(child)
            if (cleanedChild) {
              fragment.appendChild(cleanedChild)
            }
          }

          fragment.appendChild(document.createElement('br'))
          fragment.appendChild(document.createElement('br'))

          return fragment
        } else {
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

    const fragment = document.createDocumentFragment()
    for (const child of Array.from(tempDiv.childNodes)) {
      const cleanedChild = cleanNode(child)
      if (cleanedChild) {
        fragment.appendChild(cleanedChild)
      }
    }

    // Usuń nadmiarowe <br> (więcej niż 2 pod rząd)
    const removeDuplicateBr = (parent: Node) => {
      const children = Array.from(parent.childNodes)
      let consecutiveBrCount = 0

      for (let i = 0; i < children.length; i++) {
        const child = children[i]

        if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName === 'BR') {
          consecutiveBrCount++
          if (consecutiveBrCount > 2) {
            child.parentNode?.removeChild(child)
          }
        } else {
          consecutiveBrCount = 0
          if (child.childNodes.length > 0) {
            removeDuplicateBr(child)
          }
        }
      }
    }

    const addSpaceBeforeLinks = (parent: Node) => {
      const children = Array.from(parent.childNodes)

      for (let i = 0; i < children.length; i++) {
        const child = children[i]

        if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName === 'A') {
          const prevSibling = child.previousSibling

          if (prevSibling) {
            const needsSpace =
              prevSibling.nodeType === Node.TEXT_NODE
                ? !prevSibling.textContent?.endsWith(' ')
                : (prevSibling as HTMLElement).tagName !== 'BR'

            if (needsSpace) {
              parent.insertBefore(document.createTextNode(' '), child)
            }
          }
        }

        if (child.childNodes.length > 0) {
          addSpaceBeforeLinks(child)
        }
      }
    }

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(fragment)

      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)

      // Usuń nadmiarowe <br> w całym edytorze
      if (editorElement.value) {
        removeDuplicateBr(editorElement.value)
        addSpaceBeforeLinks(editorElement.value)
      }
    }
  } else if (textData) {
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

  handleInput()
}

const handleInput = () => {
  if (editorElement.value) {
    emit('update:modelValue', editorElement.value.innerHTML)
    checkActiveStyles()
  }
}

watch(
  () => props.modelValue,
  newValue => {
    if (editorElement.value && editorElement.value.innerHTML !== newValue) {
      editorElement.value.innerHTML = newValue || ''
    }
  }
)

const execCommand = (command: string, value?: string) => {
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

  setTimeout(() => {
    checkActiveStyles()
  }, 0)
}

const handleLabelClick = () => {
  editorElement.value?.focus()
}

defineExpose({
  execCommand,
  checkActiveStyles
})
</script>

<template>
  <div class="content-wrapper" @click="handleLabelClick">
    <div
      ref="editorElement"
      class="content"
      :class="{ 'alt-pressed': isAltPressed }"
      contenteditable
      spellcheck="false"
      @input="handleInput"
      @paste="handlePaste"
      @click="handleClick"
    />
  </div>
</template>

<style lang="scss" scoped>
.content-wrapper {
  display: block;
  height: 100%;
  min-height: calc(100vh - 106px);

  .content {
    width: 100%;
    padding: 12px;
    height: 100%;
    overflow: auto;
    outline: none;
    max-width: 600px;
    margin: 0 auto;

    :deep(a) {
      color: var(--accent_300);
      font-weight: 500;
      pointer-events: none;
      cursor: text;
    }

    :deep(mark) {
      background-color: var(--background_500);
      border: 1px solid var(--accent_600);
      padding: 2px 4px;
      border-radius: 8px;
      color: var(--foreground_200);
    }

    &.alt-pressed :deep(a) {
      pointer-events: auto;
      cursor: pointer;
      border-radius: 4px;

      &:hover {
        background-color: var(--background_200);
        outline: 1px solid var(--accent_600);
      }
    }
  }
}
</style>
