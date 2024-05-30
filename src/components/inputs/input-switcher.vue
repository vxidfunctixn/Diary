<script setup>
import InfoText from '@/components/inputs/info-text.vue'
const emit = defineEmits(['update'])
const props = defineProps({
  name: String,
  value: Boolean,
  infoText: String,
})

function update(event) {
  emit('update', {
    name: props.name,
    value: event.target.checked
  })
}
</script>

<template>
  <div class="input-switcher">
    <label class="input-label">
      <input type="checkbox" :name="name" :checked="value" @input="update($event)" class="default-input">
      <div class="checkbox"></div>
    </label>
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
  </div>
</template>

<style lang="scss" scoped>
.input-switcher {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;

  .input-label {
    display: block;
    position: relative;
    cursor: pointer;
    border-radius: 16px;

    .checkbox {
      --_background_color: var(--HL3);
      --_border_color: var(--HL2);
      --_accent_color: var(--A1);
      --_thumb_color: var(--BG3);
      --_thumb_border_color: var(--F2);

      width: 58px;
      height: 32px;
      border-radius: 16px;
      border: 1px solid var(--_border_color);
      background-color: var(--_background_color);
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        display: block;
        width: 26px;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        border: 2px solid var(--_border_color);
        background-color: var(--_thumb_color);
        transition: transform .2s ease-out, box-shadow .1s ease-out;
        box-shadow: inset 0 0 0 6px var(--_thumb_border_color);
        z-index: 1;
      }

      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 56px;
        height: 30px;
        border-radius: 15px;
        background-color: var(--_accent_color);
        transition: transform .2s ease-out, opacity .1s ease-out;
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
        --_background_color: var(--HL2);
        --_border_color: var(--HL1);
        --_accent_color: var(--A2);
      }
    }

    &:hover {
      .checkbox {
        --_background_color: var(--HL2);
        --_border_color: var(--HL1);
        --_accent_color: var(--A2);
      }
    }
  }
}
</style>