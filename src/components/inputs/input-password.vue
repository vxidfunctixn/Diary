<script setup lang="ts">
import Button from '@/components/button.vue'
import InfoText from '@/components/inputs/info-text.vue'
import InputModal from '@/components/inputs/input-modal.vue'
import InputText from '@/components/inputs/input-text.vue'
import InputRow from '@/components/inputs/input-row.vue'
import type { InputAlign } from '@/interfaces/components-interface'
import { ref, computed, type PropType } from 'vue'
import { hashPassword } from '@/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['update'])
const props = defineProps({
  name: String,
  oldValue: String,
  newValue: String,
  infoText: String,
  inputAlign: {
    type: String as PropType<InputAlign>,
    default: 'left' as InputAlign
  }
})

const modalOpen = ref(false)
const infoTextRef = ref({
  global: props.infoText,
  password1: undefined as string | undefined,
  password2: undefined as string | undefined
})

const form = ref({
  password1: '',
  password2: ''
})

function update(event: { name: 'password1' | 'password2'; value: string }) {
  infoTextRef.value[event.name] = undefined
  form.value[event.name] = event.value
}

function save() {
  infoTextRef.value.password1 = undefined
  infoTextRef.value.password2 = undefined

  if (form.value.password1.length < 4) {
    infoTextRef.value.password1 = t('inputs.password.errors.minLength')
    return
  }
  if (form.value.password1.length > 24) {
    infoTextRef.value.password1 = t('inputs.password.errors.maxLength')
    return
  }
  if (form.value.password1 !== form.value.password2) {
    infoTextRef.value.password2 = t('inputs.password.errors.mustMatch')
    return
  }

  modalOpen.value = false
  const hashedPassword = hashPassword(form.value.password1)
  emit('update', {
    name: props.name,
    value: hashedPassword
  })
}

const isNewPassword = computed(() => {
  return props.newValue !== '' && props.newValue !== props.oldValue
})

function closeModal() {
  ;((modalOpen.value = false), (infoTextRef.value.password1 = undefined))
  infoTextRef.value.password2 = undefined
}
</script>

<template>
  <div class="input-password" :class="inputAlign">
    <div class="button">
      <Button icon="lock" @click="modalOpen = true">
        {{ t('inputs.password.changePassword') }}
        <span class="accent-span" v-if="isNewPassword">*</span>
      </Button>
    </div>
    <InfoText v-if="infoTextRef.global">{{ infoTextRef.global }}</InfoText>
    <InputModal v-if="modalOpen" @close="closeModal()" width="480px">
      <template #content>
        <InputRow :title="t('inputs.password.enterNew')">
          <InputText
            name="password1"
            password
            :infoText="infoTextRef.password1"
            @update="update($event)"
            @preventEnter="save()"
          />
        </InputRow>
        <InputRow :title="t('inputs.password.repeat')">
          <InputText
            name="password2"
            password
            :infoText="infoTextRef.password2"
            @update="update($event)"
            @preventEnter="save()"
          />
        </InputRow>
      </template>
      <template #buttons>
        <Button icon="check" accent @click="save()">{{ t('common.actions.set') }}</Button>
        <Button icon="cancel" @click="closeModal()">{{ t('common.actions.cancel') }}</Button>
      </template>
    </InputModal>
  </div>
</template>

<style lang="scss" scoped>
.input-password {
  .accent-span {
    color: var(--A1);
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
