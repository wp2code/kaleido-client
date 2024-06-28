<script lang="ts" setup>
import { CodeGenerationResult, PartitionTempate, WebCodeView } from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
import { previewCode } from '@/api/code/index'
import { buildCodeParamsWithCodeView } from '@/utils/codeUtil'
import { useGenCodeParamStore } from '@/store/modules/cache'
import CodeTemplateEdit from './CodeTemplateEdit.vue'
import { TriggerWatch } from '../../keys'
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
const templateEditVisible = ref(false)
const canTriggerWatch = inject(TriggerWatch) as Ref
const useGenCodeParam = useGenCodeParamStore()
const webCodeView = ref<WebCodeView>(new WebCodeView())
const templateId = ref('')
const editTemlateSuccess = (template: PartitionTempate) => {
  webCodeView.value = Object.assign(webCodeView.value, {
    ...template,
    name: webCodeView.value.name,
  })
}
watchEffect(() => {
  templateId.value = props.data.templateInfo ? props.data.templateInfo!.id : ''
  const codeGenerationList = props.data!.codeGenerationList || []
  for (let code of codeGenerationList) {
    if (code.codeType === 'Controller') {
      webCodeView.value.name = code.name
      webCodeView.value.codeOutPath = code.codeOutPath
      webCodeView.value.codePath = code.codePath
      webCodeView.value.packageName = code.packageName
      webCodeView.value.sourceFolder = code.sourceFolder
      webCodeView.value.templateCode = code.templateCode
      webCodeView.value.useSwagger = code.useSwagger
      webCodeView.value.codeType = code.codeType
      webCodeView.value.useMybatisPlus = code.useMybatisPlus
      webCodeView.value.superclassName = code.superclassName
      break
    }
  }
})
watch(
  [
    () => webCodeView.value.name,
    () => webCodeView.value.useSwagger,
    () => webCodeView.value.useMybatisPlus,
    () => webCodeView.value.superclassName,
    () => webCodeView.value.packageName,
  ],
  (_nv, _ov) => {
    if (canTriggerWatch!.value == true && _nv !== _ov && _ov[0] != undefined) {
      refreshGenCode(false)
    }
  }
)
const refreshGenCode = (directUseTemplateConfig: boolean) => {
  const serviceApiCodeParam = useGenCodeParam.getCodeParamCache('ServiceApi')
  const voCodeParam = useGenCodeParam.getCodeParamCache('VO')
  const p = buildCodeParamsWithCodeView([webCodeView.value], props.tableData)
  if (serviceApiCodeParam) {
    p.push(serviceApiCodeParam)
  }
  if (voCodeParam) {
    p.push(voCodeParam)
  }
  previewCode(
    props.data!.templateInfo?.id,
    props.tableData.dataSource?.id,
    directUseTemplateConfig,
    p,
    ['Controller']
  ).then((res) => {
    if (res.data.codeGenerationList) {
      WebCodeView.replace(res.data.codeGenerationList[0], webCodeView.value)
    }
  })
}
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    webCodeView.value.codePath = filePath
  }
}
const toEditTemplate = () => {
  templateEditVisible.value = true
}
</script>
<template>
  <div class="modelBox">
    <div class="left">
      <div style="text-align: right">
        <el-link type="primary" @click="toEditTemplate()">编辑模板</el-link>
        <CodeTemplateEdit
          v-if="templateEditVisible"
          v-model:visible="templateEditVisible"
          :template-id="templateId"
          title="Controller模板"
          type="Controller"
          @success="editTemlateSuccess"
        ></CodeTemplateEdit>
      </div>
      <div>
        <div>类名称:</div>
        <div><el-input v-model="webCodeView!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="webCodeView!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="webCodeView!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="webCodeView!.superclassName" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-tooltip
            :content="webCodeView!.codePath"
            :disabled="
              webCodeView.codePath == undefined || webCodeView.codePath.trim().length <= 0
            "
            placement="bottom"
          >
            <el-input v-model="webCodeView!.codePath">
              <template #append>
                <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
              </template>
            </el-input>
          </el-tooltip>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="webCodeView!.useSwagger">Swagger</el-checkbox>
          <el-checkbox v-model="webCodeView!.useMybatisPlus">Mybatis-puls</el-checkbox>
        </div>
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="webCodeView.templateCode" dark></Codeview>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$width: 250px;
.modelBox {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  // max-width: 70vw;
  // max-height: 50vw;
  // background-color: red;

  .left {
    padding: 1vh;
    width: $width;
    div {
      padding: 0.1rem;
    }
  }
  .right {
    width: 150px;
    // padding: 1vh;
    flex-grow: 1;
  }
  // .fieldDiv {
  //   max-width: 70vw;
  //   padding: 0.1rem;
  // }
}
</style>
