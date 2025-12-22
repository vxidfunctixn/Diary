import type { Meta, StoryObj } from '@storybook/vue3'
import { Theme } from './theme'

/**
 * # System motywów
 *
 * Aplikacja korzysta z dynamicznego systemu motywów opartego na HSL.
 * Motywy są generowane w locie na podstawie wybranego odcienia (hue).
 *
 * ## Dostęp do zmiennych w JavaScript/TypeScript
 *
 * W aplikacji zalecane jest używanie `themeColor` z store zamiast bezpośredniego tworzenia instancji Theme:
 *
 * ```typescript
 * import { useSettingsStore } from '@/stores'
 * import { storeToRefs } from 'pinia'
 *
 * // W komponencie Vue
 * const settingsStore = useSettingsStore()
 * const { themeColor } = storeToRefs(settingsStore)
 *
 * // Użycie w computed lub metodzie
 * const iconColor = computed(() => {
 *   return themeColor.value.accent_500.hsla // "hsla(143, 73%, 36%, 100%)"
 * })
 *
 * // Dostęp do właściwości koloru
 * console.log(themeColor.value.accent_500.hsla) // "hsla(143, 73%, 36%, 100%)"
 * console.log(themeColor.value.accent_500.hsl)  // "hsl(143, 73%, 36%)"
 * console.log(themeColor.value.accent_500.h)    // 143
 * console.log(themeColor.value.accent_500.s)    // "73%"
 * console.log(themeColor.value.accent_500.l)    // "36%"
 * ```
 *
 * ### Bezpośrednie użycie klasy Theme (jeśli potrzebne)
 *
 * ```typescript
 * import { Theme } from '@/theme/theme'
 *
 * // Utworzenie motywu z odcieniem (hue: 0-360)
 * const theme = new Theme(143) // zielony odcień
 *
 * // Pobranie kolorów dla ciemnego motywu
 * const darkColors = theme.dark()
 * console.log(darkColors.accent_500.hsla) // "hsla(143, 73%, 36%, 100%)"
 *
 * // Pobranie kolorów dla jasnego motywu
 * const lightColors = theme.light()
 * console.log(lightColors.accent_500.hsla) // "hsla(143, 85%, 52%, 100%)"
 * ```
 *
 * ## Dostęp do zmiennych w SCSS
 *
 * Kolory motywu są dostępne jako zmienne CSS (custom properties).
 * Są one dynamicznie generowane i dostępne w całej aplikacji.
 *
 * ```scss
 * .my-component {
 *   // Kolory pierwszoplanowe (foreground)
 *   color: var(--foreground_100); // najjaśniejszy tekst
 *   color: var(--foreground_500); // średni tekst
 *   color: var(--foreground_900); // najciemniejszy tekst
 *
 *   // Kolory akcentowe (accent)
 *   background: var(--accent_500);  // główny akcent
 *   border-color: var(--accent_300);
 *
 *   // Kolory tła (background)
 *   background-color: var(--background_100); // najciemniejsze tło (dark) / najjaśniejsze (light)
 *   background-color: var(--background_500); // średnie tło
 *   background-color: var(--background_900); // najjaśniejsze tło (dark) / najciemniejsze (light)
 *
 *   // Kolory statusowe
 *   color: var(--danger_200);   // błędy, ostrzeżenia
 *   color: var(--warning_200);  // uwagi
 *   color: var(--success_200);  // sukces
 *
 *   // Podstawowe kolory
 *   color: var(--white);
 *   color: var(--black);
 * }
 * ```
 *
 * ## Struktura kolorów
 *
 * ### Foreground (Pierwszoplanowe)
 * Używane do tekstu i elementów pierwszoplanowych:
 * - `foreground_100` - najjaśniejszy
 * - `foreground_500` - średni
 * - `foreground_900` - najciemniejszy
 *
 * ### Accent (Akcentowe)
 * Główne kolory marki/akcentowe:
 * - `accent_100` - najjaśniejszy
 * - `accent_500` - główny akcent
 * - `accent_900` - najciemniejszy
 *
 * ### Background (Tła)
 * Kolory tła:
 * - `background_100` - najciemniejsze (dark mode) / najjaśniejsze (light mode)
 * - `background_500` - średnie
 * - `background_900` - najjaśniejsze (dark mode) / najciemniejsze (light mode)
 *
 * ### Statusowe
 * - `danger_100/200/300` - błędy, niebezpieczeństwa
 * - `warning_100/200/300` - ostrzeżenia
 * - `success_100/200/300` - sukces, potwierdzenia
 */

const meta: Meta = {
  title: 'Theme/Kolory',
  tags: ['autodocs']
}

export default meta
type Story = StoryObj

// Pomocniczy komponent do wyświetlania palety kolorów
const ColorPaletteComponent = {
  template: `
    <div style="padding: 20px; font-family: system-ui, -apple-system, sans-serif;">
      <h2 style="margin-bottom: 20px; color: white;">{{ title }}</h2>

      <div v-for="(group, groupName) in colorGroups" :key="groupName" style="margin-bottom: 40px;">
        <h3 style="margin-bottom: 15px; text-transform: capitalize; color: white;">{{ groupName }}</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
          <div
            v-for="(color, colorName) in group"
            :key="colorName"
            style="border: 1px solid #ccc; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
          >
            <div
              :style="{
                background: color.hsla,
                height: '80px',
                border: '1px solid rgba(0,0,0,0.1)'
              }"
            ></div>
            <div style="padding: 10px; background: white;">
              <div style="font-weight: bold; margin-bottom: 4px; font-size: 12px; color: #333;">
                {{ colorName }}
              </div>
              <div style="font-size: 11px; color: #666; font-family: monospace;">
                {{ color.hsla }}
              </div>
              <div style="font-size: 10px; color: #999; margin-top: 4px;">
                H: {{ color.h }}, S: {{ color.s }}, L: {{ color.l }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    title: String,
    colorGroups: Object
  }
}

// Funkcja grupująca kolory według kategorii
function groupColors(colors: any) {
  const groups: any = {
    podstawowe: {},
    foreground: {},
    accent: {},
    background: {},
    statusowe: {}
  }

  Object.keys(colors).forEach(key => {
    if (key === 'white' || key === 'black') {
      groups.podstawowe[key] = colors[key]
    } else if (key.startsWith('foreground_')) {
      groups.foreground[key] = colors[key]
    } else if (key.startsWith('accent_')) {
      groups.accent[key] = colors[key]
    } else if (key.startsWith('background_')) {
      groups.background[key] = colors[key]
    } else if (
      key.startsWith('danger_') ||
      key.startsWith('warning_') ||
      key.startsWith('success_')
    ) {
      groups.statusowe[key] = colors[key]
    }
  })

  return groups
}

/**
 * ## Ciemny motyw (Dark Mode)
 *
 * Paleta kolorów dla ciemnego motywu z odcieniem 143 (zielony).
 * W ciemnym motywie:
 * - Niższe numery background są ciemniejsze
 * - Niższe numery foreground są jaśniejsze
 */
export const DarkTheme: Story = {
  render: () => ({
    components: { ColorPaletteComponent },
    setup() {
      const theme = new Theme(143)
      const colors = theme.dark()
      const colorGroups = groupColors(colors)

      return {
        colorGroups,
        title: 'Ciemny motyw (Dark Mode) - Hue: 143'
      }
    },
    template: '<ColorPaletteComponent :title="title" :color-groups="colorGroups" />'
  })
}

/**
 * ## Jasny motyw (Light Mode)
 *
 * Paleta kolorów dla jasnego motywu z odcieniem 143 (zielony).
 * W jasnym motywie:
 * - Niższe numery background są ciemniejsze
 * - Niższe numery foreground są ciemniejsze
 */
export const LightTheme: Story = {
  render: () => ({
    components: { ColorPaletteComponent },
    setup() {
      const theme = new Theme(143)
      const colors = theme.light()
      const colorGroups = groupColors(colors)

      return {
        colorGroups,
        title: 'Jasny motyw (Light Mode) - Hue: 143'
      }
    },
    template: '<ColorPaletteComponent :title="title" :color-groups="colorGroups" />'
  })
}

/**
 * ## Motyw niebieski (Dark)
 *
 * Przykład motywu z innym odcieniem - niebieski (Hue: 210).
 */
export const BlueDarkTheme: Story = {
  render: () => ({
    components: { ColorPaletteComponent },
    setup() {
      const theme = new Theme(210)
      const colors = theme.dark()
      const colorGroups = groupColors(colors)

      return {
        colorGroups,
        title: 'Ciemny motyw niebieski - Hue: 210'
      }
    },
    template: '<ColorPaletteComponent :title="title" :color-groups="colorGroups" />'
  })
}

/**
 * ## Motyw fioletowy (Light)
 *
 * Przykład motywu z innym odcieniem - fioletowy (Hue: 270).
 */
export const PurpleLightTheme: Story = {
  render: () => ({
    components: { ColorPaletteComponent },
    setup() {
      const theme = new Theme(270)
      const colors = theme.light()
      const colorGroups = groupColors(colors)

      return {
        colorGroups,
        title: 'Jasny motyw fioletowy - Hue: 270'
      }
    },
    template: '<ColorPaletteComponent :title="title" :color-groups="colorGroups" />'
  })
}

/**
 * ## Motyw pomarańczowy (Dark)
 *
 * Przykład motywu z innym odcieniem - pomarańczowy (Hue: 30).
 */
export const OrangeDarkTheme: Story = {
  render: () => ({
    components: { ColorPaletteComponent },
    setup() {
      const theme = new Theme(30)
      const colors = theme.dark()
      const colorGroups = groupColors(colors)

      return {
        colorGroups,
        title: 'Ciemny motyw pomarańczowy - Hue: 30'
      }
    },
    template: '<ColorPaletteComponent :title="title" :color-groups="colorGroups" />'
  })
}

/**
 * ## Porównanie motywów
 *
 * Wyświetla ciemny i jasny motyw obok siebie dla porównania.
 */
export const ThemeComparison: Story = {
  render: () => ({
    components: { ColorPaletteComponent },
    setup() {
      const theme = new Theme(143)
      const darkColors = theme.dark()
      const lightColors = theme.light()
      const darkGroups = groupColors(darkColors)
      const lightGroups = groupColors(lightColors)

      return {
        darkGroups,
        lightGroups
      }
    },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <ColorPaletteComponent title="Ciemny motyw" :color-groups="darkGroups" />
        <ColorPaletteComponent title="Jasny motyw" :color-groups="lightGroups" />
      </div>
    `
  })
}
