<script setup lang="ts">
import Button from '@/components/button.vue'
import { useAppStore, VIEW } from '@/stores'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const appStore = useAppStore()
</script>

<template>
  <div class="lock">
    <Button icon="unlock" @click="appStore.setView(VIEW.HOME)">{{ t('views.lock.login') }}</Button>
  </div>
</template>

<style lang="scss" scoped>
.lock {
  padding: 24px;
}
</style>
