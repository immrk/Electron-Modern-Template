#!/usr/bin/env node
// scripts/dev-multi.js
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

/** 启动单个 Vite 实例 */
function startVite(name, { devPort }) {
  log(`启动窗口 "${name}"，端口 ${devPort}`);
  const child = spawn(
    'npx',
    ['vite'],
    {
      env: { ...process.env, WINDOW_NAME: name, PORT: devPort },
      stdio: 'inherit',
      shell: true,
    },
  );
  child.on('exit', (code) => warn(`窗口 "${name}" 退出，code=${code}`));
  child.on('error', (err) => error(`窗口 "${name}" 启动失败:`, err));
  return child;
}

/** 退出时清理所有子进程 */
const children = new Set();
function cleanup() {
  warn('正在关闭所有开发服务器...');
  for (const p of children) p.kill('SIGTERM');
  process.exit();
}
['SIGINT', 'SIGTERM', 'exit'].forEach((sig) => process.on(sig, cleanup));

/* ---------------- 主流程 ---------------- */
(async () => {
  const WINDOW_LIST = await loadWindowConfig();

  /* 支持 --only=a,b 仅启动部分窗口 */
  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  const pick = onlyArg ? onlyArg.split('=')[1].split(',') : null;

  log('启动多窗口开发环境');
  for (const [name, cfg] of Object.entries(WINDOW_LIST)) {
    if (pick && !pick.includes(name)) continue;
    children.add(startVite(name, cfg));
  }

  log('全部窗口已启动：');
  Object.entries(WINDOW_LIST).forEach(([name, { devPort }]) => {
    if (!pick || pick.includes(name))
      console.log(`  • ${name}  →  http://localhost:${devPort}`);
  });
  console.log('按 Ctrl+C 以停止');
})();
