<script setup>
import InfoText from '@/components/inputs/info-text.vue'
import { ref, watch } from 'vue'
const emit = defineEmits(['update', 'preventEnter'])
const props = defineProps({
  name: String,
  value: String,
  infoText: String,
})

const currentValue = ref(props.value)

watch(props, newProps => {
  currentValue.value = newProps.value
})

function update(event) {
  currentValue.value = event.target.value
  emit('update', {
    value: currentValue.value,
    name: props.name
  })
}
</script>

<template>
  <div class="input-hue">
    <label class="input-wrapper">
      <input
        type="range"
        class="default-input"
        min="0"
        max="360"
        step="1"
        :name="name"
        :value="currentValue"
        :style="{ '--_selected_hue': currentValue }"
        @input="update($event)"
        @keydown.enter.prevent="emit('preventEnter')"
      >
    </label>
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
  </div>
</template>

<style lang="scss" scoped>
.input-hue {
  position: relative;

  .input-wrapper {
    display: block;
    height: 44px;
    background-color: var(--BG3);
    border: 1px solid var(--HL1);
    border-radius: 22px;
    padding: 0px 5px;
    align-items: center;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      height: 12px;
      border-radius: 6px;
      background: linear-gradient(
        90deg,
        rgba(255, 0, 0, 1) 0%,
        rgba(255, 154, 0, 1) 10%,
        rgba(208, 222, 33, 1) 20%,
        rgba(79, 220, 74, 1) 30%,
        rgba(63, 218, 216, 1) 40%,
        rgba(47, 201, 226, 1) 50%,
        rgba(28, 127, 238, 1) 60%,
        rgba(95, 21, 242, 1) 70%,
        rgba(186, 12, 248, 1) 80%,
        rgba(251, 7, 217, 1) 90%,
        rgba(255, 0, 0, 1) 100%
      );
      top: 16px;
      left: 16px;
      width: calc(100% - 32px);
    }

    .default-input {
      --_selected_hue: var(--hue);
      width: 100%;
      position: relative;
      z-index: 1;
      appearance: none;
      height: 44px;
      border-radius: 6px;
      background: transparent;
      left: -2px;
      top: -3px;
      outline: none;
      border-radius: 16px;
      cursor: pointer;

      &::-webkit-slider-thumb {
        appearance: none;
        width: 32px;
        height: 32px;
        border: 2px solid var(--HL2);
        background-color: hsl(var(--_selected_hue), 88%, 58%);
        border-radius: 16px;
      }
    }

    &:focus-within {
      border-color: var(--A1);
    }
  }

}
</style>