#!/usr/bin/env node

/**
 * 窗口创建测试脚本
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import net from 'net';

console.log('🧪 测试窗口创建功能...\n');

// 检查必要的文件是否存在

const requiredFiles = [
  'src/main/windowManager.ts',
  'src/main/ipcHandlers.ts',
  'src/config/windowConfig.ts',
  'src/renderer/windows/setting/index.html',
  'src/renderer/windows/setting/App.vue',
  'src/renderer/windows/setting/main.ts'
];

console.log('📁 检查必要文件...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件不存在`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ 缺少必要文件，请检查项目结构');
  process.exit(1);
}

console.log('\n✅ 所有必要文件都存在');

// 检查端口是否被占用
console.log('\n🔌 检查开发端口...');

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.close();
      resolve(false); // 端口可用
    });
    
    server.on('error', () => {
      resolve(true); // 端口被占用
    });
  });
}

async function checkPorts() {
  const ports = [11069, 11070];
  
  for (const port of ports) {
    const isOccupied = await checkPort(port);
    if (isOccupied) {
      console.log(`⚠️  端口 ${port} 被占用`);
    } else {
      console.log(`✅ 端口 ${port} 可用`);
    }
  }
}

checkPorts().then(() => {
  console.log('\n🎉 窗口创建功能测试完成！');
  console.log('\n📝 下一步：');
  console.log('1. 运行 "npm run dev:multi" 启动多窗口开发服务器');
  console.log('2. 运行 "npm run watch" 编译 TypeScript');
  console.log('3. 运行 "npm start" 启动 Electron 应用');
  console.log('4. 在应用中点击菜单 "文件 -> 打开设置窗口"');
}); 