<script setup lang="ts">
import { ref, watch, type Ref, defineAsyncComponent, shallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores'
import type { IconProps } from '@/interfaces/components-interface'

const props = withDefaults(defineProps<IconProps>(), {
  color: null
})

const settingsStore = useSettingsStore()
const { themeColor } = storeToRefs(settingsStore)

const currentColor: Ref<string> = ref(
  props.color ? props.color : settingsStore.themeColor.foreground_200.hsla
)

watch(themeColor, () => {
  currentColor.value = props.color ? props.color : settingsStore.themeColor.foreground_200.hsla
})

watch(
  () => props.color,
  newColor => {
    currentColor.value = newColor ? newColor : settingsStore.themeColor.foreground_200.hsla
  }
)

const IconComponent = shallowRef()

watch(
  () => props.name,
  async newName => {
    if (newName) {
      try {
        IconComponent.value = defineAsyncComponent(() => import(`./icons/${newName}-icon.vue`))
      } catch (error) {
        console.error(`Icon "${newName}" not found`)
        IconComponent.value = null
      }
    } else {
      IconComponent.value = null
    }
  },
  { immediate: true }
)
</script>

<template>
  <component
    v-if="IconComponent"
    :is="IconComponent"
    :size="size"
    :currentColor="currentColor"
    :settingsStore="settingsStore"
  />
</template>

<style lang="scss">
svg {
  display: block;
  flex-shrink: 0;
}
</style>
