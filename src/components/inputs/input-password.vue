<script setup lang="ts">
import Button from '@/components/button.vue'
import InfoText from '@/components/inputs/info-text.vue'
import InputModal from '@/components/inputs/input-modal.vue'
import InputText from '@/components/inputs/input-text.vue'
import InputRow from '@/components/inputs/input-row.vue'
import { ref, computed } from 'vue'
import { hashPassword } from '@/utils'
const emit = defineEmits(['update'])
const props = defineProps({
  name: String,
  oldValue: String,
  newValue: String,
  infoText: String,
})

const modalOpen = ref(false)
const infoTextRef = ref({
  global: props.infoText
})

const form = ref({
  password1: '',
  password2: '',
})

function update(event) {
  infoTextRef.value[event.name] = undefined
  form.value[event.name] = event.value
}

function save() {
  infoTextRef.value.password1 = undefined
  infoTextRef.value.password2 = undefined

  if(form.value.password1.length < 4) {
    infoTextRef.value.password1 = 'Hasło musi się składać z conajmniej 4 znaków.'
    return
  }
  if(form.value.password1.length > 24) {
    infoTextRef.value.password1 = 'Hasło nie może zawierać wieej niż 24 znaki.'
    return
  }
  if(form.value.password1 !== form.value.password2) {
    infoTextRef.value.password2 = 'Podane hasła muszą być identyczne.'
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
  return (props.newValue !== '' && props.newValue !== props.oldValue)
})

function closeModal() {
  modalOpen.value = false,
  infoTextRef.value.password1 = undefined
  infoTextRef.value.password2 = undefined
}

</script>

<template>
  <div class="input-password">
    <div class="button">
      <Button icon="lock" @click="modalOpen = true">
        Zmień hasło <span class="accent-span" v-if="isNewPassword">*</span>
      </Button>
    </div>
    <InfoText v-if="infoTextRef.global">{{ infoTextRef.global }}</InfoText>
    <InputModal v-if="modalOpen" @close="closeModal()" width="480px">
      <template #content>
        <InputRow title="Wprowadź nowe hasło">
          <InputText name="password1" password :infoText="infoTextRef.password1" @update="update($event)" @preventEnter="save()"/>
        </InputRow>
        <InputRow title="Powtórz hasło">
          <InputText name="password2" password :infoText="infoTextRef.password2" @update="update($event)" @preventEnter="save()"/>
        </InputRow>
      </template>
      <template #buttons>
        <Button icon="check" accent @click="save()">Ustaw</Button>
        <Button icon="cancel" @click="closeModal()">Anuluj</Button>
      </template>
    </InputModal>
  </div>
</template>

<style lang="scss" scoped>
.input-password {

  .button {
    text-align: right;
  }

  .accent-span {
    color: var(--A1);
  }
}
</style>