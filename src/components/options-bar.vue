<script setup>

</script>

<template>
  <div class="options-bar">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.options-bar {
  width: 100%;
  background-color: var(--BG2T);
  box-shadow: 0px 4px 16px -4px rgba(black, .65);
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(16px);
  z-index: 5;

  .left,
  .right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>