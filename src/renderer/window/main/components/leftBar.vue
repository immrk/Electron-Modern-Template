<template>
  <div class="left-bar">
    <el-avatar shape="square" :size="50" :src="squareUrl" />
    <div class="menu-list">
      <el-icon
        class="menu-item"
        v-for="item in menuList"
        :key="item.name"
        :size="30"
        :color="
          item.isActive
            ? 'var(--el-color-primary)'
            : 'var(--el-color-info-light-3)'
        "
        @click="handleMenuClick(item)"
      >
        <component :is="item.icon" />
      </el-icon>
    </div>
    <div class="bottom-menu">
      <el-icon
        class="menu-item"
        :size="30"
        :color="'var(--el-color-info-light-3)'"
        @click="handleSettingClick"
      >
        <i-ep-setting />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed, watch } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { HomeFilled, InfoFilled, CopyDocument, Connection } from "@element-plus/icons-vue";
import { MenuEnum } from "../constants";

const router = useRouter();
const route = useRoute();

const isDark = ref(false);

const squareUrl =
  "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png";

const menuList = ref([
  {
    name: MenuEnum.HOME,
    icon: () => h(HomeFilled),
    path: '/home',
    isActive: true,
  },
  {
    name: MenuEnum.SYSTEM,
    icon: () => h(InfoFilled),
    path: '/system',
    isActive: false,
  },
  {
    name: MenuEnum.WINDOW,
    icon: () => h(CopyDocument),
    path: '/window',
    isActive: false,
  },
  {
    name: MenuEnum.API_TEST,
    icon: () => h(Connection),
    path: '/api-test',
    isActive: false,
  },
]);

// 监听路由变化，更新菜单激活状态
watch(() => route.path, (newPath) => {
  menuList.value.forEach((menu: any) => {
    menu.isActive = menu.path === newPath;
  });
}, { immediate: true });

const handleMenuClick = (item: any) => {
  router.push(item.path);
};

const handleSettingClick = () => {
  (window as any).windowManager.createWindow("setting");
};
</script>

<style scoped>
.left-bar {
  width: 70px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: calc(10px + 30px); /* 30px是titlebar的高度 */
  background-color: var(--el-color-info-light-9);
}

.menu-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}

.menu-item {
  cursor: pointer;
}

.bottom-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 130px;
}

.menu-item:hover {
  color: var(--el-color-primary);
  transform: scale(1.1);
  transition: transform 0.1s ease-in-out;
}
</style>
