<template>
  <div class="row">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--HL1);
  }
}
</style>