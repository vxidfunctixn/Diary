# Poradnik Migracji Projektu Vue + Electron z JavaScript na TypeScript

## Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Przygotowanie projektu](#przygotowanie-projektu)
3. [Instalacja zależności TypeScript](#instalacja-zależności-typescript)
4. [Konfiguracja TypeScript](#konfiguracja-typescript)
5. [Migracja plików JavaScript](#migracja-plików-javascript)
6. [Migracja komponentów Vue](#migracja-komponentów-vue)
7. [Migracja Electron (główny proces)](#migracja-electron-główny-proces)
8. [Migracja Pinia Store](#migracja-pinia-store)
9. [Rozwiązywanie problemów](#rozwiązywanie-problemów)
10. [Weryfikacja i testowanie](#weryfikacja-i-testowanie)

---

## Wprowadzenie

Ten poradnik pomoże Ci przeprowadzić pełną migrację projektu Vue 3 + Electron z JavaScript na TypeScript. Proces migracji jest stopniowy, co pozwala na działanie aplikacji na każdym etapie.

### Dlaczego TypeScript?
- **Lepsze wykrywanie błędów** na etapie kompilacji
- **Inteligentne podpowiedzi** w IDE (IntelliSense)
- **Refaktoryzacja kodu** jest bezpieczniejsza
- **Dokumentacja kodu** poprzez typy
- **Większa skalowalność** projektu

### Struktura aktualnego projektu
```
Diary/
├── src/
│   ├── components/      # Komponenty Vue (*.vue)
│   ├── views/           # Widoki aplikacji (*.vue)
│   ├── App.vue          # Główny komponent
│   ├── main.js          # Punkt wejścia renderer
│   ├── background.js    # Główny proces Electron
│   ├── app-control.js   # Kontroler IPC
│   ├── diaryStore.js    # Store Pinia
│   ├── theme.js         # Zarządzanie motywem
│   └── utils.js         # Funkcje pomocnicze
├── package.json
├── vue.config.js
├── babel.config.js
└── jsconfig.json        # Zostanie zastąpiony przez tsconfig.json
```

---

## Przygotowanie projektu

### Krok 1: Backup projektu
```powershell
# Utwórz kopię zapasową projektu
git add -A
git commit -m "Backup przed migracją do TypeScript"
# lub skopiuj cały folder
```

### Krok 2: Sprawdź aktualny stan projektu
```powershell
# Upewnij się, że projekt działa poprawnie
npm start
```

### Krok 3: Zaktualizuj dependencies (opcjonalnie)
```powershell
# Sprawdź outdated packages
npm outdated

# Zaktualizuj jeśli potrzeba (ostrożnie!)
npm update
```

---

## Instalacja zależności TypeScript

### Krok 1: Instalacja podstawowych pakietów TypeScript

```powershell
# Instalacja TypeScript i pluginów Vue CLI
npm install --save-dev typescript @vue/cli-plugin-typescript

# Instalacja typów dla używanych bibliotek
npm install --save-dev @types/node

# Instalacja typów dla Electron
npm install --save-dev @types/electron

# Instalacja typów dla jssha (używane w utils.js)
npm install --save-dev @types/jssha
```

### Krok 2: Instalacja ts-loader i fork-ts-checker
```powershell
# Dla lepszej integracji z webpack
npm install --save-dev ts-loader fork-ts-checker-webpack-plugin
```

### Krok 3: Instalacja narzędzi do sprawdzania typów w Vue
```powershell
# vue-tsc - TypeScript compiler dla Vue SFC
npm install --save-dev vue-tsc
```

### Pełna lista zależności do zainstalowania:
```json
{
  "devDependencies": {
    "typescript": "~5.0.0",
    "@vue/cli-plugin-typescript": "~5.0.0",
    "@types/node": "^18.0.0",
    "@types/electron": "~13.0.0",
    "@types/jssha": "^3.3.0",
    "ts-loader": "^9.4.0",
    "fork-ts-checker-webpack-plugin": "^8.0.0",
    "vue-tsc": "^1.8.0"
  }
}
```

**⚠️ Uwaga:** Wersja `@types/electron` powinna odpowiadać wersji Electron w projekcie. Dla `electron@13.x.x` użyj `@types/electron@~13.0.0`.

---

## Konfiguracja TypeScript

### Krok 1: Utwórz `tsconfig.json`

```powershell
# Usuń jsconfig.json
Remove-Item jsconfig.json

# Utwórz tsconfig.json
New-Item tsconfig.json -ItemType File
```

#### Zawartość `tsconfig.json`:
```json
{
  "compilerOptions": {
    /* Podstawowe opcje */
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",

    /* Module Resolution */
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    /* Type Checking */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,

    /* Emit */
    "declaration": false,
    "sourceMap": true,
    "isolatedModules": true,

    /* Path Mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    /* Vue specific */
    "types": ["node", "electron"],
    "allowJs": true,
    "checkJs": false
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "src/**/*.js"
  ],
  "exclude": [
    "node_modules",
    "dist_electron"
  ]
}
```

### Krok 2: Utwórz `tsconfig.node.json` dla kodu Node.js

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "types": ["node", "electron"]
  },
  "include": [
    "src/background.ts",
    "src/app-control.ts",
    "vue.config.js"
  ]
}
```

### Krok 3: Dodaj `shims-vue.d.ts` dla obsługi plików `.vue`

Utwórz plik `src/shims-vue.d.ts`:
```typescript
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### Krok 4: Zaktualizuj `vue.config.js`

```javascript
const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'dist_electron', 'preload.js'),
            to: 'preload.js',
          },
        ],
      }),
    ],
  },

  chainWebpack: config => {
    // Konfiguracja TypeScript
    config.resolve.extensions
      .prepend('.ts')
      .prepend('.tsx')

    // Dodaj ts-loader dla plików TypeScript
    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: true
      })

    config.module
      .rule('tsx')
      .test(/\.tsx$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        appendTsxSuffixTo: [/\.vue$/],
        transpileOnly: true
      })
  },

  pluginOptions: {
    electronBuilder: {
      customFileProtocol: './'
      // mainProcessFile i mainProcessWatch zostaną automatycznie wykryte
      // po zmianie rozszerzenia na .ts
      // Opcjonalnie możesz dodać:
      // mainProcessFile: 'src/background.ts',
      // mainProcessWatch: ['src/background.ts', 'src/app-control.ts']
    }
  }
})
```

### Krok 5: Zaktualizuj `package.json` - dodaj skrypty TypeScript

```json
{
  "scripts": {
    "build": "SET NODE_OPTIONS=--openssl-legacy-provider && vue-cli-service electron:build",
    "start": "SET NODE_OPTIONS= && vue-cli-service electron:serve",
    "type-check": "vue-tsc --noEmit",
    "type-check:watch": "vue-tsc --noEmit --watch"
  }
}
```

---

## Migracja plików JavaScript

### Strategia migracji
1. **Etap 1**: Zmień rozszerzenia `.js` → `.ts`
2. **Etap 2**: Dodaj podstawowe typy
3. **Etap 3**: Popraw błędy TypeScript
4. **Etap 4**: Dodaj zaawansowane typy

### Krok 1: Zmień `src/main.js` → `src/main.ts`

```powershell
Rename-Item src\main.js src\main.ts
```

**Przed:**
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/assets/typography.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

**Po:**
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/assets/typography.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

*Uwaga: W tym przypadku kod pozostaje niemal identyczny, TypeScript sam wykryje typy.*

### Krok 2: Zmień `src/utils.js` → `src/utils.ts`

```powershell
Rename-Item src\utils.js src\utils.ts
```

**Po (pełna implementacja z typami):**
```typescript
import { toRaw } from 'vue'
import jsSHA from 'jssha'

// Funkcja porównująca Vue proxy
export function isProxyDifferent(proxy1: any, proxy2: any): boolean {
  const obj1 = toRaw(proxy1)
  const obj2 = toRaw(proxy2)
  return JSON.stringify(obj1) !== JSON.stringify(obj2)
}

// Funkcja zwracająca nazwę miesiąca
export function getMonthName(month: number): string {
  const months: string[] = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ]
  return months[month]
}

// Klasa DateTime do zarządzania datami
export class DateTime {
  timestamp: number
  date: Date
  year: number
  month: number
  monthName: string
  day: number
  hours: number
  minutes: number
  seconds: number
  timeString: string
  dateString: string
  fullDateString: string

  constructor(timestamp: number) {
    this.timestamp = 0
    this.date = new Date()
    this.year = 0
    this.month = 0
    this.monthName = ''
    this.day = 0
    this.hours = 0
    this.minutes = 0
    this.seconds = 0
    this.timeString = ''
    this.dateString = ''
    this.fullDateString = ''
    this.setTimestamp(timestamp)
  }

  setTimestamp(timestamp: number): void {
    this.timestamp = timestamp
    this.date = new Date(timestamp)
    this.year = this.date.getFullYear()
    this.month = this.date.getMonth()
    this.monthName = getMonthName(this.month)
    this.day = this.date.getDate()
    this.hours = this.date.getHours()
    this.minutes = this.date.getMinutes()
    this.seconds = this.date.getSeconds()
    this.timeString = this.getTimeString()
    this.dateString = this.getDateString()
    this.fullDateString = this.getFullDateString()
  }

  setDay(days: number = 0): void {
    const newDate = new Date(this.date.setDate(this.day + days))
    this.setTimestamp(newDate.valueOf())
  }

  setMonth(months: number = 0): void {
    const newDate = new Date(this.year, this.month + (months + 1), 0)
    const monthLength = newDate.getDate()
    if (this.day < monthLength) newDate.setDate(this.day)
    this.setTimestamp(newDate.valueOf())
  }

  setYears(years: number = 0): void {
    const newDate = new Date(this.year + years, this.month + 1, 0)
    const monthLength = newDate.getDate()
    if (this.day < monthLength) newDate.setDate(this.day)
    this.setTimestamp(newDate.valueOf())
  }

  nextDay(): void { this.setDay(1) }
  prevDay(): void { this.setDay(-1) }
  nextMonth(): void { this.setMonth(1) }
  prevMonth(): void { this.setMonth(-1) }
  nextYear(): void { this.setYears(1) }
  prevYear(): void { this.setYears(-1) }

  getTimeString(): string {
    const hours = this.hours.toString().padStart(2, '0')
    const minutes = this.minutes.toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  getDateString(): string {
    const day = this.day.toString().padStart(2, '0')
    const month = (this.month + 1).toString().padStart(2, '0')
    return `${day}.${month}.${this.year}`
  }

  getFullDateString(): string {
    const month = getMonthName(this.month)
    return `${this.day} ${month} ${this.year}`
  }
}

// Funkcja haszująca hasło
export function hashPassword(password: string): string {
  const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" })
  shaObj.update(password)
  return shaObj.getHash("HEX")
}

// Interfejs opcji dla isEqualDate
interface DateCompareOptions {
  day?: boolean
  month?: boolean
  year?: boolean
}

// Funkcja porównująca daty
export function isEqualDate(
  dateA: number | Date,
  dateB: number | Date,
  options: DateCompareOptions = {}
): boolean {
  const validOptions: Required<DateCompareOptions> = {
    day: options && options.day === false ? false : true,
    month: options && options.month === false ? false : true,
    year: options && options.year === false ? false : true,
  }

  let testedDateA: Date | null = null
  let testedDateB: Date | null = null

  if (typeof dateA === 'number') {
    testedDateA = new Date(dateA)
  } else if (typeof (dateA as Date).getMonth === 'function') {
    testedDateA = dateA as Date
  } else {
    console.error('Invalid dateA object')
    return false
  }

  if (typeof dateB === 'number') {
    testedDateB = new Date(dateB)
  } else if (typeof (dateB as Date).getMonth === 'function') {
    testedDateB = dateB as Date
  } else {
    console.error('Invalid dateB object')
    return false
  }

  const dayA = testedDateA.getDate()
  const monthA = testedDateA.getMonth()
  const yearA = testedDateA.getFullYear()

  const dayB = testedDateB.getDate()
  const monthB = testedDateB.getMonth()
  const yearB = testedDateB.getFullYear()

  if (dayA !== dayB && validOptions.day) return false
  if (monthA !== monthB && validOptions.month) return false
  if (yearA !== yearB && validOptions.year) return false
  return true
}

// Funkcja sprawdzająca czy data jest dzisiaj
export function isToday(date: number | Date, options?: DateCompareOptions): boolean {
  return isEqualDate(date, Date.now(), options)
}

// Interfejsy dla Calendar
interface CalendarDay {
  date: Date
  number: number
  currentMonth: boolean
  currentDay: boolean
}

interface CalendarMonth {
  date: Date
  name: string
  currentMonth: boolean
}

interface CalendarYear {
  date: Date
  number: number
  currentYear: boolean
}

type CalendarCallback<T> = (this: T, column: T) => T

// Klasa Calendar
export class Calendar {
  private date: Date

  constructor(date: number | Date) {
    this.date = new Date()
    this.setDate(date)
  }

  setDate(date: number | Date): void {
    if (typeof date === 'number') {
      this.date = new Date(date)
    } else if (typeof (date as Date).getMonth === 'function') {
      this.date = date as Date
    } else {
      console.error('Invalid date object')
    }
  }

  getMonth(callback: CalendarCallback<CalendarDay> | null = null): CalendarDay[][] {
    const dateVar = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
    const currentMonth = dateVar.getMonth()
    let firstWeekDayOfMonth = -dateVar.getDay() + 2
    if (firstWeekDayOfMonth > 1) firstWeekDayOfMonth -= 7
    dateVar.setDate(firstWeekDayOfMonth)

    const rows: CalendarDay[][] = []
    for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
      const row: CalendarDay[] = []
      for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
        const dateObj = new Date(dateVar.valueOf())
        const number = dateObj.getDate()
        const isCurrentMonth = dateObj.getMonth() === currentMonth
        const isCurrentDay = isToday(dateObj)
        const column: CalendarDay = {
          date: dateObj,
          number,
          currentMonth: isCurrentMonth,
          currentDay: isCurrentDay,
        }
        const callbackReturn = typeof callback === 'function' ? callback.call(column, column) : column
        row.push(callbackReturn)

        dateVar.setDate(dateVar.getDate() + 1)
      }
      rows.push(row)
    }

    return rows
  }

  getYear(callback: CalendarCallback<CalendarMonth> | null = null): CalendarMonth[][] {
    const dateVar = new Date(this.date.getFullYear(), 0, 1)

    const rows: CalendarMonth[][] = []
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const row: CalendarMonth[] = []
      for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
        const dateObj = new Date(dateVar.getFullYear(), dateVar.getMonth() + 1, 0)
        const monthLength = dateObj.getDate()
        const currentDay = this.date.getDate()
        if (currentDay < monthLength) dateObj.setDate(currentDay)
        const isCurrentMonth = isToday(dateObj, { day: false })
        const monthName = getMonthName(dateObj.getMonth())
        const column: CalendarMonth = {
          date: dateObj,
          name: monthName,
          currentMonth: isCurrentMonth
        }
        const callbackReturn = typeof callback === 'function' ? callback.call(column, column) : column
        row.push(callbackReturn)

        dateVar.setMonth(dateVar.getMonth() + 1)
      }
      rows.push(row)
    }

    return rows
  }

  getYears(callback: CalendarCallback<CalendarYear> | null = null): CalendarYear[][] {
    const currentYear = this.date.getFullYear()
    const startYear = currentYear - (currentYear % 20)
    const dateVar = new Date(startYear, 0, 1)
    const rows: CalendarYear[][] = []

    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
      const row: CalendarYear[] = []
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        const year = dateVar.getFullYear()
        const dateObj = new Date(year, this.date.getMonth() + 1, 0)
        const monthLength = dateObj.getDate()
        const currentDay = this.date.getDate()
        if (currentDay < monthLength) dateObj.setDate(currentDay)
        const isCurrentYear = isToday(dateObj, {
          day: false,
          month: false,
        })
        const column: CalendarYear = {
          date: dateObj,
          number: year,
          currentYear: isCurrentYear,
        }

        const callbackReturn = typeof callback === 'function' ? callback.call(column, column) : column
        row.push(callbackReturn)

        dateVar.setFullYear(dateVar.getFullYear() + 1)
      }
      rows.push(row)
    }
    return rows
  }
}
```

**Uwagi o migracji `utils.ts`:**
- Import `jsSHA` wymaga zainstalowania `@types/jssha`
- Klasa `DateTime` ma wiele właściwości - wszystkie zainicjalizowane w konstruktorze
- Funkcja `isEqualDate` ma opcjonalny parametr `options` z domyślnymi wartościami
- Klasa `Calendar` używa generycznych typów dla callback functions
- Dodano interfejsy dla zwracanych obiektów: `CalendarDay`, `CalendarMonth`, `CalendarYear`

### Krok 3: Zmień `src/theme.js` → `src/theme.ts`

```powershell
Rename-Item src\theme.js src\theme.ts
```

**Po (z typami):**
```typescript
export class Color {
  h: number
  s: string
  l: string
  hsl: string
  hsla: string
  value: string

  constructor(h: number, s: string, l: string, a: string = '100%') {
    this.h = h
    this.s = s
    this.l = l
    this.hsl = `hsl(${h}, ${s}, ${l})`
    this.hsla = `hsla(${h}, ${s}, ${l}, ${a})`
    this.value = a === '100%' ? `hsl(${h}, ${s}, ${l})` : `hsla(${h}, ${s}, ${l}, ${a})`
  }
}

interface HueValue {
  value: number
}

interface ThemeColors {
  hue: HueValue
  F1: Color
  F1T: Color
  F2: Color
  HL1: Color
  HL2: Color
  HL3: Color
  HL4: Color
  BG1: Color
  BG2: Color
  BG2T: Color
  BG3: Color
  BG4: Color
  A1: Color
  A2: Color
  A3: Color
  A4: Color
  yellow: Color
  red: Color
}

export class Theme {
  private hue: number

  constructor(hue: number) {
    this.hue = hue
  }

  dark(): ThemeColors {
    return {
      hue:    { value: this.hue },
      F1:     new Color(this.hue, '10%', '85%'),
      F1T:    new Color(this.hue, '10%', '85%', '50%'),
      F2:     new Color(this.hue, '8%', '30%'),
      HL1:    new Color(this.hue, '25%', '19%'),
      HL2:    new Color(this.hue, '26%', '16%'),
      HL3:    new Color(this.hue, '26%', '14%'),
      HL4:    new Color(this.hue, '35%', '12%'),
      BG1:    new Color(this.hue, '36%', '11%'),
      BG2:    new Color(this.hue, '42%', '9%'),
      BG2T:   new Color(this.hue, '42%', '9%', '80%'),
      BG3:    new Color(this.hue, '24%', '8%'),
      BG4:    new Color(this.hue, '42%', '5%'),
      A1:     new Color(this.hue, '88%', '57%'),
      A2:     new Color(this.hue, '79%', '49%'),
      A3:     new Color(this.hue, '73%', '36%'),
      A4:     new Color(this.hue, '68%', '26%'),
      yellow: new Color(54, '100%', '51%'),
      red:    new Color(0, '95%', '40%')
    }
  }

  light(): ThemeColors {
    return {
      hue:    { value: this.hue },
      F1:     new Color(this.hue, '10%', '15%'),
      F1T:    new Color(this.hue, '10%', '15%', '50%'),
      F2:     new Color(this.hue, '25%', '70%'),
      HL1:    new Color(this.hue, '35%', '75%'),
      HL2:    new Color(this.hue, '36%', '79%'),
      HL3:    new Color(this.hue, '38%', '81%'),
      HL4:    new Color(this.hue, '39%', '84%'),
      BG1:    new Color(this.hue, '36%', '89%'),
      BG2:    new Color(this.hue, '42%', '88%'),
      BG2T:   new Color(this.hue, '42%', '88%', '80%'),
      BG3:    new Color(this.hue, '39%', '92%'),
      BG4:    new Color(this.hue, '53%', '95%'),
      A1:     new Color(this.hue, '88%', '36%'),
      A2:     new Color(this.hue, '79%', '41%'),
      A3:     new Color(this.hue, '73%', '50%'),
      A4:     new Color(this.hue, '68%', '61%'),
      yellow: new Color(54, '100%', '25%'),
      red:    new Color(0, '95%', '62%')
    }
  }
}
```

**📝 Uwaga o `preload.js`:**
Plik `preload.js` znajduje się w `dist_electron/` i jest **automatycznie generowany** przez electron-builder podczas budowania aplikacji. Nie wymaga ręcznej migracji do TypeScript. Konfiguracja w `vue.config.js` kopiuje ten plik automatycznie.

---

## Migracja komponentów Vue

### Komponenty z `<script setup>` - Najprościej!

#### Przykład: Migracja `button.vue`

**Przed:**
```vue
<script setup>
import Icon from '@/components/icon.vue'
import { storeToRefs } from 'pinia'
import { useDiaryStore } from '@/diaryStore'
import { useSlots } from 'vue'

const diaryStore = useDiaryStore()
const { themeColor } = storeToRefs(diaryStore)
const slots = useSlots()

const props = defineProps({
  icon: String,
  title: String,
  small: Boolean,
  disabled: Boolean,
  accent: Boolean,
  submit: Boolean,
  width: {
    type: String,
    default: 'auto',
  },
  center: Boolean,
  stick: String,
  monospace: Boolean
})
</script>
```

**Po (TypeScript):**
```vue
<script setup lang="ts">
import Icon from '@/components/icon.vue'
import { storeToRefs } from 'pinia'
import { useDiaryStore } from '@/diaryStore'
import { useSlots } from 'vue'

// Definiujemy interfejs dla props
interface Props {
  icon?: string
  title?: string
  small?: boolean
  disabled?: boolean
  accent?: boolean
  submit?: boolean
  width?: string
  center?: boolean
  stick?: 'left' | 'right' | 'both'
  monospace?: boolean
}

// Używamy withDefaults dla wartości domyślnych
const props = withDefaults(defineProps<Props>(), {
  width: 'auto'
})

const diaryStore = useDiaryStore()
const { themeColor } = storeToRefs(diaryStore)
const slots = useSlots()
</script>

<!-- Template pozostaje bez zmian -->
<template>
  <!-- ... -->
</template>

<!-- Styles pozostają bez zmian -->
<style lang="scss" scoped>
  <!-- ... -->
</style>
```

#### Przykład z `defineEmits`:

**Przed:**
```vue
<script setup>
const emit = defineEmits(['update', 'close'])

function handleClick() {
  emit('update', { data: 'value' })
}
</script>
```

**Po:**
```vue
<script setup lang="ts">
interface Emits {
  (e: 'update', payload: { data: string }): void
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

function handleClick(): void {
  emit('update', { data: 'value' })
}
</script>
```

### Komponenty z `ref`, `reactive`, `computed`

**Przed:**
```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

**Po:**
```vue
<script setup lang="ts">
import { ref, computed, type Ref, type ComputedRef } from 'vue'

const count: Ref<number> = ref(0)
const doubled: ComputedRef<number> = computed(() => count.value * 2)

// Lub krótsza wersja (TypeScript wykryje typ):
const count = ref<number>(0)
const doubled = computed<number>(() => count.value * 2)
</script>
```

### Komponenty z event handlerami

**Przed:**
```vue
<script setup>
function handleChange(event) {
  console.log(event.target.value)
}
</script>

<template>
  <input @change="handleChange" />
</template>
```

**Po:**
```vue
<script setup lang="ts">
function handleChange(event: Event): void {
  const target = event.target as HTMLInputElement
  console.log(target.value)
}
</script>

<template>
  <input @change="handleChange" />
</template>
```

---

## Migracja Electron (główny proces)

### Krok 1: Zmień `src/background.js` → `src/background.ts`

```powershell
Rename-Item src\background.js src\background.ts
```

**Po (TypeScript):**
```typescript
import { app, protocol, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { AppControl } from '@/app-control'
import path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
])

async function createWindow(): Promise<void> {
  const win = new BrowserWindow({
    width: 1024,
    minWidth: 486,
    height: 800,
    minHeight: 320,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  })

  win.setBackgroundColor('#00000000')

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  const appControl = new AppControl(win)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('ready', async () => {
  await createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
```

### Krok 2: Zmień `src/app-control.js` → `src/app-control.ts`

```powershell
Rename-Item src\app-control.js src\app-control.ts
```

**Po (TypeScript):**
```typescript
import { ipcMain, nativeTheme, BrowserWindow, IpcMainEvent } from 'electron'

type AppControlAction = 'minimize' | 'maximize' | 'exit'

export class AppControl {
  private win: BrowserWindow

  constructor(win: BrowserWindow) {
    this.win = win
    this.sendNativeTheme()
    this.initEvents()
  }

  private initEvents(): void {
    this.win.on('maximize', () => {
      this.win.webContents.send('window-maximized')
    })
    this.win.on('unmaximize', () => {
      this.win.webContents.send('window-unmaximized')
    })
    this.win.on('focus', () => {
      this.win.webContents.send('window-focus')
    })
    this.win.on('blur', () => {
      this.win.webContents.send('window-blur')
    })

    nativeTheme.on('updated', () => {
      this.sendNativeTheme()
    })

    ipcMain.on('app-control', (event: IpcMainEvent, action: AppControlAction) => {
      switch (action) {
        case 'minimize':
          this.win.minimize()
          break
        case 'maximize':
          if (this.win.isMaximized()) {
            this.win.unmaximize()
          } else {
            this.win.maximize()
          }
          break
        case 'exit':
          this.win.close()
          break
        default:
          break
      }
    })
  }

  private sendNativeTheme(): void {
    if (nativeTheme.shouldUseDarkColors) {
      this.win.webContents.send('native-theme-dark')
    } else {
      this.win.webContents.send('native-theme-light')
    }
  }
}
```

---

## Migracja Pinia Store

### Krok 1: Zmień `src/diaryStore.js` → `src/diaryStore.ts`

```powershell
Rename-Item src\diaryStore.js src\diaryStore.ts
```

**Po (TypeScript):**
```typescript
import { defineStore } from 'pinia'
import { Theme, type Color } from '@/theme'
import { isEqualDate } from './utils'
import type { Ref } from 'vue'

// Definiujemy typy
export const VIEW = {
  HOME: 'home',
  NOTE_LIST: 'note_list',
  SEARCH: 'search',
  MONTH: 'month',
  YEAR: 'year',
  SETTINGS: 'settings',
  LOCK: 'lock',
  EDIT_NOTE: 'edit_note',
  ABOUT: 'about',
} as const

export type ViewType = typeof VIEW[keyof typeof VIEW]

export const REQUIRE_PASSWORD = {
  EVERY_LAUNCH: 'every_launch',
  EVERY_DAY: 'every_day',
  ON_STARTUP: 'on_startup',
  AFTER_LOCK: 'after_lock'
} as const

export type RequirePasswordType = typeof REQUIRE_PASSWORD[keyof typeof REQUIRE_PASSWORD]

export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const

export type ThemeType = typeof THEME[keyof typeof THEME]

// Typy dla state
interface KeyBinding {
  code: number
  key: string
}

interface Note {
  id: string
  modify: number
  created: number
  content: string
  title?: string
}

interface AppState {
  view: ViewType
  nativeTheme: 'dark' | 'light'
  selected_day: number
}

interface Settings {
  diary_name: string
  reminder: boolean
  remind_time: number
  password: string
  require_password: RequirePasswordType
  theme: ThemeType
  theme_hue: number
  standby: boolean
  quick_note_shortcut: KeyBinding[]
}

interface DiaryState {
  app: AppState
  settings: Settings
  notes: Note[]
}

interface HueValue {
  value: number
}

interface ThemeColors {
  hue: HueValue
  F1: Color
  F1T: Color
  F2: Color
  HL1: Color
  HL2: Color
  HL3: Color
  HL4: Color
  BG1: Color
  BG2: Color
  BG2T: Color
  BG3: Color
  BG4: Color
  A1: Color
  A2: Color
  A3: Color
  A4: Color
  yellow: Color
  red: Color
}

const datenow = new Date(Date.now())
const today = new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate())

export const useDiaryStore = defineStore('diary', {
  state: (): DiaryState => ({
    app: {
      view: VIEW.HOME,
      nativeTheme: 'dark',
      selected_day: today.valueOf()
    },
    settings: {
      diary_name: 'Nazwa dziennika',
      reminder: true,
      remind_time: new Date().setHours(8, 5, 0, 0),
      password: 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db',
      require_password: REQUIRE_PASSWORD.AFTER_LOCK,
      theme: THEME.DARK,
      theme_hue: 144,
      standby: true,
      quick_note_shortcut: [
        { code: 91, key: "Meta" },
        { code: 16, key: "Shift" },
        { code: 78, key: "N" }
      ]
    },
    notes: [
      {
        id: '1',
        modify: new Date("2024-02-17T15:24:00").valueOf(),
        created: new Date("2024-02-17T15:24:00").valueOf(),
        content: 'Lorem ipsum dolor sit amet',
      },
      {
        id: '2',
        modify: new Date("2024-02-19T08:12:00").valueOf(),
        created: new Date("2024-02-17T16:15:00").valueOf(),
        content: 'Lorem ipsum dolor sit amet',
      },
      // ... pozostałe notatki
    ]
  }),

  getters: {
    theme(state): 'dark' | 'light' {
      if (state.settings.theme === THEME.SYSTEM) {
        return state.app.nativeTheme
      } else {
        return state.settings.theme === THEME.DARK ? 'dark' : 'light'
      }
    },

    themeColor(state): ThemeColors {
      // Uwaga: this.theme odnosi się do gettera powyżej
      // W TypeScript gettery Pinia działają jak computed properties
      const mode = this.theme
      const theme = new Theme(state.settings.theme_hue)

      if (mode === 'dark') {
        return theme.dark()
      } else {
        return theme.light()
      }
    },

    getNotes: (state) => {
      // Uwaga: parametr date nie jest obecnie używany w implementacji
      // Można go usunąć lub zaimplementować filtrowanie po dacie w przyszłości
      return (): Note[][] => {
        const notes = addNoteTitle(groupNotes([...state.notes]))
        return notes
      }
    }
  },

  actions: {
    setView(view: ViewType): void {
      this.app.view = view
    },

    saveSettings(form: Partial<Settings>): void {
      for (const [key, value] of Object.entries(form)) {
        if (this.settings[key as keyof Settings] !== undefined) {
          (this.settings as any)[key] = value
        }
      }
    },

    async setNativeTheme(theme: 'dark' | 'light'): Promise<void> {
      this.app.nativeTheme = theme
    },

    setSelectedDay(date: number): void {
      this.app.selected_day = date
    }
  },
})

// Funkcje pomocnicze
function groupNotes(notes: Note[]): Note[][] {
  const result: Note[][] = []
  const day: Note[] = []

  notes.map((note, index) => {
    if (day.length === 0) {
      day.push({ ...note })
    } else {
      if (isEqualDate(note.created, day[0].created)) {
        day.push({ ...note })
      } else {
        result.push([...day])
        day.splice(0, day.length)
        day.push({ ...note })
      }
    }

    if (index === notes.length - 1 && day.length) {
      result.push([...day])
    }
  })

  return result
}

function addNoteTitle(notes: Note[][]): Note[][] {
  const result = [...notes]

  result.forEach(group => {
    group.forEach((note, index) => {
      const createdDate = new Date(note.created)
      const modifyDate = new Date(note.modify)
      const isModify = !isEqualDate(createdDate, modifyDate)
      let title = `N${index + 1}`
      if (isModify) title += 'M'
      title += ` ${formatDate(createdDate)}`
      if (isModify) title += ` U ${formatDate(modifyDate)}`

      note.title = title
    })
  })

  return result
}

function formatDate(date: Date): string {
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}.${month}.${year}`
}
```

---

## Rozwiązywanie problemów

### Problem 1: `Cannot find module '@/...'`
**Rozwiązanie:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Problem 2: `Property does not exist on type`
**Rozwiązanie:** Dodaj odpowiednie typy lub użyj type assertion:
```typescript
const element = event.target as HTMLInputElement
```

### Problem 3: `Implicit any type`
**Rozwiązanie:** Dodaj jawny typ:
```typescript
// Przed
function test(param) { }

// Po
function test(param: string): void { }
```

### Problem 4: Błędy w plikach `.vue`
**Rozwiązanie:** Sprawdź czy masz plik `shims-vue.d.ts`:
```typescript
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### Problem 5: Electron IPC types
**Rozwiązanie:**
```typescript
import type { IpcMainEvent, IpcRendererEvent } from 'electron'

ipcMain.on('channel', (event: IpcMainEvent, ...args: any[]) => {
  // ...
})
```

### Problem 6: `strict` mode errors
Jeśli masz zbyt wiele błędów, możesz tymczasowo złagodzić tryb strict:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false
  }
}
```
Następnie stopniowo włączaj strictness:
```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

---

## Weryfikacja i testowanie

### Krok 1: Type checking
```powershell
# Sprawdź błędy TypeScript
npm run type-check

# W trybie watch (podczas rozwoju)
npm run type-check:watch
```

### Krok 2: Build projektu
```powershell
# Zbuduj aplikację
npm run build
```

### Krok 3: Uruchom aplikację
```powershell
# Uruchom w trybie deweloperskim
npm start
```

### Krok 4: Testuj funkcjonalność
- [ ] Wszystkie widoki się otwierają
- [ ] Komponenty renderują się poprawnie
- [ ] IPC communication działa
- [ ] Store Pinia działa poprawnie
- [ ] Motywy się przełączają
- [ ] Build production działa

---

## Checklist migracji

### Przygotowanie
- [ ] Backup projektu (Git commit)
- [ ] Projekt działa przed migracją
- [ ] Zainstalowane wszystkie zależności TS

### Konfiguracja
- [ ] Utworzony `tsconfig.json`
- [ ] Utworzony `tsconfig.node.json`
- [ ] Utworzony `src/shims-vue.d.ts`
- [ ] Zaktualizowany `vue.config.js`
- [ ] Zaktualizowany `package.json`
- [ ] Usunięty `jsconfig.json`

### Migracja plików
- [ ] `src/main.js` → `src/main.ts`
- [ ] `src/background.js` → `src/background.ts`
- [ ] `src/app-control.js` → `src/app-control.ts`
- [ ] `src/diaryStore.js` → `src/diaryStore.ts`
- [ ] `src/theme.js` → `src/theme.ts`
- [ ] `src/utils.js` → `src/utils.ts`

### Migracja komponentów
- [ ] Wszystkie komponenty mają `lang="ts"`
- [ ] Props mają zdefiniowane typy
- [ ] Emits mają zdefiniowane typy
- [ ] Event handlers mają typy
- [ ] Refs i reactive mają typy

### Weryfikacja
- [ ] `npm run type-check` przechodzi bez błędów
- [ ] `npm run build` działa
- [ ] `npm start` uruchamia aplikację
- [ ] Wszystkie funkcje działają poprawnie

---

## Kompatybilność wersji

### Ważne informacje o wersjach pakietów

Twój projekt używa starszych wersji niektórych pakietów:
- `electron@13.0.0` - starsza wersja LTS
- `vue@3.2.13` - stosunkowo nowa wersja Vue 3
- `@vue/cli-service@5.0.0` - Vue CLI 5

**Zalecenia:**
1. **TypeScript**: Użyj wersji `~4.9.0` lub `~5.0.0` - obie powinny działać dobrze
2. **@types/electron**: MUSI odpowiadać wersji Electron - użyj `~13.0.0`
3. **@types/node**: Użyj `^18.0.0` dla kompatybilności z Electron 13
4. Rozważ późniejszą aktualizację Electron do nowszej wersji (np. Electron 25+)

### Testowanie po instalacji

Po zainstalowaniu wszystkich pakietów TypeScript:
```powershell
# Sprawdź czy nie ma konfliktów
npm ls typescript
npm ls @types/electron

# Jeśli są konflikty, użyj:
npm dedupe
```

---

## Najlepsze praktyki

### 1. Używaj type inference
TypeScript często sam wykryje typy:
```typescript
// Zamiast
const count: Ref<number> = ref(0)

// Użyj
const count = ref(0) // TS wykryje Ref<number>
```

### 2. Definiuj interfejsy dla złożonych struktur
```typescript
interface User {
  id: string
  name: string
  email: string
}

const user = ref<User>({
  id: '1',
  name: 'John',
  email: 'john@example.com'
})
```

### 3. Używaj `as const` dla stałych
```typescript
export const VIEWS = {
  HOME: 'home',
  SETTINGS: 'settings'
} as const

type ViewType = typeof VIEWS[keyof typeof VIEWS]
```

### 4. Type guards dla union types
```typescript
function isString(value: string | number): value is string {
  return typeof value === 'string'
}
```

### 5. Unikaj `any` - użyj `unknown`
```typescript
// Zamiast
function process(data: any) { }

// Użyj
function process(data: unknown) {
  if (typeof data === 'string') {
    // TypeScript wie, że data to string
  }
}
```

---

## Dodatkowe zasoby

### Dokumentacja
- [Vue 3 + TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Electron TypeScript Guide](https://www.electronjs.org/docs/latest/tutorial/typescript)
- [Pinia TypeScript Support](https://pinia.vuejs.org/core-concepts/#typescript)

### Narzędzia
- [Vue Language Tools (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint TypeScript](https://typescript-eslint.io/)

### Community
- [Vue Discord](https://discord.com/invite/vue)
- [TypeScript Discord](https://discord.gg/typescript)
- [Stack Overflow - Vue + TypeScript](https://stackoverflow.com/questions/tagged/vue.js+typescript)

---

## Podsumowanie

Migracja z JavaScript na TypeScript to proces stopniowy, który znacząco poprawia jakość kodu i developer experience. Kluczowe kroki to:

1. **Instalacja** odpowiednich pakietów TypeScript
2. **Konfiguracja** `tsconfig.json` i narzędzi
3. **Stopniowa migracja** plików `.js` → `.ts`
4. **Dodawanie typów** do komponentów Vue
5. **Weryfikacja** i testowanie

Pamiętaj, że możesz migrować stopniowo - TypeScript pozwala na współistnienie plików `.js` i `.ts` w tym samym projekcie (dzięki opcji `allowJs`).

Powodzenia w migracji! 🚀
