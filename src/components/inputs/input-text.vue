<script setup>
import InfoText from '@/components/inputs/info-text.vue'
const emit = defineEmits(['update'])
const props = defineProps({
  name: String,
  value: String,
  placeholder: String,
  infoText: String,
})

function update(event) {
  emit('update', {
    value: event.target.value,
    name: props.name
  })
}
</script>

<template>
  <div class="input-text">
    <input type="text" class="input" :name="name" :value="value" :placeholder="placeholder" @input="update($event)">
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
  </div>
</template>

<style lang="scss" scoped>
.input-text {
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
  }
}
</style>