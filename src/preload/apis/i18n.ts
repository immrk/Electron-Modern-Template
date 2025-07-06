import { contextBridge, ipcRenderer } from 'electron'

export function exposeI18nAPI() {
  contextBridge.exposeInMainWorld("i18n", {
    getCurrentLanguage: () => ipcRenderer.invoke("i18n:getCurrentLanguage"),
    getSupportedLanguages: () => ipcRenderer.invoke("i18n:getSupportedLanguages"),
    setLanguage: (language: string) => ipcRenderer.invoke("i18n:setLanguage", language),
    translate: (key: string, options?: any) => ipcRenderer.invoke("i18n:translate", key, options),
    onLanguageChanged: (callback: (language: string) => void) => {
      ipcRenderer.on('i18n:languageChanged', (event, language) => callback(language))
    },
    removeLanguageChangedListener: () => {
      ipcRenderer.removeAllListeners('i18n:languageChanged')
    }
  });

  console.log("i18n API 已暴露");
}