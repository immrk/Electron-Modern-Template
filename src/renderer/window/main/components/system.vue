<template>
  <div class="system-container">
    <el-alert title="该页面信息来源于主进程，通过 preload 文件暴露给渲染进程，作为主进程与渲染进程通信样例" type="primary" :closable="false" />
    <el-card shadow="never">
      <el-descriptions title="系统信息" :column="1" border>
        <el-descriptions-item label="Node.js 版本">
          {{ info.node || "加载中..." }}
        </el-descriptions-item>
        <el-descriptions-item label="Chrome 版本">
          {{ info.chrome || "加载中..." }}
        </el-descriptions-item>
        <el-descriptions-item label="Electron 版本">
          {{ info.electron || "加载中..." }}
        </el-descriptions-item>
        <el-descriptions-item label="Ping 结果">
          <template #default>
            <span>{{ info.ping || "暂未测试" }}</span>
            <el-button size="small" class="ml-2" @click="refreshPing"
              >Ping</el-button
            >
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

interface VersionsInfo {
  node: string;
  chrome: string;
  electron: string;
  ping: string;
}

const info = ref<VersionsInfo>({
  node: "",
  chrome: "",
  electron: "",
  ping: "",
});

const versionsAPI = (window as any).versions;

const loadVersions = () => {
  if (!versionsAPI) return;
  info.value.node = versionsAPI.node();
  info.value.chrome = versionsAPI.chrome();
  info.value.electron = versionsAPI.electron();
};

const refreshPing = async () => {
  if (!versionsAPI || !versionsAPI.ping) return;
  try {
    const result = await versionsAPI.ping();
    info.value.ping = result;
    ElMessage.success(`Ping 成功: ${result}`);
  } catch (error) {
    ElMessage.error("Ping 失败");
  }
};

onMounted(() => {
  loadVersions();
});
</script>

<style scoped>
.system-container {
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
