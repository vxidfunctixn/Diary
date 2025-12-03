<script setup lang="ts">
import Section from '@/components/layout/section.vue'
import Row from '@/components/layout/section-row.vue'
import Button from '@/components/button.vue'
import { Calendar, getMonthName } from '@/utils'

const today = new Date(Date.now())
const calendar = new Calendar(today)
const month = calendar.getMonth()

function getTitle() {
  const month = getMonthName(today.getMonth())
  return `${month} ${today.getFullYear()}`
}
</script>

<template>
  <Section title="Uzupełnij notatki">
    <div class="calendar-title">{{ getTitle() }}</div>
    <div class="calendar">
      <div class="dayName">PN</div>
      <div class="dayName">WT</div>
      <div class="dayName">ŚR</div>
      <div class="dayName">CZ</div>
      <div class="dayName">PT</div>
      <div class="dayName">SB</div>
      <div class="dayName">ND</div>
      <template v-for="row in month">
        <div
          v-for="day in row"
          class="day"
          :class="{
            disabled: !day.currentMonth,
            active: day.currentDay
          }"
        >
          {{ day.number }}
        </div>
      </template>
    </div>
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

<style lang="scss" scoped>
.calendar-title {
  text-align: center;
  border: 1px solid var(--HL2);
  border-radius: 8px;
  line-height: 22px;
  padding: 6px;
  margin: 12px 12px 0;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 40px;
  padding: 12px;
  border-bottom: 1px solid var(--HL2);

  .dayName {
    text-align: center;
    line-height: 38px;
    color: var(--A1);
    user-select: none;
  }

  .day {
    text-align: center;
    line-height: 38px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid transparent;
    user-select: none;

    &:hover {
      background-color: var(--HL2);
      border: 1px solid var(--HL1);
    }

    &:active {
      border-color: var(--F2);
    }

    &.disabled {
      color: var(--F2);
    }

    &.active {
      border: 1px solid var(--A2);
      background-color: var(--BG3);

      &:hover {
        border-color: var(--A1);
        background-color: var(--HL3);
      }

      &:active {
        background-color: var(--HL2);
      }
    }
  }
}
</style>
