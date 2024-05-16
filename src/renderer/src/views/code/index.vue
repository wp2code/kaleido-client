<script lang="ts" setup>
import { DbConfig } from '~/repositories/entity/DbConfig'
import DbConnectionPanel from './db/DbConnectionPanel.vue'
import DbPanel from './db/DbPanel.vue'
import DbTablePanel from './db/DbTablePanel.vue'
import Generator from './generator/index.vue'
import DbConnectionBox from '@/views/code/db/DbConnectionBox.vue'
import { useGenCodeParamStore } from '@/store/modules/cache'
import { DataSource, Table, SelectDataTableData } from '@/api/datasource/types'
import {
  SelectDbable,
  RefreshConnectList,
  EditConnectData,
  CancelConnectOps,
} from './keys'
const componentName = ref()
const componentParams = ref()
const componentKey = ref()
const dbTablePanelKey = ref()
const selectDbTableData = ref<SelectDataTableData>(new SelectDataTableData(null, null))
const selectDbConfigData = ref<DbConfig>()
const useGenCodeParam = useGenCodeParamStore()
//新增连接
const toAddConnect = () => {
  componentName.value = DbPanel
  componentKey.value = 'CN_' + new Date()
}
//编辑连接
const selectDbConfig = (item: any, isEdit: boolean) => {
  if (isEdit) {
    componentKey.value = 'CF_' + new Date()
    componentName.value = DbConnectionBox
    componentParams.value = item
  } else {
    dbTablePanelKey.value = item?.id
    selectDbConfigData.value = item
  }
}
//选择数据库表
const selectDbTable = (table: Table, dataSource: DataSource) => {
  componentKey.value = 'TB_' + new Date()
  componentName.value = Generator
  selectDbTableData.value = new SelectDataTableData(dataSource, table)
}
//选择数据库表
provide(SelectDbable, selectDbTableData)
const dbConnectionPanelRef = ref<InstanceType<typeof DbConnectionPanel>>()
//刷新连接列表
provide(RefreshConnectList, (params: any | undefined) => {
  dbConnectionPanelRef.value.queryList(params)
})
//编辑连接-取消
provide(CancelConnectOps, () => {
  toAddConnect()
})
//编辑连接
provide(EditConnectData, componentParams)
onBeforeUnmount(() => {
  useGenCodeParam.clearCodeParamCache()
})
</script>
<template>
  <drag-layout init-size="30%">
    <template #first>
      <box-layout layout="coloum" size="40%">
        <template #first>
          <DbConnectionPanel ref="dbConnectionPanelRef" @select="selectDbConfig" />
        </template>
        <DbTablePanel
          :key="dbTablePanelKey"
          :data="selectDbConfigData"
          @select="selectDbTable"
        />
        <div class="bm-btn">
          <el-button type="primary" @click="toAddConnect()">
            <svg-icon
              icon-name="stars"
              style="width: 2em; height: 2em; margin-right: 0.1em"
            />
            新增连接
          </el-button>
        </div>
      </box-layout>
    </template>
    <keep-alive>
      <component :is="componentName" :key="componentKey"></component>
    </keep-alive>
  </drag-layout>
</template>

<style lang="scss" scoped>
.bm-btn {
  width: 100%;
  position: absolute;
  text-align: center;
  bottom: 10px;
  pointer-events: none;
  .el-button {
    pointer-events: all;
  }
}
</style>
