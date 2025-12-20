<script setup lang="ts">
import Section from '@/components/layout/section.vue'
import Button from '@/components/button.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <Section :title="t('widgets.navigation.title')">
    <div class="navigation-grid">
      <Button icon="note-list" @click="router.push({ name: 'note_list' })">{{
        t('widgets.navigation.noteList')
      }}</Button>
      <Button icon="add-note" @click="router.push({ name: 'edit_note' })">{{
        t('widgets.navigation.addNote')
      }}</Button>
      <Button icon="date" @click="router.push({ name: 'month' })">{{
        t('widgets.navigation.viewMonth')
      }}</Button>
      <Button icon="date" @click="router.push({ name: 'year' })">{{
        t('widgets.navigation.viewYear')
      }}</Button>
      <Button icon="search" @click="router.push({ name: 'search' })">{{
        t('widgets.navigation.search')
      }}</Button>
      <Button icon="settings" @click="router.push({ name: 'settings' })">{{
        t('widgets.navigation.settings')
      }}</Button>
      <Button icon="lock" @click="router.push({ name: 'lock' })">{{
        t('widgets.navigation.lock')
      }}</Button>
      <Button icon="info" @click="router.push({ name: 'about' })">{{
        t('widgets.navigation.about')
      }}</Button>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.navigation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px;
  padding: 12px;
}
</style>
