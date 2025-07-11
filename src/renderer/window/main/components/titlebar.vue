<template>
  <div class="titlebar"></div>
</template>

<script setup lang="ts"></script>

<style scoped>
.titlebar {
  height: 30px;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  color: var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;
  app-region: drag; /* 允许拖动窗口 */
  position: absolute;
}
</style>