import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

export default {
  packagerConfig: {
    asar: true,
    icon: './src/static/logo/logo',
    ignore: [
      // 忽略除了dist目录外的所有文件, 减小打包体积（暂时只能配置ignore来忽略文件，无法设置只包括dist目录）
      // package.json需要保留
      ".cache",
      ".vscode",
      ".git",
      ".gitignore",
      ".env",
      ".env.example",
      ".eslintrc.js",
      ".prettierrc",
      ".prettierignore",
      ".prettierignore",
      "src",
      "node_modules",
      "mock",
      "scripts",
      "forge.config.ts",
      "tsconfig.json",
      "tsup.config.ts",
      "vite.config.ts",
      "vite-env.d.ts",
      "nodemon.json",
      "package-lock.json",
      "README.md",
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './src/static/logo/logo.png',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
