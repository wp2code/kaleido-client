<script lang="ts" setup>
import { VoCodeView, EntityCodeView } from '@/api/code/types'
import { getTableFieldColumnList } from '@/api/datasource/index'
import ModelEntityTemplateView from './ModelEntityTemplateView.vue'
import ModelVoTemplateView from './ModelVoTemplateView.vue'
import { PropType } from 'vue'
import { SelectDataTableData } from '@/api/datasource/types'
import { CodeGenerationResult } from '@/api/code/types'
const props = defineProps({
  data: {
    type: Object as PropType<CodeGenerationResult>,
    default: {} as CodeGenerationResult,
  },
  tableData: {
    type: Object as PropType<SelectDataTableData>,
    default: {} as SelectDataTableData,
  },
})
const voCodeView = ref<VoCodeView>(new VoCodeView())
const entityCodeView = ref<EntityCodeView>(new EntityCodeView())
onMounted(async () => {
  if (props.tableData) {
    await getTableFieldColumnList(
      props.tableData.dataSource.type,
      props.tableData.dataSource.id,
      props.tableData.table.dataBaseName,
      props.tableData.table.tableName,
      props.tableData.table.schemaName
    ).then((res) => {
      entityCodeView.value.tableFieldColumnMap = res.data
      voCodeView.value.tableFieldColumnMap = res.data
    })
  }
})
watchEffect(() => {
  const codeGenerationList = props.data!.codeGenerationList || []
  for (let code of codeGenerationList) {
    if (code.codeType === 'Entity') {
      entityCodeView.value.name = code.name
      entityCodeView.value.codeOutPath = code.codeOutPath
      entityCodeView.value.codePath = code.codePath
      entityCodeView.value.packageName = code.packageName
      entityCodeView.value.sourceFolder = code.sourceFolder
      entityCodeView.value.templateCode = code.templateCode
      entityCodeView.value.codeType = code.codeType
    }
    if (code.codeType === 'VO') {
      voCodeView.value.name = code.name
      voCodeView.value.codeOutPath = code.codeOutPath
      voCodeView.value.codePath = code.codePath
      voCodeView.value.packageName = code.packageName
      voCodeView.value.sourceFolder = code.sourceFolder
      voCodeView.value.templateCode = code.templateCode
      voCodeView.value.codeType = code.codeType
    }
  }
})
</script>
<template>
  <el-tabs class="template-tabs" tab-position="left">
    <el-tab-pane label="Entity">
      <ModelEntityTemplateView :data="entityCodeView"></ModelEntityTemplateView>
    </el-tab-pane>
    <el-tab-pane label="VO">
      <ModelVoTemplateView
        :data="voCodeView"
        :show-mybatis-puls="false"
      ></ModelVoTemplateView>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped></style>
