import { setup, type Preview } from '@storybook/vue3-vite'
import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from '../src/i18n'
import AppThemeProvider from '../src/components/layout/app-theme-provider.vue'
import { useSettingsStore } from '../src/stores/settingsStore'
import { useAppStore } from '../src/stores/appStore'
import { THEME } from '../src/interfaces/store-interface'
import '../src/assets/typography.css'
import './preview.scss'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const THEME_HUE = 144

setup((app: App) => {
  app.use(pinia)
  app.use(i18n)

  // Inicjalizacja stores z ciemnym motywem
  const settingsStore = useSettingsStore()
  const appStore = useAppStore()

  settingsStore.theme = THEME.DARK
  settingsStore.theme_hue = THEME_HUE
  appStore.setNativeTheme('dark')
})

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: `hsl(${THEME_HUE}, 42%, 5%)` },
        light: { name: 'Light', value: '#f5f5f5' }
      }
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  initialGlobals: {
    backgrounds: { value: 'dark' }
  },
  decorators: [
    (story: any) => ({
      components: { story, AppThemeProvider },
      template: `
      <AppThemeProvider>
        <div id="modal"></div>
        <div class="app-wrapper">
          <story />
        </div>
      </AppThemeProvider>`
    })
  ]
}

export default preview
