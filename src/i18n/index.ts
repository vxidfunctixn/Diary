import { createI18n } from 'vue-i18n'
import pl from './locales/pl.json'
import en from './locales/en.json'

export type MessageSchema = typeof pl

const i18n = createI18n<[MessageSchema], 'pl' | 'en'>({
  legacy: false,
  locale: 'pl',
  fallbackLocale: 'en',
  messages: {
    pl,
    en
  }
})

export default i18n
