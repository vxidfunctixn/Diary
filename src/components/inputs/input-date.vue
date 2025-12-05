<script setup lang="ts">
import Button from '@/components/button.vue'
import InfoText from '@/components/inputs/info-text.vue'
import InputModal from '@/components/inputs/input-modal.vue'
import Calendar from '@/components/inputs/calendar.vue'
import { DateTime } from '@/utils'
import { ref, watch, computed } from 'vue'
import type { UpdateEvent } from '@/interfaces/components-interface'

const emit = defineEmits<{
  update: [event: UpdateEvent]
}>()

const props = defineProps<{
  name: string
  newValue?: number
  oldValue?: number
  infoText?: string
  controls?: boolean
}>()

const modalOpen = ref(false)
const dateTime = ref(new DateTime(props.newValue ?? Date.now()))
const calendarValue = ref(props.newValue ?? Date.now())

watch(
  () => props.newValue,
  newValue => {
    if (newValue !== undefined) {
      dateTime.value = new DateTime(newValue)
    }
  }
)

function update(event: number): void {
  calendarValue.value = event
}

function save(fromModal = true): void {
  if (fromModal) {
    dateTime.value = new DateTime(calendarValue.value)
    modalOpen.value = false
  }

  emit('update', {
    name: props.name,
    value: dateTime.value.timestamp
  })
}

function handlePrev(): void {
  dateTime.value.prevDay()
  save(false)
}

function handleNext(): void {
  dateTime.value.nextDay()
  save(false)
}

const isNewDate = computed(() => {
  return props.newValue && props.oldValue && props.oldValue !== props.newValue
})
</script>

<template>
  <div class="input-date">
    <div class="button">
      <Button v-if="controls" icon="arrow-left" stick="right" @click="handlePrev()"></Button>
      <Button
        icon="date"
        @click="modalOpen = true"
        :stick="controls ? 'both' : undefined"
        monospace
      >
        {{ dateTime.dateString }} <span class="accent-span" v-if="isNewDate">*</span>
      </Button>
      <Button v-if="controls" icon="arrow-right" stick="left" @click="handleNext()"></Button>
    </div>
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
    <InputModal v-if="modalOpen" @close="modalOpen = false">
      <template #content>
        <Calendar :date="dateTime.timestamp" @update="update($event)" />
      </template>
      <template #buttons>
        <Button icon="check" accent @click="save()">Ustaw</Button>
        <Button icon="cancel" @click="modalOpen = false">Anuluj</Button>
      </template>
    </InputModal>
  </div>
</template>

<style lang="scss" scoped>
.input-date {
  .button {
    display: flex;
  }

  .accent-span {
    color: var(--A1);
  }
}
</style>
