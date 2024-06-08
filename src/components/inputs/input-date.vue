<script setup>
import Button from '@/components/button.vue'
import InfoText from '@/components/inputs/info-text.vue'
import InputModal from '@/components/inputs/input-modal.vue'
import Calendar from '@/components/inputs/calendar.vue'
import { DateTime } from '@/utils'
import { ref, watch, computed } from 'vue'
const emit = defineEmits(['update'])
const props = defineProps({
  name: String,
  newValue: Number,
  oldValue: Number,
  infoText: String,
  controls: Boolean,
})

const modalOpen = ref(false)
const dateTime = ref(new DateTime(props.newValue))
const calendarValue = ref(props.newValue)

watch(props, (newProps) => {
  dateTime.value = new DateTime(newProps.newValue)
})

function update(event) {
  calendarValue.value = event
}

function save(fromModal = true) {
  if(fromModal) {
    dateTime.value = new DateTime(calendarValue.value)
    modalOpen.value = false
  }

  emit('update', {
    name: props.name,
    value: dateTime.value.timestamp
  })
}

function handlePrev() {
  dateTime.value.prevDay()
  save(false)
}

function handleNext() {
  dateTime.value.nextDay()
  save(false)
}

const isNewDate = computed(() => {
  return (props.newValue && props.oldValue && props.oldValue !== props.newValue)
})

</script>

<template>
  <div class="input-time">
    <div class="button">
      <Button v-if="controls" icon="arrow-left" stick="right" @click="handlePrev()"></Button>
      <Button icon="date" @click="modalOpen = true" :stick="controls ? 'both' : null">
        {{ dateTime.dateString }} <span class="accent-span" v-if="isNewDate">*</span>
      </Button>
      <Button v-if="controls" icon="arrow-right" stick="left" @click="handleNext()"></Button>
    </div>
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
    <InputModal v-if="modalOpen" @close="modalOpen = false">
      <template #content>
        <Calendar :date="dateTime.date" @update="update($event)" />
      </template>
      <template #buttons>
        <Button icon="check" accent @click="save()">Ustaw</Button>
        <Button icon="cancel" @click="modalOpen = false">Anuluj</Button>
      </template>
    </InputModal>
  </div>
</template>

<style lang="scss" scoped>
.input-time {

  .button {
    text-align: right;
  }

  .accent-span {
    color: var(--A1);
  }
}
</style>