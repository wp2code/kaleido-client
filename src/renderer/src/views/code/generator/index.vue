<script lang="ts" setup>
import { SelectDataTableData } from '@/api/datasource/types'
import { SelectDbable } from '../keys'

const selectDbTableData = inject(SelectDbable) as SelectDataTableData
</script>
<template>
  <box-layout layout="coloum" size="15%" :show-divider="false">
    <template #first>
      <div class="header">
        <div class="">{{ selectDbTableData.table.tableName }}</div>
        <div class="">{{ selectDbTableData.dataSource.name }}</div>
      </div>
    </template>
    <div class="conent">
      <el-tabs class="demo-tabs">
        <el-tab-pane label="基本配置">基本配置</el-tab-pane>
        <el-tab-pane label="Model层代码">Model层代码</el-tab-pane>
        <el-tab-pane label="Service层代码">Service层代码</el-tab-pane>
        <el-tab-pane label="Web层代码">Web层代码</el-tab-pane>
      </el-tabs>
    </div>
  </box-layout>
</template>

<style lang="scss" scoped>
.header {
  // background-color: red;
  width: 100%;
}
.conent {
  background-color: #fff;
  width: 100%;
  height: 100%;
}
:deep() {
  .demo-tabs {
    .el-tabs__content {
      padding: 32px;
      color: #6b778c;
      font-size: 32px;
      font-weight: 600;
      // background-color: red;
      height: 100%;
    }
  }

  .el-tabs--right .el-tabs__content,
  .el-tabs--left .el-tabs__content {
    height: 100%;
  }
}
</style>
