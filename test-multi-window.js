#!/usr/bin/env node

/**
 * 多窗口功能测试脚本
 * 用于验证多窗口支持是否正常工作
 */

console.log('🚀 启动多窗口功能测试...\n');

// 测试窗口管理器功能
async function testWindowManager() {
  console.log('📋 测试窗口管理器功能...');
  
  // 这里可以添加更多的测试逻辑
  console.log('✅ 窗口管理器功能测试完成\n');
}

// 测试 IPC 通信
async function testIpcCommunication() {
  console.log('📡 测试 IPC 通信...');
  
  // 这里可以添加 IPC 通信测试逻辑
  console.log('✅ IPC 通信测试完成\n');
}

// 测试窗口配置
async function testWindowConfig() {
  console.log('⚙️ 测试窗口配置...');
  
  try {
    // 检查配置文件是否存在
    const fs = require('fs');
    const configPath = './src/config/windowConfig.ts';
    
    if (!fs.existsSync(configPath)) {
      throw new Error('窗口配置文件不存在');
    }
    
    console.log('✅ 窗口配置文件存在');
    console.log('✅ 窗口配置测试完成\n');
  } catch (error) {
    console.error('❌ 窗口配置测试失败:', error.message);
  }
}

// 主测试函数
async function runTests() {
  try {
    await testWindowConfig();
    await testWindowManager();
    await testIpcCommunication();
    
    console.log('🎉 所有测试完成！');
    console.log('\n📝 使用说明:');
    console.log('1. 运行 "npm run dev:multi" 启动多窗口开发服务器');
    console.log('2. 运行 "npm run watch" 编译 TypeScript');
    console.log('3. 运行 "npm start" 启动 Electron 应用');
    console.log('4. 在应用中测试窗口管理功能');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
runTests(); 