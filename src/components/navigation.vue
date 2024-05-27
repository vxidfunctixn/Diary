<script setup>
import Icon from '@/components/icon.vue'
import { storeToRefs } from 'pinia'
import { useDiaryStore } from '@/diaryStore'
const diaryStore = useDiaryStore()
const { themeColor, settings } = storeToRefs(diaryStore)
</script>

<template>
  <div class="navigation">
    <div class="item level-1" tabindex="0">
      <div class="icon">
        <Icon  name="diary" :size="16" :color="themeColor.F1.hsl"/>
      </div>
      <div class="title">{{ settings.diary_name }}</div>
    </div>
    <div class="item level-2" tabindex="0">
      <div class="icon">
        <Icon name="date" :size="16" :color="themeColor.F1.hsl"/>
      </div>
      <div class="title">21.06.2024</div>
    </div>
    <div class="item level-3">
      <div class="icon">
        <Icon name="note" :size="16" :color="themeColor.F1.hsl"/>
      </div>
      <div class="title">N2 21:35</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navigation {
  display: flex;
  user-select: none;
  min-width: 0;
  -webkit-app-region: no-drag;

  .item {
    display: flex;
    height: 40px;
    align-items: center;
    padding-left: 28px;
    padding-right: 28px;
    clip-path: polygon(calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%, 20px 50%, 0% 0%);
    margin-left: -20px;
    position: relative;
    min-width: 0;
    outline: none;

    &:not(:last-child) {
      cursor: pointer;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        left: 0;
        background-color: var(--A1);
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
        border-color: var(--F1);
      }

      &:active::after {
        background-color: var(--F1);
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

    &.level-1 {
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
          0px 100%,
        );
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        border: 2px solid var(--A1);
        border-bottom: none;
        border-right: none;
        width: 32px;
        height: 32px;
        border-top-left-radius: 6px;
        opacity: 0;
      }
    }

    &.level-2 {
      background-color: var(--HL2);
    }

    &.level-3 {
      background-color: var(--HL3);
    }
  }
}

.app-theme-provider.maximized {
  .navigation .item.level-1 {
    border-top-left-radius: 0;
    &::before {
      display: none;
    }
  }
}

.app-theme-provider:not(.active) {
  .navigation .item {
    .title, .icon {
      opacity: .7;
    }
  }
}
</style>