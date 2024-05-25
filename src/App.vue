<script setup>
import WindowTitleBar from '@/components/window-title-bar.vue'
import AppThemeProvider from '@/components/app-theme-provider.vue'
</script>

<template>
  <AppThemeProvider>
    <WindowTitleBar/>
  </AppThemeProvider>
</template>

<style lang="scss">
:root {
  --FS1: 8px;
  --FS2: 12px;
  --FS3: 14px;
  --FS4: 16px;

  font-family: Saira;
  font-size: var(--FS4);
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
