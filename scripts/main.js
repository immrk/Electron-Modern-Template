#!/usr/bin/env node

import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 开始构建流程...');

try {
  // 1. 执行 tsc 命令
  console.log('📝 执行 TypeScript 编译...');
  execSync('tsc', { 
    cwd: projectRoot, 
    stdio: 'inherit',
    encoding: 'utf8'
  });
  console.log('✅ TypeScript 编译完成');

  // 2. 复制 i18n 文件
  console.log('🌐 复制 i18n 文件...');
  
  // 复制 locales 目录
  const sourceLocalesDir = join(projectRoot, 'src', 'main', 'i18n', 'locales');
  const targetLocalesDir = join(projectRoot, 'dist', 'main', 'i18n', 'locales');
  
  // 确保目标目录存在
  if (!existsSync(targetLocalesDir)) {
    mkdirSync(targetLocalesDir, { recursive: true });
  }
  
  // 复制所文件夹内所有文件
  const files = readdirSync(sourceLocalesDir);
  files.forEach(file => {
    const sourceFile = join(sourceLocalesDir, file);
    const targetFile = join(targetLocalesDir, file);
    copyFileSync(sourceFile, targetFile);
  });

  console.log('🎉 main构建流程完成！');
  
} catch (error) {
  console.error('❌ 构建过程中出现错误:', error.message);
  process.exit(1);
}
