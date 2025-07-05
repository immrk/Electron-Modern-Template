export const WINDOW_NAMES = {
    main: 'main',
    setting: 'setting',
}

export const WINDOW_LIST: { [key: string]: any } = {
    [WINDOW_NAMES.main]: {
        width: 1200,
        height: 800,
        // title: '主窗口',
        devPort: 11069,
    },
    [WINDOW_NAMES.setting]: {
        width: 800,
        height: 600,
        // title: '设置窗口',
        devPort: 11070,
    }
}