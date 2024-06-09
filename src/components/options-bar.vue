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
  position: fixed;
  width: 100%;
  background-color: var(--BG2T);
  box-shadow: 0px 4px 16px -4px rgba(black, .65);
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(16px);
  z-index: 5;
  top: 43px;
  left: 2px;
  width: calc(100% - 4px);
  overflow-x: auto;

  .right {
    margin-left: 8px;
  }

  .left,
  .right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
}

.app-theme-provider.maximized {
  .options-bar {
    top: 41px;
    left: 0;
    width: 100%;
  }
}

.app-theme-provider.light {
  .options-bar {
    box-shadow: 0px 4px 16px -4px rgba(black, .25);
  }
}
</style>