# electron-study

## 1.开发模式

1. 依赖库安装
   ```
   npm i
   ```
2. 启动进程代码：watch模式（单独一个进程）
   实时编译除了renderer页面外的文件修改，但变更需要重启app才能生效

```
npm run watch
```

2. 启动渲染层：vue项目dev模式（单独一个进程）
   dev模式vue运行在接口上，需要以development模式启动electron（使用DEBUG-Electron TS Development即可以dev模式启动）

```
npm run dev
```

3. 启动electron应用（单独一个进程）
   - Debug启动：Electron TS Development启动dev模式(使用vite接口) / Electron TS Production(使用dist内打包代码)
   - 命令启动: npm run start

## 2.打包

```
npm run make
```
