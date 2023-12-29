<script lang="ts" setup>
import { CodeTemplate, CodeTemplateConfig } from '@/api/code/types'
import MapperTemplateView from './MapperTemplateView.vue'
import MapperXmlTemplateView from './MapperXmlTemplateView.vue'
const props = defineProps({
  data: {
    type: Object as PropType<CodeTemplate>,
    default: {} as CodeTemplate,
  },
})
const mapperTemplateConfig = ref<CodeTemplateConfig>()
const XmlTemplateConfig = ref<CodeTemplateConfig>()
onMounted(() => {})
watchEffect(() => {
  const codeTemplateConfigs = props.data!.templateConfigList || []
  for (let config of codeTemplateConfigs) {
    if (config.name === 'Mapper') {
      mapperTemplateConfig.value = config
    }
    if (config.name === 'Xml') {
      XmlTemplateConfig.value = config
    }
  }
})
</script>
<template>
  <el-tabs class="template-tabs" tab-position="left">
    <el-tab-pane label="Mapper">
      <MapperTemplateView :config="mapperTemplateConfig"></MapperTemplateView>
    </el-tab-pane>
    <el-tab-pane label="Xml(SQL)">
      <MapperXmlTemplateView :config="XmlTemplateConfig"></MapperXmlTemplateView>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped></style>
