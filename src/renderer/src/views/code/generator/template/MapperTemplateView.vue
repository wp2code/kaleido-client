<script lang="ts" setup>
import { MapperCodeView, CodeTemplate, PartitionTempate } from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
import { previewCode } from '@/api/code/index'
import { buildCodeParamsWithCodeView, initBuildMapperCodeParams } from '@/utils/codeUtil'
import { useGenCodeParamStore } from '@/store/modules/cache'
import CodeTemplateEdit from './CodeTemplateEdit.vue'
import { TriggerWatch } from '../../keys'
import { debounce } from 'lodash-es'
const props = defineProps({
  data: {
    type: Object as PropType<MapperCodeView>,
    default: {} as MapperCodeView,
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
const methodVisible = ref(false)
const mapperCodeView = ref<MapperCodeView>()
const templateEditVisible = ref(false)
const useGenCodeParam = useGenCodeParamStore()
const templateId = ref('')
const checkAllCodePrams = ref(true)
const isIndeterminate = ref(true)
const apis = initBuildMapperCodeParams()
const initMethodList = ref([])
const methodList = ref([])
const handleCheckedAllCodeParamChange = (val: boolean) => {
  let checked = apis.map((item) => {
    return item
  })
  console.log('handleCheckedAllCodeParamChange', checked)
  methodList.value = val ? checked : []
  isIndeterminate.value = false
}
function checkBoxStatusChange(_value: string[]) {
  const checkedCount = _value.length
  checkAllCodePrams.value = checkedCount === apis.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < apis.length
}
const handleCheckedCodeParamChange = (_value: string[]) => {
  methodList.value = _value
  checkBoxStatusChange(_value)
}
const { stop } = watchEffect(() => {
  if (props.templateInfo) {
    const tpConfig = props.templateInfo!.templateConfigList.filter(
      (config) => config.name == 'Mapper'
    )[0]
    const methods = tpConfig.templateParams?.methodList || []
    initMethodList.value = methods
    methodList.value = methods
    templateId.value = props.templateInfo!.id
    isIndeterminate.value = initMethodList.value.length != apis.length
    if (methods.length == apis.length) {
      checkAllCodePrams.value = true
    }
  }
  mapperCodeView.value = props.data
  templateId.value = props.templateInfo ? props.templateInfo!.id : ''
})
watch(
  [
    () => mapperCodeView.value.name,
    () => mapperCodeView.value.nameSuffix,
    () => mapperCodeView.value.useMybatisPlus,
    () => mapperCodeView.value.superclassName,
    () => mapperCodeView.value.sourceFolder,
    () => mapperCodeView.value.codePath,
    () => mapperCodeView.value.codeOutPath,
    () => mapperCodeView.value.packageName,
    () => mapperCodeView.value.methodList,
  ],
  (_nv, _ov) => {
    if (canTriggerWatch!.value == true && _nv !== _ov && _ov[0] != undefined) {
      refreshGenCode(false)
    }
  }
)
const editTemlateSuccess = (template: PartitionTempate) => {
  mapperCodeView.value = Object.assign(mapperCodeView.value, {
    ...template,
    name: mapperCodeView.value.name,
  })
  mapperCodeView.value.name = null
  initMethodList.value = template.methodList
  methodList.value = initMethodList.value
  checkBoxStatusChange(methodList.value)
  stop()
}
const refreshGenCode = debounce((directUseTemplateConfig: boolean) => {
  const entityCodeParam = useGenCodeParam.getCodeParamCache('Entity')
  const p = buildCodeParamsWithCodeView([mapperCodeView.value], props.tableData)
  if (entityCodeParam) {
    p.push(entityCodeParam)
  }
  previewCode(
    props.templateInfo.id,
    props.tableData.dataSource?.id,
    directUseTemplateConfig,
    p,
    ['Mapper']
  ).then((res) => {
    if (res.data.codeGenerationList) {
      MapperCodeView.replace(res.data.codeGenerationList[0], mapperCodeView.value)
    }
  })
}, 300)
const clickMethod = () => {
  methodVisible.value = true
}
const clickReset = () => {
  methodList.value = initMethodList.value
  checkBoxStatusChange(initMethodList.value)
}
const clickCancel = () => {
  methodVisible.value = false
}
const clickConfirm = () => {
  mapperCodeView.value.methodList = methodList.value
}
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDirDialog()
  if (filePath) {
    mapperCodeView.value.codePath = filePath
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
          title="Mapper模板"
          type="Mapper"
          @success="editTemlateSuccess"
        ></CodeTemplateEdit>
      </div>
      <div>
        <div>类名称:</div>
        <div><el-input v-model="mapperCodeView!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="mapperCodeView!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="mapperCodeView!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="mapperCodeView!.superclassName" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-tooltip
            :content="mapperCodeView!.codePath"
            :disabled="
              mapperCodeView.codePath == undefined ||
              mapperCodeView.codePath.trim().length <= 0
            "
            placement="bottom"
          >
            <el-input v-model="mapperCodeView!.codePath">
              <template #append>
                <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
              </template>
            </el-input>
          </el-tooltip>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="mapperCodeView.useMybatisPlus">Mybatis-puls</el-checkbox>
        </div>
      </div>
      <div>
        <el-link
          v-show="mapperCodeView.useMybatisPlus == false"
          type="primary"
          @click="clickMethod()"
          >生成方法</el-link
        >
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="mapperCodeView.templateCode" dark></Codeview>
    </div>
  </div>
  <el-dialog
    v-model="methodVisible"
    title="Mapper方法"
    draggable
    width="80%"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-checkbox
      v-model="checkAllCodePrams"
      :indeterminate="isIndeterminate"
      @change="handleCheckedAllCodeParamChange"
    >
      全选
    </el-checkbox>
    <el-checkbox-group v-model="methodList" @change="handleCheckedCodeParamChange">
      <div class="method-list">
        <el-checkbox v-for="item in apis" :key="item" :label="item" :value="item">
          {{ item }}
        </el-checkbox>
      </div>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="clickCancel()">取消</el-button>
        <el-button @click="clickReset()">重置</el-button>
        <el-button type="primary" @click="clickConfirm()"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
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
