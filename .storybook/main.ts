import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },

  async viteFinal(config: any) {
    return mergeConfig(config, {
      plugins: [vue()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src')
        }
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@import "@/theme/global.scss"; @import "@/theme/mixins.scss";`
          }
        }
      }
    })
  },

  addons: ['@storybook/addon-docs', '@storybook/addon-vitest']
}
export default config
