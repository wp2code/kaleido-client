<script lang="ts" setup>
import { ServiceApiCodeView, CodeTemplate, PartitionTempate } from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
import { previewCode } from '@/api/code/index'
import { buildCodeParamsWithCodeView } from '@/utils/codeUtil'
import { useGenCodeParamStore } from '@/store/modules/cache'
import CodeTemplateEdit from './CodeTemplateEdit.vue'
import { TriggerWatch } from '../../keys'
import { debounce } from 'lodash-es'
const props = defineProps({
  data: {
    type: Object as PropType<ServiceApiCodeView>,
    default: {} as ServiceApiCodeView,
  },
  templateInfo: {
    type: Object as PropType<CodeTemplate>,
    required: true,
  },
  tableData: {
    type: Object as PropType<SelectDataTableData>,
    required: true,
  },
})
const canTriggerWatch = inject(TriggerWatch) as Ref
const serviceApiCodeView = ref<ServiceApiCodeView>()
const templateEditVisible = ref(false)
const templateId = ref('')
const useGenCodeParam = useGenCodeParamStore()
const editTemlateSuccess = (template: PartitionTempate) => {
  serviceApiCodeView.value = Object.assign(serviceApiCodeView.value, {
    ...template,
    name: serviceApiCodeView.value.name,
  })
  serviceApiCodeView.value.name = null
}
watchEffect(() => {
  serviceApiCodeView.value = props.data
  templateId.value = props.templateInfo ? props.templateInfo!.id : ''
})
watch(
  [
    () => serviceApiCodeView.value.name,
    () => serviceApiCodeView.value.nameSuffix,
    () => serviceApiCodeView.value.useMybatisPlus,
    () => serviceApiCodeView.value.superclassName,
    () => serviceApiCodeView.value.sourceFolder,
    () => serviceApiCodeView.value.codeOutPath,
    () => serviceApiCodeView.value.packageName,
  ],
  (_nv, _ov) => {
    if (canTriggerWatch!.value == true && _nv !== _ov && _ov[0] != undefined) {
      refreshGenCode(false)
    }
  }
)
const refreshGenCode = debounce((directUseTemplateConfig: boolean) => {
  const p = buildCodeParamsWithCodeView([serviceApiCodeView.value], props.tableData)
  if (serviceApiCodeView.value.useMybatisPlus == true) {
    const entityCodeParam = useGenCodeParam.getCodeParamCache('Entity')
    if (entityCodeParam) {
      p.push(entityCodeParam)
    }
  }
  previewCode(
    props.templateInfo.id,
    props.tableData.dataSource?.id,
    directUseTemplateConfig,
    p,
    ['ServiceApi']
  ).then((res) => {
    if (res.data.codeGenerationList) {
      ServiceApiCodeView.replace(res.data.codeGenerationList[0], serviceApiCodeView.value)
    }
  })
}, 300)
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDirDialog()
  if (filePath) {
    serviceApiCodeView.value.codePath = filePath
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
          v-model:is-show="templateEditVisible"
          :template-id="templateId"
          title="ServiceApi模板"
          type="ServiceApi"
          @success="editTemlateSuccess"
        ></CodeTemplateEdit>
      </div>
      <div>
        <div>类名称:</div>
        <div><el-input v-model="serviceApiCodeView!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="serviceApiCodeView!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="serviceApiCodeView!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="serviceApiCodeView!.superclassName" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-tooltip
            :content="serviceApiCodeView!.codePath"
            :disabled="
              serviceApiCodeView.codePath == undefined ||
              serviceApiCodeView.codePath.trim().length <= 0
            "
            placement="bottom"
          >
            <el-input v-model="serviceApiCodeView!.codePath">
              <template #append>
                <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
              </template>
            </el-input>
          </el-tooltip>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="serviceApiCodeView!.useMybatisPlus"
            >Mybatis-puls</el-checkbox
          >
        </div>
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="serviceApiCodeView!.templateCode" dark></Codeview>
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
