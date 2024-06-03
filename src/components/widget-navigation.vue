<script setup>
import Section from '@/components/section.vue'
import Button from '@/components/button.vue'
</script>

<template>
  <Section title="Nawigacja">
    <div class="navigation-grid">
      <Button icon="note-list">Lista wpisów</Button>
      <Button icon="add-note">Dodaj notatkę</Button>
      <Button icon="date">Zobacz miesiąc</Button>
      <Button icon="date">Zobacz rok</Button>
      <Button icon="search">Wyszukiwarka</Button>
      <Button icon="settings">Ustawienia</Button>
      <Button icon="lock">Zablokuj</Button>
      <Button icon="info">O aplikacji</Button>
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