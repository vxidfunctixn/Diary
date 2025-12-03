<script setup lang="ts">
import Icon from '@/components/icon.vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settingsStore'
import { computed, ref, getCurrentInstance } from 'vue'
const settingsStore = useSettingsStore()
const { themeColor } = storeToRefs(settingsStore)

const props = defineProps({
  level: Number,
  icon: String,
  title: String
})

const hasClickEventListener = computed(() => getCurrentInstance()?.vnode.props?.onClick)
</script>

<template>
  <div
    class="nav-item"
    :class="{ lv1: level === 1, lv2: level === 2, lv3: level === 3, link: hasClickEventListener }"
    :tabindex="hasClickEventListener ? 0 : -1"
    :title="title"
  >
    <div class="icon">
      <Icon :name="icon" :size="16" :color="themeColor.F1.value" />
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<style lang="scss" scoped>
.nav-item {
  display: flex;
  height: 40px;
  align-items: center;
  padding-left: 28px;
  padding-right: 28px;
  clip-path: polygon(
    calc(100% - 20px) 0%,
    100% 50%,
    calc(100% - 20px) 100%,
    0% 100%,
    20px 50%,
    0% 0%
  );
  margin-left: -20px;
  position: relative;
  min-width: 0;
  outline: none;
  -webkit-app-region: no-drag;

  &.link {
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: 0;
      background-color: var(--A4);
      clip-path: polygon(
        0% 0%,
        calc(100% - 20px) 0%,
        100% 50%,
        calc(100% - 20px) 100%,
        0% 100%,
        6px calc(100% - 2px),
        calc(100% - 23px) calc(100% - 2px),
        calc(100% - 4px) 50%,
        calc(100% - 23px) 2px,
        6px 2px,
        24px 50%,
        6px calc(100% - 2px),
        0px 100%,
        20px 50%
      );
      opacity: 0;
    }

    &:hover::after,
    &:focus-visible::after,
    &:hover::before,
    &:focus-visible::before {
      opacity: 1;
    }

    &:active::before {
      border-color: var(--A2);
    }

    &:active::after {
      background-color: var(--A2);
    }
  }

  .icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    margin-left: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &.lv1 {
    padding-left: 8px;
    background-color: var(--HL1);
    clip-path: polygon(calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%, 0% 0%);
    margin-left: 0px;
    border-top-left-radius: 6px;
    overflow: hidden;

    &::after {
      clip-path: polygon(
        0% 0%,
        calc(100% - 20px) 0%,
        100% 50%,
        calc(100% - 20px) 100%,
        0% 100%,
        0px calc(100% - 2px),
        calc(100% - 22px) calc(100% - 2px),
        calc(100% - 4px) 50%,
        calc(100% - 22px) 2px,
        2px 2px,
        2px 100%,
        0px 100%
      );
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      border: 2px solid var(--A4);
      border-bottom: none;
      border-right: none;
      width: 32px;
      height: 32px;
      border-top-left-radius: 6px;
      opacity: 0;
    }
  }

  &.lv2 {
    background-color: var(--HL2);
  }

  &.lv3 {
    background-color: var(--HL3);
  }
}

.app-theme-provider.maximized {
  .nav-item.lv1 {
    border-top-left-radius: 0;

    &::before {
      display: none;
    }
  }
}

.app-theme-provider:not(.active) {
  .nav-item {
    .title,
    .icon {
      opacity: 0.7;
    }
  }
}
</style>
