<script lang="ts" setup>
import { CodeGenerationResult, XmlCodeView, MapperCodeView } from '@/api/code/types'
import MapperTemplateView from './MapperTemplateView.vue'
import MapperXmlTemplateView from './MapperXmlTemplateView.vue'
import { SelectDataTableData } from '@/api/datasource/types'
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
const xmlCodeView = ref<XmlCodeView>(new XmlCodeView())
const mapperCodeView = ref<MapperCodeView>(new MapperCodeView())
watchEffect(() => {
  const codeGenerationList = props.data!.codeGenerationList || []
  for (let code of codeGenerationList) {
    if (code.codeType === 'Mapper') {
      mapperCodeView.value.name = code.name
      mapperCodeView.value.nameSuffix = code.nameSuffix
      mapperCodeView.value.codeOutPath = code.codeOutPath
      mapperCodeView.value.codePath = code.codePath
      mapperCodeView.value.packageName = code.packageName
      mapperCodeView.value.sourceFolder = code.sourceFolder
      mapperCodeView.value.templateCode = code.templateCode
      mapperCodeView.value.codeType = code.codeType
      mapperCodeView.value.superclassName = code.superclassName
      mapperCodeView.value.useMybatisPlus = code.useMybatisPlus
    }
    if (code.codeType === 'Xml') {
      xmlCodeView.value.name = code.name
      mapperCodeView.value.nameSuffix = code.nameSuffix
      xmlCodeView.value.codeOutPath = code.codeOutPath
      xmlCodeView.value.codePath = code.codePath
      xmlCodeView.value.packageName = code.packageName
      xmlCodeView.value.sourceFolder = code.sourceFolder
      xmlCodeView.value.templateCode = code.templateCode
      xmlCodeView.value.codeType = code.codeType
      xmlCodeView.value.namespace = code.namespace
      xmlCodeView.value.useMybatisPlus = code.useMybatisPlus
    }
  }
})
</script>
<template>
  <el-tabs class="template-tabs" tab-position="left">
    <el-tab-pane label="Mapper">
      <MapperTemplateView
        :data="mapperCodeView"
        :table-data="props.tableData"
        :template-info="props.data.templateInfo"
      ></MapperTemplateView>
    </el-tab-pane>
    <el-tab-pane label="Xml(SQL)">
      <MapperXmlTemplateView
        :data="xmlCodeView"
        :table-data="props.tableData"
        :template-info="props.data.templateInfo"
      ></MapperXmlTemplateView>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped></style>
