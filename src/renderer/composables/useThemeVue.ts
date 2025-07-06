/*
 * vue主题管理，统一管理主题色和暗黑模式
 * 
 * 使用方式：
 * 1. 在组件中引入 useTheme
 * 2. 使用 isDark 和 themeColor 来获取和设置主题
 * 3. 使用 changeTheme 来切换主题
 * 4. 使用 refreshTheme 来刷新主题
 * 5. 使用 onThemeChange 来监听主题变化
 * 
 * 注意：
 * 1. 引入时会自动监听系统主题变化，并更新 isDark 和 themeColor
 * 2. 切换主题时会自动调用 IPC 写入本地配置
 * 3. 基于vueuse和主进程通信，实现主题管理(适配element-plus主题)
 */
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useDark } from "@vueuse/core";

/** 统一定义类型，便于在别处复用 */
export type ThemeColor = "light" | "dark" | "system";

/**
 * 负责：
 * 1. 获取存储或系统主题并更新 `isDark`
 * 2. 监听系统主题变化
 * 3. 暴露可写的 `themeColor` 供业务侧手动切换
 */
export function useTheme() {
  const isDark = useDark();             // 来自 VueUse，响应式地操控 <html class="dark">
  const themeColor = ref<ThemeColor>("system");

  /** 真正的初始化/同步函数，让逻辑可复用也方便测试 */
  const syncTheme = async () => {
    try {
      const { data } = await window.system.getTheme();
      themeColor.value = (data.storeTheme as ThemeColor) || "system";

      if (themeColor.value === "system") {
        isDark.value = data.systemTheme === "dark";
      } else {
        isDark.value = themeColor.value === "dark";
      }
    } catch (err) {
      console.error("[useTheme] 获取主题失败：", err);
    }
  };

  /** 切换主题时（比如下拉框切 light/dark/system）调用此函数即可 */
  const changeTheme = async (value: ThemeColor) => {
    themeColor.value = value;
    // 调用 IPC 写入本地配置
    await window.system.changeTheme(value);
    await syncTheme();
  };

  /** 生命周期：组件挂载时初始化，并监听系统事件 */
  onMounted(() => {
    syncTheme();
    window.system.onChangeTheme(syncTheme);
  });

  /** 可选：离开时移除监听，防止内存泄漏 */
  onUnmounted(() => {
    // 注意：如果 API 没有提供 offChangeTheme，这里可以忽略
    // window.system.offChangeTheme?.(syncTheme);
  });

  /** 当 themeColor 在组件内被直接修改时，也自动同步 isDark */
  watch(themeColor, (val) => {
    if (val === "system") return; // 系统模式已在 syncTheme 里处理
    isDark.value = val === "dark";
  });

  return {
    // 状态
    isDark,
    themeColor,
    // 方法
    changeTheme,
    refreshTheme: syncTheme
  };
}
