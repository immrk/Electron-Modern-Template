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
import { ref, h } from "vue";
import { HomeFilled, InfoFilled, CopyDocument } from "@element-plus/icons-vue";
import { MenuEnum } from "../constants";

const emit = defineEmits(["menuClick"]);

const squareUrl =
  "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png";

const menuList = ref([
  {
    name: MenuEnum.HOME,
    icon: () => h(HomeFilled),
    isActive: true,
  },
  {
    name: MenuEnum.SYSTEM,
    icon: () => h(InfoFilled),
    isActive: false,
  },
  {
    name: MenuEnum.WINDOW,
    icon: () => h(CopyDocument),
    isActive: false,
  },
]);

const handleMenuClick = (item: any) => {
  menuList.value.forEach((menu: any) => {
    menu.isActive = menu.name === item.name ? true : false;
  });
  emit("menuClick", item.name);
};

const handleSettingClick = () => {
  window.windowManager.createWindow("setting");
};
</script>

<style scoped>
.left-bar {
  width: 70px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
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
  height: 50px;
}

.menu-item:hover {
  color: var(--el-color-primary);
  transform: scale(1.1);
  transition: transform 0.1s ease-in-out;
}
</style>
