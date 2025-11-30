<script setup>
const props = defineProps({
  value: String
})
</script>

<template>
<div class="wrapper" contenteditable>
  {{ value }}
</div>
</template>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  padding: 12px;
  height: 100%;
  overflow: auto;
  outline: none;
}
</style>