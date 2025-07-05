<template>
  <div class="setting-app">
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="demo-tabs"
      tab-position="left"
    >
      <el-tab-pane label="主题" name="theme">
        <div class="content">
          <el-alert
            description="切换软件配色主题，默认跟随系统"
            type="primary"
            size="small"
            :closable="false"
          />
          <el-radio-group v-model="themeColor" @change="handleThemeChange">
            <el-radio value="light">明亮</el-radio>
            <el-radio value="dark">暗黑</el-radio>
            <el-radio value="system">跟随系统</el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>
      <el-tab-pane label="语言" name="language">
        <div class="content">
          <el-alert
            description="语言更改后，内容界面即时生效，系统菜单栏需重启生效"
            type="primary"
            :closable="false"
          />
          <el-select v-model="language" placeholder="请选择语言">
            <el-option label="跟随系统" value="system" />
            <el-option label="中文" value="zh-CN" />
            <el-option label="英文" value="en-US" />
          </el-select>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useDark } from "@vueuse/core";

const activeName = ref("theme");
const language = ref("system");
const isDark = useDark();
const themeColor = ref("light");

const handleThemeChange = (value: string) => {
  window.system.changeTheme(value);
  if (value === "system") {
    initTheme();
  } else {
    isDark.value = themeColor.value === "dark";
  }
};

const initTheme = () => {
  window.system
    .getTheme()
    .then((theme: { data: { storeTheme: string | undefined; systemTheme: string } }) => {
      themeColor.value = theme.data.storeTheme || "system";
      if (themeColor.value === "system") {
        isDark.value = theme.data.systemTheme === "dark";
      } else {
        isDark.value = themeColor.value === "dark";
      }
    });
};

onMounted(() => {
  // 初始化主题
  initTheme();
  // 监听主题变化
  window.system.onChangeTheme((theme: string) => {
    initTheme();
  });
});
</script>

<style scoped>
.setting-app {
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

:deep(.el-tabs) {
  height: 100% !important;
}

::v-deep(.el-tabs__item) {
  padding: 0 20px !important;
  height: 40px !important;
  line-height: 40px !important;
  /* border-radius: 10px !important; */
}
</style>
