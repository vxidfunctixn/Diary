<script setup lang="ts"></script>

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
  position: sticky;
  background-color: color-mix(in srgb, var(--background_500) 70%, transparent);
  width: calc(100% - 4px);
  box-shadow: 0px 4px 16px -4px rgba(black, 0.65);
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(16px);
  z-index: 5;
  left: 2px;
  top: 0;
  overflow-x: auto;

  @container scroll-state(scrollable: inline) {
    width: calc(100% - 12px);
  }

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
    top: 0;
    left: 0;
    width: 100%;
  }
}

.app-theme-provider.light {
  .options-bar {
    box-shadow: 0px 4px 16px -4px rgba(black, 0.25);
  }
}
</style>
