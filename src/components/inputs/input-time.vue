<script setup lang="ts">
import Button from '@/components/common/button.vue'
import InfoText from '@/components/inputs/info-text.vue'
import InputModal from '@/components/inputs/input-modal.vue'
import Clock from '@/components/inputs/clock.vue'
import { DateTime } from '@/utils'
import type { InputAlign } from '@/interfaces/components-interface'
import { ref, watch, computed, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['update'])
const props = defineProps({
  name: String,
  newValue: Number,
  oldValue: Number,
  infoText: String,
  inputAlign: {
    type: String as PropType<InputAlign>,
    default: 'left' as InputAlign
  }
})

const modalOpen = ref(false)
const time = ref(new DateTime(props.newValue ?? Date.now()))
const clockValue = ref(props.newValue ?? Date.now())

watch(props, newProps => {
  time.value = new DateTime(newProps.newValue ?? Date.now())
})

function update(event: number) {
  clockValue.value = event
}

function save() {
  time.value = new DateTime(clockValue.value ?? Date.now())
  modalOpen.value = false

  emit('update', {
    name: props.name,
    value: new Date().setHours(time.value.hours, time.value.minutes, 0, 0)
  })
}

const isNewTime = computed(() => {
  return props.newValue && props.oldValue && props.oldValue !== props.newValue
})
</script>

<template>
  <div class="input-time" :class="inputAlign">
    <div class="button">
      <Button icon="clock" @click="modalOpen = true">
        {{ time.timeString }} <span class="accent-span" v-if="isNewTime">*</span>
      </Button>
    </div>
    <InfoText v-if="infoText">{{ infoText }}</InfoText>
    <InputModal v-if="modalOpen" @close="modalOpen = false">
      <template #content>
        <Clock :time="time" @update="update($event)" />
      </template>
      <template #buttons>
        <Button icon="check" accent @click="save()">{{ t('common.actions.set') }}</Button>
        <Button icon="cancel" @click="modalOpen = false">{{ t('common.actions.cancel') }}</Button>
      </template>
    </InputModal>
  </div>
</template>

<style lang="scss" scoped>
.input-time {
  .accent-span {
    color: var(--accent_300);
  }

  &.left {
    .button {
      text-align: left;
    }
  }

  &.right {
    .button {
      text-align: right;
    }
  }
}
</style>
