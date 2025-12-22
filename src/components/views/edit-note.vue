<script setup lang="ts">
import OptionsBar from '@/components/layout/options-bar.vue'
import Button from '@/components/common/button.vue'
import { useAppStore, useDiaryStore } from '@/stores'
import InputContent from '@/components/inputs/input-content.vue'
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
const editorRef = ref<InstanceType<typeof InputContent>>()
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

  setTimeout(() => {
    const editor = editorRef.value?.$el
    if (editor) {
      editor.focus()

      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(editor)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
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
const savedSelection = ref<Range | null>(null)

const updateActiveStyles = (styles: typeof activeStyles.value) => {
  activeStyles.value = styles
}

const applyFormat = (command: string, value?: string) => {
  editorRef.value?.execCommand(command, value)
}

const insertMark = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  if (range.collapsed) return

  const startMarker = document.createElement('span')
  startMarker.setAttribute('data-selection-marker', 'start')
  startMarker.style.display = 'none'

  const endMarker = document.createElement('span')
  endMarker.setAttribute('data-selection-marker', 'end')
  endMarker.style.display = 'none'

  const rangeClone = range.cloneRange()
  rangeClone.collapse(false)
  rangeClone.insertNode(endMarker)

  const rangeStart = range.cloneRange()
  rangeStart.collapse(true)
  rangeStart.insertNode(startMarker)

  const restoreSelection = () => {
    const isStartInDoc = startMarker.parentNode && document.contains(startMarker)
    const isEndInDoc = endMarker.parentNode && document.contains(endMarker)

    if (!isStartInDoc || !isEndInDoc) {
      console.warn('Markery zostały usunięte z DOM lub nie są w dokumencie')
      if (startMarker.parentNode) {
        try {
          startMarker.parentNode.removeChild(startMarker)
        } catch (e) {}
      }
      if (endMarker.parentNode) {
        try {
          endMarker.parentNode.removeChild(endMarker)
        } catch (e) {}
      }
      return
    }

    try {
      const newRange = document.createRange()
      newRange.setStartAfter(startMarker)
      newRange.setEndBefore(endMarker)

      startMarker.parentNode.removeChild(startMarker)
      endMarker.parentNode.removeChild(endMarker)

      selection.removeAllRanges()
      selection.addRange(newRange)

      if (editorRef.value?.$el) {
        editorRef.value.$el.normalize()
      }
    } catch (e) {
      console.error('Błąd przy przywracaniu zaznaczenia:', e)
      if (startMarker.parentNode) {
        try {
          startMarker.parentNode.removeChild(startMarker)
        } catch (e) {}
      }
      if (endMarker.parentNode) {
        try {
          endMarker.parentNode.removeChild(endMarker)
        } catch (e) {}
      }
    }
  }

  const findMarksInRange = (range: Range): HTMLElement[] => {
    const marks: HTMLElement[] = []
    const iterator = document.createNodeIterator(
      editorRef.value?.$el || document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: node => {
          if ((node as HTMLElement).tagName === 'MARK' && range.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_REJECT
        }
      }
    )

    let node
    while ((node = iterator.nextNode())) {
      marks.push(node as HTMLElement)
    }
    return marks
  }

  const newRange = document.createRange()
  newRange.setStartAfter(startMarker)
  newRange.setEndBefore(endMarker)

  const existingMarks = findMarksInRange(newRange)

  if (existingMarks.length === 0) {
    const extractedContent = newRange.extractContents()
    const mark = document.createElement('mark')
    mark.appendChild(extractedContent)
    newRange.insertNode(mark)

    restoreSelection()

    if (editorRef.value) {
      const event = new Event('input', { bubbles: true })
      editorRef.value.$el.dispatchEvent(event)
    }

    return
  }

  if (existingMarks.length === 1) {
    const mark = existingMarks[0]
    const markRange = document.createRange()
    markRange.selectNodeContents(mark)

    if (
      newRange.compareBoundaryPoints(Range.START_TO_START, markRange) === 0 &&
      newRange.compareBoundaryPoints(Range.END_TO_END, markRange) === 0
    ) {
      const parent = mark.parentNode
      const fragment = document.createDocumentFragment()
      while (mark.firstChild) {
        fragment.appendChild(mark.firstChild)
      }
      parent?.replaceChild(fragment, mark)

      if (editorRef.value?.$el) {
        editorRef.value.$el.normalize()
      }

      restoreSelection()

      if (editorRef.value) {
        const event = new Event('input', { bubbles: true })
        editorRef.value.$el.dispatchEvent(event)
      }

      return
    }
  }

  let isCompletelyInside = false
  let containingMark: HTMLElement | null = null

  for (const mark of existingMarks) {
    if (mark.contains(newRange.startContainer) && mark.contains(newRange.endContainer)) {
      isCompletelyInside = true
      containingMark = mark
      break
    }
  }

  if (isCompletelyInside && containingMark) {
    const markParent = containingMark.parentNode
    if (!markParent) return

    const markerPlaceholderStart = document.createElement('span')
    markerPlaceholderStart.style.display = 'none'
    const markerPlaceholderEnd = document.createElement('span')
    markerPlaceholderEnd.style.display = 'none'

    if (startMarker.parentNode) {
      startMarker.parentNode.insertBefore(markerPlaceholderStart, startMarker)
      markParent.insertBefore(startMarker, containingMark)
    }
    if (endMarker.parentNode) {
      endMarker.parentNode.insertBefore(markerPlaceholderEnd, endMarker)
      if (containingMark.nextSibling) {
        markParent.insertBefore(endMarker, containingMark.nextSibling)
      } else {
        markParent.appendChild(endMarker)
      }
    }

    const beforeRange = document.createRange()
    beforeRange.setStart(containingMark, 0)

    const startPlaceholder = containingMark.querySelector('span')
    if (startPlaceholder && startPlaceholder === markerPlaceholderStart.nextSibling) {
      beforeRange.setEndBefore(markerPlaceholderStart)
    } else {
      beforeRange.setEnd(newRange.startContainer, newRange.startOffset)
    }

    const afterRange = document.createRange()
    if (
      markerPlaceholderEnd.previousSibling &&
      containingMark.contains(markerPlaceholderEnd.previousSibling)
    ) {
      afterRange.setStartAfter(markerPlaceholderEnd)
    } else {
      afterRange.setStart(newRange.endContainer, newRange.endOffset)
    }
    afterRange.setEnd(containingMark, containingMark.childNodes.length)

    const beforeContent = beforeRange.cloneContents()
    const selectedRange = document.createRange()
    selectedRange.setStartAfter(markerPlaceholderStart)
    selectedRange.setEndBefore(markerPlaceholderEnd)
    const selectedContent = selectedRange.cloneContents()
    const afterContent = afterRange.cloneContents()

    if (markerPlaceholderStart.parentNode) {
      markerPlaceholderStart.parentNode.removeChild(markerPlaceholderStart)
    }
    if (markerPlaceholderEnd.parentNode) {
      markerPlaceholderEnd.parentNode.removeChild(markerPlaceholderEnd)
    }

    const fragment = document.createDocumentFragment()
    if (beforeContent.textContent?.trim()) {
      const beforeMark = document.createElement('mark')
      beforeMark.appendChild(beforeContent)
      fragment.appendChild(beforeMark)
    }

    if (startMarker.parentNode) {
      startMarker.parentNode.removeChild(startMarker)
    }
    fragment.appendChild(startMarker)

    const cleanSelected = document.createElement('div')
    cleanSelected.appendChild(selectedContent)
    while (cleanSelected.firstChild) {
      fragment.appendChild(cleanSelected.firstChild)
    }

    if (endMarker.parentNode) {
      endMarker.parentNode.removeChild(endMarker)
    }
    fragment.appendChild(endMarker)

    if (afterContent.textContent?.trim()) {
      const afterMark = document.createElement('mark')
      afterMark.appendChild(afterContent)
      fragment.appendChild(afterMark)
    }

    markParent.replaceChild(fragment, containingMark)

    if (editorRef.value?.$el) {
      editorRef.value.$el.normalize()
    }

    restoreSelection()

    if (editorRef.value) {
      const event = new Event('input', { bubbles: true })
      editorRef.value.$el.dispatchEvent(event)
    }

    return
  }

  const markBoundaries: HTMLElement[] = []

  existingMarks.forEach(mark => {
    const beforeMarker = document.createElement('span')
    beforeMarker.setAttribute('data-mark-boundary', 'before')
    beforeMarker.style.display = 'none'
    mark.parentNode?.insertBefore(beforeMarker, mark)
    markBoundaries.push(beforeMarker)

    const afterMarker = document.createElement('span')
    afterMarker.setAttribute('data-mark-boundary', 'after')
    afterMarker.style.display = 'none'
    if (mark.nextSibling) {
      mark.parentNode?.insertBefore(afterMarker, mark.nextSibling)
    } else {
      mark.parentNode?.appendChild(afterMarker)
    }
    markBoundaries.push(afterMarker)
  })

  let leftmostMarker = startMarker
  let rightmostMarker = endMarker

  markBoundaries.forEach(boundary => {
    const compareStart = boundary.compareDocumentPosition(startMarker)
    if (compareStart & Node.DOCUMENT_POSITION_FOLLOWING) {
      leftmostMarker = boundary
    }

    const compareEnd = boundary.compareDocumentPosition(endMarker)
    if (compareEnd & Node.DOCUMENT_POSITION_PRECEDING) {
      rightmostMarker = boundary
    }
  })

  existingMarks.forEach(mark => {
    const parent = mark.parentNode
    while (mark.firstChild) {
      parent?.insertBefore(mark.firstChild, mark)
    }
    parent?.removeChild(mark)
  })

  if (editorRef.value?.$el) {
    editorRef.value.$el.normalize()
  }

  if (!leftmostMarker.parentNode || !rightmostMarker.parentNode) {
    console.warn('Markery zostały usunięte podczas usuwania marków, pomijam operację')
    if (startMarker.parentNode) startMarker.parentNode.removeChild(startMarker)
    if (endMarker.parentNode) endMarker.parentNode.removeChild(endMarker)
    markBoundaries.forEach(m => {
      if (m.parentNode) m.parentNode.removeChild(m)
    })
    return
  }

  const finalRange = document.createRange()
  finalRange.setStartAfter(leftmostMarker)
  finalRange.setEndBefore(rightmostMarker)

  const extractedContent = finalRange.extractContents()
  const mark = document.createElement('mark')
  mark.appendChild(extractedContent)
  finalRange.insertNode(mark)

  markBoundaries.forEach(boundary => {
    if (boundary.parentNode) {
      boundary.parentNode.removeChild(boundary)
    }
  })

  if (editorRef.value?.$el) {
    editorRef.value.$el.normalize()
  }

  restoreSelection()

  if (editorRef.value) {
    const event = new Event('input', { bubbles: true })
    editorRef.value.$el.dispatchEvent(event)
  }

  setTimeout(() => {
    if (editorRef.value) {
      editorRef.value.checkActiveStyles()
    }
  }, 0)
}

const insertLink = () => {
  const selection = window.getSelection()
  let linkElement: HTMLAnchorElement | null = null
  let selectedText = selection?.toString() || ''

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

  if (selection && selection.rangeCount > 0) {
    savedSelection.value = selection.getRangeAt(0).cloneRange()
  }

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

const removeLink = () => {
  if (savedSelection.value) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(savedSelection.value)
    }
  }

  const selection = window.getSelection()
  let linkElement: HTMLAnchorElement | null = null

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

  if (linkElement) {
    const textNode = document.createTextNode(linkElement.textContent || '')
    linkElement.parentNode?.replaceChild(textNode, linkElement)
  }

  closeLinkModal()
}

const confirmInsertLink = () => {
  if (savedSelection.value) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(savedSelection.value)
    }
  }

  const selection = window.getSelection()
  let linkElement: HTMLAnchorElement | null = null

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

  if (!linkForm.value.url) {
    if (linkElement) {
      const textNode = document.createTextNode(linkElement.textContent || '')
      linkElement.parentNode?.replaceChild(textNode, linkElement)
    }
    closeLinkModal()
    return
  }

  let normalizedUrl = linkForm.value.url.trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl
  }

  if (linkElement) {
    linkElement.href = normalizedUrl
    linkElement.textContent = linkForm.value.text
    closeLinkModal()
    return
  }

  if (linkForm.value.text) {
    applyFormat('insertText', linkForm.value.text)
    applyFormat('insertText', linkForm.value.text)

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

const clearFormat = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  if (range.collapsed) return

  const startMarker = document.createElement('span')
  startMarker.setAttribute('data-selection-marker', 'start')
  startMarker.style.display = 'none'

  const endMarker = document.createElement('span')
  endMarker.setAttribute('data-selection-marker', 'end')
  endMarker.style.display = 'none'

  const rangeClone = range.cloneRange()
  rangeClone.collapse(true)
  rangeClone.insertNode(startMarker)

  const rangeClone2 = range.cloneRange()
  rangeClone2.collapse(false)
  rangeClone2.insertNode(endMarker)

  const findMarksInRange = (range: Range): HTMLElement[] => {
    const marks: HTMLElement[] = []
    const iterator = document.createNodeIterator(
      editorRef.value?.$el || document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: node => {
          if ((node as HTMLElement).tagName === 'MARK' && range.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_REJECT
        }
      }
    )

    let node
    while ((node = iterator.nextNode())) {
      marks.push(node as HTMLElement)
    }
    return marks
  }

  const findLinksInRange = (range: Range): HTMLElement[] => {
    const links: HTMLElement[] = []
    const iterator = document.createNodeIterator(
      editorRef.value?.$el || document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: node => {
          if ((node as HTMLElement).tagName === 'A' && range.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_REJECT
        }
      }
    )

    let node
    while ((node = iterator.nextNode())) {
      links.push(node as HTMLElement)
    }
    return links
  }

  const existingMarks = findMarksInRange(range)
  const existingLinks = findLinksInRange(range)

  if (existingMarks.length > 0) {
    existingMarks.forEach(mark => {
      const markRange = document.createRange()
      markRange.selectNodeContents(mark)

      const isFullySelected =
        range.compareBoundaryPoints(Range.START_TO_START, markRange) <= 0 &&
        range.compareBoundaryPoints(Range.END_TO_END, markRange) >= 0

      if (isFullySelected) {
        const parent = mark.parentNode
        while (mark.firstChild) {
          parent?.insertBefore(mark.firstChild, mark)
        }
        parent?.removeChild(mark)
      } else if (mark.contains(range.startContainer) && mark.contains(range.endContainer)) {
        const markParent = mark.parentNode
        if (!markParent) return

        const beforeRange = document.createRange()
        beforeRange.setStart(mark, 0)
        beforeRange.setEnd(range.startContainer, range.startOffset)

        const afterRange = document.createRange()
        afterRange.setStart(range.endContainer, range.endOffset)
        afterRange.setEnd(mark, mark.childNodes.length)

        const beforeContent = beforeRange.cloneContents()
        const selectedContent = range.cloneContents()
        const afterContent = afterRange.cloneContents()

        const fragment = document.createDocumentFragment()

        if (beforeContent.textContent?.trim()) {
          const beforeMark = document.createElement('mark')
          beforeMark.appendChild(beforeContent)
          fragment.appendChild(beforeMark)
        }

        const cleanSelected = document.createElement('div')
        cleanSelected.appendChild(selectedContent)
        while (cleanSelected.firstChild) {
          fragment.appendChild(cleanSelected.firstChild)
        }

        if (afterContent.textContent?.trim()) {
          const afterMark = document.createElement('mark')
          afterMark.appendChild(afterContent)
          fragment.appendChild(afterMark)
        }

        markParent.replaceChild(fragment, mark)
      } else {
        const markParent = mark.parentNode
        if (!markParent) return

        const markRange = document.createRange()
        markRange.selectNodeContents(mark)

        const selectionStartsInMark = mark.contains(range.startContainer)
        const selectionEndsInMark = mark.contains(range.endContainer)

        if (selectionStartsInMark && !selectionEndsInMark) {
          const beforeRange = document.createRange()
          beforeRange.setStart(mark, 0)
          beforeRange.setEnd(range.startContainer, range.startOffset)

          const beforeContent = beforeRange.cloneContents()

          if (beforeContent.textContent?.trim()) {
            const newMark = document.createElement('mark')
            newMark.appendChild(beforeContent)
            markParent.insertBefore(newMark, mark)
          }

          const afterRange = document.createRange()
          afterRange.setStart(range.startContainer, range.startOffset)
          afterRange.setEnd(mark, mark.childNodes.length)
          const afterContent = afterRange.cloneContents()

          const cleanDiv = document.createElement('div')
          cleanDiv.appendChild(afterContent)
          while (cleanDiv.firstChild) {
            markParent.insertBefore(cleanDiv.firstChild, mark)
          }

          markParent.removeChild(mark)
        } else if (!selectionStartsInMark && selectionEndsInMark) {
          const afterRange = document.createRange()
          afterRange.setStart(range.endContainer, range.endOffset)
          afterRange.setEnd(mark, mark.childNodes.length)

          const afterContent = afterRange.cloneContents()

          const beforeRange = document.createRange()
          beforeRange.setStart(mark, 0)
          beforeRange.setEnd(range.endContainer, range.endOffset)
          const beforeContent = beforeRange.cloneContents()

          const cleanDiv = document.createElement('div')
          cleanDiv.appendChild(beforeContent)
          while (cleanDiv.firstChild) {
            markParent.insertBefore(cleanDiv.firstChild, mark)
          }

          if (afterContent.textContent?.trim()) {
            const newMark = document.createElement('mark')
            newMark.appendChild(afterContent)
            markParent.insertBefore(newMark, mark)
          }

          markParent.removeChild(mark)
        } else {
          const parent = mark.parentNode
          while (mark.firstChild) {
            parent?.insertBefore(mark.firstChild, mark)
          }
          parent?.removeChild(mark)
        }
      }
    })

    if (editorRef.value?.$el) {
      editorRef.value.$el.normalize()
    }
  }

  if (existingLinks.length > 0) {
    existingLinks.forEach(link => {
      const parent = link.parentNode
      while (link.firstChild) {
        parent?.insertBefore(link.firstChild, link)
      }
      parent?.removeChild(link)
    })

    if (editorRef.value?.$el) {
      editorRef.value.$el.normalize()
    }
  }

  const start = editorRef.value?.$el?.querySelector('[data-selection-marker="start"]')
  const end = editorRef.value?.$el?.querySelector('[data-selection-marker="end"]')

  if (start && end && document.contains(start) && document.contains(end)) {
    const sel = window.getSelection()
    if (sel) {
      const restoredRange = document.createRange()
      restoredRange.setStartAfter(start)
      restoredRange.setEndBefore(end)

      sel.removeAllRanges()
      sel.addRange(restoredRange)
    }

    try {
      start.remove()
      end.remove()
    } catch (e) {}
  }

  document.execCommand('removeFormat', false)

  if (editorRef.value) {
    const event = new Event('input', { bubbles: true })
    editorRef.value.$el.dispatchEvent(event)
  }

  setTimeout(() => {
    if (editorRef.value) {
      editorRef.value.checkActiveStyles()
    }
  }, 0)
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
  <div class="edit-note">
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
    <InputContent
      ref="editorRef"
      v-model="content"
      @update:active-styles="updateActiveStyles"
      @update:model-value="
        isEditingExisting ? appStore.setEditedContent($event) : appStore.setDraft($event)
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
  height: 100%;
  background-color: var(--background_400);
}

.app-theme-provider.maximized .edit-note {
  padding: 60px 0px 0px 0px;
}
</style>
