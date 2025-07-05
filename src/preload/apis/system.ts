import { contextBridge, ipcRenderer } from "electron";

export function exposeSystemAPI() {
  contextBridge.exposeInMainWorld("system", {
    changeTheme: (theme: string) => ipcRenderer.invoke("system:changeTheme", theme),
    getTheme: () => ipcRenderer.invoke("system:getTheme"),
    onChangeTheme: (callback: (theme: string) => void) => {
      ipcRenderer.on("system:changeTheme", (event, theme: string) => {
        callback(theme);
      });
    },
  });

  console.log("system API 已暴露");
}