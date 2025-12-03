<script setup lang="ts">
import InfoText from '@/components/inputs/info-text.vue'
import Icon from '@/components/icon.vue'
import { ref, watch, toRaw } from 'vue'
import type { KeyBinding } from '@/interfaces/diary'

const emit = defineEmits(['update'])
const props = defineProps({
  name: String,
  value: Object,
  infoText: String
})

const currentValue = ref<KeyBinding[] | undefined>(props.value as KeyBinding[] | undefined)

watch(props, newProps => {
  currentValue.value = newProps.value as KeyBinding[] | undefined
})

const buttonRef = ref<HTMLButtonElement | null>(null)
const combination = ref<KeyBinding[]>([])
const combinationApprove = ref<number[]>([])

function resetCombination() {
  combination.value = []
  combinationApprove.value = []
}

function handleKeydown(event: KeyboardEvent) {
  if (event.keyCode === 27) {
    // Esc key
    buttonRef.value?.blur()
    resetCombination()
    return
  }

  if (
    !combination.value.find(x => x.code === event.keyCode) &&
    combination.value.length === combinationApprove.value.length
  ) {
    combination.value.push({
      code: event.keyCode,
      key: event.key
    })
    combinationApprove.value.push(event.keyCode)
  }
}

function handleKeyup(event: KeyboardEvent) {
  const keyIndex = combinationApprove.value.indexOf(event.keyCode)
  if (keyIndex === -1) return
  combinationApprove.value.splice(keyIndex, 1)
  if (combinationApprove.value.length === 0) {
    currentValue.value = combination.value
    buttonRef.value?.blur()
    resetCombination()
    emit('update', {
      name: props.name,
      value: currentValue.value
    })
  }
}

function formatCombination(combo: KeyBinding[] | undefined) {
  if (!combo) return ''
  let result = ''
  combo.map((el, index) => {
    if (index > 0) result += ' + '
    result += el.key === 'Meta' ? 'Windows' : el.key.charAt(0).toUpperCase() + el.key.slice(1)
  })
  return result
}
</script>

<template>
  <div class="input-keybind">
    <button
      class="keybind-button"
      ref="buttonRef"
      type="button"
      @keydown.prevent="handleKeydown"
      @keyup.prevent="handleKeyup"
      @focus="resetCombination()"
    >
      <div class="icon">
        <Icon name="button" :size="16" />
      </div>
      <div class="text">{{ formatCombination(currentValue) }}</div>
      <div class="text-record">
        <template v-if="combination.length === 0"> Wciśnij kombinację </template>
        <template v-if="combination.length > 0">
          {{ formatCombination(combination) }}
        </template>
      </div>
    </button>
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
  </div>
</template>

<style lang="scss" scoped>
.input-keybind {
  position: relative;
  display: flex;
  justify-content: flex-end;

  .keybind-button {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    padding: 9px 12px;
    background: var(--HL3);
    border: 1px solid var(--HL2);
    border-radius: 8px;
    overflow: hidden;
    outline: none;
    color: var(--F1);
    cursor: pointer;
    font-size: var(--FS4);
    -webkit-app-region: no-drag;

    .icon {
      width: 16px;
      height: 16px;
    }

    .text,
    .text-record {
      margin-left: 8px;
      text-align: left;
      line-height: 21px;
    }

    .text-record {
      display: none;
    }

    &:hover,
    &:focus-visible {
      background: var(--HL2);
      border-color: var(--HL1);
    }

    &:focus,
    &:active {
      border-color: var(--A1);

      .text {
        display: none;
      }

      .text-record {
        display: block;
      }
    }
  }
}
</style>
