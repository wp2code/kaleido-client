<script lang="ts" setup>
import { CodeGenerationResult, XmlCodeView, MapperCodeView } from '@/api/code/types'
import MapperTemplateView from './MapperTemplateView.vue'
import MapperXmlTemplateView from './MapperXmlTemplateView.vue'
const props = defineProps({
  data: {
    type: Object as PropType<CodeGenerationResult>,
    default: {} as CodeGenerationResult,
  },
})
const xmlCodeView = ref<XmlCodeView>(new XmlCodeView())
const mapperCodeView = ref<MapperCodeView>(new MapperCodeView())
onMounted(() => {})
watchEffect(() => {
  const codeGenerationList = props.data!.codeGenerationList || []
  for (let code of codeGenerationList) {
    if (code.codeType === 'Mapper') {
      mapperCodeView.value.name = code.name
      mapperCodeView.value.codeOutPath = code.codeOutPath
      mapperCodeView.value.codePath = code.codePath
      mapperCodeView.value.packageName = code.packageName
      mapperCodeView.value.sourceFolder = code.sourceFolder
      mapperCodeView.value.templateCode = code.templateCode
      mapperCodeView.value.codeType = code.codeType
    }
    if (code.codeType === 'Xml') {
      xmlCodeView.value.name = code.name
      xmlCodeView.value.codeOutPath = code.codeOutPath
      xmlCodeView.value.codePath = code.codePath
      xmlCodeView.value.packageName = code.packageName
      xmlCodeView.value.sourceFolder = code.sourceFolder
      xmlCodeView.value.templateCode = code.templateCode
      xmlCodeView.value.codeType = code.codeType
    }
  }
})
</script>
<template>
  <el-tabs class="template-tabs" tab-position="left">
    <el-tab-pane label="Mapper">
      <MapperTemplateView :data="mapperCodeView"></MapperTemplateView>
    </el-tab-pane>
    <el-tab-pane label="Xml(SQL)">
      <MapperXmlTemplateView :data="xmlCodeView"></MapperXmlTemplateView>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped></style>
