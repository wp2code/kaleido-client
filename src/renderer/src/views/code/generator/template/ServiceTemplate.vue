<script lang="ts" setup>
import ServiceImplTemplateView from './ServiceImplTemplateView.vue'
import ServiceApiTemplateView from './ServiceApiTemplateView.vue'
import { SelectDataTableData } from '@/api/datasource/types'
import {
  CodeGenerationResult,
  ServiceCodeView,
  ServiceApiCodeView,
} from '@/api/code/types'
import { TabsPaneContext } from 'element-plus'
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
const serviceCodeView = ref<ServiceCodeView>(new ServiceCodeView())
const serviceApiCodeView = ref<ServiceApiCodeView>(new ServiceApiCodeView())
watchEffect(() => {
  const codeGenerationList = props.data!.codeGenerationList || []
  for (let code of codeGenerationList) {
    if (code.codeType === 'ServiceApi') {
      serviceApiCodeView.value.name = code.name
      serviceApiCodeView.value.codeOutPath = code.codeOutPath
      serviceApiCodeView.value.codePath = code.codePath
      serviceApiCodeView.value.packageName = code.packageName
      serviceApiCodeView.value.sourceFolder = code.sourceFolder
      serviceApiCodeView.value.templateCode = code.templateCode
      serviceApiCodeView.value.codeType = code.codeType
      serviceApiCodeView.value.useMybatisPlus = code.useMybatisPlus
      serviceApiCodeView.value.superclassName = code.superclassName
    }
    if (code.codeType === 'Service') {
      serviceCodeView.value.name = code.name
      serviceCodeView.value.codeOutPath = code.codeOutPath
      serviceCodeView.value.codePath = code.codePath
      serviceCodeView.value.packageName = code.packageName
      serviceCodeView.value.sourceFolder = code.sourceFolder
      serviceCodeView.value.templateCode = code.templateCode
      serviceCodeView.value.codeType = code.codeType
      serviceCodeView.value.useMybatisPlus = code.useMybatisPlus
      serviceCodeView.value.superclassName = code.superclassName
      serviceCodeView.value.implInterfaceName = code.implInterfaceName
    }
  }
})
const serviceImplKey = ref('1')
const handleClick = (pane: TabsPaneContext, _ev: Event) => {
  if (pane.props.label == 'ServiceImpl') {
    serviceImplKey.value = Math.random() + ''
  }
}
</script>
<template>
  <el-tabs class="template-tabs" tab-position="left" @tab-click="handleClick">
    <el-tab-pane label="ServiceApi">
      <ServiceApiTemplateView
        :data="serviceApiCodeView"
        :table-data="props.tableData"
        :template-info="props.data.templateInfo"
      ></ServiceApiTemplateView>
    </el-tab-pane>
    <el-tab-pane label="ServiceImpl">
      <ServiceImplTemplateView
        :data="serviceCodeView"
        :table-data="props.tableData"
        :template-info="props.data.templateInfo"
        :key-value="serviceImplKey"
      ></ServiceImplTemplateView>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped></style>
