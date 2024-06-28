<script lang="ts" setup>
import { CodeGenerationResult } from '@/api/code/types'
import MessageBox from '@/utils/MessageBox'
const props = defineProps({
  data: {
    type: Object as PropType<CodeGenerationResult>,
    required: true,
  },
})
const codeResultData = computed(() => {
  const result = props.data as CodeGenerationResult
  if (result.codeGenerationList) {
    const codeGenerationList = result.codeGenerationList
    return codeGenerationList.map((item) => {
      return {
        name: item.name,
        codePath: item.codePath,
        templateCode: item.templateCode,
        fileSuffix: item.fileSuffix,
      }
    })
  }
  return []
})
const copyClick = async (item) => {
  if (item.templateCode) {
    await window.winApi.copy(item.templateCode)
    MessageBox.ok('复制成功')
  }
}
const openDirPath = async (item) => {
  await window.winApi.openPath(item.codePath)
}
const openClick = async (item) => {
  await window.winApi.openPath(item.codePath + '\\' + item.name + '.' + item.fileSuffix)
}
</script>
<template>
  <el-divider>结果</el-divider>
  <el-table :data="codeResultData" border style="width: 100%">
    <el-table-column prop="name" label="代码名称" width="200" show-overflow-tooltip />
    <el-table-column prop="fileSuffix" label="文件后缀" width="100" />
    <el-table-column prop="codePath" label="代码地址" show-overflow-tooltip>
      <template #default="scope">
        <el-link type="success" @click="openDirPath(scope.row)">{{
          scope.row.codePath
        }}</el-link>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="copyClick(scope.row)">
          复制
        </el-button>
        <el-button link type="primary" size="small" @click="openClick(scope.row)">
          打开
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<style lang="scss" scoped></style>
