<script setup lang="ts">
import Button from '@/components/button.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="lock">
    <Button icon="unlock" @click="router.push({ name: 'home' })">{{
      t('views.lock.login')
    }}</Button>
  </div>
</template>

<style lang="scss" scoped>
.lock {
  padding: 24px;
}
</style>
