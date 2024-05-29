<script setup>
const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<template>
  <div class="input-modal-wrapper">
    <div class="overlay" @click="close()"></div>
    <div class="input-modal-container">
      <div class="input-modal">
        <div class="content">
          <slot name="content"></slot>
        </div>
        <div class="buttons">
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-modal-wrapper {
  position: fixed;
  top: 43px;
  left: 2px;
  width: calc(100% - 4px);
  height: calc(100vh - 45px);
  align-items: center;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  max-height: calc(100vh - 41px);
  overflow: auto;
  background-color: rgba(black, .25);
  padding: 24px;
  text-align: center;

  .input-modal-container {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-height: 100%;
    text-align: left;
  }

  .overlay {
    position: fixed;
    top: 43px;
    left: 2px;
    width: calc(100% - 4px - 8px);
    height: calc(100% - 45px - 8px);
    z-index: 0;
  }

  .input-modal {
    background-color: var(--BG2);
    border: 1px solid var(--HL1);
    box-shadow: 0 4px 16px -4px rgba(black, .25);
    padding: 12px;
    border-radius: 8px;
    position: relative;
    z-index: 1;

    .buttons {
      margin-top: 12px;
      display: inline-grid;
      grid-auto-flow: column;
      grid-column-gap: 12px;
    }
  }
}
</style>