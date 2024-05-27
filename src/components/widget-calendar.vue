<script setup>
import Section from '@/components/section.vue'
import Row from '@/components/section-row.vue'
import Button from '@/components/button.vue'
</script>

<template>
  <Section title="Kalendarz">
    <Row>
      <div>23</div>
      <Button icon="note-list" small>Zobacz dzisiejszy dzień</Button>
    </Row>
    <Row>
      <div>Maj</div>
      <Button icon="date" small>Zobacz aktualny miesiąc</Button>
    </Row>
    <Row>
      <div>2024</div>
      <Button icon="date" small>Zobacz aktualny rok</Button>
    </Row>
  </Section>
</template>