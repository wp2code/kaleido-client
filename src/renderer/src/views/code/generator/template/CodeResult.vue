<script lang="ts" setup>
import { CodeGenerationResult } from '@/api/code/types'
import MessageBox from '@/utils/MessageBox'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
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
        codeType: item.codeType,
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
    MessageBox.ok(t('copy-success'))
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
  <el-table :data="codeResultData" border style="width: 100%">
    <el-table-column prop="codeType" :label="$t('code.model')" width="100" fixed="left">
      <template #default="scope">
        <el-tag effect="dark">{{ scope.row.codeType }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      :label="$t('code.name')"
      width="200"
      show-overflow-tooltip
    />
    <el-table-column prop="fileSuffix" :label="$t('file-suffix')" width="100" />
    <el-table-column prop="codePath" :label="$t('code.path')" show-overflow-tooltip>
      <template #default="scope">
        <el-link type="success" @click="openDirPath(scope.row)">{{
          scope.row.codePath
        }}</el-link>
      </template>
    </el-table-column>
    <el-table-column fixed="right" :label="$t('option')" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="copyClick(scope.row)">
          {{ $t('copy') }}
        </el-button>
        <el-button link type="primary" size="small" @click="openClick(scope.row)">
          {{ $t('open') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<style lang="scss" scoped></style>
