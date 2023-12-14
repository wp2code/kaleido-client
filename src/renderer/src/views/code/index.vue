<script lang="ts" setup>
import { DbConfig } from '~/repositories/entity/DbConfig'
import DbConnectionPanel from './db/DbConnectionPanel.vue'
import DbPanel from './db/DbPanel.vue'
import DbTablePanel from './db/DbTablePanel.vue'
import Generator from './generator/index.vue'
import DbConnectionBox from '@/views/code/db/DbConnectionBox.vue'
const componentName = ref(Generator)
const componentParams = ref()
const componentKey = ref()
const selectDbConfigData = ref<DbConfig>()
//新增连接
const toAddConnect = () => {
  componentName.value = DbPanel
  componentKey.value = new Date()
}
//编辑连接
const selectDbConfig = (item: any, isEdit: Boolean) => {
  if (isEdit) {
    componentKey.value = new Date()
    componentName.value = DbConnectionBox
    componentParams.value = item
  } else {
    console.log('selectDbConfig', item)
    //显示数据库
    selectDbConfigData.value = { ...item }
  }
}
const dbConnectionPanelRef = ref<InstanceType<typeof DbConnectionPanel>>()
//刷新连接列表
provide('Refresh-Connect-List', (params: any | undefined) => {
  console.log('Refresh-Connect-List', params)
  dbConnectionPanelRef.value.queryList(params)
})
//编辑连接-取消
provide('Cancel-Connect-Ops', () => {
  toAddConnect()
})
//编辑连接
provide('Edit-Connect-Data', componentParams)
</script>
<template>
  <drag-layout init-size="30%">
    <template #first>
      <box-layout layout="coloum" size="40%">
        <template #first>
          <DbConnectionPanel ref="dbConnectionPanelRef" @select="selectDbConfig" />
        </template>
        <DbTablePanel :data="selectDbConfigData" />
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
}
</style>
