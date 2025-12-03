import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import i18n from './i18n'
import '@/assets/typography.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(pinia)
app.use(i18n)

// Włącz Vue Devtools w trybie deweloperskim
if (process.env.NODE_ENV === 'development') {
  app.config.performance = true
}

app.mount('#app')
