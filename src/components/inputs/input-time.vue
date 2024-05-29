<script setup>
import Button from '@/components/button.vue'
import InfoText from '@/components/inputs/info-text.vue'
import InputModal from '@/components/inputs/input-modal.vue'
import Clock from '@/components/inputs/clock.vue'
import { DateTime } from '@/utils'
import { ref, watch } from 'vue'
const emit = defineEmits(['update'])
const props = defineProps({
  name: String,
  value: Number,
  infoText: String,
})

const modalOpen = ref(false)
const time = ref(new DateTime(props.value))
const clockValue = ref(props.value)

watch(props, (newProps) => {
  time.value = new DateTime(newProps.value)
})

function update(event) {
  clockValue.value = event
}

function save() {
  time.value = new DateTime(clockValue.value)
  modalOpen.value = false

  emit('update', {
    name: props.name,
    value: new Date().setHours(time.value.hours, time.value.minutes, 0, 0)
  })
}

</script>

<template>
  <div class="input-time">
    <div class="button">
      <Button icon="clock" @click="modalOpen = true">{{ time.timeString }}</Button>
    </div>
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
    <InputModal v-if="modalOpen" @close="modalOpen = false">
      <template #content>
        <Clock :time="time" @update="update($event)" />
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
}
</style>