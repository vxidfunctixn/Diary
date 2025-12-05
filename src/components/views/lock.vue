<script setup lang="ts">
import Button from '@/components/button.vue'
import { useAppStore, VIEW } from '@/stores'
const appStore = useAppStore()
</script>

<template>
  <div class="lock">
    <Button icon="unlock" @click="appStore.setView(VIEW.HOME)">Login</Button>
  </div>
</template>

<style lang="scss" scoped>
.lock {
  padding: 24px;
}
</style>
