<template>
  <div class="infoText">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.infoText {
  width: 100%;
  text-align: left;
  background: var(--HL3);
  border-radius: 4px;
  padding: 4px 12px;
  color: var(--yellow);
  border: 1px solid var(--HL2);
  margin-top: 8px;
}
</style>
