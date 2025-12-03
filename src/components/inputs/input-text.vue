<script setup lang="ts">
import InfoText from '@/components/inputs/info-text.vue'
import Icon from '@/components/icon.vue'
import { ref, watch } from 'vue'
const emit = defineEmits(['update', 'preventEnter'])
const props = defineProps({
  name: String,
  value: String,
  placeholder: String,
  infoText: String,
  password: Boolean
})

const hideText = ref(true)
const currentValue = ref(props.value)

watch(props, newProps => {
  currentValue.value = newProps.value
})

function update(event: Event) {
  currentValue.value = (event.target as HTMLInputElement).value
  emit('update', {
    value: currentValue.value,
    name: props.name
  })
}
</script>

<template>
  <div class="input-text">
    <input
      :type="password && hideText ? 'password' : 'text'"
      class="input"
      :class="{ password }"
      :name="name"
      :value="currentValue"
      :placeholder="placeholder"
      @input="update($event)"
      @keydown.enter.prevent="emit('preventEnter')"
    />
    <button
      v-if="password"
      type="button"
      class="show-hide-button"
      @click="hideText = !hideText"
      @keydown.enter.prevent="hideText = !hideText"
    >
      <Icon :name="hideText ? 'show' : 'hide'" :size="16" />
    </button>
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
  </div>
</template>

<style lang="scss" scoped>
.input-text {
  position: relative;

  .input {
    width: 100%;
    border: 1px solid var(--HL1);
    background-color: var(--BG3);
    outline: none;
    border-radius: 8px;
    font-size: var(--FS4);
    padding: 9px 12px;
    height: 44px;
    color: var(--F1);

    &::placeholder {
      color: var(--F2);
    }

    &:focus {
      border-color: var(--A1);
    }

    &.password {
      padding-right: 44px;
    }
  }

  .show-hide-button {
    position: absolute;
    width: 36px;
    height: 36px;
    top: 4px;
    right: 4px;
    background-color: var(--BG3);
    border: 1px solid var(--BG3);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    outline: none;

    &:hover,
    &:focus-visible {
      background-color: var(--BG2);
      border-color: var(--HL2);
    }

    &:active {
      border-color: var(--HL1);
    }
  }
}
</style>
