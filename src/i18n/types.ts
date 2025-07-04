// i18n 类型定义
export interface MenuTranslations {
  file: string
  edit: string
  view: string
  window: string
  help: string
  newMainWindow: string
  openSettingWindow: string
  about: string
  developerTools: string
  copy: string
  paste: string
  undo: string
  redo: string
  cut: string
  delete: string
  selectAll: string
  pasteAndMatchStyle: string
  reload: string
  forceReload: string
  toggleDevTools: string
  resetZoom: string
  zoomIn: string
  zoomOut: string
  toggleFullscreen: string
  minimize: string
  close: string
  front: string
  quit: string
  hide: string
  hideOthers: string
  unhide: string
  services: string
  windowMenu: string
}

export interface I18nNamespace {
  menu: MenuTranslations
}

export type SupportedLanguages = 'zh-CN' | 'en-US' 