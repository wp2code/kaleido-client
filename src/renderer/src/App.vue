<!-- @format -->

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import layout from '@/layout/index.vue'
const appStore = useAppStore()
</script>
<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <layout />
  </el-config-provider>
</template>
