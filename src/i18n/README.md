# Przykład użycia i18n w projekcie

## Użycie w komponentach Vue (Composition API)

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Zmiana języka
const changeLanguage = (lang: 'pl' | 'en') => {
  locale.value = lang
}
</script>

<template>
  <div>
    <h1>{{ t('app.welcome') }}</h1>
    <button @click="changeLanguage('pl')">Polski</button>
    <button @click="changeLanguage('en')">English</button>
  </div>
</template>
```

## Użycie w komponentach Vue (Options API)

```vue
<template>
  <div>
    <h1>{{ $t('app.welcome') }}</h1>
    <button @click="$i18n.locale = 'pl'">Polski</button>
    <button @click="$i18n.locale = 'en'">English</button>
  </div>
</template>
```

## Użycie w kodzie TypeScript

```typescript
import i18n from '@/i18n'

const message = i18n.global.t('common.save')
const currentLocale = i18n.global.locale.value
i18n.global.locale.value = 'en'
```

## Dodawanie nowych tłumaczeń

Edytuj pliki:

- `src/i18n/locales/pl.json` - tłumaczenia polskie
- `src/i18n/locales/en.json` - tłumaczenia angielskie

Zachowaj tę samą strukturę w obu plikach!
