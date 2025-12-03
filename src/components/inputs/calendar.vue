<script setup lang="ts">
import Button from '@/components/button.vue'
import { Calendar, DateTime, isEqualDate } from '@/utils'
import { ref, watch, computed } from 'vue'

const emit = defineEmits(['update'])

const props = defineProps({
  date: Object
})

const dateValue = ref(new DateTime(props.date))
const calendar = ref(new Calendar(dateValue.value.date))
const mode = ref('month')

watch(props, newProps => {
  dateValue.value.setTimestamp(newProps.date)
})

watch(dateValue.value, newDate => {
  calendar.value.setDate(newDate.date)
  emit('update', newDate.date.valueOf())
})

const month = computed(() => {
  return calendar.value.getMonth(day => {
    day.selected = isEqualDate(day.date, dateValue.value.date)
    return day
  })
})

const year = computed(() => {
  return calendar.value.getYear(month => {
    month.selected = isEqualDate(month.date, dateValue.value.date, {
      day: false
    })
    return month
  })
})

const years = computed(() => {
  return calendar.value.getYears(year => {
    year.selected = isEqualDate(year.date, dateValue.value.date, {
      day: false,
      month: false,
    })
    return year
  })
})

const yearsTitle = computed(() => {
  const yearStart = years.value[0][0].number
  const yearEnd = years.value.length * years.value[0].length + yearStart - 1
  return `${yearStart} - ${yearEnd}`
})

function selectMonth(date) {
  dateValue.value.setTimestamp(date)
  mode.value = 'month'
}

function selectYear(date) {
  dateValue.value.setTimestamp(date)
  mode.value = 'year'
}
</script>

<template>
  <div class="calendar" v-if="mode === 'month'">
    <div class="inputs">
      <Button icon="arrow-left" stick="right" @click="dateValue.prevMonth()"></Button>
      <Button width="100%" center stick="both" @click="mode = 'year'">
        {{ dateValue.day }}
        <b class="accent-span">{{ dateValue.monthName }}</b>
        {{ dateValue.year }}
      </Button>
      <Button icon="arrow-right" stick="left" @click="dateValue.nextMonth()"></Button>
    </div>
    <div class="grid month">
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
            active: day.currentDay,
            selected: day.selected
          }"
          @click="dateValue.setTimestamp(day.date)"
        >
          {{ day.number }}
        </div>
      </template>
    </div>
  </div>

  <div class="calendar" v-if="mode === 'year'">
    <div class="inputs">
      <Button icon="arrow-left" stick="right" @click="dateValue.prevYear()"></Button>
      <Button width="100%" center stick="both" @click="mode = 'years'">
        {{ dateValue.day }}
        {{ dateValue.monthName }}
        <b class="accent-span">{{ dateValue.year }}</b>
      </Button>
      <Button icon="arrow-right" stick="left" @click="dateValue.nextYear()"></Button>
    </div>
    <div class="grid year">
      <template v-for="row in year">
        <div
          v-for="month in row"
          class="month"
          :class="{
            active: month.currentMonth,
            selected: month.selected
          }"
          @click="selectMonth(month.date)"
        >
          {{ month.name }}
        </div>
      </template>
    </div>
  </div>

  <div class="calendar" v-if="mode === 'years'">
    <div class="inputs">
      <Button icon="arrow-left" stick="right" @click="dateValue.setYears(-20)"></Button>
      <Button width="100%" center stick="both" disabled>
        <b class="accent-span">{{ yearsTitle }}</b>
      </Button>
      <Button icon="arrow-right" stick="left" @click="dateValue.setYears(20)"></Button>
    </div>
    <div class="grid years">
      <template v-for="row in years">
        <div
          v-for="year in row"
          class="year"
          :class="{
            active: year.currentYear,
            selected: year.selected
          }"
          @click="selectYear(year.date)"
        >
          {{ year.number }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  .inputs {
    width: 280px;
    display: flex;
  }

  .accent-span {
    color: var(--A1);
  }

  .grid {
    display: grid;

    &.month {
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: 40px;
    }

    &.year {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 70px;
    }

    &.years {
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: 56px;
    }

    .dayName {
      text-align: center;
      line-height: 38px;
      color: var(--A1);
      user-select: none;
    }

    .day,
    .month,
    .year {
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid transparent;
      user-select: none;

      &:hover {
        background-color: var(--HL2);
        border-color: var(--HL1);
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

      &.selected {
        background-color: var(--A1);
        color: var(--BG3);
        box-shadow: inset 0 0 0 1px var(--BG3);
        border-color: var(--A1);
        font-weight: 500;

        &:hover {
          background-color: var(--A2);
          border-color: var(--A2);
        }
      }
    }

    .day {
      line-height: 38px;
    }

    .month {
      line-height: 68px;
    }

    .year {
      line-height: 54px;
    }
  }
}
</style>