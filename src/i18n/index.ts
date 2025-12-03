import { createI18n } from 'vue-i18n'
import pl from './locales/pl.json'

export type MessageSchema = typeof pl

const i18n = createI18n<[MessageSchema], 'pl'>({
  legacy: false,
  locale: 'pl',
  fallbackLocale: 'pl',
  messages: {
    pl
  }
})

export default i18n
