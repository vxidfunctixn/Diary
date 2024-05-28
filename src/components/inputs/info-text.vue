<template>
  <div class="infoText">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.infoText {
  background: var(--HL3);
  border-radius: 4px;
  padding: 4px 12px;
  color: var(--Yellow);
  border: 1px solid var(--HL2);
  margin-top: 8px;
}
</style>