<template>
  <div class="infoText">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.infoText {
  width: 100%;
  text-align: left;
  background: var(--background_300);
  border-radius: 4px;
  padding: 4px 12px;
  color: var(--warning_200);
  border: 1px solid var(--background_200);
  margin-top: 8px;
}
</style>
