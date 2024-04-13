<script lang="ts" setup>
import ServiceImplTemplateView from './ServiceImplTemplateView.vue'
import ServiceApiTemplateView from './ServiceApiTemplateView.vue'
import {
  CodeGenerationResult,
  ServiceCodeView,
  ServiceApiCodeView,
} from '@/api/code/types'
const props = defineProps({
  data: {
    type: Object as PropType<CodeGenerationResult>,
    default: {} as CodeGenerationResult,
  },
})
const serviceCodeView = ref<ServiceCodeView>(new ServiceCodeView())
const serviceApiCodeView = ref<ServiceApiCodeView>(new ServiceApiCodeView())
onMounted(() => {})
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
      serviceApiCodeView.value.supperInterfaceName = code.supperInterfaceName
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
      serviceCodeView.value.implInterface = code.implInterfaceName
    }
  }
})
</script>
<template>
  <el-tabs class="template-tabs" tab-position="left">
    <el-tab-pane label="ServiceApi">
      <ServiceApiTemplateView :data="serviceApiCodeView"></ServiceApiTemplateView>
    </el-tab-pane>
    <el-tab-pane label="ServiceImpl">
      <ServiceImplTemplateView :data="serviceCodeView"></ServiceImplTemplateView>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped></style>
