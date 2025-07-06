<template>
  <div class="system-container">
    <el-alert :title="$t('main.system.alert')" type="primary" :closable="false" />
    <el-card shadow="never">
      <el-descriptions :title="$t('main.system.title')" :column="1" border>
        <el-descriptions-item :label="$t('main.system.nodeVersion')">
          {{ info.node || $t('main.system.loading') }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('main.system.chromeVersion')">
          {{ info.chrome || $t('main.system.loading') }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('main.system.electronVersion')">
          {{ info.electron || $t('main.system.loading') }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('main.system.pingResult')">
          <template #default>
            <span>{{ info.ping || $t('main.system.notTested') }}</span>
            <el-button size="small" class="ml-2" @click="refreshPing"
              >{{ $t('main.system.ping') }}</el-button
            >
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";

const { t } = useI18n();

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
    ElMessage.success(t('main.system.pingSuccess', { result }));
  } catch (error) {
    ElMessage.error(t('main.system.pingFailed'));
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
