/*
 * vue语言管理，统一管理语言设置和系统跟随
 * 
 * 使用方式：
 * 1. 在组件中引入 useLanguage
 * 2. 使用 currentLanguage 来获取当前语言
 * 3. 使用 changeLanguage 来切换语言
 * 4. 使用 refreshLanguage 来刷新语言
 * 5. 使用 onLanguageChange 来监听语言变化
 * 
 * 注意：
 * 1. 引入时会自动监听系统语言变化，并更新 currentLanguage
 * 2. 切换语言时会自动调用 IPC 写入本地配置
 * 3. 基于vue-i18n和主进程通信，实现语言管理
 */
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";

/** 统一定义类型，便于在别处复用 */
export type LanguageType = "system" | "zh-CN" | "en-US";

/**
 * 负责：
 * 1. 获取存储或系统语言并更新 `currentLanguage`
 * 2. 监听系统语言变化
 * 3. 暴露可写的 `currentLanguage` 供业务侧手动切换
 */
export function useLanguage() {
  const { locale } = useI18n();
  const currentLanguage = ref<LanguageType>("system");

  /** 真正的初始化/同步函数，让逻辑可复用也方便测试 */
  const syncLanguage = async () => {
    try {
      const { data } = await window.system.getLanguage();
      currentLanguage.value = (data.storeLanguage as LanguageType) || "system";

      if (currentLanguage.value === "system") {
        // 系统模式：使用系统语言
        locale.value = data.systemLanguage as "zh-CN" | "en-US";
      } else {
        // 手动模式：使用存储的语言
        locale.value = currentLanguage.value as "zh-CN" | "en-US";
      }
    } catch (err) {
      console.error("[useLanguage] 获取语言失败：", err);
    }
  };

  /** 切换语言时（比如下拉框切 system/zh-CN/en-US）调用此函数即可 */
  const changeLanguage = async (value: LanguageType) => {
    currentLanguage.value = value;
    // 调用 IPC 写入本地配置
    await window.system.changeLanguage(value);
    await syncLanguage();
  };

  /** 生命周期：组件挂载时初始化，并监听系统事件 */
  onMounted(() => {
    syncLanguage();
    window.system.onChangeLanguage(syncLanguage);
  });

  /** 可选：离开时移除监听，防止内存泄漏 */
  onUnmounted(() => {
    // 注意：如果 API 没有提供 offChangeLanguage，这里可以忽略
    // window.system.offChangeLanguage?.(syncLanguage);
  });

  /** 当 currentLanguage 在组件内被直接修改时，也自动同步 locale */
  watch(currentLanguage, (val) => {
    if (val === "system") return; // 系统模式已在 syncLanguage 里处理
    locale.value = val as "zh-CN" | "en-US";
  });

  return {
    // 状态
    currentLanguage,
    // 方法
    changeLanguage,
    refreshLanguage: syncLanguage
  };
} 