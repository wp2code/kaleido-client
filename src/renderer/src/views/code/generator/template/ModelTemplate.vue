<script lang="ts" setup>
import { VoCodeView, EntityCodeView } from '@/api/code/types'
import ModelEntityTemplateView from './ModelEntityTemplateView.vue'
import ModelVoTemplateView from './ModelVoTemplateView.vue'
import { PropType } from 'vue'
import { SelectDataTableData } from '@/api/datasource/types'
import { CodeGenerationResult, JavaTypeInfo } from '@/api/code/types'
import { getJavaTypeList } from '@/api/code/index'
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
const javaTypeInfoList = ref<JavaTypeInfo[]>()
onMounted(async () => {
  await getJavaTypeList().then((res) => {
    javaTypeInfoList.value = res.data
  })
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
      entityCodeView.value.superclassName = code.superclassName
      entityCodeView.value.codeType = code.codeType
      entityCodeView.value.useLombok = code.useLombok
      entityCodeView.value.useSwagger = code.useSwagger
      entityCodeView.value.useMybatisPlus = code.useMybatisPlus
      entityCodeView.value.tableFieldColumnMap = code.tableFieldColumnMap
    }
    if (code.codeType === 'VO') {
      voCodeView.value.name = code.name
      voCodeView.value.codeOutPath = code.codeOutPath
      voCodeView.value.codePath = code.codePath
      voCodeView.value.packageName = code.packageName
      voCodeView.value.sourceFolder = code.sourceFolder
      voCodeView.value.templateCode = code.templateCode
      voCodeView.value.superclassName = code.superclassName
      voCodeView.value.codeType = code.codeType
      voCodeView.value.useLombok = code.useLombok
      voCodeView.value.useSwagger = code.useSwagger
      voCodeView.value.tableFieldColumnMap = code.tableFieldColumnMap
    }
  }
})
</script>
<template>
  <el-tabs class="template-tabs" tab-position="left">
    <el-tab-pane label="Entity">
      <ModelEntityTemplateView
        :data="entityCodeView"
        :table-data="props.tableData"
        :template-info="props.data.templateInfo"
        :java-type-info-list="javaTypeInfoList"
      ></ModelEntityTemplateView>
    </el-tab-pane>
    <el-tab-pane label="VO">
      <ModelVoTemplateView
        :data="voCodeView"
        :table-data="props.tableData"
        :template-info="props.data.templateInfo"
        :java-type-info-list="javaTypeInfoList"
        :show-mybatis-puls="false"
      ></ModelVoTemplateView>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped></style>
