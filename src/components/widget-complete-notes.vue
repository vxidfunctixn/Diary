<script setup>
import Section from '@/components/section.vue'
import Row from '@/components/section-row.vue'
import Button from '@/components/button.vue'
</script>

<template>
  <Section title="Uzupełnij notatki">
    <Row>
      <div>Dzisiaj</div>
      <Button icon="add-note" small>Dodaj notatkę</Button>
    </Row>
    <Row>
      <div>23.05.2024</div>
      <Button icon="add-note" small>Dodaj notatkę</Button>
    </Row>
    <Row>
      <div>24.05.2024</div>
      <Button icon="add-note" small>Dodaj notatkę</Button>
    </Row>
    <Row>
      <div>24.05.2024</div>
      <Button icon="add-note" small>Dodaj notatkę</Button>
    </Row>
  </Section>
</template>