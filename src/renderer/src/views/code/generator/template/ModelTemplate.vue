<script lang="ts" setup>
import { CodeTemplate, ModelFieldMap, CodeTemplateConfig } from '@/api/code/types'
import ModeTemplateView from './ModeTemplateView.vue'
const props = defineProps({
  data: {
    type: Object as PropType<CodeTemplate>,
    default: {} as CodeTemplate,
  },
})
const entityTemplateConfig = ref<CodeTemplateConfig>()
const voTemplateConfig = ref<CodeTemplateConfig>()
const voFieldMap = ref<ModelFieldMap[]>([])
const entityFieldMap = ref<ModelFieldMap[]>([])
onMounted(() => {
  //TODO
  entityFieldMap.value = []
  voFieldMap.value = []
})
watchEffect(() => {
  const codeTemplateConfigs = props.data!.templateConfigList || []
  for (let config of codeTemplateConfigs) {
    if (config.name === 'ModelVo') {
      voTemplateConfig.value = config
    }
    if (config.name === 'ModelEntity') {
      entityTemplateConfig.value = config
    }
  }
})
</script>
<template>
  <el-tabs class="template-tabs" tab-position="left">
    <el-tab-pane label="Entity">
      <ModeTemplateView
        :config="entityTemplateConfig"
        :model-fields="entityFieldMap"
      ></ModeTemplateView>
    </el-tab-pane>
    <el-tab-pane label="VO">
      <ModeTemplateView
        :config="voTemplateConfig"
        :model-fields="voFieldMap"
        :show-mybatis-puls="false"
      ></ModeTemplateView>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped></style>
