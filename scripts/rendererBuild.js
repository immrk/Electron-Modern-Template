#!/usr/bin/env node
// scripts/rendererBuild.js
import { spawn, exec as _exec } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';
import { mkdir, stat } from 'fs/promises';
import { promisify } from 'util';

const exec = promisify(_exec);
const __filename = fileURLToPath(import.meta.url);
const root = resolve(dirname(__filename), '..');
const cacheDir = resolve(root, '.cache');
const cacheFile = resolve(cacheDir, 'windowConfig.mjs');

/* ---------- helper ---------- */
const log   = (...args) => console.log('[INFO]', ...args);
const warn  = (...args) => console.warn('[WARN]', ...args);
const error = (...args) => console.error('[ERR ]', ...args);
/* ----------------------------- */

/** 编译 & 读取窗口配置（带缓存） */
async function loadWindowConfig() {
  const src = resolve(root, 'src/config/windowConfig.ts');

  /* 确保 .cache 目录存在 */
  await mkdir(cacheDir, { recursive: true });

  /* 判断是否需要重新编译 */
  let needBuild = true;
  try {
    const [srcStat, cacheStat] = await Promise.all([stat(src), stat(cacheFile)]);
    needBuild = srcStat.mtimeMs > cacheStat.mtimeMs;
  } catch {
    /* 第一次构建或 cache 缺失 */
  }

  if (needBuild) {
    log('编译 windowConfig.ts ...');
    const cmd =
      `npx esbuild "${src}" --bundle --format=esm --platform=node ` +
      `--outfile="${cacheFile}" --log-level=error`;
    await exec(cmd);
    log('windowConfig.ts 编译完成');
  }

  const { WINDOW_LIST } = await import(pathToFileURL(cacheFile));
  return WINDOW_LIST;
}

/** 构建单个窗口 */
async function buildWindow(name) {
  log(`开始构建窗口 "${name}"...`);
  
  return new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      ['vite', 'build'],
      {
        env: { ...process.env, WINDOW_NAME: name },
        stdio: 'inherit',
        shell: true,
      },
    );
    
    child.on('exit', (code) => {
      if (code === 0) {
        log(`窗口 "${name}" 构建完成`);
        resolve();
      } else {
        error(`窗口 "${name}" 构建失败，code=${code}`);
        reject(new Error(`构建失败: ${name}`));
      }
    });
    
    child.on('error', (err) => {
      error(`窗口 "${name}" 构建启动失败:`, err);
      reject(err);
    });
  });
}

/** 并行构建所有窗口 */
async function buildAllWindows(WINDOW_LIST) {
  const buildPromises = Object.keys(WINDOW_LIST).map(name => buildWindow(name));
  
  try {
    await Promise.all(buildPromises);
    log('所有窗口构建完成！');
  } catch (err) {
    error('构建过程中出现错误:', err);
    process.exit(1);
  }
}

/* ---------------- 主流程 ---------------- */
(async () => {
  try {
    const WINDOW_LIST = await loadWindowConfig();

    /* 支持 --only=a,b 仅构建部分窗口 */
    const onlyArg = process.argv.find((a) => a.startsWith('--only='));
    const pick = onlyArg ? onlyArg.split('=')[1].split(',') : null;

    if (pick) {
      log(`仅构建指定窗口: ${pick.join(', ')}`);
      const filteredWindows = {};
      for (const name of pick) {
        if (WINDOW_LIST[name]) {
          filteredWindows[name] = WINDOW_LIST[name];
        } else {
          warn(`未找到窗口配置: ${name}`);
        }
      }
      await buildAllWindows(filteredWindows);
    } else {
      log('开始构建所有窗口...');
      await buildAllWindows(WINDOW_LIST);
    }

    log('构建完成！输出目录: dist/renderer/windows/');
  } catch (err) {
    error('构建失败:', err);
    process.exit(1);
  }
})();
