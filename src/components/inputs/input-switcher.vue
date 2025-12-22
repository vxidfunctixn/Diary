<script setup lang="ts">
import InfoText from '@/components/inputs/info-text.vue'
import type { InputAlign } from '@/interfaces/components-interface'
import type { PropType } from 'vue'
const emit = defineEmits(['update'])
const props = defineProps({
  name: String,
  value: Boolean,
  infoText: String,
  inputAlign: {
    type: String as PropType<InputAlign>,
    default: 'left' as InputAlign
  }
})

function update(event: Event) {
  emit('update', {
    name: props.name,
    value: (event.target as HTMLInputElement).checked
  })
}
</script>

<template>
  <div class="input-switcher" :class="inputAlign">
    <label class="input-label">
      <input
        type="checkbox"
        :name="name"
        :checked="value"
        @input="update($event)"
        class="default-input"
      />
      <div class="checkbox"></div>
    </label>
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
  </div>
</template>

<style lang="scss" scoped>
.input-switcher {
  &.left {
    .input-label {
      justify-content: flex-start;
    }
  }

  &.right {
    .input-label {
      justify-content: flex-end;
    }
  }

  .input-label {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    border-radius: 16px;
    min-height: 44px;

    .checkbox {
      --_background_color: var(--background_700);
      --_border_color: var(--background_200);
      --_accent_color: var(--accent_300);
      --_thumb_color: var(--background_600);
      --_thumb_border_color: var(--accent_500);

      width: 58px;
      height: 32px;
      border-radius: 16px;
      border: 1px solid var(--_border_color);
      background-color: var(--_background_color);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        display: block;
        width: 26px;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        border: 2px solid var(--accent_600);
        background-color: var(--_thumb_color);
        transition:
          transform 0.2s ease-out,
          box-shadow 0.1s ease-out;
        box-shadow: inset 0 0 0 6px var(--_thumb_border_color);
        z-index: 1;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 56px;
        height: 30px;
        border-radius: 15px;
        background-color: var(--_accent_color);
        transition:
          transform 0.2s ease-out,
          opacity 0.1s ease-out;
        transform: translateX(-26px);
        z-index: 0;
        opacity: 0;
      }
    }

    .default-input {
      width: 0;
      height: 0;
      position: absolute;
      top: 0;
      left: 0;
      margin: 0;
      padding: 0;

      &:checked ~ .checkbox {
        &::before {
          transform: translateX(26px);
          box-shadow: inset 0 0 0 0px var(--_thumb_border_color);
        }

        &:after {
          transform: translateX(0);
          opacity: 1;
        }
      }

      &:focus-visible ~ .checkbox {
        --_background_color: var(--background_200);
        --_border_color: var(--background_100);
        --_accent_color: var(--accent_400);
        --_thumb_border_color: var(--accent_400);
      }
    }

    &:hover {
      .checkbox {
        --_background_color: var(--background_600);
        --_border_color: var(--background_100);
        --_accent_color: var(--accent_400);
        --_thumb_border_color: var(--accent_400);
      }
    }
  }
}
</style>
