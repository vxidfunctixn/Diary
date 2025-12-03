import { DefineComponent } from 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $t: (key: string) => string
    $i18n: {
      locale: string
      availableLocales: string[]
    }
  }
}

export {}
