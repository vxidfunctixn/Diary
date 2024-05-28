<script setup>
const props = defineProps({
  title: String
})
</script>

<template>
  <div class="input-row">
    <div class="title">{{ title }}</div>
    <div class="input">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-row {
  padding: 12px 0;
  border-bottom: 1px solid var(--HL1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px;

  .title {
    align-self: start;
    height: 44px;
    font-size: var(--FS4);;
    line-height: 22px;
    padding: 11px 0;
  }

  .input {
    align-self: center;
  }
}
</style>