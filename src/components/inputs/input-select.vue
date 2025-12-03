<script setup lang="ts">
import InfoText from '@/components/inputs/info-text.vue'
import Icon from '@/components/icon.vue'
import { ref, watch, computed } from 'vue'

interface SelectOption {
  value: string
  title: string
}

const emit = defineEmits(['update'])
const props = defineProps<{
  name?: string
  value?: string
  options?: SelectOption[]
  infoText?: string
}>()

const currentValue = ref(props.value)
const wrapperRef = ref<HTMLDivElement | null>(null)

watch(props, newProps => {
  currentValue.value = newProps.value
})

function select(value: string, event: Event) {
  ;(event.target as HTMLElement).blur()
  currentValue.value = value

  emit('update', {
    name: props.name,
    value: currentValue.value
  })
}

function handleClickInput(e?: Event) {
  if (document.activeElement == wrapperRef.value) {
    e?.preventDefault()
    ;(document.activeElement as HTMLElement)?.blur()
  }
}

const currentTitle = computed(() => {
  return props.options?.find(x => x.value === currentValue.value)?.title ?? ''
})
</script>

<template>
  <div class="input-select">
    <select class="default-select" :name="name" :value="currentValue">
      <option v-for="option in options" :value="option.value">{{ option.title }}</option>
    </select>
    <div class="select-wrapper" ref="wrapperRef" tabindex="0">
      <div
        class="select-input"
        @mousedown="handleClickInput($event)"
        @keydown.enter="handleClickInput(undefined)"
      >
        <div class="text">{{ currentTitle }}</div>
        <div class="icon">
          <Icon :name="`arrow-down`" :size="16" />
        </div>
      </div>
      <div class="select-list">
        <div
          v-for="option in options"
          class="list-item"
          :class="{ selected: option.value === currentValue }"
          tabindex="0"
          @click="select(option.value, $event)"
          @keydown.enter="select(option.value, $event)"
        >
          {{ option.title }}
        </div>
      </div>
    </div>
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
  </div>
</template>

<style lang="scss" scoped>
.input-select {
  display: flex;
  justify-content: flex-end;
}

.select-wrapper {
  min-height: 44px;
  position: relative;
  outline: none;
  -webkit-app-region: no-drag;
  user-select: none;
  width: 100%;

  .select-input {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 12px;
    background: var(--HL3);
    border: 1px solid var(--HL2);
    border-radius: 8px;
    overflow: hidden;
    outline: none;
    color: var(--F1);
    cursor: pointer;
    font-size: var(--FS4);
    width: 100%;

    .text {
      margin-right: 8px;
      text-align: left;
      line-height: 21px;
    }

    .icon {
      width: 16px;
      height: 16px;
    }

    &:hover,
    &:focus-visible {
      background: var(--HL2);
      box-shadow: inset 0 0 0 1px var(--HL1);
    }
  }

  .select-list {
    position: absolute;
    display: none;
    border: 1px solid var(--A1);
    border-top: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    width: 100%;

    .list-item {
      min-height: 44px;
      background-color: var(--BG2);
      cursor: pointer;
      padding: 9px 12px;
      outline: none;
      line-height: 21px;

      &:hover,
      &:focus-visible {
        background: var(--HL2);
        box-shadow: inset 0 0 0 1px var(--HL1);
      }

      &:active {
        box-shadow: inset 0 0 0 1px var(--F2);
      }

      &.selected {
        color: var(--A1);
      }

      &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }

  &:focus,
  &:focus-within {
    // padding-bottom: 1px;
    z-index: 2;

    .select-input {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-color: var(--A1);
      border-bottom: none !important;
      position: relative;

      .icon {
        transform: rotate(180deg);
      }

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        border-top: 1px dotted var(--HL1);
      }
    }

    .select-list {
      display: block;
    }
  }

  &:focus-visible {
    .select-input {
      background: var(--HL2);
      box-shadow: inset 0 0 0 1px var(--HL1);
    }
  }
}

.default-select {
  display: none;
}
</style>
