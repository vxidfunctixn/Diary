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

  // Użyj elementów SPAN jako markerów (przetrwają operacje na MARK)
  const startMarker = document.createElement('span')
  startMarker.setAttribute('data-selection-marker', 'start')
  startMarker.style.display = 'none'

  const endMarker = document.createElement('span')
  endMarker.setAttribute('data-selection-marker', 'end')
  endMarker.style.display = 'none'

  const rangeClone = range.cloneRange()
  rangeClone.collapse(false) // Na końcu
  rangeClone.insertNode(endMarker)

  const rangeStart = range.cloneRange()
  rangeStart.collapse(true) // Na początku
  rangeStart.insertNode(startMarker)

  // Funkcja do przywracania zaznaczenia używając markerów
  const restoreSelection = () => {
    // Sprawdź czy markery nadal istnieją w DOM i czy są w dokumencie
    const isStartInDoc = startMarker.parentNode && document.contains(startMarker)
    const isEndInDoc = endMarker.parentNode && document.contains(endMarker)

    if (!isStartInDoc || !isEndInDoc) {
      console.warn('Markery zostały usunięte z DOM lub nie są w dokumencie')
      // Usuń markery jeśli nadal gdzieś istnieją
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

      // Usuń markery
      startMarker.parentNode.removeChild(startMarker)
      endMarker.parentNode.removeChild(endMarker)

      selection.removeAllRanges()
      selection.addRange(newRange)

      // Normalizuj po usunięciu markerów
      if (editorRef.value?.$el) {
        editorRef.value.$el.normalize()
      }
    } catch (e) {
      console.error('Błąd przy przywracaniu zaznaczenia:', e)
      // Usuń markery jeśli nadal istnieją
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

  // Funkcja do znalezienia wszystkich węzłów mark w zakresie
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

  // Pobierz świeży range po wstawieniu markerów
  const newRange = document.createRange()
  newRange.setStartAfter(startMarker)
  newRange.setEndBefore(endMarker)

  const existingMarks = findMarksInRange(newRange)

  if (existingMarks.length === 0) {
    // Brak marków - po prostu dodaj nowy
    const extractedContent = newRange.extractContents()
    const mark = document.createElement('mark')
    mark.appendChild(extractedContent)
    newRange.insertNode(mark)

    restoreSelection()
    return
  }

  // WARUNEK 1: Czy zaznaczenie całkowicie pokrywa się z jednym markiem
  if (existingMarks.length === 1) {
    const mark = existingMarks[0]
    const markRange = document.createRange()
    markRange.selectNodeContents(mark)

    if (
      newRange.compareBoundaryPoints(Range.START_TO_START, markRange) === 0 &&
      newRange.compareBoundaryPoints(Range.END_TO_END, markRange) === 0
    ) {
      // Zaznaczenie = cały mark → usuń mark
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
      return
    }
  }

  // WARUNEK 2: Czy zaznaczenie jest całkowicie wewnątrz jednego marka
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
    // Zaznaczenie wewnątrz marka → podziel mark (substract)
    const markParent = containingMark.parentNode
    if (!markParent) return

    // Przenieś markery na zewnątrz marka, aby nie zostały usunięte
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

    // Stwórz trzy zakresy: przed, zaznaczenie, po
    const beforeRange = document.createRange()
    beforeRange.setStart(containingMark, 0)

    // Znajdź placeholder w zawartości marka i użyj jako punktu końcowego
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

    // Usuń placeholdery
    if (markerPlaceholderStart.parentNode) {
      markerPlaceholderStart.parentNode.removeChild(markerPlaceholderStart)
    }
    if (markerPlaceholderEnd.parentNode) {
      markerPlaceholderEnd.parentNode.removeChild(markerPlaceholderEnd)
    }

    // Usuń stary mark
    const fragment = document.createDocumentFragment()

    // Dodaj przed (w mark jeśli nie puste)
    if (beforeContent.textContent?.trim()) {
      const beforeMark = document.createElement('mark')
      beforeMark.appendChild(beforeContent)
      fragment.appendChild(beforeMark)
    }

    // Przenieś startMarker do fragmentu (przed zaznaczeniem)
    if (startMarker.parentNode) {
      startMarker.parentNode.removeChild(startMarker)
    }
    fragment.appendChild(startMarker)

    // Dodaj zaznaczenie (BEZ mark)
    const cleanSelected = document.createElement('div')
    cleanSelected.appendChild(selectedContent)
    while (cleanSelected.firstChild) {
      fragment.appendChild(cleanSelected.firstChild)
    }

    // Przenieś endMarker do fragmentu (po zaznaczeniu)
    if (endMarker.parentNode) {
      endMarker.parentNode.removeChild(endMarker)
    }
    fragment.appendChild(endMarker)

    // Dodaj po (w mark jeśli nie puste)
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
    return
  }

  // WARUNEK 3: Zaznaczenie zawiera marki lub przecina się z nimi → scal wszystko

  // Dodaj markery na początku i końcu każdego istniejącego marka, aby rozszerzyć zakres
  const markBoundaries: HTMLElement[] = []

  existingMarks.forEach(mark => {
    // Dodaj marker przed markiem
    const beforeMarker = document.createElement('span')
    beforeMarker.setAttribute('data-mark-boundary', 'before')
    beforeMarker.style.display = 'none'
    mark.parentNode?.insertBefore(beforeMarker, mark)
    markBoundaries.push(beforeMarker)

    // Dodaj marker po marku
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

  // Znajdź najbardziej skrajne pozycje
  let leftmostMarker = startMarker
  let rightmostMarker = endMarker

  markBoundaries.forEach(boundary => {
    const compareStart = boundary.compareDocumentPosition(startMarker)
    if (compareStart & Node.DOCUMENT_POSITION_FOLLOWING) {
      // boundary jest przed startMarker
      leftmostMarker = boundary
    }

    const compareEnd = boundary.compareDocumentPosition(endMarker)
    if (compareEnd & Node.DOCUMENT_POSITION_PRECEDING) {
      // boundary jest po endMarker
      rightmostMarker = boundary
    }
  })

  // Usuń wszystkie istniejące marki (markery-spany przetrwają)
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

  // Sprawdź czy markery przetrwały
  if (!leftmostMarker.parentNode || !rightmostMarker.parentNode) {
    console.warn('Markery zostały usunięte podczas usuwania marków, pomijam operację')
    // Usuń wszystkie markery
    if (startMarker.parentNode) startMarker.parentNode.removeChild(startMarker)
    if (endMarker.parentNode) endMarker.parentNode.removeChild(endMarker)
    markBoundaries.forEach(m => {
      if (m.parentNode) m.parentNode.removeChild(m)
    })
    return
  }

  // Utwórz zakres od najbardziej lewej do najbardziej prawej pozycji
  const finalRange = document.createRange()
  finalRange.setStartAfter(leftmostMarker)
  finalRange.setEndBefore(rightmostMarker)

  // Wyciągnij zawartość i owrap w mark
  const extractedContent = finalRange.extractContents()
  const mark = document.createElement('mark')
  mark.appendChild(extractedContent)
  finalRange.insertNode(mark)

  // Usuń markery granic
  markBoundaries.forEach(boundary => {
    if (boundary.parentNode) {
      boundary.parentNode.removeChild(boundary)
    }
  })

  if (editorRef.value?.$el) {
    editorRef.value.$el.normalize()
  }

  restoreSelection()

  // Aktualizuj zawartość
  if (editorRef.value) {
    const event = new Event('input', { bubbles: true })
    editorRef.value.$el.dispatchEvent(event)
  }

  // Wymuś sprawdzenie aktywnych stylów
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

const clearFormat = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  if (range.collapsed) return

  // Zapisz pozycję selection za pomocą markerów
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

  // Najpierw obsłuż marki w zaznaczeniu
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

  const existingMarks = findMarksInRange(range)

  // Jeśli są marki w zaznaczeniu, obsłuż je
  if (existingMarks.length > 0) {
    existingMarks.forEach(mark => {
      // Sprawdź czy zaznaczenie obejmuje cały mark
      const markRange = document.createRange()
      markRange.selectNodeContents(mark)

      const isFullySelected =
        range.compareBoundaryPoints(Range.START_TO_START, markRange) <= 0 &&
        range.compareBoundaryPoints(Range.END_TO_END, markRange) >= 0

      if (isFullySelected) {
        // Całe mark jest zaznaczone - usuń całe
        const parent = mark.parentNode
        while (mark.firstChild) {
          parent?.insertBefore(mark.firstChild, mark)
        }
        parent?.removeChild(mark)
      } else if (mark.contains(range.startContainer) && mark.contains(range.endContainer)) {
        // Zaznaczenie jest wewnątrz marka - podziel mark (jak substract)
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

        // Środek bez marka
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
        // Zaznaczenie częściowo nachodzi - skróć mark
        const markParent = mark.parentNode
        if (!markParent) return

        const markRange = document.createRange()
        markRange.selectNodeContents(mark)

        // Sprawdź czy zaznaczenie nachodzi od początku czy od końca
        const selectionStartsInMark = mark.contains(range.startContainer)
        const selectionEndsInMark = mark.contains(range.endContainer)

        if (selectionStartsInMark && !selectionEndsInMark) {
          // Zaznaczenie zaczyna się w marku i wychodzi poza - zachowaj początek marka przed zaznaczeniem
          const beforeRange = document.createRange()
          beforeRange.setStart(mark, 0)
          beforeRange.setEnd(range.startContainer, range.startOffset)

          const beforeContent = beforeRange.cloneContents()

          if (beforeContent.textContent?.trim()) {
            const newMark = document.createElement('mark')
            newMark.appendChild(beforeContent)
            markParent.insertBefore(newMark, mark)
          }

          // Dodaj resztę bez formatowania
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
          // Zaznaczenie zaczyna się przed markiem i kończy w środku - zachowaj koniec marka po zaznaczeniu
          const afterRange = document.createRange()
          afterRange.setStart(range.endContainer, range.endOffset)
          afterRange.setEnd(mark, mark.childNodes.length)

          const afterContent = afterRange.cloneContents()

          // Dodaj początek bez formatowania
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
          // Zaznaczenie w ogóle nie nachodzi na zawartość marka - usuń cały mark
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

  // Przywróć selection PRZED removeFormat
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

    // Usuń markery
    try {
      start.remove()
      end.remove()
    } catch (e) {
      // Ignoruj błędy
    }
  }

  // Użyj wbudowanej komendy removeFormat dla pozostałych formatowań
  document.execCommand('removeFormat', false)

  // Wymuś sprawdzenie aktywnych stylów po wyczyszczeniu formatowania
  setTimeout(() => {
    if (editorRef.value) {
      editorRef.value.checkActiveStyles()
    }
  }, 0)
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
