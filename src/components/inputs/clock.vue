<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/components/icon.vue'
import type { Time } from '@/interfaces/calendar-interface'

type TimeType = 'hours' | 'minutes'

const emit = defineEmits<{
  update: [timestamp: number]
}>()

const props = defineProps<{
  time: Time
}>()

const inputMinutes = ref<HTMLInputElement | null>(null)
const inputHours = ref<HTMLInputElement | null>(null)

const time = ref<Time>({
  hours: props.time.hours,
  minutes: props.time.minutes
})

const selectedTime = ref<Time>({
  hours: props.time.hours,
  minutes: props.time.minutes
})

const draggedObject = ref({
  hours: false,
  minutes: false
})

function handleWheel(event: WheelEvent, type: TimeType): void {
  if (event.deltaY > 0 || -event.deltaX > 0) {
    if (type === 'hours' && time.value.hours === 0) time.value.hours = 24
    if (type === 'minutes' && time.value.minutes === 0) time.value.minutes = 60
    time.value[type] -= 1
  }
  if (event.deltaY < 0 || -event.deltaX < 0) {
    if (type === 'hours' && time.value.hours === 23) time.value.hours = -1
    if (type === 'minutes' && time.value.minutes === 59) time.value.minutes = -1
    time.value[type] += 1
  }
  update(type)
}

function formatNumber(number: number): string {
  const value = String(number).padStart(2, '0')
  return value
}

function clockHover(event: MouseEvent, type: TimeType): void {
  const target = event.target as HTMLElement
  const { offsetX, offsetY } = event
  const width = target.offsetWidth
  const height = target.offsetHeight
  const centerX = width / 2
  const centerY = height / 2
  const x = offsetX - centerX
  const y = offsetY - centerY
  const radians = Math.atan2(y, x)
  let degrees = radians * (180 / Math.PI) + 90
  if (degrees < 0) degrees = 360 + degrees

  if (type === 'hours') {
    let hour = Math.floor((degrees + 7.5) / 15)
    if (hour === 24) hour = 0
    selectedTime.value.hours = hour
    if (draggedObject.value.hours) update('hours', true)
  }
  if (type === 'minutes') {
    let minute = Math.floor((degrees + 3) / 6)
    if (minute === 60) minute = 0
    selectedTime.value.minutes = minute
    if (draggedObject.value.minutes) update('minutes', true)
  }
}

function clockClick(type: TimeType): void {
  if (type === 'hours') {
    update('hours', true)
    draggedObject.value.hours = true
  }
  if (type === 'minutes') {
    update('minutes', true)
    draggedObject.value.minutes = true
  }
}

function update(type: TimeType, from_selected = false): void {
  if (from_selected) {
    if (type === 'hours') time.value.hours = selectedTime.value.hours
    if (type === 'minutes') time.value.minutes = selectedTime.value.minutes
  }
  emit('update', new Date().setHours(time.value.hours, time.value.minutes, 0, 0))
}

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  let value = Number(target.value.slice(-2))
  const type = target.name as TimeType
  if (type === 'hours') {
    if (value < 0) value = 23
    if (value > 23) value = Number(target.value.slice(-1))
  } else if (type === 'minutes') {
    if (value < 0) value = 59
    if (value > 59) value = Number(target.value.slice(-1))
  }
  target.value = formatNumber(value)
  selectedTime.value[type] = value
  update(type, true)
}
</script>

<template>
  <div class="clock-wrapper">
    <div class="inputs">
      <label
        class="input"
        title="Użyj kółka myszy aby edytować"
        @wheel="handleWheel($event, 'hours')"
        @click="inputHours?.select()"
      >
        <div class="icon">
          <Icon name="number-scroll" :size="16" />
        </div>
        <input
          class="inputDefault"
          name="hours"
          type="number"
          min="-1"
          max="24"
          step="1"
          :value="formatNumber(time.hours)"
          @input="handleInput($event)"
          ref="inputHours"
        />
      </label>
      <label
        class="input"
        title="Użyj kółka myszy aby edytować"
        @wheel="handleWheel($event, 'minutes')"
        @click="inputMinutes?.select()"
      >
        <div class="icon">
          <Icon name="number-scroll" :size="16" />
        </div>
        <input
          class="inputDefault"
          name="minutes"
          type="number"
          min="-1"
          max="60"
          step="1"
          :value="formatNumber(time.minutes)"
          @input="handleInput($event)"
          ref="inputMinutes"
        />
      </label>
    </div>

    <div class="clock">
      <div
        class="hours-circle"
        @mousemove="clockHover($event, 'hours')"
        @mousedown="clockClick('hours')"
        @mouseup="draggedObject.hours = false"
        @mouseleave="draggedObject.hours = false"
        @wheel="handleWheel($event, 'hours')"
      >
        <div
          v-for="n in 24"
          :style="{ '--_rotate': `${(n - 1) * 15 + 180}deg` }"
          class="hour"
          :class="{
            active: time.hours === n - 1,
            selected: selectedTime.hours === n - 1
          }"
          :key="n"
        >
          <div class="index">{{ n - 1 }}</div>
        </div>
      </div>
      <div
        class="minutes-circle"
        @mousemove="clockHover($event, 'minutes')"
        @mousedown="clockClick('minutes')"
        @mouseup="draggedObject.minutes = false"
        @mouseleave="draggedObject.minutes = false"
        @wheel="handleWheel($event, 'minutes')"
      >
        <div
          v-for="n in 60"
          :style="{ '--_rotate': `${(n - 1) * 6 + 180}deg` }"
          class="dot"
          :class="{
            active: time.minutes === n - 1,
            selected: selectedTime.minutes === n - 1
          }"
          :key="n"
        ></div>
      </div>
      <div class="minute-hand" :style="{ '--_rotate': `${time.minutes * 6 + 180}deg` }"></div>
      <div class="hour-hand" :style="{ '--_rotate': `${time.hours * 15 + 180}deg` }"></div>
      <div class="center"></div>
    </div>
  </div>
</template>

<style lang="scss">
.clock-wrapper {
  width: 280px;
  height: 320px;

  .inputs {
    display: flex;
    user-select: none;

    .input {
      width: 50%;
      background-color: var(--HL3);
      border: 1px solid var(--HL2);
      outline: none;
      color: var(--F1);
      padding: 8px;
      position: relative;
      cursor: n-resize;

      &:hover {
        background-color: var(--HL2);
        border-color: var(--HL1);
      }

      .icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }

      &:first-child {
        text-align: right;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;

        .icon {
          left: 8px;
        }
      }

      &:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;

        .icon {
          right: 8px;
        }
      }

      .inputDefault {
        appearance: none;
        outline: none;
        border: none;
        padding: 0;
        margin: 0;
        display: inline;
        background-color: transparent;
        color: inherit;
        font-size: inherit;
        text-align: inherit;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }

      &:focus-within {
        border-color: var(--A1);
        background: var(--BG3);
      }
    }
  }

  .clock {
    position: relative;
    margin: 8px;
    width: 264px;
    height: 264px;
    border-radius: 50%;
    border: 1px solid var(--HL1);

    .hours-circle {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: pointer;

      .hour {
        --_rotate: 180deg;
        position: absolute;
        top: 50%;
        left: 50%;
        height: 132px;
        transform: translateX(-50%) rotate(var(--_rotate));
        transform-origin: top;
        display: flex;
        align-items: flex-end;
        padding-bottom: 7px;
        pointer-events: none;
        user-select: none;

        .index {
          transform: rotate(calc(var(--_rotate) * -1));
          background-color: var(--HL3);
          border: 1px solid var(--HL2);
          width: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          font-size: var(--FS3);
        }

        &.active .index {
          background-color: var(--BG4);
          border-color: var(--A1);
        }
      }

      &:hover {
        .hour.selected .index {
          border-color: var(--F1);
        }
      }
    }

    .minutes-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 180px;
      height: 180px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      cursor: pointer;

      .dot {
        --_rotate: 180deg;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 90px;
        transform: translateX(-50%) rotate(var(--_rotate));
        transform-origin: top;
        display: flex;
        align-items: flex-end;
        pointer-events: none;

        &::before {
          content: '';
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background-color: var(--HL2);
        }

        &.active::before {
          background-color: var(--A1);
        }
      }

      &:hover {
        .dot.selected::before {
          background-color: var(--F1);
        }
      }
    }

    .hour-hand,
    .minute-hand {
      --_rotate: 180deg;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      border-radius: 4px;
      transform: translateX(-50%) rotate(var(--_rotate));
      transform-origin: top;
      border: 2px solid var(--BG2);
      pointer-events: none;
    }

    .minute-hand {
      height: 64px;
      background-color: var(--F1);
    }

    .hour-hand {
      height: 36px;
      background-color: var(--A1);
    }

    .center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      background-color: var(--F1);
      border: 2px solid var(--BG2);
      border-radius: 50%;
      pointer-events: none;
    }
  }
}
</style>
