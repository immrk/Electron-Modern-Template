<template>
  <title-bar />
  <div class="setting-app">
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="demo-tabs"
      tab-position="left"
    >
      <el-tab-pane :label="$t('setting.theme.label')" name="theme">
        <div class="content">
          <el-alert
            :description="$t('setting.theme.description')"
            type="primary"
            size="small"
            :closable="false"
          />
          <el-radio-group v-model="themeColor" @change="handleThemeChange">
            <el-radio value="light">{{ $t("setting.theme.light") }}</el-radio>
            <el-radio value="dark">{{ $t("setting.theme.dark") }}</el-radio>
            <el-radio value="system">{{ $t("setting.theme.system") }}</el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('setting.language.label')" name="language">
        <div class="content">
          <el-alert
            :description="$t('setting.language.description')"
            type="primary"
            :closable="false"
          />
          <el-select
            v-model="currentLanguage"
            :placeholder="$t('setting.language.placeholder')"
            @change="handleLanguageChange"
          >
            <el-option :label="$t('setting.language.system')" value="system" />
            <el-option :label="$t('setting.language.chinese')" value="zh-CN" />
            <el-option :label="$t('setting.language.english')" value="en-US" />
          </el-select>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import titleBar from "./components/titlebar.vue";
import { useTheme } from "../../composables/useThemeVue";
import { useLanguage } from "../../composables/useLanguageVue";

const { t } = useI18n();

const activeName = ref("theme");

// 使用统一的主题管理
const { themeColor, changeTheme } = useTheme();
console.log("setting themeColor:", themeColor.value);

// 使用统一的语言管理
const { currentLanguage, changeLanguage } = useLanguage();
console.log("setting currentLanguage:", currentLanguage.value);

const handleThemeChange = (value: string) => {
  changeTheme(value as "light" | "dark" | "system");
};

const handleLanguageChange = (value: string) => {
  changeLanguage(value as "system" | "zh-CN" | "en-US");
};
</script>

<style scoped>
.setting-app {
  height: 100%;
  padding-top: 30px;
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
