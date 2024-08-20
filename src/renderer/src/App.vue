<!-- @format -->

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import layout from '@/layout/index.vue'
const appStore = useAppStore()
onMounted(async () => {
  const timer = setTimeout(() => {
    window.initApi.stopLoading('>>>timer out<<<')
  }, 2000)
  window.initApi.startServerForSpawn().then((_res) => {
    clearTimeout(timer)
    window.initApi.stopLoading(_res)
  })
  // 桌面端的服务器地址
  const desktopServiceUrl = import.meta.env.RD_VITE_API_HOST
  window._BaseURL = desktopServiceUrl
  window.winApi?.setBaseURL?.(window._BaseURL)
})
</script>
<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <layout />
  </el-config-provider>
</template>
